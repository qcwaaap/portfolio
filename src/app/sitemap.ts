import type { MetadataRoute } from 'next';
import { LOCALES, LOCALE_LABELS } from '@/i18n/config';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [LOCALE_LABELS[l].htmlLang, `${SITE_URL}/${l}`]));
  return LOCALES.map((l) => ({ url: `${SITE_URL}/${l}`, alternates: { languages } }));
}
