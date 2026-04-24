# Homepage Redesign — Design Spec

**Date:** 2026-04-22
**Owner:** Noah Frank
**Scope:** Homepage (`app/page.tsx`) and the four section components it renders.

## Motivation

The current homepage has four problems Noah wants fixed:

1. Hero fade-out on scroll is too slow — drags instead of clearing the stage.
2. Selected Work section reads as a plain row list — no spotlight moment for projects.
3. About section duplicates information already in Experience. Noah no longer wants it.
4. Experience and Now sections feel like flat lists — "one point to the next" — they don't match the editorial cinematic tone the rest of the site is chasing.

Overall design DNA of the site stays the same: warm cream page (`#EDEAE3`), warm-black text (`#1A1614`), terracotta accent (`#C8522A`) used sparingly, Cormorant Garamond for display, Geist for body. This redesign keeps those tokens; it changes structure and motion.

## Final page structure

```
Nav
Hero                       (100svh, fades out fast on scroll)
Selected Work              (pinned black-box sequence, 400svh scroll budget)
Experience                 (cinematic role blocks)
Now                        (three typographic blocks)
Footer
```

The `AboutSection` is removed from the page and its source file deleted. The unused `WorkSection.tsx` (not imported anywhere) is also deleted.

## Section 1 — Hero scroll behavior

**Current behavior (to be replaced):**
- Hero lives in a `200svh` wrapper with `position: sticky`.
- Fade begins at `scrollY = 40vh` and completes at `scrollY = 100vh`.
- This produces the slow-drag effect Noah dislikes.

**New behavior:**
- Remove the `200svh` wrapper. Hero is a normal `100svh` section, still `position: sticky; top: 0`.
- Fade-out completes by `scrollY ≈ 30vh` (roughly 200–250px on a typical laptop).
- Simultaneous fade + small upward translate (≈ −24px) for a "clears out" feel.
- Once opacity reaches 0, the hero's canvas animations (mesh, orbs) stop via `cancelAnimationFrame` to save CPU; they resume if the user scrolls back to top.
- Name-scramble animation on scroll-back-to-top stays — it's a quality touch.

**Progress formula:**
```ts
const p = Math.min(Math.max(window.scrollY / (vh * 0.30), 0), 1);
heroEl.style.opacity   = String(1 - p);
heroEl.style.transform = `translateY(${-24 * p}px)`;
```

**Reduced motion:** no fade/transform. Hero still scrolls naturally. Canvas animations don't run (already handled in current code).

## Section 2 — Selected Work (pinned black-box sequence)

The center of this redesign. A single pinned scroll sequence that expands a contained black box to fullscreen, then reveals three project rows one at a time.

### Container geometry

```
<section id="work" style={{ height: '400svh', position: 'relative' }}>
  <div className="work-stage"             // position: sticky, top: 0, height: 100svh
       data-progress={0..1}>
    <div className="work-box">            // the growing black rectangle
      {/* content phases inside */}
    </div>
  </div>
</section>
```

- The outer section is `400svh` tall — gives 4 viewports of scroll budget to drive the sequence.
- The inner `.work-stage` is sticky and pins for the full 4-viewport scroll.
- All animation is driven by a single progress value `p = (scrollY - sectionTop) / (sectionHeight - vh)`, clamped `[0, 1]`. One listener; the box, rows, and counter all read from this single source of truth.

### Box visual

| Property | At rest (`p = 0`) | Full expand (`p = 0.25`) |
|---|---|---|
| width | `100vw - 16vw` (i.e. 8vw side margins) | `100vw` |
| height | `100svh - 24vh` (i.e. 12vh top/bottom) | `100svh` |
| border-radius | `16px` | `0px` |
| border | `1px solid rgba(255,255,255,0.08)` | `transparent` |
| background | `#14110F` | `#14110F` |

Interpolation is linear on the progress window `[0, 0.25]`. `border-radius` and `border` are set as CSS custom properties driven from JS (`--work-radius`, `--work-border-alpha`), so the browser handles the paint; JS just writes values each scroll frame.

Text inside the box is cream `#EDEAE3` throughout.

### Content phases

One progress axis drives everything. The five phases:

| Progress window | What's visible inside the box |
|---|---|
| `0.00 – 0.25` | `SELECTED WORK` eyebrow top-left; `01 / 03` counter top-right. Box is expanding. No project rows. |
| `0.25 – 0.40` | Expansion complete. Row 01 (noahfrank.com) reveals centered: number, italic Cormorant name, year, description. |
| `0.40 – 0.55` | Row 01 eases out (slight opacity drop + upward translate). Row 02 (ErgoDoc) eases in. Counter updates to `02 / 03`. |
| `0.55 – 0.70` | Row 02 eases out. Row 03 (TAF 180) eases in. Counter updates to `03 / 03`. |
| `0.70 – 1.00` | Hold: all three rows stack vertically in the box, reading as a list. Reinforces "these are the projects." |

