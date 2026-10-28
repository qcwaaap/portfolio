import { drawMasks, toFace, type CanvasMap, type Face, type MaskId } from './masks';
import type { Landmarks } from './faceTracker';

export const W = 800;
export const H = 600;

export type FilterId = 'color' | 'bw' | 'film' | 'riso' | 'halftone' | 'thermal' | 'glitch' | 'vhs' | 'ascii';
export const FILTERS: readonly FilterId[] = ['color', 'bw', 'film', 'riso', 'halftone', 'thermal', 'glitch', 'vhs', 'ascii'];

/** Фильтры на CSS-синтаксисе ctx.filter (дёшево, делает видеокарта). */
const CSS_FILTER: Partial<Record<FilterId, string>> = {
  bw: 'grayscale(1) contrast(1.15) brightness(1.05)',
  film: 'sepia(0.35) contrast(1.12) saturate(1.1) brightness(1.04)',
  vhs: 'saturate(1.5) contrast(1.12) brightness(1.05)',
};

/** ctx.filter не везде есть (старый Safari): там фильтры на его основе просто не применяются. */
export const canFilter = () => typeof CanvasRenderingContext2D !== 'undefined' && 'filter' in CanvasRenderingContext2D.prototype;

/** Кадр видео → 4:3 по центру; возвращает область источника и функцию «нормализованная точка → пиксель холста». */
export function frameMap(video: HTMLVideoElement): { src: [number, number, number, number]; map: CanvasMap } {
  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 720;
  const sw = Math.min(vw, (vh * 4) / 3);
  const sh = (sw * 3) / 4;
  const sx = (vw - sw) / 2;
  const sy = (vh - sh) / 2;
  return {
    src: [sx, sy, sw, sh],
    // зеркало: человек видит себя как в зеркале
    map: (nx, ny) => ({ x: (1 - (nx * vw - sx) / sw) * W, y: ((ny * vh - sy) / sh) * H }),
  };
}

export function facesFrom(landmarks: readonly Landmarks[], video: HTMLVideoElement): Face[] {
  const { map } = frameMap(video);
  return landmarks.map((lm) => toFace(lm, map));
}

/** Если трекинг лица недоступен: маски ставятся на «среднее» лицо по центру кадра, под пунктирный овал. */
export function staticFace(): Face {
  const u = 130;
  const eyes = { x: W / 2, y: H * 0.42 };
  const at = (dx: number, dy: number) => ({ x: eyes.x + dx * u, y: eyes.y + dy * u });
  return {
    eyes,
    forehead: at(0, -1.05),
    nose: at(0, 0.85),
    lip: at(0, 1.2),
    mouth: at(0, 1.5),
    cheekL: at(-0.85, 0.95),
    cheekR: at(0.85, 0.95),
    templeL: at(-0.95, -0.8),
    templeR: at(0.95, -0.8),
    roll: 0,
    unit: u,
    open: 0,
  };
}

export type Scene = { filter: FilterId; masks: ReadonlySet<MaskId>; grain: HTMLImageElement | null };

// ── вспомогательные холсты: создаются один раз ──
const LW = 320;
const LH = 240;
let low: { c: HTMLCanvasElement; x: CanvasRenderingContext2D } | null = null;
let scan: CanvasPattern | null = null;

function lowCanvas(w = LW, h = LH) {
  if (!low || low.c.width !== w) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    low = { c, x: c.getContext('2d', { willReadFrequently: true })! };
  }
  return low;
}

/** Градиентная палитра на 256 значений яркости. */
function palette(stops: readonly (readonly [number, string])[]) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 1;
  const x = c.getContext('2d')!;
  const g = x.createLinearGradient(0, 0, 256, 0);
  stops.forEach(([p, col]) => g.addColorStop(p, col));
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 1);
  return x.getImageData(0, 0, 256, 1).data;
}

let LUT_RISO: Uint8ClampedArray | null = null;
let LUT_THERMAL: Uint8ClampedArray | null = null;

