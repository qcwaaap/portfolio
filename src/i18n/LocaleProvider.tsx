'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCALE_COOKIE, LOCALE_LABELS, type Locale } from './config';
import { DICTIONARIES, type Dictionary } from './dictionaries';

type Ctx = { locale: Locale; t: Dictionary; setLocale: (next: Locale) => void };

const LocaleContext = createContext<Ctx | null>(null);

/**
 * Язык страницы. Каждый язык имеет свой URL (/en, /ru, /zh) — чтобы поисковик и ссылки видели нужный текст,
 * но переключение внутри страницы не перезагружает её: иначе лоадер проигрывался бы заново.
 */
export function LocaleProvider({ initial, children }: { initial: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
    window.history.replaceState(window.history.state, '', `/${next}${window.location.hash}`);
  }, []);

  useEffect(() => {
    document.documentElement.lang = LOCALE_LABELS[locale].htmlLang;
    // тексты разной длины сдвигают секции — пересчитываем точки ScrollTrigger
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [locale]);

  const value = useMemo(() => ({ locale, t: DICTIONARIES[locale], setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}

/** Только словарь — для большинства компонентов этого достаточно. */
export const useT = () => useLocale().t;
