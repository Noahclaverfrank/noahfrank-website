'use client';

import { useEffect, useState } from 'react';

type Variant =
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
  | 'i' | 'j' | 'k' | 'l'
  | 'm' | 'n' | 'o' | 'p';

const LABELS: Record<Variant, string> = {
  a: 'Manifesto (copy is hero)',
  b: 'Centered monumental',
  c: 'Magazine-cover asymmetric',
  d: 'Swiss grid editorial',
  e: 'Dark drama (inverted)',
  f: 'Index / contents page',
  g: 'Edge-to-edge sentence',
  h: 'Ask-as-hero (interactive)',
  i: 'Brutalist (no reverence)',
  j: 'Live clock hero',
  k: 'Name-as-texture wallpaper',
  l: 'Punctuation poster',
  m: 'Live stats dashboard',
  n: 'Photo-split editorial',
  o: 'Concrete poetry (type rhythm)',
  p: 'Color-field blocks',
};

export default function HeroTest() {
  const [v, setV] = useState<Variant>('a');

  return (
    <>
      {v === 'a' && <VariantA />}
      {v === 'b' && <VariantB />}
      {v === 'c' && <VariantC />}
      {v === 'd' && <VariantD />}
      {v === 'e' && <VariantE />}
      {v === 'f' && <VariantF />}
      {v === 'g' && <VariantG />}
      {v === 'h' && <VariantH />}
      {v === 'i' && <VariantI />}
      {v === 'j' && <VariantJ />}
      {v === 'k' && <VariantK />}
      {v === 'l' && <VariantL />}
      {v === 'm' && <VariantM />}
      {v === 'n' && <VariantN />}
      {v === 'o' && <VariantO />}
      {v === 'p' && <VariantP />}
      <Switcher current={v} onChange={setV} />
    </>
  );
}

// ── A — Manifesto / copy-as-hero ─────────────────────────────────────────────
function VariantA() {
  return (
    <section
      className="relative flex h-[100svh] flex-col [overflow:clip]"
      style={{
        background: '#EDEAE3',
        fontFamily: 'var(--font-sans)',
        color: '#1A1614',
      }}
    >
      <div className="absolute top-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Noah Frank · Portfolio · 2026</span>
        <span style={tinyLabel}>Zürich · 47.37°N</span>
      </div>

      <div className="relative flex flex-1 items-center mx-auto w-full max-w-[1280px] px-6 md:px-10">
        <p
          style={{
            fontSize: 'clamp(44px, 6.2vw, 104px)',
            fontWeight: 500,
            lineHeight: 1.02,
            letterSpacing: '-0.025em',
            maxWidth: '18ch',
          }}
        >
          I build <span style={{ fontWeight: 200 }}>quiet</span> software
          {' '}
          <span style={{ color: '#6E6259' }}>for people who do</span>
          {' '}
          <span style={{ borderBottom: '4px solid #C8522A', paddingBottom: 2 }}>
            careful work.
          </span>
        </p>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>— Noah Frank</span>
        <span style={tinyLabel}>Scroll ↓</span>
      </div>
    </section>
  );
}

