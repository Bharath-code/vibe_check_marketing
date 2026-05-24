# Vibe Check — Design System

*Version 1.0 · May 2026 · For Next.js + Tailwind*

Design for **B2B buyers** (content managers, 28–35) with a product that judges **youth-audience copy**. The UI must feel professional and fast—not a parody of Gen Z aesthetics.

---

## Brand foundation

| Attribute | Direction |
|-----------|-----------|
| **Metaphor** | Signal vs noise — copy passes the feed test or gets scrolled past |
| **Promise** | Honest, fast pre-publish tone QA |
| **Personality** | Sharp editor, anti-corporate, India-aware, never try-hard |
| **Avoid** | Purple AI gradients, excessive emoji, slang in UI chrome, neon chaos |

**Logo (concept):** Wordmark `vibe` lowercase + small check/signal tick, or minimal speech bubble with scan line. Primary lockup on charcoal; reversed on off-white.

---

## Color tokens

Use CSS variables in `globals.css`; map to Tailwind in `tailwind.config`.

```css
:root {
  /* Surfaces */
  --vc-bg: #0f0f12;
  --vc-bg-elevated: #18181f;
  --vc-bg-subtle: #f5f2ec;
  --vc-surface: #ffffff;
  --vc-border: rgba(255, 255, 255, 0.08);
  --vc-border-light: #e8e4dc;

  /* Text */
  --vc-text: #f5f2ec;
  --vc-text-muted: #9b9aa8;
  --vc-text-inverse: #0f0f12;
  --vc-text-secondary: #5c5b66;

  /* Brand */
  --vc-accent: #ff5c4d;        /* alert / CTA / hard cringe */
  --vc-accent-hover: #ff7568;
  --vc-pass: #3ddba0;          /* clean / fire positive */
  --vc-warn: #f5a623;          /* needs work */
  --vc-neutral: #6b8cff;       /* links, focus rings */

  /* Verdict bands */
  --vc-verdict-cringe: #ff5c4d;
  --vc-verdict-needs: #f5a623;
  --vc-verdict-clean: #3ddba0;
  --vc-verdict-fire: #3ddba0;

  /* Score ring */
  --vc-ring-track: rgba(255, 255, 255, 0.12);
  --vc-ring-fill: var(--vc-accent);

  /* Shadows */
  --vc-shadow-card: 0 8px 30px rgba(0, 0, 0, 0.08);
  --vc-shadow-elevated: 0 16px 48px rgba(0, 0, 0, 0.24);
}
```

### Tailwind extension (example)

```ts
// tailwind.config.ts — colors.vc.*
vc: {
  bg: "#0f0f12",
  "bg-elevated": "#18181f",
  subtle: "#f5f2ec",
  accent: "#ff5c4d",
  pass: "#3ddba0",
  warn: "#f5a623",
}
```

### Semantic usage

| Token | Use |
|-------|-----|
| `vc-bg` | Marketing hero, app shell (dark mode default) |
| `vc-bg-subtle` | Landing alternate sections, result card on light |
| `vc-accent` | Primary CTA, Hard cringe verdict |
| `vc-pass` | Clean / Fire verdict, success states |
| `vc-warn` | Needs work verdict |

**Light mode (optional P1):** Swap `--vc-bg` → `--vc-bg-subtle` for body; text inverse. Default launch: **dark shell + light result card** for contrast on share OG.

---

## Typography

| Role | Font | Fallback | Notes |
|------|------|----------|-------|
| Display | Instrument Sans | system-ui | Headlines, verdict |
| Body | Inter | system-ui | UI, issues, rewrite |
| Mono | JetBrains Mono | monospace | Scores, metadata, code-like quotes |

### Scale

| Token | Size | Line height | Weight |
|-------|------|-------------|--------|
| `text-display` | 3rem (48px) | 1.1 | 600 |
| `text-h1` | 2.25rem (36px) | 1.15 | 600 |
| `text-h2` | 1.5rem (24px) | 1.25 | 600 |
| `text-body` | 1rem (16px) | 1.6 | 400 |
| `text-small` | 0.875rem (14px) | 1.5 | 400 |
| `text-caption` | 0.75rem (12px) | 1.4 | 500 |
| `text-score` | 2.5rem (40px) | 1 | 600 (mono) |

**Rules:** Max ~65ch for body copy blocks. Verdict labels: display, short, no punctuation. Don’t use more than two families on one screen.

---

## Spacing & layout

- **Base unit:** 4px
- **Section padding:** 64px desktop / 40px mobile
- **Content max-width:** 720px (tool), 1120px (marketing)
- **Card padding:** 24px
- **Gap grid:** 16px default, 24px between major blocks

```
┌─────────────────────────────────────────┐
│  Nav (64px)                             │
├─────────────────────────────────────────┤
│  Hero / Input                           │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌──────────────────────┐  │
│  │ Score   │  │ Verdict + Issues     │  │
│  │ ring    │  │                      │  │
│  └─────────┘  └──────────────────────┘  │
│  Rewrite panel (full width)             │
│  Actions: Copy · Share · Run again      │
└─────────────────────────────────────────┘
```

