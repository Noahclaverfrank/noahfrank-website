'use client';

import { useEffect, useRef } from 'react';

type Theme = 'dark' | 'light';

type WorkItem = {
  num: string;
  name: string;
  slug: string;
  desc: string;
  tags: string;
  year: string;
  image?: string;
  theme?: Theme;
  lede?: string;
  bullets?: string[];
  cta?: string;
};

export const WORK: WorkItem[] = [
  {
    num: '01',
    name: 'noahfrank.com',
    slug: 'noahfrank-com',
    desc: 'A site built in public to learn frontend, AI integration, and editorial design.',
    tags: 'Next.js · GSAP · Anthropic SDK',
    year: '2025 –',
    lede: 'Built in public to learn modern frontend, AI integration, and editorial design — and to introduce me more honestly than a LinkedIn profile.',
    bullets: [
      'Single-font discipline (Geist)',
      'Custom canvas hero — no stock libraries',
      'A streaming concierge instead of an About page',
    ],
    cta: 'Read the case study →',
  },
  {
    num: '02',
    name: 'ErgoDoc',
    slug: 'ergodoc',
    desc: 'Desktop app that streamlines documentation for occupational therapists.',
    tags: 'Electron · React',
    year: '2024 –',
    image: '/work/ergodoc.png',
    theme: 'light',
    lede: 'Built because German therapists drown in paperwork that shouldn’t exist.',
    bullets: [
      'Local-first',
      'Claude API integration',
      'Designed for practice teams, not solo users',
    ],
    cta: 'Read the case study →',
  },
  {
    num: '03',
    name: 'TAF 180',
    slug: 'taf-180',
    desc: 'A desktop invoicing tool for an ergotherapy practice in Zürich.',
    tags: 'Tauri v2 · Anthropic SDK · Swiss QR-Bill',
    year: '2026',
    image: '/work/taf180-home.png',
    theme: 'light',
    lede: 'A desktop invoicing tool for an ergotherapy practice in Zürich — Swiss QR-Bill, photo-to-invoice, local-first by design.',
    bullets: [
      'Two paths in: structured form or photo recognition',
      'Swiss QR-Bill to SPS 2022 spec',
      'Local-first — keys, files, and updates stay on the Mac',
    ],
    cta: 'Read the case study →',
  },
];

type Color = { r: number; g: number; b: number };
type ThemeTokens = {
  bg: Color;
  border: Color;
  borderAlpha: number;
  header: Color;
  headerAlpha: number;
};

const DARK: ThemeTokens = {
  bg:          { r: 20,  g: 17,  b: 15  },
  border:      { r: 255, g: 255, b: 255 },
  borderAlpha: 0.00,
  header:      { r: 237, g: 234, b: 227 },
  headerAlpha: 0.85,
};

const LIGHT: ThemeTokens = {
  bg:          { r: 247, g: 243, b: 235 },
  border:      { r: 26,  g: 22,  b: 20  },
  borderAlpha: 0.14,
  header:      { r: 26,  g: 22,  b: 20  },
  headerAlpha: 0.70,
};

