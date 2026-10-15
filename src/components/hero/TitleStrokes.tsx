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
  jitter: 3.6,
  overshoot: 12,
  fx: (i) => ({ rot: [-7, 5, -4, 6, -8][i], dy: [-8, 9, -12, 7, -3][i] }),
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
  jitter: 1.8,
  overshoot: 6,
  fx: (i) => ({ rot: [-3, 2, -2, 3, -2, 3, -3, 2, -2, 3][i], dy: 5 * Math.sin(i * 0.9) }),
});

/**
 * Заголовок, нарисованный штрихами, — два слоя: MARIA лежит за фото, NEDBAILOVA поверх него.
 * Штрихи рисует GSAP через stroke-dashoffset (pathLength=1).
 */
/** `letters` — какие буквы слова рисовать (чтобы часть букв лежала поверх фото, часть за ним) */
export function TitleMaria({ letters }: { letters?: readonly number[] }) {
  return (
    <svg className={styles.titleSvg} viewBox="-16 -34 706 256" aria-hidden>
      <g data-word="maria">
        {MARIA.strokes.map((s, i) =>
          !letters || letters.includes(s.letter) ? (
            <path key={i} d={s.d} pathLength={1} strokeWidth={s.width} strokeOpacity={s.opacity} />
          ) : null,
        )}
      </g>
    </svg>
  );
}

export function TitleNed() {
  return (
    <svg className={styles.titleSvg} viewBox="58 180 632 102" aria-hidden>
      <g data-word="ned">
        {NED.strokes.map((s, i) => (
          <path key={i} d={s.d} pathLength={1} strokeWidth={s.width} strokeOpacity={s.opacity} />
        ))}
      </g>
    </svg>
  );
}