---

## Radius, borders, shadows

| Token | Value |
|-------|-------|
| `radius-sm` | 6px |
| `radius-md` | 8px (cards, inputs) |
| `radius-lg` | 12px (modals) |
| `radius-pill` | 999px (badges, CTAs) |
| `border-default` | 1px solid var(--vc-border) |
| `shadow-card` | var(--vc-shadow-card) |
| `shadow-elevated` | var(--vc-shadow-elevated) |

No heavy neumorphism. One elevation level per view.

---

## Motion

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Score ring fill | 600ms | ease-out |
| Verdict stamp appear | 200ms | ease-out |
| Button hover | 150ms | ease |
| Modal | 200ms | ease-out |

Respect `prefers-reduced-motion`: skip ring animation, show final score immediately.

---

## Components

### `ContentTypeSelect`

Pills: Tweet · LinkedIn · TikTok script · Ad copy · Push · Custom.

### `TextArea`

Min-height 120px, monospace optional for “paste raw copy”, character count optional P1.

### `RunButton`

Primary `vc-accent`, label: **Run vibe check**, loading state with spinner + “Reading your copy…”

### `ScoreRing`

SVG circle 120–160px; numeric score center; `aria-label`: “Score 42 out of 100, verdict Needs work”

### `VerdictBadge`

| Band | Label | Color |
|------|-------|-------|
| 0–35 | Hard cringe | `vc-verdict-cringe` |
| 36–55 | Needs work | `vc-verdict-needs` |
| 56–75 | Clean | `vc-verdict-clean` |
| 76–100 | Fire | `vc-verdict-fire` |

Show **band as primary**; score secondary (smaller mono).

### `IssueList`

3–5 items; each: quoted phrase in `font-mono` or italic + explanation. Icon: warning dot, not emoji.

### `RewritePanel`

Tabs: **Fix** (default) | **Gen Z**  
Actions: Copy, Replace input (P1)  
Background: `vc-bg-elevated` or light card

### `ShareCard` / OG

1200×630: logo, score ring, verdict, domain. Optional blur for B2B private shares (no score on public OG if private).

### `RateLimitBanner`

“3 free checks today · 2 left” → email gate CTA

### `EmailGateModal`

Email + continue; no dark patterns

### `UpgradePrompt`

Pro benefits bullet list; $19/mo; early bird $9 for first 10

---

## Accessibility

- Verdict: never color-only; include text label
- Focus rings: `2px solid var(--vc-neutral)`, offset 2px
- Contrast: body text ≥ 4.5:1 on backgrounds
- Live region announces when results load

---

## Share card & marketing

**Landing hero:** Dark `vc-bg`, one live demo input, three before/after cards (Indian brands, anonymized).

**OG image typography:** Display verdict large; score smaller; `vibecheck.in` footer.

**Illustration style:** Split “before/after” copy blocks, subtle social UI chrome (blurred), no stock photos of teens.

---

## File structure (suggested)

```
app/
  globals.css          # CSS variables
  layout.tsx           # fonts (Instrument Sans, Inter, JetBrains Mono)
components/
  ui/                  # primitives (Button, Badge, Tabs)
  vibe-check/          # ScoreRing, VerdictBadge, IssueList, RewritePanel
```

---

## Implementation checklist

- [ ] CSS variables in `globals.css`
- [ ] Tailwind `vc` color map
- [ ] `next/font` for three families
- [ ] `VerdictBadge` maps score → band
- [ ] `ScoreRing` + reduced motion
- [ ] OG route uses same tokens (edge)
- [ ] Light result card on dark shell for contrast

---

---

## Related Project Documents

*   **PRD:** [vibecheck-prd.md](file:///Users/bharath/Desktop/on-going-projects/vibe_check_marketing/vibecheck-prd.md)
*   **Marketing Positioning:** [Product Marketing Context](file:///Users/bharath/Desktop/on-going-projects/vibe_check_marketing/.agents/product-marketing-context.md)
*   **Features:** [v1.1-features.md](file:///Users/bharath/Desktop/on-going-projects/vibe_check_marketing/docs/v1.1-features.md)
*   **Leadership Analysis:** [project_analysis.md](file:///Users/bharath/.gemini/antigravity/brain/0c6be20d-840f-4b61-bcec-d70a300836f6/project_analysis.md)
*   **GTM & Moats:** [growth_strategy.md](file:///Users/bharath/.gemini/antigravity/brain/0c6be20d-840f-4b61-bcec-d70a300836f6/growth_strategy.md)
*   **Unified Blueprint:** [unified_mvp_spec.md](file:///Users/bharath/.gemini/antigravity/brain/0c6be20d-840f-4b61-bcec-d70a300836f6/unified_mvp_spec.md)

