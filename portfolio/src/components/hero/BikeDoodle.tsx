import { BB, F, R, TUBES, WHEEL_R } from '@/components/loader/Bicycle';
import { rng, scribbleCircle, scribbleLine, scribblePoly, type Pt } from '@/lib/sketch';
import styles from './Hero.module.css';

/** Колесо вокруг (0,0): покрышка в два витка + 12 перекрёстных спиц. */
export function wheelPaths(seed: number) {
  const rand = rng(seed);
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const ang = ((i * 30 + (rand() - 0.5) * 5) * Math.PI) / 180;
    const a0 = ang + (i % 2 ? 0.6 : -0.6);
    return scribbleLine([Math.cos(a0) * 8, Math.sin(a0) * 8], [Math.cos(ang) * 103, Math.sin(ang) * 103], seed * 7 + i, {
      wobble: 1,
      overshoot: 1,
    });
  });
  return {
    spokes,
    tireA: scribbleCircle(1.6, -1.1, WHEEL_R, seed),
    tireB: scribbleCircle(-1.3, 1.4, WHEEL_R - 3.5, seed + 3, { sweep: 1.06 }),
  };
}

export const REAR = wheelPaths(21);
export const FRONT = wheelPaths(34);

const GROUND = scribblePoly(
  [
    [40, 396],
    [180, 384],
    [156, 400],
    [330, 383],
    [308, 399],
    [470, 380],
    [448, 398],
    [640, 384],
  ] as Pt[],
  5,
  1.6,
);

function Wheel({ p }: { p: ReturnType<typeof wheelPaths> }) {
  return (
    <>
      {p.spokes.map((d, i) => (
        <path key={i} d={d} strokeWidth={1.7} />
      ))}
      <path d={p.tireA} strokeWidth={5.5} />
      <path d={p.tireB} strokeWidth={2.2} strokeOpacity={0.6} />
      <circle r={6} className={styles.fillInk} />
    </>
  );
}

/** Рама, руль, седло, система, педали и цепь — общая для hero и секции Cadence. */
export function BikeFrame() {
  return (
    <>
      {TUBES.map((t, i) => (
          <g key={i}>
            <path d={scribbleLine(t.a, t.b, 50 + i * 3, { wobble: 1.2, overshoot: 3 })} strokeWidth={t.w} />
            <path
              d={scribbleLine([t.a[0] + 1.4, t.a[1] - 1.1], [t.b[0] - 1, t.b[1] + 1.3], 151 + i * 3, { wobble: 1.8, overshoot: 4 })}
              strokeWidth={t.w * 0.38}
              strokeOpacity={0.6}
            />
          </g>
        ))}
        <path d="M230 121Q264 110 300 118" strokeWidth={9} />
        <path d="M394 119Q418 106 446 112Q458 119 453 135" strokeWidth={4.5} />
        <path d={scribbleCircle(BB[0], BB[1], 26, 77, { sweep: 1.07 })} strokeWidth={3.5} />
        <path d={scribbleLine([270, 337], [298, 334], 80)} strokeWidth={6} />
        <path d={scribbleLine([307, 255], [335, 258], 81)} strokeWidth={6} />
        <path d={scribbleLine([BB[0] + 3, BB[1] - 26], [R[0] + 2, R[1] - 11], 90, { wobble: 1 })} strokeWidth={3} strokeDasharray="2 5" />
        <path d={scribbleLine([BB[0] - 2, BB[1] + 26], [R[0], R[1] + 11], 91, { wobble: 1 })} strokeWidth={3} strokeDasharray="2 5" />
    </>
  );
}

/**
 * Велосипед из лоадера, теперь в hero. Заднее колесо крутится (въезд + скролл),
 * переднее — всегда неподвижно.
 */
export function BikeDoodle() {
  return (
    <svg className={styles.bikeSvg} viewBox="-10 96 660 322" aria-hidden>
      <path
        d={GROUND}
        style={{ stroke: 'var(--blue)' }}
        strokeWidth={9}
        strokeOpacity={0.92}
        pathLength={1}
        data-draw=""
        data-at="1.6"
        data-dur="0.9"
      />
      <g data-part="hero-ride">
        <g transform={`translate(${R[0]} ${R[1]})`}>
          <g data-part="hero-wheel">
            <Wheel p={REAR} />
            <circle r={11} strokeWidth={2.6} />
          </g>
        </g>
        <g transform={`translate(${F[0]} ${F[1]})`}>
          <Wheel p={FRONT} />
        </g>

        <BikeFrame />
      </g>
    </svg>
  );
}
