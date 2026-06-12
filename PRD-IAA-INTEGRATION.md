# PRD — IAA Integration (Substance, Not Voice)

**Parent:** `HANDOFF.md`
**Doc version:** 1.2
**Status:** Approved by owner + war-gamed 2026-06-07. Verdicts: SHIP 4.1 / 4.2 / 4.4 · CUT 4.3 (The Fold stays off-dossier). Next: amend PRD-FIELD-POSITION to v1.1, then implement (§7 order). No code touched.
**Scope:** Inject the audience-invariant substance of the IAA brand architecture (PROFILE folder, 2026-06-06) into the dossier, translated into copy doctrine v1.2.0. Amend `PRD-FIELD-POSITION.md` for the approved chart revision. Keep all lens-specific IAA material off-dossier.

---

## 1. Why this exists

The IAA pipeline produced a three-lens brand architecture (creative-director / American Dynamism / frontier-AI), four named frameworks, and a four-figure diagram suite ("How I Think"). The owner asked whether the dossier should carry the generic version or the frontier-AI version.

Decision: **neither, wholesale.** Three structural facts force it:

1. The dossier's audience faceting is by *relationship* (Hiring Manager / Client / Collaborator / Academic), not by *market*. Neither IAA lens maps onto the existing switching axis.
2. Copy doctrine v1.2.0 is binding: plainspoken, no first-person pronoun, **no frameworks-as-nouns**, no project name-drops. The IAA's named frameworks and the frontier manifesto's register both violate it.
3. The 2026-05-29 restructure made the dossier lens-neutral by design (casework archived; defense is one external lane of three).

So: the dossier receives IAA *substance* in the dossier's own voice. The lens-specific versions are outreach artifacts (bios, manifestos, decks, per-lane sites) where the audience is known.

### Decision record

| Option | What happens | Verdict |
|---|---|---|
| A — Port generic (creative-director) voice | Blandest of the three voices; redundant with existing v1.2.0 copy; still imports framework-nouns | Fail |
| B — Port frontier-AI voice | "Non-human intelligence" poetics violates plainspoken rule; lens mismatch with relationship-based faceting | Fail |
| C — Add market-lens switching to faceting | Doubles the curation matrix (4 relationships × 3 markets); contradicts one-voice doctrine | Fail (revisit only with evidence of need) |
| **D — Invariant substance, translated to v1.2.0 voice; lenses live off-dossier** | Four small insertions, zero doctrine violations | **Winner** |

---

## 2. What the IAA adds that the surface currently lacks

Gap analysis against the live module sequence (00 MANIFEST → 01 ROLE FIT → 02 CREATIVE TECHNOLOGIST → 03 OPERATING METHOD → 04 WORLD MODEL → 05 PORTFOLIOS → 06 ROLE MATRIX):

1. **The under-pressure claim (biggest gap).** Module 03 establishes fast + evidence-over-claims but never states the strongest differentiator the IAA surfaced: the work gets *more* analytical when things break. No current module says it.
2. **A load-bearing thesis line.** "Taste with a load rating" passes all v1.2.0 rules and compresses the whole positioning; the current hero ("Complex technical work, made easy to look at — and easy to trust") is good but trust-flavored, not stress-flavored.
3. **One diagram, not four.** The Fold (cusp model) gives the under-pressure claim a visual coordinate, exactly as the field chart gave the polymath claim one. The other three FIGs stay off-dossier: OODA partially duplicates the World Model's Coherence→Influence→Ship loop, and the surface already carries four visuals (field chart, doctrine explorer, world model, role matrix). A fifth is the ceiling; a seventh is model-soup.
4. **The approved field-chart revision** (separate amendment, §5).

---

## 3. Voice compliance gate

Every insertion must pass all five checks before commit:

- [ ] No first-person pronoun
- [ ] No framework-as-noun (banned strings on surface: "Invariance Auditing", "Generative Discomfort", "Evidence Engine", "Anthropological Moodboarding", "Matte Doctrine", "IAA")
- [ ] No project name-drops
- [ ] Plainspoken — reads like a sharp person talking
- [ ] Claim points at something checkable (evidence over claims)

