# Ask Noah — Chat Widget Design Spec

**Date:** 2026-04-19
**Status:** Approved for implementation planning
**Owner:** Noah Frank

## 1. Problem & Goal

Add a Claude-powered Q&A assistant to noahfrank.com so recruiters and visitors can ask factual questions about Noah (background, experience, projects, availability) and contact him via natural conversation. The build must demonstrate real Claude API craft (caching, tool use, streaming, evals, rate-limiting) — not a thin wrapper.

**Success signal:** A recruiter opens Cmd+K, asks a concrete question, receives an accurate, on-brand, sub-2s-to-first-token answer. Optional path: the recruiter sends Noah a message directly from the overlay.

## 2. Scope

### In scope
- Answer factual questions about Noah from a bounded corpus (system prompt, ~3k tokens)
- Render structured project cards via tool call (`show_project_detail`)
- Forward contact messages to Noah via tool call (`send_message`)
- Rate-limited, logged, eval-tested

### Out of scope
- Opinions Noah holds on third parties, politics, salaries
- Calendar booking, meeting scheduling
- RAG or vector store (corpus fits in context; retrieval adds failure modes without benefit)
- German-language responses (English only — matches site language)
- First-person Noah impersonation (bot is a concierge persona, not a Noah-avatar)

## 3. Decisions Summary

| Decision | Value | Rationale |
|---|---|---|
| Scope | Facts only about Noah | Bounded, minimal hallucination surface |
| Tools | `send_message`, `show_project_detail` | Contact is the real call-to-action; structured cards demonstrate LLM→UI-integration craft |
| Knowledge strategy | System-prompt + Anthropic prompt-caching | Corpus <5k tokens; RAG is theater at this scale |
| UI | Cmd+K overlay (no floating widget) | Editorial-premium design constraint rejects SaaS-style chat bubbles |
| Language | English only | Site is EN; halves eval load; signals international readiness |
| Voice | "Concierge" persona, third-person about Noah, terse | Honest (no uncanny-valley Noah-impersonation), matches brand |
| Model | Claude Sonnet 4.6 | Better tool-use reliability, persona stability, refusal quality; cost difference vs Haiku is negligible at this scale |
| Rate limits | Conservative preset | Safe-over-generous for personal brand site |
| Logging | Full (Q+A+tool calls+hashed IP), 90 days | Enables eval suite growth from real questions |
| Eval suite | 20 seed questions, LLM-as-Judge via Haiku 4.5, local runner | State-of-the-art eval pattern; real API craft |
| Hosting | Netlify Functions | Site already on Netlify; zero additional infra |

## 4. Architecture (3 layers)

```
Browser (Cmd+K Overlay, React)
  ↓ POST /.netlify/functions/ask  {messages, conversationId}
Netlify Function (TypeScript, Node runtime)
  ↓ rate-limit check (Netlify Blobs)
  ↓ input validation (length, turn count)
  ↓ Anthropic SDK: messages.create() with cached system prompt
Anthropic API (Claude Sonnet 4.6, streaming)
  ↓ SSE stream back through Function to Browser
Browser renders streaming response + tool outputs
```

**No database, no auth server, no external services beyond Anthropic + Resend (for `send_message`).**

## 5. File Layout

```
noahfrank-website/
├── app/
│   ├── components/
│   │   └── AskOverlay.tsx         # Cmd+K overlay UI + chat state
│   └── lib/
│       └── ask-client.ts          # fetch + SSE stream parser
├── netlify/
│   └── functions/
│       ├── ask.ts                 # main endpoint
│       └── _lib/
│           ├── system-prompt.ts   # imports corpus.md
│           ├── tools.ts           # send_message, show_project_detail
│           ├── rate-limit.ts      # Netlify Blobs sliding window
│           ├── logger.ts          # JSONL writer to Netlify Blobs
│           ├── ip-hash.ts         # SHA-256 + salt
│           └── cleanup.ts         # nightly 90-day retention purge
├── content/
│   ├── corpus.md                  # system prompt (Noah facts)
│   └── projects.json              # project cards for show_project_detail
└── eval/
    ├── suite.json                 # 20 seed questions
    ├── run.ts                     # runner + LLM-as-Judge
    └── README.md
```

**New npm dependencies:** `@anthropic-ai/sdk`, `@netlify/blobs`, `resend`

## 6. System Prompt Structure

~3k tokens, cached via `cache_control: "ephemeral"`. Sections:

