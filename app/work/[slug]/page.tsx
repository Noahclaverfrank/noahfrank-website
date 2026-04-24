const PROJECTS: Record<string, { name: string; desc: string; tags: string; year: string }> = {
  'noahfrank-com': {
    name: 'noahfrank.com',
    desc: 'Personal brand website with an AI assistant — built entirely from scratch.',
    tags: 'Next.js · GSAP · Claude API',
    year: '2025',
  },
  'taf-180': {
    name: 'TAF 180',
    desc: 'Custom invoice and billing tool built for independent service providers.',
    tags: 'Web App',
    year: '2024',
  },
};

export function generateStaticParams() {
  return Object.keys(PROJECTS).map(slug => ({ slug }));
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS[slug];

  if (!project) return <div style={{ padding: '10vw', fontFamily: 'var(--font-sans)' }}>Project not found.</div>;

  return (
    <main style={{
      minHeight: '100svh',
      background: 'var(--color-background)',
      padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)',
      fontFamily: 'var(--font-sans)',
    }}>
      <a href="/" className="work-back-link">Noah Frank</a>

      <style>{`
        .work-back-link {
          position: fixed; top: 24px; left: 28px; z-index: 51;
          font-size: 20px; font-weight: 700; font-style: italic;
          letter-spacing: -0.03em; color: var(--color-text);
          text-decoration: none; white-space: nowrap;
          transition: opacity 0.18s;
        }
        .work-back-link:hover { opacity: 0.5; }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <p style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
          marginBottom: 'clamp(32px, 4vw, 48px)',
        }}>
          {project.year} — {project.tags}
        </p>

        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(48px, 8vw, 112px)',
          fontWeight: 700,
          letterSpacing: '-0.035em', lineHeight: 0.95,
          color: 'var(--color-text)',
          marginBottom: 'clamp(40px, 6vw, 72px)',
        }}>
          {project.name}
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 1.4vw, 20px)',
          lineHeight: 1.8,
          color: 'var(--color-text-secondary)',
          maxWidth: '55ch',
          marginBottom: 'clamp(48px, 6vw, 80px)',
        }}>
          {project.desc}
        </p>

        <p style={{
          fontSize: 13, color: 'var(--color-text-tertiary)',
          letterSpacing: '0.02em',
        }}>
          Full case study coming soon.
        </p>
      </div>
    </main>
  );
}
