# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the 2026-04-22 homepage redesign — fast hero fade, pinned black-box Selected Work sequence, removed About, cinematic Experience, `/now`-style Now section.

**Architecture:** Four discrete component rewrites inside an existing Next.js 16 / React 19 / Tailwind v4 app. No new dependencies. All animation driven by native `scroll` listeners + `requestAnimationFrame`; no scroll library beyond existing Lenis. One pinned scroll sequence (Selected Work) using `position: sticky` inside an oversized parent; progress derived from `getBoundingClientRect`. Canvas animations in Hero stop/resume based on visibility.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lenis (smooth scroll), inline CSS-in-JS via `style` attributes (existing pattern in this codebase). No test runner — verification is visual/manual in a running dev server.

**Spec reference:** `docs/superpowers/specs/2026-04-22-homepage-redesign-design.md`

**Verification philosophy:** This codebase has no unit test harness. Each task ends with a manual verification step: run `npm run dev`, open `http://localhost:3000`, execute a specific action, and confirm a specific observable outcome. Build-success (`npm run build`) is the automated backstop.

---

## File Structure After Plan

```
app/
  page.tsx                       MODIFIED: re-ordered imports, AboutSection removed
components/
  Hero.tsx                       MODIFIED: scroll-fade logic replaced, Selected Work block removed
  WorkSection.tsx                REPLACED: pinned black-box sequence (new implementation)
  ExperienceSection.tsx          REPLACED: cinematic full-width role blocks
  NowSection.tsx                 REPLACED: Reading/Listening/Learning + Updated date
  AboutSection.tsx               DELETED
docs/superpowers/plans/
  2026-04-22-homepage-redesign.md  (this file)
```

Nine tasks. Each ends with a single commit. Tasks are ordered so a mid-task failure leaves the site in a buildable state.

---

## Task 1: Remove AboutSection and clean up imports

**Why first:** Shrinks the surface area. The removed file is referenced only from `app/page.tsx`, so removing it plus its import produces a working page with one fewer section. No visual regressions on the sections that remain.

**Files:**
- Delete: `components/AboutSection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1.1: Delete AboutSection.tsx**

```bash
rm components/AboutSection.tsx
```

- [ ] **Step 1.2: Update app/page.tsx**

Open `app/page.tsx`. Remove the AboutSection import and its usage:

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import LenisProvider from '@/components/LenisProvider';
import GrainTexture from '@/components/GrainTexture';
import Footer from '@/components/Footer';
import ExperienceSection from '@/components/ExperienceSection';
import NowSection from '@/components/NowSection';

export default function Home() {
  return (
    <>
      <LenisProvider />
      <Nav />
      <GrainTexture />
      <main id="top">
        <Hero />
        <ExperienceSection />
        <NowSection />
      </main>
      <Footer />
    </>
  );
}
```

Note: `WorkSection` is NOT imported here yet — Hero currently still owns the Selected Work rows. That's fixed in Task 3.

- [ ] **Step 1.3: Verify build**

```bash
npm run build
```

Expected: Build completes without type errors or missing-module errors. If the build fails with "Cannot find module '@/components/AboutSection'", there's still an import somewhere. Grep:

```bash
grep -r "AboutSection" app/ components/ --include="*.tsx" --include="*.ts"
```

Expected grep output: empty (no matches).

- [ ] **Step 1.4: Verify dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: page loads with Hero → Experience (old design) → Now (old design) → Footer. No "About" section between Hero and Experience. No console errors.

- [ ] **Step 1.5: Commit**

```bash
git add app/page.tsx components/AboutSection.tsx
git commit -m "refactor: remove AboutSection from homepage"
```

---

## Task 2: Rewrite Hero scroll-fade behavior

**Why:** The current `200svh` wrapper + slow fade is what Noah explicitly wants gone. This task replaces the wrapper and fade logic, and removes the Selected Work block currently at the bottom of Hero (which Task 3 reintroduces as its own component).

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 2.1: Read current Hero.tsx to confirm line numbers**

