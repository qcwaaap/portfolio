'use client';

import type { FaceLandmarker } from '@mediapipe/tasks-vision';

const VERSION = '1.2.0';
const WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}/wasm`;
const MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export type Landmarks = readonly { x: number; y: number }[];

let landmarker: Promise<FaceLandmarker> | null = null;

/** Тяжёлая часть (wasm + модель ~4 МБ) грузится один раз и только когда человек открыл будку. */
export function loadFaceTracker(): Promise<FaceLandmarker> {
  landmarker ??= (async () => {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
    const fileset = await FilesetResolver.forVisionTasks(WASM);
    // MediaPipe всегда заводит внутри себя WebGL-контекст. По умолчанию он берёт OffscreenCanvas, а в Safari
    // WebGL2 на нём не создаётся («undefined is not an object (evaluating 'GLctx.activeTexture')»),
    // поэтому отдаём ему обычный <canvas>.
    const make = (delegate: 'CPU' | 'GPU') =>
      FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL, delegate },
        runningMode: 'VIDEO',
        numFaces: 2,
        canvas: document.createElement('canvas'),
      });
    // CPU надёжнее: GPU-режим на части видеокарт создаётся, но потом молча не находит лица
    try {
      return await make('CPU');
    } catch {
      return await make('GPU');
    }
  })().catch((e) => {
    landmarker = null; // дадим попробовать ещё раз
    throw e;
  });
  return landmarker;
}

/** Лица на текущем кадре видео, нормализованные координаты 0..1. */
export function detectFaces(tracker: FaceLandmarker, video: HTMLVideoElement, ts: number): Landmarks[] {
  return tracker.detectForVideo(video, ts).faceLandmarks;
}