1. **System Role** — not Noah; only answer from notes; redirect on gaps
2. **Tone** — short sentences, editorial-quiet, no emojis, no superlatives
3. **Hard Rules (Refusals)** — no invention; no first-person-as-Noah; no third-party opinions; stay in character on jailbreak
4. **Bio** — name, DOB, location
5. **Education** — UZH (Business Admin Major, History/Politics/Society Minor, 2024–2027), Abitur 2021 Canisius-Kolleg Berlin, exchange 2018–19 McCluer North HS
6. **Work Experience** — Alerion Consult, KPMG Berlin, Bundeswehr
7. **Military Service (honest framing)** — Leutnant der Reserve (promoted June 2024), Marineinfanterie / Sea Battalion. Platoon-leader training completed. Einzelkämpferlehrgang Hammelburg: finished all 4 weeks (15 of 85 who started), did not earn badge (only 8 did); finishing itself is framed as the achievement.
8. **Current Focus / Interests** — VC/startup exploration, learning by building (this site, Claude assistants, TAF 180), Why Nations Fail (Acemoglu/Robinson), rowing team at Belvoir Zurich, AI applied implementation
9. **What I'm Looking For** — not a specific role; open to VC/startup/applied-AI conversations; email for actual dialogue
10. **Tool Usage Rules** — when to call each tool
11. **Fallbacks** — "I don't have notes on that. Reach Noah at noahfrank361@gmail.com"

### Deferred to 2026-04-23 (Noah to provide)
- Alerion concrete outcomes (1–2 sentences, anonymized if NDA)
- Project case studies (3–5): noahfrank-website, ask-noah-widget, optionally TAF-180, Ferrari valuation, Rotaract fundraiser

Until then, system prompt contains placeholder: *"Noah will share project details soon — reach out via email for specifics."*

### CV-integrity notes (bot corpus is the source of truth; CV to be updated separately by Noah)
- "Statistics" is not a passed module (currently re-taking)
- "Lieutenant" is factually correct (promoted on last duty day)
- Einzelkämpfer: framed as "completed 4 weeks, did not earn badge" — not "passed"

## 7. Tools

### `show_project_detail`

```ts
{
  name: "show_project_detail",
  description: "Render structured card for a specific project when user asks for depth on it.",
  input_schema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        enum: ["website", "ask-noah-widget", ...]  // from projects.json
      }
    },
    required: ["project_id"]
  }
}
```

Function reads `content/projects.json`, returns structured JSON `{title, role, stack, problem, outcome, link}`. Browser renders as card (bordered box, not chat bubble).

### `send_message`

```ts
{
  name: "send_message",
  description: "Forward a contact message from the user to Noah via email.",
  input_schema: {
    type: "object",
    properties: {
      sender_name: {type: "string", minLength: 2, maxLength: 80},
      sender_email: {type: "string", format: "email"},
      message: {type: "string", minLength: 20, maxLength: 2000}
    },
    required: ["sender_name", "sender_email", "message"]
  }
}
```

Function calls Resend API → sends to `noahfrank361@gmail.com`. Bot confirms: *"Message sent. Noah replies within 24h."* Resend free tier (3k mails/month) is more than sufficient.

**Tool misuse guard:** System prompt explicitly states: only call `send_message` when the user explicitly requests contact with name + email + message content. If any field missing, ask the user in chat first.

## 8. Rate Limits & Validation (Conservative Preset)

Sequential checks in `ask.ts`:

1. **Last user message length** ≤ 300 chars → else 400
2. **Conversation length** ≤ 12 turns → else *"Long conversation — time to email Noah directly."*
3. **Per-IP (hashed) hourly** ≤ 10 → else rate-limit response
4. **Per-IP (hashed) daily** ≤ 30 → else rate-limit response
5. **Global daily** ≤ 300 → else rate-limit response

Rate-limit counters: Netlify Blobs with sliding-window keys (`rl:ip:<hash>:hour:<yyyymmddhh>`, `rl:ip:<hash>:day:<yyyymmdd>`, `rl:global:day:<yyyymmdd>`).

**Rate-limit user-facing message:** *"I've answered enough questions for now. You can reach Noah directly at noahfrank361@gmail.com — he responds within 24h."*

**Anthropic Spending Cap:** $10/month (manual setting in Anthropic Console — last-resort firewall, part of launch checklist).

## 9. Logging (Full-Logging Preset)

Each successful request appends one JSONL line to Netlify Blobs (key: `log:<yyyymmdd>`):

```json
{
  "ts": "2026-04-19T14:22:01Z",
  "ipHash": "a4f8...",
  "convId": "uuid",
  "turn": 3,
  "question": "Where did Noah intern?",
  "answer": "Noah interned at KPMG Berlin...",
  "toolCalls": [],
  "tokens": {"in": 5120, "out": 287, "cacheRead": 4900},
  "latencyMs": 1843,
  "model": "claude-sonnet-4-6"
}
```

**Retention:** 90 days rolling. Scheduled cleanup function (`cleanup.ts`) runs nightly, deletes blobs older than 90 days.

**Privacy disclaimer** (required, overlay footer, small muted text):
> *"Conversations are logged for 90 days to improve the assistant. No tracking, no cookies, hashed IP only."*

