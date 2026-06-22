# CT-DOSSIER — Agent Handoff (V3.6.4)

**Read this first.** This is the index any agent picking up the project starts at.
It is current as of **V3.6.4** (`bf4f19a`, 2026-06). The fold/scroll choreography
has been through many iterations — §8 documents **every fix** so you don't repeat
a reverted approach.

> ⚠️ The old version of this doc described a pre-V3 architecture (Role Matrix,
> CREATIVE TECHNOLOGIST, GitHub Pages). All of that is gone. This is the rewrite.

---

## 0. CRITICAL — where it lives and deploys

- **Canonical public home: `https://dossier-fold.vercel.app`** (Vercel). This is the
  owner's decision (V3.6.4-era). It is the real site.
- **Git: push to the `dossier-fold` remote only** → `git push dossier-fold dossier-fold:main`
  (repo: `github.com/augustave/DOSSIER-FOLD`).
- **NEVER push to `origin`** → that is `github.com/augustave/CT-DOSSIER`, a **separate,
  STALE GitHub Pages site** (pre-V3.6.1) at `augustave.github.io/CT-DOSSIER`. It is NOT
  this site. Do not touch it. If a user reports seeing something that doesn't match the
  code, check whether they're looking at the stale Pages site.
- **Deploy:** `vercel deploy --prod --yes` (scope `researchdirector`, project
  `dossier-fold`, alias `dossier-fold.vercel.app`). No GitHub Pages, no backend, no API.
- **Working dir:** `/Users/taoconrad/Dev/GitHub 4/CT-DOSSIER copy/Founder` (a COPY; the
  git repo is in `Founder/`, the parent dir is not a repo). `CLAUDE.md` at the parent
  records this too.

---

## 1. What CT-DOSSIER is

A single-page React microsite (the `Founder/` app). It is **not a portfolio** — built
work lives on three external sites (`artdirector.rocks`, `brandproduct.dev`,
`defense.observer`). CT-DOSSIER is the **presentation surface / practice dossier**:
how the owner thinks, sources taste, builds visual languages.

The whole site is a stack of **fold modules** ("strata bands"). Each band is a sheet of
paper that folds open (3D origami pleat per content row) when you "+ STUDY" it. The
metaphor — and the hard constraint — is a **reading stack, not a strict accordion**.

If you want to add project cards / galleries to this surface, **stop** — that's portfolio
work for the external sites.

---

## 2. Tech & file map

- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind 3 + Vitest 4. Static only.
- **Key files (all under `Founder/`):**
  - `App.tsx` — shell, masthead, hash routing, **all scroll/open choreography**
    (scroll-first, settle, delayed close, re-anchors), module render loop.
  - `components/ModuleStrata.tsx` — the band component; theme/shadow, the `Fold` panel,
    the **post-fold re-anchor** effect.
  - `components/Fold.tsx` — the single collapse primitive (`grid-rows 0fr→1fr` +
    `data-open` / `data-pleat-open`). See §4.
  - `components/PleatFold.tsx` — wraps content rows as origami pleats.
  - `components/FrontMatterContent.tsx` — module 00 content (self-pleating) + Reading Lens.
  - `components/ManifestOverlay.tsx` — the INDEX overlay (00–08 list, OPEN/RECOMMENDED).
  - `components/SplitFlap.tsx` — Solari split-flap title reveal (TEST feature). See §6.
  - `components/InquiryPanel.tsx` — legacy inquiry modal; **no longer mounted in App**
    (CTAs are mailto now). File + its isolated unit tests retained.
  - `constants.tsx` — `CONTENT_MODULES` (module render specs), `COLORS`, `AUDIENCES`/`AudienceId`.
  - `copy.v1_1.ts` — all editorial copy + `meta.version` (the visible `Vx.x.x` label).
  - `index.css` — fold tokens + pleat CSS + split-flap CSS + scrollbar/theme.
  - `index.html` — metadata, OG/Twitter tags (canonical = dossier-fold.vercel.app).
  - `App.test.tsx` — **23 Vitest tests**.
  - `og-card.svg` — source for `public/og.png` (1200×630 social card; render via
    `rsvg-convert -w 1200 -h 630 og-card.svg -o public/og.png`).
  - `.claude/launch.json` — preview dev server config (`dossier-dev`, port 3100/strictPort).

