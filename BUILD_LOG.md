# CT-DOSSIER — Build Log (2026-07-04 → 05 session)

Full record of this build: what was made, in what order, and **every debugging incident + how it was solved**. Source of truth is git; this narrates it.

- **Branches touched:** `dossier-fold` (canonical, commits `f00fcf0`, `971fbce`) → `experiment/bronc-palette` (branched off `971fbce`; commit `a714102` + uncommitted cardstock texture).
- **Not pushed.** All work local. Canonical live site (`dossier-fold.vercel.app`) is unchanged.

---

## 1. Timeline (what shipped, in order)

### Phase A — Tab entrance motion (`f00fcf0`, on `dossier-fold`)
A one-time **linear "drafting-table" pan-to-rest** on first page load. Each band carries a thin `.module-tab-skin` hairline that pans in from the right and hard-stops (constant velocity, no ease, no overshoot), staggered top→bottom.
- `index.css`: `--tab-*` law block (`--tab-ease: linear`, `--tab-duration: 900ms`, `--tab-distance: 100%`, `--tab-stagger: 90ms`).
- `App.tsx`: arms all tabs once via a double-rAF flip of `data-tab-armed` on `<main>` (+ `setTimeout` fallback) — same paint-baseline trick as `Fold.tsx`.
- `ModuleStrata.tsx`: staggers each skin by `stackIndex`. Reduced-motion → instant; transform-only (no h-scroll).
- **NO SVG images** — the exterior tab-skin *pictures* were deliberately NOT used (they live only on `experiment/svg-exterior-tabs`, reverted from canonical 2026-06-22).

### Phase B — Module title renames (`f00fcf0`)
`copy.v1_1.ts`: `BIO → BIOGRAPHY`, `AI → ARTIFICIAL INTELLIGENCE`. Added a `register` field to the AI links for the card eyebrow.

