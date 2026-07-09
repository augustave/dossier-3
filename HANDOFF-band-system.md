# Handoff Spec: Module Band ("Tab") System — BRONC + Odometer

Stack: React 19 + TS + Vite + Tailwind 3. Branch: `experiment/bronc-palette` (NOT canonical; committed `a714102` = palette/shaders/copy; **uncommitted**: cardstock texture, V4.0.1 copy, odometer + per-band wipe + is-open gating). Values below are the as-built implementation, not a mockup.

Files: `components/ModuleStrata.tsx` (band), `components/IndexOdometer.tsx` (reel), `components/Fold.tsx` (collapse), `index.css` (all law blocks), `tailwind.config.cjs` (palette), `constants.tsx` (band data + render).

---

## Overview
Each content module renders as a full-width horizontal **band** (a.k.a. "tab" / strata section) in a vertical paper-stack. Six rendered bands, INDEX (06): `00 FRONT MATTER · 01 BIOGRAPHY · 02 INFLUENCES · 03 ARTIFICIAL INTELLIGENCE · 04 AMERICAN DYNAMISM · 05 BRAND`. A band is a click-to-open fold; it also carries a one-time load entrance motion and a hover "departure-board" odometer reaction. `data-key="dynamism"` (04) is the always-on flagship.

## Layout
- Container: `<main class="w-full pt-24 md:pt-32">` → `<CreaseMap>` (thesis frame) → six `<section class="strata-band">` → footer colophon.
- Band section: `relative w-full border-b border-black/10`, `scroll-mt-[100px]` (fixed-masthead clearance), paper-stack `z-index` (earlier bands higher so drop-shadows layer correctly).
- Content wrapper: `relative z-10 container mx-auto px-4 md:px-8 max-w-6xl`.
- Header row: `flex flex-col md:flex-row md:items-baseline justify-between` (stacks on mobile).

## Design Tokens
### Palette (`tailwind.config.cjs`) — names retained, values are BRONC
| Token | Value | Bands |
|---|---|---|
| `strata-cream` | `#F2EFE4` | 00, 02, body, footer base |
| `strata-blue` (olive) | `#6E7248` | 01 |
| `strata-black` | `#0A0A0A` | 03, 05 |
| `strata-clay` (dark olive-drab) | `#464A2C` | 04 |

### Per-band text/index (`index.css` theme blocks; set via themeClass)
| Theme | `--text-primary` | `--index-stroke` | `--hairline` |
|---|---|---|---|
| cream/base | `#111111` | `rgba(0,0,0,.65)` | `rgba(0,0,0,.12)` |
| theme-blue (olive) | `#F4F1E7` | `rgba(255,255,255,.80)` | `rgba(244,241,231,.22)` |
| theme-brown (drab) | `#F2EEE8` | `rgba(255,255,255,.78)` | `rgba(242,238,232,.22)` |
| theme-dark (black) | `#F2F2F2` | `rgba(255,255,255,.85)` | `rgba(255,255,255,.18)` |

### Motion law
| Var | Value | Use |
|---|---|---|
| `--fold-ease` | `cubic-bezier(.25,1,.5,1)` | fold/structural |
| `--fold-duration-lg` | `700ms` | band panel open/close |
| `--pleat-*` | see block | content-row unfold cascade |
| `--tab-ease` / `--tab-duration` / `--tab-distance` / `--tab-stagger` | `linear` / `900ms` / `100%` / `90ms` | load entrance |
| `--card-ease` / `--card-duration` | `var(--fold-ease)` / `300ms` | ledger card hover |
| `--band-stipple` / `--band-edge` | `0.05` / `0.10` | cardstock texture |

### Per-band hover-wipe accent (`#module-0X { --wipe; --wipe-ink }`)
| Band | `--wipe` | `--wipe-ink` |
|---|---|---|
| 00 Front Matter | espresso `#3B2A1D` | `#F4F1E7` |
| 01 Biography | rust `#B4551F` | `#F4F1E7` |
| 02 Influences | olive `#6E7248` | `#F4F1E7` |
| 03 AI | taupe `#8B8173` | `#1A1712` |
| 04 American Dynamism (flagship) | rust `#B4551F` | `#F4F1E7` |
| 05 Brand | bone `#E8E0CF` | `#1A1712` |

## Components
| Component | Props | Notes |
|---|---|---|
| `ModuleStrata` | `module, isOpen, onToggle, stackIndex, stackCount` | the band; owns `rowHover` state + `isFlagship`/`is-open` classes |
| `IndexOdometer` | `index` (e.g. "04"), `spin` (bool), `alwaysOn` (bool) | tens (static) + units reel; owns the roll |
| `Fold` | `open, large, id` | grid-rows collapse; `data-open`/`data-pleat-open` split |
| `Card` | `href, eyebrow, title, subtitle?, cta?, arrow, meta?, image?` | ledger link card (borderless, currentColor) |

