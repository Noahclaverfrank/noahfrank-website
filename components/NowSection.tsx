'use client';

import { useEffect, useRef } from 'react';

const UPDATED = 'Updated April 2026';

const ITEMS = [
  {
    label: 'Reading',
    title: 'TBD',
    note:  'TBD — a sentence on why this book has my attention.',
  },
  {
    label: 'Listening',
    title: 'TBD',
    note:  'TBD — a sentence on what this is doing for me right now.',
  },
  {
    label: 'Learning',
    title: 'TBD',
    note:  'TBD — a sentence on what I am working out here.',
  },
];

export default function NowSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const parts = section.querySelectorAll<HTMLElement>('[data-now-part]');
    if (prefersReduced) {
      parts.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const items = el.querySelectorAll<HTMLElement>('[data-now-part]');
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'none';
          }, i * 80);
        });
        observer.unobserve(el);
      }),
      { threshold: 0.2 }
    );

    const header = section.querySelector<HTMLElement>('[data-now-header]');
    if (header) observer.observe(header);
    section.querySelectorAll<HTMLElement>('[data-now-block]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="now"
      data-section="now"
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div data-now-header>
          <p
            data-now-part
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
              margin: 0, marginBottom: 16,
              opacity: 0, transform: 'translateY(20px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            Now
          </p>
          <p
            data-now-part
            style={{
              fontSize: 12, fontStyle: 'italic',
              color: 'var(--color-text-tertiary)',
              margin: 0, marginBottom: 'clamp(48px, 6vw, 72px)',
              opacity: 0, transform: 'translateY(12px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            {UPDATED}
          </p>
        </div>

        {ITEMS.map((item, i) => (
          <div
            key={item.label}
            data-now-block
            style={{
              paddingTop: i === 0 ? 0 : 48,
              paddingBottom: i === ITEMS.length - 1 ? 0 : 48,
              borderBottom: i === ITEMS.length - 1
                ? 'none'
                : '1px solid var(--color-border)',
            }}
          >
            <p
              data-now-part
              style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                margin: 0, marginBottom: 16,
                opacity: 0, transform: 'translateY(12px)',
                transition: 'opacity 0.55s ease, transform 0.55s ease',
              }}
            >
              {item.label}
            </p>
            <p
              data-now-part
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: 'var(--color-text)',
                margin: 0, marginBottom: 14,
                opacity: 0, transform: 'translateY(12px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              {item.title}
            </p>
            <p
              data-now-part
              style={{
                fontSize: 15, lineHeight: 1.75,
                color: 'var(--color-text-secondary)',
                margin: 0, maxWidth: '60ch',
                opacity: 0, transform: 'translateY(12px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
