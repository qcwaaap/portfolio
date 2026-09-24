'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { scribbleLine } from '@/lib/sketch';
import { Bicycle } from './Bicycle';
import { StarDoodle } from './Doodles';
import { STAGES, smoothstep, stageAt, timeToProgress, wheelSpeed } from './loaderMath';
import { TEAR } from './tear';
import { useAssetProgress } from './useAssetProgress';
import styles from './Loader.module.css';

export type LoaderProps = {
  /** картинки, которые нужно дождаться (добавим, когда появится hero) */
  assets?: readonly string[];
  /** минимальная длительность, мс — чтобы анимацию успели увидеть даже на быстром соединении */
  minDuration?: number;
  /** экран начал уходить — отсюда можно запускать вход hero */
  onExitStart?: () => void;
  /** экран ушёл и размонтирован */
  onComplete?: () => void;
};

const BAR = scribbleLine([6, 9], [254, 7], 3, { wobble: 2 });

const num = (el: Element, key: 'at' | 'dur') => Number((el as HTMLElement | SVGElement).dataset[key] ?? 0);

export function Loader({ assets, minDuration = 4200, onExitStart, onComplete }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<SVGPathElement>(null);
  const rpmRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const [done, setDone] = useState(false);
  const assetProgress = useAssetProgress(assets);

  // колбэки держим в ref, чтобы эффект с анимацией не перезапускался при смене пропсов
  const callbacks = useRef({ onExitStart, onComplete });
  useEffect(() => {
    callbacks.current = { onExitStart, onComplete };
  });

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const pct = pctRef.current;
    const bar = barRef.current;
    const rpm = rpmRef.current;
    const caption = captionRef.current;
    if (!root || !svg || !pct || !bar || !rpm || !caption) return;

    const html = document.documentElement;
    html.classList.add('is-loading');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bike = svg.querySelector<SVGGElement>('[data-part="bike"]')!;
    const wheel = svg.querySelector<SVGGElement>('[data-part="rear-wheel"]')!;
    const spokes = svg.querySelector<SVGGElement>('[data-part="spokes"]')!;
    const blur = svg.querySelector<SVGGElement>('[data-part="blur"]')!;
    const notes = svg.querySelector<SVGGElement>('[data-part="notes"]')!;

    let shown = 0; // сглаженный прогресс 0..1 — единственный источник правды для всего
    let angle = 0; // накопленный угол заднего колеса
    let exiting = false;
    let lastPct = -1;
    let lastRpm = -1;
    let lastStage = 0;
    let tickFn: (() => void) | null = null;
    const start = performance.now();
    let last = start;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      // ── 1. Мастер-таймлайн длиной ровно 1: время таймлайна = прогресс загрузки ──
      const tl = gsap.timeline({ paused: true });

      q('[data-draw]').forEach((el) => {
        const at = num(el, 'at');
        tl.set(el, { opacity: 1 }, at).to(el, { strokeDashoffset: 0, duration: num(el, 'dur'), ease: 'power1.inOut' }, at);
      });
      q('[data-fade]').forEach((el) => {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: num(el, 'dur') || 0.04, ease: 'power1.out' }, num(el, 'at'));
      });
      // 95–100%: велосипед чуть подаётся вперёд (переднее колесо при этом НЕ вращается)
      tl.to(bike, { x: 26, duration: 0.05, ease: 'power2.in' }, 0.95);

      const setBob = gsap.quickSetter(bike, 'y', 'px');

      // ── 2. Выход: рывок вперёд → лист бумаги рвётся и уезжает вверх ──
      const startExit = () => {
        exiting = true;
        const exit = gsap.timeline({ onComplete: finish });
        if (reduced) {
          exit.to(root, { opacity: 0, duration: 0.4 });
          callbacks.current.onExitStart?.();
          return;
        }
        exit
          .to(notes, { opacity: 0, duration: 0.25 })
          .to(bike, { x: '+=54', duration: 0.7, ease: 'power3.out' }, 0)
          .call(() => callbacks.current.onExitStart?.(), undefined, '>+0.12')
          .to(
            root,
            {
              y: () => -(root.offsetHeight + 140),
              rotation: -0.7,
              transformOrigin: '0% 100%',
              duration: 1,
              ease: 'power3.inOut',
            },
            '<',
          );
      };

      // ── 3. Один тикер на всё: прогресс → таймлайн, колесо, счётчик ──
      const tick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const elapsed = (now - start) / 1000;

        // не быстрее реальной загрузки и не быстрее «сценария» по времени
        const target = Math.min(assetProgress.current, timeToProgress(elapsed / (minDuration / 1000)));
        shown += (target - shown) * (1 - Math.exp(-dt * 9));
        if (target >= 1 && shown > 0.9985) shown = 1;

        if (!exiting) tl.time(shown);

        // колесо: угол интегрируем из скорости, поэтому оно не «прыгает» при смене стадии
        let speed = wheelSpeed(shown);
        if (reduced) speed = Math.min(speed, 90);
        angle = (angle + speed * dt) % 360;
        wheel.setAttribute('transform', `rotate(${angle.toFixed(2)})`);

        // на большой скорости спицы сливаются (иначе — эффект «колеса в кино»), проступают дуги
        spokes.style.opacity = String(1 - smoothstep((speed - 450) / 400));
        blur.style.opacity = String(smoothstep((speed - 350) / 550) * 0.85);

        // лёгкая вибрация рамы, растёт со скоростью
        if (!reduced) setBob(Math.sin(elapsed * 23) * (speed / 1000) * 1.7);

        // ── HUD ──
        const p = Math.floor(shown * 100);
        if (p !== lastPct) {
          lastPct = p;
          pct.textContent = String(p);
        }
        bar.style.strokeDashoffset = String(1 - shown);
        const r = Math.round(speed / 6);
        if (r !== lastRpm) {
          lastRpm = r;
          rpm.textContent = String(r);
        }
        const stage = stageAt(shown);
        if (stage !== lastStage) {
          lastStage = stage;
          caption.textContent = STAGES[stage]!.label;
          if (!reduced) gsap.fromTo(caption, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, overwrite: true });
        }

        if (shown >= 1 && !exiting) ctx.add(startExit);
      };

      const finish = () => {
        if (tickFn) gsap.ticker.remove(tickFn);
        root.style.display = 'none';
        html.classList.remove('is-loading');
        setDone(true);
        callbacks.current.onComplete?.();
      };

      tickFn = tick;
      gsap.ticker.add(tick);
    }, root);

    return () => {
      if (tickFn) gsap.ticker.remove(tickFn);
      ctx.revert();
      html.classList.remove('is-loading');
    };
    // minDuration/assetProgress стабильны на время жизни лоадера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className={styles.root} data-loader="" role="status" aria-label="Loading">
      <div className={styles.shadow} />
      <div className={styles.edge} style={{ clipPath: TEAR.edge }} />
      <div className={`${styles.sheet} paper-surface`} style={{ clipPath: TEAR.sheet }} />

      <StarDoodle className={styles.starInk} seed={3} at={0.03} />
      <p className={styles.tr} data-fade="" data-at="0.05" data-dur="0.05">
        SPB / REMOTE
        <br />
        2026
      </p>

      <div className={styles.stage}>
        <div className={styles.bikeWrap}>
          <Bicycle ref={svgRef} />
        </div>
      </div>

      <StarDoodle className={styles.starPink} color="var(--pink)" seed={9} at={0.24} />

      <div className={styles.scrap} data-fade="" data-at="0.02" data-dur="0.06">
        <p ref={captionRef} className={styles.caption}>
          {STAGES[0].label}
        </p>
        <p className={styles.pctRow} aria-hidden>
          <span ref={pctRef} className={styles.pct}>
            0
          </span>
          <span className={styles.pctSign}>%</span>
        </p>
        <svg className={styles.progress} viewBox="0 0 260 16" aria-hidden>
          <path d={BAR} className={styles.track} />
          <path ref={barRef} d={BAR} pathLength={1} className={styles.bar} />
        </svg>
        <p className={styles.rpm}>
          rear wheel: <span ref={rpmRef}>0</span> rpm
        </p>
      </div>
    </div>
  );
}
