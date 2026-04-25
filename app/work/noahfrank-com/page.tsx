import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import GrainTexture from '@/components/GrainTexture';
import LenisProvider from '@/components/LenisProvider';

export const metadata: Metadata = {
  title: 'noahfrank.com — Case study',
  description:
    'A site built in public to learn modern frontend, AI integration, and editorial design — and to introduce me more honestly than a LinkedIn profile.',
};

const TEXT      = '#1A1614';
const SECONDARY = '#6E6259';
const TERTIARY  = '#A39690';
const BG        = '#EDEAE3';
const BORDER    = '#DDD8D0';
const ACCENT    = '#C8522A';

export default function NoahfrankComCaseStudy() {
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
          <header style={{ maxWidth: 900, marginBottom: 'clamp(56px, 7vw, 88px)' }}>
            <p style={{
              fontSize: 12, fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: TERTIARY, margin: '0 0 clamp(28px, 3vw, 40px)',
            }}>
              01 · 2025 — present
            </p>
            <h1 style={{
              fontSize: 'clamp(48px, 8vw, 104px)',
              fontWeight: 700, letterSpacing: '-0.035em',
              lineHeight: 0.95, margin: '0 0 clamp(32px, 4vw, 56px)',
              color: TEXT,
            }}>
              noahfrank.com
            </h1>
            <p style={{
              fontSize: 'clamp(18px, 1.6vw, 24px)',
              lineHeight: 1.55, color: SECONDARY,
              maxWidth: '46ch', margin: 0,
            }}>
              A site built in public to learn modern frontend, AI integration, and
              editorial design — and to introduce me more honestly than a LinkedIn profile.
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
              Why
            </p>
            <p style={{
              fontSize: 'clamp(17px, 1.5vw, 20px)', lineHeight: 1.7,
              color: TEXT, margin: '0 0 24px', fontWeight: 500,
            }}>
              LinkedIn flattens you into bullet points. A polished portfolio template lies in
              the other direction. I wanted somewhere in between.
            </p>
            <p style={{ fontSize: 'clamp(15px, 1.25vw, 17px)', lineHeight: 1.75, color: SECONDARY, margin: '0 0 20px' }}>
              No formal CS background, no employer paying for the design hours, no client
              brief. Just a place to learn modern frontend, AI integration, and editorial
              design by shipping it — and to give a visitor something more honest than a
              line item under &ldquo;Education&rdquo;.
            </p>
            <p style={{ fontSize: 'clamp(15px, 1.25vw, 17px)', lineHeight: 1.75, color: SECONDARY, margin: 0 }}>
              The thing in front of you is the proof. Every typeface choice, animation curve,
              and copy line is something I had to decide on. The site is the case study.
            </p>
          </section>

        </div>

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

        <ApproachBlock num="01" title="One typeface, used with intent">
          Geist Variable, weight range 100 to 900, across the entire site — display, body,
          nav, labels, project names. Hierarchy is built from weight, not from font pairings.
          The single accent is one terracotta stroke per section, never a fill. The discipline
          was the design.
        </ApproachBlock>

        <ApproachBlock num="02" title="A hero made of canvas, not stock">
          The headline sits inside a hand-drawn animation surface — drifting orb gradients
          underneath a network mesh with a single light particle pathfinding through it,
          composited with a per-letter scramble on the name. Built from scratch on raw 2D
          canvas because off-the-shelf libraries felt generic.
        </ApproachBlock>

        <ApproachBlock num="03" title="A concierge instead of an About page">
          The &ldquo;Ring the concierge&rdquo; entry in the nav opens a streaming chat that answers
          questions about my background, projects, and what I&apos;m open to next. Built on the
          Anthropic SDK with a system prompt that knows me the way a careful front-desk
          person would. It replaces the usual bio with something that meets the visitor on
          their terms.
        </ApproachBlock>

        <ApproachBlock num="04" title="Shipped in public, in motion" last>
          Pinned scroll sequences, a four-row reveal inside a black box that crossfades
          between projects, smooth-scroll via Lenis, theme-blending across light and dark
          slides — all standing on Next.js 16 App Router and Tailwind v4 tokens. Every piece
          either earned its place or got cut. Three iterations of the homepage are already in
          the git log.
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
              Next.js 16 · React 19 · Tailwind v4 · GSAP · Lenis · Anthropic SDK · Netlify
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
  num, title, children, last = false,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section style={{ marginBottom: last ? 'clamp(80px, 10vw, 140px)' : 'clamp(56px, 7vw, 88px)' }}>
      <div style={{
        maxWidth: 1080,
        margin: '0 auto',
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
    </section>
  );
}
