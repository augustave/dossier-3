# PRD — Field Position Chart

**Parent:** `HANDOFF.md`
**Doc version:** 1.0
**Status:** Shipped to source (pending commit + push)
**Scope:** A 2-axis SVG positioning chart inside Module 02 CREATIVE TECHNOLOGIST, with 14 named designers from Doc 2 plotted, and a highlighted dot proposing Ven's position.

---

## 1. Why this exists

The dossier's polymath claim is mostly textual: "I think this way, I work this way, I'd recruit these three." A recruiter scanning under time pressure has to take the claim on faith. The field-position chart collapses that claim into a coordinate — a verifiable position relative to known designers in the field.

Source for the axes and the plotted designers: `Designers-2-Graph.md` (uploaded by owner). Source for "why this matters as polymath positioning": `Poly-1Graph.md`, which specifies that polymath portfolios require outcome-first narrative and faceted navigation for hiring-manager skimming.

---

## 2. Placement decision (war-gamed)

Considered placements and what happens to a Palantir Visual Designer (Defense) recruiter, 7 minutes, filtered to the `Hiring Manager` audience (modules 01 → 02 → 05):

| Option | Does the recruiter see the chart? | Verdict |
|---|---|---|
| A — Fold into Module 04 WORLD MODEL | No — 04 is filtered out for Hiring Manager. | Fail. |
| B — New standalone Module 07 | Only if added to Hiring Manager curation. Arrives after Portfolios; too late. | Fail. |
| C — Top hero, always visible | Yes, but before the recruiter knows who the plotted designers are. Reads as philosophy. | Fail. |
| **D — Inside Module 02 CREATIVE TECHNOLOGIST, at the end** | **Yes — appears right when the recruiter is judging "is this a real discipline."** | **Winner.** |

Module 02's job for a Hiring Manager is to validate that "creative technologist" is a real discipline, not a self-applied label. The chart turns the discipline name into a coordinate the recruiter can verify in seconds. Optimal moment in the seven-minute read.

---

## 3. Axes & data model

### Axes (Doc 2)

- **X horizontal:** `CRAFT` (left) ↔ `AI` (right). Where does your output leverage come from? Hand-craft vs. agent/AI orchestration.
- **Y vertical:** `VELOCITY` (top) ↔ `PERMANENCE` (bottom). What are you optimizing for? Fast output cycles vs. lasting/durable systems.

Both axes are 0–100 scales. The plot area renders the four quadrants without explicit labels — readers infer them from axis endpoints.

### Designer placements

14 designers from Doc 2. Each has `{ name, x, y }` in `copy.v1_1.ts` under `modules["01"].fieldPositionDesigners`. Placements (doctrine-locked):

| Name | x (0=Craft, 100=AI) | y (0=Velocity, 100=Permanence) |
|---|---|---|
| Tarka | 5 | 90 |
| Van Schneider | 10 | 85 |
| Campdera | 15 | 80 |
| Varley | 30 | 25 |
| Mans | 40 | 50 |
| Akdağ | 50 | 45 |
| Cardona | 55 | 52 |
| Brucker | 65 | 30 |
| Dannaway | 70 | 55 |
| Verma | 72 | 62 |
| Zada | 80 | 20 |
| Meyer | 85 | 15 |
| Flynn | 90 | 10 |
| Haas | 95 | 14 |

### Ven position

`{ x: 62, y: 70, label: "VEN", sub: "Doctrine + agent orchestration" }`. Bottom-right quadrant. AI-leveraged + permanence-oriented — the sparse corner.

---

## 4. Visual register

- The chart sits on the dossier's blue strata theme (Module 02 = `themeColor: 'blue'` → white text on `bg-strata-blue`).
- Background panel: `bg-black/20` with `border-white/10` — a recessed mat that gives the chart its own surface inside the module.
- Plot border: dashed `currentColor` at 0.3 opacity.
- Axis cross: solid `currentColor` at 0.4 opacity.
- Designer dots: 3px filled `currentColor` at 0.7 opacity; label 10px mono, same opacity.
- **Ven dot:** 7px filled `#E5FF00` (chartreuse), with an 11px dashed ring. Label 11px mono, weight 500, in `#E5FF00`. Sub-label 9px mono with letter-spacing.
- Chartreuse is the dossier's "live signal / active emphasis / operative element" color per `BRAND_CANONICAL_BRIEF.md`. Used here as functional reticle, not decoration.
- Legend strip at bottom: muted "Doc 2 designers" + bright "VEN" marker.

### Why not Tailwind classes for the SVG

The plotted designers are rendered as inline SVG `<text>` elements. Tailwind doesn't reach into SVG attributes — using `currentColor` + opacity attributes is the cleanest way to inherit the parent strata theme color (white) without a config change. Future themes that change Module 02's text color will propagate automatically.

---

## 5. File changes

| File | What changed |
|---|---|
| `Founder/copy.v1_1.ts` | New keys on `modules["01"]`: `fieldPositionTitle`, `fieldPositionAbove`, `fieldPositionBelow`, `fieldPositionAxes`, `fieldPositionDesigners[]`, `fieldPositionVen`. |
| `Founder/constants.tsx` | New block at the end of Module 02 (THESIS) `responseDisplay`: heading + serif frame line above the chart, recessed panel containing inline SVG, mono uppercase footnote below. The SVG iterates over the designers array and computes screen positions from `(x, y)` pairs. |

No changes to `App.tsx`, `App.test.tsx`, `types.ts`, `ManifestOverlay.tsx`.

---

## 6. Acceptance criteria

From `Founder/`:

```bash
npx tsc --noEmit
npm test -- --run     # 19/19 still pass; no new tests added
npm run build         # ~254 kB JS / 28 kB CSS (+4 kB JS vs. prior build)
```

Manual checks via `npm run dev`:

1. Open `/`, click "HIRING MANAGER" pill. Module 02 is visible.
2. Scroll to the end of Module 02. The chart renders below the body copy.
3. Verify 14 muted designer dots + 1 chartreuse Ven dot in the bottom-right quadrant.
4. Verify axis labels read CRAFT / AI / VELOCITY / PERMANENCE.
5. Verify the legend strip at the bottom shows "Doc 2 designers" and "VEN" markers.
6. Resize the browser narrow — SVG should scale via `viewBox` + `w-full h-auto`.
7. Test in dark mode (if the dossier ever gains one): `currentColor` and opacities should adapt; only `#E5FF00` is hardcoded.

---

## 7. Decisions locked

- Placement: **end of Module 02 CREATIVE TECHNOLOGIST.** Not in Module 04 World Model (filtered out for Hiring Manager). Not in top hero (philosophy-first, wrong ordering for a recruiter). Not a new standalone module (reindexing overhead, arrives too late in the read).
- Ven is highlighted in **chartreuse `#E5FF00`** per `BRAND_CANONICAL_BRIEF.md` color governance for "operative element."
- Designer placements are doctrine-locked; future edits go through the owner.
- Axes are the two oppositions explicitly drawn in `Designers-2-Graph.md` (Brand:Velocity vs. Brand:Permanence collapses into the same Velocity/Permanence axis used here).

---

## 8. Out of scope

- Hover or click interactions on designer dots. Static render only.
- A diagram for the third opposition from Doc 2 (`Design:System_Architecture` as orthogonal). Treated as latent context, not a third axis.
- Dynamic reposition / "place yourself" interactive variant. Possible follow-up.
- Putting the chart on `defense.observer` or any of the three external portfolios. The chart is dossier-only.
