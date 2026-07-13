# CT-Dossier Reframe PRD

**Doc version:** 1.0 — handoff
**Project root:** `/Users/taoconrad/Dev/GitHub 4/CT-DOSSIER/Founder`
**Stack:** React 19 + TypeScript + Vite 6 + Tailwind 3 (local PostCSS), Vitest 4
**Tests baseline:** 15/15 passing prior to work.

---

## 1. Context

CT-Dossier is a single-page React microsite. It was originally structured as a recruiter-facing casework gallery — a "Selected Systems" module surfaced seven defense-adjacent project cards (DEADLIGHT, DOSSIER VOL, GREY-EARTH, TACTICAL CANVAS, MINI-D, CCRT, TAK-G) plus a Four-Pillars taxonomy.

The owner has three dedicated portfolio sites that already do the casework job:

- `artdirector.rocks` — art direction (editorial / typographic / identity)
- `brandproduct.dev` — brand × product (design systems, interface grammar, shipped product surfaces; non-defense lane)
- `defense.observer` — defense (doctrine-driven visual systems for autonomy, sensing, command)

The dossier should not be a fourth gallery. It should be **presentation**: who the owner is, how they work, what they recruit for, what they'd build. Project casework belongs on the three portfolio sites; the dossier is the through-line none of those sites can show on their own.

This PRD captures the full restructure as a single coherent change set. Treat the existing repo as untouched and execute against it.

---

## 2. Information Architecture

### Before

```
00 MANIFEST (overlay)
01 ROLE FIT
02 CREATIVE TECHNOLOGIST
03 OPERATING METHOD
04 SELECTED SYSTEMS  ← casework: 7 Tier-1 project cards + Four Pillars + first30 proof lines
05 ROLE MATRIX (interactive simulator)
```

### After

```
00 MANIFEST (overlay)
01 ROLE FIT                    (unchanged)
02 CREATIVE TECHNOLOGIST        (unchanged)
03 OPERATING METHOD             (unchanged)
04 WORLD MODEL                  ← NEW: Levin / Hughes / Johnson picks, Coherence→Influence→Ship loop
05 PORTFOLIOS                   ← was SELECTED SYSTEMS, now stripped to 3 site tiles + 1 framing line
06 ROLE MATRIX                  (was 05, bumped)
```

Plus a top-hero read-me-first frame above all modules: *"This is not a portfolio. The built work lives at three dedicated sites — artdirector.rocks, brandproduct.dev, defense.observer. This is the practice behind them."*

---

## 3. Module 04 — WORLD MODEL (NEW)

**Index:** `"04"`
**Title:** `WORLD MODEL`
**Prompt:** `WHAT MY THREE PICKS REVEAL`
**Theme:** `black`
**Source:** Adapted from `/Users/taoconrad/Documents/Claude/Projects/LINKEDIN-X/memory/South Park Commons - FEB - 2026.md`

### Copy

**Hero:** *"I'd recruit three people into a Skunkworks. The picks reveal the practice."*

**Intro:** Levin, Hughes, Johnson — three operators of invisible systems. Not doers, not talkers; people who steer reality by understanding the control layer underneath it. Read as a stack, they are three layers of one machine.

**Three layer cards** (rendered as a 3-column grid):

| Layer | Sub | Person | Body |
|---|---|---|---|
| KERNEL | Self-organizing substrate | Michael Levin · Tufts | Treats biology as a programmable, goal-seeking information system — bioelectric signals as the control layer for form and repair. He gives me a framework for designing systems where parts reliably assemble into wholes, even after damage. |
| MIDDLEWARE | Human interface | Chase Hughes | Operationalizes human behavior under uncertainty — baseline, deviation, incentive, frame control. Treats persuasion as systems engineering, not charisma. The difference between great tech and a system humans actually adopt. |
| APPLICATION | Ship engine | Kelly Johnson · Skunk Works | Built impossible machines fast by making constraints and simplicity do the heavy lifting. Skunk Works wasn't a vibe; it was an operating system — small teams, direct comms, rapid decisions, test early. |

