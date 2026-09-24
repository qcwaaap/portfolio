'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Cursor.module.css';

const INK = '#171715';
const ACID = '#c9f13b';
const PINK = 'rgba(240, 107, 168, 0.42)';

type State = { key: string; scale: number; bg: string; text: string };

const DEFAULT: State = { key: 'default', scale: 0.14, bg: INK, text: '' };
const LINK: State = { key: 'link', scale: 0.4, bg: PINK, text: '' };
const label = (text: string): State => ({ key: `label:${text}`, scale: 1, bg: ACID, text });

/**
 * Кастомный курсор с инерцией.
 *   обычный           → маленькая точка
 *   a / button        → кружок побольше
 *   [data-cursor="X"] → зелёный шар с надписью X (OPEN / VIEW / PET …)
 * На тач-устройствах не подключается вообще.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const root = rootRef.current;
    const bubble = bubbleRef.current;
    const text = labelRef.current;
    if (!root || !bubble || !text) return;

    const html = document.documentElement;
    html.classList.add('has-cursor');

    gsap.set(root, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    gsap.set(bubble, { scale: DEFAULT.scale, backgroundColor: DEFAULT.bg });

    const qx = gsap.quickTo(root, 'x', { duration: 0.45, ease: 'power3' });
    const qy = gsap.quickTo(root, 'y', { duration: 0.45, ease: 'power3' });

    let state = DEFAULT;
    let pressed = false;
    let shown = false;
    let px = -100;
    let py = -100;

    const apply = () =>
      gsap.to(bubble, {
        scale: state.scale * (pressed ? 0.82 : 1),
        backgroundColor: state.bg,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: true,
      });

    const resolve = (target: EventTarget | null): State => {
      const el = target instanceof Element ? target : null;
      const host = el?.closest<HTMLElement>('[data-cursor]');
      if (host?.dataset.cursor) return label(host.dataset.cursor);
      if (el?.closest('a, button, [role="button"]')) return LINK;
      return DEFAULT;
    };

    const update = (target: EventTarget | null) => {
      const next = resolve(target);
      if (next.key === state.key) return;
      state = next;
      text.textContent = next.text;
      gsap.to(text, { opacity: next.text ? 1 : 0, duration: 0.2, delay: next.text ? 0.08 : 0, overwrite: true });
      apply();
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      qx(px);
      qy(py);
      if (!shown) {
        shown = true;
        gsap.to(root, { opacity: 1, duration: 0.25 });
      }
      update(e.target);
    };
    const onLeave = () => {
      shown = false;
      gsap.to(root, { opacity: 0, duration: 0.2 });
    };
    const onDown = () => {
      pressed = true;
      apply();
    };
    const onUp = () => {
      pressed = false;
      apply();
    };

    // контент едет под неподвижным курсором (скролл) — пересчитываем состояние
    let raf = 0;
    const onScroll = () => {
      if (raf || !shown) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update(document.elementFromPoint(px, py));
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      gsap.killTweensOf([root, bubble, text]);
      html.classList.remove('has-cursor');
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden>
      <div ref={bubbleRef} className={styles.bubble}>
        <span ref={labelRef} className={styles.label} />
      </div>
    </div>
  );
}
