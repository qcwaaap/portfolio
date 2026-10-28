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
    // CPU: на кадр уходит 10–20 мс, зато работает везде. GPU-режим на части видеокарт создаётся,
    // но потом молча не находит лица.
    return FaceLandmarker.createFromOptions(fileset, { baseOptions: { modelAssetPath: MODEL, delegate: 'CPU' }, runningMode: 'VIDEO', numFaces: 2 });
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
