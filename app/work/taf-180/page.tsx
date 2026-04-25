import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import GrainTexture from '@/components/GrainTexture';
import LenisProvider from '@/components/LenisProvider';

export const metadata: Metadata = {
  title: 'TAF 180 — Case study · Noah Frank',
  description:
    'A desktop invoicing tool for an ergotherapy practice in Zürich. Swiss QR-Bill, photo-to-invoice via the Anthropic API, built for one practice to start.',
};

const TEXT      = '#1A1614';
const SECONDARY = '#6E6259';
const TERTIARY  = '#A39690';
const BG        = '#EDEAE3';
const SURFACE   = '#F0EBE3';
const BORDER    = '#DDD8D0';
const ACCENT    = '#C8522A';

export default function TAF180CaseStudy() {
  return (
    <>
      <LenisProvider />
      <Nav />
      <GrainTexture />

      <main
        id="top"
        style={{
          background: BG,
          color: TEXT,
          paddingTop: 'clamp(120px, 14vw, 180px)',
          paddingBottom: 'clamp(80px, 10vw, 140px)',
        }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)' }}>

          <a
            href="/#work"
            className="case-back"
            style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: TERTIARY,
              textDecoration: 'none',
              marginBottom: 'clamp(56px, 8vw, 88px)',
              transition: 'color 0.2s ease',
            }}
          >
            ← Selected Work
          </a>

          {/* Hero */}
          <header style={{ maxWidth: 820, marginBottom: 'clamp(56px, 7vw, 88px)' }}>
            <p style={{
              fontSize: 12, fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: TERTIARY, margin: '0 0 clamp(28px, 3vw, 40px)',
            }}>
              03 · 2026
            </p>
            <h1 style={{
              fontSize: 'clamp(56px, 10vw, 128px)',
              fontWeight: 700, letterSpacing: '-0.035em',
              lineHeight: 0.95, margin: '0 0 clamp(32px, 4vw, 56px)',
              color: TEXT,
            }}>
              TAF 180
            </h1>
            <p style={{
              fontSize: 'clamp(18px, 1.6vw, 24px)',
              lineHeight: 1.55, color: SECONDARY,
              maxWidth: '46ch', margin: 0,
            }}>
              A desktop invoicing tool I built for my father&apos;s ergotherapy practice in Zürich.
            </p>
            <div aria-hidden style={{
              width: 56, height: 2, background: ACCENT,
              marginTop: 'clamp(48px, 6vw, 72px)',
            }} />
          </header>

          {/* Problem */}
          <section style={{ maxWidth: 680, marginBottom: 'clamp(80px, 10vw, 140px)' }}>
            <p style={{
              fontSize: 'clamp(11px, 1vw, 12px)', fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: TERTIARY, margin: '0 0 20px',
            }}>
              Problem
            </p>
            <p style={{
              fontSize: 'clamp(17px, 1.5vw, 20px)', lineHeight: 1.7,
              color: TEXT, margin: '0 0 24px', fontWeight: 500,
            }}>
              Billing eats the weekend, and no off-the-shelf AI handles Swiss QR-Bill correctly.
            </p>
            <p style={{ fontSize: 'clamp(15px, 1.25vw, 17px)', lineHeight: 1.75, color: SECONDARY, margin: '0 0 20px' }}>
              The work sounds simple: turn a stack of session notes, insurance cards, and
              Verordnungen into compliant invoices and get them in the mail. In practice it&apos;s
              the part of running a Praxis that nobody enjoys — and the part that decides
              whether the month actually closes.
            </p>
            <p style={{ fontSize: 'clamp(15px, 1.25vw, 17px)', lineHeight: 1.75, color: SECONDARY, margin: 0 }}>
              Existing tools either cost more than a small practice can justify or treat Swiss
              QR-Bill (SPS 2022) as an afterthought. I wanted something my father could open,
              click twice, and be done with.
            </p>
          </section>

        </div>

        {/* Hero image */}
        <section style={{
          margin: '0 auto clamp(80px, 10vw, 140px)',
          maxWidth: 1440,
          padding: '0 clamp(24px, 5vw, 64px)',
        }}>
          <figure style={{ margin: 0 }}>
            <div style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              overflow: 'hidden',
              background: SURFACE,
              boxShadow: '0 40px 80px -40px rgba(26,22,20,0.18)',
            }}>
              <img
                src="/work/taf180-home.png"
                alt="TAF 180 home screen — two entry paths and a list of recent invoices"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </div>
            <figcaption style={{
              fontSize: 12, letterSpacing: '0.06em', color: TERTIARY,
              marginTop: 14, textAlign: 'center',
            }}>
              Home — two ways in, recent invoices below.
            </figcaption>
          </figure>
        </section>

        {/* Approach */}
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)' }}>
          <p style={{
            fontSize: 'clamp(11px, 1vw, 12px)', fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: TERTIARY, margin: '0 0 clamp(32px, 4vw, 56px)',
          }}>
            Approach
          </p>
        </div>

        <ApproachBlock
          num="01"
          title="Two paths in"
          imgSrc="/work/taf180-foto.png"
          imgAlt="Rechnung aus Fotos — upload patient data, insurance card, and prescription"
        >
          A structured form for clean repeat patients. A photo-recognition flow for the
          messier reality — patient cards, Versicherungskarten, hand-written Verordnungen —
          where the Anthropic API parses the upload and a human signs off before anything is
          saved. Two ways in, one schema underneath.
        </ApproachBlock>

        <ApproachBlock
          num="02"
          title="Swiss QR-Bill, properly"
        >
          Built to SPS 2022 spec from day one. The QR payload, the Empfangsschein, and the
          Zahlteil are rendered from the same invoice data — no second source of truth, no
          PDF engine to wrangle. Print runs through the browser, which means a fix is a
          stylesheet, not a deploy.
        </ApproachBlock>

        <ApproachBlock
          num="03"
          title="Local-first, ready to run"
          last
        >
          The Tauri v2 build keeps the practice&apos;s data on the practice&apos;s Mac — API key in
          the OS keychain, invoice vault on disk, auto-updates handled natively. No backend
          to maintain, no cloud sync to debug, no DPA to negotiate. Open the app, click
          twice, print. That&apos;s the job.
        </ApproachBlock>

        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)' }}>

          {/* Stack */}
          <section style={{
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 'clamp(40px, 5vw, 64px)',
            paddingBottom: 'clamp(24px, 3vw, 40px)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}>
            <p style={{
              fontSize: 'clamp(11px, 1vw, 12px)', fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: TERTIARY, margin: 0,
            }}>
              Stack
            </p>
            <p style={{
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              color: SECONDARY, margin: 0, letterSpacing: '0.02em',
            }}>
              Tauri v2 · Rust · HTML / CSS / JS · Anthropic SDK · Swiss QR-Bill (SPS 2022)
            </p>
          </section>

        </div>
      </main>

      <Footer />

      <style>{`
        .case-back:hover { color: ${TEXT}; }
      `}</style>
    </>
  );
}

