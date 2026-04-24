@AGENTS.md

## Design Context

### Brand Personality
**Reif · Geerdet · Weitblickend** — confident without arrogance, ambitious without noise.
Emotional goal: visitor leaves feeling impressed, curious, and trusting — simultaneously.

### Aesthetic Direction
Editorial premium. References: Anthropic, OpenAI, Apple (restraint, whitespace, typographic confidence).
Light mode only. Warm cream (#FAF8F5), deep warm-black (#1A1614), terracotta accent (#C8522A) sparingly.

**Typography (single-font rule, locked 2026-04-22):**
- **Geist only.** One font across the entire site — display, body, nav, labels, project names, everything.
- Self-hosted variable font at `/fonts/GeistVariableVF.woff2`. Weight range 100–900.
- Weight is how you create hierarchy: 700–800 for display/names, 500–600 for labels, 400 for body.
- No serif. No font pairings. No Cormorant Garamond, no Georgia. If an existing component still uses a serif font family, update it to Geist.
- Italic is fine for the wordmark logo; avoid italic elsewhere.

### Anti-patterns (never do)
- Student portfolio aesthetic — cheap, template-like
- LinkedIn bullet-list style — dry, corporate
- Tech-bro startup — hip, buzzword-heavy, performative
- Vibe-coded overbuilding — excessive animations, decorative noise

### Design Principles
1. **Typography is the design.** The Cormorant name, large and confident, IS the hero. Let it breathe.
2. **Restraint over decoration.** Every element earns its place. Ask: does this add meaning or noise?
3. **Generous whitespace signals confidence.** Empty space is not wasted.
4. **One accent, used once per section.** Terracotta as underline or single stroke — never as fill.
5. **Copy carries weight.** Every sentence must be something only Noah Frank could say.
6. **Interactions are quiet.** Fade+translate on load, parallax on scroll, color shifts on hover. Nothing loops or bounces.