// ── B — Centered monumental ──────────────────────────────────────────────────
function VariantB() {
  return (
    <section
      className="relative flex h-[100svh] flex-col items-center justify-between py-16 [overflow:clip]"
      style={{
        background: '#EDEAE3',
        fontFamily: 'var(--font-sans)',
        color: '#1A1614',
        paddingBlock: '80px',
      }}
    >
      <div className="w-full max-w-[1280px] px-6 md:px-10 flex justify-between">
        <span style={tinyLabel}>Zürich</span>
        <span style={tinyLabel}>MMXXVI</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-6">
        <div style={{ ...tinyLabel, marginBottom: 24, textAlign: 'center' }}>
          Student · Builder · Operator
        </div>
        <h1
          style={{
            fontSize: 'clamp(96px, 15vw, 260px)',
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: '-0.045em',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Noah<br />Frank
        </h1>
        <div
          aria-hidden
          style={{
            width: 72,
            height: 2,
            background: '#C8522A',
            marginTop: 36,
          }}
        />
      </div>

      <div className="w-full max-w-[1280px] px-6 md:px-10 flex justify-between">
        <span style={tinyLabel}>Nº 001</span>
        <span style={tinyLabel}>Approach with care</span>
      </div>
    </section>
  );
}

// ── C — Magazine-cover asymmetric ────────────────────────────────────────────
function VariantC() {
  return (
    <section
      className="relative h-[100svh] [overflow:clip]"
      style={{
        background: '#EDEAE3',
        fontFamily: 'var(--font-sans)',
        color: '#1A1614',
      }}
    >
      {/* vertical rule */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '8%',
          bottom: '8%',
          left: '58%',
          width: 2,
          background: '#C8522A',
          opacity: 0.9,
        }}
      />

      {/* top-left tiny: Noah */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '6%',
          fontSize: 'clamp(40px, 5vw, 80px)',
          fontWeight: 200,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        Noah
      </div>

      {/* bottom-right huge: Frank */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '4%',
          fontSize: 'clamp(180px, 24vw, 420px)',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          lineHeight: 0.85,
          textAlign: 'right',
        }}
      >
        Frank
      </div>

      {/* left-side vertical metadata stack */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '6%',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          ...tinyLabel,
          letterSpacing: '0.35em',
        }}
      >
        Zürich · Student · Builder · 2026
      </div>

      {/* top-right cover line */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '4%',
          textAlign: 'right',
          maxWidth: '28vw',
        }}
      >
        <div style={{ ...tinyLabel, marginBottom: 8 }}>Issue Nº 001</div>
        <div
          style={{
            fontSize: 'clamp(14px, 1.1vw, 18px)',
            fontWeight: 500,
            lineHeight: 1.35,
            color: '#1A1614',
          }}
        >
          Software, strategy, and the discipline of getting out of the way —
          a working notebook.
        </div>
      </div>
    </section>
  );
}

// ── D — Swiss grid editorial ─────────────────────────────────────────────────
function VariantD() {
  const cols = 12;
  return (
    <section
      className="relative h-[100svh] [overflow:clip]"
      style={{
        background: '#EDEAE3',
        fontFamily: 'var(--font-sans)',
        color: '#1A1614',
      }}
    >
      {/* grid overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '48px 48px 48px 48px',
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 16,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            style={{
              borderLeft: i === 0 ? 'none' : '1px dashed rgba(26,22,20,0.09)',
            }}
          />
        ))}
      </div>

      {/* measurement marks top */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 20,
          left: 48,
          right: 48,
          height: 12,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <div key={i} style={{ width: 1, height: 10, background: 'rgba(26,22,20,0.3)' }} />
        ))}
      </div>

      {/* corner markers */}
      <CornerMark pos="tl" />
      <CornerMark pos="tr" />
      <CornerMark pos="bl" />
      <CornerMark pos="br" />

      {/* header rail */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 48,
          right: 48,
          display: 'flex',
          justifyContent: 'space-between',
          ...tinyLabel,
          fontSize: 10,
        }}
      >
        <span>Noah Frank — Portfolio</span>
        <span>Fig. 001</span>
        <span>47.37°N 8.54°E</span>
        <span>MMXXVI</span>
      </div>

      {/* wordmark in grid cell */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(48px + (100% - 96px) / 12 * 2)',
          top: '32%',
          right: 48,
        }}
      >
        <div style={{ ...tinyLabel, marginBottom: 16 }}>
          Fig. 001 — Practitioner
        </div>
        <h1
          style={{
            fontSize: 'clamp(96px, 13vw, 200px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 0.88,
            margin: 0,
            marginBottom: 24,
          }}
        >
          Noah Frank
        </h1>
        <div
          style={{
            fontSize: 'clamp(14px, 1.1vw, 18px)',
            fontWeight: 400,
            color: '#1A1614',
            maxWidth: '42ch',
            lineHeight: 1.45,
          }}
        >
          Operator, builder, student.
          <br />
          <span style={{ color: '#6E6259' }}>
            Software for people who would rather be doing anything else than
            using software.
          </span>
        </div>
      </div>

      {/* footer rail */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 48,
          right: 48,
          display: 'flex',
          justifyContent: 'space-between',
          ...tinyLabel,
          fontSize: 10,
        }}
      >
        <span>Scale 1:1</span>
        <span>Printed at 72ppi — warm-cream stock</span>
        <span>Sheet 01 / 04</span>
      </div>
    </section>
  );
}

