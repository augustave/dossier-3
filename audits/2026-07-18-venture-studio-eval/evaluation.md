# CT-DOSSIER — Venture-Studio Evaluation

**Date:** 2026-07-18 · **Surface:** V4.0.2, canonical dossier-fold.vercel.app · **Method:** autonomous-venture-studio skill, four phase gates applied to the shipped surface (not a new venture — the dossier is a presentation surface / thesis, not a portfolio).

**Headline:** The craft and aesthetic system would pass a design review anywhere. What the dossier currently fails is its **own** standard — the Evidence-Engine doctrine ("no assertion without an artifact; real units, never fabricate"). Before any serious public promotion, close the truth items (peers, rights, bio sign-off), not more polish.

---

## Gate I — Market Truth: PASS with concerns

**Held:**
- Pain statement crisp and specific: *"The work begins where the thing is real, but the language around it has not caught up."*
- The single CTA (REQUEST CONVERSATION) prefills qualifier fields that mirror the pain statement ("What is real / Where the language has not caught up") — a coherent, self-selecting funnel.
- Segments named: enterprise design leadership, American Dynamism / defense-tech, frontier AI labs.

**Concerns:**
- `PRACTICE_STRATEGY.md` (2026-05-27) is **pre-swap**: targets "recruiters and fellowships," describes the retired Role-Fit IA, leads with a different thesis line, and names a different owner identity than the site persona. The live surface and the strategy doc describe different products. (→ T5)
- No demand evidence in the repo — 7 `[NEEDS INPUT]` gaps in `.agents/product-marketing.md` (real quotes, metrics, clients, competitors). Honest, but unvalidated.
- No measurable success criterion for the CTA. (→ T6)

## Gate II — Systems Truth: PASS; drift debt flagged

**Held:**
- One collapse primitive (`Fold`) for every surface; motion "laws" centralized as CSS custom-property blocks with rationale comments (fold / pleat / tab / plate / atlas / bioarch / brand). This is exactly the token-and-state-machine discipline the framework asks for.
- Data-driven module spine; per-module conditionals minimal and explicit.

**Drift debt (mechanical fixes applied this pass, see Fixes):**
- Copy defined 8 influence practitioners; live FERRIS astrolabe renders 7 (N.B. merged into Brody). The copy array's only consumer is a dead component — marked LEGACY, ferris iframe is source of truth.
- Map copy lists 14 peers; live neighboring-practices iframe has 32 — iframe is source of truth; copy array dead, marked LEGACY.
- Dead-but-retained chains: `InfluenceAtlas.tsx` (imported nowhere), `InquiryPanel` + question bank, `fieldPosition*` arrays, gutted route types. Kept, labeled.
- Stale: const name `CT_DOSSIER_COPY_V120` on a v4.0.2 file (renamed), CreaseMap `aria-label="Reading routes"` for a gutted route system (fixed).
- **Open a11y debt:** the 2026-06-22 audit's keyboard / VoiceOver pass was never run. Still open. (→ Tier 3)

## Gate III — Aesthetic Coherence: STRONGEST GATE — PASS

- Real aesthetic thesis with a named enemy: matte over gloss, mass over swagger, hard cuts over smooth digital morphing, real units. Distinctive; nothing generic-SaaS about it.
- Tokens govern **behavior**, not cosmetics — each module has a motion temperament (plotter-linear tab, origami pleat, plate-snap, flash-bulb) documented at the token site.
- Verbal identity defined (plainspoken, no self-mythologizing) and held almost everywhere — see Gate IV item 4 for the one crack.

**Caveats:**
- WCAG contrast on low-opacity mono microcopy (cream/olive bands) was flagged 2026-06-22 and never measured. (→ Tier 3)
- **Perf contradicted the restraint ethos:** `public/atlas/` shipped 23MB of images consumed only by a dead component — two Metahaven PNGs alone were 15.5MB. Compressed this pass; deletion is an owner call since the component may be revived. (Ferris 6.1MB is live and lightboxed — acceptable; dynamism plates already had their 50→2.9MB pass.)

