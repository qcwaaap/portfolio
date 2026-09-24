/** Чистая математика загрузчика: прогресс → скорость колеса, стадии, время. */

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/**
 * Время → «желаемый» прогресс. Кусочно-линейно, чтобы каждая стадия получила своё время:
 * появление велосипеда (0–30%) ≈ 28% времени, раскрутка колеса (30–70%) ≈ 36%,
 * разгон (70–95%) ≈ 24%, финальный рывок (95–100%) ≈ 12%.
 */
const TIME_KEYS: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0.28, 0.3],
  [0.64, 0.7],
  [0.88, 0.95],
  [1, 1],
];

export function timeToProgress(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  for (let i = 1; i < TIME_KEYS.length; i++) {
    const [t1, p1] = TIME_KEYS[i]!;
    const [t0, p0] = TIME_KEYS[i - 1]!;
    if (t <= t1) return lerp(p0, p1, (t - t0) / (t1 - t0));
  }
  return 1;
}

/** Скорость заднего колеса, градусов в секунду. Полностью определяется прогрессом. */
export function wheelSpeed(p: number) {
  if (p < 0.3) return 0; //            велосипед ещё рисуется
  if (p < 0.7) return lerp(0, 150, Math.pow((p - 0.3) / 0.4, 1.4)); //  медленно трогается
  if (p < 0.95) return lerp(150, 620, Math.pow((p - 0.7) / 0.25, 2)); // разгоняется
  return lerp(620, 1000, smoothstep((p - 0.95) / 0.05)); //             финальный рывок
}

export const STAGES = [
  { from: 0, label: 'unfolding the bike' },
  { from: 0.3, label: 'warming up the back wheel' },
  { from: 0.7, label: 'pedalling a bit harder' },
  { from: 0.95, label: 'nearly there' },
  { from: 1, label: 'go' },
] as const;

export function stageAt(p: number) {
  let idx = 0;
  STAGES.forEach((s, i) => {
    if (p >= s.from) idx = i;
  });
  return idx;
}
