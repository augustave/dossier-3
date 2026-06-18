# Fold feature — port guide

Changes made in this copy (`CT-DOSSIER copy/Founder`). Port them into the real
CT-DOSSIER repo, then commit + push (Pages auto-deploys).

**Fastest path:** `diff -ru <real-repo>/Founder <this-copy>/Founder` and apply. The
manifest below is the authoritative list; the non-obvious code is reproduced in full.

---

## What it is

A single `<Fold>` primitive unifies every collapse surface (module panels, the
implications drawer, the Visual-Languages spec). One fold "law" in `index.css`
drives them. Plus two reversibility guarantees and a **2D matte fold cue** (no 3D —
3D froze under software rendering). Doctrine-safe: the only light move is
pure-black-alpha occlusion (mass), never glow/sheen.

## Files touched

| File | Change |
|------|--------|
| `components/Fold.tsx` | **NEW** — the shared primitive |
| `index.css` | fold tokens + `.fold` primitive + 2D matte cue + reduced-motion |
| `components/ModuleStrata.tsx` | panel → `<Fold large>`; crease seam; **persistent paper-stack elevation** (every band a sheet w/ drop shadow; open lifts; z-cascade) |
| `components/CollapsibleDrawer.tsx` | body → `<Fold>` |
| `components/VisualLanguages.tsx` | spec → `<Fold>` (was a bare mount) |
| `App.tsx` | lens-reconcile effect + Escape-to-flat handler + pass `stackIndex`/`stackCount` to each band |
| `components/ManifestOverlay.tsx` | overlay motion uses fold tokens |

---

## 1. `components/Fold.tsx` (new — copy whole file from this copy)

Small component: `<div class="fold [fold--lg]" data-open><div class="fold__inner"
id inert {...rest}>{children}</div></div>`. Forwards `id`/`inert`/`aria`. Copy it
verbatim from this copy.

## 2. `index.css`

- In `:root`, add the fold tokens (next to the opacity tokens):
  `--fold-ease`, `--fold-duration`, `--fold-duration-lg`, `--fold-crease`.
- Add the whole **`.fold` primitive + MATTE FOLD CUE** block (the `.fold`,
  `.fold[data-open]`, `.fold--lg`, `.fold > .fold__inner` rules through the
  `@media (prefers-reduced-motion)` block). Copy this block verbatim from this
  copy's `index.css` — it is the crown jewel (drop, persistent crease, occlusion,
  `--fold-seam-rest`, dark-strata override). It depends only on the tokens above
  and the existing `--hairline` / `.theme-*` defs.

## 3. Component wraps (mechanical)

Each: `import { Fold } from './Fold';` then wrap the collapsing content.

- **ModuleStrata.tsx** — replace the old `<div id={panelId} inert … max-h-[5000px]…>`
  panel with `<Fold open={isOpen} large id={panelId}>…</Fold>`. The inner response
  grid carries the seam: `className="… mt-8 pt-8 border-t" style={{ borderColor:
  'var(--fold-crease)' }}`. Keep the section's `py-*` padding + the scroll-snap
  `transitionend` latch untouched.
  **Persistent paper-stack elevation** — every band reads as a sheet with a
  full-width pure-black drop shadow underneath, always; the open band lifts higher.
  On the `<section>` (already `relative`):
  - className shadow ternary: closed `shadow-[0_16px_34px_rgba(0,0,0,0.13)]`,
    open `shadow-[0_34px_64px_rgba(0,0,0,0.30),0_-14px_36px_rgba(0,0,0,0.12)]`.
  - Add props `stackIndex: number; stackCount: number;` and compute
    `const zIndex = isOpen ? stackCount + 10 : stackCount - stackIndex;`, applied via
    `style={{ zIndex }}`. Earlier bands sit higher so each sheet's shadow draws over
    the opaque band below; the open band jumps above the whole stack. (All z stay
    `< 40` so the fixed header / overlays stay on top.)
  - Change the section's `transition-all` → `transition-[padding,box-shadow]` so
    z-index does NOT transition (a transitioned z-index flips mid-open). Keep
    `duration-700` + the easing; `padding` stays transitioned so the scroll-snap
    `padding-top` latch still fires.
  In `App.tsx`, the map passes them: `visibleModules.map((module, i) => <ModuleStrata
  … stackIndex={i} stackCount={visibleModules.length} />)`.
  (The old in-content occlusion `::after` was removed from the Fold CSS.)
