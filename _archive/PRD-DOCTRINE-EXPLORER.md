# PRD — Doctrine in Motion Explorer

**Parent:** `HANDOFF.md`
**Doc version:** 1.0
**Status:** Shipped to source (pending commit + push)
**Scope:** A 3-tab interactive register explorer at the end of Module 02 CREATIVE TECHNOLOGIST, immediately after the field position chart. Demonstrates the rule-making practice — palette, thesis, iron rule — without surfacing a named project.

---

## 1. Why this exists

The field position chart (`PRD-FIELD-POSITION.md`) makes a claim by coordinate: AI-leveraged + permanence-oriented, in the sparse quadrant. That's the *position*. This explorer is the *operational output* of holding that position — codified register systems that produce consistent artifacts across domains.

Source pattern: polymath portfolio exemplars from `Poly-1Graph.md` (Bruno Simon, Lynn Fisher, GMUNK, Casey Reas) all carry one element that *shows* the discipline in motion rather than describing it. The dossier needs the same.

The explorer's specific job: collapse "this person codifies rule-systems" into a clickable demonstration that takes < 10 seconds for a recruiter to grasp.

---

## 2. Placement decision (v2 — post war-game)

End of Module 03 (OPERATING METHOD), after the existing PRIMARY TENSION / COUNTER-BALANCE grid and the closing italic line. Module 03 is in the Client, Collaborator, and Academic audiences — the explorer now reaches three of four audiences.

The narrative arc of Module 03 now reads:

```
hero  →  body  →  default bias (bullets)  →  tension/counter-balance  →  close  →  doctrine in motion (operational output)
```

Each element answers a different question:
- Hero / body / bullets: *how do I work?*
- Tension grid: *what's the failure mode and the corrective?*
- Close: *one-line summary.*
- Explorer: *what does the method actually produce?*

### Placement v1 (Module 02) — rejected after war-game

Originally lived at the end of Module 02 (Creative Technologist), immediately after the field position chart. v1 narrative was:

```
hero → body → field position chart → doctrine in motion
```

Both the chart and the explorer in Module 02 worked great for Hiring Manager and Academic. But the v2 site-wide war-game showed two failures:

1. **Client and Collaborator never saw the explorer** (Module 02 was filtered out of their reads). The explorer is the most direct "preview of what you'd commission" for clients — a high-cost miss.
2. **Module 02 grew too long** — hero + body + chart + explorer = the longest module on the page. Mobile scroll suffered.

### Why Module 03 is the right home

- **Operating Method is the explorer's true conceptual home** — it literally shows the operational output of the method described in the module body.
- **Visible to Client, Collaborator, Academic** (three of four audiences). Hiring Manager loses the explorer in exchange — acceptable trade because the chart in Module 02 still arrives at the right moment for their judgment cycle.
- **Module 02 reverts to a tighter shape** (hero + body + chart), which is easier to scan on mobile.

Other placements considered and rejected:

| Rejected option | Why |
|---|---|
| Module 05 PORTFOLIOS | Should stay a fast skim (just three site tiles). Explorer adds friction at the exit. |
| Top hero, always visible | Reads as "this is a project demo." Wrong before the practice thesis is established. |
| Duplicate across Modules 02 and 03 | Same component in two modules creates visual repetition and dilutes each instance. |

---

## 3. Data model

Three registers in `copy.v1_1.ts` under `modules["01"].registers`. Each is `{ code, name, domain, palette[3], thesis, ironRule }`. Palette entries have `{ name, hex, accent }` — exactly one accent per palette.

| Code | Register | Domain | Accent |
|---|---|---|---|
| CW | Coldwater Pragmatism | Maritime | Safety orange `#FF4F00` |
| RB | Rustbelt Kinetic | Industrial | MIG arc-blue `#7AB5FF` |
| AN | Anechoic Minimal | Spectrum | P31 phosphor `#3CFF7A` |

Source: `DESIGN SYSTEM/THEATHER/README.md` (SEAL palettes). The explorer is intentionally framed as the *pattern* of the practice, not the SEAL artifact. Recruiters who don't know SEAL see "this person codifies rule-systems"; people who know SEAL recognize the source. SEAL itself lives on `defense.observer` and is not named in the dossier surface.

Footnote: *"Three of N canonical registers. Different domains, same engineering."* — leaves N ambiguous to avoid pinning the explorer to a specific project's palette count.

---

## 4. Component spec

**File:** `Founder/components/DoctrineExplorer.tsx`
**State:** `useState<string>` for the active tab code.
**Render:**

