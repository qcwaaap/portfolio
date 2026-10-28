import type { Landmarks } from './faceTracker';

export type MaskId = 'dog' | 'bunny' | 'glasses' | 'mustache' | 'crown' | 'love';
export const MASKS: readonly MaskId[] = ['dog', 'bunny', 'glasses', 'mustache', 'crown', 'love'];

type P = { x: number; y: number };

/** Опорные точки лица в пикселях холста (уже с учётом зеркала и обрезки). */
export type Face = {
  eyes: P; // середина между глазами
  forehead: P;
  nose: P;
  lip: P; // под носом
  mouth: P; // центр рта
  cheekL: P;
  cheekR: P;
  templeL: P;
  templeR: P;
  roll: number; // наклон головы, рад
  unit: number; // расстояние между глазами, px — масштаб масок
  open: number; // 0..1, насколько открыт рот
};

export type CanvasMap = (nx: number, ny: number) => P;

const mid = (a: P, b: P): P => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** Landmarks MediaPipe → опорные точки. Индексы — из схемы face mesh (468 точек). */
export function toFace(lm: Landmarks, map: CanvasMap): Face {
  const at = (i: number) => map(lm[i]!.x, lm[i]!.y);
  const eyeA = mid(at(33), at(133));
  const eyeB = mid(at(263), at(362));
  const [l, r] = eyeA.x < eyeB.x ? [eyeA, eyeB] : [eyeB, eyeA];
  const unit = Math.hypot(r.x - l.x, r.y - l.y);
  const top = at(13);
  const bot = at(14);
  const [tA, tB] = [at(103), at(332)].sort((a, b) => a.x - b.x) as [P, P];
  const [cA, cB] = [at(205), at(425)].sort((a, b) => a.x - b.x) as [P, P];
  return {
    eyes: mid(l, r),
    forehead: at(10),
    nose: at(1),
    lip: at(164),
    mouth: mid(top, bot),
    cheekL: cA,
    cheekR: cB,
    templeL: tA,
    templeR: tB,
    roll: Math.atan2(r.y - l.y, r.x - l.x),
    unit,
    open: Math.min(1, Math.max(0, (Math.hypot(bot.x - top.x, bot.y - top.y) / unit - 0.04) * 5)),
  };
}

/** Сглаживание дрожания: двигаем прежние точки к новым. */
export function smoothFace(prev: Face | undefined, next: Face, k = 0.55): Face {
  if (!prev) return next;
  const lerp = (a: number, b: number) => a + (b - a) * k;
  const p = (a: P, b: P): P => ({ x: lerp(a.x, b.x), y: lerp(a.y, b.y) });
  return {
    eyes: p(prev.eyes, next.eyes),
    forehead: p(prev.forehead, next.forehead),
    nose: p(prev.nose, next.nose),
    lip: p(prev.lip, next.lip),
    mouth: p(prev.mouth, next.mouth),
    cheekL: p(prev.cheekL, next.cheekL),
    cheekR: p(prev.cheekR, next.cheekR),
    templeL: p(prev.templeL, next.templeL),
    templeR: p(prev.templeR, next.templeR),
    roll: lerp(prev.roll, next.roll),
    unit: lerp(prev.unit, next.unit),
    open: lerp(prev.open, next.open),
  };
}

const INK = '#171715';

/** Локальная система: начало в точке, повёрнута с головой, 100 единиц = расстояние между глазами. */
function local(ctx: CanvasRenderingContext2D, face: Face, at: P, fn: () => void, extraRot = 0) {
  ctx.save();
  ctx.translate(at.x, at.y);
  ctx.rotate(face.roll + extraRot);
  const s = face.unit / 100;
  ctx.scale(s, s);
  ctx.lineWidth = 4.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = INK;
  fn();
  ctx.restore();
}

const star = (ctx: CanvasRenderingContext2D, r: number) => {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
};

const heart = (ctx: CanvasRenderingContext2D, s: number) => {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s, -s * 0.2, -s * 0.55, -s, 0, -s * 0.45);
  ctx.bezierCurveTo(s * 0.55, -s, s, -s * 0.2, 0, s * 0.35);
  ctx.closePath();
};

