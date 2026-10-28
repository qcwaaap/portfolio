import { drawMasks, toFace, type CanvasMap, type Face, type MaskId } from './masks';
import type { Landmarks } from './faceTracker';

export const W = 800;
export const H = 600;

export type FilterId = 'color' | 'bw' | 'warm' | 'pink';
export const FILTERS: readonly FilterId[] = ['color', 'bw', 'warm', 'pink'];

const CSS_FILTER: Record<FilterId, string> = {
  color: 'none',
  bw: 'grayscale(1) contrast(1.15) brightness(1.05)',
  warm: 'sepia(0.35) saturate(1.25) contrast(1.05)',
  pink: 'saturate(1.35) hue-rotate(-14deg) brightness(1.06)',
};

/** ctx.filter не везде есть (старый Safari): там фильтры просто скрываем. */
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

export type Scene = { filter: FilterId; masks: ReadonlySet<MaskId>; grain: HTMLImageElement | null };

export function drawScene(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, faces: readonly Face[], scene: Scene, t: number) {
  const { src } = frameMap(video);
  ctx.save();
  ctx.translate(W, 0);
  ctx.scale(-1, 1);
  if (canFilter()) ctx.filter = CSS_FILTER[scene.filter];
  ctx.drawImage(video, src[0], src[1], src[2], src[3], 0, 0, W, H);
  ctx.restore();
  if (canFilter()) ctx.filter = 'none';

  drawMasks(ctx, faces, scene.masks, t);

  if (scene.grain?.complete && scene.grain.naturalWidth) {
    ctx.save();
    ctx.globalAlpha = scene.filter === 'bw' ? 0.5 : 0.28;
    ctx.fillStyle = ctx.createPattern(scene.grain, 'repeat') ?? 'transparent';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}
