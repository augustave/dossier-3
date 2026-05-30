# PRD — Faceted Audience Entry

**Parent:** `HANDOFF.md`
**Doc version:** 1.0
**Status:** Shipped to source (pending commit + push)
**Scope:** Top-hero audience filter on `App.tsx`. URL state sync. Module-list collapse to a curated 3-of-6 subset when an audience is active.

---

## 1. Why

The dossier targets multiple readers with different needs:

- **Hiring manager** wants outcome-first proof in 30 minutes.
- **Client** wants to know what to commission and how the work runs.
- **Collaborator** wants to know how the practice thinks and where to bolt in.
- **Academic** wants intellectual position and method.

Without a filter, every reader gets all six modules in the same order, optimized for none of them. The faceted entry implements three concepts from the polymath-portfolio source documents:

- **Skimmability** (`Concept:Skimmability` in `Poly-1Graph.md`) — reduce a long page to the 3 sections that matter for the reader.
- **Outcome-first narrative** (`Concept:OutcomeFirstNarrative`) — Hiring Manager reads top-down with the outcome up front.
- **Faceted navigation** (`Concept:FacetedNavigation`) — the polymath portfolio's three-layer architecture supports a Collaborator audience that benefits from facets.

---

## 2. War-gamed curation

Each audience surfaces exactly 3 modules, ordered by "start with" priority. Mapping below was stress-tested by walking through a representative real-world reader for each audience:

