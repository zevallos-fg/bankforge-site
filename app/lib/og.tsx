import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * One OG image design, three routes. Navy ground, brand wordmark, a single line
 * of what the page is. Built with next/og so the images exist at all — the
 * previous site declared `summary_large_image` on Twitter while shipping no
 * image, which degrades to a plain text card (recon Q5).
 */
export function ogImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0F2341',
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 34, letterSpacing: -0.5 }}>
          <span style={{ color: '#7EB3E8' }}>Tiqsi</span>
          <span style={{ color: '#FFFFFF' }}>.ai</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              textTransform: 'uppercase',
              letterSpacing: 4,
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 60,
              lineHeight: 1.15,
              color: '#FFFFFF',
              maxWidth: 940,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.45)' }}>
          Compliance review and AI visibility for regulated firms
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