function CornerMark({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#1A1614',
  };
  if (pos === 'tl') Object.assign(style, { top: 40, left: 40, borderTop: '1px solid', borderLeft: '1px solid' });
  if (pos === 'tr') Object.assign(style, { top: 40, right: 40, borderTop: '1px solid', borderRight: '1px solid' });
  if (pos === 'bl') Object.assign(style, { bottom: 40, left: 40, borderBottom: '1px solid', borderLeft: '1px solid' });
  if (pos === 'br') Object.assign(style, { bottom: 40, right: 40, borderBottom: '1px solid', borderRight: '1px solid' });
  return <div aria-hidden style={style} />;
}

// ── E — Dark drama (inverted palette) ────────────────────────────────────────
function VariantE() {
  return (
    <section
      className="relative h-[100svh] [overflow:clip]"
      style={{
        background: '#1A1614',
        color: '#EDEAE3',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* subtle warm vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(200,82,42,0.08), transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <div className="absolute top-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={{ ...tinyLabel, color: '#A39690' }}>Noah Frank · 2026</span>
        <span style={{ ...tinyLabel, color: '#A39690' }}>
          Zürich · 47.37°N · 21:54
        </span>
      </div>

      <div className="absolute bottom-[14%] left-0 right-0 px-6 md:px-10 mx-auto max-w-[1280px]">
        <div style={{ ...tinyLabel, color: '#A39690', marginBottom: 24 }}>
          Student · Builder · Operator
        </div>
        <h1
          style={{
            fontSize: 'clamp(96px, 14vw, 220px)',
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            margin: 0,
          }}
        >
          Noah<br />Frank
        </h1>
        <div
          style={{
            marginTop: 32,
            maxWidth: '36ch',
            fontSize: 'clamp(16px, 1.25vw, 20px)',
            color: '#A39690',
            lineHeight: 1.5,
          }}
        >
          Software, strategy, and the discipline of getting out of the way.
          {' '}
          <span style={{ color: '#C8522A' }}>Currently building ErgoDoc.</span>
        </div>
      </div>
    </section>
  );
}

// ── F — Index / contents page ────────────────────────────────────────────────
function VariantF() {
  const items: Array<[string, string, string]> = [
    ['01', 'Selected work', 'Product, operations, software.'],
    ['02', 'Experience', 'What I’ve done, where, and why.'],
    ['03', 'Now', 'Reading, listening, learning.'],
    ['04', 'Ask', 'A chat with me, rendered live.'],
  ];
  return (
    <section
      className="relative h-[100svh] [overflow:clip]"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="absolute top-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Noah Frank — Contents</span>
        <span style={tinyLabel}>Edition 2026</span>
      </div>

      <div
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 mx-auto max-w-[1280px] px-6 md:px-10"
      >
        <div style={{ ...tinyLabel, marginBottom: 32 }}>— Sections</div>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            rowGap: 'clamp(8px, 1vw, 14px)',
          }}
        >
          {items.map(([num, title, desc]) => (
            <li
              key={num}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr auto',
                alignItems: 'baseline',
                columnGap: 24,
                borderBottom: '1px solid #DDD8D0',
                paddingBottom: 'clamp(8px, 1vw, 14px)',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  color: '#6E6259',
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontSize: 'clamp(48px, 7vw, 104px)',
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  lineHeight: 1,
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: '#6E6259',
                  letterSpacing: '0.02em',
                  textAlign: 'right',
                  maxWidth: '28ch',
                }}
              >
                {desc}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Noah Frank · Zürich</span>
        <span style={tinyLabel}>Scroll to enter ↓</span>
      </div>
    </section>
  );
}

// ── G — Edge-to-edge sentence (name inside the sentence) ─────────────────────
function VariantG() {
  return (
    <section
      className="relative h-[100svh] [overflow:clip] flex items-center"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="absolute top-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Personal site · Edition 2026</span>
        <span style={tinyLabel}>Zürich</span>
      </div>

      <div className="w-full px-6 md:px-10">
        <p
          style={{
            fontSize: 'clamp(56px, 9.5vw, 188px)',
            fontWeight: 600,
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            margin: 0,
          }}
        >
          <span style={{ color: '#6E6259', fontWeight: 300 }}>I'm </span>
          <span style={{ fontWeight: 800 }}>Noah Frank.</span>
          <br />
          <span style={{ color: '#6E6259', fontWeight: 300 }}>I build </span>
          <span
            style={{
              fontStyle: 'normal',
              borderBottom: '6px solid #C8522A',
              paddingBottom: 2,
            }}
          >
            quiet software
          </span>
          <br />
          <span style={{ color: '#6E6259', fontWeight: 300 }}>
            for people who do
          </span>
          <br />
          <span style={{ fontWeight: 800 }}>careful work.</span>
        </p>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>— Reif · Geerdet · Weitblickend</span>
        <span style={tinyLabel}>Scroll ↓</span>
      </div>
    </section>
  );
}

// ── H — Ask-as-hero (interactive search) ─────────────────────────────────────
function VariantH() {
  const [q, setQ] = useState('');
  const suggestions = [
    'What are you building now?',
    'Tell me about ErgoDoc.',
    'Why Zürich?',
    'What do you read?',
  ];
  return (
    <section
      className="relative h-[100svh] [overflow:clip] flex flex-col justify-center"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="absolute top-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Noah Frank · Zürich</span>
        <span style={tinyLabel}>Ask anything</span>
      </div>

      <div className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div style={{ ...tinyLabel, marginBottom: 28 }}>— A live conversation</div>
        <h1
          style={{
            fontSize: 'clamp(64px, 9vw, 168px)',
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: '-0.045em',
            margin: 0,
            marginBottom: 48,
          }}
        >
          Ask Noah.
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '22px 24px',
            borderRadius: 14,
            background: '#fff',
            border: '1px solid #DDD8D0',
            boxShadow: '0 1px 0 rgba(0,0,0,0.03), 0 24px 48px -24px rgba(26,22,20,0.18)',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: '#C8522A',
              flex: 'none',
            }}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What would you like to know?"
            style={{
              flex: 1,
              border: 0,
              outline: 'none',
              background: 'transparent',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(18px, 1.6vw, 26px)',
              color: '#1A1614',
              fontWeight: 400,
            }}
          />
          <span style={{ ...tinyLabel, fontSize: 10 }}>↵</span>
        </div>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQ(s)}
              style={{
                appearance: 'none',
                border: '1px solid #DDD8D0',
                background: 'transparent',
                padding: '8px 14px',
                borderRadius: 999,
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: '#6E6259',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Streamed answer, sourced from my notes</span>
        <span style={tinyLabel}>Scroll to browse instead ↓</span>
      </div>
    </section>
  );
}

