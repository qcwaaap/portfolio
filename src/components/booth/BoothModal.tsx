'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getLenis } from '@/components/smooth/lenisStore';
import { LOCALE_LABELS } from '@/i18n/config';
import { useLocale } from '@/i18n/LocaleProvider';
import { sound } from '@/lib/sound/engine';
import { detectFaces, loadFaceTracker } from './faceTracker';
import { MASKS, smoothFace, type Face, type MaskId } from './masks';
import { FILTERS, H, W, canFilter, drawScene, facesFrom, staticFace, type FilterId } from './render';
import { LAYOUTS, PAPERS, composeStrip, swatch, toBlob, type LayoutId, type PaperId } from './strip';
import styles from './Booth.module.css';

const SHOTS = 4;
/** Текст ошибки + признаки, по которым понятно, почему не стартовал трекинг (например, нет WebGL2). */
function describe(e: unknown) {
  // при блокировке сети загрузка скрипта/модели падает событием, а не ошибкой
  const msg = e instanceof Error ? e.message : e instanceof Event ? 'could not download the face model (network, VPN or ad blocker?)' : String(e);
  let gl = 'no';
  try {
    gl = document.createElement('canvas').getContext('webgl2') ? 'yes' : 'no';
  } catch {}
  return `${msg} [webgl2: ${gl}]`;
}

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

type Cam = 'asking' | 'ready' | 'denied' | 'missing' | 'busy' | 'insecure';
type Phase = 'live' | 'shooting' | 'review';

