import { forwardRef, memo } from 'react';
import { n3, rng, scribbleArrow, scribbleCircle, scribbleLine, scribblePoly, type Pt } from '@/lib/sketch';
import styles from './Bicycle.module.css';

/**
 * Нарисованный от руки велосипед.
 *
 * Каждый штрих сам объявляет, В КАКОЙ МОМЕНТ прогресса он рисуется:
 *   data-draw  → штрих «дорисовывается» (stroke-dashoffset 1 → 0)
 *   data-fade  → объект проявляется (opacity 0 → 1)
 *   data-at / data-dur → начало и длительность в долях прогресса (0..1)
 * Loader собирает из этих атрибутов один scrub-таймлайн. Хочешь поменять порядок
 * рисования — правишь числа здесь, а не логику анимации.
 *
 * Части, которыми Loader управляет напрямую (data-part):
 *   bike · rear-wheel · spokes · blur · notes
 */

// ── ключевые точки рамы (viewBox 660×380, начало по y = 40) ──────────────────
const R: Pt = [172, 278]; // задняя втулка
const F: Pt = [468, 278]; // передняя втулка
const BB: Pt = [302, 296]; // каретка
const S: Pt = [262, 152]; // верх подседельной трубы
const SS: Pt = [260, 168]; // крепление верхнего пера
const H1: Pt = [412, 146]; // верх рулевой
const H2: Pt = [424, 178]; // низ рулевой
const WHEEL_R = 108;

type StrokeProps = { d: string; at: number; dur: number; w?: number; opacity?: number };

function Stroke({ d, at, dur, w = 4, opacity }: StrokeProps) {
  return (
    <path
      d={d}
      pathLength={1}
      strokeWidth={w}
      strokeOpacity={opacity}
      data-draw=""
      data-at={n3(at)}
      data-dur={n3(dur)}
    />
  );
}

/** Труба: основной жирный штрих + тонкий «призрак» рядом — как будто обвели дважды */
function Tube({ a, b, seed, at, dur, w }: { a: Pt; b: Pt; seed: number; at: number; dur: number; w: number }) {
  return (
    <>
      <Stroke d={scribbleLine(a, b, seed, { wobble: 1.2, overshoot: 3 })} at={at} dur={dur} w={w} />
      <Stroke
        d={scribbleLine([a[0] + 1.4, a[1] - 1.1], [b[0] - 1, b[1] + 1.3], seed + 101, { wobble: 1.8, overshoot: 4 })}
        at={at + 0.004}
        dur={dur}
        w={w * 0.38}
        opacity={0.6}
      />
    </>
  );
}

const TUBES: ReadonlyArray<{ a: Pt; b: Pt; at: number; dur: number; w: number }> = [
  { a: S, b: BB, at: 0.16, dur: 0.045, w: 5.5 }, //   подседельная
  { a: S, b: H1, at: 0.18, dur: 0.05, w: 5.5 }, //    верхняя
  { a: H2, b: BB, at: 0.2, dur: 0.055, w: 6 }, //     нижняя
  { a: BB, b: R, at: 0.22, dur: 0.035, w: 4.5 }, //   нижнее перо
  { a: SS, b: R, at: 0.23, dur: 0.035, w: 3.5 }, //   верхнее перо
  { a: H2, b: F, at: 0.245, dur: 0.035, w: 4.5 }, //  вилка
  { a: H1, b: H2, at: 0.255, dur: 0.02, w: 8 }, //    рулевая
  { a: S, b: [257, 124], at: 0.265, dur: 0.015, w: 4 }, // подседельный штырь
  { a: H1, b: [408, 120], at: 0.265, dur: 0.015, w: 4 }, // вынос
  { a: BB, b: [284, 334], at: 0.28, dur: 0.015, w: 4 }, // шатун
  { a: BB, b: [320, 258], at: 0.285, dur: 0.015, w: 4 }, // шатун
];