// ── I — Brutalist (no reverence, type breaks the frame) ──────────────────────
function VariantI() {
  return (
    <section
      className="relative h-[100svh] [overflow:clip]"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* NOAH — pinned top-left, clipped at top and left */}
      <div
        style={{
          position: 'absolute',
          top: '-4vw',
          left: '-2vw',
          fontSize: 'clamp(180px, 28vw, 560px)',
          fontWeight: 900,
          letterSpacing: '-0.055em',
          lineHeight: 0.78,
          whiteSpace: 'nowrap',
          margin: 0,
        }}
      >
        NOAH
      </div>

      {/* FRANK — pinned bottom-right, clipped at right and bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '-6vw',
          right: '-3vw',
          fontSize: 'clamp(200px, 30vw, 620px)',
          fontWeight: 900,
          letterSpacing: '-0.055em',
          lineHeight: 0.78,
          whiteSpace: 'nowrap',
          margin: 0,
        }}
      >
        FRANK
      </div>

      {/* tiny metadata stamps */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '46%',
          ...tinyLabel,
          fontSize: 11,
          maxWidth: 180,
          borderLeft: '2px solid #C8522A',
          paddingLeft: 12,
        }}
      >
        ZÜRICH
        <br />
        STUDENT · BUILDER
        <br />
        SCROLL ↓
      </div>
    </section>
  );
}

