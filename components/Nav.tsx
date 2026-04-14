'use client';

import { useEffect, useRef, useState } from 'react';

export default function Nav() {
  const logoOahRef  = useRef<HTMLSpanElement>(null);
  const logoRankRef = useRef<HTMLSpanElement>(null);
  const logoNRef    = useRef<HTMLSpanElement>(null);
  const logoFRef    = useRef<HTMLSpanElement>(null);
  const logoSepRef  = useRef<HTMLSpanElement>(null);
  const nfMonoRef   = useRef<HTMLSpanElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Collapsing wordmark on scroll
  useEffect(() => {
    const logoOah  = logoOahRef.current;
    const logoRank = logoRankRef.current;
    const logoN    = logoNRef.current;
    const logoF    = logoFRef.current;
    const logoSep  = logoSepRef.current;
    const nfMono   = nfMonoRef.current;
    if (!logoOah || !logoRank) return;

    const updateLogo = () => {
      const progress = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.25)));
      const collapsed = progress > 0.5;

      logoOah.style.maxWidth  = collapsed ? '0' : '3em';
      logoOah.style.opacity   = String(Math.max(0, 1 - progress * 1.6));
      logoRank.style.maxWidth = collapsed ? '0' : '3em';
      logoRank.style.opacity  = String(Math.max(0, 1 - progress * 1.6));

      const letterOpacity = String(Math.max(0, 1 - progress * 1.8));
      const svgOpacity    = String(Math.max(0, (progress - 0.35) / 0.65));
      if (logoN)   logoN.style.opacity   = letterOpacity;
      if (logoF)   logoF.style.opacity   = letterOpacity;
      if (logoSep) logoSep.style.opacity = letterOpacity;
      if (nfMono)  nfMono.style.opacity  = svgOpacity;
    };

    window.addEventListener('scroll', updateLogo, { passive: true });
    updateLogo();
    return () => window.removeEventListener('scroll', updateLogo);
  }, []);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* Collapsing wordmark — fixed top-left */}
      <a
        href="/"
        aria-label="Noah Frank — back to top"
        className="select-none no-underline flex items-center leading-none"
        style={{
          position: 'fixed', top: 24, left: 28, zIndex: 51,
          fontSize: 20, fontWeight: 700, fontStyle: 'italic',
          letterSpacing: '-0.03em', color: 'var(--color-text)', whiteSpace: 'nowrap',
        }}
      >
        <span
          ref={nfMonoRef}
          aria-hidden
          style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            opacity: 0, transition: 'opacity 0.35s ease', pointerEvents: 'none',
            letterSpacing: '-0.06em',
          }}
        >NF</span>
        <span ref={logoNRef}    style={{ transition: 'opacity 0.35s ease' }}>N</span>
        <span ref={logoOahRef}  style={{ display: 'inline-block', overflow: 'hidden', maxWidth: '3.5em', paddingRight: '0.3em', opacity: 1, transition: 'max-width 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease' }}>oah</span>
        <span ref={logoSepRef}  style={{ transition: 'opacity 0.35s ease' }}>&thinsp;</span>
        <span ref={logoFRef}    style={{ transition: 'opacity 0.35s ease' }}>F</span>
        <span ref={logoRankRef} style={{ display: 'inline-block', overflow: 'hidden', maxWidth: '3.5em', paddingRight: '0.3em', opacity: 1, transition: 'max-width 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease' }}>rank</span>
      </a>

      {/* Nav links — fixed top-right */}
      <header
        className="fixed top-0 right-0 z-50 h-[72px] flex items-center"
        style={{ background: 'transparent' }}
        aria-label="Site navigation"
      >
        <div className="flex items-center gap-1 pr-6 md:pr-10">
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            <a href="/about"      className="nav-link">About</a>
            <a href="/experience" className="nav-link">Experience</a>
            <a href="/contact"    className="nav-link">Contact</a>
          </nav>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center w-11 h-11"
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
              <rect y="0" width="20" height="2" rx="1" fill="currentColor"/>
              <rect y="6" width="20" height="2" rx="1" fill="currentColor"/>
              <rect y="12" width="20" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-10 md:hidden"
        style={{
          background: '#EDEAE3',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        aria-hidden={!menuOpen}
      >
        <a href="/about"      className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About</a>
        <a href="/experience" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Experience</a>
        <a href="/contact"    className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Contact</a>
      </div>

      <style>{`
        .nav-link {
          font-size: 13px;
          font-weight: 500;
          color: #F0EBE3;
          text-decoration: none;
          letter-spacing: 0.01em;
          padding: 7px 14px;
          border-radius: 6px;
          background: #2C2C2C;
          transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }
        .nav-link:hover {
          background: #3e3e3e;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44,44,44,0.18);
        }
        .mobile-nav-link {
          font-size: 32px;
          font-weight: 700;
          font-style: italic;
          letter-spacing: -0.03em;
          color: var(--color-text);
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .mobile-nav-link:hover { color: var(--color-accent); }
      `}</style>
    </>
  );
}
