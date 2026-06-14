# CT-Dossier — Agent Handoff

**Read this first.** This is the parent index any agent picking up the project should start at. It points to per-feature PRDs and tells you what's done, what's open, and how the owner expects you to operate.

---

## 1. What CT-Dossier is

A single-page React microsite at `/Users/taoconrad/Dev/GitHub 4/CT-DOSSIER/Founder`. It is **not a portfolio**. The owner has three dedicated portfolio sites (`artdirector.rocks`, `brandproduct.dev`, `defense.observer`) that already do project casework. CT-Dossier is the **presentation surface** behind them — how the owner thinks, how they work, what they recruit for, what they would build.

If you find yourself wanting to add project cards, project galleries, or any kind of named-artifact list to the dossier surface, **stop**. That's portfolio work and belongs on the three external sites.

---

## 2. Tech & file map

- **Stack:** React 19 + TypeScript + Vite 6, Tailwind 3 (local PostCSS), Vitest 4. Static-only. No backend, no API.
- **Project root:** `Founder/` (yes, the deployable lives in a subdirectory).
- **Key files:**
  - `Founder/App.tsx` — shell, hash routing, top hero, audience selector, module rendering loop.
  - `Founder/copy.v1_1.ts` — all editorial content. Audited keys for each module live here.
  - `Founder/constants.tsx` — `CONTENT_MODULES` array; module render specs (JSX) live here.
  - `Founder/types.ts` — `ModuleType` enum, `ModuleData`, `DoctrineCard` scaffolding (currently unused in render).
  - `Founder/components/ModuleStrata.tsx` — the strata band component every module renders inside.
  - `Founder/components/ManifestOverlay.tsx` — the INDEX (00) overlay; has a hardcoded sort order array.
  - `Founder/App.test.tsx` — 19 Vitest tests as of the latest pass (was 15 before audience tests).
- **Doc tree (this folder, `Founder/`):**
  - `HANDOFF.md` — this doc.
  - `DOSSIER_REFRAME_PRD.md` — Phase 1 PRD: dossier-as-presentation restructure.
  - `PRD-FACETED-ENTRY.md` — Phase 2 PRD: audience-aware top hero.
  - `PRD-FIELD-POSITION.md` — Phase 3 PRD: 2-axis positioning chart inside Module 02.
  - `PRD-DOCTRINE-EXPLORER.md` — Phase 4 PRD: tabbed register explorer inside Module 02, after the chart.
  - `PRD-IAA-INTEGRATION.md` — Phase 5 PRD: brand-architecture substance translated into the dossier voice (M02 thesis kicker, M03 pressure bullet, field-chart v1.1 revision; The Fold plate cut by war-game). Owner-approved + implemented 2026-06-07.
  - `README.md` — original project README (predates the restructure).
- **Doc tree (parent `../`, not in this git repo):**
  - `CT_DOSSIER_EVALUATION_REPORT.md` — ship-readiness baseline from an earlier review pass. Local-only reference.

---

## 3. Current architecture (as of this handoff)

### Module structure

```
00 MANIFEST            (overlay, not rendered as a strata)
01 ROLE FIT
02 CREATIVE TECHNOLOGIST
03 OPERATING METHOD
04 WORLD MODEL          ← three picks (Levin / Hughes / Johnson) + Coherence → Influence → Ship
05 PORTFOLIOS           ← three external-site tiles only
06 ROLE MATRIX          ← interactive simulator (lazy mounted)
```

### Top hero (above all modules)

- "This is not a portfolio" framing paragraph with three inline external links.
- **Faceted audience selector** — four pills (Hiring Manager / Client / Collaborator / Academic). When a pill is active, the module list collapses to that audience's 3 curated modules. `?read=` URL param sync. See `PRD-FACETED-ENTRY.md`.
- Target Roles block (unchanged from original).

### What is NOT on the surface but lives in source

These are preserved for restoration only — do not surface them without explicit owner direction:

- `_archivedCompanies` in `copy.v1_1.ts` — the seven Tier-1 project cards (DEADLIGHT, DOSSIER VOL, GREY-EARTH, TACTICAL CANVAS, MINI-D, WAR-F, CCRT, TAK-G).
- `_archivedWedges` — the Four Pillars taxonomy.
- `_archivedDoctrineCards` — the Tier-2 doctrine cards (SEAL, DYNAMISM DOSSIER, LIFT BENCH) that were briefly tried and cut.

---

## 4. PRD index (read these in order if catching up)