```bash
wc -l components/Hero.tsx
```

Expected: ~495 lines (check against spec, which cited lines 404–495 as the Selected Work block).

- [ ] **Step 2.2: Replace scroll fade-out effect**

In `components/Hero.tsx`, find the `// ── Scroll fade-out ──` effect (starts around line 39). Replace the entire `useEffect` block with:

```tsx
  // ── Scroll fade-out + translate ──────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const heroEl = heroRef.current;
    if (!heroEl) return;

    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      const p = Math.min(Math.max(window.scrollY / (vh * 0.30), 0), 1);
      heroEl.style.opacity   = String(1 - p);
      heroEl.style.transform = `translateY(${-24 * p}px)`;
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
```

- [ ] **Step 2.3: Add canvas animation pause logic**

The two canvas effects (bgCanvas/orbs and meshCanvas) currently run forever. Add an IntersectionObserver to pause them when Hero is out of view.

Find the `// ── Drifting soft orbs ──` effect. Replace the `return () => { cancelAnimationFrame(rafId); ro.disconnect(); };` with a version that also gates the RAF loop on visibility. Change the `draw` function and cleanup to:

```tsx
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => { visible = entries[0]?.isIntersecting ?? true; },
      { threshold: 0 }
    );
    if (heroRef.current) io.observe(heroRef.current);

    const draw = () => {
      if (!visible) { rafId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);
      const S = Math.min(W, H);
      for (const o of orbs) {
        // ...existing orb drawing code unchanged...
      }
      t += 0.004;
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); io.disconnect(); };
```

Apply the same pattern to the mesh canvas effect: add an `io` observer, gate the draw loop on `visible`, and disconnect `io` in cleanup. Keep the RAF loop running so when the hero becomes visible again the animation picks up smoothly — it just skips `clearRect`/drawing while invisible.

- [ ] **Step 2.4: Remove the `200svh` wrapper div**

Find the JSX block starting with `{/* scroll space so hero sticks while work rows rise into view */}`. Replace the wrapper div `<div style={{ height: '200svh', position: 'relative' }}>` and its closing `</div>` — delete those two tag lines. The `<section>` stays as-is but is no longer inside an oversized wrapper.

Also change the section's `className` from `"sticky top-0 relative flex h-[100svh] flex-col justify-end [overflow:clip]"` to just `"relative flex h-[100svh] flex-col justify-end [overflow:clip]"` — the sticky positioning was only needed to work with the now-removed 200svh wrapper. Since Hero now scrolls naturally with opacity/translate, sticky is unnecessary.

- [ ] **Step 2.5: Remove Selected Work block from Hero**

Find the JSX block starting with `{/* ── Selected Work rows ── */}` (around line 404). Delete everything from that comment through to the closing `</section>` of that `<section id="hero-expand-wrapper">`.

Also delete the scroll-expanding-rows `useEffect` — the one starting with `// ── Scroll-expanding work rows ──` around line 333. That logic moves into WorkSection in Task 3.

Also delete the `WORK` constant at the top (around line 5) — it becomes the data source for WorkSection.

Also delete the `rowsRef` declaration and any references to it.

Also delete the `<style>` block at the bottom that contains `.work-expand-row` rules — those are no longer used in Hero.

- [ ] **Step 2.6: Verify Hero.tsx still compiles**

```bash
npm run build
```

Expected: build succeeds. If it fails, most likely culprit: a stray reference to `rowsRef`, `WORK`, or `.work-expand-row`. Grep the file:

```bash
grep -n "rowsRef\|WORK\|work-expand" components/Hero.tsx
```

Expected: no matches.

- [ ] **Step 2.7: Visual verification in dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll down slowly.

Expected observations:
- At scroll 0: Hero visible, fully opaque.
- At scroll ~150px (≈15% of a typical 1000px viewport): Hero clearly faded (~50% opacity).
- At scroll ~300px: Hero invisible (opacity 0), translated up ~24px.
- Experience section appears right below — there is no "Selected Work" section anymore (that comes back in Task 3).
- Scroll back to top: Hero reappears smoothly, name-scramble re-triggers.
- No console errors.