- **Tab row** at the top — three buttons, equal-width, `font-mono uppercase tracking-widest`, divided by 0.5px white borders. Active tab: `bg-white/10 text-white`. Inactive: `text-white/60 hover:bg-white/5`.
- **Panel** below — `p-5 md:p-6`, content swaps on tab click.
  - Register name (small mono uppercase, muted)
  - **3 swatches** in a `grid-cols-3` row — 14px tall colored block + name (mono micro) + hex (mono micro) + small "ACCENT" badge if `accent: true`
  - **Thesis** — serif italic, large (text-lg / text-xl)
  - **Iron rule** — left-border accent block, mono "Iron Rule" label, sans body

**Accessibility:** `role="tablist"` on the tab row, `role="tab" + aria-selected` on each button, `role="tabpanel"` on the content area. `data-testid="doctrine-panel-{CODE}"` for test queries. Each swatch has an `aria-label` reading its name and hex.

**Click safety:** each tab button calls `event.stopPropagation()` to prevent the click from bubbling to the parent `ModuleStrata` and collapsing the module.

---

## 5. Visual register

Sits on Module 02's blue strata theme. Background panel `bg-black/20 border border-white/10` — same recessed mat used by the field position chart, for visual cohesion. Tab register matches the existing button conventions (mono uppercase, no glass, no rounded corners). Swatches are flat color blocks with a 0.5px border-white/20 to preserve edges against the strata background.

The accent badge on each palette swatch makes the "one protected accent per palette" iron rule visually demonstrable — the chartreuse for VEN on the field position chart was the same "operative element" convention; the explorer reinforces it.

---

## 6. File changes

| File | Change |
|---|---|
| `Founder/copy.v1_1.ts` | Six keys live on `modules["03"]`: `doctrineExplorerTitle`, `doctrineExplorerHero`, `doctrineExplorerFootnote`, and the `registers[]` array (3 entries). (Moved from `modules["01"]` in v2 restructure.) |
| `Founder/components/DoctrineExplorer.tsx` | Stateful component file. Exports `DoctrineExplorer`, `DoctrineRegister`, `PaletteSwatch`. Unchanged from v1. |
| `Founder/constants.tsx` | Imports `DoctrineExplorer`. Render block at end of Module 03 (MODEL) responseDisplay, after the close italic line. (Removed from Module 02 in v2 restructure.) |
| `Founder/App.test.tsx` | `describe('Doctrine in motion explorer (Module 03)', …)` block with one test verifying default render + tab swap. Test opens `#module-03` before render. |

No changes to `App.tsx`, `types.ts`, `ManifestOverlay.tsx`.

---

## 7. Acceptance criteria

From `Founder/`:

```bash
npx tsc --noEmit
npm test -- --run     # 20/20 pass (19 prior + 1 new)
npm run build         # ~258 kB JS / 28 kB CSS (+4 kB JS vs. prior)
```

Manual checks via `npm run dev`:

1. Open `/?read=hiring`. Module 02 is visible.
2. Scroll to end of Module 02. The explorer renders below the chart, with `CW · Maritime` selected by default.
3. Click `RB · Industrial`. Swatches change to green / iron / blue, thesis swaps to *"The prototype is the brochure…"*, iron rule swaps.
4. Click `AN · Spectrum`. Swatches change to black / silver / phosphor green, thesis swaps to *"Spectrum is terrain…"*.
5. Verify the active tab has `aria-selected="true"` (DOM inspector).
6. Verify clicking the tab does NOT collapse the surrounding Module 02 strata (event-bubble guard works).
7. Mobile widths: swatches stay readable; tabs may need horizontal scroll below ~360px (acceptable).

---

## 8. Decisions locked

- **Three registers, not five.** The full SEAL set has five (CW / RB / AN / DP / AH). The explorer ships three to keep the visual footprint compact and the demonstration legible. The footnote (*"Three of N…"*) leaves room without committing.
- **No project name surfaced.** SEAL is the source but never named in copy or UI. The explorer demonstrates the pattern; the project lives on defense.observer.
- **Stateful component, not URL-synced.** Tab state is local. URL params are reserved for audience filtering (`?read=`). Adding a second URL param schema would clutter shareable links.
- **No animation on tab swap.** Doctrine register; instant transitions only. Matches `BRAND_CANONICAL_BRIEF.md` "Anti-glint is doctrine" posture.

---

## 9. Out of scope

- A 4th or 5th register (Desert Pragmatism, Apex Heraldic). Add later if needed; the data model supports it without rework.
- Hover-only behavior on tabs (preview the panel before committing). Adds complexity for marginal benefit.
- Linking each register to its full source on `defense.observer`. The explorer is a demonstration, not a router.
- An "iron rules" sub-mode that shows all eight rules at once. Possible follow-up but outside the recruiter's scan window.
