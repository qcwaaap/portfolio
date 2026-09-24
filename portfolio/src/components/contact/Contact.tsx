'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DoubleArrow, HeartDoodle, SleepingDog } from '@/components/about/Doodles';
import { Item } from '@/components/collage/Item';
import { Photo } from '@/components/collage/Photo';
import { TornEdge } from '@/components/collage/TornEdge';
import { useParallax } from '@/components/collage/useParallax';
import { CONTACTS } from '@/content/contact';
import { PHOTOS } from '@/content/photos';
import styles from './Contact.module.css';

gsap.registerPlugin(ScrollTrigger);

// пустые ссылки видны только в dev (пунктиром), чтобы не забыть их заполнить
const VISIBLE = CONTACTS.filter((c) => c.href || process.env.NODE_ENV !== 'production');

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  useParallax(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const once = (trigger: Element, start = 'top 85%') => ({ trigger, start, once: true });

      q('[data-enter]').forEach((node) => {
        const r0 = Number(gsap.getProperty(node, 'rotation'));
        gsap.from(node, { x: 150, y: 30, rotation: r0 + 9, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: once(node) });
      });

      // заголовок: две строки вкатываются с разным сдвигом
      q('[data-connect] span').forEach((span, i) => {
        gsap.from(span, { opacity: 0, x: -40 - i * 20, duration: 0.9, delay: i * 0.12, ease: 'power3.out', scrollTrigger: once(root, 'top 60%') });
      });

      // ссылки появляются друг за другом
      gsap.from(q('[data-link]'), {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: once(q('[data-link]')[0] ?? root, 'top 88%'),
      });

      q('[data-doodle]').forEach((node) => {
        const delay = Number((node as HTMLElement).dataset.delay ?? 0);
        gsap.set(node, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });
        gsap
          .timeline({ scrollTrigger: once(node, 'top 92%'), delay })
          .set(node, { opacity: 1 })
          .to(node, { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="contact" className={styles.contact} aria-label="Contact">
      <TornEdge seed={15} tone="#e4e0d5" />

      <h2 className={styles.connect} data-connect="">
        <span>let&apos;s</span>
        <span>connect</span>
      </h2>

      <Item className={styles.heart} depth={0.5} rotate={8}>
        <HeartDoodle className={styles.doodleSvg} />
      </Item>

      <Item className={styles.arrow} depth={0.4} rotate={4}>
        <DoubleArrow className={styles.doodleSvg} />
      </Item>

      <ul className={styles.links}>
        {VISIBLE.map((c) => (
          <li key={c.id} data-link="">
            {c.href ? (
              <a href={c.href} {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                {c.label}
              </a>
            ) : (
              <span className={styles.todo} title="add the link in src/content/contact.ts">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ul>

      <Item className={styles.lake} depth={0.9} rotate={4} enter="right" z={2}>
        <Photo {...PHOTOS.lake} tone="lake" ratio="4 / 3" frame="polaroid" tapes={['top']} />
      </Item>

      <Item className={styles.dog} depth={0.7} rotate={-3}>
        <SleepingDog className={styles.dogSvg} />
      </Item>

      <footer className={styles.footer}>
        <TornEdge seed={21} tone="#2b2a27" />
        <p className={styles.copy}>© 2026 Maria Nedbailova</p>
        <a href="#top" className={styles.top}>
          back to top ↑
        </a>
        <div className={styles.checker} aria-hidden />
      </footer>
    </section>
  );
}