- [ ] **Step 2.8: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): fast fade-out and canvas visibility gating"
```

---

## Task 3: Create new WorkSection component (structure + box expansion)

**Why:** This introduces the new pinned sequence. Task 3 covers structure, pinning, and box expansion to fullscreen (progress 0 → 0.25). Row reveal comes in Task 4. Splitting reduces risk and lets us ship a verifiable sub-behavior first.

**Files:**
- Replace: `components/WorkSection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 3.1: Delete old WorkSection.tsx**

```bash
rm components/WorkSection.tsx
```

- [ ] **Step 3.2: Create new WorkSection.tsx**

Create `components/WorkSection.tsx` with this content:

```tsx
'use client';

import { useEffect, useRef } from 'react';

export const WORK = [
  {
    num: '01',
    name: 'noahfrank.com',
    slug: 'noahfrank-com',
    desc: 'Personal brand website with an AI assistant — built entirely from scratch.',
    tags: 'Next.js · GSAP · Claude API',
    year: '2025',
  },
  {
    num: '02',
    name: 'ErgoDoc',
    slug: 'ergodoc',
    desc: 'Desktop app that streamlines documentation for occupational therapists.',
    tags: 'Electron · React',
    year: '2024 –',
  },
  {
    num: '03',
    name: 'TAF 180',
    slug: 'taf-180',
    desc: 'Custom invoice and billing tool built for independent service providers.',
    tags: 'Web App',
    year: '2024',
  },
];

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef   = useRef<HTMLDivElement>(null);
  const boxRef     = useRef<HTMLDivElement>(null);

  // Scroll-driven progress 0..1 for the whole pinned sequence
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    const box     = boxRef.current;
    if (!section || !box) return;

    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh   = window.innerHeight;
      // progress: 0 when section top hits viewport top, 1 when section bottom hits viewport bottom
      const total = rect.height - vh;
      const p = Math.min(Math.max(-rect.top / total, 0), 1);

      // Phase A: box expansion 0 → 0.25
      const expandP = Math.min(p / 0.25, 1);
      // Interpolate from rest geometry (8vw side, 12vh top/bottom) to full-viewport
      const sideVW = 8  * (1 - expandP);
      const topVH  = 12 * (1 - expandP);
      const radius = 16 * (1 - expandP);
      const borderAlpha = 0.08 * (1 - expandP);

      box.style.setProperty('--work-side-vw',    `${sideVW}`);
      box.style.setProperty('--work-top-vh',     `${topVH}`);
      box.style.setProperty('--work-radius',     `${radius}px`);
      box.style.setProperty('--work-border-alpha', `${borderAlpha}`);

      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      data-section="work"
      style={{ height: '400svh', position: 'relative', background: '#EDEAE3' }}
    >
      <div
        ref={stageRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          ref={boxRef}
          className="work-box"
          style={{
            position: 'relative',
            background: '#14110F',
            color: '#EDEAE3',
            width:  'calc(100vw - var(--work-side-vw, 8) * 2vw)',
            height: 'calc(100svh - var(--work-top-vh, 12) * 2vh)',
            borderRadius: 'var(--work-radius, 16px)',
            border: '1px solid rgba(255,255,255,var(--work-border-alpha, 0.08))',
            overflow: 'hidden',
            transition: 'none',
          }}
        >
          {/* Eyebrow + counter — always visible */}
          <div style={{
            position: 'absolute',
            top: 'clamp(24px, 4vh, 48px)',
            left: 'clamp(24px, 4vw, 64px)',
            right: 'clamp(24px, 4vw, 64px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}>
            <p style={{
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(237,234,227,0.6)', margin: 0,
            }}>
              Selected Work
            </p>
            <p
              data-counter
              style={{
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(237,234,227,0.6)', margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              01 / 03
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3.3: Add WorkSection to the page**

Modify `app/page.tsx` to import and render WorkSection between Hero and Experience:

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import LenisProvider from '@/components/LenisProvider';
import GrainTexture from '@/components/GrainTexture';
import Footer from '@/components/Footer';
import WorkSection from '@/components/WorkSection';
import ExperienceSection from '@/components/ExperienceSection';
import NowSection from '@/components/NowSection';

export default function Home() {
  return (
    <>
      <LenisProvider />
      <Nav />
      <GrainTexture />
      <main id="top">
        <Hero />
        <WorkSection />
        <ExperienceSection />
        <NowSection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3.4: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3.5: Visual verification — box expansion only**

```bash
npm run dev
```

Open `http://localhost:3000`.