const DRAW: Record<MaskId, (ctx: CanvasRenderingContext2D, f: Face, t: number) => void> = {
  dog(ctx, f) {
    const ear = (at: P, side: 1 | -1) =>
      local(ctx, f, at, () => {
        ctx.scale(side, 1);
        ctx.fillStyle = '#b9824f';
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.bezierCurveTo(-58, -8, -74, 62, -34, 104);
        ctx.bezierCurveTo(-4, 120, 30, 60, 22, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#7a4f2c';
        ctx.beginPath();
        ctx.ellipse(-24, 52, 12, 30, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }, side * 0.35);
    ear(f.templeL, 1);
    ear(f.templeR, -1);
    local(ctx, f, f.nose, () => {
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.ellipse(0, 4, 22, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(-7, 0, 6, 3.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
    });
    if (f.open > 0.2) {
      local(ctx, f, f.mouth, () => {
        ctx.fillStyle = '#f06ba8';
        ctx.beginPath();
        ctx.roundRect(-16, 4 + f.open * 8, 32, 40 + f.open * 22, 16);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 12 + f.open * 8);
        ctx.lineTo(0, 36 + f.open * 14);
        ctx.stroke();
      });
    }
  },

  bunny(ctx, f) {
    const ear = (dx: number, tilt: number) =>
      local(ctx, f, f.forehead, () => {
        ctx.translate(dx, -78);
        ctx.rotate(tilt);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 27, 88, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f7b3d1';
        ctx.beginPath();
        ctx.ellipse(0, 6, 13, 66, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    ear(-40, -0.2);
    ear(40, 0.2);
  },

  glasses(ctx, f) {
    local(ctx, f, f.eyes, () => {
      ctx.lineWidth = 7;
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      for (const x of [-50, 50]) {
        ctx.beginPath();
        ctx.arc(x, 0, 43, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(-8, -4);
      ctx.quadraticCurveTo(0, -12, 8, -4);
      ctx.moveTo(-93, -6);
      ctx.lineTo(-122, -14);
      ctx.moveTo(93, -6);
      ctx.lineTo(122, -14);
      ctx.stroke();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      for (const x of [-50, 50]) {
        ctx.beginPath();
        ctx.arc(x, 0, 30, Math.PI * 1.15, Math.PI * 1.45);
        ctx.stroke();
      }
    });
  },

  mustache(ctx, f) {
    local(ctx, f, f.lip, () => {
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-18, -14, -48, -14, -62, 4);
      ctx.bezierCurveTo(-82, 24, -102, 8, -98, -10);
      ctx.bezierCurveTo(-92, 26, -66, 40, -40, 28);
      ctx.bezierCurveTo(-22, 22, -10, 16, 0, 20);
      ctx.bezierCurveTo(10, 16, 22, 22, 40, 28);
      ctx.bezierCurveTo(66, 40, 92, 26, 98, -10);
      ctx.bezierCurveTo(102, 8, 82, 24, 62, 4);
      ctx.bezierCurveTo(48, -14, 18, -14, 0, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  },

  crown(ctx, f, t) {
    const colors = ['#c9f13b', '#f06ba8', '#f3d53a', '#2e6bdf', '#c9f13b'];
    local(ctx, f, f.forehead, () => {
      colors.forEach((c, i) => {
        const x = (i - 2) * 38;
        ctx.save();
        ctx.translate(x, -36 - (2 - Math.abs(i - 2)) * 12 + Math.sin(t * 3 + i) * 2);
        ctx.rotate(Math.sin(t * 2 + i) * 0.18);
        ctx.fillStyle = c;
        star(ctx, i === 2 ? 30 : 23);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    });
  },

  love(ctx, f, t) {
    for (const c of [f.cheekL, f.cheekR]) {
      local(ctx, f, c, () => {
        ctx.fillStyle = 'rgba(240,107,168,0.5)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    local(ctx, f, f.forehead, () => {
      ctx.lineWidth = 3.5;
      [-50, 0, 50].forEach((x, i) => {
        const y = -50 - ((t * 36 + i * 24) % 72);
        ctx.save();
        ctx.translate(x + Math.sin(t * 2 + i) * 8, y);
        ctx.globalAlpha = 1 - Math.min(1, ((t * 36 + i * 24) % 72) / 72) * 0.7;
        ctx.fillStyle = '#f06ba8';
        heart(ctx, 18 + i * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    });
  },
};

export function drawMasks(ctx: CanvasRenderingContext2D, faces: readonly Face[], active: ReadonlySet<MaskId>, t: number) {
  for (const face of faces) for (const id of MASKS) if (active.has(id)) DRAW[id](ctx, face, t);
}
