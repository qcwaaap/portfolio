import { H as FH, W as FW } from './render';

export type PaperId = 'acid' | 'pink' | 'white' | 'cobalt' | 'tomato' | 'ink';
export const PAPERS: readonly PaperId[] = ['acid', 'pink', 'white', 'cobalt', 'tomato', 'ink'];

export type LayoutId = 'strip' | 'card';
export const LAYOUTS: readonly LayoutId[] = ['strip', 'card'];

type Spec = {
  /** CSS-фон для кружка в панели выбора */
  css: string;
  text: string;
  frame: string;
  /** заливка листа */
  fill: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  /** сколько зерна и пятен бумаги оставить (0 — гладкий лист) */
  texture?: number;
};

const solid = (c: string) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = c;
  ctx.fillRect(0, 0, w, h);
};

const PAPER: Record<PaperId, Spec> = {
  acid: { css: '#d8f27a', text: '#171715', frame: '#fbfff0', fill: solid('#d8f27a') },
  pink: { css: '#f7b3d1', text: '#171715', frame: '#fff8fb', fill: solid('#f7b3d1') },
  white: { css: '#fbfaf6', text: '#171715', frame: '#ffffff', fill: solid('#fbfaf6') },
  cobalt: { css: '#2e4fd6', text: '#f6f3eb', frame: '#ffffff', fill: solid('#2e4fd6'), texture: 0.5 },
  tomato: { css: '#e8432f', text: '#fff3ea', frame: '#fff7f2', fill: solid('#e8432f'), texture: 0.5 },
  ink: { css: '#1c1b19', text: '#ece9e1', frame: '#f6f3eb', fill: solid('#1c1b19'), texture: 0.35 },
};

export const swatch = (id: PaperId) => PAPER[id].css;

const PAD = 40;
const GAP = 22;
const TOP = 54;
const FOOT = 190;

type Plan = { w: number; h: number; slots: { x: number; y: number; w: number; h: number }[] };

/** Раскладка кадров: вертикальная полоска из 4 или открытка 2×2. */
function plan(layout: LayoutId, n: number): Plan {
  if (layout === 'card') {
    const fw = 520;
    const fh = (fw * FH) / FW;
    const gap = 28;
    const w = PAD * 2 + fw * 2 + gap;
    const slots = Array.from({ length: n }, (_, i) => ({ x: PAD + (i % 2) * (fw + gap), y: TOP + Math.floor(i / 2) * (fh + gap), w: fw, h: fh }));
    return { w, h: TOP + Math.ceil(n / 2) * fh + (Math.ceil(n / 2) - 1) * gap + FOOT - 20, slots };
  }
  const fw = 580;
  const fh = (fw * FH) / FW;
  const slots = Array.from({ length: n }, (_, i) => ({ x: PAD, y: TOP + i * (fh + GAP), w: fw, h: fh }));
  return { w: PAD * 2 + fw, h: TOP + n * fh + (n - 1) * GAP + FOOT, slots };
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });

const star = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) => {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.stroke();
};

const heart = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, fill: string) => {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s, y - s * 0.2, x - s * 0.55, y - s, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.55, y - s, x + s, y - s * 0.2, x, y + s * 0.35);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.stroke();
};

/** Собирает лист фотобудки: бумага, кадры в рамках, скотч, маркерные наклейки и подпись от руки. */
export async function composeStrip(shots: readonly HTMLCanvasElement[], paper: PaperId, layout: LayoutId, caption: string, date: string): Promise<HTMLCanvasElement> {
  const p = PAPER[paper];
  const { w, h, slots } = plan(layout, shots.length);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;

  const [mottle, grain] = await Promise.all([loadImage('/textures/mottle.png'), loadImage('/textures/grain.png')]);
  // подпись рисуется рукописным шрифтом сайта — дождёмся его
  await document.fonts?.load('64px Gaegu').catch(() => null);

  p.fill(ctx, w, h);
  const dark = paper === 'ink' || paper === 'cobalt';
  const k = p.texture ?? 1;
  for (const [img, alpha, scale] of [[mottle, (dark ? 0.12 : 0.5) * k, 0.7], [grain, (dark ? 0.25 : 0.6) * k, 1]] as const) {
    if (!img.naturalWidth || alpha <= 0.01) continue;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.scale(scale, scale);
    ctx.fillStyle = ctx.createPattern(img, 'repeat') ?? 'transparent';
    ctx.fillRect(0, 0, w / scale, h / scale);
    ctx.restore();
  }

  slots.forEach((slot, i) => {
    const shot = shots[i]!;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = p.frame;
    const b = 9;
    ctx.fillRect(slot.x - b, slot.y - b, slot.w + b * 2, slot.h + b * 2);
    ctx.restore();
    ctx.drawImage(shot, slot.x, slot.y, slot.w, slot.h);
  });

  // скотч по углам
  ctx.save();
  ctx.fillStyle = 'rgba(214,207,183,0.75)';
  for (const [x, y, r] of [[34, 30, -0.7], [w - 34, 30, 0.7], [34, h - 30, 0.7], [w - 34, h - 30, -0.7]] as const) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r);
    ctx.fillRect(-48, -13, 96, 26);
    ctx.restore();
  }
  ctx.restore();

  // маркерные наклейки рядом с подписью
  const baseY = h - FOOT + 86;

  ctx.save();
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = paper === 'ink' ? '#ece9e1' : '#171715';
  // на узкой полоске подпись занимает почти всю ширину — наклейки уходят в нижние углы
  const narrow = layout === 'strip';
  star(ctx, narrow ? 62 : w * 0.14, narrow ? baseY + 40 : baseY - 18, narrow ? 20 : 24, '#c9f13b');
  heart(ctx, narrow ? w - 62 : w * 0.86, narrow ? baseY + 40 : baseY - 18, narrow ? 22 : 26, '#f06ba8');
  ctx.restore();

  ctx.fillStyle = p.text;
  ctx.textAlign = 'center';
  ctx.font = "64px Gaegu, 'Ma Shan Zheng', cursive";
  ctx.fillText(caption, w / 2, baseY);
  ctx.font = "34px 'IBM Plex Mono', monospace";
  ctx.globalAlpha = 0.65;
  ctx.fillText(date, w / 2, baseY + 52);
  return c;
}

export const toBlob = (c: HTMLCanvasElement) => new Promise<Blob | null>((resolve) => c.toBlob(resolve, 'image/png'));
