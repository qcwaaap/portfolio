'use client';

import { useEffect } from 'react';
import { sound } from '@/lib/sound/engine';

const INTERACTIVE = 'a, button, [data-cursor], [role="button"], input, textarea, select';
// каждая секция озвучивает переход только один раз за визит — иначе скролл туда-сюда надоедает
const SECTIONS = ['work', 'cadence', 'about', 'contact'];

/**
 * Глобальные тихие UI-звуки: наведение и клик по интерактивным элементам, плюс
 * едва слышный «whoosh» при первом входе в каждую крупную секцию. Ничего не звучит,
 * пока человек не включил звук через SoundToggle (это проверяет сам sound engine).
 */
export function useUiSounds() {
  useEffect(() => {
    let last: Element | null = null;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = (e.target as Element | null)?.closest(INTERACTIVE);
      if (!el || el === last) return;
      last = el;
      sound.hover();
    };
    const onOut = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest(INTERACTIVE);
      if (el === last) last = null;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) sound.click();
    };

    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });

    const seen = new Set<string>(['top']); // hero не озвучиваем при загрузке
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            sound.whoosh();
          }
        });
      },
      { threshold: 0.55 },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('pointerdown', onDown);
      io.disconnect();
    };
  }, []);
}