**What the picks say** (single paragraph, section title `WHAT THE PICKS SAY`):
> Control systems over aesthetics. High-stakes environments over comfort. Paradigm-changers over optimizers. A bias toward synthesis. I am not trying to make a product — I am trying to make an operating system for outcomes.

**The loop** (3-item list, section title `THE LOOP`):
- **Coherence** — what must stay true for the system to work; the signals that separate healthy from drifting.
- **Influence** — who must believe what, and what behavior must change for adoption.
- **Ship** — the smallest real deployment that proves value in the wild.

**Close (italic, bordered):**
> Three failure modes kill ambitious work: the system won't cohere, the humans won't align, the thing won't ship. Each pick solves one.

### Decisions explicitly resolved (do not re-litigate)

- Module name is **WORLD MODEL**, not PRACTICE STACK / OPERATING SYSTEM / INFLUENCES.
- Pick count is **three, locked**. No design figure added.
- IRL company alignment (Palantir / Anduril / Axon / Vanta) — **excluded.**
- Five meta-principles block — **excluded for compression.**

---

## 4. Module 05 — PORTFOLIOS (was SELECTED SYSTEMS)

### Changes to Module 05

**Title:** `SELECTED SYSTEMS` → `PORTFOLIOS`
**Prompt:** `WHERE THE WORK SHOWS UP` → `WHERE THE WORK LIVES`
**Theme:** `clay` (unchanged)
**Hero (single line, large serif):** *"The built work lives at three dedicated sites — one per register."*

### Removed entirely from the render surface

- `body` paragraphs (set to empty)
- `wedges` / `wedgesTitle` (Four Pillars taxonomy)
- `first30` per-project proof lines + `first30Title`
- All 7 entries in `companies[]` (DEADLIGHT, DOSSIER VOL, GREY-EARTH, TACTICAL CANVAS, MINI-D, CCRT, TAK-G)
- `companiesSynthesis` bridge text
- The Tier-2 doctrine cards layer (SEAL, DYNAMISM DOSSIER, LIFT BENCH) — never adds value, was briefly considered, killed.

### Source preservation (do not delete the data)

In `copy.v1_1.ts`, preserve removed source as sibling keys:
- `_archivedCompanies` — original `companies[]` data
- `_archivedWedges` — original Four Pillars wedges
- `_archivedDoctrineCards` — if doctrine cards were ever populated, archive them here

These are unreferenced by render code; they exist as restoration source.

### What renders in Module 05 (the entire module body)

```
PORTFOLIOS  /  WHERE THE WORK LIVES

The built work lives at three dedicated sites — one per register.

┌─ ART DIRECTION ──────┐  ┌─ BRAND × PRODUCT ─────┐  ┌─ DEFENSE ─────────────┐
│ artdirector.rocks    │  │ brandproduct.dev      │  │ defense.observer      │
│ Editorial, typo-     │  │ Design systems,       │  │ Doctrine-driven       │
│ graphic, identity.   │  │ interface grammar,    │  │ visual systems for    │
│ Where the page is    │  │ shipped product       │  │ autonomy, sensing,    │
│ the product.         │  │ surfaces. The non-    │  │ and command. The lane │
│                      │  │ defense lane.         │  │ this dossier orbits.  │
└──────────────────────┘  └───────────────────────┘  └───────────────────────┘
```

### Portfolio tile data

```ts
portfolioSites: [
  { domain: "artdirector.rocks", register: "Art direction",     frame: "Editorial, typographic, identity. Where the page is the product." },
  { domain: "brandproduct.dev",  register: "Brand × product",   frame: "Design systems, interface grammar, shipped product surfaces. The non-defense lane." },
  { domain: "defense.observer",  register: "Defense",           frame: "Doctrine-driven visual systems for autonomy, sensing, and command. The lane this dossier orbits." }
]
```

