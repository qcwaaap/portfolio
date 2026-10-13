'use client';

import { useMemo } from 'react';
import { PHOTOS, type PhotoKey } from '@/content/photos';
import { PROJECTS, type Project } from '@/content/projects';
import { useT } from './LocaleProvider';

/** Проекты с текстами на текущем языке. Структура (id, наклон, ссылки) — из content/projects.ts. */
export function useProjects(): readonly Project[] {
  const t = useT();
  return useMemo(
    () =>
      PROJECTS.map((p) => {
        const x = t.projects[p.id];
        return { ...p, short: x.short, long: x.long, tags: x.tags, annotation: { ...p.annotation, text: x.annotation } };
      }),
    [t],
  );
}

/** Фото с подписями на текущем языке: `<Photo {...photo('cat')} />`. */
export function usePhoto() {
  const t = useT();
  return (key: PhotoKey) => ({ ...PHOTOS[key], ...t.photos[key] });
}