- Scroll past Hero.
- When you reach the Work section (after Hero fades), a black box should appear, centered, with clear cream margins on all sides (roughly 8vw sides, 12vh top/bottom).
- Inside the box: `SELECTED WORK` eyebrow top-left, `01 / 03` top-right. That's it — no project rows yet (added in Task 4).
- Continue scrolling. The box should visibly grow — margins shrink to 0, corners square off, border fades.
- At roughly 25% of the way through the section's scroll budget, the box should be edge-to-edge, filling the viewport entirely.
- Keep scrolling: box stays pinned in fullscreen state (still no project rows yet).
- Eventually (near end of section): sticky releases, black box scrolls up, Experience appears below.

If the box doesn't expand: open DevTools and inspect the `.work-box` element. Confirm `--work-side-vw` is animating from 8 → 0 as you scroll. If not, the scroll listener isn't firing — check console for errors.

- [ ] **Step 3.6: Commit**

```bash
git add app/page.tsx components/WorkSection.tsx
git commit -m "feat(work): pinned black-box with scroll-driven expansion"
```

---

## Task 4: Selected Work — row reveal phases

**Why:** Task 3 got the box expanding. Task 4 adds the three project rows that reveal one-by-one in phases 0.25 → 0.70, hold at 0.70 → 1.0. This is where the section earns its place.

**Files:**
- Modify: `components/WorkSection.tsx`

- [ ] **Step 4.1: Extend the update function to drive rows**

In `components/WorkSection.tsx`, replace the `useEffect` body from Task 3 with an extended version that also drives row opacity/transform and the counter text. Full replacement:

```tsx
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    const box     = boxRef.current;
    if (!section || !box) return;

    const rows    = Array.from(box.querySelectorAll<HTMLElement>('[data-work-row]'));
    const counter = box.querySelector<HTMLElement>('[data-counter]');

    // Phase windows for rows (progress ranges)
    const ROW_PHASES = [
      { enter: 0.25, peak: 0.33, exit: 0.45 },   // row 0
      { enter: 0.40, peak: 0.48, exit: 0.60 },   // row 1
      { enter: 0.55, peak: 0.63, exit: 1.01 },   // row 2 — exits past 1 so it holds
    ];
    // At progress >= 0.70 all three rows visible and stacked ("hold" state)
    const HOLD_START = 0.70;

    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh   = window.innerHeight;
      const total = rect.height - vh;
      const p = Math.min(Math.max(-rect.top / total, 0), 1);

      // Box expansion 0 → 0.25
      const expandP = Math.min(p / 0.25, 1);
      box.style.setProperty('--work-side-vw',      `${8 * (1 - expandP)}`);
      box.style.setProperty('--work-top-vh',       `${12 * (1 - expandP)}`);
      box.style.setProperty('--work-radius',       `${16 * (1 - expandP)}px`);
      box.style.setProperty('--work-border-alpha', `${0.08 * (1 - expandP)}`);

      // Counter
      if (counter) {
        const idx = p < 0.40 ? 0 : p < 0.55 ? 1 : 2;
        counter.textContent = `0${idx + 1} / 03`;
      }

      // Rows
      const hold = p >= HOLD_START;
      rows.forEach((row, i) => {
        if (hold) {
          // Stacked list state — all visible, positioned vertically
          const stackProgress = Math.min((p - HOLD_START) / 0.05, 1); // 0.70 → 0.75 to settle
          row.style.opacity = String(stackProgress);
          row.style.setProperty('--row-x', '0');
          row.style.setProperty('--row-y', `${(i - 1) * 120}px`); // -120, 0, +120
          row.style.setProperty('--row-scale', '0.72');
          return;
        }

        const phase = ROW_PHASES[i];
        // Reveal: 0 at phase.enter → 1 at phase.peak → 0 at phase.exit
        let opacity = 0;
        let y = 40;
        if (p >= phase.enter && p < phase.peak) {
          const local = (p - phase.enter) / (phase.peak - phase.enter);
          opacity = local;
          y = 40 * (1 - local);
        } else if (p >= phase.peak && p < phase.exit) {
          const local = (p - phase.peak) / (phase.exit - phase.peak);
          opacity = 1 - local;
          y = -40 * local;
        }
        row.style.opacity = String(opacity);
        row.style.setProperty('--row-x', '0');
        row.style.setProperty('--row-y', `${y}px`);
        row.style.setProperty('--row-scale', '1');
      });

      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
```

