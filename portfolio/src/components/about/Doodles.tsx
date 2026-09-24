import { n3, scribbleArrow, scribbleCurve, type Pt } from '@/lib/sketch';

const P = (x: number, y: number): Pt => [x, y];
const inkProps = { fill: 'none', stroke: 'var(--ink)', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Сердечко одной линией. Рисуется при появлении (data-draw). */
export function HeartDoodle({ className, color = 'var(--ink)' }: { className?: string; color?: string }) {
  const d = scribbleCurve(
    [P(15, 26), P(5, 16), P(3, 8), P(9, 3), P(15, 9), P(21, 3), P(27, 7), P(25, 16), P(15, 26), P(11, 20)],
    41,
    0.6,
  );
  return (
    <svg className={className} viewBox="0 0 30 29" aria-hidden style={{ overflow: 'visible' }}>
      <path d={d} {...inkProps} stroke={color} strokeWidth={1.8} pathLength={1} data-doodle="" />
    </svg>
  );
}

/** Спиралька-каракуля. */
export function SpiralDoodle({ className }: { className?: string }) {
  const pts: Pt[] = [];
  for (let i = 0; i <= 38; i++) {
    const t = i * 0.32;
    pts.push(P(30 + Math.cos(t) * (1.5 + t * 1.75), 30 + Math.sin(t) * (1.5 + t * 1.75)));
  }
  return (
    <svg className={className} viewBox="0 0 60 60" aria-hidden style={{ overflow: 'visible' }}>
      <path d={scribbleCurve(pts, 42, 0.4)} {...inkProps} strokeWidth={1.6} pathLength={1} data-doodle="" />
    </svg>
  );
}

/** Двусторонняя стрелка рядом со ссылкой github. */
export function DoubleArrow({ className }: { className?: string }) {
  const a = scribbleArrow([6, 22], [30, 16], [52, 6], 43, 7);
  const b = scribbleArrow([52, 6], [30, 16], [6, 22], 44, 7);
  return (
    <svg className={className} viewBox="0 0 58 28" aria-hidden style={{ overflow: 'visible' }}>
      <path d={a.shaft} {...inkProps} strokeWidth={1.6} />
      <path d={a.head} {...inkProps} strokeWidth={1.6} />
      <path d={b.head} {...inkProps} strokeWidth={1.6} />
    </svg>
  );
}

/** Спящая собачка: свернулась клубком, над ней плывут «z». */
export function SleepingDog({ className }: { className?: string }) {
  let seed = 400;
  const path = (pts: Pt[], w = 3) => {
    seed += 1;
    return (
      <path
        key={seed}
        d={scribbleCurve(pts, seed, 0.7)}
        {...inkProps}
        strokeWidth={w}
        pathLength={1}
        data-doodle=""
        data-delay={n3((seed - 400) * 0.05)}
      />
    );
  };
  return (
    <svg className={className} viewBox="0 0 130 84" aria-hidden style={{ overflow: 'visible' }}>
      {path([P(16, 60), P(22, 34), P(52, 22), P(88, 28), P(110, 46), P(104, 64)])}
      {path([P(22, 66), P(56, 70), P(104, 64)])}
      {path([P(10, 46), P(14, 34), P(28, 32), P(36, 44), P(32, 58), P(18, 62), P(8, 56), P(10, 46)])}
      {path([P(14, 36), P(9, 16), P(26, 30)], 2.8)}
      {path([P(28, 32), P(38, 16), P(40, 38)], 2.8)}
      {path([P(18, 46), P(22, 49), P(26, 46)], 2)}
      {path([P(8, 52), P(3, 56), P(8, 60)], 2.4)}
      {path([P(104, 58), P(120, 62), P(124, 50)], 3)}
      {path([P(28, 66), P(40, 68)], 2.6)}
      <g className="zzz" fill="var(--ink)" style={{ fontFamily: 'var(--font-hand, cursive)' }}>
        <text x={30} y={22} fontSize={15} data-z="1">z</text>
        <text x={42} y={12} fontSize={19} data-z="2">z</text>
        <text x={56} y={0} fontSize={24} data-z="3">Z</text>
      </g>
    </svg>
  );
}