### Phase C — Ledger `Card` component (`f00fcf0`)
New `components/Card.tsx` replaced four hand-duplicated link cards (BIO article, AI tools, American Dynamism projects, Brand essays). **Ledger split:** mono rail (KIND top / CTA foot) + hairline divider + roman-serif content, borderless, `currentColor` (inherits each band's foreground). `--card-*` law in `index.css`.

### Phase D — Doc sync (`971fbce`)
`HANDOFF.md` + `README.md` corrected from the stale pre-V4 spine to the live V4.0.0 spine (BIOGRAPHY/INFLUENCES/AI/AMERICAN DYNAMISM/BRAND, INDEX 06); route/lens system flagged obsolete (`ROUTES = []`); added §5b (tab motion + ledger cards) + changelog.

### Phase E — BRONC palette reskin (`a714102`, on `experiment/bronc-palette`)
Reskinned the whole site to the BRONC (mezcal-bar) identity: matte olive / warm cream / near-black / dark-olive-drab.
| Token | Old | New |
|---|---|---|
| `strata-blue` (BIOGRAPHY, selection, index accent) | `#5E7CFF` | **olive `#6E7248`** |
| `strata-cream` (FRONT MATTER, INFLUENCES, body) | `#F2EFE4` | **kept `#F2EFE4`** (putty reverted, see §2.7) |
| `strata-black` (AI, BRAND) | `#050505` | **`#0A0A0A`** |
| `strata-clay` (AMERICAN DYNAMISM) | `#8F6F50` | **dark olive-drab `#464A2C`** |
- Files: `tailwind.config.cjs`, `index.css` (olive band text warmed to off-white; scrollbar), `index.html` theme-color, `og-card.svg`.
- Vivid accents kept per owner (chart lime `#E5FF00`, register colors) — deliberate signal pop against matte olive.

### Phase E2 — Band shaders + FRONT MATTER top fix (`a714102`)
`.strata-band` subtle top-edge seam-shade + paper grain on all bands; tab-line feathered to a 3px gradient. **FRONT MATTER (module 00) top-edge shade removed** (`#module-00::after { display: none }`) — spurious on the top band (no sheet above it). See §2.6.

### Phase F — Landing / copy edits (some in `a714102`, latest uncommitted)
- `CreaseMap.tsx`: removed the old thesis subhead ("I turn complex systems into visual languages"), replaced with the two-sector line (Frontier AI / American Dynamism), curly typographic quotes.
- `FrontMatterContent.tsx`: headline → "Creating visual identities for entirely new categories that lack existing design precedents".
- `constants.tsx`: removed the redundant full-width `border-t` above the AI tool cards (ledger cards already draw their own top rule).

### Phase G — Cardstock texture (**UNCOMMITTED**, `index.css`)
Texture direction "uncoated aged archival cardstock, high friction." `.strata-band::before` upgraded from one grain layer to **three matte/multiply layers**: (1) micro-stipple dots (`--band-stipple: 0.05`), (2) faint crease lines (baked `stroke-opacity 0.05`), (3) coarse grain (feTurbulence `baseFrequency 0.7`, baked `opacity 0.3`). Self-contained SVG data-URIs.

### Phase H — Instruction hardening (parent-dir `CLAUDE.md`, not in git repo)
Added `## Working mode` (default to smallest patch; skip HANDOFF/PRACTICE_STRATEGY reads for mechanical edits; no 3-options) + `## Project terms` (pins "tabs" = module bands; SVG skins only on `experiment/svg-exterior-tabs`; spine = 6 bands 00–05). Softened the "3 options" preference. Reconciled the CT-DOSSIER row's "read HANDOFF before changing anything" to match Working mode. Diagnosis in `../AGENT_MISUNDERSTANDING_DIAGNOSIS.md`.

---

## 2. Debugging log — problem → cause → fix

### 2.1 Preview screenshots came back BLANK / frozen
- **Symptom:** `preview_screenshot` returned blank-cream frames even while the app rendered fine; earlier notes say it also freezes CSS animation at frame 0.
- **Cause:** the in-app preview MCP browser holds **multiple desynced tabs** (eval-tab scrolled into a module while the screenshot-tab sat at page top) and freezes motion. Documented in `HANDOFF.md` §13.
- **Fix:** treat **`getComputedStyle` / `preview_inspect` / `curl` as the authoritative signal**, not screenshots. Verified colors, `font-style`, border colors, bounding boxes, and served-CSS greps instead of pixels.

### 2.2 `localhost` went dead → owner saw "the UI regressed / my work is gone"
- **Symptom:** owner refreshed `localhost:3100` and got a blank/dead page; read it as lost work and a regression. High-stress false alarm.
- **Cause:** I repeatedly **stopped/started the preview MCP server and killed the Bash dev server** while chasing a screenshot. Each kill left port 3100 dead; the owner's refresh hit nothing. Git proved nothing was lost (`git status` = clean, all edits present).
- **Fix:** run the dev server as a **durable background Bash process** (`npm run dev -- --port 3100 --strictPort`, `run_in_background: true`); confirm with a `curl` poll to HTTP 200 + `lsof -iTCP:3100 -sTCP:LISTEN`; **stop thrashing the server**; tell the owner to hard-refresh once it's confirmed up. Captured as a memory: `feedback_preview-and-server-handling`.

### 2.3 Branch confusion (canonical vs experiment vs frozen fork)
- **Symptom:** first tab-motion attempt used the OLD copy deck (TASTE/SEEING/VISUAL LANGUAGES), not the live V4.0.0 spine.
- **Cause:** three overlapping meanings of "tabs" across three branches — SVG skins on `experiment/svg-exterior-tabs` (frozen, pre-revert), the `.module-tab-skin` hairline, and the module bands. The frozen fork carries stale copy.
- **Fix:** confirmed canonical = `dossier-fold` (V4.0.0) by reading `constants.tsx` module titles + `copy.v1_1.ts` `meta.version`; ported the motion onto `dossier-fold`. Pinned the naming in `CLAUDE.md` § Project terms.

### 2.4 Card redesign read as "just a color change"
- **Symptom:** owner: "WHAT THE FUCK is the card change… this was just a color change."
- **Cause:** I modeled the shared `Card` on BIO's **existing** look (bordered box → cream fill + shadow) — a fill/shadow swap, not a structural redesign. Layout/type/hierarchy unchanged.
- **Fix:** rebuilt as **ledger split** (mono metadata rail + hairline divider + roman serif) — a real compositional + typographic change. Confirmed direction with the owner before building.

### 2.5 Card text washed out on colored bands
- **Symptom:** on the blue/olive band, card text was near-invisible.
- **Cause:** an early Card used `text-[color:var(--text-primary)]`, but `--text-primary` is **redefined per theme** (`.theme-blue` sets it to a light color for text ON blue) → on a cream fill it resolved to the wrong light value. A literal `text-[#111111]` was a patch, but still wrong on dark bands.
- **Fix:** the final ledger Card is **borderless with `currentColor`**, so text simply inherits each band's own foreground — no per-theme override, no wash-out.

### 2.6 "Reduce the FRONT MATTER top border" — owner saw no change (twice)
- **Symptom:** owner reduced-shade requests appeared to do nothing ("still the same," "we are in the same situation").
- **Cause (compound):** (a) I first reduced `#module-00::after` to 1/4 (24px→6px), which **was** applied server-side (`getComputedStyle` = 6px) — but (b) the owner's browser served **stale cached CSS** and (c) I'd **killed the server under them** while inspecting, so their refresh hit an old/dead instance. `Cache-Control: no-cache` only revalidates when the server is up.
- **Fix:** measured the real `::after` height with `getComputedStyle` to prove the change landed; then **removed the FRONT MATTER top-edge shade entirely** (`display: none` — it's spurious on the top band with no sheet above it); stabilized the server and stopped killing it. The remaining faint line there is the tab entrance-motion mark (intentional).

### 2.7 Putty paper too dark
- **Symptom:** owner: "reverse the paper color… this one is too dark."
- **Cause:** the BRONC reskin set `strata-cream` to putty `#D8CAB0`, which read heavier than the owner wanted for the light "paper" bands.
- **Fix:** reverted `strata-cream` to `#F2EFE4` (body, footer, scrollbar, og-card, theme-color all followed) while keeping olive / near-black / dark-olive-drab.

---

## 3. Current state (as of this log)

- **Branch:** `experiment/bronc-palette`.
- **Committed:** `a714102` (palette + shaders + FRONT MATTER fix + copy edits) on top of `971fbce` (docs) and `f00fcf0` (tab motion, ledger cards, renames).
- **Uncommitted:** `index.css` — the Phase G cardstock texture (grain/stipple/crease).
- **Server:** run durably in the background (see §2.2); verify via `curl localhost:3100` + `getComputedStyle`, not screenshots.
- **Tunable knobs:** `--band-stipple`, `--band-edge` in `index.css`; grain/crease alpha baked in their SVG strings; palette hexes in `tailwind.config.cjs`.

## 4. Open items
- Cardstock texture (Phase G) is uncommitted — commit or tune first.
- BRONC branch is experimental; NOT merged to canonical `dossier-fold` and NOT pushed. Owner decision required before either.
- Texture multiplies on mid/dark bands (olive/clay/black) → slight darkening; watch for muddiness, tune if needed.