---

## 4. Insertion specs

### 4.1 Module 03 — DEFAULT BIAS bullet (the pressure claim)

Add ONE bullet to `modules["03"].bullets`. **DECIDED 2026-06-07: candidate (c).**

- (c) "Calm under load is a designed property, not a temperament. The worse the situation, the more deliberate the work." ← **selected**
- ~~(a) "When something breaks, the response is more analysis, not more noise. Pressure is treated as information."~~
- ~~(b) "Trouble doesn't change the method. When a launch wobbles, the work gets calmer and more precise — not louder."~~

Risk: low. One line, one key, no layout change.

### 4.2 Module 01 — thesis line placement

**DECIDED 2026-06-07: placement (A)** — standalone kicker under `modules["01"].hero`: **"Taste with a load rating."** Use once; nowhere else on the surface. (B) and (C) rejected.

### 4.3 Module 03 — The Fold plate (conditional; war-game first)

- **Source asset:** `PROFILE /IAA - The Fold (cusp model).svg` (and the simplified panel in `IAA - How I Think (suite).svg`).
- **Recast required:** strip the personal plate text; subject marker reads "OPERATING POINT — high load, calm by design" (third person). Render in module theme via `currentColor` + recessed mat (`bg-black/20`, `border-white/10`), matching the field chart's register — not the mock's paper palette.
- **Caption (draft):** "Low stakes are a smooth ramp: small change, small result. High stakes fold: the same inputs can produce opposite outcomes, and some failures have no way back. The job is staying on the upper sheet." Attribution line "after Zeeman–Thom" permitted (named source, not self-framework).
- **Placement candidate:** Module 03, after DEFAULT BIAS, before DOCTRINE IN MOTION.
- **WAR-GAME VERDICT 2026-06-07: CUT from the surface.** Killed by the Client persona (§6): (1) it is a model about the work, not evidence of work — self-violates the module's own "open and check" rule; (2) adds ~one screen of height that pushes DOCTRINE IN MOTION below the fold; (3) reads-as-performance risk for a time-pressed founder. The pressure bullet (4.1c) carries the claim. The plate remains an off-dossier artifact (decks, outreach, suite PDF).

### 4.4 Field Position chart revision — amendment to `PRD-FIELD-POSITION.md`

Approved direction mock: `PROFILE /IAA - Field Position (revised mock).svg` (mock palette approximates site tokens; implementation uses canonical strata-blue + `#E5FF00` chartreuse per `BRAND_CANONICAL_BRIEF.md`).

Delta (PRD-FIELD-POSITION v1.0 → v1.1):

| Item | Current | Proposed | Rationale |
|---|---|---|---|
| X poles | CRAFT ↔ AI | CRAFT-NATIVE ↔ AI-NATIVE (method) | Current framing implies AI position = abandoning craft; contradicts the practice thesis |
| Y poles | VELOCITY ↔ PERMANENCE | EPHEMERAL ↔ DURABLE (output) | Current framing reads VEN as "slow"; durability is an output property, not a speed trade |
| Quadrant labels | None (inferred) | Four low-opacity names; owned quadrant: "DOCTRINE-LED AI"; crowded AI corner: "FAST & DISPOSABLE" | Reframes the dense top-AI cluster as churn; makes the sparse quadrant legible in seconds |
| Owned zone | None | Faint chartreuse wash + dashed boundary on the durable-AI quadrant | The footer asserts sparseness; the plot should show it |
| VEN position | x62 / y70 (doctrine-locked) | x≈72 / y≈78 — **requires owner sign-off; placements are locked** | Moves VEN out of the Cardona/Dannaway/Verma fringe into visibly owned space |
| Legend | "Doc 2 designers" | "peer designers (Doc 2)" or "peer designers" | Internally correct citation; reads as a typo to anyone who doesn't know Doc 2 |
| Footer | unchanged (owner option: "AI-native, built to last — a sparse quadrant by design.") | Aligns caption with new pole names |

Peer dot positions: unchanged (doctrine-locked, no proposal to move).

---

## 5. Out of scope (explicit)