At `p = 1.0` the sticky pin naturally releases because the outer 400svh section ends. The black box continues scrolling up with the page and Experience (cream) appears below.

### Row content

Project data matches what's currently in `Hero.tsx` (`WORK` array):

1. `noahfrank.com` — 2025 — Personal brand website with an AI assistant — built entirely from scratch. — Next.js · GSAP · Claude API
2. `ErgoDoc` — 2024 – — Desktop app that streamlines documentation for occupational therapists. — Electron · React
3. `TAF 180` — 2024 — Custom invoice and billing tool built for independent service providers. — Web App

### Row visual (inside the full-screen black box)

- Large number (`01`, `02`, `03`): Geist, 11px, 0.18em tracking, uppercase, cream tertiary.
- Project name: Cormorant italic, `clamp(56px, 8vw, 104px)` — larger than current row treatment because it now owns the whole screen.
- Year: small Geist, 13px, tertiary cream, right-aligned next to name.
- Description: Geist, 16px, line-height 1.75, max-width 60ch, center-stage below name.
- Tags: Geist 11px, 0.08em tracking, appears below description with a short horizontal hairline above.
- Each row links to `/work/{slug}` on click.

### Reduced motion fallback

When `prefers-reduced-motion: reduce`:
- Outer section is `auto` height, not `400svh`.
- `.work-stage` is not sticky.
- `.work-box` is full-width, full-height `auto`, no expansion animation.
- All three rows are visible at once, rendered as a simple stacked list inside the black box.
- Counter shows `03 projects` instead of animating.

### File changes

- `components/Hero.tsx` — remove the `Selected Work` rows block currently living at the bottom of this file (lines 404–495). Hero stops owning Work.
- New `components/WorkSection.tsx` — this file currently exists but is unused. **Delete it and rewrite from scratch** with the pinned sequence above. (Deleting first is cleaner than editing the old content.)
- `app/page.tsx` — import the new `WorkSection`; reorder: `<Hero /> <WorkSection /> <ExperienceSection /> <NowSection />`.

## Section 3 — Experience (cinematic role blocks)

Replace the compact 88px-period-column + content grid with full-width blocks. One role per block. Blocks are roughly 70–80vh tall (not a full screen each — that would make the page excessively long).

### Per-block layout

```
[ OCT 2025 —    ZÜRICH ]          ← tag line, Geist 11px, tertiary, uppercase, 0.18em tracking

Alerion Consult                   ← Cormorant italic, clamp(56px, 8vw, 96px), warm-black
                                    With a single terracotta underline on the first letter's
                                    baseline — "one accent per section" rule.

WORKING STUDENT · STRATEGY & TRANSFORMATION   ← Geist 10px uppercase, 0.16em tracking, secondary color

Primary analyst on a live corporate strategy project for a 500+
employee client. Building competitor screens and KPI snapshots,
then translating the findings into materials that land in front
of leadership. First time being the one person responsible for a
real client deliverable.

                                  ← max-width 60ch, Geist 16px, line-height 1.85
```

### Block spacing

- Each block has ~15vh padding top and bottom.
- Thin 1px horizontal hairline in `rgba(26,22,20,0.08)` separating blocks (spanning 40% width, left-aligned).
- Section outer padding matches existing pattern: `clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)`.

### Reveal

- IntersectionObserver with threshold 0.2 fires once per block.
- Internal stagger: tag line (0ms) → org name (80ms) → role subtitle (160ms) → paragraph (240ms). Each element: fade + translateY(12px → 0), 600ms ease-out.
- Reduced motion: all elements start at final state.

### Data