/** Колесо. Всё нарисовано вокруг (0,0) — родитель переносит в центр втулки. */
function Wheel({ seed, at, rotating = false }: { seed: number; at: number; rotating?: boolean }) {
  const rand = rng(seed);

  // 12 спиц с «перекрёстной» шнуровкой: начало смещено по касательной, конец на ободе
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const ang = ((i * 30 + (rand() - 0.5) * 5) * Math.PI) / 180;
    const a0 = ang + (i % 2 ? 0.6 : -0.6);
    return scribbleLine([Math.cos(a0) * 8, Math.sin(a0) * 8], [Math.cos(ang) * 103, Math.sin(ang) * 103], seed * 7 + i, {
      wobble: 1,
      overshoot: 1,
    });
  });

  // Дуги-«смазывание»: проступают на большой скорости, когда спицы уже не различить
  const blur = [40, 55, 62, 80, 90, 96].map((r, i) =>
    scribbleCircle(0, 0, r, seed + 40 + i, { sweep: 0.13 + (i % 3) * 0.04, jitter: 0.008, drift: 0.01, start: i * 1.7 }),
  );

  const teeth = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return `M${(c * 11).toFixed(1)} ${(s * 11).toFixed(1)}L${(c * 15.5).toFixed(1)} ${(s * 15.5).toFixed(1)}`;
  }).join('');

  return (
    <g data-part={rotating ? 'rear-wheel' : undefined}>
      <g data-part={rotating ? 'spokes' : undefined}>
        {spokes.map((d, i) => (
          <Stroke key={i} d={d} at={at + 0.05 + i * 0.004} dur={0.03} w={1.7} />
        ))}
      </g>

      {rotating && (
        <g data-part="blur" opacity={0}>
          {blur.map((d, i) => (
            <path key={i} d={d} strokeWidth={2.6} strokeOpacity={0.55} />
          ))}
        </g>
      )}

      {/* покрышка: два неровных витка, центр смещён от втулки → колесо слегка «бьёт» при вращении */}
      <Stroke d={scribbleCircle(1.6, -1.1, WHEEL_R, seed)} at={at} dur={0.09} w={5.5} />
      <Stroke d={scribbleCircle(-1.3, 1.4, WHEEL_R - 3.5, seed + 3, { sweep: 1.06 })} at={at + 0.02} dur={0.08} w={2.2} opacity={0.6} />

      {rotating && (
        <g data-fade="" data-at={n3(at + 0.1)} data-dur="0.03">
          <circle r={11} strokeWidth={2.6} />
          <path d={teeth} strokeWidth={2.4} />
        </g>
      )}
      <circle r={6} className={styles.fill} data-fade="" data-at={n3(at + 0.1)} data-dur="0.03" />
    </g>
  );
}

/** Подписи-аннотации от руки: «этот крутится / этот нет». */
function Notes() {
  const a1 = scribbleArrow([92, 136], [128, 130], [118, 172], 11);
  const a2 = scribbleArrow([572, 98], [604, 138], [556, 178], 12);
  return (
    <g data-part="notes">
      <g data-fade="" data-at="0.3" data-dur="0.05">
        <text x={22} y={118} transform="rotate(-5 22 118)">
          this one spins
        </text>
        <path d={a1.shaft} strokeWidth={2.2} />
        <path d={a1.head} strokeWidth={2.2} />
      </g>
      <g data-fade="" data-at="0.38" data-dur="0.05">
        <text x={448} y={86} transform="rotate(4 448 86)">
          this one doesn&apos;t
        </text>
        <path d={a2.shaft} strokeWidth={2.2} />
        <path d={a2.head} strokeWidth={2.2} />
      </g>
    </g>
  );
}

type BicycleProps = { className?: string };

export const Bicycle = memo(
  forwardRef<SVGSVGElement, BicycleProps>(function Bicycle({ className }, ref) {
    const ground = scribblePoly(
      [
        [60, 394],
        [190, 384],
        [168, 398],
        [330, 383],
        [312, 397],
        [470, 382],
        [452, 396],
        [590, 386],
      ],
      5,
      1.4,
    );

    return (
      <svg
        ref={ref}
        className={`${styles.svg} ${className ?? ''}`}
        viewBox="-10 40 660 380"
        role="img"
        aria-label="Hand-drawn bicycle"
      >
        {/* земля — синий маркер, как в референсе; не двигается вместе с великом */}
        <path d={ground} className={styles.ground} strokeWidth={8} pathLength={1} data-draw="" data-at="0" data-dur="0.07" />

        <g data-part="bike">
          {/* заднее колесо — единственное вращающееся */}
          <g transform={`translate(${R[0]} ${R[1]})`}>
            <Wheel seed={21} at={0.04} rotating />
          </g>

          {/* переднее колесо — всегда неподвижно */}
          <g transform={`translate(${F[0]} ${F[1]})`}>
            <Wheel seed={34} at={0.1} />
          </g>

          {TUBES.map((t, i) => (
            <Tube key={i} {...t} seed={50 + i * 3} />
          ))}

          {/* седло и руль (дропы — привет Cadence) */}
          <Stroke d="M230 121Q264 110 300 118" at={0.268} dur={0.015} w={9} />
          <Stroke d="M394 119Q418 106 446 112Q458 119 453 135" at={0.268} dur={0.02} w={4.5} />

          {/* система: звезда, педали, цепь */}
          <Stroke d={scribbleCircle(BB[0], BB[1], 26, 77, { sweep: 1.07 })} at={0.27} dur={0.03} w={3.5} />
          <Stroke d={scribbleLine([270, 337], [298, 334], 80)} at={0.288} dur={0.01} w={6} />
          <Stroke d={scribbleLine([307, 255], [335, 258], 81)} at={0.29} dur={0.01} w={6} />
          <g data-fade="" data-at="0.28" data-dur="0.02">
            <path d={scribbleLine([BB[0] + 3, BB[1] - 26], [R[0] + 2, R[1] - 11], 90, { wobble: 1 })} className={styles.chain} strokeWidth={3} />
            <path d={scribbleLine([BB[0] - 2, BB[1] + 26], [R[0], R[1] + 11], 91, { wobble: 1 })} className={styles.chain} strokeWidth={3} />
          </g>
        </g>

        <Notes />
      </svg>
    );
  }),
);
