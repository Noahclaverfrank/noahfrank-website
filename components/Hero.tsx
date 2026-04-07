'use client';

import { useEffect, useRef } from 'react';

const CARDS = [
  { label: 'Military',  title: 'Bundeswehr',       sub: 'Lieutenant · 2021–2024' },
  { label: 'Strategy',  title: 'KPMG · Alerion',   sub: 'Berlin & Zürich' },
  { label: 'Athletics', title: 'Ironman · Marathon', sub: 'Competitive rowing' },
];

export default function Hero() {
  const innerRef    = useRef<HTMLDivElement>(null);
  const hintRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    const hint  = hintRef.current;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !inner) return;

    const update = () => {
      const scrollY   = window.scrollY;
      const vh        = window.innerHeight;
      const progress  = Math.min(scrollY / (vh * 0.6), 1);
      inner.style.transform = `translateY(${scrollY * 0.18}px)`;
      inner.style.opacity   = String(Math.max(0, 1 - progress * 1.1));
      if (hint) hint.style.opacity = String(Math.max(0, 1 - progress * 3));
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
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -right-48 -top-48 h-[700px] w-[700px] rounded-full opacity-60"
        style={{ background: 'radial-gradient(circle at 60% 40%, rgba(200,82,42,0.10) 0%, transparent 65%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(200,82,42,0.06) 0%, transparent 70%)' }}
        aria-hidden
      />

      {/* Content */}
      <div
        ref={innerRef}
        className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12
                   px-6 pb-24 pt-[calc(56px+80px)]
                   md:grid-cols-[3fr_2fr] md:gap-16 md:px-12"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Text */}
        <div>
          <p className="eyebrow mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-8 bg-accent" />
            Zürich · Student · Builder
          </p>

          <h1
            id="hero-headline"
            className="hero-name font-bold leading-[0.98] tracking-tight text-text"
            style={{ fontSize: 'clamp(64px, 10vw, 112px)' }}
          >
            Noah<br />Frank
          </h1>

          <p className="hero-sub mt-7 max-w-[460px] text-[17px] leading-[1.7] text-text-secondary md:text-[18px]">
            I study business at UZH and spend the rest of my time building things,
            experimenting, and figuring out how stuff works.
            Curious by default — currently at Alerion Consult.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-sm px-5 py-[13px] text-[14px] font-semibold
                         transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'var(--color-text)', color: 'var(--color-background)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-text)')}
            >
              Say hello
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#experience"
              className="text-[14px] font-medium text-text-secondary transition-colors duration-200 hover:text-text"
            >
              What I&apos;ve been up to →
            </a>
          </div>
        </div>

        {/* Credential cards */}
        <div className="hidden flex-col gap-3 md:flex">
          {CARDS.map((card, i) => (
            <div
              key={card.label}
              className="card group rounded-xl border border-border p-5 backdrop-blur-sm
                         transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              style={{
                background: 'rgba(240,235,227,0.8)',
                animationDelay: `${0.35 + i * 0.13}s`,
              }}
            >
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
                {card.label}
              </p>
              <p className="text-[16px] font-bold text-text">{card.title}</p>
              <p className="mt-0.5 text-[13px] text-text-secondary">{card.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-tertiary"
        aria-hidden
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.22em]">Scroll</span>
        <svg className="scroll-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M1 1l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .eyebrow    { animation: fadeUp 0.6s ease-out 0.1s both; }
          .hero-name  { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
          .hero-sub   { animation: fadeUp 0.6s ease-out 0.38s both; }
          .hero-cta   { animation: fadeUp 0.6s ease-out 0.5s both; }
          .card       { animation: fadeLeft 0.5s ease-out both; }
          .scroll-chevron { animation: bounce 2s ease-in-out 1.4s infinite; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }
      `}</style>
    </section>
  );
}