- [ ] **Step 4.2: Add the row JSX inside the box**

Inside the `<div ref={boxRef} className="work-box">` block, after the eyebrow/counter div, add a centered row container:

```tsx
          {/* Rows stage — rows are absolutely positioned, centered */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(24px, 6vw, 96px)',
          }}>
            {WORK.map((p) => (
              <a
                key={p.num}
                href={`/work/${p.slug}`}
                data-work-row
                style={{
                  position: 'absolute',
                  left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%) translate(var(--row-x, 0), var(--row-y, 0)) scale(var(--row-scale, 1))',
                  opacity: 0,
                  textDecoration: 'none',
                  color: '#EDEAE3',
                  maxWidth: 'min(900px, 80vw)',
                  width: '100%',
                  textAlign: 'center',
                  willChange: 'transform, opacity',
                  transition: 'opacity 0.15s linear',
                }}
              >
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'rgba(237,234,227,0.55)',
                  marginBottom: 20,
                }}>
                  {p.num} · {p.year}
                </div>
                <h3 style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(56px, 8vw, 104px)',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#EDEAE3',
                  margin: '0 0 28px',
                }}>
                  {p.name}
                </h3>
                <p style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: 'rgba(237,234,227,0.75)',
                  margin: '0 auto',
                  maxWidth: '60ch',
                }}>
                  {p.desc}
                </p>
                <div style={{
                  marginTop: 24, paddingTop: 16,
                  borderTop: '1px solid rgba(237,234,227,0.18)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(237,234,227,0.5)',
                  maxWidth: '60ch',
                  margin: '24px auto 0',
                }}>
                  {p.tags}
                </div>
              </a>
            ))}
          </div>
```

- [ ] **Step 4.3: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4.4: Visual verification — full sequence**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll slowly through the Work section.

Expected observations (in order as you scroll):
1. Box expands (as in Task 3 verification).
2. At ~25% progress, box is full-screen. Counter still says `01 / 03`, no rows visible yet.
3. At ~30% progress: row 01 (noahfrank.com) appears centered — italic serif title, description, tags hairline.
4. At ~40% progress: counter flips to `02 / 03`; row 01 fades out; row 02 (ErgoDoc) fades in.
5. At ~55% progress: counter flips to `03 / 03`; row 02 out, row 03 (TAF 180) in.
6. At ~70% progress: all three rows visible, stacked vertically (smaller, centered column).
7. At ~100% progress: box scrolls up, Experience appears below.

Click a project row (during reveal or hold) — expected: navigates to `/work/<slug>` page.

If rows don't appear at all, check DevTools — inspect `[data-work-row]` elements and confirm their inline `opacity` style is updating on scroll. If counter doesn't update, confirm the `[data-counter]` selector matched (only the `<p>` inside the eyebrow row should have `data-counter`).

- [ ] **Step 4.5: Commit**

```bash
git add components/WorkSection.tsx
git commit -m "feat(work): three-row reveal phases with stacked hold state"
```

