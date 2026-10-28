import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
// Шрифты через @fontsource: лежат в node_modules, ничего не скачивается при dev/build
import '@fontsource/gaegu/300.css';
import '@fontsource/gaegu/400.css';
import '@fontsource/gaegu/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ma-shan-zheng/400.css';
import 'lenis/dist/lenis.css';
import '../globals.css';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { LOCALES, LOCALE_LABELS, isLocale } from '@/i18n/config';
import { DICTIONARIES } from '@/i18n/dictionaries';
import { SITE_URL } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = DICTIONARIES[locale].meta;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((l) => [LOCALE_LABELS[l].htmlLang, `/${l}`])),
    },
    openGraph: { type: 'website', title, description, url: `/${locale}`, locale: LOCALE_LABELS[locale].htmlLang.replace('-Hans', '_CN') },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e9e5db' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1b19' },
  ],
};

/** Выставляет сохранённую тему до первой отрисовки, чтобы не было вспышки светлой темы. */
const THEME_INIT = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={LOCALE_LABELS[locale].htmlLang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        {/* без JS лоадер не должен навсегда закрывать сайт */}
        <noscript>
          <style>{'[data-loader]{display:none!important}'}</style>
        </noscript>
        <LocaleProvider initial={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