| # | Doc | Status | Scope |
|---|---|---|---|
| 1 | `DOSSIER_REFRAME_PRD.md` | **Shipped** to source; uncommitted/pending push at time of writing. | Dossier-as-presentation restructure. Cut casework. Added WORLD MODEL. Stripped Module 05 to portfolios only. Read this for the full IA change and the locked design decisions (WORLD MODEL naming, picks count, etc.). |
| 2 | `PRD-FACETED-ENTRY.md` | **Shipped** to source; tests added; pending commit. | Audience-aware top hero with URL state. War-gamed module-to-audience mapping. |
| 3 | `PRD-FIELD-POSITION.md` | **Shipped** to source; pending commit. | 2-axis SVG chart at the end of Module 02 plotting 14 designers from Doc 2 with a highlighted dot for Ven. War-gamed placement decision favors Module 02 over alternatives (including World Model, top hero, standalone module) because it's visible to the Hiring Manager audience. |
| 4 | `PRD-DOCTRINE-EXPLORER.md` | **Shipped** to source; tests added; pending commit. v2 placement at end of Module 03 (was Module 02 in v1). | Tabbed 3-register explorer at the end of Module 03 (Operating Method). Stateful sub-component in `components/DoctrineExplorer.tsx`. Demonstrates the rule-making practice — palette + thesis + iron rule swappable on click. After the war-game audit, moved from Module 02 to Module 03 so it's visible to Client + Collaborator + Academic. |
| 5 | `PRD-IAA-INTEGRATION.md` | **Shipped + deployed** (`353312f`; contact-path follow-up `5ed3f46`). Pushed; gh-pages auto-deployed; live at augustave.github.io/CT-DOSSIER. Owner-approved + war-gamed. | IAA brand-architecture substance translated into the dossier voice. Shipped: M02 thesis kicker "Taste with a load rating."; M03 DEFAULT BIAS pressure bullet; Field Position chart v1.1 (new poles, named quadrants, VEN→x72/y78, tightened owned-zone wash, "peer designers" legend, new footer). Cut by war-game: The Fold cusp plate (stays off-dossier). `copy.v1_1.ts` meta → 1.3.0. tsc clean; 20/20 vitest; voice-lint clean. |

**Field Position chart is now at v1.1** — see `PRD-FIELD-POSITION.md` §9 changelog. Pole labels, quadrant names, VEN coordinate, and the owned-zone wash all changed; the old `CRAFT/AI × VELOCITY/PERMANENCE` description elsewhere is superseded.

| 6 | `PRD-VOICE-V2.md` | **Implemented** 2026-06-12 (uncommitted): ROLE FIT pilot + fast-follow M01/M03 + `meta`→2.0.0. tsc/20-tests/voice-lint green. Optional remainder: Module 02 body/caption. | First-person "Meservey" voice doctrine. **Reverses** the v1.2.0 "no first-person pronoun" rule. New gate (§4), jargon→plain swaps, locked ROLE FIT reference cut (§5), migration map (§6). On implementation: `copy.v1_1.ts` `meta.version`→2.0.0, `meta.rule` replaced. NOTE: the §6 "Banned phrases" list below predates v2 — v2 adds jargon-flag bans and removes the first-person ban. |

If a sixth PRD is added later, register it here.

### Site-wide war-game restructure (no separate PRD, see commit history)

A site-wide audience-by-audience audit ran on the dossier with field-position chart + doctrine explorer + audience selector all live. Four changes shipped from that pass:

1. **Doctrine explorer moved from Module 02 → Module 03.** Reaches three audiences instead of two. See `PRD-DOCTRINE-EXPLORER.md` §placement-v2.
2. **Collaborator audience curation changed from `04/03/06` → `02/04/03`.** Drops Role Matrix; adds Module 02 so collaborators see the field-position chart. See `PRD-FACETED-ENTRY.md` revision log.
3. **Module 05 PORTFOLIOS gains an outcome line** below the three tiles: *"Each site stands alone. None of them tries to say what the practice is — that's this dossier's job."* Thickens the closer for Hiring Manager and Client.
4. **Module 01 ROLE FIT gains a 3-signal coordinate strip** above the existing lead copy. Three labeled tiles: `SIGNAL · 01 Visual systems` / `SIGNAL · 02 Interactive proto.` / `SIGNAL · 03 Technical narrative`. Mirrors the field-position chart's "coordinate" register at the role-fit scale. Gives Module 01 its first visual anchor.

---

## 5. Open follow-ups (not blocking, but track them)

> **Correction (2026-06-12):** Items 1–4 below are stale. Local main == origin/main — prior commits ARE pushed. Deploy is live via GitHub Pages auto-deploy (workflow added 2026-05-31, stale-HTML sync fixed same day, favicon pushed 2026-06-11); Vercel is no longer the plan and the stale-`dist/` concern is handled by CI. Item 0 remains open, and a second uncommitted batch now exists: the contact-path fix of 2026-06-10 (`contact.ts` new, `App.tsx`, `components/InquiryPanel.tsx`) — commit it separately from the IAA batch. See `TASKS.md` at repo root.

