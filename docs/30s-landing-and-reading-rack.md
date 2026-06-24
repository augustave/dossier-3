# Component — 30s Landing + Reading Rack

> Design-system documentation for the `?read=30s` thesis-first landing and the
> folding **Reading Rack** lens selector it contains.
> Source: `components/ThirtySecondView.jsx`. Tokens: `tailwind.config.cjs`.
> Status: shipped on `feature/three-moves` (Move 1). Doctrine: Matte.

---

## 1. 30s Landing

### Description
A single, no-scroll **front door** rendered in place of the dossier stack when the
URL carries `?read=30s`. Its job: let the right reader grasp the bet and act in
~10 seconds. It is a **thesis that routes**, not a portfolio gallery.

### When to use
- As the destination for outreach links (`/?read=30s`) where time-to-thesis matters.
- Never as a work gallery — built work is a footnote link-out, never a module here.

### Anatomy (top → bottom)
| # | Block | Role |
|---|-------|------|
| 1 | Masthead strip | `CT DOSSIER · 30s` / `Ebenz Augustave` — orientation chrome |
| 2 | **Bet zone** | kicker → spear (`hero`/`display` scale) → support → inline For/Not fit line. Vertically dominant. |
| 3 | **Primary door** | the ONE filled / ONE blue control: `Enter the recommended reading →` (routes to the hiring lens) + a mono route sub-label previewing the path |
| 4 | **Reading Rack** | `Or read as —` + the folding lens cards (client / collaborator / academic / full). Subordinate. |
| 5 | Footer row | `Compose inquiry →` (conversion) + `Built work lives elsewhere` (3 external links) |
| 6 | Footer line | `This is not a portfolio…` |

### The single-primary rule (load-bearing)
**Exactly one** element is filled and exactly one is `strata-blue`: the primary door.
Every other action (card `Enter this reading →`, Compose, work links) is outline /
ink-on-cream. This is what makes the highest-probability path unmissable. The
recommended lens (`hiring`) is promoted **out** of the rack into that door so a
decided reader never has to open a card.

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onEnter(value)` | `(string) => void` | internal `setLens` | applies the lens + exits 30s in place. App passes `enterReading`, which maps `hiring`→lens, `full`/unknown→full dossier. |
| `mailtoHref` | `string` | computed | Compose Inquiry mailto. App passes `CONVERSATION_MAILTO`. |
| `spear` / `support` / `forText` / `notForText` / `footer` | `string` | see `DEFAULTS` | editable copy |
| `recommended` | `string` | `'hiring'` | the lens the primary door routes to (promoted out of the rack) |
| `defaultOpen` | `string \| null` | `null` | which rack card is unfolded on load |

### Accessibility
- **Role**: container `role="region"` `aria-label="CT Dossier — 30 second read"`.
- **Primary door**: real `<button>`; `focus-visible` ring (`ring-strata-black`, offset on cream). White-on-blue label is `text-body-lg` **bold** → clears WCAG AA-large (≈3.6:1). (Pure `strata-cream` on blue would be 2.97:1 — fails; white + bold is the chosen, module-04-consistent treatment.)
- **Route sub-label** is decorative plain text — NOT a focus target.
- **Work links**: `target="_blank" rel="noopener noreferrer"`, underlined (not color-only).
- Reduced motion: `.rise` intro + fold transforms disabled via `FOLD_CSS` media query.

---

## 2. Reading Rack (folding Record Card)

### Description
The lens selector as folding **Record Cards** — the doctrine's "Folding the
Interface" applied to navigation. One sheet, two states; opening one folds any
other (single-open accordion); always reversible to all-folded.

### States
| State | Visual | Behavior |
|-------|--------|----------|
| **Folded** (default) | sans-bold title + mono descriptor + faint `▸` | header click / Enter / Space opens it |
| **Hover / focus** | 4% black wash + ink left-tick appears; title `secondary→primary`; chevron `muted→secondary` | color-only (matte), no lift/scale |
| **Unfolded** | reveals detail paragraph + `Path · Best if · Time` fields + outline `Enter this reading →`; chevron rotates 90° | opening another card folds this one |
| **Entered** | — | `Enter` sets `?read=<value>` (SPA) + exits 30s via `onEnter` |

### Anatomy of one card
- **Title** — `font-sans font-semibold` (title voice; NOT mono). This is the fix for "everything reads as metadata."
- **Descriptor** — `font-mono text-micro` (metadata voice), derived from the lens helper.
- **Chevron** — `▸`, rotates via `.lens-chev` on `[data-open="true"]`.
- **Panel** — height fold `grid-template-rows: 0fr→1fr` + a `rotateX(-7deg→0)` crease; `role="region"`, `aria-label`.
- **Enter** — outline button, **never** filled/blue (would break the single-primary rule).

### Data model (data-driven)
Cards are built from `AUDIENCES` (`constants.tsx`) — label / route / descriptor —
plus a synthetic `Full Dossier` card. The `recommended` lens is filtered out (it's
the door). No hand-maintained card list.

```js
{ label: 'Client', value: 'client',
  desc: 'taste · systems · doctrine · built work',
  detail: '…', fields: [['Path','00 → 01 → 03 → 05 → 07'], ['Best if','…'], ['Time','~6 min']] }
