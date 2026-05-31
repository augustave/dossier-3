# Copy Revamp Memo — Meservey Voice Pass

**Date:** 2026-05-31
**Scope:** Prose/messaging only. No structure, layout, data, or component changes.
**Files touched:** `copy.v1_1.ts`, `constants.tsx`

---

## Why

The dossier's aim is to present the candidate as **easy on the eye, jargon-free, and a culture fit** — not to out-credential a defense-tech operator. Prior copy was technically accurate but read like a competence performance: framework-names-as-nouns, CV-style noun lists, compliance-doc terms. It signaled "not one of us" to non-defense readers and never portrayed *who the person is in a room*.

**Target voice: Lulu Cheng Meservey.** Plain English, declarative, named stakes, quotable lines ≤12 words, zero corporate hedging, no frameworks-named-as-frameworks. "Would a smart person say this out loud to a friend?"

**Explicitly out of scope (do NOT change):** section setup/IA, field-position chart, doctrine registers, portfolio sites, inquiry questions, archived companies (`_archivedCompanies`, `_archivedWedges`, `_archivedDoctrineCards`), SVG/data fields.

---

## Voice rules now in force (`copy.v1_1.ts` meta)

- `voice: "plainspoken, named stakes, no frameworks-as-nouns"`
- `rule: "first-person, say it the way a smart person says it out loud"`
- **No framework-nouns in prose.** Real artifacts (DEADLIGHT, TAK-G, CYPHER, GREY-EARTH) stay as project references; jargon descriptors (EMCON confidence decay, zero-trust SIGINT ghost tracks, fabrication-grade governance, Tactical Brutalism framework, visual operating language, validated claims sheet, artifact contract) are cut from prose.
- Every module should carry: a **stakes** beat (what gets worse without this) and/or a **taste** beat (what this person won't do), plus at least one **quotable** line.

---

## Change tally

### `copy.v1_1.ts`

| Field | Before → After (intent) |
|---|---|
| `meta.voice` / `meta.rule` | Was `personal-technical` / `no hype, no mysticism`. Now plainspoken brief (above). |
| `modules["01"].hero` | "design systems that make complex technical work legible" → **"I make complex technical work easy to look at — and easy to trust."** |
| `modules["01"].body` | Cut the CV noun-list ("C2 theater simulators… drone swarm… deterministic brand systems"). Reframed around the gap between what engineering does and what a person believes. Added taste/stakes close: *"Strip the styling away, and if it stops making sense, it was never finished."* |
| `modules["01"].noteLines` | Dropped recruiter word "Multidisciplinary." Now: one head for look/build/story; same hands; "if it can't be said plainly, it isn't ready." |
| `modules["02"].lead` | → **"Hire me when the product is real but nobody can see it yet."** + "making the whole thing readable at a glance." |
| `modules["02"].people[0].body` (Visual Operating Languages) | Removed "trust/proof/consequence grammar," "cryptographic seeds," "fabrication-grade governance," "classified-style artifacts." Plain: one consistent look; one fixed rule so two people never draw it two ways. |
| `modules["02"].people[1].body` (Interactive Prototypes) | Removed "swarm kinematics, EMCON confidence decay, zero-trust SIGINT ghost tracks," "React/Vite/Three.js/WebGL." Plain: 1,500+ things on screen holding under load; a map you can drive; build in real code to judge feel. |
| `modules["02"].people[2].body` (Technical Storytelling) | Removed "Tactical Brutalism framework," "recruiter-ready/stakeholder-ready/operator-legible" adjective stack. Plain: lands with operator/buyer/engineer in one room. |
| `modules["02"].together` | Was numbered résumé list (1/2/3). Now 2-line plain statement. **Note: still `\n`-joined; renderer (`constants.tsx`) splits on `\n` and `<br/>`s all but last line.** |
| `modules["02"].oneLine` | → **"One person for the look, the build, and the story."** |
| `modules["03"].hero` | → "I move fast from idea to proof — but the work still has to hold together." |
| `modules["03"].body` | "governing structure" → "the spine"; cut "validated claims sheet, test plan, case study"; kept "evidence over claims" (intentional doctrinal motif) + "open and check yourself in half an hour." |
| `modules["03"].bullets` | De-jargoned 4 bullets; dropped "10 defense-adjacent projects / artifact contract / threat model" line → "write the rules down once." |
| `modules["03"].grid` | leftBody/rightBody plainer ("run ahead of the paperwork" / "lock the rules down"). |
| `modules["03"].close` | "technical articulation" → "plain explanation… live in one head." |
| `modules.worldModel.intro` | **"steer reality" → "move outcomes"** (mysticism flag in voice rule). "operators of invisible systems" → "people who run invisible systems." |

**Untouched in `copy.v1_1.ts`:** all of `modules["04"]` (PORTFOLIOS — already empty-by-design + good hero/outcomeLine), `worldModel.reveal/framework/close` (already on-voice), field-position data, doctrine registers, all archived blocks.

### `constants.tsx`

| Field | Change |
|---|---|
| `RECRUIT_CARDS` (×3) | **Deduped.** Project lines (TAK-G/GREY-EARTH/DEADLIGHT/CYPHER) previously duplicated between `RECRUIT_CARDS[].desc` and `copy.v1_1 people[].body` — now live ONLY in `people[].body`. Cards reworded to generic plainspoken capability/signal/desc. |
| Module `06` ROLE MATRIX `promptText` | "INTERACTIVE FIT LENS" → **"WHERE I FIT"** ("lens" was softest noun on site, off-register). |
| Module `06` `responseText` / `responseDisplay` | "Map the kind of work and environment against the role I am most likely to play well." → "Match the work and the team to the role I'd actually play well." |

**Untouched in `constants.tsx`:** `SELECTED_SYSTEMS_EVIDENCE` (evidence links — technical detail acceptable there), `INQUIRY_OPTIONS`, `INQUIRY_QUESTIONS`, module IA/indices/theme colors, field-position SVG.

---

## Known follow-ups (NOT done — flagged for future agents)

- **Inquiry questions** (`constants.tsx INQUIRY_QUESTIONS`): two weak/generic items remain — *"What makes a prototype successful for you?"* and *"What signals tell you a role is actually designed for someone with your range?"* Left alone this pass (user kept sections as-is). Candidates for a sharper, trade-off-style rewrite later.
- **Glossary affordance:** for non-defense recruiters, surviving technical terms in `SELECTED_SYSTEMS_EVIDENCE` could use inline one-line definitions. Deferred.
- **Motif vs. accidental repeat:** "evidence over claims" is an intentional doctrinal motif (kept, repeated). Other repeats were accidental and have been deduped. Preserve this distinction.

---

## Verification

`npm run build` — clean (`✓ built in ~1.1s`, no TS errors) after all edits.
