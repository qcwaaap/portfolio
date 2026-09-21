/**
 * Фотографии коллажа. Пока `src: null` — на их месте рисуются заглушки.
 * Чтобы поставить своё фото: положи файл в `public/images/` и впиши путь, например '/images/mountains.jpg'.
 */
export type PhotoKey = 'mountains' | 'flowers' | 'dogs' | 'landscape' | 'portrait' | 'cat' | 'window' | 'lake';

export const PHOTOS: Record<PhotoKey, { src: string | null; alt: string; label: string }> = {
  mountains: { src: null, alt: 'Snowy mountains at dusk', label: 'photo: mountains' },
  flowers: { src: null, alt: 'Pink flowers along a grey wall', label: 'photo: flowers' },
  dogs: { src: null, alt: 'Three dogs looking out of a car window', label: 'photo: dogs' },
  landscape: { src: null, alt: 'A green valley with blossoming trees', label: 'photo: landscape' },
  portrait: { src: null, alt: 'Portrait of Maria', label: 'photo: portrait' },
  cat: { src: null, alt: 'A tabby cat', label: 'photo: cat' },
  window: { src: null, alt: 'View from a plane window, black and white', label: 'photo: window' },
  lake: { src: null, alt: 'A lake at sunset', label: 'photo: lake' },
};

/** Картинки, которые лоадер дождётся перед показом сайта */
export const PRELOAD: readonly string[] = Object.values(PHOTOS)
  .map((p) => p.src)
  .filter((s): s is string => Boolean(s));