// ── J — Live clock hero ──────────────────────────────────────────────────────
function VariantJ() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const hh = now?.getHours().toString().padStart(2, '0') ?? '--';
  const mm = now?.getMinutes().toString().padStart(2, '0') ?? '--';
  const ss = now?.getSeconds().toString().padStart(2, '0') ?? '--';
  const weekday = now
    ? now.toLocaleDateString('en-US', { weekday: 'long' })
    : '';
  const date = now
    ? now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <section
      className="relative h-[100svh] [overflow:clip] flex flex-col justify-center items-center"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="absolute top-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Noah Frank · Zürich</span>
        <span style={tinyLabel}>Europe/Zurich · CET</span>
      </div>

      <div style={{ ...tinyLabel, marginBottom: 18 }}>— The time is</div>

      <div
        style={{
          fontSize: 'clamp(140px, 22vw, 360px)',
          fontWeight: 200,
          letterSpacing: '-0.055em',
          lineHeight: 0.88,
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.04em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>{hh}</span>
        <span style={{ color: '#C8522A' }}>:</span>
        <span>{mm}</span>
        <span
          style={{
            fontSize: '0.32em',
            fontWeight: 400,
            color: '#6E6259',
            marginLeft: '0.2em',
          }}
        >
          {ss}
        </span>
      </div>

      <div
        style={{
          marginTop: 28,
          fontSize: 'clamp(18px, 1.4vw, 24px)',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#6E6259',
        }}
      >
        {weekday} · {date}
      </div>

      <div
        style={{
          marginTop: 56,
          fontSize: 'clamp(32px, 4vw, 64px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
        }}
      >
        Noah Frank is {hourGreeting(now)}.
      </div>
      <div style={{ ...tinyLabel, marginTop: 14 }}>
        Student · Builder · In Zürich right now
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Live clock · updates every second</span>
        <span style={tinyLabel}>Scroll ↓</span>
      </div>
    </section>
  );
}

function hourGreeting(d: Date | null): string {
  if (!d) return 'here';
  const h = d.getHours();
  if (h < 6) return 'probably asleep';
  if (h < 12) return 'at a desk';
  if (h < 17) return 'deep in work';
  if (h < 21) return 'winding down';
  return 'probably still coding';
}