- **CollapsibleDrawer.tsx** — replace the `max-h-[2000px]` div with
  `<Fold open={isOpen}><div className="mt-4">{children}</div></Fold>`.
  (Spacing on an inner child, NOT on `.fold__inner` — else a closed fold leaves a sliver.)
- **VisualLanguages.tsx** — replace the spec `{open && (<div id={specId} …>…</div>)}`
  with `<Fold open={open} id={specId}><div className="mt-4 pt-4 border-t space-y-4"
  style={{ borderColor: 'var(--fold-crease)' }}>…spec…</div></Fold>`.
  (Now stays mounted + inert when closed, like every other fold.)

## 4. `App.tsx` — two effects (paste verbatim)

Reversibility invariant — never open on a hidden module (place after the
`visibleModules` useMemo):

```ts
useEffect(() => {
  if (openModuleIndex && !visibleModules.some(m => m.index === openModuleIndex)) {
    const next = visibleModules[0]?.index ?? null;
    setOpenModuleIndex(next);
    try {
      if (next) window.location.hash = `module-${next}`;
      else history.replaceState("", document.title, window.location.pathname + window.location.search);
    } catch (e) {}
  }
}, [visibleModules, openModuleIndex]);
```

Escape-to-flat from any state (place near the other effects):

```ts
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (isInquiryOpen) return;                 // InquiryPanel owns its Escape
    if (isIndexOpen) { setIsIndexOpen(false); return; }
    if (openModuleIndex) {
      setOpenModuleIndex(null);
      try { history.pushState("", document.title, window.location.pathname + window.location.search); } catch (e) {}
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [isInquiryOpen, isIndexOpen, openModuleIndex]);
```

## 5. `ManifestOverlay.tsx` — align motion to the fold tokens

- Root: `duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]` → `duration-[var(--fold-duration)] ease-[var(--fold-ease)]`
- Content: same swap (keep the `delay-100`).

---

## Verify (in `Founder/`)

```
npm run typecheck     # clean
npm test -- --run     # 20/20 pass
npm run build         # succeeds (what Pages deploys)
```

Then in a REAL browser (`npm run dev`, hard-refresh) — the dev preview tool cannot
paint the fold subtree, so confirm motion by eye:
- Toggle a module → body drops ~26px + a dark pool pools at the seam, holds, releases.
- Leave a module open + idle → a faint persistent dark seam holds at the top.
- Pick a Reading Lens that excludes the open module → it reconciles, doesn't vanish.
- Escape from any state → walks back to the flat overview.
- OS reduced-motion → instant, seam still shown, no broken layout.

## Follow-ups (both resolved)

1. **border-t doubling — assessed, no change.** The response grid's `border-t` sits
   ~32px below the seam (`mt-8` gap), so it does NOT double with the `::before`/`::after`
   seam. Distinct elements (fold edge vs content rule). Confirm by eye after porting.
2. **Dark-strata white seam — fixed.** The persistent `::before` seam was a faint white
   hairline on dark panels (the only light element). Overridden to pure black there
   (`.theme-dark/.theme-blue/.theme-brown .fold > .fold__inner::before { background:
   rgba(0,0,0,0.55) }`, in the index.css block). Verified: dark = `rgba(0,0,0,0.55)`,
   cream unchanged `rgba(0,0,0,0.12)`. The white `--fold-crease` still drives visible
   content-separator borders elsewhere — only the seam line is overridden.