Render as `<a>` tags linking to `https://${site.domain}`, in a 3-column grid, each tile carrying register (small mono uppercase), domain (mono, mid size), frame (sans body).

---

## 5. Top hero frame (App.tsx)

Add a one-paragraph framing block above the existing "Target Roles" block, inside the top hero section. Renders on every page (since the page is single-route):

```
This is not a portfolio. The built work lives at three dedicated sites —
artdirector.rocks, brandproduct.dev, and defense.observer.
This is the practice behind them: how I think, how I work, what I recruit for.
```

Each domain is an inline `<a target="_blank">` with a thin underline (mono, small).

---

## 6. File-by-file change set

### `types.ts`

Add to `ModuleType` enum:
```ts
WORLD_MODEL = 'WORLD_MODEL',
```

Add two new interfaces:
```ts
export interface DoctrineExcerpt {
  quote: string;
  source: string;
}

export interface DoctrineCard {
  name: string;
  thesisLine: string;
  doctrineExcerpt: DoctrineExcerpt;
  artifactFormat: 'codex' | 'skill' | 'interactive' | 'framework' | 'spec';
  governingUnits: string;
  proves: string;
  link: string;
  domain?: 'maritime' | 'industrial' | 'spectrum' | 'air' | 'ground' | 'editorial' | 'cross-domain';
  implementations?: { name: string; link: string; pending?: boolean }[];
}
```

Note: `DoctrineCard` is retained as type-level scaffolding even though no doctrine cards currently render. Keep it — removal would force re-adding it if the doctrine layer is ever restored.

### `copy.v1_1.ts`

Inside `CT_DOSSIER_COPY_V120.modules`:

1. **Update module `"04"`:**
   - `title: "PORTFOLIOS"` (was "SELECTED SYSTEMS")
   - `prompt: "WHERE THE WORK LIVES"` (was "WHERE THE WORK SHOWS UP")
   - `hero: "The built work lives at three dedicated sites — one per register."` (was "The portfolio is a set of proof artifacts, not a gallery of disconnected images.")
   - `body: ""`
   - `wedgesTitle: ""`
   - `wedges: [] as string[]` — keep field for type compat; archive original 4 wedges as `_archivedWedges`
   - `first30Title: ""`
   - `first30: ""`
   - `companies: []` (typed) — archive original 7 cards as `_archivedCompanies`
   - `companiesTitle: ""`
   - `companiesSynthesis: ""`
   - Add `portfolioSitesTitle: ""` (intentionally empty — the hero line carries the framing, no extra heading needed)
   - Add `portfolioSites` array (see §4)
   - `doctrineCardsTitle: ""`, `doctrineCardsHero: ""`, `doctrineCards: [] as Array<any>` — archive any populated doctrine data as `_archivedDoctrineCards`

2. **Add a new sibling module key `worldModel`** (not numeric — this is intentional, since the copy key namespace is decoupled from display indices). Structure:
   ```ts
   worldModel: {
     title: "WORLD MODEL",
     prompt: "WHAT MY THREE PICKS REVEAL",
     hero: string,
     intro: string,
     layersTitle: "THREE LAYERS OF ONE MACHINE",
     layers: Array<{ layer: string; sub: string; person: string; body: string }>,
     revealTitle: "WHAT THE PICKS SAY",
     reveal: string,
     frameworkTitle: "THE LOOP",
     framework: string[],
     close: string
   }
   ```
   All text content per §3.

### `constants.tsx`

`CONTENT_MODULES` array changes:

1. **Insert a new entry between `MODEL` (Operating Method, index "03") and `COMPANIES`:**
   ```ts
   {
     id: ModuleType.WORLD_MODEL,
     index: "04",
     title: COPY.modules.worldModel.title,
     promptText: COPY.modules.worldModel.prompt,
     themeColor: 'black',
     responseText: COPY.modules.worldModel.hero,
     responseDisplay: ( /* see render spec below */ )
   }
   ```

