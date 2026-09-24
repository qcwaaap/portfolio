import { n3, scribbleCircle, scribbleCurve, scribblePoly, type Pt } from '@/lib/sketch';
import styles from './Hero.module.css';

const P = (x: number, y: number): Pt => [x, y];

/** Собачка-каракуля, идёт влево. Хвост — отдельная группа (виляет при наведении). */
export function DogDoodle() {
  let seed = 200;
  let at = 2.7;
  const stroke = (d: string, w = 3.2, color?: string) => {
    seed += 1;
    at += 0.07;
    return (
      <path
        key={seed}
        d={d}
        pathLength={1}
        strokeWidth={w}
        style={color ? { stroke: color } : undefined}
        data-draw=""
        data-at={n3(at)}
        data-dur="0.4"
      />
    );
  };

  return (
    <svg className={styles.dogSvg} viewBox="0 0 140 116" aria-hidden data-part="dog">
      {stroke(scribbleCurve([P(46, 40), P(66, 44), P(90, 42), P(112, 40), P(120, 34)], seed, 0.8))}
      {stroke(scribbleCurve([P(112, 40), P(116, 58), P(112, 70)], seed, 0.8))}
      {stroke(scribbleCurve([P(50, 70), P(72, 73), P(96, 70), P(112, 70)], seed, 0.8))}
      {stroke(scribbleCurve([P(44, 44), P(50, 58), P(50, 70)], seed, 0.8))}
      {stroke(scribbleCircle(30, 38, 18, seed, { sweep: 1.05, jitter: 0.03 }), 3.4)}
      {stroke(scribblePoly([P(19, 26), P(14, 6), P(30, 20)], seed, 0.6))}
      {stroke(scribblePoly([P(36, 20), P(47, 4), P(48, 28)], seed, 0.6))}
      {stroke(scribbleCurve([P(13, 42), P(8, 46), P(12, 52), P(22, 52)], seed, 0.5))}
      {stroke(scribbleCurve([P(56, 72), P(54, 96), P(46, 100)], seed, 0.8))}
      {stroke(scribbleCurve([P(68, 73), P(70, 98), P(62, 102)], seed, 0.8))}
      {stroke(scribbleCurve([P(100, 70), P(102, 96), P(94, 100)], seed, 0.8))}
      {stroke(scribbleCurve([P(112, 68), P(120, 92), P(112, 98)], seed, 0.8))}
      {stroke(scribbleCurve([P(78, 52), P(88, 50), P(90, 58), P(80, 60), P(78, 52)], seed, 0.6), 2.4)}
      {stroke(scribbleCurve([P(18, 53), P(19, 60), P(24, 58)], seed, 0.3), 3, 'var(--pink)')}

      {/* хвост: начало в (120,34) → рисуем вокруг нуля, чтобы вращать вокруг основания */}
      <g transform="translate(120 34)">
        <g data-part="tail">
          {stroke(scribbleCurve([P(0, 0), P(10, -12), P(8, -24), P(2, -28)], seed, 0.6))}
        </g>
      </g>

      <circle cx={26} cy={34} r={2.4} className={styles.fillInk} data-fade="" data-at="3.4" data-dur="0.3" />
      <circle cx={10} cy={45} r={3.2} className={styles.fillInk} data-fade="" data-at="3.4" data-dur="0.3" />
    </svg>
  );
}