---

## Task 5: Selected Work reduced-motion fallback

**Why:** Users with `prefers-reduced-motion: reduce` currently get early-return in the effect, meaning the box stays at rest geometry (margins never shrink) and rows are invisible (opacity 0 is the inline default). The fallback needs to render all three rows visible as a simple list inside a static black box.

**Files:**
- Modify: `components/WorkSection.tsx`

- [ ] **Step 5.1: Add reduced-motion class + CSS**

Add a `<style>` block at the bottom of the component (before the closing `</section>`) and a reduced-motion detection that toggles a class on the box:

```tsx
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #work {
            height: auto !important;
          }
          #work .work-stage-reduced {
            position: static !important;
            height: auto !important;
          }
          #work .work-box {
            width: 100% !important;
            height: auto !important;
            border-radius: 0 !important;
            border: none !important;
            padding: clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px);
          }
          #work .work-box [data-work-row] {
            position: static !important;
            transform: none !important;
            opacity: 1 !important;
            display: block;
            margin: clamp(48px, 6vw, 80px) auto;
            text-align: left;
          }
          #work .work-box [data-work-row] h3 {
            font-size: clamp(36px, 5vw, 56px);
          }
          #work .work-box [data-counter] {
            display: none;
          }
        }
      `}</style>
```

Also add the class `work-stage-reduced` to the sticky stage div:

```tsx
      <div
        ref={stageRef}
        className="work-stage-reduced"
        style={{ /* existing styles */ }}
      >
```

- [ ] **Step 5.2: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5.3: Visual verification — reduced motion**

Enable reduced motion:
- macOS: System Settings → Accessibility → Display → Reduce Motion → On
- Or in Chrome DevTools: Cmd-Shift-P → "Emulate CSS prefers-reduced-motion" → "reduce"

Reload `http://localhost:3000`.

Expected:
- Hero stays fully visible, no fade-out on scroll (opacity effect early-returns for reduced motion).
- Work section: a static black box (still near-black `#14110F`, no rounded corners, no border) containing the three project rows as a simple stacked list. No counter. No pinning. No scroll-driven reveal.
- Experience and Now scroll normally.

Turn reduced motion off before continuing.

- [ ] **Step 5.4: Commit**

```bash
git add components/WorkSection.tsx
git commit -m "feat(work): reduced-motion fallback as static list"
```

---

## Task 6: Rewrite ExperienceSection as cinematic blocks

**Why:** Replace the compact period-grid with full-width role blocks. Same data, new treatment.

**Files:**
- Replace: `components/ExperienceSection.tsx`

- [ ] **Step 6.1: Rewrite ExperienceSection.tsx**

Overwrite `components/ExperienceSection.tsx` with:

```tsx
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

    const parts = section.querySelectorAll<HTMLElement>('[data-exp-part]');
    if (prefersReduced) {
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
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  fontSize: 'clamp(56px, 8vw, 96px)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
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
```

- [ ] **Step 6.2: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 6.3: Visual verification**

```bash
npm run dev
```

Open `http://localhost:3000`, scroll to Experience.

Expected:
- `EXPERIENCE` eyebrow at top.
- Three blocks: Alerion, KPMG, Bundeswehr (in that order).
- Each block: period+location tag, large italic serif org name (Cormorant), thin terracotta line under the org, role subtitle, narrative paragraph.
- Blocks are vertically generous — substantial breathing room between them.
- Hairline divider between blocks (not above the first).
- As each block enters viewport, its four lines reveal in staggered sequence (tag → org → role → paragraph), ~80ms apart.

If the terracotta line doesn't appear: confirm the `.exp-org::after` CSS was included in the `<style>` block. If the stagger reveals simultaneously instead of staggered: confirm the IntersectionObserver callback iterates items and uses `setTimeout(..., i * 80)`.

- [ ] **Step 6.4: Commit**

```bash
git add components/ExperienceSection.tsx
git commit -m "feat(experience): cinematic full-width role blocks"
```

---

## Task 7: Rewrite NowSection with Reading/Listening/Learning + date