function mirrored(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, src: readonly number[], w: number, h: number, dx = 0) {
  ctx.save();
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, src[0]!, src[1]!, src[2]!, src[3]!, -dx, 0, w, h);
  ctx.restore();
}

/** Кадр в маленький холст → яркость → цвет из палитры → растянули на весь кадр. */
function mapped(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, src: readonly number[], lut: Uint8ClampedArray) {
  const { c, x } = lowCanvas();
  mirrored(x, video, src, LW, LH);
  const img = x.getImageData(0, 0, LW, LH);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const l = Math.min(255, Math.max(0, ((0.3 * d[i]! + 0.59 * d[i + 1]! + 0.11 * d[i + 2]! - 128) * 1.25 + 128) | 0)) * 4;
    d[i] = lut[l]!;
    d[i + 1] = lut[l + 1]!;
    d[i + 2] = lut[l + 2]!;
  }
  x.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(c, 0, 0, W, H);
}

/** Полутон: сетка точек, радиус зависит от яркости. */
function halftone(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, src: readonly number[]) {
  const cols = 100;
  const rows = 75;
  const { c, x } = lowCanvas(cols, rows);
  mirrored(x, video, src, cols, rows);
  const d = x.getImageData(0, 0, cols, rows).data;
  ctx.fillStyle = '#f4efe2';
  ctx.fillRect(0, 0, W, H);
  const cell = W / cols;
  for (const [color, shift, k] of [['rgba(240,107,168,0.9)', 2.2, 0.62], ['#1d2466', 0, 0.52]] as const) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const p = (j * cols + i) * 4;
        const l = (0.3 * d[p]! + 0.59 * d[p + 1]! + 0.11 * d[p + 2]!) / 255;
        const r = (1 - l) * cell * k * (shift ? 1 : 1.25);
        if (r < 0.4) continue;
        ctx.moveTo(i * cell + cell / 2 + shift + r, j * cell + cell / 2 + shift);
        ctx.arc(i * cell + cell / 2 + shift, j * cell + cell / 2 + shift, r, 0, Math.PI * 2);
      }
    }
    ctx.fill();
  }
  void c;
}

