import { ImageResponse } from 'next/og';

export const alt = 'Noah Frank';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

// Geist is woff2-only and satori cannot decode woff2; OG renders in
// satori's default sans (Noto). Visually close enough at this scale —
// brand colors and layout carry the identity. To swap in real Geist,
// drop a TTF/OTF into public/fonts/ and load it via fonts: [].
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: '#EDEAE3',
          padding: '96px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 96,
            left: 96,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#A39690',
            display: 'flex',
          }}
        >
          Zürich · Student · Builder
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 240,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#1A1614',
              lineHeight: 0.9,
              display: 'flex',
            }}
          >
            Noah Frank
          </div>
          <div
            style={{
              width: 96,
              height: 4,
              background: '#C8522A',
              marginTop: 48,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