// ── K — Name-as-texture wallpaper ────────────────────────────────────────────
function VariantK() {
  const cells = 28;
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  };
  const r = rng(42);

  return (
    <section
      className="relative h-[100svh] [overflow:clip]"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* scattered name instances */}
      {Array.from({ length: cells }).map((_, i) => {
        const top = r() * 100;
        const left = r() * 100;
        const size = 14 + Math.floor(r() * 44);
        const weight = [200, 300, 400, 500, 700][Math.floor(r() * 5)];
        const opacity = 0.1 + r() * 0.35;
        const rotate = (r() - 0.5) * 10;
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: `${top}%`,
              left: `${left}%`,
              fontSize: size,
              fontWeight: weight,
              letterSpacing: '-0.02em',
              color: '#1A1614',
              opacity,
              transform: `rotate(${rotate}deg)`,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            Noah Frank
          </span>
        );
      })}

      {/* the one sharp version, anchored center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto max-w-[900px] text-center px-6"
      >
        <div style={{ ...tinyLabel, marginBottom: 16 }}>— One of these is real</div>
        <h1
          style={{
            fontSize: 'clamp(88px, 12vw, 184px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            margin: 0,
            position: 'relative',
          }}
        >
          <span
            style={{
              background: '#EDEAE3',
              padding: '0 0.15em',
              boxShadow:
                '0 0 0 20px #EDEAE3, 0 0 0 24px rgba(200,82,42,0.95)',
            }}
          >
            Noah Frank
          </span>
        </h1>
        <div
          style={{
            marginTop: 40,
            fontSize: 16,
            color: '#6E6259',
            fontWeight: 500,
            letterSpacing: '0.03em',
          }}
        >
          Zürich · Student · Builder
        </div>
      </div>
    </section>
  );
}

// ── L — Punctuation poster ───────────────────────────────────────────────────
function VariantL() {
  return (
    <section
      className="relative h-[100svh] [overflow:clip]"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="absolute top-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Noah Frank</span>
        <span style={tinyLabel}>Zürich · 2026</span>
      </div>

      {/* massive ampersand covers viewport */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'min(90vh, 78vw)',
          fontWeight: 200,
          lineHeight: 0.8,
          color: '#C8522A',
          letterSpacing: '-0.08em',
          userSelect: 'none',
        }}
      >
        &amp;
      </div>

      {/* name tucked into negative space bottom-left */}
      <div
        className="absolute"
        style={{
          left: '6%',
          bottom: '10%',
          maxWidth: '40vw',
        }}
      >
        <div style={{ ...tinyLabel, marginBottom: 12 }}>Student · Builder</div>
        <h1
          style={{
            fontSize: 'clamp(48px, 6.5vw, 112px)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 0.9,
            margin: 0,
          }}
        >
          Noah
          <br />
          Frank
        </h1>
      </div>

      {/* small wayfinding bottom-right */}
      <div
        className="absolute"
        style={{
          right: '6%',
          bottom: '10%',
          textAlign: 'right',
          maxWidth: '24ch',
        }}
      >
        <div style={{ ...tinyLabel, marginBottom: 10 }}>Cover · Nº 001</div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            lineHeight: 1.45,
            color: '#1A1614',
          }}
        >
          Operator & builder. Strategy &amp; software. Reading &amp; making.
        </div>
      </div>
    </section>
  );
}