**Why:** Noah repositioned Now as a `/now`-style page — current attention, not job/school/training status. Three slots, typographic blocks, one "Updated [month]" line at the top. Content placeholders stay as "TBD" per spec — Noah fills later.

**Files:**
- Replace: `components/NowSection.tsx`

- [ ] **Step 7.1: Rewrite NowSection.tsx**

Overwrite `components/NowSection.tsx` with:

```tsx
'use client';

import { useEffect, useRef } from 'react';

const UPDATED = 'Updated April 2026';

const ITEMS = [
  {
    label: 'Reading',
    title: 'TBD',
    note:  'TBD — a sentence on why this book has my attention.',
  },
  {
    label: 'Listening',
    title: 'TBD',
    note:  'TBD — a sentence on what this is doing for me right now.',
  },
  {
    label: 'Learning',
    title: 'TBD',
    note:  'TBD — a sentence on what I am working out here.',
  },
];

export default function NowSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const parts = section.querySelectorAll<HTMLElement>('[data-now-part]');
    if (prefersReduced) {
      parts.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const items = el.querySelectorAll<HTMLElement>('[data-now-part]');
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

    section.querySelectorAll<HTMLElement>('[data-now-block]').forEach(el => observer.observe(el));
    // Also observe the header block
    const header = section.querySelector<HTMLElement>('[data-now-header]');
    if (header) observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="now"
      data-section="now"
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div data-now-header>
          <p
            data-now-part
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
              margin: 0, marginBottom: 16,
              opacity: 0, transform: 'translateY(20px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            Now
          </p>
          <p
            data-now-part
            style={{
              fontSize: 12, fontStyle: 'italic',
              color: 'var(--color-text-tertiary)',
              margin: 0, marginBottom: 'clamp(48px, 6vw, 72px)',
              opacity: 0, transform: 'translateY(12px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            {UPDATED}
          </p>
        </div>

        {ITEMS.map((item, i) => (
          <div
            key={item.label}
            data-now-block
            style={{
              paddingTop: i === 0 ? 0 : 48,
              paddingBottom: i === ITEMS.length - 1 ? 0 : 48,
              borderBottom: i === ITEMS.length - 1
                ? 'none'
                : '1px solid var(--color-border)',
            }}
          >
            <p
              data-now-part
              style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                margin: 0, marginBottom: 16,
                opacity: 0, transform: 'translateY(12px)',
                transition: 'opacity 0.55s ease, transform 0.55s ease',
              }}
            >
              {item.label}
            </p>
            <p
              data-now-part
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                lineHeight: 1.15,
                letterSpacing: '-0.015em',
                color: 'var(--color-text)',
                margin: 0, marginBottom: 14,
                opacity: 0, transform: 'translateY(12px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              {item.title}
            </p>
            <p
              data-now-part
              style={{
                fontSize: 15, lineHeight: 1.75,
                color: 'var(--color-text-secondary)',
                margin: 0, maxWidth: '60ch',
                opacity: 0, transform: 'translateY(12px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7.2: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 7.3: Visual verification**

```bash
npm run dev
```

Open `http://localhost:3000`, scroll to Now (just above the footer).

Expected:
- `NOW` eyebrow.
- Below: `Updated April 2026` in small italic.
- Three stacked blocks: Reading / Listening / Learning.
- Each block: uppercase label, italic Cormorant title ("TBD" placeholder), single-sentence note.
- Hairline dividers between blocks.
- On scroll-into-view, each block's three elements stagger in.

- [ ] **Step 7.4: Commit**

```bash
git add components/NowSection.tsx
git commit -m "feat(now): /now-style Reading/Listening/Learning blocks with Updated date"
```

---

## Task 8: Final QA pass across the whole page

**Why:** End-to-end check that the sections work together. Integration issues (spacing, transitions between sections, mobile) are only visible when scrolling the full page.

**Files:** None modified unless issues found.

- [ ] **Step 8.1: Full-page scroll, desktop**

```bash
npm run dev
```

