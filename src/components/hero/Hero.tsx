'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Item, type Enter } from '@/components/collage/Item';
import { Photo } from '@/components/collage/Photo';
import { StarDoodle } from '@/components/loader/Doodles';
import { PHOTOS } from '@/content/photos';
import { BikeDoodle } from './BikeDoodle';
import { DogDoodle } from './DogDoodle';
import { InternetNote, PinkLoop, ScrollSticker } from './Doodles';
import { TitleStrokes } from './TitleStrokes';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

type Fly = { x: number; y: number; r: number; scale?: number };
const FLY: Record<Enter, Fly> = {
  left: { x: -180, y: 30, r: -10 },
  right: { x: 180, y: 30, r: 10 },
  top: { x: 0, y: -160, r: 7 },
  bottom: { x: 0, y: 160, r: -7 },
  pop: { x: 0, y: 0, r: -16, scale: 0.5 },
};

const data = (node: Element) => (node as HTMLElement | SVGElement).dataset;

export function Hero({ revealed }: { revealed: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reducedRef = useRef(false);

  // ── сборка: параллакс, вход, взаимодействия ──
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const mobile = window.matchMedia('(max-width: 820px)').matches;
    reducedRef.current = reduced;
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      // 1. параллакс от скролла: предметы уезжают вверх с разной скоростью
      q('[data-scroll]').forEach((node) => {
        const depth = Number(data(node).scroll ?? 0);
        gsap.to(node, {
          y: -depth * (mobile ? 40 : 110),
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
      });

      // 2. параллакс от мыши (только там, где есть мышь)
      if (fine && !reduced) {
        const movers = q('[data-depth]').map((node) => ({
          d: Number(data(node).depth ?? 0),
          x: gsap.quickTo(node, 'x', { duration: 0.9, ease: 'power3' }),
          y: gsap.quickTo(node, 'y', { duration: 0.9, ease: 'power3' }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          movers.forEach((m) => {
            m.x(-nx * m.d * 16);
            m.y(-ny * m.d * 10);
          });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        cleanups.push(() => window.removeEventListener('pointermove', onMove));
      }

      // 3. вход: собираем на паузе, играем, когда лоадер начал уходить
      const tl = gsap.timeline({ paused: true });
      tlRef.current = tl;

      // 3a. фото и предметы влетают с разных сторон
      q('[data-enter]').forEach((node, i) => {
        const fly = FLY[data(node).enter as Enter];
        if (!fly) return;
        const r0 = Number(gsap.getProperty(node, 'rotation'));
        tl.from(
          node,
          { x: fly.x, y: fly.y, rotation: r0 + fly.r, scale: fly.scale ?? 1, opacity: 0, duration: 1.1, ease: 'power3.out' },
          0.05 + i * 0.07,
        );
      });

      // 3b. заголовок рисуется штрихами: сначала MARIA, потом NEDBAILOVA
      const maria = q('[data-word="maria"] path');
      const ned = q('[data-word="ned"] path');
      // нерисованные штрихи прячем, иначе круглые «кончики» маркера видны точками до начала рисования
      gsap.set([...maria, ...ned], { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });
      const write = (nodes: Element[], at: number, duration: number, stagger: number) => {
        tl.to(nodes, { opacity: 1, duration: 0.01, ease: 'none', stagger }, at);
        tl.to(nodes, { strokeDashoffset: 0, duration, ease: 'power2.inOut', stagger }, at);
      };
      write(maria, 0.5, 0.5, 0.03);
      write(ned, 1.6, 0.4, 0.018);

      // 3c. штрихи и подписи, у которых есть свои тайминги (data-at / data-dur в секундах)
      q('[data-draw]').forEach((node) => {
        const at = Number(data(node).at ?? 0);
        gsap.set(node, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });
        tl.set(node, { opacity: 1 }, at).to(node, { strokeDashoffset: 0, duration: Number(data(node).dur ?? 0.5), ease: 'power1.inOut' }, at);
      });
      q('[data-fade]').forEach((node) => {
        tl.fromTo(node, { opacity: 0 }, { opacity: 1, duration: Number(data(node).dur ?? 0.4), ease: 'power1.out' }, Number(data(node).at ?? 0));
      });

      // 3d. велосипед заезжает слева, заднее колесо крутится и замедляется
      const wheel = root.querySelector('[data-part="hero-wheel"]');
      const ride = root.querySelector('[data-part="hero-ride"]');
      const spin = { enter: 0, scroll: 0 };
      const applySpin = () => wheel?.setAttribute('transform', `rotate(${((spin.enter + spin.scroll) % 360).toFixed(2)})`);
      if (ride) {
        const dist = Math.min(window.innerWidth * 0.6, 900);
        tl.fromTo(ride, { x: -dist }, { x: 0, duration: 2.4, ease: 'power3.out' }, 0.9);
        tl.fromTo(spin, { enter: 0 }, { enter: 1100, duration: 2.4, ease: 'power3.out', onUpdate: applySpin }, 0.9);
      }
      // скролл тоже крутит колесо
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          spin.scroll = self.progress * 540;
          applySpin();
        },
      });

      // 4. собака: виляет хвостом при наведении
      const dog = root.querySelector('[data-part="dog"]');
      const tail = root.querySelector('[data-part="tail"]');
      if (dog && tail) {
        const wag = { a: 0 };
        const setTail = () => tail.setAttribute('transform', `rotate(${wag.a.toFixed(1)})`);
        const onEnter = () => {
          gsap.killTweensOf(wag);
          gsap.fromTo(
            wag,
            { a: -14 },
            {
              a: 16,
              duration: 0.11,
              repeat: 7,
              yoyo: true,
              ease: 'sine.inOut',
              onUpdate: setTail,
              onComplete: () => {
                gsap.to(wag, { a: 0, duration: 0.2, onUpdate: setTail });
              },
            },
          );
        };
        const host = dog.closest('[data-cursor]') ?? dog;
        host.addEventListener('pointerenter', onEnter);
        cleanups.push(() => host.removeEventListener('pointerenter', onEnter));
      }
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
      tlRef.current = null;
    };
  }, []);

  // ── старт входа ──
  useEffect(() => {
    if (!revealed) return;
    const tl = tlRef.current;
    if (!tl) return;
    if (reducedRef.current) tl.progress(1);
    else tl.play();
  }, [revealed]);

  return (
    <section ref={rootRef} className={styles.hero} id="top" aria-label="Intro">
      <h1 className={styles.srOnly}>Maria Nedbailova — fullstack developer</h1>

      <nav className={styles.nav} aria-label="Main" data-fade="" data-at="3" data-dur="0.6">
        <a href="#top" aria-label="Home" className={styles.navStar}>
          <StarDoodle className={styles.navStarSvg} seed={2} at={3} dur={0.01} />
        </a>
        <a href="#work">work</a>
        <a href="#about">about</a>
        <a href="#contact">contact</a>
      </nav>
      <p className={styles.meta} data-fade="" data-at="3" data-dur="0.6">
        SPB / REMOTE
        <br />
        2026
      </p>

      <Item className={styles.mountains} depth={0.5} rotate={-3.5} enter="left" z={2}>
        <Photo {...PHOTOS.mountains} tone="mountains" ratio="5 / 4" tapes={['tr', 'bl']} />
      </Item>

      <Item className={styles.title} depth={0.3} z={3}>
        <TitleStrokes />
      </Item>
      <Item className={styles.star1} depth={0.6} rotate={12}>
        <StarDoodle className={styles.starSvg} seed={4} at={2.6} dur={0.5} />
      </Item>

      <Item className={styles.tagline} depth={0.4} rotate={-2}>
        <p className={styles.taglineText} data-fade="" data-at="2.7" data-dur="0.6">
          fullstack developer
        </p>
      </Item>
      <Item className={styles.loop} depth={0.4} z={3}>
        <PinkLoop />
      </Item>

      <Item className={styles.dog} depth={0.9} enter="left" z={3}>
        <div className={styles.dogHost} data-cursor="PET">
          <DogDoodle />
        </div>
      </Item>
      <Item className={styles.starPink} depth={0.8} rotate={-10}>
        <StarDoodle className={styles.starSvg} color="var(--pink)" seed={9} at={3.2} dur={0.5} />
      </Item>

      <Item className={styles.bike} depth={0.7} z={3}>
        <BikeDoodle />
      </Item>

      <Item className={styles.note} depth={0.6}>
        <InternetNote />
      </Item>
      <Item className={styles.flowers} depth={0.8} rotate={5} enter="top" z={2}>
        <Photo {...PHOTOS.flowers} tone="flowers" ratio="4 / 3" tapes={['top']} />
      </Item>
      <Item className={styles.dogs} depth={1} rotate={-2} enter="right" z={3}>
        <Photo {...PHOTOS.dogs} tone="dogs" ratio="4 / 3" frame="polaroid" tapes={['tl', 'tr']} />
      </Item>
      <Item className={styles.landscape} depth={1.2} rotate={3.5} enter="bottom" z={4}>
        <Photo {...PHOTOS.landscape} tone="landscape" ratio="4 / 3" tapes={['tr', 'bl']} labelSide="left" />
      </Item>
      <Item className={styles.sticker} depth={1.1} rotate={-7} enter="pop" z={5}>
        <ScrollSticker />
      </Item>
    </section>
  );
}