const RAMP = ' .:-=+*#%@';
function ascii(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, src: readonly number[]) {
  const cols = 80;
  const rows = 45;
  const { x } = lowCanvas(cols, rows);
  mirrored(x, video, src, cols, rows);
  const d = x.getImageData(0, 0, cols, rows).data;
  ctx.fillStyle = '#171715';
  ctx.fillRect(0, 0, W, H);
  const cw = W / cols;
  const ch = H / rows;
  ctx.font = `${ch * 1.05}px 'IBM Plex Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c9f13b';
  for (let j = 0; j < rows; j++) {
    let line = '';
    for (let i = 0; i < cols; i++) {
      const p = (j * cols + i) * 4;
      const l = (0.3 * d[p]! + 0.59 * d[p + 1]! + 0.11 * d[p + 2]!) / 255;
      line += RAMP[Math.min(RAMP.length - 1, Math.floor(l * l * 1.3 * RAMP.length))];
    }
    for (let i = 0; i < cols; i++) if (line[i] !== ' ') ctx.fillText(line[i]!, i * cw + cw / 2, j * ch + ch / 2);
  }
}

function glitch(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, src: readonly number[], t: number) {
  mirrored(ctx, video, src, W, H);
  if (canFilter()) {
    // «призрак» другого цвета со сдвигом: RGB-расслоение
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.45;
    ctx.filter = 'hue-rotate(160deg) saturate(3) brightness(0.9)';
    mirrored(ctx, video, src, W, H, 10 + Math.sin(t * 9) * 6);
    ctx.restore();
    ctx.filter = 'none';
  }
  // горизонтальные полосы съезжают в стороны; раскладка меняется несколько раз в секунду
  const seed = Math.floor(t * 7);
  const rnd = (n: number) => {
    const v = Math.sin(seed * 91.7 + n * 12.9898) * 43758.5453;
    return v - Math.floor(v);
  };
  for (let i = 0; i < 4; i++) {
    if (rnd(i) < 0.4) continue;
    const y = rnd(i + 10) * H;
    const h = 8 + rnd(i + 20) * 46;
    const dx = (rnd(i + 30) - 0.5) * 90;
    ctx.drawImage(ctx.canvas, 0, y, W, h, dx, y, W, h);
  }
}

function vhs(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, src: readonly number[], t: number) {
  if (canFilter()) ctx.filter = CSS_FILTER.vhs!;
  mirrored(ctx, video, src, W, H);
  if (canFilter()) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.3;
    ctx.filter = 'hue-rotate(-40deg) saturate(2.5)';
    mirrored(ctx, video, src, W, H, 6);
    ctx.restore();
    ctx.filter = 'none';
  }
  // бегущая полоса помех со сдвигом
  const y = (t * 90) % (H + 80);
  ctx.drawImage(ctx.canvas, 0, y, W, 26, 14, y, W, 26);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(0, y, W, 26);
  if (!scan) {
    const p = document.createElement('canvas');
    p.width = 4;
    p.height = 4;
    const x = p.getContext('2d')!;
    x.fillStyle = 'rgba(0,0,0,0.28)';
    x.fillRect(0, 0, 4, 1.5);
    scan = ctx.createPattern(p, 'repeat');
  }
  if (scan) {
    ctx.fillStyle = scan;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = '#fff';
  ctx.font = "26px 'IBM Plex Mono', monospace";
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 4;
  ctx.fillText('PLAY ▶', 28, 48);
  const s = Math.floor(t) % 60;
  ctx.textAlign = 'right';
  ctx.fillText(`00:${String(s).padStart(2, '0')}:${String(Math.floor((t % 1) * 24)).padStart(2, '0')}`, W - 28, H - 28);
  ctx.shadowBlur = 0;
}

function film(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, src: readonly number[]) {
  if (canFilter()) ctx.filter = CSS_FILTER.film!;
  mirrored(ctx, video, src, W, H);
  ctx.filter = 'none';
  // засвет по краю плёнки и виньетка
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const leak = ctx.createLinearGradient(0, 0, W * 0.35, 0);
  leak.addColorStop(0, 'rgba(255,120,40,0.45)');
  leak.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = leak;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 0.95);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

const GRAIN_ALPHA: Partial<Record<FilterId, number>> = { color: 0.28, bw: 0.5, film: 0.6, riso: 0.4, thermal: 0.12, glitch: 0.2, vhs: 0.3 };

export function drawScene(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, faces: readonly Face[], scene: Scene, t: number) {
  const { src } = frameMap(video);
  ctx.imageSmoothingEnabled = true;
  switch (scene.filter) {
    case 'riso':
      LUT_RISO ??= palette([[0, '#1d2466'], [0.5, '#f06ba8'], [1, '#fbf1d8']]);
      mapped(ctx, video, src, LUT_RISO);
      break;
    case 'thermal':
      LUT_THERMAL ??= palette([[0, '#0b0030'], [0.28, '#5b1fa8'], [0.5, '#e4358a'], [0.72, '#ff9a1f'], [0.9, '#fff04a'], [1, '#ffffff']]);
      mapped(ctx, video, src, LUT_THERMAL);
      break;
    case 'halftone':
      halftone(ctx, video, src);
      break;
    case 'ascii':
      ascii(ctx, video, src);
      break;
    case 'glitch':
      glitch(ctx, video, src, t);
      break;
    case 'vhs':
      vhs(ctx, video, src, t);
      break;
    case 'film':
      film(ctx, video, src);
      break;
    default:
      if (canFilter() && CSS_FILTER[scene.filter]) ctx.filter = CSS_FILTER[scene.filter]!;
      mirrored(ctx, video, src, W, H);
      ctx.filter = 'none';
  }

  drawMasks(ctx, faces, scene.masks, t);

  const alpha = GRAIN_ALPHA[scene.filter];
  if (alpha && scene.grain?.complete && scene.grain.naturalWidth) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = ctx.createPattern(scene.grain, 'repeat') ?? 'transparent';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}