2. **`COMPANIES` entry:** change `index: "04"` → `index: "05"`, replace `responseDisplay` with the new slim render (hero + portfolio router only, see §4).

3. **`SIMULATOR` entry:** change `index: "05"` → `index: "06"`. Nothing else.

#### WORLD MODEL render spec

```tsx
<div className="space-y-8">
  <p className="font-serif text-2xl md:text-4xl leading-relaxed">{hero}</p>
  <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">{intro}</p>

  <div>
    <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">{layersTitle}</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {layers.map(l => (
        <div className="p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity">
          <div className="flex items-baseline justify-between mb-3 gap-3">
            <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">{l.layer}</span>
            <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">0{idx+1}</span>
          </div>
          <div className="font-mono text-xs uppercase tracking-wide opacity-muted mb-1">{l.sub}</div>
          <h4 className="font-serif text-xl md:text-2xl italic mb-3">{l.person}</h4>
          <p className="font-sans text-sm opacity-secondary leading-relaxed">{l.body}</p>
        </div>
      ))}
    </div>
  </div>

  <div className="border-t border-white/20 pt-6">
    <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-3">{revealTitle}</h4>
    <p className="font-serif text-xl md:text-2xl leading-relaxed">{reveal}</p>
  </div>

  <div className="border-t border-white/20 pt-6">
    <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">{frameworkTitle}</h4>
    <ul className="space-y-3">
      {framework.map(f => {
        const dashIdx = f.indexOf('—');
        const label = f.substring(0, dashIdx).trim();
        const content = f.substring(dashIdx + 1).trim();
        return (
          <li className="flex gap-4 items-start">
            <span className="font-mono text-xs uppercase tracking-wider opacity-muted whitespace-nowrap pt-1 min-w-[5rem]">{label}</span>
            <span className="font-sans text-base md:text-lg opacity-secondary leading-relaxed">{content}</span>
          </li>
        );
      })}
    </ul>
  </div>

  <p className="font-serif text-lg md:text-xl italic opacity-tertiary border-t border-white/10 pt-4">{close}</p>
</div>
```

#### Module 05 (PORTFOLIOS) render spec

```tsx
<div className="space-y-8">
  <p className="font-serif text-2xl md:text-4xl leading-relaxed">
    {COPY.modules["04"].hero}
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {COPY.modules["04"].portfolioSites.map((site, idx) => (
      <a
        key={idx}
        href={`https://${site.domain}`}
        target="_blank"
        rel="noreferrer"
        className="block p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity group/site"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">{site.register}</div>
        <div className="font-mono text-lg md:text-xl tracking-tight mb-3 group-hover/site:underline">{site.domain}</div>
        <p className="font-sans text-sm opacity-secondary leading-relaxed">{site.frame}</p>
      </a>
    ))}
  </div>
</div>
```

That is the entire Module 05 body. No first30 block, no companies grid, no synthesis bridge, no doctrine layer, no Four Pillars. Nothing else.

### `App.tsx`

In the top hero `<section>` (the `pt-28 md:pt-36 pb-6 md:pb-10 bg-strata-cream` section), insert a framing paragraph above the existing "Target Roles" `<div>`:

```tsx
<div className="mb-5 md:mb-6 max-w-3xl">
  <p className="font-sans text-base md:text-lg leading-relaxed">
    <span className="font-bold">This is not a portfolio.</span> The built work lives at three dedicated sites —{' '}
    <a href="https://artdirector.rocks" target="_blank" rel="noreferrer" className="font-mono text-sm border-b border-black hover:bg-black hover:text-white transition-colors">artdirector.rocks</a>,{' '}
    <a href="https://brandproduct.dev" target="_blank" rel="noreferrer" className="font-mono text-sm border-b border-black hover:bg-black hover:text-white transition-colors">brandproduct.dev</a>, and{' '}
    <a href="https://defense.observer" target="_blank" rel="noreferrer" className="font-mono text-sm border-b border-black hover:bg-black hover:text-white transition-colors">defense.observer</a>.
    {' '}This is the practice behind them: how I think, how I work, what I recruit for.
  </p>
