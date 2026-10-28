import { ImageResponse } from 'next/og';

export const alt = 'Maria Nedbailova — fullstack developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Превью для соцсетей: бумага, крупное имя маркером-розовым, акцентная полоса. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 90, background: '#e9e5db', color: '#171715' }}>
        <div style={{ fontSize: 28, letterSpacing: 4, color: '#55524a' }}>PORTFOLIO · 2026</div>
        <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 1, marginTop: 24, color: '#f06ba8' }}>MARIA</div>
        <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 1 }}>NEDBAILOVA</div>
        <div style={{ display: 'flex', marginTop: 40, alignItems: 'center' }}>
          <div style={{ width: 120, height: 18, background: '#c9f13b', marginRight: 28 }} />
          <div style={{ fontSize: 40 }}>fullstack developer · React / TypeScript / Python / Go</div>
        </div>
      </div>
    ),
    size,
  );
}