const TOKENS_FOR_THEME = (t?: Theme): ThemeTokens => (t === 'light' ? LIGHT : DARK);

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef   = useRef<HTMLDivElement>(null);
  const boxRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    const stage   = stageRef.current;
    const box     = boxRef.current;
    if (!section || !stage || !box) return;

    const rows    = Array.from(box.querySelectorAll<HTMLElement>('[data-work-row]'));
    const bgs     = Array.from(box.querySelectorAll<HTMLElement>('[data-bg-image]'));
    const counterActive = box.querySelector<HTMLElement>('[data-counter-active]');
    const headers = Array.from(box.querySelectorAll<HTMLElement>('[data-work-header]'));

    const themeTokens = WORK.map(p => TOKENS_FOR_THEME(p.theme));

    // Each project has a four-zone lifecycle: ease-in entrance, rest plateau,
    // ease-out exit. Adjacent projects share their transition window so one
    // crossfades directly into the next — no blank frames between.
    const PROJECT_PHASES = [
      { start: 0.22, enterEnd: 0.30, exitStart: 0.42, end: 0.50 },
      { start: 0.42, enterEnd: 0.50, exitStart: 0.62, end: 0.70 },
      { start: 0.62, enterEnd: 0.70, exitStart: 0.78, end: 0.86 },
    ];
    const TRANSLATE_Y = 16;
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh   = window.innerHeight;
      const total = rect.height - vh;
      const p = total > 0
        ? Math.min(Math.max(-rect.top / total, 0), 1)
        : 0;

      // Box size: expands 0→1 over p=0..0.22 (entry, bottom-anchored),
      // stays at 1 through the projects, then shrinks 1→0 over p=0.78..1.0
      // (exit, top-anchored). The alignment flips at p=0.78 so the box
      // retreats upward — top pinned, bottom rising.
      const expandP  = Math.min(p / 0.22, 1);
      const shrinkP  = Math.max((p - 0.78) / 0.22, 0);
      const isExiting = p >= 0.78;
      const boxSize  = isExiting ? (1 - shrinkP) : expandP;
      box.style.setProperty('--work-side-vw', `${8 * (1 - boxSize)}`);
      box.style.setProperty('--work-top-vh',  `${12 * (1 - boxSize)}`);

      stage.style.alignItems = isExiting ? 'flex-start' : 'flex-end';
      const compactRadius = 16 * (1 - boxSize);
      const topRadius    = isExiting ? 0 : compactRadius;
      const bottomRadius = isExiting ? compactRadius : 0;
      box.style.borderRadius = `${topRadius}px ${topRadius}px ${bottomRadius}px ${bottomRadius}px`;

      if (counterActive) {
        const idx = p < 0.46 ? 0 : p < 0.66 ? 1 : 2;
        const nextText = `0${idx + 1}`;
        if (counterActive.textContent !== nextText) counterActive.textContent = nextText;
      }

      const rowOpacities: number[] = [0, 0, 0];
      rows.forEach((row, i) => {
        const { start, enterEnd, exitStart, end } = PROJECT_PHASES[i];
        let opacity = 0;
        let y = TRANSLATE_Y;

        if (p <= start) {
          opacity = 0;
          y = TRANSLATE_Y;
        } else if (p < enterEnd) {
          const eased = easeInOut((p - start) / (enterEnd - start));
          opacity = eased;
          y = TRANSLATE_Y * (1 - eased);
        } else if (p <= exitStart) {
          opacity = 1;
          y = 0;
        } else if (p < end) {
          const eased = easeInOut((p - exitStart) / (end - exitStart));
          opacity = 1 - eased;
          y = -TRANSLATE_Y * eased;
        } else {
          opacity = 0;
          y = -TRANSLATE_Y;
        }

        rowOpacities[i] = opacity;
        row.style.opacity = String(opacity);
        row.style.setProperty('--row-y',     `${y}px`);
        row.style.setProperty('--row-scale', '1');
      });

      bgs.forEach((bg) => {
        const idx = Number(bg.dataset.bgIdx);
        if (Number.isNaN(idx)) return;
        bg.style.opacity = String(rowOpacities[idx] ?? 0);
      });

      // Theme blend. Weights = normalized rowOpacities. During transitions,
      // two slides contribute proportionally; during plateaus, one dominates.
      // Pre-entry (p < 0.22, all opacities 0) snaps to the first slide's theme.
      const totalW = rowOpacities.reduce((s, o) => s + o, 0);
      const weights = totalW < 0.001
        ? themeTokens.map((_, i) => (i === 0 ? 1 : 0))
        : rowOpacities.map(o => o / totalW);

      let bgR = 0, bgG = 0, bgB = 0;
      let brR = 0, brG = 0, brB = 0, brA = 0;
      let hR  = 0, hG  = 0, hB  = 0, hA  = 0;
      for (let i = 0; i < themeTokens.length; i++) {
        const t = themeTokens[i];
        const w = weights[i];
        bgR += t.bg.r * w;     bgG += t.bg.g * w;     bgB += t.bg.b * w;
        brR += t.border.r * w; brG += t.border.g * w; brB += t.border.b * w;
        brA += t.borderAlpha * w;
        hR  += t.header.r * w; hG  += t.header.g * w; hB  += t.header.b * w;
        hA  += t.headerAlpha * w;
      }

      // Intro/outro border (small, fading to 0 as box grows — mirrored on exit)
      // plus theme border (persistent on light themes). Take the max.
      const introBorderAlpha = 0.08 * (1 - boxSize);
      const finalBorderAlpha = Math.max(introBorderAlpha, brA);

      box.style.background = `rgb(${bgR|0},${bgG|0},${bgB|0})`;
      box.style.border = `1px solid rgba(${brR|0},${brG|0},${brB|0},${finalBorderAlpha.toFixed(3)})`;

      const headerColor = `rgba(${hR|0},${hG|0},${hB|0},${hA.toFixed(3)})`;
      headers.forEach(el => { el.style.color = headerColor; });

      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll',  onScroll, { passive: true });
    window.addEventListener('resize',  onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      data-section="work"
      style={{ height: '400svh', position: 'relative', background: '#EDEAE3' }}
    >
      <div
        ref={stageRef}
        className="work-stage-reduced"
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <div
          ref={boxRef}
          className="work-box"
          style={{
            position: 'relative',
            background: '#14110F',
            color: '#EDEAE3',
            width:  'calc(100vw - var(--work-side-vw, 8) * 2vw)',
            height: 'calc(100svh - var(--work-top-vh, 12) * 1vh)',
            borderRadius: 'var(--work-radius, 16px) var(--work-radius, 16px) 0 0',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 'clamp(24px, 4vh, 48px)',
            left: 'clamp(24px, 4vw, 64px)',
            right: 'clamp(24px, 4vw, 64px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            zIndex: 2,
          }}>
            <p
              data-work-header
              style={{
                fontSize: 15, fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(237,234,227,0.85)', margin: 0,
              }}
            >
              Selected Work
            </p>
            <p
              data-work-header
              data-counter
              style={{
                fontSize: 15, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(237,234,227,0.85)', margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <span data-counter-active>01</span>
              <span> / 03</span>
            </p>
          </div>
          {WORK.map((p, i) => p.image ? (
            <div
              key={`bg-${p.num}`}
              data-bg-image
              data-bg-idx={i}
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${p.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0,
                pointerEvents: 'none',
                willChange: 'opacity',
              }}
            >
              {p.theme !== 'light' ? (
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(20,17,15,0.55) 0%, rgba(20,17,15,0.72) 60%, rgba(20,17,15,0.85) 100%)',
                  }}
                />
              ) : null}
            </div>
          ) : null)}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(24px, 6vw, 96px)',
            pointerEvents: 'none',
          }}>
            {WORK.map((p) => {
              const t = p.theme ?? 'dark';
              const primary     = t === 'light' ? '#1A1614'              : '#EDEAE3';
              const secondary   = t === 'light' ? 'rgba(26,22,20,0.62)'  : 'rgba(237,234,227,0.75)';
              const tertiary    = t === 'light' ? 'rgba(26,22,20,0.50)'  : 'rgba(237,234,227,0.55)';
              const divider     = t === 'light' ? 'rgba(26,22,20,0.15)'  : 'rgba(237,234,227,0.18)';
              const cardBg      = t === 'light' ? 'rgba(250,247,240,0.97)' : 'transparent';
              const cardBorder  = t === 'light' ? 'rgba(26,22,20,0.10)'  : 'transparent';
              const cardShadow  = t === 'light' ? '0 30px 72px -24px rgba(26,22,20,0.28)' : 'none';

              return (
                <a
                  key={p.num}
                  href={`/work/${p.slug}`}
                  data-work-row
                  style={{
                    position: 'absolute',
                    left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%) translateY(var(--row-y, 0)) scale(var(--row-scale, 1))',
                    opacity: 0,
                    textDecoration: 'none',
                    color: primary,
                    maxWidth: 'min(900px, 80vw)',
                    width: '100%',
                    textAlign: 'center',
                    willChange: 'transform, opacity',
                    transition: 'opacity 0.15s linear',
                    pointerEvents: 'auto',
                    background: cardBg,
                    border: t === 'light' ? `1px solid ${cardBorder}` : 'none',
                    borderRadius: t === 'light' ? 20 : 0,
                    padding: t === 'light' ? 'clamp(32px, 4vw, 56px) clamp(28px, 4vw, 64px)' : 0,
                    boxShadow: cardShadow,
                  }}
                >
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: tertiary,
                    marginBottom: 20,
                  }}>
                    {p.num} · {p.year}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(48px, 8vw, 104px)',
                    fontWeight: 700,
                    letterSpacing: '-0.035em',
                    lineHeight: 0.95,
                    color: primary,
                    margin: '0 0 28px',
                  }}>
                    {p.name}
                  </h3>
                  <p style={{
                    fontSize: 16,
                    lineHeight: 1.75,
                    color: secondary,
                    margin: '0 auto',
                    maxWidth: p.bullets ? '52ch' : '60ch',
                  }}>
                    {p.lede ?? p.desc}
                  </p>
                  {p.bullets ? (
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '24px auto 0',
                      maxWidth: '46ch',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: secondary,
                    }}>
                      {p.bullets.map((b, bi) => (
                        <li key={bi}>— {b}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div style={{
                    paddingTop: 16,
                    borderTop: `1px solid ${divider}`,
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: tertiary,
                    maxWidth: '60ch',
                    margin: '28px auto 0',
                  }}>
                    {p.cta ?? p.tags}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #work {
            height: auto !important;
          }
          #work .work-stage-reduced {
            position: static !important;
            height: auto !important;
            display: block !important;
          }
          #work .work-box {
            width: 100% !important;
            height: auto !important;
            border-radius: 0 !important;
            border: none !important;
            padding: clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px);
          }
          #work .work-box [data-work-row] {
            position: static !important;
            transform: none !important;
            opacity: 1 !important;
            display: block;
            width: 100%;
            max-width: 720px;
            margin: clamp(48px, 6vw, 80px) auto;
            text-align: left;
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            border: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          #work .work-box [data-work-row] h3 {
            font-size: clamp(36px, 5vw, 56px) !important;
          }
          #work .work-box [data-counter] {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
