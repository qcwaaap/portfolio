import { layoutWord } from '@/lib/handFont';
import styles from './Hero.module.css';

// MARIA — крупно, грубо, с потёками; NEDBAILOVA — аккуратнее, шире, правее (как в референсе)
const MARIA = layoutWord('MARIA', {
  x: 0,
  y: 0,
  h: 170,
  unit: 118,
  gap: 20,
  seed: 11,
  weight: 15,
  jitter: 2.4,
  overshoot: 7,
  drips: [
    { letter: 0, u: 0.06, len: 24 },
    { letter: 2, u: 0.94, len: 16 },
    { letter: 4, u: 0.97, len: 28 },
  ],
});

const NED = layoutWord('NEDBAILOVA', {
  x: 74,
  y: 196,
  h: 62,
  unit: 52,
  gap: 9,
  seed: 29,
  weight: 7,
  jitter: 1.1,
  overshoot: 3,
});

/** Заголовок, нарисованный штрихами. Штрихи рисует GSAP через stroke-dashoffset (pathLength=1). */
export function TitleStrokes() {
  return (
    <svg className={styles.titleSvg} viewBox="-16 -18 706 300" aria-hidden>
      <g data-word="maria">
        {MARIA.strokes.map((s, i) => (
          <path key={i} d={s.d} pathLength={1} strokeWidth={s.width} strokeOpacity={s.opacity} />
        ))}
      </g>
      <g data-word="ned">
        {NED.strokes.map((s, i) => (
          <path key={i} d={s.d} pathLength={1} strokeWidth={s.width} strokeOpacity={s.opacity} />
        ))}
      </g>
    </svg>
  );
}
