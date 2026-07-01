# CT-DOSSIER — Agent Handoff (V3.7.6)

**Read this first.** Current as of **V3.7.6** (`a447c79`, 2026-06-24). This session
rebuilt the route UI into a **Crease Map**, **removed the module filter**, retired
the `?read=30s` door landing, fixed the **Back button**, and trimmed module 00.
§8 is the changelog — it records the reversals so you don't re-litigate a decision.

> ⚠️ Two big reversals happened this session. Read §4 and §8 before changing the
> route/lens behavior, or you will rebuild something the owner already rejected.

---

## 0. CRITICAL — where it lives and deploys

> **UPDATE 2026-07-01 — new version repo `dossier-3`.** This working copy was pushed to a
> **new, separate remote `dossier-3`** → `github.com/augustave/dossier-3`, branch `main`
> (`git push dossier-3 HEAD:main`). The local branch's upstream was **repointed to
> `dossier-3/main`**, so a plain `git push` now goes there — never into the older repos.
> First push carried the repo-hygiene commit `c9f8516` (removed stale root bundles
> `l.js`/`lv.js` + the `gh-pages` deploy workflow). The `dossier-fold`, `origin`, and
> `founder-archive` remotes were left untouched.
> **Open question for the owner:** is `dossier-3` now the canonical home, or a parallel
> version? Until that's decided, the Vercel / `dossier-fold` lines below still describe the
> previously-canonical deploy.

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
- `constants.tsx` — `CONTENT_MODULES`, `COLORS`, `AUDIENCES`, **`ROUTES`/`RouteValue`/`isRouteValue`** (the Crease Map data).
- `copy.v1_1.ts` — editorial copy + `meta.version` (the visible `Vx.x.x` label).
- `App.test.tsx` — **28 Vitest tests**.
- `index.html` — metadata/OG (canonical = dossier-fold.vercel.app). `tailwind.config.cjs` — tokens (incl `fontSize.hero`, `jsx` in content globs).
- **Deleted this session:** `components/ThirtySecondView.jsx` (the retired ?read=30s door).

## 3. Module architecture
```
00 FRONT MATTER  cream  ← taste thesis + "Built work lives at" links ONLY (trimmed V3.7.6)
01 TASTE         cream  02 SEEING clay  03 VISUAL LANGUAGES black (self-pleat)
04 THE NEIGHBORHOOD blue (chart, one plane)  05 DOCTRINE cream  06 DOCTRINE LIBRARY black (self-pleat)
07 PORTFOLIOS    ?      08 OPERATING BIOGRAPHY ?
```
- **INDEX count = (09)** — always; the route NEVER hides modules.
- Root `/` loads with all modules visible + Crease Map overview (no route selected).

## 4. The Crease Map + the route model (READ THIS)
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
2. Real-browser QA on a fresh dev port (`npx vite --port 3210 --strictPort` — **3000 is a
   different project, "Dirty Canvas"**). Preview tool FREEZES CSS animation at frame 0 —
   verify motion (fold, crease) in a real browser, not screenshots.
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
- **Preview screenshots freeze animation** at frame 0 — DOM/`getComputedStyle` checks are the
  reliable signal for fold/crease; eyeball motion in the owner's real browser.
- **Port 3000** is held by a different project's dev server — use another port.
- The in-app preview browser holds **stale tabs / cross-talks**; open a clean tab to the exact URL.
