import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import GrainTexture from '@/components/GrainTexture';
import LenisProvider from '@/components/LenisProvider';

export const metadata: Metadata = {
  title: 'ErgoDoc — Case study',
  description:
    'Desktop documentation for occupational therapy teams in Germany. Local-first, Claude API integration, built for practice teams.',
};

const TEXT      = '#1A1614';
const SECONDARY = '#6E6259';
const TERTIARY  = '#A39690';
const BG        = '#EDEAE3';
const SURFACE   = '#F0EBE3';
const BORDER    = '#DDD8D0';
const ACCENT    = '#C8522A';

export default function ErgodocCaseStudy() {
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
              02 · 2024 — present
            </p>
            <h1 style={{
              fontSize: 'clamp(56px, 10vw, 128px)',
              fontWeight: 700, letterSpacing: '-0.035em',
              lineHeight: 0.95, margin: '0 0 clamp(32px, 4vw, 56px)',
              color: TEXT,
            }}>
              ErgoDoc
            </h1>
            <p style={{
              fontSize: 'clamp(18px, 1.6vw, 24px)',
              lineHeight: 1.55, color: SECONDARY,
              maxWidth: '42ch', margin: 0,
            }}>
              Desktop documentation for occupational therapy teams in Germany.
            </p>
            {/* Single terracotta stroke — the one accent per page */}
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
              German therapists drown in paperwork that shouldn’t exist.
            </p>
            <p style={{ fontSize: 'clamp(15px, 1.25vw, 17px)', lineHeight: 1.75, color: SECONDARY, margin: '0 0 20px' }}>
              Session notes, Verlaufsdokumentation, Arztberichte, billing forms — the legal and
              clinical record-keeping required by §630f BGB and the Heilmittel-Richtlinie eats
              hours every week. Existing Praxis-Software is built for billing, not for the
              therapist at the end of a long session.
            </p>
            <p style={{ fontSize: 'clamp(15px, 1.25vw, 17px)', lineHeight: 1.75, color: SECONDARY, margin: 0 }}>
              ErgoDoc is what happens when you start from the therapist’s desk instead of the
              biller’s inbox.
            </p>
          </section>

        </div>

        {/* App — full-width Patientenliste */}
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
                src="/work/ergodoc.png"
                alt="ErgoDoc patient list — active treatments and today’s open items"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </div>
            <figcaption style={{
              fontSize: 12, letterSpacing: '0.06em', color: TERTIARY,
              marginTop: 14, textAlign: 'center',
            }}>
              Patientenliste — the daily home screen.
            </figcaption>
          </figure>
        </section>

        {/* Approach — header in narrow column, images full-width below each block */}
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
          title="Local-first"
          imgSrc="/work/ergodoc-patient.png"
          imgAlt="Patient detail view — treatment history, session counts, progress tracking"
        >
          <>
            Patient data never leaves the machine. The full record — Stammdaten, Verlauf,
            Arztberichte, Verordnungen — lives in a SQLite file under the therapist’s
            control. No cloud account, no sync server, no backup vendor with DPA gaps.
            This isn’t a privacy feature bolted on; it’s the architecture.
          </>
        </ApproachBlock>

        <ApproachBlock
          num="02"
          title="Claude API integration"
          imgSrc="/work/ergodoc-privacy.png"
          imgAlt="Datenschutz-Vorschau modal — preview and anonymize before sending data to Claude"
        >
          <>
            Report generation goes through the Anthropic API — but on the therapist’s terms.
            Before any data leaves the machine, a preview dialog shows exactly what will be
            sent and offers one-click anonymization of detected personal data. The safety
            layer is part of the UX, not a terms-of-service footnote.
          </>
        </ApproachBlock>

        <ApproachBlock
          num="03"
          title="Designed for practice teams, not solo users"
          imgSrc="/work/ergodoc-arzte.png"
          imgAlt="Ärzte directory — shared list of referring physicians across the practice"
          last
        >
          <>
            Most ergo-tools assume one therapist, one patient list. Real practices run with
            three to eight therapists, shared referring physicians, and handovers between
            colleagues. ErgoDoc models that from day one — shared doctor directory,
            cross-therapist handover notes, role-aware permissions.
          </>
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
              Electron · React · SQLite · Node / Express · Anthropic SDK
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
  imgSrc: string;
  imgAlt: string;
  last?: boolean;
}) {
  return (
    <section style={{ marginBottom: last ? 'clamp(80px, 10vw, 140px)' : 'clamp(80px, 10vw, 120px)' }}>
      {/* Text — narrow column, left-aligned */}
      <div style={{
        maxWidth: 1080,
        margin: '0 auto clamp(36px, 4vw, 56px)',
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

      {/* Figure — wide container, full-width image */}
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
              alt={imgAlt}
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
