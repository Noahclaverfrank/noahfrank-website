'use client';

import { useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
function scramble(target: string, el: HTMLElement, duration = 800) {
  const len = target.length;
  let frame = 0;
  const totalFrames = Math.round(duration / 30);
  const id = setInterval(() => {
    const progress = frame / totalFrames;
    el.textContent = target
      .split('')
      .map((ch, i) => {
        if (ch === '\n' || ch === ' ') return ch;
        if (i / len < progress) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
    if (frame++ >= totalFrames) {
      el.textContent = target;
      clearInterval(id);
    }
  }, 30);
}

export default function Hero() {
  const innerRef    = useRef<HTMLDivElement>(null);
  const nameRef     = useRef<HTMLHeadingElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);

  // Scroll parallax + fade
  useEffect(() => {
    const inner = innerRef.current;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !inner) return;
    const update = () => {
      const scrollY  = window.scrollY;
      const vh       = window.innerHeight;
      const progress = Math.min(scrollY / (vh * 0.7), 1);
      inner.style.transform = `translateY(${scrollY * 0.15}px)`;
      inner.style.opacity   = String(Math.max(0, 1 - progress * 1.2));
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Letter scramble on load
  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    setTimeout(() => scramble('Noah\nFrank', el, 900), 200);
  }, []);

  // Animated line
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { line.style.width = '64px'; return; }
    setTimeout(() => {
      line.style.transition = 'width 0.9s cubic-bezier(0.16,1,0.3,1)';
      line.style.width = '64px';
    }, 600);
  }, []);

  return (
    <section
      id="hero"
      data-section="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Warm glow */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[80vh] w-[60vw] opacity-40"
        style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(200,82,42,0.07) 0%, transparent 60%)' }} />

      {/* Ghost text — "NF" large in background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-end pr-8 md:pr-16 select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-light text-text"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(260px, 40vw, 520px)',
            lineHeight: 1,
            opacity: 0.04,
            letterSpacing: '-0.04em',
            userSelect: 'none',
          }}
        >
          NF
        </span>
      </div>

      {/* Main content */}
      <div
        ref={innerRef}
        className="relative mx-auto w-full max-w-[1400px] px-8 md:px-16"
        style={{ zIndex: 1, willChange: 'transform, opacity' }}
      >
        <p className="eyebrow mb-8 text-[11px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
          Zürich — Student — Builder
        </p>

        <h1
          id="hero-headline"
          ref={nameRef}
          className="hero-name font-light text-text whitespace-pre-line"
          style={{
            fontSize: 'clamp(80px, 13vw, 180px)',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            lineHeight: 0.92,
            letterSpacing: '-0.01em',
          }}
        >
          Noah{'\n'}Frank
        </h1>

        {/* Self-drawing line */}
        <div
          ref={lineRef}
          className="hero-divider mt-10 h-px bg-border"
          style={{ width: 0 }}
        />

        <p className="hero-sub mt-8 max-w-[420px] text-[16px] leading-[1.75] text-text-secondary">
          I study business at UZH and spend the rest of my time building things,
          experimenting, and figuring out how stuff works.
          Curious by default.
        </p>

        <div className="hero-cta mt-10 flex items-center gap-6">
          <a href="#contact"
            className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text
                       border-b border-text pb-0.5 hover:border-accent hover:text-accent
                       transition-colors duration-200">
            Get in touch
          </a>
          <a href="#experience"
            className="text-[13px] font-medium text-text-tertiary hover:text-text transition-colors duration-200">
            Experience →
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 md:left-16 flex items-center gap-3 text-text-tertiary" aria-hidden>
        <div className="h-px w-8 bg-text-tertiary" />
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .eyebrow  { animation: fadeUp 0.5s ease-out 0.1s both; }
          .hero-sub { animation: fadeUp 0.6s ease-out 0.5s both; }
          .hero-cta { animation: fadeUp 0.6s ease-out 0.62s both; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
