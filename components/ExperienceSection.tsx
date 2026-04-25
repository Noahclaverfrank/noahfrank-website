'use client';

import { useEffect, useRef } from 'react';

const TIMELINE = [
  {
    period: 'OCT 2025 —',
    location: 'ZÜRICH',
    org: 'Alerion Consult',
    role: 'Working Student · Strategy & Transformation',
    desc: 'Primary analyst on a live corporate strategy project for a 500+ employee client. Building competitor screens and KPI snapshots, then translating the findings into materials that land in front of leadership. First time being the one person responsible for a real client deliverable.',
  },
  {
    period: 'JUN — SEP 2025',
    location: 'BERLIN',
    org: 'KPMG',
    role: 'Intern · Tech Strategy & Operations',
    desc: "Spent the summer inside KPMG's consulting practice. Wrote the solution narratives that shaped how clients understood their options, ran vendor assessments for IT outsourcing decisions, and supported workshops from agenda to follow-up. Learned what client-ready actually means when it matters.",
  },
  {
    period: '2021 — 2024',
    location: 'GERMANY',
    org: 'Bundeswehr',
    role: 'Lieutenant · German Armed Forces',
    desc: 'Three years as an officer. Led a 30-person platoon, ran a 12-person squad, was selected for the German Commando Course in survival and evasion. More hours making decisions under pressure before 23 than most people accumulate in a decade.',
  },
];

export default function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      const parts = section.querySelectorAll<HTMLElement>('[data-exp-part]');
      parts.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const items = el.querySelectorAll<HTMLElement>('[data-exp-part]');
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

    section.querySelectorAll<HTMLElement>('[data-exp-block]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="experience"
      data-section="experience"
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p
          data-exp-part
          style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
            marginBottom: 'clamp(64px, 8vw, 120px)',
            opacity: 0, transform: 'translateY(20px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          Experience
        </p>

        {TIMELINE.map((item, i) => (
          <div
            key={i}
            data-exp-block
            style={{
              paddingTop:    'clamp(64px, 12vh, 180px)',
              paddingBottom: 'clamp(64px, 12vh, 180px)',
              borderTop: i === 0 ? 'none' : '1px solid rgba(26,22,20,0.08)',
            }}
          >
            <div style={{ maxWidth: 820 }}>
              <p
                data-exp-part
                style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)',
                  margin: 0, marginBottom: 24,
                  opacity: 0, transform: 'translateY(12px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                {item.period} &nbsp;·&nbsp; {item.location}
              </p>
              <h3
                data-exp-part
                className="exp-org"
                style={{
                  position: 'relative',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: 'clamp(48px, 7vw, 80px)',
                  letterSpacing: '-0.035em',
                  lineHeight: 0.95,
                  color: 'var(--color-text)',
                  margin: 0, marginBottom: 28,
                  display: 'inline-block',
                  opacity: 0, transform: 'translateY(12px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                {item.org}
              </h3>
              <p
                data-exp-part
                style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)',
                  margin: 0, marginBottom: 32,
                  opacity: 0, transform: 'translateY(12px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                {item.role}
              </p>
              <p
                data-exp-part
                style={{
                  fontSize: 'clamp(15px, 1.3vw, 17px)',
                  lineHeight: 1.85,
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  maxWidth: '60ch',
                  opacity: 0, transform: 'translateY(12px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .exp-org::after {
          content: '';
          position: absolute;
          left: 0; bottom: -10px;
          width: 28px; height: 2px;
          background: var(--color-accent);
        }
      `}</style>
    </section>
  );
}