Keep the `TIMELINE` array in `components/ExperienceSection.tsx`. No copy changes to descriptions — the redesign is about treatment, not content. (If Noah wants copy edits later, that's a separate change.)

Order: newest first → Alerion → KPMG → Bundeswehr.

### Terracotta accent

Only one use per block: a 2px horizontal line beneath the first letter of the org name, ~24px wide. This is the section's "one accent" per design principle. Example:
```css
.exp-org::before {
  content: '';
  position: absolute;
  left: 0; bottom: -8px;
  width: 24px; height: 2px;
  background: var(--color-accent); /* terracotta */
}
```

## Section 4 — Now (three typographic blocks)

Replace the label/value row grid. Now is a `/now` page in Derek Sivers' sense — current attention, not biographical status. Three slots: Reading, Listening, Learning.

### Layout

```
NOW                                ← existing eyebrow, 11px Geist, 0.22em tracking, tertiary

Updated April 2026                 ← new: single line, Geist italic 12px, tertiary, marginBottom ~48px

READING
Book Title                         ← Cormorant italic, clamp(28px, 3.5vw, 44px)
One sentence of your thought on it.
                                   ← Geist 15px, line-height 1.75, max-width 60ch, secondary

──────────────── (hairline divider, 1px, 48px vertical padding each side)

LISTENING
Album or Podcast Title
One sentence on why it's in rotation.

──────────────── (hairline divider)

LEARNING
Topic
One sentence on what you're doing with it.
```

Outer column `max-width: 720px`, same pattern as current.

### Content placeholders

The structure ships with placeholders Noah will replace later:

- Reading: title *TBD*, sentence *TBD*.
- Listening: title *TBD*, sentence *TBD*.
- Learning: topic *TBD*, sentence *TBD*.

Structure and layout are complete; content is a fill-in. Putting `TBD` in the visible copy at ship time is fine for a personal site — Noah controls when to update.

### Reveal

Same stagger pattern as Experience: label → title → sentence, 80ms apart, on scroll-into-view. Reduced motion: final state immediately.

### Date line

The `Updated April 2026` line sits between the eyebrow and the first block, not per-entry. One date to maintain, not three. This gives the page temporal credibility without creating per-item maintenance debt.

## Data / file layout after redesign

```
app/page.tsx
  └── Nav, LenisProvider, GrainTexture, Hero, WorkSection (new), ExperienceSection, NowSection, Footer

components/
  ├── Hero.tsx              ← hero-only now; scroll-fade logic rewritten; Work rows removed
  ├── WorkSection.tsx       ← rewritten: pinned black-box sequence
  ├── ExperienceSection.tsx ← redesigned cinematic blocks
  ├── NowSection.tsx        ← redesigned typographic blocks with date line
  ├── AboutSection.tsx      ← DELETED
  ├── Nav.tsx               ← may need `#work` anchor target update
  ├── Footer.tsx            ← unchanged
  ├── LenisProvider.tsx     ← unchanged
  └── GrainTexture.tsx      ← unchanged
```

`Nav.tsx` links to `/about`, `/experience`, `/contact` (separate route URLs, not homepage anchors). Deleting the homepage `AboutSection` component does NOT affect those nav links — they point at routes, not sections. Whether those routes exist as standalone pages is pre-existing state and out of scope for this redesign.

## Scroll performance

Two concerns to verify during implementation:

1. **Work section scroll handler** runs per frame while the user is inside the 400svh section. Must:
   - Be a single `scroll` listener with `{ passive: true }`.
   - Use `requestAnimationFrame` to batch writes.
   - Only compute if `sectionTop < vh && sectionBottom > 0` (skip when section is off-screen).

2. **Canvas animations in Hero** must stop (`cancelAnimationFrame`) once hero opacity is 0, to avoid running 60fps paints while invisible. Currently they don't stop.

## Testing checklist

- [ ] Hero fades out by ~30vh of scroll and stays faded.
- [ ] Hero canvas animations stop when hero is invisible.
- [ ] Scrolling back to top restores hero + re-triggers name scramble.
- [ ] Work section: box expands to full screen by progress 0.25.
- [ ] Work section: rows reveal one-at-a-time in phases 0.25–0.70.
- [ ] Work section: all three rows visible at 0.70–1.0.
- [ ] At progress 1.0, pin releases and Experience appears.
- [ ] Clicking a project row in the black box navigates to `/work/{slug}`.
- [ ] Experience blocks reveal with internal stagger on scroll-into-view.
- [ ] Terracotta underline appears only once per Experience block.
- [ ] Now section shows `Updated [month]` once, not per-entry.
- [ ] `prefers-reduced-motion: reduce`: no pins, no canvas animation, all content visible.
- [ ] No hydration warnings or layout jank at load.
- [ ] Mobile (≤640px): Work section still readable — rows may need smaller type; box margins compress to ~4vw sides / 6vh top-bottom.
- [ ] `AboutSection.tsx` file is deleted; no broken imports.
- [ ] Legacy `WorkSection.tsx` file is deleted before the new one is written, or git history is clean.

## Out of scope

- Copy rewrites for Experience descriptions. Current text stays.
- New project entries for Selected Work. Same three projects.
- Now content (book/podcast/topic titles). Noah fills after ship.
- Individual `/work/{slug}` detail pages. Assumed to exist already or remain as they are.
- Dark mode. Site is light-only per design principles.
