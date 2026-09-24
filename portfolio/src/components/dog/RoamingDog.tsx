'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HeartDoodle } from '@/components/about/Doodles';
import { scribbleCircle, scribbleCurve, scribblePoly, type Pt } from '@/lib/sketch';
import styles from './RoamingDog.module.css';

const P = (x: number, y: number): Pt => [x, y];
const curve = (pts: Pt[], seed: number, j = 0.7) => scribbleCurve(pts, seed, j);

// ── собачка (смотрит влево), детали разнесены по группам, чтобы двигать их по отдельности ──
const BODY = [
  curve([P(46, 40), P(66, 44), P(90, 42), P(112, 40), P(120, 34)], 1),
  curve([P(112, 40), P(116, 58), P(112, 70)], 2),
  curve([P(50, 70), P(72, 73), P(96, 70), P(112, 70)], 3),
  curve([P(44, 44), P(50, 58), P(50, 70)], 4),
  curve([P(78, 52), P(88, 50), P(90, 58), P(80, 60), P(78, 52)], 5, 0.5),
];

const HEAD = [
  scribbleCircle(30, 38, 18, 6, { sweep: 1.05, jitter: 0.03 }),
  scribblePoly([P(19, 26), P(14, 6), P(30, 20)], 7, 0.6),
  scribblePoly([P(36, 20), P(47, 4), P(48, 28)], 8, 0.6),
  curve([P(13, 42), P(8, 46), P(12, 52), P(22, 52)], 9, 0.5),
];
const TONGUE = curve([P(18, 53), P(19, 60), P(24, 58)], 10, 0.3);

// ноги нарисованы относительно бедра; порядок: ближняя передняя, дальняя передняя, ближняя задняя, дальняя задняя
const LEGS = [
  { x: 56, y: 72, d: curve([P(0, 0), P(-2, 24), P(-10, 28)], 11) },
  { x: 68, y: 73, d: curve([P(0, 0), P(2, 25), P(-6, 29)], 12) },
  { x: 100, y: 70, d: curve([P(0, 0), P(2, 26), P(-6, 30)], 13) },
  { x: 112, y: 68, d: curve([P(0, 0), P(8, 24), P(0, 30)], 14) },
];
const LEG_PHASE = [0, Math.PI, Math.PI, 0]; // шаг «рысью»: ноги по диагонали

const TAIL = curve([P(0, 0), P(10, -12), P(8, -24), P(2, -28)], 15, 0.6);

type Phase = 'hidden' | 'walking' | 'paused' | 'petted';

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Пасхалка: собачка иногда выходит из-за края экрана, идёт по низу страницы, косится на курсор,
 * останавливается, виляет хвостом и уходит за другой край. Если её погладить — рада.
 * Для проверки без ожидания: window.dispatchEvent(new Event('dog:spawn')) в консоли браузера.
 */
