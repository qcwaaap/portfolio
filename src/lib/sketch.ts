/**
 * Генераторы «нарисованной от руки» геометрии для SVG.
 * Всё детерминировано (seed) — на сервере и клиенте получается один и тот же путь,
 * поэтому hydration mismatch невозможен.
 */

export type Pt = readonly [number, number];

/** mulberry32 — маленький быстрый ГПСЧ */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n1 = (n: number) => Math.round(n * 10) / 10;
export const n3 = (n: number) => Math.round(n * 1000) / 1000;
const pt = (p: Pt) => `${n1(p[0])} ${n1(p[1])}`;

/** Catmull-Rom сплайн через точки → цепочка кубических Безье */
function spline(pts: Pt[]): string {
  const P = (i: number) => pts[Math.min(pts.length - 1, Math.max(0, i))]!;
  let d = `M${pt(P(0))}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = P(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d;
}

type CircleOpts = {
  /** сколько оборотов рисуем (1.09 = маркер чуть «переехал» точку старта) */
  sweep?: number;
  /** случайное дрожание радиуса, доля от r */
  jitter?: number;
  /** на сколько радиус «уплывает» от начала к концу линии */
  drift?: number;
  start?: number;
};

/** Круг, нарисованный от руки: неровный, не замкнутый идеально */
export function scribbleCircle(cx: number, cy: number, r: number, seed: number, opts: CircleOpts = {}) {
  const rand = rng(seed);
  const { sweep = 1.09, jitter = 0.012, drift = 0.025 } = opts;
  const start = opts.start ?? rand() * Math.PI * 2;
  const n = Math.max(8, Math.round(16 * Math.min(1, sweep) + 4));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + t * sweep * Math.PI * 2;
    const rr = r * (1 + drift * (t - 0.5) + (rand() - 0.5) * 2 * jitter);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return spline(pts);
}

type LineOpts = { wobble?: number; overshoot?: number };

/** Прямая, которую вели рукой: лёгкая волна и «пробег» за концы */
export function scribbleLine(a: Pt, b: Pt, seed: number, { wobble = 1.4, overshoot = 0 }: LineOpts = {}) {
  const rand = rng(seed);
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const s: Pt = [a[0] - ux * overshoot * rand(), a[1] - uy * overshoot * rand()];
  const e: Pt = [b[0] + ux * overshoot * rand(), b[1] + uy * overshoot * rand()];
  const k = Math.max(2, Math.round(len / 60));
  const pts: Pt[] = [s];
  for (let i = 1; i < k; i++) {
    const t = i / k;
    const off = (rand() - 0.5) * 2 * wobble;
    pts.push([s[0] + (e[0] - s[0]) * t + nx * off, s[1] + (e[1] - s[1]) * t + ny * off]);
  }
  pts.push(e);
  return spline(pts);
}

/** Ломаная с дрожанием точек (зигзаг маркером) */
export function scribblePoly(points: readonly Pt[], seed: number, wobble = 1.5) {
  const rand = rng(seed);
  return points
    .map((p, i) => {
      const q: Pt = [p[0] + (rand() - 0.5) * 2 * wobble, p[1] + (rand() - 0.5) * 2 * wobble];
      return `${i ? 'L' : 'M'}${pt(q)}`;
    })
    .join('');
}

/** Стрелка: изогнутое древко + отдельный путь для наконечника */
export function scribbleArrow(from: Pt, ctrl: Pt, to: Pt, seed: number, size = 11) {
  const rand = rng(seed);
  const shaft = `M${pt(from)}Q${pt(ctrl)} ${pt(to)}`;
  const ang = Math.atan2(to[1] - ctrl[1], to[0] - ctrl[0]);
  const wing = (spread: number): Pt => {
    const l = size * (0.9 + rand() * 0.25);
    return [to[0] - Math.cos(ang + spread) * l, to[1] - Math.sin(ang + spread) * l];
  };
  const head = `M${pt(wing(0.5))}L${pt(to)}L${pt(wing(-0.5))}`;
  return { shaft, head };
}

/** Звезда одной непрерывной линией (пентаграмма), рука чуть «перелетает» старт */
export function scribbleStar(cx: number, cy: number, r: number, seed: number) {
  const rand = rng(seed);
  const order = [0, 2, 4, 1, 3, 0, 2];
  return order
    .map((k, i) => {
      const a = -Math.PI / 2 + k * ((Math.PI * 2) / 5);
      const rr = r * (1 + (rand() - 0.5) * 0.12);
      return `${i ? 'L' : 'M'}${pt([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])}`;
    })
    .join('');
}

/**
 * Рваный нижний край для clip-path: два слоя — сам лист и светлая «бахрома» из волокон бумаги.
 * Край лежит внутри нижних 64px, которые выступают за экран (см. Loader.module.css),
 * поэтому пока лист не сдвинулся, разрыв не виден.
 */
export function tornClips(seed: number, steps = 52) {
  const rand = rng(seed);
  const sheet: number[] = [];
  const edge: number[] = [];
  let y = 0;
  for (let i = 0; i <= steps; i++) {
    y = y * 0.6 + (rand() - 0.5) * 20; // коррелированный шум — крупные «зубцы»
    const jag = (rand() - 0.5) * 6; // мелкая зазубренность
    sheet.push(y + jag);
    edge.push(y + jag * 0.5 + 4 + rand() * 4); // бахрома выступает на 4–8px
  }
  const build = (ys: number[], base: number) => {
    const pts = ['0 0', '100% 0'];
    for (let i = steps; i >= 0; i--) {
      pts.push(`${n1((i / steps) * 100)}% calc(100% - ${n1(base - ys[i]!)}px)`);
    }
    return `polygon(${pts.join(',')})`;
  };
  return { sheet: build(sheet, 30), edge: build(edge, 30) };
}
