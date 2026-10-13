import type { Metadata, Viewport } from 'next';
// Шрифты через @fontsource: лежат в node_modules, ничего не скачивается при dev/build
import '@fontsource/gaegu/300.css';
import '@fontsource/gaegu/400.css';
import '@fontsource/gaegu/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/700.css';
import '@fontsource/ma-shan-zheng/400.css';
import 'lenis/dist/lenis.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maria Nedbailova — fullstack developer',
  description: 'React / TypeScript / Python / Go',
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e9e5db' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1b19' },
  ],
};

/** Выставляет сохранённую тему до первой отрисовки, чтобы не было вспышки светлой темы. */
const THEME_INIT = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}try{var l=location.pathname.split('/')[1];var m={en:'en',ru:'ru',zh:'zh-Hans'};if(m[l])document.documentElement.lang=m[l]}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        {/* без JS лоадер не должен навсегда закрывать сайт */}
        <noscript>
          <style>{'[data-loader]{display:none!important}'}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
