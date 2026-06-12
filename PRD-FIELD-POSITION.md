# PRD — Field Position Chart

**Parent:** `HANDOFF.md`
**Doc version:** 1.1 (amendment of 2026-06-07 — see §9 changelog; deltas owner-approved via `PRD-IAA-INTEGRATION.md` §8 and war-gamed via its §6)
**Status:** v1.0 shipped to source; v1.1 deltas approved, pending implementation
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

### Axes (Doc 2, pole labels amended v1.1)

- **X horizontal:** `CRAFT-NATIVE` (left) ↔ `AI-NATIVE` (right). *Method:* where does output leverage come from — hand-craft vs. agent/AI orchestration. (v1.0 labels `CRAFT`/`AI` framed the AI position as abandoning craft; contradicted the practice thesis.)
- **Y vertical:** `EPHEMERAL` (top) ↔ `DURABLE` (bottom). *Output:* what the work is optimized to be — fast disposable cycles vs. lasting systems. (v1.0 labels `VELOCITY`/`PERMANENCE` read Ven's position as "slow"; durability is an output property, not a speed trade.)

Both axes remain 0–100 scales; all 14 designer coordinates unchanged. **v1.1 adds explicit quadrant labels** (low-opacity, mono, naming work-modes — not the plotted people):

| Quadrant | Label |
|---|---|
| Top-left (craft-native, ephemeral) | `TREND CRAFT` |
| Top-right (AI-native, ephemeral) | `FAST & DISPOSABLE` |
| Bottom-left (craft-native, durable) | `LEGACY CRAFT` |
| Bottom-right (AI-native, durable) — owned | `DOCTRINE-LED AI` (chartreuse) |

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

**v1.1:** `{ x: 72, y: 78, label: "VEN", sub: "Doctrine + agent orchestration" }`. Deeper into the owned bottom-right corner, out of the Cardona/Dannaway/Verma fringe. Reposition from v1.0 `x62/y70` explicitly approved by owner 2026-06-07 (placements are doctrine-locked; the lock re-applies at the new coordinate). v1.1 also adds an **owned-zone treatment** on the bottom-right quadrant: faint chartreuse wash + dashed chartreuse boundary at low opacity — the footer asserts sparseness, the plot now shows it.

---

## 4. Visual register

- The chart sits on the dossier's blue strata theme (Module 02 = `themeColor: 'blue'` → white text on `bg-strata-blue`).
- Background panel: `bg-black/20` with `border-white/10` — a recessed mat that gives the chart its own surface inside the module.
- Plot border: dashed `currentColor` at 0.3 opacity.
- Axis cross: solid `currentColor` at 0.4 opacity.
- Designer dots: 3px filled `currentColor` at 0.7 opacity; label 10px mono, same opacity.
- **Ven dot:** 7px filled `#E5FF00` (chartreuse), with an 11px dashed ring. Label 11px mono, weight 500, in `#E5FF00`. Sub-label 9px mono with letter-spacing.
- Chartreuse is the dossier's "live signal / active emphasis / operative element" color per `BRAND_CANONICAL_BRIEF.md`. Used here as functional reticle, not decoration.
- **v1.1 owned zone (tightened post-QA):** a `#E5FF00` wash at ~7% opacity + dashed boundary at ~40% over VEN's pocket only — SVG `rect x=420 y=360 w=180 h=140`, the deep durable/AI-native corner *below* the locked Cardona/Dannaway/Verma band. Visual QA (2026-06-07) showed a full-quadrant wash (x340/y280/260×220) enclosed three locked peers, contradicting the "sparse quadrant" claim; scoping the wash to VEN's pocket makes the claim literally true without moving any doctrine-locked dot. Quadrant labels: 10px mono uppercase, `currentColor` at ~0.3 opacity; owned label `DOCTRINE-LED AI` in `#E5FF00` at ~0.85, anchored bottom-right.
- Legend strip at bottom (v1.1): muted **"peer designers"** + bright "VEN" marker. (v1.0 read "Doc 2 designers" — internally correct citation, but parsed as a typo by outside visitors; the Doc 2 citation lives in this PRD instead.)
- **Footer caption (v1.1):** `fieldPositionBelow` becomes "AI-native, built to last — a sparse quadrant by design." (aligns with new pole names).

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
4. Verify axis labels read CRAFT-NATIVE / AI-NATIVE / EPHEMERAL / DURABLE (v1.1).
5. Verify the legend strip at the bottom shows "peer designers" and "VEN" markers (v1.1), four quadrant labels render, and the bottom-right quadrant carries the chartreuse owned-zone wash.
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

---

## 9. Changelog

**v1.1 — 2026-06-07.** Owner-approved deltas (decision record: `PRD-IAA-INTEGRATION.md` §8; war-game: its §6, Hiring Manager persona PASS with improved time-to-claim):
- Axis pole relabels: `CRAFT`→`CRAFT-NATIVE`, `AI`→`AI-NATIVE`, `VELOCITY`→`EPHEMERAL`, `PERMANENCE`→`DURABLE`. Coordinates and 14 peer placements unchanged.
- Four explicit quadrant labels added; owned quadrant `DOCTRINE-LED AI` in chartreuse.
- Owned-zone wash + dashed boundary — scoped to VEN's pocket (`rect 420/360/180/140`) after visual QA, not the full quadrant, so the shaded zone holds only VEN.
- Ven reposition `x62/y70` → `x72/y78` (doctrine-lock amendment, owner-signed).
- Legend `"Doc 2 designers"` → `"peer designers"`.
- Footer caption → "AI-native, built to last — a sparse quadrant by design."
- Reference mock: `PROFILE /IAA - Field Position (revised mock).svg` (direction only; implementation uses site tokens).
