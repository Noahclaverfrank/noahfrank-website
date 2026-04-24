'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { streamAsk, AskError, type AskMessage } from '@/lib/ask-client';

const OVERLAY_ID = 'ask-overlay-root';

export default function AskOverlay() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AskMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl+K toggle, Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Open on custom event (fired by Hero CTA).
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('ask:open', onOpen);
    return () => window.removeEventListener('ask:open', onOpen);
  }, []);

  // Focus + scroll-lock while open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Auto-scroll to bottom as tokens arrive.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

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
          const updated: AskMessage = { ...last, content: last.content + chunk };
          return [...m.slice(0, -1), updated];
        });
      }
    } catch (err) {
      const msg =
        err instanceof AskError
          ? err.message
          : 'Temporarily unavailable. Try again or email Noah.';
      setError(msg);
      // Remove the empty assistant placeholder if nothing streamed.
      setMessages((m) => {
        const last = m[m.length - 1];
        if (last && last.role === 'assistant' && last.content === '') {
          return m.slice(0, -1);
        }
        return m;
      });
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      id={OVERLAY_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Ask Noah"
      onClick={onBackdropClick}
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] ask-overlay-fade"
      style={{
        backgroundColor: 'rgba(250, 248, 245, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="w-full max-w-[640px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Noah's experience…"
            maxLength={300}
            disabled={streaming}
            className="w-full bg-transparent border-0 border-b border-border pb-3 text-2xl md:text-3xl text-text outline-none placeholder:text-text-tertiary"
            aria-label="Your question"
          />
        </form>

        <div
          ref={scrollRef}
          className="mt-8 max-h-[60vh] overflow-y-auto space-y-8 pr-1"
        >
          {messages.length === 0 && (
            <div>
              <div
                className="text-[11px] tracking-[0.18em] uppercase text-text-tertiary mb-1"
                style={{ fontVariantCaps: 'all-small-caps' }}
              >
                concierge
              </div>
              <div className="text-[15px] leading-[1.7] text-text-secondary space-y-3">
                <p>
                  Hey. I&apos;m the concierge for Noah Frank, and I speak on his behalf while he&apos;s away.
                </p>
                <p>
                  I&apos;m not Noah himself, and I&apos;m not a copy of him. Think of me as the person at the front desk who knows his notes: what he&apos;s done, what he&apos;s studying, what he&apos;s building now, and what he&apos;s open to next.
                </p>
                <p>
                  Ask me anything. I&apos;ll answer from what I know, and I&apos;ll be straight with you when I don&apos;t.
                </p>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i}>
              <div
                className="text-[11px] tracking-[0.18em] uppercase text-text-tertiary mb-1"
                style={{ fontVariantCaps: 'all-small-caps' }}
              >
                {m.role === 'user' ? 'you' : 'assistant'}
              </div>
              <div className="text-[15px] leading-[1.7] text-text whitespace-pre-wrap">
                {m.content}
                {streaming && i === messages.length - 1 && m.role === 'assistant' && (
                  <span className="ask-cursor" aria-hidden>
                    ▍
                  </span>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-sm text-text-secondary italic">{error}</div>
          )}
        </div>
      </div>

      <style>{`
        .ask-overlay-fade { animation: ask-fade 200ms ease both; }
        @keyframes ask-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ask-cursor {
          display: inline-block;
          margin-left: 2px;
          color: var(--color-text-tertiary);
          animation: ask-blink 1s steps(2) infinite;
        }
        @keyframes ask-blink {
          0%, 50%   { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ask-overlay-fade { animation: none; }
          .ask-cursor { animation: none; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
