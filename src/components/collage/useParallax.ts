'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Параллакс для предметов (`Item`) внутри секции:
 *   [data-scroll] — едут вверх/вниз по мере скролла секции, скорость зависит от глубины
 *   [data-depth]  — смещаются от курсора (только с мышью)
 */
export function useParallax(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const mobile = window.matchMedia('(max-width: 820px)').matches;
    if (reduced) return;
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const reach = mobile ? 16 : 44;

      q('[data-scroll]').forEach((node) => {
        const d = Number((node as HTMLElement).dataset.scroll ?? 0.5);
        gsap.fromTo(
          node,
          { y: d * reach },
          { y: -d * reach, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });

      if (fine) {
        const movers = q('[data-depth]').map((node) => ({
          d: Number((node as HTMLElement).dataset.depth ?? 0),
          x: gsap.quickTo(node, 'x', { duration: 0.9, ease: 'power3' }),
          y: gsap.quickTo(node, 'y', { duration: 0.9, ease: 'power3' }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          movers.forEach((m) => {
            m.x(-nx * m.d * 14);
            m.y(-ny * m.d * 9);
          });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        cleanups.push(() => window.removeEventListener('pointermove', onMove));
      }
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [rootRef]);
}
