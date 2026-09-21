'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TornEdge } from '@/components/collage/TornEdge';
import { PROJECTS } from '@/content/projects';
import { CX, CY, WAVE_H, WAVE_NOISE, WAVE_NOISE_2, WAVE_W, rpmToAngle, ringPaths, wavePath, wheelPaths } from './geometry';
import styles from './Cadence.module.css';

gsap.registerPlugin(ScrollTrigger);

const WHEEL = wheelPaths();
const RING = ringPaths();
const P = PROJECTS.find((p) => p.id === 'cadence')!;

const BASE_RPM = 87;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/**
 * CADENCE — главный проект. Большая страница-разворот: мелом на чёрной бумаге нарисовано колесо.
 *   скролл          → колесо крутится (на desktop секция закреплена на время прокрутки)
 *   мышь            → колесо слегка смещается и подворачивается
 *   перетаскивание  → колесо можно раскрутить рукой, дальше оно крутится по инерции
 *   чем быстрее крутишь, тем выше rpm: стрелка на кольце и волна отвечают на скорость
 */
export function CadenceSpotlight({ onOpen }: { onOpen: () => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const pointerRef = useRef<SVGGElement>(null);
  const rpmRef = useRef<HTMLSpanElement>(null);
  const waveA = useRef<SVGPathElement>(null);
  const waveB = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    const wheel = wheelRef.current;
    const pointer = pointerRef.current;
    const rpmEl = rpmRef.current;
    const a = waveA.current;
    const b = waveB.current;
    if (!root || !host || !wheel || !pointer || !rpmEl || !a || !b) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const desktop = window.matchMedia('(min-width: 821px)').matches;

    // состояние вращения
    const S = { scroll: 0, idle: 0, drag: 0, dragVel: 0, dragging: false, lastA: 0, lastT: 0, tilt: 0, tiltTarget: 0 };
    let angle = 0;
    let prevAngle = 0;
    let ws = 0; // сглаженная угловая скорость, °/с
    let rpm = BASE_RPM;
    let phase = 0;
    let last = performance.now();
    let lastShown = -1;

    const paintWave = (amp: number) => {
      a.setAttribute('d', wavePath(phase, amp, WAVE_NOISE));
      b.setAttribute('d', wavePath(phase + 0.012, amp * 0.92, WAVE_NOISE_2, 2.6));
    };

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (dt <= 0) return;

      if (!reduced) S.idle += 14 * dt;
      if (!S.dragging) {
        S.drag += S.dragVel * dt;
        S.dragVel *= Math.exp(-dt * 2.4);
        if (Math.abs(S.dragVel) < 1) S.dragVel = 0;
      }
      S.tilt += (S.tiltTarget - S.tilt) * (1 - Math.exp(-dt * 6));

      angle = S.scroll + S.idle + S.drag + S.tilt;
      const omega = (angle - prevAngle) / dt;
      prevAngle = angle;
      ws += (omega - ws) * (1 - Math.exp(-dt * 8));

      // rpm: спокойные 87 в покое, растёт, когда колесо крутят быстро
      const target = BASE_RPM + 27 * smooth(Math.abs(ws) / 700);
      rpm += (target - rpm) * (1 - Math.exp(-dt * 5));

      wheel.style.transform = `rotate(${(angle % 360).toFixed(2)}deg)`;
      pointer.setAttribute('transform', `rotate(${rpmToAngle(rpm).toFixed(2)} ${CX} ${CY})`);

      const shown = Math.round(rpm);
      if (shown !== lastShown) {
        lastShown = shown;
        rpmEl.textContent = String(shown);
      }

      if (!reduced) {
        phase += dt * (rpm / 60) * 0.55;
        paintWave(20 * (0.78 + (rpm - BASE_RPM) / 90));
      }
    };

    // тикаем только когда секция видна
    let running = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = !!entry?.isIntersecting;
        if (on && !running) {
          last = performance.now();
          gsap.ticker.add(tick);
          running = true;
        } else if (!on && running) {
          gsap.ticker.remove(tick);
          running = false;
        }
      },
      { rootMargin: '100px' },
    );
    io.observe(root);
    paintWave(20);
    rpmEl.textContent = String(BASE_RPM);

    // ── мышь: лёгкий наклон и сдвиг колеса ──
    const cleanups: Array<() => void> = [];
    if (fine && !reduced) {
      const qx = gsap.quickTo(host, 'x', { duration: 1, ease: 'power3' });
      const qy = gsap.quickTo(host, 'y', { duration: 1, ease: 'power3' });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        S.tiltTarget = nx * 14;
        qx(nx * 16);
        qy(ny * 12);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      cleanups.push(() => window.removeEventListener('pointermove', onMove));
    }

    // ── перетаскивание: можно раскрутить рукой ──
    const centerOf = () => {
      const r = wheel.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const onDown = (e: PointerEvent) => {
      host.setPointerCapture(e.pointerId);
      const c = centerOf();
      S.lastA = Math.atan2(e.clientY - c.y, e.clientX - c.x);
      S.lastT = performance.now();
      S.dragging = true;
      S.dragVel = 0;
    };
    const onDrag = (e: PointerEvent) => {
      if (!S.dragging) return;
      const c = centerOf();
      const ang = Math.atan2(e.clientY - c.y, e.clientX - c.x);
      let da = ang - S.lastA;
      if (da > Math.PI) da -= Math.PI * 2;
      if (da < -Math.PI) da += Math.PI * 2;
      S.lastA = ang;
      const deg = (da * 180) / Math.PI;
      const now = performance.now();
      const dt = Math.max(0.008, (now - S.lastT) / 1000);
      S.lastT = now;
      S.drag += deg;
      S.dragVel += (deg / dt - S.dragVel) * 0.35;
    };
    const onUp = () => {
      S.dragging = false;
    };
    host.addEventListener('pointerdown', onDown);
    host.addEventListener('pointermove', onDrag);
    host.addEventListener('pointerup', onUp);
    host.addEventListener('pointercancel', onUp);
    cleanups.push(() => {
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointermove', onDrag);
      host.removeEventListener('pointerup', onUp);
      host.removeEventListener('pointercancel', onUp);
    });

    // ── скролл: закрепление (desktop) и вращение колеса ──
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      if (desktop) {
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: '+=140%',
          pin: true,
          onUpdate: (self) => {
            S.scroll = self.progress * 720;
          },
        });
      } else {
        ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            S.scroll = self.progress * 540;
          },
        });
      }

      if (!reduced) {
        const once = { trigger: root, start: 'top 72%', once: true };
        gsap.from(q('[data-sheet]'), { y: 130, rotation: 5, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: once });
        gsap.from(q('[data-col] > *'), { y: 26, opacity: 0, duration: 0.8, stagger: 0.09, delay: 0.25, ease: 'power2.out', scrollTrigger: once });
      }
    }, root);

    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="cadence" className={styles.cad} aria-labelledby="cadence-title">
      <TornEdge seed={31} tone="var(--paper-3)" />

      <div className={styles.sheetPos}>
        <div className={styles.shadow} aria-hidden />
        <div className={styles.sheetAnim} data-sheet="">
          <div className={styles.sheet} aria-hidden />
          <span className={`${styles.tape} ${styles.tapeA}`} aria-hidden />
          <span className={`${styles.tape} ${styles.tapeB}`} aria-hidden />

          <div ref={hostRef} className={styles.host} data-cursor="SPIN">
            {/* статичное кольцо-тахометр со стрелкой */}
            <svg className={styles.ring} viewBox="0 0 600 600" aria-hidden>
              <g transform={`translate(${CX} ${CY})`}>
                <path d={RING.arc} className={styles.chalk} strokeWidth={2.2} />
                {RING.ticks.map((t, i) => (
                  <path key={i} d={t.d} className={styles.chalk} strokeWidth={t.major ? 3 : 1.6} />
                ))}
              </g>
              {RING.labels.map((l) => (
                <text key={l.rpm} x={CX + l.x} y={CY + l.y + 8} textAnchor="middle" className={styles.ringLabel}>
                  {l.rpm}
                </text>
              ))}
              <text x={CX} y={566} textAnchor="middle" className={styles.ringHint}>
                drag the wheel
              </text>
              <g ref={pointerRef} transform={`rotate(${rpmToAngle(BASE_RPM)} ${CX} ${CY})`}>
                <path d="M300 70L291 46L309 46Z" className={styles.needle} />
              </g>
            </svg>

            {/* вращающееся колесо: отдельный слой, крутится через CSS-transform (без перерисовки) */}
            <svg ref={wheelRef} className={styles.wheel} viewBox="0 0 600 600" role="img" aria-label="Hand-drawn bicycle wheel, spins with scroll">
              <g transform={`translate(${CX} ${CY})`}>
                {WHEEL.spokes.map((d, i) => (
                  <path key={i} d={d} className={styles.chalk} strokeWidth={1.5} strokeOpacity={0.85} />
                ))}
                <path d={WHEEL.tireC} className={styles.chalk} strokeWidth={1.6} strokeOpacity={0.5} />
                <path d={WHEEL.tireA} className={styles.chalk} strokeWidth={6} />
                <path d={WHEEL.tireB} className={styles.chalk} strokeWidth={2.4} strokeOpacity={0.65} />
                <path d={WHEEL.cog} className={styles.chalk} strokeWidth={2.4} />
                <path d={WHEEL.teeth} className={styles.chalk} strokeWidth={2.4} />
                <path d={WHEEL.hubRing} className={styles.chalk} strokeWidth={3} />
                <circle r={8} className={styles.hub} />
                {/* метки на ободе: по ним видно вращение */}
                <path d={WHEEL.slash} className={styles.slash} strokeWidth={8} />
                <path d={WHEEL.valve} className={styles.chalk} strokeWidth={3.4} />
                <g transform={`rotate(${WHEEL.tapeAt}) translate(0 -${196})`}>
                  <rect x={-15} y={-8} width={30} height={16} rx={1.5} className={styles.rimTape} />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.col} data-col="">
        <p className={styles.kicker}>featured project</p>
        <h2 id="cadence-title" className={styles.title}>
          {P.title}
        </h2>
        <p className={styles.blurb}>
          {P.short} The rhythm of your pedalling sets the tempo.
        </p>

        <div className={styles.rpmRow}>
          <span ref={rpmRef} className={styles.rpm} aria-live="off">
            87
          </span>
          <span className={styles.rpmUnit}>RPM</span>
        </div>
        <svg className={styles.wave} viewBox={`0 0 ${WAVE_W} ${WAVE_H}`} aria-hidden>
          <path ref={waveB} className={styles.waveGhost} />
          <path ref={waveA} className={styles.waveMain} />
        </svg>

        <ul className={styles.tags}>
          {P.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <button type="button" className={styles.open} data-cursor="OPEN" onClick={onOpen}>
          open project ↗
        </button>
      </div>
    </section>
  );
}
