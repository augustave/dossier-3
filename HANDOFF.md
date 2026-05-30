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
| 4 | `PRD-DOCTRINE-EXPLORER.md` | **Shipped** to source; tests added; pending commit. | Tabbed 3-register explorer at the end of Module 02 (after the chart). Stateful sub-component in `components/DoctrineExplorer.tsx`. Demonstrates the rule-making practice — palette + thesis + iron rule swappable on click — without surfacing a named project. |

If a fifth PRD is added later, register it here.

---

## 5. Open follow-ups (not blocking, but track them)

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
