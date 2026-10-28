'use client';

import { flushSync } from 'react-dom';
import { sound } from '@/lib/sound/engine';

/** Куда уходит оторванный лист: вверх (тема) или влево (язык). */
export type TearDir = 'up' | 'left';

const STEPS = 40;
const DURATION = 820;

// Зубцы рваного края: коррелированный шум, как в sketch.tornClips, но в пикселях
function jags(): number[] {
  const out: number[] = [];
  let y = 0;
  for (let i = 0; i <= STEPS; i++) {
    y = y * 0.6 + (Math.random() - 0.5) * 22;
    out.push(Math.round((y + (Math.random() - 0.5) * 7) * 10) / 10);
  }
  return out;
}

/**
 * Видимая часть старой страницы при положении края `at` (calc-выражение вдоль оси).
 * Число точек одинаково в обоих кадрах — иначе clip-path не интерполируется.
 */
function polygon(dir: TearDir, at: string, j: number[]): string {
  const pts: string[] = [];
  if (dir === 'up') {
    // остаётся верхняя часть; край идёт снизу вверх
    pts.push('0 0', '100% 0');
    for (let i = STEPS; i >= 0; i--) pts.push(`${((i / STEPS) * 100).toFixed(2)}% calc(${at} + ${j[i]}px)`);
  } else {
    // остаётся правая часть; край идёт слева направо
    pts.push('100% 0', '100% 100%');
    for (let i = 0; i <= STEPS; i++) pts.push(`calc(${at} + ${j[i]}px) ${(100 - (i / STEPS) * 100).toFixed(2)}%`);
  }
  return `polygon(${pts.join(',')})`;
}

export const canTear = () =>
  typeof document.startViewTransition === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Меняет состояние страницы «разрывом листа»: старая страница рвётся по неровному краю и уезжает,
 * под ней уже новая тема/язык. Опирается на View Transitions API: браузер сам снимает «до» и «после».
 * Без поддержки API или при reduced-motion просто применяет изменение.
 */
export function tearTransition(update: () => void, dir: TearDir = 'up') {
  if (!canTear()) {
    update();
    return;
  }
  const root = document.documentElement;
  // во время разрыва лишние CSS-переходы (theme-fade) только портят снимок «после»
  root.classList.remove('theme-fade');
  const vt = document.startViewTransition(() => flushSync(update));
  sound.tear();
  const j = jags();
  void vt.ready.then(() => {
    const from = polygon(dir, dir === 'up' ? '100% + 40px' : '0% - 40px', j);
    const to = polygon(dir, dir === 'up' ? '0% - 40px' : '100% + 40px', j);
    root.animate({ clipPath: [from, to] }, { duration: DURATION, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards', pseudoElement: '::view-transition-old(root)' });
  });
}