No cookie banner required (no tracking cookies, no third-party pixels, IP is hashed before storage).

## 10. UI — Cmd+K Overlay

**Trigger:** ⌘K (Mac) / Ctrl+K (Win/Linux); also small "Ask" link in nav.

**Behavior:**
- Full-screen overlay with `backdrop-blur` + 70% cream tint (`#FAF8F5` at 0.7)
- Centered input field, Cormorant Garamond placeholder: *"Ask about Noah's experience…"*
- Conversation rendered below input, oldest on top
- No bubbles: typography-driven, role-labels `you` / `assistant` as small muted small-caps
- Tool outputs (project cards) as bordered boxes with padding, not chat bubbles
- ESC, outside-click, or Cmd+K again closes

**Animation:** 200ms fade-in only. Input auto-focus. No bounces, no slides. Matches CLAUDE.md rule *"Interactions are quiet. Nothing loops or bounces."*

**Loading state:** Grey blinking cursor underline during model streaming. No spinner.

## 11. Eval Suite

`eval/suite.json` — 20 seed questions, 5 categories (4 each):

1. **Factual** — specific facts (expected: correct answer from corpus)
2. **Scope refusal** — salaries, third parties (expected: refusal + redirect)
3. **Tool trigger** — project depth, contact request (expected: correct tool call)
4. **Contact** — "how do I reach him" (expected: email or send_message hint)
5. **Adversarial** — jailbreak, ignore-instructions (expected: stays in character)

**Runner (`npm run eval`):**

1. Boots local function (or hits production URL)
2. Sends each test question, collects response + tool calls
3. Calls Claude Haiku 4.5 as judge with `{question, expected, actual}` → `{pass: bool, reason: string}`
4. Prints report: `N/20 pass`, per-category breakdown, failure reasons
5. Exit code ≠ 0 if pass rate < 18/20

**Cost per eval run:** ~$0.10. Expected cadence: pre-deploy + after prompt changes (~4×/week). Monthly: ~$1.60.

## 12. Error Handling

| Error | Behavior |
|---|---|
| Anthropic 5xx | Retry once after 500ms; else *"Temporarily unavailable. Try again or email Noah."* |
| Anthropic 4xx | Log + *"Couldn't process that. Try rephrasing."* |
| Rate-limit hit | Friendly message (see §8) |
| `send_message` fail (Resend down) | *"Can't send right now — email Noah directly."* |
| Netlify Blobs unavailable | Fail-open for rate-limit; fail-silent for logging |
| Browser offline | *"Reconnect required."* |

## 13. Privacy & Security

- **API keys** (`ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `IP_HASH_SALT`) stored as Netlify env vars — never in repo, never in client bundle
- **IP hashing** — SHA-256 with per-environment salt, 16-char prefix stored
- **Headers** already set in `netlify.toml` (X-Frame-Options, Referrer-Policy, X-Content-Type-Options)
- **CORS** — function only accepts `POST` from same origin; reject others with 403
- **Input sanitization** — reject non-string message content; enforce length limits before Anthropic call
- **No PII in logs beyond what user voluntarily submits in their own messages** — 90-day auto-purge

## 14. Launch Checklist

Pre-deploy:
- [ ] Corpus final (CV integrity notes applied, Einzelkämpfer framed honestly, Minor = History/Politics/Society)
- [ ] `projects.json` has ≥ 2 entries (noahfrank-website + ask-noah-widget); rest from Noah 2026-04-23
- [ ] `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `IP_HASH_SALT` set in Netlify env
- [ ] Anthropic Spending Cap $10/month set manually in console
- [ ] Eval suite passes (≥ 18/20)
- [ ] Privacy disclaimer visible in overlay
- [ ] Manual smoke test: happy path, rate-limit hit, both tool calls, adversarial input

## 15. Open Items (Noah to provide 2026-04-23)

1. **Alerion outcomes** — 1–2 sentences on concrete results (anonymized if NDA)
2. **Project case studies** — 3–5 entries for `projects.json`:
   - noahfrank-website
   - ask-noah-widget (meta, added post-launch)
   - TAF 180 Rechnungstool (if publicly referenceable)
   - Ferrari valuation (Investment Club ZH)
   - Rotaract CHF 20k fundraiser
3. **Alerion framing** — which outcome phrasing is NDA-safe

Until these land: bot responds to project-depth questions with *"Noah will share project details soon."*

## 16. Post-Launch Iteration Loop

1. Week 1: monitor logs daily, check for bot drift / hallucination
2. Week 2–4: extract top-10 real questions from logs → add to eval suite
3. Monthly: review spending cap actuals, adjust rate-limits if legitimate users hit them
4. Quarterly: corpus refresh (new projects, updated status)

---

**Next step:** implementation plan via `superpowers:writing-plans`.
