'use client';

import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const heroRef       = useRef<HTMLElement>(null);
  const bgCanvasRef   = useRef<HTMLCanvasElement>(null);
  const meshCanvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef       = useRef<HTMLHeadingElement>(null);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Zurich',
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Scroll fade-out + translate ──────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // Ease the fade so the hero dissolves gradually as it scrolls up and
    // the work section rises into view from below. No pinning — the hero
    // leaves the viewport naturally, and the box enters from the bottom.
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      const raw = Math.min(Math.max(window.scrollY / vh, 0), 1);
      const p = easeInOut(raw);
      heroEl.style.opacity       = String(1 - p);
      heroEl.style.pointerEvents = p >= 0.98 ? 'none' : '';
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Drifting soft orbs ────────────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const bgCanvas = bgCanvasRef.current;
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d')!;
    let W = 0, H = 0;
    const resize = () => {
      W = bgCanvas.offsetWidth; H = bgCanvas.offsetHeight;
      bgCanvas.width = W; bgCanvas.height = H;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(bgCanvas);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => { visible = entries[0]?.isIntersecting ?? true; },
      { threshold: 0 }
    );
    if (heroRef.current) io.observe(heroRef.current);

    type OrbCfg = { cx: number; cy: number; r: number; c: string; a: number; fx: number; fy: number; px: number; py: number; ax: number; ay: number };
    const orbs: OrbCfg[] = [
      { cx: 0.75, cy: 0.25, r: 0.38, c: '140,110,50', a: 0.18, fx: 0.12, fy: 0.09, px: 0.0, py: 1.2, ax: 0.12, ay: 0.09 },
      { cx: 0.15, cy: 0.70, r: 0.32, c: '100,90,70',  a: 0.14, fx: 0.17, fy: 0.14, px: 2.1, py: 0.5, ax: 0.10, ay: 0.12 },
      { cx: 0.55, cy: 0.55, r: 0.28, c: '160,130,80', a: 0.12, fx: 0.09, fy: 0.11, px: 1.0, py: 3.0, ax: 0.08, ay: 0.10 },
      { cx: 0.85, cy: 0.80, r: 0.24, c: '110,100,60', a: 0.10, fx: 0.20, fy: 0.15, px: 3.5, py: 0.8, ax: 0.09, ay: 0.07 },
    ];

    let t = 0;
    let rafId: number;
    const draw = () => {
      if (!visible) { rafId = requestAnimationFrame(draw); return; }
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
      t += 0.004;
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); io.disconnect(); };
  }, []);

  // ── Network mesh with traveling dot ──────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const meshCanvas = meshCanvasRef.current;
    if (!meshCanvas) return;
    const ctx = meshCanvas.getContext('2d')!;
    let W = 0, H = 0;
    const resize = () => {
      W = meshCanvas.offsetWidth; H = meshCanvas.offsetHeight;
      meshCanvas.width = W; meshCanvas.height = H;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(meshCanvas);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => { visible = entries[0]?.isIntersecting ?? true; },
      { threshold: 0 }
    );
    if (heroRef.current) io.observe(heroRef.current);

    const COLS = 10, ROWS = 7;
    const ERX = 0.44, ERY = 0.34;
    const ECX = 0.58, ECY = 0.36;
    const CONNECT_DIST = 0.21;
    const TRAV_SPEED   = 0.010;
    const TRAV_MAX_DIST = CONNECT_DIST * 0.52;

    const nodes = Array.from({ length: COLS * ROWS }, (_, i) => {
      const col = i % COLS, row = Math.floor(i / COLS);
      const ux = (col / (COLS - 1)) * 2 - 1;
      const uy = (row / (ROWS - 1)) * 2 - 1;
      return {
        bx: ECX + ux * ERX, by: ECY + uy * ERY,
        fx: 0.06 + Math.random() * 0.10, fy: 0.05 + Math.random() * 0.09,
        px: Math.random() * Math.PI * 2,  py: Math.random() * Math.PI * 2,
        ax: 0.015 + Math.random() * 0.02, ay: 0.015 + Math.random() * 0.02,
      };
    });

    type Pt = { x: number; y: number };

    const ellipseDist = (nx: number, ny: number) => {
      const dx = (nx - ECX) / (ERX * 1.35);
      const dy = (ny - ECY) / (ERY * 1.35);
      return Math.sqrt(dx * dx + dy * dy);
    };
    const inHeadlineZone = (nx: number, ny: number) => nx < 0.42 && ny > 0.28;
    const isInterior = (idx: number, pts: Pt[]) => {
      const nx = pts[idx].x / W, ny = pts[idx].y / H;
      return ellipseDist(nx, ny) < 0.75 && !inHeadlineZone(nx, ny);
    };
    const getNeighbors = (idx: number, pts: Pt[], maxDist = CONNECT_DIST) => {
      const out: number[] = [];
      for (let j = 0; j < pts.length; j++) {
        if (j === idx) continue;
        const dx = (pts[idx].x - pts[j].x) / W;
        const dy = (pts[idx].y - pts[j].y) / H;
        if (Math.sqrt(dx * dx + dy * dy) <= maxDist) out.push(j);
      }
      return out;
    };

    let dirX = 0, dirY = 0;
    const pickNext = (from: number, exclude: number, pts: Pt[]) => {
      const candidates = getNeighbors(from, pts, TRAV_MAX_DIST).filter(n => n !== exclude && isInterior(n, pts));
      if (candidates.length === 0) return getNeighbors(from, pts, TRAV_MAX_DIST)[0] ?? from;
      if (dirX === 0 && dirY === 0) return candidates[Math.floor(Math.random() * candidates.length)];
      let best = candidates[0], bestScore = -Infinity;
      for (const n of candidates) {
        const dx = (pts[n].x - pts[from].x) / W;
        const dy = (pts[n].y - pts[from].y) / H;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const score = (dx / len) * dirX + (dy / len) * dirY;
        const weighted = score * 0.72 + Math.random() * 0.28;
        if (weighted > bestScore) { bestScore = weighted; best = n; }
      }
      return best;
    };

    let travFrom = Math.floor(COLS * ROWS / 2);
    let travTo   = travFrom + 1;
    let travT    = 0;
    let t        = 0;
    let rafId: number;

    const drawMesh = () => {
      if (W === 0 || H === 0) { rafId = requestAnimationFrame(drawMesh); return; }
      if (!visible) { rafId = requestAnimationFrame(drawMesh); return; }
      ctx.clearRect(0, 0, W, H);

      const pts: Pt[] = nodes.map(n => ({
        x: (n.bx + Math.sin(t * n.fx + n.px) * n.ax) * W,
        y: (n.by + Math.cos(t * n.fy + n.py) * n.ay) * H,
      }));

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = (pts[i].x - pts[j].x) / W;
          const dy = (pts[i].y - pts[j].y) / H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECT_DIST) continue;
          const niX = pts[i].x / W, niY = pts[i].y / H;
          const njX = pts[j].x / W, njY = pts[j].y / H;
          if (inHeadlineZone(niX, niY) || inHeadlineZone(njX, njY)) continue;
          const edgeFade = Math.max(0, 1 - Math.max(ellipseDist(niX, niY), ellipseDist(njX, njY)));
          const weight = 0.4 + ((i * 7 + j * 13) % 10) / 10 * 0.6;
          const alpha = weight * 0.85 * (1 - dist / CONNECT_DIST) * edgeFade;
          ctx.lineWidth = 0.3 + weight * 2.0;
          ctx.strokeStyle = `rgba(55,42,28,${alpha.toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }

      for (let i = 0; i < pts.length; i++) {
        if (inHeadlineZone(pts[i].x / W, pts[i].y / H)) continue;
        const fade = Math.max(0, 1 - ellipseDist(pts[i].x / W, pts[i].y / H));
        ctx.fillStyle = `rgba(55,42,28,${(0.65 * fade).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 2.2, 0, Math.PI * 2); ctx.fill();
      }

      travT += TRAV_SPEED;
      if (travT >= 1) {
        const prev = travFrom;
        travFrom = travTo;
        const dx = (pts[travFrom].x - pts[prev].x) / W;
        const dy = (pts[travFrom].y - pts[prev].y) / H;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        dirX = dx / len; dirY = dy / len;
        travTo = pickNext(travFrom, prev, pts);
        travT  = 0;
      }
      const ease = travT < 0.5 ? 2 * travT * travT : -1 + (4 - 2 * travT) * travT;
      const tx = pts[travFrom].x + (pts[travTo].x - pts[travFrom].x) * ease;
      const ty = pts[travFrom].y + (pts[travTo].y - pts[travFrom].y) * ease;

      const halo = ctx.createRadialGradient(tx, ty, 0, tx, ty, 42);
      halo.addColorStop(0,    'rgba(255,255,255,0.40)');
      halo.addColorStop(0.35, 'rgba(255,255,255,0.18)');
      halo.addColorStop(0.7,  'rgba(255,255,255,0.06)');
      halo.addColorStop(1,    'rgba(255,255,255,0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(tx, ty, 42, 0, Math.PI * 2); ctx.fill();

      const glow = ctx.createRadialGradient(tx, ty, 0, tx, ty, 14);
      glow.addColorStop(0,   'rgba(255,255,255,0.90)');
      glow.addColorStop(0.5, 'rgba(255,255,255,0.45)');
      glow.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(tx, ty, 14, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.beginPath(); ctx.arc(tx, ty, 5, 0, Math.PI * 2); ctx.fill();

      t += 0.005;
      rafId = requestAnimationFrame(drawMesh);
    };
    drawMesh();
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); io.disconnect(); };
  }, []);

  // ── Letter scramble ───────────────────────────────────────────────────
  useEffect(() => {
    const nameEl = nameRef.current;
    if (!nameEl) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const words = nameEl.querySelectorAll<HTMLElement>('.hero-word');
    words.forEach(word => {
      const text = word.dataset.text ?? word.textContent ?? '';
      word.textContent = '';
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.dataset.final = char;
        span.style.display = 'inline-block';
        if (i === 0) span.classList.add('hero-char-first');
        word.appendChild(span);
      });
    });

    if (prefersReduced) return;

    const allSpans = [...nameEl.querySelectorAll<HTMLElement>('.hero-word span')];
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!?<>{}|^~*&/\\';
    const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const firsts: number[] = [];
    const rest:   number[] = [];
    allSpans.forEach((s, i) => (s.classList.contains('hero-char-first') ? firsts : rest).push(i));

    let activeIvs: ReturnType<typeof setInterval>[] = [];
    let activeTs:  ReturnType<typeof setTimeout>[]  = [];
    let scrambling = false;

    const runScramble = () => {
      if (scrambling) return;
      scrambling = true;
      activeIvs.forEach(clearInterval);
      activeTs.forEach(clearTimeout);
      activeIvs = [];
      activeTs  = [];

      allSpans.forEach(s => { s.textContent = rand(); });
      activeIvs = allSpans.map(s => setInterval(() => { s.textContent = rand(); }, 30));

      const lock = (i: number, delay: number) => {
        const tid = setTimeout(() => {
          clearInterval(activeIvs[i]);
          allSpans[i].textContent = allSpans[i].dataset.final ?? '';
        }, delay);
        activeTs.push(tid);
      };

      firsts.forEach((i, fi) => lock(i, 180 + fi * 120));
      rest.forEach((i, ri)   => lock(i, 400 + ri * 22));

      const totalDuration = 400 + rest.length * 22 + 80;
      activeTs.push(setTimeout(() => { scrambling = false; }, totalDuration));
    };

    runScramble();

    let wasAboveThreshold = true;
    const onScroll = () => {
      const atTop = window.scrollY < 400;
      if (atTop && !wasAboveThreshold) runScramble();
      wasAboveThreshold = atTop;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      activeIvs.forEach(clearInterval);
      activeTs.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        id="hero"
        data-section="hero"
        className="relative flex h-[100svh] flex-col justify-end [overflow:clip]"
        style={{ background: '#EDEAE3', paddingBottom: 96 }}
      >
        <canvas ref={bgCanvasRef} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.55 }} />
        <canvas ref={meshCanvasRef} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <p
            className="hero-eyebrow text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary"
            style={{ marginBottom: 'clamp(20px, 2.5vw, 32px)' }}
          >
            Zürich{time && <> · <span suppressHydrationWarning>{time}</span></>}
          </p>
          <h1
            id="hero-headline"
            ref={nameRef}
            className="hero-name font-bold leading-[0.92] tracking-tight text-text"
            style={{ fontSize: 'clamp(72px, 11.5vw, 144px)', marginBottom: 'clamp(40px, 5vw, 64px)' }}
          >
            <span className="hero-word block" data-text="Noah">Noah</span>
            <span className="hero-word block" data-text="Frank">Frank</span>
          </h1>
        </div>
      </section>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .hero-eyebrow { animation: fadeUp 0.5s ease-out 0.6s both; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
