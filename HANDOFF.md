# CT-DOSSIER — Agent Handoff (V3.7.6)

**Read this first.** Current as of **V3.7.6** (`a447c79`, 2026-06-24). This session
rebuilt the route UI into a **Crease Map**, **removed the module filter**, retired
the `?read=30s` door landing, fixed the **Back button**, and trimmed module 00.
§8 is the changelog — it records the reversals so you don't re-litigate a decision.

> ⚠️ Two big reversals happened this session. Read §4 and §8 before changing the
> route/lens behavior, or you will rebuild something the owner already rejected.

> **UPDATE 2026-07-04 — this doc predates V4.0.0; read this delta first.**
> The site is now the **V4.0.0 five-section spine** (commit `4678abf`), not the
> module list in §3 below. Current rendered spine, **INDEX (06)**:
> `00 FRONT MATTER (cream) · 01 BIOGRAPHY (blue) · 02 INFLUENCES (cream) ·
> 03 ARTIFICIAL INTELLIGENCE (black) · 04 AMERICAN DYNAMISM (clay) ·
> 05 BRAND (black)`. **The route / lens system is GUTTED** — `ROUTES` in
> `constants.tsx` is now an empty array and `CreaseMap.tsx` renders only the
> thesis frame, so §4 / §6 / §9's route-model narrative is **obsolete** (kept
> for history; ignore the filter/lens mechanics).
>
> **Session 2026-07-04 (uncommitted → commit `f00fcf0` on `dossier-fold`, LOCAL, not pushed):**
> 1. **Tab entrance motion** — one-time linear "drafting-table" pan-to-rest on
>    first load. `--tab-*` law block in `index.css`; `App.tsx` arms every tab
>    layer off one rAF-committed frame (`data-tab-armed` on `<main>`);
>    `ModuleStrata` staggers each `.module-tab-skin` (a 1px hairline that pans
>    in from the right) by `stackIndex`. Transform-only (no h-scroll);
>    reduced-motion → instant. NO images/skins — the SVG tab skins from the
>    `experiment/svg-exterior-tabs` branch were deliberately NOT used here.
> 2. **Ledger Card** — `components/Card.tsx`, one shared component replacing the
>    four hand-duplicated link cards (BIO article, AI tools, AD projects, Brand
>    essays). Ledger split: mono rail (KIND top / CTA foot) + roman-serif
>    content, hairline divider, **borderless**, `currentColor` (inherits each
>    band's own foreground — no per-theme override). `--card-*` law in `index.css`.
> 3. **Titles** — `BIO → BIOGRAPHY`, `AI → ARTIFICIAL INTELLIGENCE`
>    (`copy.v1_1.ts`); added a `register` field to the AI links for the eyebrow.

> **UPDATE 2026-07-10 — DEPLOY TOPOLOGY + iframe widgets. READ BEFORE DEPLOYING.**
>
> **Two Vercel projects now serve this codebase; know which one you're hitting:**
> - **`dossier-fold`** → `dossier-fold.vercel.app` — **canonical**. As of 2026-07-10 it
>   serves the CURRENT work (olive/BRONC palette + both iframe widgets, promoted
>   deliberately by owner decision — deployment `dossier-fold-dm584xyiw`).
> - **`dossier-3`** → `dossier-3.vercel.app` — the parallel/experimental line.
> - **`.vercel/project.json` in this working copy is linked to `dossier-3`.** A plain
>   `vercel deploy --prod --yes` goes to dossier-3, NOT canonical. To promote to
>   canonical: back up `.vercel/project.json` → `vercel link --yes --scope
>   researchdirector --project dossier-fold` → `vercel deploy --prod --yes` → restore
>   the backed-up `project.json`. ALWAYS restore the dossier-3 link afterward.
> - **Verify which site you're LOOKING at before reporting a regression.** The two
>   domains render near-identically. `curl -s <site>/ferris/app.js | grep -c openLightbox`
>   or compare bundle hashes. A "missing feature" was twice (2026-07-09/10) just the
>   stale sister site or a DEAD localhost:3100 tab.
> - ⚠️ **A parallel agent/process shares this repo** and has committed, pushed
>   (`dossier-fold/main`), and deployed to the canonical Vercel project WITHOUT being
>   asked (2026-07-09: stale snapshot went live on canonical). Check `git log`,
>   `git reflog`, and `vercel ls dossier-fold` before assuming state — and before
>   diagnosing "how did canonical change."
>
> **Module content swaps (both are self-contained iframe embeds under `public/`):**
> 1. **01 BIOGRAPHY map** — static inline SVG replaced by the interactive
>    `public/neighboring-practices.html` (32 practitioners, ranked panel, olive plate;
>    position radius bound to the measured `distance` field). Embedded via
>    `components/NeighborPracticesMap.tsx` (auto-height iframe via postMessage).
> 2. **02 INFLUENCES** — `InfluenceAtlas` replaced by the **FERRIS astrolabe**
>    (`public/ferris/`: index.html + app.js + styles.css + IMAGES/ + fonts/). Embedded
>    via `components/FerrisInfluences.tsx`. 7 influences (N.B. merged into Neville
>    Brody), per-artist `↗` reference links, click-a-clipping **lightbox**, canvas
>    matched to the band cream `#F2EFE4`, stacking breakpoint 719px. `InfluenceAtlas.tsx`
>    + its copy fields are now dead code (left in place).
> - **Fonts are self-hosted everywhere** (`public/fonts/`, `public/ferris/fonts/`) — do
>   NOT reintroduce Google-Fonts `@import`s in the widgets.
> - Widget heights sync via `postMessage`; measure the content root's
>   `getBoundingClientRect().height`, never `documentElement.scrollHeight` (floored at
>   iframe viewport → frame can never shrink; caused the "empty olive strip" bug).
> - Exhibit images in `public/ferris/IMAGES/` are third-party reference material —
>   rights NOT cleared (README caveat) — flag before serious public promotion.

---

## 0. CRITICAL — where it lives and deploys

> **UPDATE 2026-07-01 — new version repo `dossier-3`.** This working copy was pushed to a
> **new, separate remote `dossier-3`** → `github.com/augustave/dossier-3`, branch `main`
> (`git push dossier-3 HEAD:main`). The local branch's upstream was **repointed to
> `dossier-3/main`**, so a plain `git push` now goes there — never into the older repos.
> First push carried the repo-hygiene commit `c9f8516` (removed stale root bundles
> `l.js`/`lv.js` + the `gh-pages` deploy workflow). The `dossier-fold`, `origin`, and
> `founder-archive` remotes were left untouched.
> **Owner decision (2026-07-01): `dossier-3` is a PARALLEL / experimental version kept
> ALONGSIDE the canonical one — it does NOT replace it.** `dossier-fold.vercel.app` (repo
> `dossier-fold`) stays the canonical live site; the Vercel / `dossier-fold` lines below
> still stand. THIS working copy is the dossier-3 parallel line — its pushes default to
> `dossier-3/main`. Do NOT push this copy to `dossier-fold` unless you deliberately mean to
> merge the parallel work back into canonical.

- **Canonical home: `https://dossier-fold.vercel.app`** (Vercel project `dossier-fold`).
- **Git: push to the `dossier-fold` remote, branch `main`** → `git push dossier-fold HEAD:main`
  (repo `github.com/augustave/DOSSIER-FOLD`). The local working branch is also named `dossier-fold`.
- **NEVER push `origin`** → that's `github.com/augustave/CT-DOSSIER`, a separate **STALE
  GitHub Pages** site (pre-V3.6.1). Not this site. If a reader reports something that
  doesn't match the code, check they aren't on the stale Pages site.
- **Deploy:** `vercel deploy --prod --yes` (scope `researchdirector`, alias `dossier-fold.vercel.app`).
- **Working dir:** `/Users/taoconrad/Dev/GitHub 4/CT-DOSSIER copy 2/Founder` (a COPY; the
  git repo is `Founder/`, the parent dir is NOT a repo). Sibling `…/CT-DOSSIER/Founder`
  is the **stale V3.5.3** folder — do not work in it.
- **This folder now carries 4 git remotes:** `dossier-3` (current push target — the branch
  tracks `dossier-3/main` as of 2026-07-01), `dossier-fold`, and the footguns `origin` +
  `founder-archive`. NEVER push `origin`/`founder-archive`; only push `dossier-fold` if you
  deliberately mean to update that older version.

## 1. What CT-DOSSIER is
A single-page React/Vite **SPA** — one scrolling document, **not a portfolio** (built
work lives on 3 external sites). It is a presentation dossier / thesis. The landing
claim is **"THE BRAIN IS THE PRODUCT."** The whole surface is a stack of fold modules
with a **Crease Map** at the top that stamps a reading **route** (orientation only).

If you're tempted to add project cards/galleries here — **stop**, that's portfolio work
for the external sites.

## 2. Tech & file map (all under `Founder/`)
- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind 3 + Vitest 4. Static only.
- `App.tsx` — shell, masthead, **URL/history model** (pushState + popstate, §6), open/scroll
  choreography, module render loop, `selectRoute`, `recommendedIndices`.
- `components/CreaseMap.tsx` — **the top fold + route selector** (NEW this session, §4).
- `components/ModuleStrata.tsx` — band component (theme/shadow, the `Fold` panel, post-fold re-anchor).
- `components/Fold.tsx` — the single collapse primitive (`data-open` / `data-pleat-open`, §5).
- `components/FrontMatterContent.tsx` — module 00 content (now just headline + work links).
- `components/ManifestOverlay.tsx` — the INDEX overlay (lists ALL 9 + RECOMMENDED markers).
- `components/PleatFold.tsx`, `VisualLanguages.tsx`, `DoctrineLibrary.tsx` — module internals.
- `components/Card.tsx` — **the one link-card** (ledger split; article/tools/projects/essays). See top UPDATE + §5b.
- `constants.tsx` — `CONTENT_MODULES`, `COLORS`, `AUDIENCES`; **`ROUTES` is now `[]`** (route system gutted at V4.0.0 — `RouteValue`/`isRouteValue` kept so `App.tsx`/`CreaseMap` still compile). Renders `<Card>` at the four link-card sites.
- `copy.v1_1.ts` — editorial copy + `meta.version` (the visible `Vx.x.x` label). Module titles live here (`modules.bio.title` = "BIOGRAPHY", `modules.ai.title` = "ARTIFICIAL INTELLIGENCE", …).
- `index.css` — fold/pleat law **plus the `--tab-*` (tab entrance) and `--card-*` (ledger card) law blocks** added this session.
- `App.test.tsx` — **28 Vitest tests**.
- `index.html` — metadata/OG (canonical = dossier-fold.vercel.app). `tailwind.config.cjs` — tokens (incl `fontSize.hero`, `jsx` in content globs).
- **Deleted this session:** `components/ThirtySecondView.jsx` (the retired ?read=30s door).

## 3. Module architecture (V4.0.0 — current)
```
00 FRONT MATTER            cream   ← thesis + "Built work lives at" links
01 BIOGRAPHY               blue    ← "My First CPO" ledger article card + Field Position chart
02 INFLUENCES              cream
03 ARTIFICIAL INTELLIGENCE black   ← Five Axioms + tool ledger cards (self-pleat)
04 AMERICAN DYNAMISM       clay    ← project ledger cards
05 BRAND                   black   ← essay ledger cards (self-pleat)
```
- **INDEX count = (06)** — six rendered bands (00–05). MANIFEST (index "00") is the
  index OVERLAY, not a band. Titles are data-driven from `copy.v1_1.ts`.
- Root `/` loads with all bands visible + the thesis frame at top (routes are gutted — see top UPDATE).
- The four **link-card sites** (01 article, 03 tools, 04 projects, 05 essays) all render `<Card>` (§5b).

## 4. The Crease Map + the route model (OBSOLETE as of V4.0.0 — history only)
> **Gutted at V4.0.0 (`4678abf`).** `ROUTES` is now `[]` and `CreaseMap.tsx` renders only
> the thesis frame — there is no lens/route selector, no `?read=` filtering, no route bands.
> The section below describes the retired system; keep it only to understand old commits.

`CreaseMap.tsx` is the dossier's **top fold** and route selector. It replaced the old
"reading-lens strip." Two reversible states (fold-native):
- **Overview** — compact bet (`THE BRAIN IS THE PRODUCT`) + `Read as —` + **5 folding
  route bands**: `MOUNTAIN · HIRING MANAGER`, `VALLEY · CLIENT`, `MOUNTAIN · COLLABORATOR`,
  `VALLEY · ACADEMIC`, `FLAT SHEET · FULL DOSSIER` (prefix = the dossier's pleat language).
- **Selected** — the chosen band **unfolds into its route stamp** (label · path · helper ·
  Best if) while the others **fold away** (grid-rows `0fr/1fr` + a `rotateX` crease).
  Clicking the open band's header folds it back to the overview (reversible, no trap).
- The **row IS the interaction.** No hero CTA, no default route, no Start Path / Change
  Lens / Study All, no strata-blue. Selecting only sets `?read=` + marks the Index.

**THE ROUTE IS AN ORIENTATION AID, NOT A FILTER.** All 9 modules ALWAYS render. The
route stamps a path + drives Index `RECOMMENDED` markers (OPEN > RECOMMENDED > NORMAL).
- This was a **filter** in V3.6.9 (owner demanded it) and was **reversed** in the V3.6.8
  Crease Map (owner confirmed: "all 9 modules remain visible · no content filtering").
  **Do not re-introduce filtering** — it's a failure criterion. (Owner memory updated.)
- Routes are data-driven from `ROUTES` in `constants.tsx` — new audience = one entry.

## 5. The fold system (DO NOT change physics without explicit direction)
`Fold.tsx` is the one collapse primitive: height via `grid-template-rows 0fr→1fr` keyed
on `[data-open]`; pleats rotate keyed on `[data-pleat-open]` (split is load-bearing —
"first-open paint-baseline" fix). Per-context angles in `index.css` (prose 60°, archive
22° uniform, chart 30°). Self-pleating modules (00/03/06) render their content bare.
Reduced motion → fade. **Matte doctrine: pure-black shadows, no glow/glint/gradient; 04
one plane; 06 grid stable.** The CreaseMap bands reuse a lighter version of this fold.

## 5b. Tab entrance motion + ledger cards (added 2026-07-04, commit `f00fcf0`)
Two new, self-contained systems. Both stay inside matte doctrine; neither touches the
fold/pleat physics.

- **Tab entrance motion** (`--tab-*` law in `index.css`). Each band carries a thin
  `.module-tab-skin` hairline that **pans in from the right once on first load** and
  hard-stops — `--tab-ease: linear` (constant velocity, no ease-in/out, no overshoot;
  "drafting-table robotic"), `--tab-duration: 900ms`, `--tab-distance: 100%` (self-
  relative → never makes a horizontal scrollbar), `--tab-stagger: 90ms × stackIndex`.
  Armed ONCE by `App.tsx` via a double-rAF flip of `data-tab-armed` on `<main>` (same
  paint-baseline trick as `Fold.tsx`), with a `setTimeout` fallback. Reduced-motion →
  instant, content never hidden. **No image/SVG skins** — those live only on the frozen
  `experiment/svg-exterior-tabs` branch and were deliberately kept off canonical.
- **Ledger `Card`** (`components/Card.tsx`, `--card-*` law). ONE component for every
  eyebrow+title+CTA link (01 article, 03 tools, 04 projects, 05 essays) — replaced four
  hand-duplicated variants. Ledger split: mono rail (`w-16 sm:w-20`, KIND on top / CTA
  `→`|`↗` at the foot) + a hairline `border-r` divider + roman-serif (`font-serif`,
  **not italic**) title and sans subtitle on the right, seated on a `border-t` rule.
  **Borderless, no fill:** text is `currentColor`, so each card inherits its band's own
  foreground — do NOT reintroduce a forced text color (an earlier `text-[#111111]` on a
  cream fill washed out on the blue/clay/black bands). Optional `meta` (real values only
  — no fabricated dates) and `image` slots exist for later.

## 6. URL / history model (NEW — the Back-button fix, §8 V3.7.5)
- State lives in **query + hash**, never path segments. `?read=<route>` (`hiring | client
  | collab | acad | full`, + long-form aliases `collaborator`/`academic`) + `#module-NN`.
- **Navigation PUSHES history** (`writeRouteToUrl`, `writeModuleHash` use `pushState`);
  mount cleanup (`?read=30s` strip) REPLACES. A single **`popstate`** handler resyncs the
  WHOLE state from the URL (route + open/close) WITHOUT re-pushing. There is **no
  `hashchange` listener** anymore (popstate covers back/forward; avoids double-fire).
- Net: **Back steps module → route → overview → exit.** `requestOpenModule(index, writeUrl)`
  and `closeModule(writeUrl)` take a flag so popstate-driven changes don't pollute history.
- `?read=30s` is **retired** → stripped to `/` on mount. Unknown `?read=` → neutral.
- Open/scroll choreography (scroll-first → settle → delayed close → re-anchor) is unchanged;
  popstate reuses the same open path. Root load resets scroll to top.

## 7. Footer colophon (V3.6.10)
Warm cream "inside back cover" (`#eee9dd` / `#d6ccbb` seams / `#8a8378` muted). Three
columns (Identity / Correspondence / Actions) + a small mono seal `Doctrine · Evidence ·
Conversation` + an inline **matte US flag** SVG (`UsFlag` in App.tsx — 13 stripes, 50
stars, flat official colors, hairline frame). CTAs = one prefilled mailto.

## 8. Changelog (this session — reversals noted)
- **Folder/deploy consolidation** — confirmed canonical = dossier-fold.vercel.app; killed dual
  dev servers; pushed local (tab-skins reverted `e5bd493`) → remote; redeployed.
- **Reading Lens saga** (route stamp UX, several reversals):
  - `4e62556` surface lens at root · `dcded9e` V3.6.5 Route System (START PATH) · `3979c78`
    V3.6.6 simplify to stamp + CHANGE LENS · `2776c75` V3.6.7 pure stamp (removed controls —
    trapped the user) · `3da52a9` V3.6.8 **restore CHANGE LENS** · `ca1adec` V3.6.9 **FILTER**
    (owner: "every tab still there") · `912131a` filtered-count UX.
- **Footer** — `7344aa5` V3.6.10 colophon · `fa699af` US flag.
- **30s landing (Move 1)** on branch `feature/three-moves`, merged at V3.7.0:
  `04442b4` thesis screen · `e3f8772` folding lens selector · `5040119` on-doctrine re-skin ·
  `64e2f53` "Thesis-First, One Door" restructure (+ design-system doc) · `54d2c9d` V3.7.0 merge.
- **`d51e7d7` V3.6.8 Crease Map** — the big one: route UI → Crease Map at top of `/`; **filter
  REMOVED** (back to orientation aid, all modules visible); `?read=30s` door **retired** +
  `ThirtySecondView.jsx` deleted; ManifestOverlay restored to all-9 + RECOMMENDED.
- `199f8eb` copy patches (For/Not spacing, "00–08 · COMPLETE READ").
- `91f5455` **restored the fold animation** on the route bands (was hard-swapping).
- `432d209` landing claim → **"THE BRAIN IS THE PRODUCT"** (removed support + For/Not lines).
- `4c87c2b` **V3.7.5 Back-button fix** (pushState + popstate, §6).
- `a447c79` **V3.7.6 module 00 trim** — headline + work links only (removed identity sublines,
  body, pullout). Role line still lives in the footer colophon.
- `4678abf` **V4.0.0 five-section spine** (`feat(swap)!`) — restructured to the PRD spine:
  `00 FRONT MATTER · 01 BIOGRAPHY · 02 INFLUENCES · 03 ARTIFICIAL INTELLIGENCE ·
  04 AMERICAN DYNAMISM · 05 BRAND` (INDEX 06). **Route/lens system gutted** (`ROUTES = []`,
  CreaseMap = thesis frame only) — §4/§6/§9 route mechanics are now obsolete. `cf5ebbe`
  restrained BIO article card (pre-ledger).
- `f00fcf0` **UI session 2026-07-04** (on `dossier-fold`, LOCAL, not pushed) —
  (1) tab entrance motion (`--tab-*`, §5b); (2) ledger `Card.tsx` unifying the four link
  cards (`--card-*`, §5b); (3) titles `BIO→BIOGRAPHY`, `AI→ARTIFICIAL INTELLIGENCE`.
  Verified via `getComputedStyle` (preview screenshots were unreliable — see §13).
- `971fbce` **docs** — this HANDOFF + README synced to the V4.0.0 spine (on `dossier-fold`).
- `a714102` **BRONC palette reskin** (on branch **`experiment/bronc-palette`**, off `971fbce`,
  LOCAL/not pushed, NOT merged to canonical) — matte olive/putty→cream/near-black/dark-olive-drab
  palette; `.strata-band` band shaders (top-edge seam-shade + paper grain); FRONT MATTER top-edge
  shade removed; landing copy edits (thesis subhead → Frontier-AI/American-Dynamism line, FRONT
  MATTER headline, curly quotes, redundant AI-grid border removed). **Uncommitted on that branch:**
  the "uncoated cardstock" texture (`.strata-band::before` → micro-stipple + crease + coarse grain).
  Full session narrative + every debugging incident/fix: **see `BUILD_LOG.md`.**

## 9. Invariants (don't break)
- **Route = orientation, NEVER a filter.** All 9 modules always render. (See §4.)
- **Crease Map** is the route UI (not a "lens strip"/"tabs"); the row is the interaction.
- **Back-button**: keep pushState-on-nav + the single popstate resync (no hashchange).
- **Fold physics frozen.** Matte doctrine. 04 one plane, 06 grid stable.
- **Push `dossier-fold` only.** Never `origin`.
- Module-00 trim is intentional (owner). Don't restore the removed copy.

## 10. Known limitations / open items (not blocking)
- **product-marketing context** `.agents/product-marketing.md` has 7 `[NEEDS INPUT]` gaps
  (pricing, clearance facts, real quotes/metrics/clients, competitors) — needs the owner.
- **IA doc** `.design/ct-dossier/INFORMATION_ARCHITECTURE.md` — recommendations are "hold the
  line" guardrails (2-level nav, Index-only jump, fixed spine); already enforced.
- Optional naming hygiene: internal types still say `Audience`/`AUDIENCES` (UI is all "route").
- `feature/three-moves` branch retains the OLD `?read=30s` door landing (pre-Crease-Map) if
  you ever want to compare; it is superseded.
- The stray "I am not trying to make complex things simple…" line still exists in module copy
  (`copy.v1_1.ts`, NOT module 00) — left intentionally (it's other module content).

## 11. Verify & deploy
1. `cd Founder && npm run typecheck` · `npm test -- --run` (28) · `npm run build`.
2. Real-browser QA on a fresh dev port (`npx vite --port 3210 --strictPort`). Verify motion
   (fold, crease) in a real browser, not screenshots — **preview/port gotchas: see §13.**
3. `git push dossier-fold HEAD:main` · `vercel deploy --prod --yes` · curl-verify the live
   bundle hash matches local + version.

## 12. Skills installed (via `npx skills add`, in `.agents/skills/`, symlinked to `.claude/skills/`)
- `product-marketing` (coreyhaines31/marketingskills) — created `.agents/product-marketing.md`.
- `information-architecture` (julianoczkowski/designer-skills) — created `.design/ct-dossier/INFORMATION_ARCHITECTURE.md`.
- Both register in the Skill tool on session reload. `.agents/` and `.design/` are in the
  PARENT dir (outside the `Founder/` git repo) — planning artifacts, they don't ship.

## 13. Environment gotchas
- **Two agents worked the same repo** this session (identical commit hashes prove it). Check
  `git log` before assuming state.
- **Preview screenshots freeze animation** at frame 0 AND came back BLANK even while the app
  rendered fine — DOM/`getComputedStyle` / `preview_inspect` are the reliable signal (verify
  colors, `font-style`, border color, bounding box); eyeball motion in the owner's real browser.
- **Do NOT stop/start the preview MCP server repeatedly to chase a screenshot** — it dies and
  leaves `localhost:3100` DEAD, which the owner sees as "the UI regressed / my work is gone"
  (it happened 2026-07-04). Run the dev server as a **durable background Bash process**
  (`npm run dev -- --port 3100 --strictPort`, backgrounded); confirm with `curl` (poll to 200)
  and `lsof -iTCP:3100 -sTCP:LISTEN`. If a screenshot is blank, `curl localhost:3100` FIRST —
  a dead server looks identical to a tab-sync bug. After any churn, tell the owner to hard-refresh.
- **Port 3000** is held by a different project's dev server — use another port.
- The in-app preview browser holds **stale tabs / cross-talks**; open a clean tab to the exact URL.
