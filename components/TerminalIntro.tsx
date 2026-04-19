'use client';

import { useEffect, useState } from 'react';

const LINES = [
  '> init noahfrank.com',
  '> loading profile...',
  '> ready.',
];

export default function TerminalIntro() {
  const [mounted, setMounted]   = useState(false);
  const [visible, setVisible]   = useState(true);
  const [text, setText]         = useState('');
  const [lineIdx, setLineIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [showName, setShowName] = useState(false);
  const [fading, setFading]     = useState(false);

  // Avoid hydration mismatch — only run on client
  useEffect(() => {
    if (sessionStorage.getItem('terminal-done')) {
      setVisible(false);
    }
    setMounted(true);
  }, []);

  // Typing loop
  useEffect(() => {
    if (!mounted || !visible) return;

    // All lines typed — reveal name then fade out
    if (lineIdx >= LINES.length) {
      const t1 = setTimeout(() => setShowName(true), 300);
      const t2 = setTimeout(() => setFading(true), 1500);
      const t3 = setTimeout(() => {
        sessionStorage.setItem('terminal-done', '1');
        setVisible(false);
      }, 2000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }

    const line = LINES[lineIdx];

    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setText(prev => prev + line[charIdx]);
        setCharIdx(c => c + 1);
      }, 38);
      return () => clearTimeout(t);
    } else {
      // Pause at end of line, then move on
      const pause = lineIdx < LINES.length - 1 ? 380 : 600;
      const t = setTimeout(() => {
        setText(prev => prev + '\n');
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, pause);
      return () => clearTimeout(t);
    }
  }, [mounted, visible, lineIdx, charIdx]);

  if (!mounted || !visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 10vw, 120px)',
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.55s ease' : 'none',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <pre
        style={{
          fontFamily: '"Geist Mono", "Fira Code", "Courier New", monospace',
          fontSize: 'clamp(13px, 1.4vw, 16px)',
          color: '#6b7280',
          margin: 0,
          lineHeight: 2.2,
          whiteSpace: 'pre',
          letterSpacing: '0.02em',
        }}
      >
        {text}
        {lineIdx < LINES.length && (
          <span className="terminal-cursor">█</span>
        )}
      </pre>

      {showName && (
        <p
          style={{
            marginTop: 56,
            fontFamily: 'var(--font-geist-sans, sans-serif)',
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 700,
            fontStyle: 'italic',
            letterSpacing: '-0.03em',
            color: '#F0EBE3',
            lineHeight: 1,
            animation: 'termFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          Noah Frank
        </p>
      )}

      <style>{`
        .terminal-cursor {
          animation: termBlink 1s step-end infinite;
          color: #8C6D2F;
        }
        @keyframes termBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes termFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
