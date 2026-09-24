'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Photo } from '@/components/collage/Photo';
import { getLenis } from '@/components/smooth/lenisStore';
import { sound } from '@/lib/sound/engine';
import type { Project } from '@/content/projects';
import { ProjectArt } from './ProjectArt';
import styles from './ProjectModal.module.css';

type Props = { project: Project; onClosed: () => void };

type Origin = { cx: number; cy: number; w: number; tilt: number };

/** Где сейчас карточка проекта на странице — оттуда «вылетает» и туда «возвращается» фото. */
function originOf(id: string): Origin | null {
  const el = document.querySelector<HTMLElement>(`[data-project-visual="${id}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight) return null;
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: el.offsetWidth, tilt: Number(el.dataset.tilt ?? 0) };
}

const TAG_TONES = ['#f7c6da', '#d8f27a', '#bcd3f7', '#f6e58a'];

export function ProjectModal({ project: p, onClosed }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const reduced = useRef(false);

  // ── блокируем скролл страницы, возвращаем фокус ──
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    getLenis()?.stop();
    document.documentElement.classList.add('is-modal');
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.documentElement.classList.remove('is-modal');
      getLenis()?.start();
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  // ── открытие: фото вылетает из карточки, лист бумаги проявляется ──
  useLayoutEffect(() => {
    const root = rootRef.current;
    const vis = visualRef.current;
    if (!root || !vis) return;
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sound.open();

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(q('[data-backdrop]'), { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(q('[data-paper]'), { opacity: 0, y: 26, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' });

      const from = originOf(p.id);
      if (from && !reduced.current) {
        const t = vis.getBoundingClientRect();
        gsap.fromTo(
          vis,
          {
            x: from.cx - (t.left + t.width / 2),
            y: from.cy - (t.top + t.height / 2),
            scale: from.w / t.width,
            rotation: from.tilt,
            transformOrigin: '50% 50%',
          },
          { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.95, ease: 'power3.inOut' },
        );
      } else {
        gsap.fromTo(vis, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      }
      gsap.from(q('[data-reveal]'), { opacity: 0, y: 18, duration: 0.6, stagger: 0.06, delay: 0.4, ease: 'power2.out' });
    }, root);

    return () => ctx.revert();
  }, [p.id]);

  // ── закрытие: фото летит обратно в карточку ──
  const close = () => {
    const root = rootRef.current;
    const vis = visualRef.current;
    if (!root || !vis || closing.current) return;
    closing.current = true;
    sound.close();
    const q = gsap.utils.selector(root);
    const from = originOf(p.id);
    const tl = gsap.timeline({ onComplete: onClosed });
    tl.to(q('[data-reveal]'), { opacity: 0, y: 10, duration: 0.2, stagger: 0.02 }, 0);
    if (from && !reduced.current) {
      const t = vis.getBoundingClientRect();
      tl.to(
        vis,
        {
          x: from.cx - (t.left + t.width / 2),
          y: from.cy - (t.top + t.height / 2),
          scale: from.w / t.width,
          rotation: from.tilt,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        0.05,
      );
    } else {
      tl.to(vis, { opacity: 0, duration: 0.3 }, 0);
    }
    tl.to(q('[data-paper]'), { opacity: 0, y: 14, duration: 0.4, ease: 'power2.in' }, 0.25);
    tl.to(q('[data-backdrop]'), { opacity: 0, duration: 0.45 }, 0.3);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // close использует только рефы и стабильные значения
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className={styles.root} role="dialog" aria-modal="true" aria-label={p.title}>
      <div className={styles.backdrop} data-backdrop="" />
      <div
        className={styles.scroller}
        data-lenis-prevent=""
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className={styles.sheet}>
          <div className={`${styles.paper} paper-surface`} data-paper="" />

          <button ref={closeRef} type="button" className={styles.close} onClick={close} data-reveal="">
            close <span aria-hidden>✕</span>
          </button>

          <div className={styles.content}>
            <div ref={visualRef} className={styles.visual}>
              <Photo
                alt={p.title}
                label={p.title}
                tone="mountains"
                src={p.image}
                ratio={p.ratio}
                frame={p.id === 'tamagochi' ? 'polaroid' : 'plain'}
                tapes={p.id === 'todo' ? ['top'] : ['tr', 'bl']}
                cursor={null}
                interactive={false}
              >
                {!p.image && <ProjectArt id={p.id} />}
              </Photo>
            </div>

            <div className={styles.info}>
              <p className={styles.index} data-reveal="">
                {p.index} / 04
              </p>
              <h2 className={styles.title} data-reveal="">
                {p.title}
              </h2>
              <p className={styles.long} data-reveal="">
                {p.long}
              </p>

              <ul className={styles.tags} data-reveal="">
                {p.tags.map((t, i) => (
                  <li key={t} style={{ background: TAG_TONES[i % TAG_TONES.length], transform: `rotate(${i % 2 ? 1.6 : -1.4}deg)` }}>
                    {t}
                  </li>
                ))}
              </ul>

              <div className={styles.links} data-reveal="">
                {p.links.length ? (
                  p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                      {l.label} ↗
                    </a>
                  ))
                ) : (
                  <span className={styles.soon}>links coming soon</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.gallery} data-reveal="">
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.shot} style={{ transform: `rotate(${[-1.6, 1.2, -0.8][i]}deg)` }}>
                <span>screenshot</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
