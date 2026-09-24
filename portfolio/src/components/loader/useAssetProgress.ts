'use client';

import { useEffect, useRef } from 'react';

const NONE: readonly string[] = [];

/**
 * Реальный прогресс загрузки (0..1): шрифты + событие window.load + список картинок.
 * Возвращает ref, а не state — Loader читает значение в rAF, ререндеры не нужны.
 */
export function useAssetProgress(urls: readonly string[] = NONE) {
  const progress = useRef(0);

  useEffect(() => {
    progress.current = 0;
    let cancelled = false;
    let done = 0;
    const total = urls.length + 2;

    const track = (p: Promise<unknown>) =>
      p
        .catch(() => undefined) // битая картинка не должна вешать загрузку
        .finally(() => {
          if (cancelled) return;
          done += 1;
          progress.current = Math.min(1, done / total);
        });

    track(document.fonts?.ready ?? Promise.resolve());
    track(
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true })),
    );
    urls.forEach((src) =>
      track(
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        }),
      ),
    );

    return () => {
      cancelled = true;
    };
  }, [urls]);

  return progress;
}