```

### Accessibility
- Header `<button>` carries `aria-expanded` (reflects open) + `aria-controls` → panel `id`.
- Enter/Space toggles; the `Enter this reading` button is **separately tabbable**
  (inspect ≠ commit).
- All-folded neutral state reachable from anywhere (no trap).
- `prefers-reduced-motion`: fold transform + crease disabled (height still resolves).

---

## 3. Design tokens used

| Element | Token(s) |
|---------|----------|
| Masthead / footer / kicker labels | `font-mono text-micro uppercase tracking-ultra text-strata-black opacity-subtle` |
| Spear H1 | `font-sans font-black tracking-tightest text-heading md:text-display lg:text-hero` |
| Support | `font-sans text-body-lg opacity-tertiary` |
| For / Not tick words | `font-mono text-micro uppercase tracking-ultra text-strata-clay` ← clay's ONLY job |
| For / Not clauses | `font-sans text-caption opacity-tertiary` |
| **Primary door** | `bg-strata-blue text-white font-bold text-body-lg` (hover `bg-strata-black`) |
| Route sub-label / rack label / field keys | `font-mono text-micro uppercase tracking-wider opacity-muted` |
| Card title | `font-sans font-semibold text-caption tracking-tight opacity-secondary` |
| Card descriptor | `font-mono text-micro uppercase tracking-wider opacity-muted` |
| Card detail | `font-sans text-caption opacity-tertiary` |
| Card Enter (outline) / links | `border-strata-black/40 … hover:bg-strata-black hover:text-strata-cream` |
| Dividers | `border-strata-black opacity-ghost` / `border-strata-black/10` |
| Hover wash | `bg-strata-black/5` |

New token added for this work: `fontSize.hero = 54px` (the top of the type ramp).

---

## 4. Doctrine guardrails (invariants — do not break)
- **strata-blue monopoly**: the door is the only fill and only blue. If any card
  Enter or link ever gets a fill/blue, the single-primary rule breaks.
- **strata-clay earns one job**: the For/Not tick words. Nowhere else.
- **Matte only**: affordance = 4% wash + ink hairline. Never shadow/glow/scale/gradient.
- **Mono vs Inter discipline**: titles/actions in Inter, all metadata in mono. No half-and-half.
- **No green**: the `#42FC04` lime from the Field-Position SVG is out of scope here.
- **Fold integrity**: accordion `aria`, single-open, reversibility, reduced-motion
  are non-removable doctrine proof. Restructure layout/tokens, not fold mechanics.

## 5. Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| Keep exactly one filled/blue action | Add a second filled CTA or a blue tint elsewhere |
| Build cards from `AUDIENCES` | Hand-maintain a parallel lens list |
| Use named tokens (`opacity-*`, `text-*` scale) | Reach for raw `text-black/NN`, `text-white`, arbitrary sizes |
| Let work be a footnote link-out | Build a work/portfolio grid on this screen |
| Promote the recommended lens into the door | Bury the recommended path inside a folded card |

## 6. Analytics
| Event | When | Property |
|-------|------|----------|
| `lens_view` | 30s renders | `read: "30s"` |
| `lens_unfold` | a card unfolds | `lens` |
| `lens_selected` | a door/Enter fires | `from: "30s"`, `to: <value>` |
| `cta_click_compose` | Compose clicked | `read: "30s"` |

No-ops unless `window.va` (Vercel Analytics) or `window.plausible` is present.
