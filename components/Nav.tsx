'use client';

import { useEffect, useRef } from 'react';

export default function Nav() {
  const brandRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const brand    = brandRef.current;
    const headline = document.getElementById('hero-headline');
    if (!brand || !headline) return;

    const update = () => {
      const rect     = headline.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - (rect.bottom - 80) / 200));
      brand.style.opacity = progress.toFixed(3);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[56px] pointer-events-none">
      <div className="flex items-center h-full px-8 max-w-[1400px] mx-auto">
        <a
          ref={brandRef}
          href="#top"
          aria-label="Back to top"
          className="pointer-events-auto opacity-0 no-underline select-none"
          style={{ transition: 'opacity 0.3s ease', willChange: 'opacity' }}
        >
          <span
            className="text-[19px] font-bold leading-none"
            style={{ letterSpacing: '-0.05em', color: 'var(--color-text)' }}
          >
            NF
          </span>
        </a>
      </div>
    </header>
  );
}