0. **IAA integration is SHIPPED** — committed (`353312f` + contact-path `5ed3f46`), pushed, and gh-pages auto-deployed; live bundle at augustave.github.io/CT-DOSSIER verified to carry the kicker, chart v1.1, contact blocks, and the v1.3.0 label. Remaining: LinkedIn URL into `contact.ts`; real peer names on the chart; FIG.02-04 plates; interview drill. (Pages auto-deploys on push — no manual build/deploy step.)
1. **Push to origin.** Latest commits are in the local working tree only; `git push origin main` from the owner's Mac (sandbox has no network access). See per-PRD acceptance sections for which files to stage.
2. **Deploy.** No host is connected. Vercel is the recommended path — `vercel.com → New Project → import augustave/CT-DOSSIER → set root to Founder/`. Two adjacent sites under the same owner (`grey-earth.vercel.app`, `tak-h.vercel.app`) already deploy on Vercel.
3. **Stale `dist/`.** The committed `dist/` is from April 16, predating all restructure work. `npm run build` will regenerate; do not deploy the old artifact.
4. **No domain.** The dossier has no domain. Until selected, `ct-dossier.vercel.app` (or a chosen subdomain) is the working address.
5. **`ProjectxP-Map-DO_a1.md` untracked.** Sits at `Founder/` root, unrelated to this restructure. Leave alone unless owner asks.
6. **Visual demonstration surface (Idea 3 from session).** Considered but not built: a small generative/interactive piece that *demonstrates* the polymath claim rather than asserting it. Worth raising with owner when capacity exists.
7. **Two-axis positioning diagram (Idea 1).** Mockup discussed but not implemented in the dossier. Source: the three uploaded designer-graph documents (`Designers-1-graph.md`, `Designers-2-Graph.md`, `Poly-1Graph.md`). Plotting designers across AI/Craft × Velocity/Permanence with the owner placed on it.

---

## 6. Owner notes — read carefully

The owner is **Ven** (legal name Tao Conrad, professional Ebenz Augustave). Studio: **ANP Studio**. NYC. Solo operator across defense-tech, design systems, AI orchestration.

### Voice & posture

- Terse. Decisive. Doctrine-flavored.
- First-person, declarative. No hedging.
- When something is underspecified, ask **one** question (or present 2–4 sharp options or a single binary). Never an open prompt.
- When committing to a decision, commit and move. Don't narrate deliberation.
- Match the register of his existing work — don't soften it, don't add marketing, don't hedge.

### Banned phrases (never publish under his name)

"Excited to share / thrilled / honored / humbled" · "I had the pleasure of" · "Passionate about" · "Game-changer" · "Leverages / unlocks" as verb spam · "AI-powered" as marketing adjective · "Reach out" · "In today's fast-paced world" · hashtag clusters of 3+ · em-dash-and-hedge.

**Voice v2 update (2026-06-12):** first person is now ALLOWED (was banned). Added jargon-flag bans — `visual operating language`, `deterministic brand systems`, `fabrication-grade governance`, `validated claims sheet`, `artifact contract`, framework-as-noun, defense acronyms in body copy. Full gate + jargon→plain swaps live in `PRD-VOICE-V2.md` §4. Enemies must be categories, never real people.

### Workflow tells from past sessions

- **Defer to artifacts.** Screenshots and files the owner shows you outrank any synthesis you produce. If he uploads three documents, read all three before responding.
- **Don't categorize without asking.** "Is this a project, sub-project, category, or label?" — one-line question beats a three-paragraph cleanup.
- **Don't generate structural reads he hasn't asked for.** Less synthesis, more direct execution.
- **Treat short direct corrections as spec.** "Revert it" = revert it, full stop. Not "and let me also propose…"
- **Never invent specs, dates, URLs, claims, user counts, or repo slugs.** When uncertain, use a `pending` marker or ask.

### Environment quirks you'll hit

- Mac sandbox can't unlink files in `.git/index.lock` — if you see this, ask the owner to clear it on his Mac.
- Mac sandbox can't write into `Founder/dist/` (permissions). `vite build --outDir /tmp/...` works for verification.
- Network from sandbox to GitHub is blocked. Push always happens on the owner's machine.

---

## 7. Sister projects (mentioned for context, not in scope)

- `DOSSIER` (a separate Cowork folder, sometimes called the "profile website") — canonical for bio, headlines, public-facing positioning. **CT-Dossier may read from it but never writes to it.**
- `LINKEDIN-X` — content strategy, case-study source, post drafts, distribution. Out of scope for CT-Dossier work.

These exist; do not edit them as part of dossier work.
