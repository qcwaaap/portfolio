import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Фавикон: розовая «M» на бумаге. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e9e5db', color: '#f06ba8', fontSize: 46, fontWeight: 800, borderRadius: 14 }}>
        M
      </div>
    ),
    size,
  );
}