## Gate IV — Narrative Truth: WEAKEST GATE — CONDITIONAL

Site doctrine: evidence over claims; never fabricate. Against that standard:

| # | Finding | Tier |
|---|---------|------|
| 1 | **Chart peer names are placeholders** (Flynn/Haas/Meyer… per TASKS.md "swap for real competitors") — fabricated-adjacent data points on a truth-doctrine surface | HIGH |
| 2 | **FERRIS influence images: rights NOT cleared** (HANDOFF: "flag before serious public promotion") | HIGH / transparency |
| 3 | **Bio prose is a reconstructed draft**, never owner-approved (in-code comment); BioArchival caption also DRAFT | MEDIUM |
| 4 | **Five Axioms register drift** — "Relentless Innovation / Limitless Creativity / Disruption is Progress" reads as the swagger the doctrine rejects; the one voice crack on the surface | MEDIUM (voice call) |
| 5 | 05 Brand carried a stale "URLs TBD/placeholder" comment though live URLs are wired (fixed this pass) | LOW |

**Verdict: GO for quiet operation · NO-GO for serious public promotion** until items 1–3 close.

---

## Fine-tunings

### Tier 1 — OWNER TODO (judgment/input required; not done by agent)
- **T1.** Peer names on the neighboring-practices map: supply real ones, or anonymize to unlabeled dots.
- **T2.** FERRIS image rights: clear them, replace with owned/public-domain assets, or add explicit source credits.
- **T3.** Bio prose + archival caption: approve or rewrite (both flagged DRAFT in-code).
- **T4.** Five Axioms: rework into the matte register, or frame them explicitly as a found/quoted artifact so the register break is deliberate.
- **T5.** PRACTICE_STRATEGY.md: update to post-swap reality or stamp SUPERSEDED.
- **T6.** LinkedIn URL (contact.ts TODO); define one success metric for REQUEST CONVERSATION (e.g. qualified conversations / quarter).
- **T7.** Decide fate of dead chains: `InfluenceAtlas` + `public/atlas/` (compressed this pass, still deletable), `InquiryPanel` bank, `fieldPosition*` arrays.

### Tier 2 — Mechanical fixes (APPLIED this pass)
- **M1.** Atlas images compressed (23MB → see fix log below); originals backed up outside the repo.
- **M2/M3.** LEGACY notes on the dead `practitioners` and `fieldPosition*` copy arrays, naming the live iframes as source of truth.
- **M4.** CreaseMap `aria-label` "Reading routes" → "Thesis" (routes gutted at V4.0.0).
- **M5.** `CT_DOSSIER_COPY_V120` → `CT_DOSSIER_COPY` across all 5 reference sites.
- **M6.** 05 Brand stale placeholder comment corrected to reflect wired links.
- **M7.** LEGACY comments on dead-but-retained code chains (kept, not deleted — see T7).

### Tier 3 — Flagged, needs a live session (not this pass)
- Manual keyboard + VoiceOver pass on ModuleStrata (open since 2026-06-22).
- WCAG contrast measurement on low-opacity microcopy over cream/olive.
- 05 Brand right-region negative space (owner already eyeballing).

---

## Scorecard

| Gate | Verdict |
|------|---------|
| I · Market Truth | PASS w/ concerns (stale strategy doc, no demand evidence, no CTA metric) |
| II · Systems Truth | PASS (drift debt cleaned this pass; a11y pass still open) |
| III · Aesthetic Coherence | **PASS — strongest gate** (contrast + perf caveats; perf fixed) |
| IV · Narrative Truth | **CONDITIONAL — weakest gate** (placeholders, rights, drafts) |

**Launch posture:** quiet operation fine; hold promotion until T1–T3 close.