| Audience | Modules surfaced | Reasoning |
|---|---|---|
| **HIRING MANAGER** | `01 Role fit` → `02 Creative technologist` → `05 Portfolios` | Hiring signals → discipline framing (carries the field-position chart) → proof of execution. |
| **CLIENT** | `01 Role fit` → `03 Operating method` → `05 Portfolios` | What can I commission → how does this person work (carries the doctrine-in-motion explorer) → show me past work. Drops `06 Role matrix` (clients don't need a designer-archetype simulator before a kickoff call). |
| **COLLABORATOR** | `02 Creative technologist` → `04 World model` → `03 Operating method` | Where they sit (chart) → how they think (picks + loop) → how they work (explorer). War-game v2 swap: dropped `06 Role matrix` in favor of `02` so collaborators finally see the field-position chart. |
| **ACADEMIC** | `04 World model` → `02 Creative technologist` → `03 Operating method` | Deepest thinking layer → practice thesis as discipline claim (carries the chart) → method (carries the explorer). Drops `01 Role fit` (academics don't read for employability). |

### Curation revision log

- **v1 (original):** hiring `01/02/05`, client `01/03/05`, collab `04/03/06`, acad `04/02/01`.
- **v2 (war-game restructure):** Collaborator changed to `02/04/03` — drops `06 Role matrix`, adds `02 Creative technologist` so collaborators see the field-position chart. Reasoning: the chart answers "where do you sit relative to me," which is the primary collaboration question. The Role matrix archetype probe is closer to a hiring tool than a collaboration tool. Academic was already finalized as `04/02/03` in v1 update.

When no audience is selected, all 6 modules render in index order — the "normal configuration."

---

## 3. UX spec

### Default (no audience selected)

- All 6 module strata render.
- All 4 audience pills inactive (outline border, transparent fill).
- No "Show all" reset button.

### Audience selected

- Active pill: filled (`bg-black text-white`).
- Module list collapses to that audience's 3 modules, in the audience's preferred order.
- "Show all ✕" reset button appears at the right end of the pill row.

### Interactions

- Click an inactive pill → activates it, filters modules, writes `?read={id}` to URL via `history.replaceState`.
- Click the active pill → toggles off, restores all modules, removes `?read=` from URL.
- Click "Show all ✕" → clears state same as toggling off.
- Page load with `?read=hiring|client|collab|acad` in URL → that pill starts active.
- Page load with invalid or missing `?read=` → default config.

### Register

- "READING AS" label: small mono uppercase, `opacity-50`.
- Pills: `font-mono text-xs uppercase tracking-widest border border-black px-3 py-1` (matches `INDEX (00)` and `REQUEST CONVERSATION` buttons exactly).
- Active pill: `bg-black text-white` (no border change — the fill is the signal).
- Hover (inactive): `hover:bg-black hover:text-white` (same transition the existing buttons use).
- "Show all" reset: `opacity-50 hover:opacity-100` with `ml-auto` to push it to the right end.

### Accessibility

- `role="group"` + `aria-label="Reader audience filter"` on the pill container.
- `aria-pressed={isActive}` on each pill (lets screen readers announce state).
- `aria-label="Show all modules"` on the reset button.

---

## 4. File changes (already applied)

| File | What changed |
|---|---|
| `Founder/App.tsx` | Added `useMemo` import. New module-level: `AudienceId` type, `Audience` interface, `AUDIENCES` array, `AUDIENCE_IDS`, `isAudienceId` type guard. New component state: `selectedAudience`. New effects: read `?read=` on mount. New handlers: `writeAudienceToUrl`, `handleAudience`, `clearAudience`. New `useMemo`: `visibleModules` filters and re-orders `RENDERED_MODULES` when an audience is selected. New UI block: pill row + "Show all" reset, sits between the "this is not a portfolio" paragraph and the Target Roles block. Render loop now iterates `visibleModules` instead of `RENDERED_MODULES`. |
| `Founder/App.test.tsx` | (Next step — see §6.) |

No other files changed. `copy.v1_1.ts`, `constants.tsx`, `types.ts`, `ManifestOverlay.tsx` are untouched by this PRD.

---

## 5. Acceptance criteria

From `Founder/`:

```bash
npx tsc --noEmit          # must pass clean
npm test -- --run         # tests pass (15 pre-existing + 4 new = 19)
npm run build             # builds clean; expected ~250 kB JS / 28 kB CSS
```

Manual checks via `npm run dev`:

1. Open `/` — pills inactive, all 6 modules visible.
2. Click "HIRING MANAGER" — pill highlights, only modules 01 / 02 / 05 render. URL becomes `/?read=hiring`. "Show all ✕" appears.
3. Click "HIRING MANAGER" again — pill clears, all 6 modules return. URL drops the `?read=`.
4. Open `/?read=academic` directly — pill starts active, modules 04 / 02 / 03 visible.
5. Open `/?read=garbage` — invalid id is ignored; default config.

---

## 6. Tests added (App.test.tsx)

Four tests in a new `describe('Faceted audience entry', …)` block:

| # | Test | Assertion |
|---|---|---|
| 1 | reads `?read=hiring` on mount | Pill is `aria-pressed="true"`; only modules 01 / 02 / 05 render. |
| 2 | clicking a pill writes URL + filters | After click, `window.location.search` contains `read=client`; modules 01 / 03 / 05 render, 02 / 04 / 06 absent. |
| 3 | clicking active pill clears state | Pill returns to `aria-pressed="false"`; all 6 modules return; URL drops `read=`. |
| 4 | "Show all" button clears state | After click, all 6 modules return; URL clean. |

---

## 7. Decisions locked (do not re-litigate)

- Pills are mono uppercase, matching the existing button register. Not lowercase, not bold-sans.
- "Aggressive" filter behavior: non-curated modules **collapse**, not just dim. Confirmed by owner.
- No editorial frame line per audience. The pill label is the only visible state, plus the module list change. Confirmed by owner.
- Default state ("normal configuration") shows all 6, no audience active. Confirmed by owner.
- URL state via `?read=` (not hash, not localStorage) — shareable, bookmark-able, no persistence across cold loads without intent.

---

## 8. Out of scope

- Persisting audience selection across tabs / cold reloads beyond URL state.
- Analytics on which audience gets selected most.
- Animation on filter transitions (intentional — keeps the "no theatrics" posture).
- The two-axis positioning diagram and the visual demonstration surface are **separate** ideas from the same session; track them in `HANDOFF.md §5` open follow-ups.
