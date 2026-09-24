'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Item, type Enter } from '@/components/collage/Item';
import { Photo } from '@/components/collage/Photo';
import { TornEdge } from '@/components/collage/TornEdge';
import { useParallax } from '@/components/collage/useParallax';
import { PHOTOS } from '@/content/photos';
import { HeartDoodle, SpiralDoodle } from './Doodles';
import { Skills } from './Skills';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const FLY: Record<Enter, { x: number; y: number; r: number; scale?: number }> = {
  left: { x: -140, y: 30, r: -9 },
  right: { x: 140, y: 30, r: 9 },
  top: { x: 0, y: -120, r: 6 },
  bottom: { x: 0, y: 130, r: -6 },
  pop: { x: 0, y: 0, r: -14, scale: 0.55 },
};

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  useParallax(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const once = (trigger: Element, start = 'top 85%') => ({ trigger, start, once: true });

      // фотографии влетают
      q('[data-enter]').forEach((node) => {
        const fly = FLY[(node as HTMLElement).dataset.enter as Enter];
        if (!fly) return;
        const r0 = Number(gsap.getProperty(node, 'rotation'));
        gsap.from(node, {
          x: fly.x,
          y: fly.y,
          rotation: r0 + fly.r,
          scale: fly.scale ?? 1,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: once(node),
        });
      });

      // текст выезжает
      q('[data-reveal]').forEach((node) => {
        gsap.from(node, { opacity: 0, y: 24, duration: 0.8, ease: 'power2.out', scrollTrigger: once(node, 'top 88%') });
      });

      // каракули (сердце, спираль) дорисовываются
      q('[data-doodle]').forEach((node) => {
        const delay = Number((node as HTMLElement).dataset.delay ?? 0);
        gsap.set(node, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });
        gsap
          .timeline({ scrollTrigger: once(node, 'top 90%'), delay })
          .set(node, { opacity: 1 })
          .to(node, { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' });
      });

      // навыки: маркер подчёркивает заголовок группы, потом бумажки «прилипают» одна за другой
      q('[data-skill-group]').forEach((group) => {
        const hl = group.querySelector('[data-hl]');
        const chips = group.querySelectorAll('[data-chip]');
        gsap
          .timeline({ scrollTrigger: once(group, 'top 82%') })
          .from(hl, { scaleX: 0, transformOrigin: '0 50%', duration: 0.55, ease: 'power2.out' })
          .from(
            chips,
            { scale: 1.45, rotation: (i) => (i % 2 ? 9 : -9), y: -14, opacity: 0, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.07 },
            0.25,
          );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="about" className={styles.about} aria-label="About and skills">
      <TornEdge seed={8} tone="var(--paper)" />

      {/* ── ABOUT ── */}
      <h2 className={styles.head1} data-reveal="">
        about me
      </h2>

      <Item className={styles.portrait} depth={0.6} rotate={-4} enter="left" z={2}>
        <Photo {...PHOTOS.portrait} tone="portrait" ratio="4 / 5" tapes={['tr', 'bl']} />
      </Item>
      <Item className={styles.cat} depth={1} rotate={5} enter="bottom" z={4}>
        <Photo {...PHOTOS.cat} tone="cat" ratio="3 / 4" tapes={['tl']} />
      </Item>
      <Item className={styles.spiral} depth={0.7} rotate={-8}>
        <SpiralDoodle className={styles.doodleSvg} />
      </Item>

      <div className={styles.text} data-reveal="">
        <p>I build web applications and enjoy figuring out what happens behind the interface.</p>
        <p className={styles.focus}>Currently focused on:</p>
        <ul>
          <li>Frontend / Fullstack</li>
          <li>React / TypeScript</li>
          <li>Python / Go</li>
        </ul>
      </div>

      <Item className={styles.heart} depth={0.5} rotate={8}>
        <HeartDoodle className={styles.doodleSvg} />
      </Item>

      <Item className={styles.note} depth={0.4} rotate={-6}>
        <p className={styles.noteText} data-reveal="">
          also love: bikes, dogs, good food and weird internet.
        </p>
      </Item>

      {/* ── SKILLS ── */}
      <h2 id="skills" className={styles.head2} data-reveal="">
        skills
      </h2>
      <div className={styles.skills}>
        <Skills />
      </div>

      <Item className={styles.window} depth={0.9} rotate={-7} enter="right" z={2}>
        <Photo {...PHOTOS.window} tone="window" ratio="4 / 3" tapes={['tl', 'br']} />
      </Item>
      <Item className={styles.windowNote} depth={0.5} rotate={-4}>
        <p className={styles.noteText} data-reveal="">
          different places
          <br />
          same internet
        </p>
      </Item>
    </section>
  );
}
