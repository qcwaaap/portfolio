import { rng, scribbleCircle, scribbleCurve, scribbleLine, type Pt } from '@/lib/sketch';

/** Всё рисуется в viewBox 600×600, центр колеса — (300, 300). */
export const CX = 300;
export const CY = 300;
export const TIRE_R = 196;

/** Диапазон тахометра: 0…120 rpm раскладывается по дуге от −125° до +125° (от «12 часов») */
export const RPM_MIN = 0;
export const RPM_MAX = 120;
export const SWEEP = 125;
export const rpmToAngle = (rpm: number) => -SWEEP + ((rpm - RPM_MIN) / (RPM_MAX - RPM_MIN)) * SWEEP * 2;

const polar = (r: number, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [Math.sin(a) * r, -Math.cos(a) * r];
};

/** Вращающаяся часть: покрышка, спицы, ступица, «звёздочка», метки на ободе. Центр в (0,0). */
export function wheelPaths() {
  const rand = rng(77);

  // 28 спиц с перекрёстной шнуровкой
  const spokes = Array.from({ length: 28 }, (_, i) => {
    const deg = (i * 360) / 28 + (rand() - 0.5) * 3;
    const side = i % 2 ? 1 : -1;
    return scribbleLine(polar(15, deg + side * 38), polar(TIRE_R - 6, deg), 500 + i, { wobble: 1.1, overshoot: 1.5 });
  });

  // зубцы звёздочки
  const teeth = Array.from({ length: 14 }, (_, i) => {
    const a = polar(30, (i * 360) / 14);
    const b = polar(38, (i * 360) / 14);
    return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }).join('');

  return {
    spokes,
    tireA: scribbleCircle(1.5, -1, TIRE_R, 61),
    tireB: scribbleCircle(-1.2, 1.4, TIRE_R - 6, 62, { sweep: 1.05 }),
    tireC: scribbleCircle(0.6, 0.4, TIRE_R + 5, 63, { sweep: 1.03, jitter: 0.006 }),
    hubRing: scribbleCircle(0, 0, 22, 64, { sweep: 1.08, jitter: 0.02 }),
    cog: scribbleCircle(0, 0, 30, 65, { sweep: 1.06, jitter: 0.015 }),
    teeth,
    slash: `M${polar(TIRE_R - 12, 34).join(' ')}L${polar(TIRE_R + 16, 38).join(' ')}`,
    valve: `M${polar(TIRE_R + 4, 302).join(' ')}L${polar(TIRE_R + 24, 302).join(' ')}`,
    tapeAt: 205,
  };
}

/** Статичное кольцо-тахометр: дуга, риски, подписи. */
export function ringPaths() {
  const ticks: { d: string; major: boolean }[] = [];
  for (let rpm = RPM_MIN; rpm <= RPM_MAX; rpm += 5) {
    const major = rpm % 30 === 0;
    const deg = rpmToAngle(rpm);
    const a = polar(236, deg);
    const b = polar(major ? 254 : 245, deg);
    ticks.push({ d: `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`, major });
  }
  const arcPts: Pt[] = [];
  for (let i = 0; i <= 24; i++) arcPts.push(polar(236, -SWEEP + (i / 24) * SWEEP * 2));
  const labels = [0, 30, 60, 90, 120].map((rpm) => {
    const p = polar(276, rpmToAngle(rpm));
    return { rpm, x: p[0], y: p[1] };
  });
  return { ticks, arc: scribbleCurve(arcPts, 71, 0.7), labels };
}

/** «Кардиограмма» педалирования: импульс на каждый оборот. f — доля периода (0..1). */
export const pedalPulse = (f: number) =>
  Math.exp(-(((f - 0.22) / 0.035) ** 2)) - 0.35 * Math.exp(-(((f - 0.29) / 0.04) ** 2)) + 0.28 * Math.exp(-(((f - 0.6) / 0.09) ** 2));

export const WAVE_W = 320;
export const WAVE_H = 70;
export const WAVE_CYCLES = 4;
export const WAVE_N = 96;
/** статичный «дрожащий» шум, чтобы линия выглядела нарисованной от руки */
export const WAVE_NOISE = (() => {
  const r = rng(91);
  return Array.from({ length: WAVE_N + 1 }, () => (r() - 0.5) * 2.2);
})();
export const WAVE_NOISE_2 = (() => {
  const r = rng(92);
  return Array.from({ length: WAVE_N + 1 }, () => (r() - 0.5) * 3);
})();

/** Строит путь волны для заданной фазы и амплитуды. */
export function wavePath(phase: number, amp: number, noise: number[], dy = 0) {
  let d = '';
  const base = WAVE_H * 0.62 + dy;
  for (let i = 0; i <= WAVE_N; i++) {
    const u = (i / WAVE_N) * WAVE_CYCLES + phase;
    const f = u - Math.floor(u);
    const x = (i / WAVE_N) * WAVE_W;
    const y = base - amp * pedalPulse(f) + noise[i]!;
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}
