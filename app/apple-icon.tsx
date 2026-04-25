import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1A1614',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EDEAE3',
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: '-0.06em',
        }}
      >
        NF
      </div>
    ),
    size,
  );
}
