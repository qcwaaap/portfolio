import { H as FH, W as FW } from './render';

export type PaperId = 'paper' | 'pink' | 'acid' | 'ink';
export const PAPERS: readonly PaperId[] = ['paper', 'pink', 'acid', 'ink'];

const PAPER: Record<PaperId, { bg: string; text: string; frame: string }> = {
  paper: { bg: '#efece4', text: '#171715', frame: '#ffffff' },
  pink: { bg: '#f7b3d1', text: '#171715', frame: '#fff8fb' },
  acid: { bg: '#d8f27a', text: '#171715', frame: '#fbfff0' },
  ink: { bg: '#1c1b19', text: '#ece9e1', frame: '#f6f3eb' },
};

const SW = 660;
const PAD = 40;
const FRAME_W = SW - PAD * 2;
const FRAME_H = (FRAME_W * FH) / FW;
const GAP = 22;
const TOP = 54;
const FOOT = 190;

export const swatch = (id: PaperId) => PAPER[id].bg;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });

/** Собирает вертикальную полоску фотобудки: бумага с зерном, кадры в рамках, скотч и подпись от руки. */
export async function composeStrip(shots: readonly HTMLCanvasElement[], paper: PaperId, caption: string, date: string): Promise<HTMLCanvasElement> {
  const p = PAPER[paper];
  const H = TOP + shots.length * FRAME_H + (shots.length - 1) * GAP + FOOT;
  const c = document.createElement('canvas');
  c.width = SW;
  c.height = H;
  const ctx = c.getContext('2d')!;

  const [mottle, grain] = await Promise.all([loadImage('/textures/mottle.png'), loadImage('/textures/grain.png')]);
  // подпись рисуется рукописным шрифтом сайта — дождёмся его
  await document.fonts?.load("64px Gaegu").catch(() => null);

  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, SW, H);
  for (const [img, alpha, scale] of [[mottle, paper === 'ink' ? 0.12 : 0.5, 0.7], [grain, paper === 'ink' ? 0.25 : 0.6, 1]] as const) {
    if (!img.naturalWidth) continue;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.scale(scale, scale);
    ctx.fillStyle = ctx.createPattern(img, 'repeat') ?? 'transparent';
    ctx.fillRect(0, 0, SW / scale, H / scale);
    ctx.restore();
  }

  shots.forEach((shot, i) => {
    const y = TOP + i * (FRAME_H + GAP);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = p.frame;
    ctx.fillRect(PAD - 9, y - 9, FRAME_W + 18, FRAME_H + 18);
    ctx.restore();
    ctx.drawImage(shot, PAD, y, FRAME_W, FRAME_H);
  });

  // скотч по углам
  ctx.save();
  ctx.fillStyle = 'rgba(214,207,183,0.75)';
  for (const [x, y, r] of [[34, 30, -0.7], [SW - 34, 30, 0.7], [34, H - 30, 0.7], [SW - 34, H - 30, -0.7]] as const) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r);
    ctx.fillRect(-48, -13, 96, 26);
    ctx.restore();
  }
  ctx.restore();

  ctx.fillStyle = p.text;
  ctx.textAlign = 'center';
  ctx.font = "64px Gaegu, 'Ma Shan Zheng', cursive";
  ctx.fillText(caption, SW / 2, H - FOOT + 86);
  ctx.font = "34px 'IBM Plex Mono', monospace";
  ctx.globalAlpha = 0.65;
  ctx.fillText(date, SW / 2, H - FOOT + 138);
  return c;
}

export const toBlob = (c: HTMLCanvasElement) => new Promise<Blob | null>((resolve) => c.toBlob(resolve, 'image/png'));