export function RoamingDog({ enabled }: { enabled: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const heart = heartRef.current;
    const bubble = bubbleRef.current;
    if (!wrap || !svg || !heart || !bubble) return;

    const bob = svg.querySelector('[data-part="bob"]')!;
    const head = svg.querySelector('[data-part="head"]')!;
    const tail = svg.querySelector('[data-part="tail"]')!;
    const legs = Array.from(svg.querySelectorAll('[data-leg]'));

    let phase: Phase = 'hidden';
    let x = 0;
    let dir: 1 | -1 = 1;
    let flip: 1 | -1 = 1; // 1 — смотрит влево (как нарисована), -1 — вправо
    let speed = 0;
    let stride = 0;
    let time = 0;
    let frame = 0;
    let headRot = 0;
    let stops: number[] = [];
    let pets = 0;
    let lastPet = 0;
    let wrapW = 100;
    const hop = { y: 0 };
    const mouse = { x: 0, y: 0, t: 0 };
    let headC = { x: 0, y: 0 };
    let pending: gsap.core.Tween | null = null;
    let nextSpawn: gsap.core.Tween | null = null;

    const walkSpeed = () => Math.min(110, Math.max(70, window.innerWidth * 0.07));

    const onMouse = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.t = performance.now();
    };
    window.addEventListener('pointermove', onMouse, { passive: true });

    const setSide = () => {
      // подпись и сердечко — над головой, а голова слева или справа в зависимости от направления
      const side = flip === 1 ? { left: '4%', right: 'auto' } : { left: 'auto', right: '4%' };
      Object.assign(heart.style, side);
      Object.assign(bubble.style, side);
      svg.style.transform = `scaleX(${flip})`;
    };

    const scheduleNext = (min = 25, max = 60) => {
      nextSpawn?.kill();
      nextSpawn = gsap.delayedCall(rand(min, max), spawn);
    };

    // ── появление из-за края ──
    function spawn() {
      if (phase !== 'hidden') return;
      if (document.hidden) return scheduleNext(8, 15);
      wrapW = wrap!.offsetWidth;
      dir = Math.random() < 0.5 ? 1 : -1;
      flip = dir > 0 ? -1 : 1;
      x = dir > 0 ? -wrapW - 20 : window.innerWidth + 20;
      speed = 0;
      // 0–2 остановки по пути
      const n = Math.random() < 0.3 ? 0 : Math.random() < 0.5 ? 1 : 2;
      stops = Array.from({ length: n }, () => rand(0.2, 0.8) * window.innerWidth).sort((a, b) => (dir > 0 ? a - b : b - a));
      phase = 'walking';
      setSide();
      wrap!.style.visibility = 'visible';
      gsap.ticker.add(tick);
    }

    function hide() {
      phase = 'hidden';
      pending?.kill();
      wrap!.style.visibility = 'hidden';
      gsap.ticker.remove(tick);
      scheduleNext();
    }

    function pause(sec: number) {
      phase = 'paused';
      // заметила курсор за спиной — разворачивается к нему и дальше идёт уже в ту сторону
      if (performance.now() - mouse.t < 8000 && Math.random() < 0.6) {
        const behind = flip === 1 ? mouse.x > headC.x + 60 : mouse.x < headC.x - 60;
        if (behind) {
          dir = (dir * -1) as 1 | -1;
          flip = (flip * -1) as 1 | -1;
          stops = [];
          setSide();
        }
      }
      pending?.kill();
      pending = gsap.delayedCall(sec, () => {
        if (phase === 'paused') phase = 'walking';
      });
    }

    // ── погладили ──
    function pet() {
      const now = performance.now();
      if (phase === 'hidden' || now - lastPet < 900) return;
      lastPet = now;
      pets += 1;
      phase = 'petted';
      pending?.kill();
      gsap.fromTo(heart!, { opacity: 1, y: 0, scale: 0.6 }, { opacity: 0, y: -34, scale: 1.1, duration: 1.1, ease: 'power1.out', overwrite: true });
      if (pets % 3 === 0) {
        // третье поглаживание — радостный прыжок и «woof!»
        gsap.fromTo(hop, { y: 0 }, { y: -22, duration: 0.2, yoyo: true, repeat: 3, ease: 'power2.out' });
        gsap.fromTo(bubble!, { opacity: 0, y: 6, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, yoyo: true, repeat: 1, repeatDelay: 0.9, overwrite: true });
      }
      pending = gsap.delayedCall(2.2, () => {
        if (phase === 'petted') phase = 'walking';
      });
    }

    // ── кадр ──
    function tick() {
      const dt = Math.min(0.05, gsap.ticker.deltaRatio(60) / 60);
      time += dt;
      frame += 1;

      const ws = walkSpeed();
      const want = phase === 'walking' ? ws : 0;
      speed += (want - speed) * (1 - Math.exp(-dt * 6));
      x += dir * speed * dt;
      stride += speed * dt * 0.09;
      const moving = Math.min(1, speed / ws);

      // остановка по пути
      if (phase === 'walking' && stops.length && (dir > 0 ? x >= stops[0]! : x <= stops[0]!)) {
        stops.shift();
        pause(rand(1.8, 3.2));
      }
      // ушла за край
      if ((dir > 0 && x > window.innerWidth + 30) || (dir < 0 && x < -wrapW - 30)) return hide();

      wrap!.style.transform = `translate3d(${x.toFixed(1)}px,${hop.y.toFixed(1)}px,0)`;

      // ноги, покачивание корпуса, хвост
      legs.forEach((leg, i) => leg.setAttribute('transform', `rotate(${(Math.sin(stride + LEG_PHASE[i]!) * 26 * moving).toFixed(1)})`));
      bob.setAttribute('transform', `translate(0 ${(-Math.abs(Math.sin(stride)) * 1.8 * moving).toFixed(2)})`);
      const wag = phase === 'petted' ? Math.sin(time * 24) * 26 : Math.sin(time * 5) * (phase === 'paused' ? 14 : 7);
      tail.setAttribute('transform', `rotate(${wag.toFixed(1)})`);

      // голова следит за курсором
      if (frame % 4 === 0) {
        const r = head.getBoundingClientRect();
        headC = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      let target = Math.sin(stride) * 3 * moving; // в ходьбе — лёгкий кивок
      if (phase === 'petted') target = 12; // прикрыла глаза, голова опущена
      else if (performance.now() - mouse.t < 6000) {
        const dx = (mouse.x - headC.x) * flip;
        const dy = mouse.y - headC.y;
        let deg = (Math.atan2(-dy, -dx) * 180) / Math.PI;
        if (Math.abs(deg) > 100) deg = 0; // курсор за спиной — не выворачивать шею
        target = Math.max(-30, Math.min(30, deg));
      }
      headRot += (target - headRot) * (1 - Math.exp(-dt * 8));
      head.setAttribute('transform', `rotate(${headRot.toFixed(1)})`);
    }

    const onSpawn = () => spawn();
    window.addEventListener('dog:spawn', onSpawn);
    nextSpawn = gsap.delayedCall(rand(9, 15), spawn);

    // гладят наведением или касанием
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') pet();
    };
    wrap.addEventListener('pointerenter', onEnter);
    wrap.addEventListener('click', pet);

    return () => {
      window.removeEventListener('pointermove', onMouse);
      window.removeEventListener('dog:spawn', onSpawn);
      wrap.removeEventListener('pointerenter', onEnter);
      wrap.removeEventListener('click', pet);
      gsap.ticker.remove(tick);
      pending?.kill();
      nextSpawn?.kill();
      gsap.killTweensOf([hop, heart, bubble]);
      wrap.style.visibility = 'hidden';
    };
  }, [enabled]);

  return (
    <div ref={wrapRef} className={styles.dog} data-cursor="PET" aria-hidden>
      <svg ref={svgRef} className={styles.svg} viewBox="0 0 140 108">
        <ellipse className={styles.shadow} cx="70" cy="104" rx="46" ry="3.5" />
        <g data-part="bob">
          {BODY.map((d, i) => (
            <path key={i} d={d} />
          ))}
          {LEGS.map((l, i) => (
            <g key={i} transform={`translate(${l.x} ${l.y})`}>
              <g data-leg={i}>
                <path d={l.d} />
              </g>
            </g>
          ))}
          <g transform="translate(120 34)">
            <g data-part="tail">
              <path d={TAIL} />
            </g>
          </g>
          <g transform="translate(44 44)">
            <g data-part="head">
              <g transform="translate(-44 -44)">
                {HEAD.map((d, i) => (
                  <path key={i} d={d} />
                ))}
                <path className={styles.tongue} d={TONGUE} />
                <circle className={styles.dot} cx={26} cy={34} r={2.4} />
                <circle className={styles.dot} cx={10} cy={45} r={3.2} />
              </g>
            </g>
          </g>
        </g>
      </svg>
      <span ref={heartRef} className={styles.heart}>
        <HeartDoodle color="var(--pink)" />
      </span>
      <span ref={bubbleRef} className={styles.bubble}>
        woof!
      </span>
    </div>
  );
}
