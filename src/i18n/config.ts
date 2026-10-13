export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'locale';

/** Подписи в переключателе: каждый язык называется на самом себе. */
export const LOCALE_LABELS: Record<Locale, { short: string; name: string; htmlLang: string }> = {
  en: { short: 'EN', name: 'English', htmlLang: 'en' },
  zh: { short: '中', name: '中文', htmlLang: 'zh-Hans' },
};

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALES as readonly string[]).includes(v);

/** Подбирает язык по заголовку Accept-Language (по убыванию q); иначе — английский. */
export function negotiateLocale(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = Number(params.find((p) => p.trim().startsWith('q='))?.split('=')[1] ?? 1);
      return { lang: tag.trim().toLowerCase().split('-')[0] ?? '', q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of ranked) if (isLocale(lang)) return lang;
  return DEFAULT_LOCALE;
}
