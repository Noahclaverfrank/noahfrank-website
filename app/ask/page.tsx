'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { streamAsk, AskError, type AskMessage } from '@/lib/ask-client';
import GrainTexture from '@/components/GrainTexture';

function AskOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0;
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const orbs = [
      { cx: 0.78, cy: 0.22, r: 0.42, c: '140,110,50', a: 0.11, fx: 0.08, fy: 0.06, px: 0.0, py: 1.2, ax: 0.10, ay: 0.08 },
      { cx: 0.18, cy: 0.75, r: 0.30, c: '100,90,70',  a: 0.09, fx: 0.11, fy: 0.09, px: 2.1, py: 0.5, ax: 0.08, ay: 0.10 },
    ];
    let t = 0, rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const S = Math.min(W, H);
      for (const o of orbs) {
        const x = (o.cx + Math.sin(t * o.fx + o.px) * o.ax) * W;
        const y = (o.cy + Math.cos(t * o.fy + o.py) * o.ay) * H;
        const r = o.r * S;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0,   `rgba(${o.c},${o.a})`);
        g.addColorStop(0.5, `rgba(${o.c},${o.a * 0.4})`);
        g.addColorStop(1,   `rgba(${o.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      t += 0.003;
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity: 0.6,
      }}
    />
  );
}

const SUGGESTIONS = [
  "What's his professional background?",
  "What kind of projects has he built?",
  "What does he care about most?",
  "How does he approach new problems?",
];

export default function AskPage() {
  const [messages, setMessages] = useState<AskMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef  = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [input]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: AskMessage = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setStreaming(true);
    setError(null);

    try {
      for await (const chunk of streamAsk(next)) {
        setMessages((m) => {
          const last = m[m.length - 1];
          if (!last || last.role !== 'assistant') return m;
          return [...m.slice(0, -1), { ...last, content: last.content + chunk }];
        });
      }
    } catch (err) {
      const msg =
        err instanceof AskError
          ? err.message
          : 'Temporarily unavailable. Try again or email Noah.';
      setError(msg);
      setMessages((m) => {
        const last = m[m.length - 1];
        if (last && last.role === 'assistant' && last.content === '') return m.slice(0, -1);
        return m;
      });
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming]);

  const isEmpty = messages.length === 0;

  return (
    <>
      <AskOrb />
      <GrainTexture />

      {/* Back link — mirrors the main nav wordmark position */}
      <a
        href="/"
        style={{
          position: 'fixed', top: 24, left: 28, zIndex: 51,
          fontSize: 20, fontWeight: 700, fontStyle: 'italic',
          letterSpacing: '-0.03em',
          color: 'var(--color-text)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.18s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Noah Frank
      </a>

      <div style={{
        display: 'flex', flexDirection: 'column',
        height: '100svh',
        background: 'var(--color-background)',
        fontFamily: 'var(--font-sans)',
      }}>

        {/* Scrollable message area */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{
            maxWidth: 680, width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>

            {isEmpty ? (
              /* ── Empty state ── */
              <div style={{
                flex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'left',
                paddingTop: 88, paddingBottom: 120,
                width: '100%', maxWidth: 560, margin: '0 auto',
              }}>
                <p style={{
                  fontSize: 11, letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)',
                  marginBottom: 28,
                  alignSelf: 'flex-start',
                }}>
                  The concierge
                </p>

                <div style={{
                  fontSize: 20,
                  lineHeight: 1.55,
                  color: 'var(--color-text)',
                  marginBottom: 44,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                }}>
                  <p style={{ margin: 0, marginBottom: 16 }}>
                    Hey. I&apos;m the concierge for Noah Frank, and I speak on his behalf while he&apos;s away.
                  </p>
                  <p style={{
                    margin: 0, marginBottom: 16,
                    fontSize: 16, lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    fontWeight: 400,
                  }}>
                    I&apos;m not Noah, and I&apos;m not a copy of him. Think of me as the person at the front desk who keeps his notes: his work, his studies, the things he&apos;s building, what he&apos;s open to next.
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: 16, lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    fontWeight: 400,
                  }}>
                    Ask me anything. I&apos;ll answer from what I know, and I&apos;ll tell you straight when I don&apos;t.
                  </p>
                </div>

                {/* Suggestion list — editorial divider style */}
                <div style={{ width: '100%' }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 0); }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        width: '100%',
                        background: 'none', border: 'none',
                        borderTop: i === 0 ? '1px solid var(--color-border)' : 'none',
                        borderBottom: '1px solid var(--color-border)',
                        padding: '15px 0',
                        textAlign: 'left',
                        fontSize: 14,
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                    >
                      <span>{s}</span>
                      <span style={{ opacity: 0.35, marginLeft: 16 }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Messages ── */
              <div style={{
                paddingTop: 100, paddingBottom: 48,
                display: 'flex', flexDirection: 'column', gap: 52,
              }}>
                {messages.map((m, i) => (
                  <div key={i}>
                    {m.role === 'user' ? (
                      /* User — italic serif, right-aligned, feels like a handwritten question */
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <p style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 22,
                          fontWeight: 500,
                          color: 'var(--color-text-secondary)',
                          maxWidth: '78%',
                          textAlign: 'right',
                          lineHeight: 1.4,
                          margin: 0,
                        }}>
                          {m.content}
                        </p>
                      </div>
                    ) : (
                      /* Noah — clean, full-width, editorial */
                      <div>
                        <p style={{
                          fontSize: 10, letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: 'var(--color-text-tertiary)',
                          marginBottom: 14, marginTop: 0,
                        }}>
                          Noah
                        </p>
                        <p style={{
                          fontSize: 16, lineHeight: 1.85,
                          color: 'var(--color-text)',
                          whiteSpace: 'pre-wrap',
                          margin: 0,
                        }}>
                          {m.content}
                          {streaming && i === messages.length - 1 && (
                            <span
                              aria-hidden
                              style={{
                                display: 'inline-block',
                                marginLeft: 2,
                                color: 'var(--color-accent)',
                                animation: 'ask-blink 1s steps(2) infinite',
                              }}
                            >▍</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {error && (
                  <p style={{
                    fontSize: 13, color: 'var(--color-text-tertiary)',
                    fontStyle: 'italic', margin: 0,
                  }}>
                    {error}
                  </p>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </main>

        {/* ── Input bar ── */}
        <div style={{
          background: 'var(--color-background)',
          padding: '16px 24px 28px',
          flexShrink: 0,
        }}>
          <form
            onSubmit={(e) => { e.preventDefault(); void send(); }}
            style={{ maxWidth: 680, margin: '0 auto' }}
          >
            <div
              className="ask-input-wrap"
              style={{
                display: 'flex', alignItems: 'flex-end', gap: 10,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 16,
                padding: '12px 12px 12px 18px',
                transition: 'border-color 0.2s',
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Ask anything about Noah…"
                disabled={streaming}
                rows={1}
                maxLength={600}
                className="ask-textarea"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-sans)',
                  overflowY: 'hidden',
                  paddingTop: 2,
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                aria-label="Send"
                style={{
                  flexShrink: 0,
                  width: 32, height: 32,
                  borderRadius: 10,
                  border: 'none',
                  background: input.trim() && !streaming ? '#1A1614' : 'var(--color-border)',
                  color: input.trim() && !streaming ? '#F0EBE3' : 'var(--color-text-tertiary)',
                  cursor: input.trim() && !streaming ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.18s, color 0.18s',
                  marginBottom: 1,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M6.5 11V2M2 6.5L6.5 2L11 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes ask-blink {
          0%, 50%   { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        .ask-textarea::placeholder { color: var(--color-text-tertiary); }
        .ask-input-wrap:focus-within { border-color: var(--color-text-secondary); }
        @media (prefers-reduced-motion: reduce) {
          span[aria-hidden] { animation: none !important; opacity: 0.6; }
        }
      `}</style>
    </>
  );
}
