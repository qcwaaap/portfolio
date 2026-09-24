'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CadenceSpotlight } from '@/components/cadence/CadenceSpotlight';
import { TornEdge } from '@/components/collage/TornEdge';
import { PROJECTS, type ProjectId } from '@/content/projects';
import { scribbleArrow, scribbleLine } from '@/lib/sketch';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import styles from './Work.module.css';

gsap.registerPlugin(ScrollTrigger);

const UNDERLINE = scribbleLine([0, 8], [206, 5], 12, { wobble: 1.6, overshoot: 3 });
const DOWN = scribbleArrow([10, 2], [8, 30], [12, 58], 21, 7);

const data = (node: Element) => (node as HTMLElement).dataset;

export function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<ProjectId | null>(null);
  const openProject = PROJECTS.find((p) => p.id === openId) ?? null;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const desktop = window.matchMedia('(min-width: 821px)').matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      // заголовок: появляется, потом подчёркивается маркером
      const line = q('[data-work-line] path');
      gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 65%', once: true } })
        .from(q('[data-work-head]'), { opacity: 0, y: 22, duration: 0.9, ease: 'power3.out' })
        .set(line, { opacity: 1 }, 0.5)
        .to(line, { strokeDashoffset: 0, duration: 0.7, ease: 'power1.inOut' }, 0.5)
        .from(q('[data-work-index] > *'), { opacity: 0, x: -14, duration: 0.5, stagger: 0.08 }, 0.4);

      // карточки: каждая выезжает со своим наклоном, потом от руки дорисовывается стрелка-пометка
      q('[data-enter-card]').forEach((el, i) => {
        const arrows = el.querySelectorAll('[data-annot] path');
        gsap.set(arrows, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });
        const lag = desktop ? i * 0.1 : 0;
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
          .from(el, { y: 110, rotation: i % 2 ? 5 : -5, opacity: 0, duration: 1.1, ease: 'power3.out' }, lag)
          .set(arrows, { opacity: 1 }, lag + 0.9)
          .to(arrows, { strokeDashoffset: 0, duration: 0.6, stagger: 0.15, ease: 'power1.inOut' }, lag + 0.9);
      });

      // лёгкий параллакс между карточками (только desktop)
      if (desktop) {
        q('[data-parallax]').forEach((el) => {
          const d = Number(data(el).parallax ?? 0.5);
          gsap.fromTo(
            el,
            { y: d * 36 },
            { y: -d * 36, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } },
          );
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={rootRef} id="work" className={styles.work} aria-labelledby="work-title">
        <TornEdge seed={3} />

        <h2 id="work-title" className={styles.heading} data-work-head="">
          selected work
          <svg className={styles.underline} viewBox="0 0 210 14" aria-hidden data-work-line="">
            <path d={UNDERLINE} pathLength={1} />
          </svg>
        </h2>

        <div className={styles.index} data-work-index="" aria-label="Projects">
          {PROJECTS.map((p) => (
            <button key={p.id} type="button" className={styles.indexBtn} data-cursor="OPEN" onClick={() => setOpenId(p.id)}>
              {p.index}
            </button>
          ))}
          <svg className={styles.indexArrow} viewBox="0 0 24 64" aria-hidden>
            <path d={DOWN.shaft} />
            <path d={DOWN.head} />
          </svg>
        </div>

        <div className={styles.row}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} seed={i + 1} hidden={openId === p.id} onOpen={setOpenId} />
          ))}
        </div>

      </section>

      <CadenceSpotlight onOpen={() => setOpenId('cadence')} />

      {openProject && createPortal(<ProjectModal project={openProject} onClosed={() => setOpenId(null)} />, document.body)}
    </>
  );
}
