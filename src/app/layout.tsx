import type { Metadata } from 'next';
// Шрифты через @fontsource: лежат в node_modules, ничего не скачивается при dev/build
import '@fontsource/gaegu/300.css';
import '@fontsource/gaegu/400.css';
import '@fontsource/gaegu/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maria Nedbailova — fullstack developer',
  description: 'React / TypeScript / Python / Go',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
