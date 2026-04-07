'use client';

import { useEffect, useRef } from 'react';

const SECTIONS = ['about', 'experience', 'contact'] as const;

export default function Nav() {
  const brandRef = useRef<HTMLAnchorElement>(null);
  const pillRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    const brand      = brandRef.current;
    const pill       = pillRef.current;
    const headline   = document.getElementById('hero-headline');
    const heroEl     = document.getElementById('hero');

    const update = () => {
      if (headline && brand) {
        const rect = headline.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1,
          1 - (rect.bottom - 80) / (280 - 80)
        ));
        brand.style.opacity = progress.toFixed(3);
      }

      if (heroEl && pill) {
        const rect = heroEl.getBoundingClientRect();
        const start = window.innerHeight * 0.85;
        const end   = window.innerHeight * 0.5;
        const p = Math.max(0, Math.min(1, 1 - (rect.bottom - end) / (start - end)));
        pill.style.opacity   = p.toFixed(3);
        pill.style.transform = `translateX(-50%) translateY(${((1 - p) * 14).toFixed(1)}px)`;
        (pill as HTMLElement).style.pointerEvents = p > 0.1 ? 'auto' : 'none';
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Active section tracking
  useEffect(() => {
    const links = document.querySelectorAll<HTMLElement>('[data-nav-link]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = (entry.target as HTMLElement).dataset.section;
          links.forEach(l => {
            if (id) l.dataset.active = l.dataset.navLink === id ? 'true' : '';
          });
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll<HTMLElement>('[data-section]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Top bar — NF logo appears on scroll */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[56px] pointer-events-none">
        <div className="flex items-center h-full px-6 max-w-[1280px] mx-auto">
          <a
            ref={brandRef}
            href="#top"
            aria-label="Noah Frank — back to top"
            className="pointer-events-auto opacity-0 no-underline select-none transition-opacity duration-300"
            style={{ willChange: 'opacity' }}
          >
            <span className="text-[20px] font-bold leading-none tracking-[-0.05em]">
              <span style={{ color: 'var(--color-text)' }}>N</span>
              <span style={{ color: 'var(--color-accent)' }}>F</span>
            </span>
          </a>
        </div>
      </header>

      {/* Floating bottom pill */}
      <nav
        ref={pillRef}
        aria-label="Section navigation"
        className="fixed bottom-6 left-1/2 z-50 opacity-0 pointer-events-none"
        style={{
          transform: 'translateX(-50%) translateY(14px)',
          willChange: 'opacity, transform',
          transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          className="flex items-center gap-0.5 rounded-full border border-border px-1 py-1"
          style={{
            background: 'rgba(250,248,245,0.88)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 4px 24px -4px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {SECTIONS.map(id => (
            <a
              key={id}
              href={`#${id}`}
              data-nav-link={id}
              className="pill-link flex items-center px-4 py-2 rounded-full text-[13px] font-medium capitalize
                         text-text-secondary hover:bg-surface-elevated hover:text-text
                         transition-colors duration-150 whitespace-nowrap
                         data-[active=true]:bg-text data-[active=true]:text-background"
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