function ApproachBlock({
  num, title, children, imgSrc, imgAlt, last = false,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  imgSrc?: string;
  imgAlt?: string;
  last?: boolean;
}) {
  return (
    <section style={{ marginBottom: last ? 'clamp(80px, 10vw, 140px)' : 'clamp(80px, 10vw, 120px)' }}>
      {/* Text — narrow column, left-aligned */}
      <div style={{
        maxWidth: 1080,
        margin: imgSrc ? '0 auto clamp(36px, 4vw, 56px)' : '0 auto',
        padding: '0 clamp(24px, 5vw, 64px)',
      }}>
        <div style={{ maxWidth: 640 }}>
          <p style={{
            fontSize: 12, fontWeight: 600,
            letterSpacing: '0.18em', color: TERTIARY,
            margin: '0 0 14px', fontVariantNumeric: 'tabular-nums',
          }}>
            {num}
          </p>
          <h2 style={{
            fontSize: 'clamp(26px, 3.2vw, 40px)',
            fontWeight: 600, letterSpacing: '-0.02em',
            lineHeight: 1.15, color: TEXT, margin: '0 0 20px',
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: 'clamp(15px, 1.2vw, 17px)',
            lineHeight: 1.75, color: SECONDARY,
            margin: 0, maxWidth: '58ch',
          }}>
            {children}
          </p>
        </div>
      </div>

      {imgSrc ? (
        <div style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 64px)',
        }}>
          <figure style={{ margin: 0 }}>
            <div style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 12, overflow: 'hidden',
              background: SURFACE,
              boxShadow: '0 40px 80px -40px rgba(26,22,20,0.22)',
            }}>
              <img
                src={imgSrc}
                alt={imgAlt ?? ''}
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </div>
          </figure>
        </div>
      ) : null}
    </section>
  );
}