Open `http://localhost:3000` at a typical laptop viewport (1280×800 or similar).

Scroll from top to bottom once. Observe:

- [ ] Hero visible at load, fully opaque.
- [ ] Scroll ~300px: Hero gone, Work section's black box appears with margins.
- [ ] Continue scrolling: box expands to fullscreen, rows reveal one by one, counter ticks.
- [ ] Rows 01 / 02 / 03 visible in correct order (noahfrank.com → ErgoDoc → TAF 180).
- [ ] Clicking a row navigates to `/work/<slug>` — return to `/` after.
- [ ] After Work: cream Experience section appears with three cinematic role blocks.
- [ ] Terracotta line visible once per Experience org name.
- [ ] After Experience: Now section with Reading/Listening/Learning.
- [ ] Footer at bottom.
- [ ] No console errors throughout.

Scroll back up from bottom to top:
- [ ] Hero re-fades-in at top; name-scramble re-triggers.
- [ ] Work section replays on scroll-back (box collapses, rows disappear in reverse).

- [ ] **Step 8.2: Narrow viewport check**

In DevTools, set viewport to iPhone 14 size (390×844) or similar. Reload.

Observe:
- [ ] Hero renders readably.
- [ ] Work section: box margins compress; rows still readable (type may be smaller per clamp).
- [ ] Row titles don't overflow the box.
- [ ] Experience blocks stack cleanly.
- [ ] Now section readable; no horizontal overflow.

If the Work rows overflow horizontally on mobile, adjust: add `padding: clamp(24px, 6vw, 96px)` to the row container (should already be present) and confirm `maxWidth: 'min(900px, 80vw)'` is honored on the row anchor. Common fix: reduce font-size clamp lower bound on `.h3` to `clamp(36px, 8vw, 104px)`.

- [ ] **Step 8.3: Reduced motion full-page check**

Enable `prefers-reduced-motion: reduce` (macOS Accessibility or Chrome DevTools emulation).

Reload. Scroll through:
- [ ] Hero: no fade-out on scroll; visible until scrolled past.
- [ ] Work: static black box with stacked list of 3 projects. No pinning.
- [ ] Experience: blocks visible immediately (no stagger reveal).
- [ ] Now: blocks visible immediately.

- [ ] **Step 8.4: Build + production preview**

```bash
npm run build
npm run start
```

Open `http://localhost:3000`. Repeat the desktop scroll test on the production build.

Expected: same behavior as dev, no hydration warnings in console.

- [ ] **Step 8.5: Cleanup commit if anything was tweaked**

If any adjustments were made in Steps 8.1–8.4:

```bash
git add -A
git commit -m "chore: QA fixes for homepage redesign"
```

If nothing needed adjustment, skip this step.

---

## Self-Review Notes

**Spec coverage:**
- Section 1 (Hero fade) → Task 2 ✓
- Section 2 (Work pinned box) → Tasks 3 + 4 + 5 ✓
- Section 3 (Experience) → Task 6 ✓
- Section 4 (Now) → Task 7 ✓
- About removal → Task 1 ✓
- QA checklist from spec → Task 8 ✓

**Placeholder check:** Now section ships with "TBD" — this is intentional per the spec and confirmed with Noah. Not a plan failure; it's content scope Noah owns.

**Type consistency:** `WORK` array export in Task 3 is the only cross-task data definition; Task 4 references the same `data-work-row` attribute selector. Counter element is `data-counter`. Experience uses `data-exp-block` / `data-exp-part`. Now uses `data-now-block` / `data-now-part` / `data-now-header`. No collisions.

**Known risk:** The Work section's scroll math uses `getBoundingClientRect().top` — if Lenis smooth scrolling manipulates scroll position in ways that desync this from native `scrollY`, the progress calculation could feel off. Mitigation: the math uses `rect.top` directly (Lenis-compatible), not `window.scrollY`. If issues appear, fall back to listening on Lenis's own scroll event (import `useLenis` or similar) — this would be a single-line change in Task 3's `onScroll`.
