# README — CT Dossier Microsite (No API)

> **⚠️ This README predates V4.0.0 and is largely stale below.** The current app is the
> **V4.0.0 five-section spine** — landing claim **"THE BRAIN IS THE PRODUCT"**, bands
> `00 FRONT MATTER · 01 BIOGRAPHY · 02 INFLUENCES · 03 ARTIFICIAL INTELLIGENCE ·
> 04 AMERICAN DYNAMISM · 05 BRAND` (INDEX 06). The old route/lens system is gutted.
> **2026-07-04 UI:** tab entrance motion (one-time linear pan-in on load), a unified
> ledger `Card` component for all link cards, and the `BIO→BIOGRAPHY` /
> `AI→ARTIFICIAL INTELLIGENCE` renames. The authoritative, current doc is
> **`HANDOFF.md`** (see its top UPDATE block + §3 + §5b) — trust it over this file.

A minimal-interactive microsite for presenting a recruiter-facing creative technologist profile. It uses a strata-based interface to show practice thesis, role fit, operating method, selected systems, and a client-side outreach composer without any backend.

## What this is

This site is a curated evaluation surface for design, product, recruiting, and stakeholder review.

The narrative is:

**Practice Thesis → Role Fit → Operating Method → Selected Systems → Contact**

It is designed for roles where interface design, technical storytelling, front-end prototyping, and system coherence need to appear in one artifact.

## Core experience

The interaction model is still intentionally minimal:

1. Open a stratum from the manifest.
2. Read the core response.
3. Expand additional cards or casework.
4. Use the role matrix for a quick fit read.
5. Generate a recruiter-ready outreach draft locally.

## Information architecture

* **Module 00** — Gate / Index
* **Module 01** — Role Fit
* **Module 02** — Creative Technologist
* **Module 03** — Operating Method
* **Module 04** — Selected Systems
* **Module 05** — Role Matrix

## Default content shipped

### Module 01 — Role Fit

Defines the three core hiring signals:

* visual systems
* interactive prototypes
* technical storytelling

### Module 02 — Creative Technologist

Frames the core thesis:

* bridge engineering truth and operator confidence
* build visual operating languages and proof artifacts
* make complex technical products legible under pressure

### Module 04 — Selected Systems

Groups portfolio evidence into a tighter recruiter-facing casework layer:

* `DEADLIGHT`
* `DOSSIER VOL`
* `GREY-EARTH`
* `TACTICAL CANVAS`
* `WAR-F`
* `SENTINEL / MINI-D`

## Art direction

The visual system remains dossier-led and documentation-heavy.

* structural color bands, not decorative accents
* large or very small type, not comfortable middle-weight defaults
* strict hierarchy and evidence-led framing
* no backend theater, no chat veneer, no fake interactivity

## Constraints

### No backend / no API

* No external AI calls
* No server-side storage
* No form submission

### Inquiry is still client-side only

The inquiry panel outputs:

* copy-to-clipboard message
* `mailto:` draft when `VITE_CONTACT_EMAIL` is set
* local `.txt` download generated in-browser

### Minimal interactive only

* folding
* sliding
* snapping
* copying

## Local setup

1. Copy `.env.example` to `.env`
2. Set `VITE_CONTACT_EMAIL` to the destination address for inquiry drafts
3. Run `npm install`
4. Run `npm run build`
5. Run `npm run typecheck`
6. Run `npm test -- --run`

## Accessibility requirements

* Keyboard navigable folds and snaps
* ARIA labels for toggles and drawers
* High contrast across strata
* Reduced-motion-friendly behavior

## Deployment

Any static host works:

* GitHub Pages
* Netlify
* Vercel static hosting

## Extension notes

If this evolves further, the next sensible step is not more modules. It is replacing placeholder casework summaries with richer evidence cards and direct artifact links.