// ── M — Live stats dashboard hero ────────────────────────────────────────────
function VariantM() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`
    : '--:--';

  const stats: Array<[string, string, string]> = [
    ['Currently', 'ErgoDoc', 'Clinical docs for therapists'],
    ['Local time', time, 'Zürich · CET'],
    ['Shipped this year', '04', 'ErgoDoc, TAF180, site, bot'],
    ['Reading', 'Seeing Like a State', 'James C. Scott'],
    ['Week', 'Nº 17 / 52', 'of 2026'],
    ['Studying', 'Strategy · UX', 'ZHAW'],
  ];

  return (
    <section
      className="relative h-[100svh] [overflow:clip] flex flex-col"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
        padding: 'clamp(32px, 4vw, 64px)',
      }}
    >
      <div className="flex justify-between mb-10">
        <div>
          <div style={{ ...tinyLabel, marginBottom: 10 }}>— Status page</div>
          <h1
            style={{
              fontSize: 'clamp(56px, 7.5vw, 128px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 0.92,
              margin: 0,
            }}
          >
            Noah Frank
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...tinyLabel, marginBottom: 6 }}>Last updated</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {time} · Zürich
          </div>
          <div
            aria-hidden
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: 999,
              background: '#C8522A',
              marginTop: 8,
            }}
          />
          <span
            style={{
              ...tinyLabel,
              fontSize: 10,
              marginLeft: 8,
              color: '#1A1614',
            }}
          >
            Live
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 1,
          background: '#DDD8D0',
          border: '1px solid #DDD8D0',
        }}
      >
        {stats.map(([label, value, sub]) => (
          <div
            key={label}
            style={{
              background: '#EDEAE3',
              padding: 'clamp(20px, 2vw, 32px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={tinyLabel}>{label}</div>
            <div>
              <div
                style={{
                  fontSize: 'clamp(28px, 3.2vw, 56px)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#6E6259',
                  letterSpacing: '0.02em',
                }}
              >
                {sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── N — Photo-split editorial ────────────────────────────────────────────────
function VariantN() {
  return (
    <section
      className="relative h-[100svh] [overflow:clip] grid"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
        gridTemplateColumns: '42% 58%',
      }}
    >
      {/* LEFT — editorial text column */}
      <div
        style={{
          padding: 'clamp(32px, 4vw, 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={tinyLabel}>Issue Nº 001 · 2026</div>
        <div>
          <div style={{ ...tinyLabel, marginBottom: 20 }}>Portrait of —</div>
          <h1
            style={{
              fontSize: 'clamp(64px, 8vw, 140px)',
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 0.88,
              margin: 0,
              marginBottom: 32,
            }}
          >
            Noah<br />Frank
          </h1>
          <div
            style={{
              maxWidth: '32ch',
              fontSize: 'clamp(15px, 1.1vw, 19px)',
              lineHeight: 1.55,
              color: '#1A1614',
              fontWeight: 400,
            }}
          >
            Operator &amp; builder in Zürich. Writes software for people
            who'd rather be doing anything than using it.
            <span style={{ color: '#C8522A' }}> Currently: ErgoDoc.</span>
          </div>
        </div>
        <div style={tinyLabel}>Student · Builder · Zürich</div>
      </div>

      {/* RIGHT — photo placeholder (warm terracotta-to-dark gradient) */}
      <div
        aria-label="Portrait photograph — placeholder"
        style={{
          position: 'relative',
          background:
            'linear-gradient(140deg, #C8522A 0%, #7a2e14 55%, #1A1614 100%)',
          overflow: 'hidden',
        }}
      >
        {/* subtle grain */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.18,
            mixBlendMode: 'overlay',
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.8' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.8 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>\")",
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 32,
            top: 32,
            right: 32,
            display: 'flex',
            justifyContent: 'space-between',
            color: '#EDEAE3',
            opacity: 0.75,
          }}
        >
          <span style={{ ...tinyLabel, color: '#EDEAE3' }}>[ Photo — your portrait ]</span>
          <span style={{ ...tinyLabel, color: '#EDEAE3' }}>2400×3000 · /public</span>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 32,
            bottom: 32,
            color: '#EDEAE3',
            opacity: 0.85,
          }}
        >
          <div style={{ ...tinyLabel, color: '#EDEAE3', marginBottom: 6 }}>
            Cover photograph
          </div>
          <div style={{ fontSize: 13, letterSpacing: '0.03em' }}>
            Drop an image into <code>/public/portrait.jpg</code> — this block
            becomes it.
          </div>
        </div>
      </div>
    </section>
  );
}

// ── O — Concrete poetry (typographic rhythm) ─────────────────────────────────
function VariantO() {
  // each letter of NOAH FRANK at a wildly different size/weight — rhythm
  const cells: Array<[string, number, number, number]> = [
    ['N', 22, 900, 0],
    ['o', 7, 200, 0],
    ['a', 12, 400, 2],
    ['h', 20, 800, -2],
    [' ', 3, 100, 0],
    ['F', 16, 500, 3],
    ['r', 9, 300, -1],
    ['a', 24, 900, 1],
    ['n', 6, 200, 0],
    ['k', 18, 700, -3],
  ];
  return (
    <section
      className="relative h-[100svh] [overflow:clip] flex flex-col justify-center items-center"
      style={{
        background: '#EDEAE3',
        color: '#1A1614',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="absolute top-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Noah Frank · 2026</span>
        <span style={tinyLabel}>Typographic rhythm · Nº 001</span>
      </div>

      <div
        style={{
          ...tinyLabel,
          marginBottom: 24,
        }}
      >
        — One name, ten weights
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '0.02em',
          padding: '0 5vw',
          maxWidth: '100vw',
          lineHeight: 0.85,
        }}
      >
        {cells.map(([ch, size, weight, yOffset], i) => (
          <span
            key={i}
            style={{
              fontSize: `clamp(${size * 0.7}vw, ${size}vw, ${size * 16}px)`,
              fontWeight: weight,
              letterSpacing: '-0.045em',
              transform: `translateY(${yOffset}%)`,
              color: i === 7 ? '#C8522A' : '#1A1614',
              display: 'inline-block',
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </div>

      <div
        aria-hidden
        style={{
          marginTop: 40,
          width: 120,
          height: 2,
          background: '#C8522A',
        }}
      />

      <div
        style={{
          marginTop: 20,
          fontSize: 14,
          letterSpacing: '0.1em',
          color: '#6E6259',
          textTransform: 'uppercase',
        }}
      >
        Zürich · Student · Builder
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-between px-6 md:px-10">
        <span style={tinyLabel}>Geist var · 100 → 900</span>
        <span style={tinyLabel}>Scroll ↓</span>
      </div>
    </section>
  );
}

// ── P — Color-field blocks (Saul Bass / Total Design) ────────────────────────
function VariantP() {
  return (
    <section
      className="relative h-[100svh] [overflow:clip] grid"
      style={{
        fontFamily: 'var(--font-sans)',
        gridTemplateColumns: '38% 30% 32%',
        gridTemplateRows: '44% 56%',
      }}
    >
      {/* top-left: cream with eyebrow */}
      <div
        style={{
          background: '#EDEAE3',
          color: '#1A1614',
          padding: 'clamp(24px, 3vw, 56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gridColumn: '1 / 2',
          gridRow: '1 / 2',
        }}
      >
        <div style={tinyLabel}>Zürich · 2026</div>
        <div style={tinyLabel}>Student · Builder</div>
      </div>

      {/* top-middle: terracotta */}
      <div
        style={{
          background: '#C8522A',
          color: '#EDEAE3',
          padding: 'clamp(24px, 3vw, 56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gridColumn: '2 / 3',
          gridRow: '1 / 2',
        }}
      >
        <div style={{ ...tinyLabel, color: '#EDEAE3', marginBottom: 6 }}>
          Currently
        </div>
        <div
          style={{
            fontSize: 'clamp(22px, 2.2vw, 36px)',
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Building<br />ErgoDoc
        </div>
      </div>

      {/* top-right: warm-black */}
      <div
        style={{
          background: '#1A1614',
          color: '#EDEAE3',
          padding: 'clamp(24px, 3vw, 56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gridColumn: '3 / 4',
          gridRow: '1 / 2',
        }}
      >
        <div style={{ ...tinyLabel, color: '#EDEAE3' }}>Nº 001</div>
        <div
          style={{
            fontSize: 13,
            color: '#A39690',
            letterSpacing: '0.02em',
            lineHeight: 1.45,
          }}
        >
          Software for people who do careful work — a working notebook.
        </div>
      </div>

      {/* bottom: full-width wordmark stripe, warm cream with name massive */}
      <div
        style={{
          gridColumn: '1 / -1',
          gridRow: '2 / 3',
          background: '#EDEAE3',
          color: '#1A1614',
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(24px, 3vw, 56px)',
          position: 'relative',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(88px, 14vw, 260px)',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 0.88,
            margin: 0,
          }}
        >
          Noah Frank.
        </h1>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: 'clamp(24px, 3vw, 56px)',
            bottom: 'clamp(24px, 3vw, 56px)',
            width: 48,
            height: 48,
            borderRadius: 999,
            background: '#C8522A',
          }}
        />
      </div>
    </section>
  );
}

// ── Shared tiny label ────────────────────────────────────────────────────────
const tinyLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#6E6259',
};

// ── Variant switcher ─────────────────────────────────────────────────────────
function Switcher({ current, onChange }: { current: Variant; onChange: (v: Variant) => void }) {
  const variants: Variant[] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
    'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
  ];
  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: 4,
        borderRadius: 999,
        background: 'rgba(26,22,20,0.94)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {variants.map((vk) => (
        <button
          key={vk}
          onClick={() => onChange(vk)}
          style={{
            appearance: 'none',
            border: 0,
            padding: '10px 16px',
            borderRadius: 999,
            background: current === vk ? '#EDEAE3' : 'transparent',
            color: current === vk ? '#1A1614' : '#EDEAE3',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            transition: 'background 0.15s ease, color 0.15s ease',
          }}
          aria-pressed={current === vk}
        >
          {vk.toUpperCase()}
        </button>
      ))}
      <div
        style={{
          padding: '0 14px 0 10px',
          color: '#EDEAE3',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          opacity: 0.8,
        }}
      >
        {LABELS[current]}
      </div>
    </div>
  );
}