</div>
```

### `components/ManifestOverlay.tsx`

Update the hardcoded sort order array (currently `["02", "01", "03", "04", "05"]`) to include `"06"`:

```ts
const order = ["02", "01", "03", "04", "05", "06"];
```

Update the inline comment to match: `// Module List - Current custom order: 02, 01, 03, 04, 05, 06`.

### `App.test.tsx`

Update the manifest-order test (the one titled "opens from the INDEX button and renders the expected module order"):
- Title: include `06` in the parenthetical
- Assertion: `expect(order).toEqual(['02', '01', '03', '04', '05', '06']);`

No other test changes needed. The hash-on-mount test uses `#module-03` which still resolves to Operating Method — unaffected. The "does NOT show Module 06 / Evidence Locker" test checks for the literal text "EVIDENCE LOCKER" which is unrelated to the new WORLD MODEL — also unaffected.

---

## 7. Acceptance criteria

Run all three from `Founder/`:

```bash
npx tsc --noEmit            # must pass clean
npm test -- --run            # 15/15 tests pass
npm run build                # builds; expected output ~248 kB JS / ~28 kB CSS
```

Manual verification via `npm run dev`:

- Top hero declares "This is not a portfolio" with three working external links.
- Navigation index lists 6 modules in order: 02, 01, 03, 04, 05, 06.
- Module 04 (WORLD MODEL) opens to: hero, intro, three layer cards (Levin / Hughes / Johnson), "what the picks say" reveal, the three-step framework loop, italic close line.
- Module 05 (PORTFOLIOS) opens to: hero line + three portfolio tiles + nothing else. No project cards. No Four Pillars. No doctrine cards.
- Module 06 (ROLE MATRIX) is the interactive simulator at the bottom, behaviorally unchanged.

---

## 8. Out of scope / open follow-ups

These are explicitly **not** part of this PRD; mention them at handback but do not execute:

1. **Deployment.** No host is connected. Vercel is the recommended path: `vercel.com → New Project → import augustave/CT-DOSSIER → set root to Founder/`. Two other sites under the same owner already deploy on Vercel.
2. **Domain.** No domain has been chosen for the dossier itself. `ct-dossier.vercel.app` (or a chosen subdomain) works until a real domain is selected.
3. **Manifest overlay quirk.** The hardcoded `["02","01","03","04","05","06"]` order is preserved (02 before 01) because it's the existing design. Don't "fix" it unless asked.
4. **Stale `dist/` warning.** The existing `dist/` folder predates the restructure. Running `npm run build` will regenerate it; the old artifact should not be deployed.
5. **Casework restoration.** Source for the seven Tier-1 cards, Four Pillars wedges, and (if ever populated) doctrine cards is preserved as `_archivedCompanies` / `_archivedWedges` / `_archivedDoctrineCards` in `copy.v1_1.ts`. They are not referenced by render code; they exist solely as restoration material. Leave them alone unless explicitly asked to restore.

---

## 9. Owner notes (voice & posture)

The owner is terse, decisive, doctrine-fluent. Match the register of the existing copy: first-person, declarative, no marketing language ("excited to share", "passionate about", "AI-powered" are banned). No exclamation marks. No "delight." When committing to a decision, commit and move; don't narrate deliberation.

The owner reads short responses with explicit choices and acts on them. When a decision needs to be made and you don't have the input, present 2–4 sharp options or a single binary, never an open prompt.

The dossier itself enforces the same posture: "documentation under pressure," not spectacle. Mass over swagger. Real units, not hype units. The voice and the artifact share a register.
