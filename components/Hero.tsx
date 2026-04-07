'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const innerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      id="hero"
      data-section="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Subtle warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[80vh] w-[60vw] opacity-40"
        style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(200,82,42,0.07) 0%, transparent 60%)' }}
      />

      <div
        ref={innerRef}
        className="relative mx-auto w-full max-w-[1400px] px-8 md:px-16"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Eyebrow */}
        <p className="eyebrow mb-8 text-[11px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
          Zürich — Student — Builder
        </p>

        {/* Name */}
        <h1
          id="hero-headline"
          className="hero-name font-light leading-[0.92] text-text"
          style={{ fontSize: 'clamp(80px, 13vw, 180px)', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, letterSpacing: '-0.01em' }}
        >
          Noah<br />Frank
        </h1>

        {/* Divider */}
        <div className="hero-divider mt-10 h-px w-16 bg-border" />

        {/* Tagline */}
        <p className="hero-sub mt-8 max-w-[420px] text-[16px] leading-[1.75] text-text-secondary">
          I study business at UZH and spend the rest of my time building things,
          experimenting, and figuring out how stuff works.
          Curious by default.
        </p>

        {/* CTA */}
        <div className="hero-cta mt-10 flex items-center gap-6">
          <a
            href="#contact"
            className="text-[13px] font-semibold uppercase tracking-[0.15em] text-text
                       border-b border-text pb-0.5 hover:border-accent hover:text-accent
                       transition-colors duration-200"
          >
            Get in touch
          </a>
          <a
            href="#experience"
            className="text-[13px] font-medium text-text-tertiary hover:text-text transition-colors duration-200"
          >
            Experience →
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-8 md:left-16 flex items-center gap-3 text-text-tertiary"
        aria-hidden
      >
        <div className="h-px w-8 bg-text-tertiary" />
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .eyebrow     { animation: fadeUp 0.5s ease-out 0.1s both; }
          .hero-name   { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
          .hero-divider{ animation: fadeUp 0.5s ease-out 0.4s both; }
          .hero-sub    { animation: fadeUp 0.6s ease-out 0.5s both; }
          .hero-cta    { animation: fadeUp 0.6s ease-out 0.62s both; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