---

## 3. Current module architecture

```
00 FRONT MATTER        cream   ← thesis + identity + work links + Reading Lens (self-pleating)
01 TASTE               cream   ← prose
02 SEEING              clay    ← 3 cognitive lenses
03 VISUAL LANGUAGES    black   ← self-pleating cards (folds its OWN rows)
04 THE NEIGHBORHOOD    blue    ← the field-position chart (ONE plane, 30° fold)
05 DOCTRINE            cream   ← prose
06 DOCTRINE LIBRARY    black   ← self-pleating archive grid (uniform-direction, stable 2-col)
07 PORTFOLIOS          ?       ← three external-site tiles
08 OPERATING BIOGRAPHY ?       ← prose
(MANIFEST is index "00" too but always filtered out of RENDERED_MODULES → the overlay only)
```

- **INDEX count = (09)** — derived from `RENDERED_MODULES.length`, not hardcoded.
- Root `/` loads **fully folded** (no module open). `#module-XX` deep-links open that module.
- Theme per band via `COLORS[themeColor]` (`theme-cream/blue/dark/brown` set CSS vars).

---

## 4. The fold system (DO NOT change physics without explicit direction)

`Fold.tsx` is the one collapse primitive. It renders:
```
<div class="fold" data-open={open} data-pleat-open={pleatOpen}>
  <div class="fold__inner" inert={!open}> {children} </div>
</div>
```
- **Height** collapses via CSS `grid-template-rows: 0fr → 1fr` keyed on `[data-open]`
  (`index.css`). `inert` keeps closed content out of the tab order / a11y tree.
- **Pleats** (`PleatFold` wraps each content row in `.pleat`): each row stands up at its
  context angle when closed (`rotateX`) and snaps flat when open. **Activation is keyed on
  `.fold[data-pleat-open='true']` for the rotate, but on `.fold[data-open='true']` for the
  opacity** — this split is load-bearing (see §8 "first-open paint-baseline fix").
- **Per-context angles** (CSS vars, `:root`): prose 60°, specimen 48°, archive 22° (uniform
  direction — no zigzag, stable grid for 06), chart 30° (04, one plane via
  `.pleat:has(> .pleat-chart)`). `--pleat-duration 820ms`, `--fold-duration-lg 700ms`.
- **Self-pleating** (`ModuleStrata.unwrapResponse` + `selfPleating`): 03/06/00 render their
  content component BARE (it folds its own cards) — wrapping would double-rotate.
- **Reduced motion**: CSS drops the 3D fold to a fade; content always reachable.

**Matte doctrine:** pure-black shadows, no glow/glint/gradient. 04 stays one plane. 06 grid
stable. These are invariants.

---

## 5. The open/scroll choreography (the heart — `App.tsx`)

This is what most of §8 iterated on. The current end-to-end open sequence:

1. **Click `+ STUDY`** → `handleToggle(index)`.
   - If clicking the already-open module → fold it immediately (no scroll), clear state.
   - Else → `requestOpenModule(index)` (`pendingRef` dedupes rapid clicks; latest wins).