- Framework names anywhere on the surface (off-dossier IP only).
- FIG. 02 (Taste×Rigor), FIG. 03 (OODA), FIG. 04 (Cynefin) on the dossier.
- Any casework, archived-card restoration, or project naming.
- Market-lens switching in the faceted entry.
- Lens deployment plan (frontier-AI bios/manifesto → lab outreach; AD set → defense.observer orbit) — separate effort, separate doc.

---

## 6. War-game — RUN 2026-06-07 (verdicts recorded)

Curation verified from `App.tsx` `AUDIENCES`: hiring → 01/02/05 · client → 01/03/05 · collab → 02/04/03 · acad → 04/02/03. Note: the Client facet never sees the chart or kicker; the Hiring Manager never sees Module 03. Each insertion is judged only by personas who encounter it. Rule: a surface element ships only if it survives every persona who sees it.

| Persona (facet) | Sees | Kicker (4.2) | Bullet (4.1) | Chart rev (4.4) | Fold plate (4.3) |
|---|---|---|---|---|---|
| Defense-adjacent recruiter (hiring, 7 min) | 01·02·05 | PASS — 2s read, claim + coordinate adjacency | n/a | PASS — named quadrants cut time-to-claim to ~3s; new poles kill the "slow / anti-craft" misread | n/a |
| Seed-stage founder (client) | 01·03·05 | n/a | PASS — answers "will they melt when the demo breaks?" | n/a | **FAIL** — model-not-evidence (violates module's own "open and check" rule); pushes explorer below the fold; performance risk |
| Senior design-engineer (collab) | 02·04·03 | PASS — reads as confidence, not swagger | PASS | PASS — note: "FAST & DISPOSABLE" names a work-mode, not the plotted peers; low-opacity; acceptable | pass for this persona, but already killed by Client |
| Academic (acad) | 04·02·03 | PASS (arrives second; no stall) | PASS | PASS | not needed |

**Outcome:** SHIP 4.1 (bullet c), 4.2 (kicker, placement A), 4.4 (chart rev incl. VEN x≈72/y≈78). **CUT 4.3** (The Fold) from the surface permanently; off-dossier artifact only.

**Implementation caution:** copy keys ≠ module numbers. The kicker edits `modules["01"]` (copy), which renders as **Module 02 CREATIVE TECHNOLOGIST**; the bullet edits `modules["03"]`, which renders as Module 03. Verify against `constants.tsx` before editing.

---

## 7. Sequencing

1. Owner reviews this PRD → picks 4.1 candidate, 4.2 placement, approves/rejects 4.3, signs off on 4.4 deltas (incl. VEN reposition under lock).
2. Amend `PRD-FIELD-POSITION.md` to v1.1 (doc only).
3. War-game (§6); record verdicts in this doc.
4. Implement in order: 4.4 chart → 4.1 bullet → 4.2 thesis line → 4.3 plate (if it survived).
5. Tests: keep 19 green; add assertions for new axis labels, quadrant names, legend text; voice-lint grep for banned strings (§3).
6. Update `HANDOFF.md` doc index (add this PRD as Phase 5).

---

## 8. Owner decisions (resolved 2026-06-07)

1. **VEN reposition: APPROVED.** x≈72 / y≈78 under doctrine-lock amendment. Lock re-applies at the new coordinate after implementation.
2. **Quadrant names: APPROVED as drafted.** TREND CRAFT / FAST & DISPOSABLE / LEGACY CRAFT / DOCTRINE-LED AI (owned quadrant in chartreuse).
3. **The Fold: WAR-GAME-GATED.** Provisionally in Module 03; cut on visual fatigue at the Hiring Manager 7-minute read. Bullet (4.1c) carries the claim regardless.
4. **Footer: ADOPT NEW.** "AI-native, built to last — a sparse quadrant by design."
5. **Legend: "peer designers".** Doc 2 citation lives in PRD-FIELD-POSITION, not on the surface.
6. **Pressure bullet: candidate (c).** (§4.1)
7. **Thesis line: placement (A)** — kicker under Module 01 hero. (§4.2)