## States and Interactions
| Element | State | Behavior |
|---|---|---|
| Band | load (once) | `.module-tab-skin` hairline pans in from right, `translateX(100%→0)`, `linear` 900ms, staggered `90ms × stackIndex`; armed by `data-tab-armed` flip on `<main>` (double-rAF + 90ms timeout). cream/blue/clay bands only. |
| Band | hover (CLOSED) | `.row-wipe` fills `scaleX(0→1)` left-origin, 200ms `cubic-bezier(.4,0,.2,1)`, per-band `--wipe`; header text flips to `--wipe-ink` (90ms linear); numeral goes solid; units reel spins. |
| Band | hover (OPEN) | **No wipe / no ink-flip / no lit numeral** (gated by `:not(.is-open)`) so body text stays readable. Reel may still spin (harmless). |
| Band | click | toggles fold open/close (`onToggle`); clicks on `a`/`button` are ignored (stopPropagation). |
| Units reel | spin | snap to first-occurrence (no anim) → reflow → `translateY(-(units+10)em)` 420ms `cubic-bezier(.15,.85,.25,1)`; rolls one lap, lands on own digit; `reel-blur` keyframe (blur 0→1.8px→1.8px→0). |
| Tens digit | idle→hover | outline (`--index-stroke`) → solid fill (`--wipe-ink`), stroke 0. |
| Band 04 | always | flagship: wipe + numeral lit permanently **while closed** (`.always-on`). |
| Siblings | any hover | unchanged (no dim — "elevate, don't dim"; opacity fade removed as it read "ill"). |
| Fold content | open | `grid-template-rows 0fr→1fr` 700ms; per-row pleat `rotateX` cascade; content `inert` when closed. |

## Responsive Behavior
| Breakpoint | Changes |
|---|---|
| Desktop (≥768 `md`) | numeral `text-6xl` (60px); title `text-5xl`; header row horizontal; band `py-12` closed / `py-24` open. |
| Mobile (<768) | numeral `text-4xl` (36px); title `text-3xl`; header stacks vertical; band `py-8` closed / `py-12` open. Reel is `em`-based → scales with numeral automatically. No horizontal scroll (entrance is transform-only, `translateX(100%)` is self-relative). |

## Edge Cases
- **Reduced motion** (`prefers-reduced-motion: reduce`): entrance instant; fold/pleat → fade, no rotate; reel transition + `reel-blur` off; wipe transition off. Content never hidden pending JS.
- **rAF starvation** (background tab): entrance arms via a 90ms `setTimeout` fallback.
- **Reel is decorative**: lands on the band's own digit — no data dependency; `aria-hidden`.
- **Open + hover**: wipe suppressed (see states) — the fix for body-text contrast clash.
- **Two greens** (olive 01 / drab 04): distinguished by value + the rust wipe on hover.
- **Wipe contrast**: each `--wipe` chosen to contrast its band's resting color; `--wipe-ink` is dark over light wipes (taupe/bone), light over dark.

## Animation / Motion
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| `.module-tab-skin` | load | translateX pan-in | 900ms | `linear` |
| `.row-wipe` | hover (closed) | scaleX 0→1 | 200ms | `cubic-bezier(.4,0,.2,1)` |
| `.odo-header` text | hover (closed) | color → `--wipe-ink` | 90ms | linear |
| reel strip | hover (closed) | translateY lap-roll | 420ms | `cubic-bezier(.15,.85,.25,1)` |
| reel | hover | `reel-blur` (motion blur) | 420ms | (keyframed) |
| fold panel | open/close | grid-rows 0fr↔1fr | 700ms | `--fold-ease` |
| pleat rows | open | rotateX cascade | `--pleat-duration` | `--pleat-ease` |

## Accessibility Notes
- Band `<section>` has `aria-label="Module NN: {title}"`; the toggle `<button>` carries `aria-expanded` + `aria-controls={panelId}`; copy-link button has `aria-label`.
- Odometer numeral + `.row-wipe` + `.module-tab-skin` are decorative → `aria-hidden="true"`.
- Fold content is `inert` when closed (out of tab order + a11y tree; mirrors `aria-expanded=false`).
- Focus: header button is the real focusable control (`focus-visible:ring-1`). Copy-link appears on hover/focus-visible.
- Keyboard: Enter/Space on the toggle button opens/closes; the whole-section click is pointer convenience only.
- ⚠️ Open review item: the hover kinetics are pointer-only (no keyboard/focus trigger for the wipe/reel) — acceptable since they're decorative and the fold is fully keyboard-operable, but note it.

## Verify
`cd Founder && npx tsc --noEmit` (clean). Run dev as a durable background process (`npm run dev -- --port 3100 --strictPort`), confirm `curl localhost:3100` = 200. Verify visuals via `getComputedStyle`/`preview_inspect` — **preview screenshots are unreliable here** (frozen/blank; see main `HANDOFF.md` §13). Hover closed bands (wipe + reel), open a band + hover (no fill, readable), check reduced-motion.