2. **Scroll-first** (`scrollModuleIntoView`): scroll the band header to the masthead-safe
   position (`MASTHEAD_OFFSET = 100`, matches each section's `scroll-mt-[100px]`). Returns
   false (no scroll) if already within 4px → opens in place.
3. **Settle** (`afterScrollSettle(index, commit)`): wait for native `scrollend` — but only
   accept it once the TARGET is actually at rest near the offset (or the page is clamped at
   the bottom). Browsers without `scrollend` use a short-lived geometry probe instead of a
   blind fixed delay. Hard stop: 1400ms (`scrollend`) / 1800ms (no `scrollend`). No
   `requestAnimationFrame` wrap — rAF is starved in background tabs and must never gate
   whether a module opens.
4. **Commit** → set `openModuleIndex`; **delayed close**: if a previous module was open, keep
   it open (`keepOpenIndex`) for `CLOSE_DELAY = 900ms` so its collapse can't steal the stage
   while the target scrolls/folds. Write hash via `replaceState` (no jump, no re-entrant
   `hashchange`).
5. **Fold** plays (`data-open` → height + opacity; `data-pleat-open` flips one committed
   frame later → rotate; ModuleStrata fires its post-fold re-anchor at the band's
   `padding-top` `transitionend`, a no-op if already at offset).
6. **Held module collapses** after `CLOSE_DELAY`, then a **post-collapse re-anchor**
   (`reanchorModuleTop`, after `COLLAPSE_SETTLE = 760ms`) pulls the target's top back to the
   offset — guarded by "still the open module" plus a user-scroll bail during the close window.
   This is the fix for "card sticks at the bottom" (§8 V3.6.4 / `bf4f19a`).

`isOpen` for a band = `openModuleIndex === idx || keepOpenIndex === idx`.

**Root / refresh:** module-scope `history.scrollRestoration = 'manual'` (runs before mount,
no restore flash) + `scrollTo(0,0)` on no-`#module` load. `openModuleIndex` is never
persisted. `?read=` only selects the Reading Lens (no scroll/module restore).

**Hash:** deep-link on cold load jumps + opens after 2 rAFs; external `hashchange`
(typed URL, back/forward) routes through `requestOpenModule` (same scroll-first+settle).

---

## 6. Split-flap titles (TEST feature — easy to remove)

`SplitFlap.tsx` + `.splitflap*` in `index.css`. Each band title flips through glyphs
(Solari board) and locks to its letters; wrapped around `module.title` in ModuleStrata
(`<SplitFlap text={module.title} open={isOpen} />`).
- **Forward** cascade (left→right, top-hinge) on scroll-into-view (IntersectionObserver, once).
- **Reverse** cascade (right→left, bottom-hinge) re-fires on each `open` (false→true) edge.
- **Physics:** gravity ease-in fall + clack settle-bounce (CSS `splitflap-fall` / `-clack`);
  a fast cycling phase then a **homing** approach that steps alphabetically into the target
  (`glyphBefore`) with **decelerating** gaps (`HOMING_GAPS [88,132,190]`); per-letter haptic
  `navigator.vibrate(6)` on lock (mobile, guarded). Tuning: `STAGGER 72`, `SPIN 480`,
  `FLAP_MS 72`.
- **Robust:** cells reserve the final glyph's width (`::after`) so the proportional title
  never reflows; `overflow:hidden` clips a wide spin glyph to its slot; a **generation token**
  cancels overlapping plays; jsdom (no IntersectionObserver) + reduced-motion → final text,
  no animation; `aria-label` carries the word, cells `aria-hidden`.
- To remove: drop the `<SplitFlap>` wrapper in ModuleStrata → title is plain text again.

---

## 7. Other surfaces

- **CTA → one mailto.** Masthead "REQUEST CONVERSATION" + footer "Compose Inquiry" both
  open `mailto:ebenz.aug@gmail.com?subject=CT DOSSIER — Conversation Request&body=…`
  (`CONVERSATION_MAILTO` in `App.tsx`). No modal. Footer email is a direct mailto.
- **Reading Lens** (in module 00, `FrontMatterContent`): four pills (Hiring/Client/
  Collaborator/Academic). It is an **ORIENTATION AID, not a filter** — selecting a lens
  shows a helper path line and marks RECOMMENDED modules in the Index. **It never hides any
  module.** `aria-pressed`. `?read=` URL param persists/shares the selection. Paths in
  `AUDIENCES` (`constants.tsx`), all start at 00.
- **Index overlay** (`ManifestOverlay`): rows are `<button>`s with number + title + prompt
  label; the open module shows an **OPEN** badge (`activeIndex={openModuleIndex}`, set at
  commit so a held-open module never shows OPEN prematurely); lens path shows a quieter
  **RECOMMENDED** marker. OPEN outranks RECOMMENDED.
- **Metadata** (`index.html`): title "CT DOSSIER — Ebenz Augustave", description, canonical +
  OG + Twitter (`summary_large_image`), all absolute URLs → `dossier-fold.vercel.app`,
  `og:image` = `/og.png`. `theme-color #F2EFE4`.

---

## 8. CHANGELOG — every fix in the V3.6.x fold/scroll saga

Read this before touching the fold or scroll logic. Several approaches were tried and
**reverted/superseded** — don't reintroduce them.

### V3.6.0 — `b495509`, `6c240af`
- Static hero → numbered **module 00 FRONT MATTER**, folded by default on root. Teaches the
  fold grammar from the first screen.
- **Full-width masthead**: brand anchors viewport-left, REQUEST CONVERSATION + INDEX anchor
  right, independent of the `max-w-6xl` content column.
- INDEX count → **(09)**. `AudienceId`/`AUDIENCES` moved to `constants.tsx`. Module 00's
  `responseDisplay` injected dynamically in App (carries lens state).
- ManifestOverlay **active-module highlight** (`activeIndex`). **Removed** the collapsed-band
  `promptText` preview (caused a "WHERE THE WORK LIVES" ghost label near the wrong module).

### V3.6.1 — `2dbd05c`
- **CTA unify → one prefilled mailto.** Removed the InquiryPanel modal from App (file kept,
  isolated tests kept).
- **Index polish**: per-row prompt label; rows became `<button>`; OPEN badge + RECOMMENDED
  marker; `aria-current`.
- **Reading Lens → orientation aid, NOT a filter.** Previously the lens FILTERED modules
  (hid them). Now nothing is hidden; lens drives the helper line + Index RECOMMENDED only.
  Removed the filtering `useMemo` + the reconcile effect. New lens paths (start at 00).
  *(Tests rewritten: the old "faceted entry" filter assertions → "orientation aid" assertions.)*

### Launch hardening — `1cbd113`, then `a725643`
- `index.html` metadata + OG/Twitter; generated `public/og.png` (matte 1200×630 card from
  `og-card.svg` via `rsvg-convert`).
- **Canonical decision:** first pointed at `augustave.github.io/CT-DOSSIER`, then **repointed
  to `dossier-fold.vercel.app`** (`a725643`) so canonical/`og:image` match where it actually
  deploys (no merge to the stale repo needed). `CLAUDE.md` updated to match.

### Fold first-open paint-baseline fix — `2cb12b6`  ⚠️ load-bearing
- **Bug:** the FIRST time a module opened, the pleats snapped flat (no fold); a retract +
  reopen then animated. Worst on heavy self-pleating modules (03/06).
- **Cause:** the pleat rotate transition was keyed on the same `.fold[data-open]` that drives
  the height collapse. While closed (`grid-rows:0fr` + `opacity:0`) the pleat subtree has zero
  paint area → no transition baseline → first open jumps straight to flat.
- **Fix:** split the triggers. **Opacity** keys on `data-open` (immediate → paints the tilted
  row, giving the rotate a baseline). **Rotate** keys on a new `data-pleat-open` that
  `Fold.tsx` flips ONE committed frame later (rAF + forced reflow + a `setTimeout` fallback so
  a starved rAF can never strand it). → fold plays on the first open, every time.
- **Lesson encoded:** never gate visibility on `requestAnimationFrame` (starved in background
  tabs).

### V3.6.2 — scroll-first choreography — `15bf16f`
- **Bug:** short modules (05) finished folding **off-screen** — the open fired immediately and
  the band scrolled into view AFTER (ModuleStrata's old effect even waited for the fold's
  `transitionend` before scrolling).
- **Fix:** invert it — scroll the header to the offset FIRST, wait for settle, THEN open
  (`requestOpenModule` + `afterScrollSettle` + `scrollModuleIntoView` + `pendingRef`).
  Removed ModuleStrata's old post-open scroll effect.

### V3.6.3 — post-fold re-anchor + hardening — `7f229c0`
- **Reported:** after scroll-first, the card "remained down" / didn't settle at its top.
- **Fix:** re-added a **post-fold re-anchor** (ModuleStrata): after the fold settles, scroll
  the card top to the offset (corrects drift). Guards: `delta <= 4` no-op (no double-jump when
  already aligned) + **user-scroll bail** (`wheel`/`touchmove` → don't yank a user who scrolled).
- **Hardening** from a 4-lens adversarial review (6 confirmed findings, all fixed):
  - `afterScrollSettle` **scoped to the target** — a bare window `scrollend` could be fired by
    another module's scroll and commit the open with the viewport elsewhere; now it only
    accepts `scrollend` once the target is at rest near the offset (or clamped at the bottom).
  - Safety backstop raised **420ms → 1000ms** (a long smooth scroll no longer pre-empts).
  - External `hashchange` routes through the same scroll-first+settle path (was a fixed 2-rAF
    delay that opened mid-scroll on back/forward).

### Split-flap title reveal (TEST) — `af5cd35`, `8442325`, `00ec49d`
- `af5cd35` added the effect (forward cascade, scroll-into-view).
- `8442325` made it **20% slower** + added the **reverse cascade on open**. A generation token
  was added so an overlapping play (scroll-in then click) can't interleave timers. Review
  fixes: text-change reset effect; `overflow:hidden` to clip a wide spin glyph to its slot.
- `00ec49d` **recalculated physics** for realism + haptics: gravity fall + clack settle, the
  alphabetical homing approach with decelerating gaps, per-letter `navigator.vibrate`. An
  adversarial scheduler review returned **0 findings**.

### V3.6.4 — reading-stack regression patch — `45f7f53`  (+ `bf4f19a`)
PRD: "behave like a reading stack, not a strict accordion." **State choreography + one visual
fix only — fold physics untouched.**
- **A/B — preserve vertical space (delayed close):** opening a module now HOLDS the previously
  open one open (`keepOpenIndex`) through the target's scroll + fold, then collapses it after
  `CLOSE_DELAY = 900ms`. Without this, the previous module collapsed mid-fold and the page
  jumped (the V3.6.3 complaint). `isOpen = open || keepOpen`. Cleanup on close/Escape.
- **C — root/refresh reset:** `history.scrollRestoration = 'manual'` (module scope) +
  `scrollTo(0,0)` on no-hash root. Fixed the "saves memory on refresh" regression.
- **E — "01 Taste gradient":** investigated exhaustively — **there is NO CSS gradient.** It was
  the **paper-stack drop-shadow**: cream module 00 (higher z-index) cast its wide soft drop
  over cream 01's top edge, reading as "SaaS hero shading." **Fix:** cream `shadowClass` in
  ModuleStrata flattened to a TIGHT subtle paper-depth (closed `0 1px 2px /.05`; open
  `0 3px 8px -2px /.08`); the band seam is the crisp `border-b` hairline. Dark-band lift +
  inset lit-edge unchanged. Owner chose "flat cream + crisp seam."
- **D (Reading Lens) and F (Index OPEN sync):** already satisfied from V3.6.1 — no change.

### Post-collapse re-anchor — `bf4f19a`  (+ follow-up hardening)
- **Reported:** after a card rolls open it "sticks at the bottom" and doesn't return to its top.
- **Cause:** V3.6.4's delayed close collapses the previous module ~900ms later, **above** the
  open card. Browser **scroll anchoring does NOT reliably compensate an animated collapse**, so
  the card's header scrolls above the masthead. The post-fold re-anchor had already fired
  (at the fold's `transitionend`) BEFORE that collapse, so nothing corrected it.
- **Fix:** `reanchorModuleTop(index)` fires after `CLOSE_DELAY + COLLAPSE_SETTLE (760ms)` — once
  the held module has finished collapsing — and pulls the open card's top back to the offset.
  Follow-up hardening removed the brittle "near viewport" lower-bound guard; now the close
  window listens for `wheel` / `touchmove` and bails only if the user intentionally scrolls
  before the post-collapse re-anchor. This keeps 02→03 and 04→05 pinned to the card top after
  tall previous modules collapse.

---

## 9. Invariants — do not break

- **Fold physics frozen:** angles/tokens/durations, 03 folds once (no double-rotate), 04 one
  plane, 06 stable 2-col grid, prose drama on 01/05/08. The V3.6.4 PRD's failure criterion is
  "changed fold physics instead of fixing state."
- **Matte doctrine:** pure-black shadows, no glow/glint/gradient/glassmorphism/SaaS shading.
- **Pleat opacity keyed on `data-open`, rotate on `data-pleat-open`** — do not re-merge them
  (re-introduces the first-open snap).
- **Never gate a module opening on `requestAnimationFrame`** (background-tab starvation).
- **Reading Lens never hides content.** Index OPEN tracks `openModuleIndex` (post-commit only).
- **Accessibility:** `aria-expanded` on toggles, `inert` on collapsed content, `aria-pressed`
  on lens pills, `aria-current` in Index, visible focus, reduced-motion fold off.
- **Push `dossier-fold` only. Never `origin`/CT-DOSSIER.**

---

## 10. Known limitations / open items

- **Scroll anchoring is unreliable for the held-module collapse** — handled by the
  post-collapse re-anchor (`bf4f19a`), but the final settle lands a beat (~1.6s) after the
  fold. **Alternative not yet built:** collapse the off-screen previous module **instantly**
  with a matching `scrollBy` compensation (zero visible motion, no late snap). Offer this if
  the owner finds the late settle jarring.
- **Last module on tall (1080p+) viewports:** scroll-first can't lift the very last band to the
  offset until its content expands the page, so the fold tail can briefly play below the fold
  line. End state is correct (re-anchor lands it). Minor; would need a trailing spacer.
- **Split-flap is a TEST.** Owner is still tuning feel (`STAGGER`/`SPIN`/`FLAP_MS`/`HOMING_GAPS`
  + the two cubic-beziers + `buzz(6)`). May be kept, tuned, scoped to specific modules, or removed.
- **Stale Pages site** (`augustave.github.io/CT-DOSSIER`) still serves a pre-V3.6.1 build. Leave
  it, or the owner repoints/retires it later — not our repo to push.

---

## 11. Verify & deploy

```bash
cd Founder
npm run typecheck          # tsc --noEmit  (clean)
npm test -- --run          # 23 Vitest tests (pass)
npm run build              # vite build (clean)
# real-browser QA on the dev server — the preview tool FREEZES 3D + throttles timers,
# so verify motion/scroll in a real browser, not the preview:
#   - open 02 → click 03 → 02 holds, 03 scrolls in + folds, no jump, lands at 03's TOP
#   - scroll to 05, refresh → top, 00 visible, all folded
#   - 01 collapsed/open → flat cream, crisp seam, no soft top gradient
#   - 03 folds once · 04 one plane · 06 grid stable · reduced-motion stable · mobile no overflow
git add -A && git commit -m "…"          # end commit body with the Co-Authored-By trailer
git push dossier-fold dossier-fold:main  # NEVER origin
vercel deploy --prod --yes               # → dossier-fold.vercel.app
```
Bump `copy.v1_1.ts` `meta.version` when shipping a behavior change (drives the visible
`Vx.x.x · NO API` label).

---

## 12. Owner notes — read carefully

Owner: **Ebenz Augustave** ("Tao Conrad" is the account handle, not the name). Art Director /
Design Engineer. Independent practice **VEN** ("Doctrine + agent orchestration"). Markets:
enterprise design leadership, American Dynamism / defense-tech, frontier AI labs.

### Voice & posture
- Terse, decisive, doctrine-flavored. Conclusion-first. No hedging, no marketing.
- When underspecified, ask **one** sharp question or present 2–4 options — never an open prompt.
- Treat short corrections as spec ("revert it" = revert, full stop). Defer to artifacts
  (screenshots/PDFs he shows you outrank your synthesis).
- Don't narrate deliberation; commit and move. Don't invent specs, dates, URLs, or claims.
- Copy doctrine (current site copy = v1.2.0): plainspoken, no frameworks-as-nouns.

### Working tells
- He ships PRDs (often as PDFs in `Library/`) — read the whole PRD, follow it, don't redesign
  beyond scope. Several PRDs explicitly say "do NOT change fold physics."
- He verifies in a real browser and reports feel ("sticks at the bottom", "20% slower",
  "haptic"). Trust those over the (motion-blind) preview tool.

---

## 13. Environment gotchas

- **Preview tool freezes 3D + throttles timers.** Screenshots of an animating 3D fold render
  blank; `scrollIntoView`/timers are throttled in headless. Verify *state* via DOM/computed
  style; verify *motion* in the owner's real browser. (See session memory
  `preview-tool-no-animations`.)
- **Dev server:** `preview_start` config `dossier-dev` (port 3100 strictPort) — another local
  project sometimes squats port 3000.
- The platform safety classifier can briefly go unavailable (gates Bash/Agent/preview, not
  Read/Edit/Write); wait and retry.

---

*Last updated: V3.6.4 (`bf4f19a`). If you ship past this, append to §8 and bump the header.*