export function BoothModal({ onClose }: { onClose: () => void }) {
  const { t: all, locale } = useLocale();
  const t = all.booth;

  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackerRef = useRef<Awaited<ReturnType<typeof loadFaceTracker>> | null>(null);
  const shotsRef = useRef<HTMLCanvasElement[]>([]);
  const alive = useRef(true);
  const stripUrl = useRef<string | null>(null);

  const [cam, setCam] = useState<Cam>('asking');
  const [tracker, setTracker] = useState<'loading' | 'ok' | 'failed'>('loading');
  const [trackerError, setTrackerError] = useState('');
  const [phase, setPhase] = useState<Phase>('live');
  const [count, setCount] = useState<number | null>(null);
  const [shotIdx, setShotIdx] = useState(0);
  const [flash, setFlash] = useState(0);
  const [faceSeen, setFaceSeen] = useState(true);
  const [masks, setMasks] = useState<ReadonlySet<MaskId>>(new Set(['dog']));
  const [filter, setFilter] = useState<FilterId>('color');
  const [paper, setPaper] = useState<PaperId>('white')
  const [layout, setLayout] = useState<LayoutId>('strip');
  const [strip, setStrip] = useState<{ url: string; blob: Blob } | null>(null);
  const [canShare, setCanShare] = useState(false);

  // то, что нужно рисующему циклу, читаем через ref: цикл живёт один раз
  const scene = useRef({ filter, masks, grain: null as HTMLImageElement | null });
  const phaseRef = useRef<Phase>('live');
  const failedRef = useRef(false);
  useEffect(() => {
    scene.current.filter = filter;
    scene.current.masks = masks;
  }, [filter, masks]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // ── блокируем скролл страницы, возвращаем фокус ──
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    getLenis()?.stop();
    document.documentElement.classList.add('is-modal');
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.documentElement.classList.remove('is-modal');
      getLenis()?.start();
      prev?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // ── камера ──
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    // камера работает только в защищённом контексте: https или localhost (по http://192.168… браузер её не даст)
    if (!window.isSecureContext) {
      setCam('insecure');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCam('missing');
      return;
    }
    const open = (video: MediaTrackConstraints | true) => navigator.mediaDevices.getUserMedia({ video, audio: false });
    open({ facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } })
      // слишком строгие настройки — пробуем с любыми
      .catch((e: unknown) => (e instanceof DOMException && (e.name === 'OverconstrainedError' || e.name === 'NotFoundError') ? open(true) : Promise.reject(e)))
      .then(async (s) => {
        if (cancelled) return s.getTracks().forEach((tr) => tr.stop());
        stream = s;
        const v = videoRef.current;
        if (!v) return;
        v.srcObject = s;
        await v.play().catch(() => undefined);
        // ждём настоящий кадр: до него drawImage рисует чёрный прямоугольник
        if (v.readyState < 2 || !v.videoWidth) await new Promise<void>((r) => v.addEventListener('loadeddata', () => r(), { once: true }));
        if (cancelled) return;
        setCam('ready');
      })
      .catch((e: unknown) => {
        const name = e instanceof DOMException ? e.name : '';
        console.warn('[photo booth] camera error:', name, e);
        if (cancelled) return;
        setCam(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : name === 'NotReadableError' || name === 'AbortError' ? 'busy' : 'missing');
      });
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((tr) => tr.stop()); // лампочка камеры должна погаснуть
    };
  }, []);

  // ── модель лица грузится параллельно: без неё работают фильтры и бумага ──
  useEffect(() => {
    let off = false;
    loadFaceTracker()
      .then((tr) => {
        if (off) return;
        trackerRef.current = tr;
        setTracker('ok');
      })
      .catch((e: unknown) => {
        console.warn('[photo booth] face model error:', e);
        if (off) return;
        setTrackerError(describe(e));
        failedRef.current = true;
        setTracker('failed');
      });
    const grain = new Image();
    grain.src = '/textures/grain.png';
    scene.current.grain = grain;
    setCanShare(typeof navigator.canShare === 'function');
    return () => {
      off = true;
    };
  }, []);

  // ── рисующий цикл ──
  useEffect(() => {
    if (cam !== 'ready') return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!video || !canvas || !ctx) return;
    let raf = 0;
    let faces: Face[] = [];
    let lastDetect = 0;
    let seen = true;
    let failures = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || video.readyState < 2 || !video.videoWidth || phaseRef.current === 'review') return;
      const tr = trackerRef.current;
      if (failedRef.current && faces.length === 0) faces = [staticFace()];
      // у живого потока currentTime не везде меняется, поэтому ориентируемся только на время
      if (tr && now - lastDetect > 40) {
        lastDetect = now;
        try {
          const found = facesFrom(detectFaces(tr, video, now), video);
          faces = found.map((f, i) => smoothFace(faces[i], f));
          failures = 0;
        } catch (e) {
          faces = [];
          // несколько сбоев подряд — модель не работает: скажем об этом, а не будем молчать
          if (++failures === 1) console.warn('[photo booth] face detection error:', e);
          if (failures >= 5) {
            setTrackerError(describe(e));
            failedRef.current = true;
            trackerRef.current = null;
            setTracker('failed');
          }
        }
        const has = faces.length > 0;
        if (has !== seen) {
          seen = has;
          setFaceSeen(has);
        }
      }
      drawScene(ctx, video, faces, scene.current, (now - t0) / 1000);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [cam]);

  // ── полоска: пересобираем при смене бумаги ──
  const compose = useCallback(
    async (shots: HTMLCanvasElement[], p: PaperId, l: LayoutId) => {
      const date = new Date().toLocaleDateString(LOCALE_LABELS[locale].htmlLang, { day: 'numeric', month: 'long', year: 'numeric' });
      const c = await composeStrip(shots, p, l, t.caption, date);
      const blob = await toBlob(c);
      if (!blob || !alive.current) return;
      if (stripUrl.current) URL.revokeObjectURL(stripUrl.current);
      stripUrl.current = URL.createObjectURL(blob);
      setStrip({ url: stripUrl.current, blob });
    },
    [locale, t.caption],
  );

  useEffect(() => {
    if (phase === 'review' && shotsRef.current.length) void compose(shotsRef.current, paper, layout);
  }, [phase, paper, layout, compose]);

  useEffect(
    () => () => {
      if (stripUrl.current) URL.revokeObjectURL(stripUrl.current);
    },
    [],
  );

  const shoot = async () => {
    const canvas = canvasRef.current;
    if (!canvas || phase !== 'live') return;
    shotsRef.current = [];
    setStrip(null);
    setPhase('shooting');
    for (let i = 0; i < SHOTS; i++) {
      if (!alive.current) return;
      setShotIdx(i);
      for (let n = 3; n >= 1; n--) {
        setCount(n);
        sound.beep();
        await wait(850);
        if (!alive.current) return;
      }
      setCount(null);
      const snap = document.createElement('canvas');
      snap.width = W;
      snap.height = H;
      snap.getContext('2d')!.drawImage(canvas, 0, 0);
      shotsRef.current.push(snap);
      sound.shutter();
      setFlash((f) => f + 1);
      await wait(700);
    }
    if (alive.current) setPhase('review');
  };

  const retake = () => {
    shotsRef.current = [];
    if (stripUrl.current) URL.revokeObjectURL(stripUrl.current);
    stripUrl.current = null;
    setStrip(null);
    setPhase('live');
  };

  const save = () => {
    if (!strip) return;
    const a = document.createElement('a');
    a.href = strip.url;
    a.download = 'photo-booth.png';
    a.click();
  };

  const share = async () => {
    if (!strip) return;
    const file = new File([strip.blob], 'photo-booth.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file] }).catch(() => undefined);
  };

  const toggleMask = (id: MaskId) =>
    setMasks((old) => {
      const next = new Set(old);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  // ── Esc и ловушка фокуса ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      const items = rootRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!items?.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      const outside = !rootRef.current?.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const camMessage = { denied: t.denied, missing: t.noCamera, busy: t.busy, insecure: t.insecure, asking: null, ready: null }[cam];
  const busy = phase === 'shooting';

  return (
    <div ref={rootRef} className={styles.root} role="dialog" aria-modal="true" aria-label={t.aria}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.scroller} data-lenis-prevent="" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={styles.sheet}>
          <div className={`${styles.paper} paper-surface`} />
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
            {t.close} <span aria-hidden>✕</span>
          </button>

          <div className={styles.content}>
            {phase === 'review' && (
              <div className={styles.stripWrap}>
                {strip ? <img className={styles.stripImg} src={strip.url} alt={t.stripAlt} /> : <p className={styles.status}>{t.developing}</p>}
              </div>
            )}
            {/* сцена не размонтируется в просмотре: на ней висит видеопоток камеры */}
            <div className={`${styles.stage} ${phase === 'review' ? styles.hidden : ''}`}>
                <div className={styles.viewfinder}>
                  <video ref={videoRef} className={styles.video} playsInline muted aria-hidden />
                  <canvas ref={canvasRef} className={styles.canvas} width={W} height={H} role="img" aria-label={t.viewfinderAlt} />
                  {cam === 'asking' && <p className={styles.overlayMsg}>{t.askingCamera}</p>}
                  {camMessage && <p className={styles.overlayMsg}>{camMessage}</p>}
                  {tracker === 'failed' && !busy && (
                    <svg className={styles.guide} viewBox="0 0 100 138" aria-hidden>
                      <ellipse cx="50" cy="69" rx="47" ry="65" />
                    </svg>
                  )}
                  {cam === 'ready' && tracker === 'ok' && !faceSeen && !busy && <p className={styles.hint}>{t.noFace}</p>}
                  {count !== null && (
                    <div key={`${shotIdx}-${count}`} className={styles.count} aria-live="assertive">
                      {count}
                    </div>
                  )}
                  {flash > 0 && <div key={flash} className={styles.flash} aria-hidden />}
                  {busy && (
                    <p className={styles.progress}>
                      {t.shot.replace('{n}', String(shotIdx + 1)).replace('{total}', String(SHOTS))}
                    </p>
                  )}
                </div>
                {cam === 'ready' && tracker === 'loading' && <p className={styles.note}>{t.loadingModel}</p>}
                {tracker === 'failed' && (
                  <p className={styles.note}>
                    {t.noMasks}
                    {trackerError && <code className={styles.err}> {trackerError.slice(0, 140)}</code>}
                  </p>
                )}
            </div>

            <div className={styles.panel}>
              <h2 className={styles.title}>{t.aria}</h2>

              {phase !== 'review' && (
                <>
                  <fieldset className={styles.group} disabled={busy}>
                    <legend>{t.masksHead}</legend>
                    <div className={styles.chips}>
                      {MASKS.map((id) => (
                        <button key={id} type="button" className={styles.chip} aria-pressed={masks.has(id)} onClick={() => toggleMask(id)}>
                          {t.masks[id]}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {canFilter() && (
                    <fieldset className={styles.group} disabled={busy}>
                      <legend>{t.filtersHead}</legend>
                      <div className={styles.chips}>
                        {FILTERS.map((id) => (
                          <button key={id} type="button" className={styles.chip} aria-pressed={filter === id} onClick={() => setFilter(id)}>
                            {t.filters[id]}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  <button type="button" className={styles.shoot} onClick={shoot} disabled={cam !== 'ready' || busy}>
                    {busy ? t.hold : t.shoot}
                  </button>
                </>
              )}

              {phase === 'review' && (
                <>
                  <fieldset className={styles.group}>
                    <legend>{t.layoutHead}</legend>
                    <div className={styles.chips}>
                      {LAYOUTS.map((id) => (
                        <button key={id} type="button" className={styles.chip} aria-pressed={layout === id} onClick={() => setLayout(id)}>
                          {t.layouts[id]}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className={styles.group}>
                    <legend>{t.paperHead}</legend>
                    <div className={styles.chips}>
                      {PAPERS.map((id) => (
                        <button key={id} type="button" className={styles.swatch} aria-pressed={paper === id} aria-label={t.papers[id]} title={t.papers[id]} style={{ background: swatch(id) }} onClick={() => setPaper(id)} />
                      ))}
                    </div>
                  </fieldset>
                  <div className={styles.actions}>
                    <button type="button" className={styles.shoot} onClick={save} disabled={!strip}>
                      {t.save}
                    </button>
                    {canShare && (
                      <button type="button" className={styles.ghost} onClick={share} disabled={!strip}>
                        {t.share}
                      </button>
                    )}
                    <button type="button" className={styles.ghost} onClick={retake}>
                      {t.retake}
                    </button>
                  </div>
                </>
              )}

              <p className={styles.privacy}>{t.privacy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
