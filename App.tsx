import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CONTENT_MODULES, RouteValue, ROUTES, isRouteValue } from './constants';
import { ModuleStrata } from './components/ModuleStrata';
import { ManifestOverlay } from './components/ManifestOverlay';
import { FrontMatterContent } from './components/FrontMatterContent';
import { CreaseMap } from './components/CreaseMap';
import { ModuleType } from './types';
import { CONTACT, hasLinkedIn } from './contact';
import { CT_DOSSIER_COPY_V120 as COPY } from './copy.v1_1';

// Site version label, wired to the copy meta so the chrome can never go stale
// against the content again (it sat at a hardcoded V1.2.0 while meta moved to
// 1.3.0 — caught in visual QA 2026-06-12).
const SITE_VERSION = `v${COPY.meta.version}`;

// Always-live contact email. Prefer a build-time override if one is set, else
// fall back to the hardcoded CONTACT constant so the email path is NEVER disabled
// (the old env-only path silently broke when the variable wasn't configured).
const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL?.trim() || CONTACT.email);

// V3.6.1: every conversation CTA resolves to ONE prefilled mailto — no modal,
// no form service. Subject + body are URL-encoded once so masthead and footer
// open the identical draft (the dossier's single conversation entry point).
const CONVERSATION_SUBJECT = 'CT DOSSIER — Conversation Request';
const CONVERSATION_BODY = [
  'Hi Ebenz,',
  '',
  'I saw CT DOSSIER and wanted to discuss fit around:',
  '',
  'Project / company:',
  'What is real:',
  'Where the language has not caught up:',
  'Timeline:',
  '',
].join('\n');
const CONVERSATION_MAILTO =
  `mailto:${CONTACT_EMAIL}` +
  `?subject=${encodeURIComponent(CONVERSATION_SUBJECT)}` +
  `&body=${encodeURIComponent(CONVERSATION_BODY)}`;

// Modules rendered on the main page (Manifest is handled via the overlay),
// sorted once at module-load time since CONTENT_MODULES is static.
const RENDERED_MODULES = CONTENT_MODULES
  .filter(m => m.id !== ModuleType.MANIFEST)
  .sort((a, b) => a.index.localeCompare(b.index));
const TOTAL_MODULE_COUNT = RENDERED_MODULES.length;
const INDEX_COUNT = String(TOTAL_MODULE_COUNT).padStart(2, '0');

// ?read= accepts the canonical route ids AND their long-form spellings, so a
// shared /?read=collaborator or /?read=academic resolves the same route.
const ROUTE_ALIASES: Record<string, RouteValue> = {
  collaborator: 'collab',
  academic: 'acad',
};
const normalizeRouteValue = (s: string | null): RouteValue | null => {
  if (s === null) return null;
  // Full Dossier is the neutral flat sheet, not a ?read route — never resolve to it.
  if (s === 'full') return null;
  if (isRouteValue(s)) return s;
  return ROUTE_ALIASES[s] ?? null;
};

// Fixed-masthead clearance — matches each section's scroll-mt-[100px].
const MASTHEAD_OFFSET = 100;

// V3.6.4 — own the scroll position. Default 'auto' makes the browser RESTORE the
// prior scroll on refresh, which read as the dossier "saving memory" and staying
// mid-stack. Set at module load (before React mounts) so there's no restore flash;
// the root effect then resets to top. openModuleIndex is never persisted.
if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
  try { history.scrollRestoration = 'manual'; } catch (e) {}
}

// Reading-stack delayed close: when switching modules, the previously-open module
// is held OPEN this long after the target opens (≈ its fold settling), so its
// collapse never steals the vertical stage while the target scrolls + folds.
const CLOSE_DELAY = 900;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// V3.6.2 scroll-first choreography. Bring a module's header onstage BEFORE it
// opens, so the pleat cascade always plays in view (short modules used to finish
// folding off-screen while the viewport was still catching up).
//
// Scroll the module band to the masthead-safe position. Returns true only if a
// scroll was actually needed — already-positioned modules open without waiting.
const scrollToModuleOffset = (index: string, behavior: ScrollBehavior): boolean => {
  const el = document.getElementById(`module-${index}`);
  if (!el) return false;
  const targetTop = Math.max(0, el.getBoundingClientRect().top + window.scrollY - MASTHEAD_OFFSET);
  const delta = Math.abs(window.scrollY - targetTop);
  if (delta <= 4) return false;
  window.scrollTo({ top: targetTop, behavior });
  return true;
};
const scrollModuleIntoView = (index: string): boolean =>
  scrollToModuleOffset(index, prefersReducedMotion() ? 'auto' : 'smooth');

// Run cb once the scroll that brings module `index` to the masthead offset has
// settled. `scrollend` fires for ANY scroll, so we only accept it once the TARGET
// module is actually at rest near the offset (or the page is clamped at the
// bottom and can't get closer) — this ignores a cross-module / re-anchor scroll
// that would otherwise commit the open while the viewport sits elsewhere. Some
// browser surfaces do not expose `scrollend`; for those, use a short-lived
// geometry probe instead of a blind fixed delay, then hard-stop so a broken
// scroll implementation cannot strand the open forever. No rAF wrap — rAF can
// be starved in background tabs and must never gate the open.
const afterScrollSettle = (index: string, cb: () => void) => {
  let done = false;
  let probeTimer: number | undefined;
  const atRest = () => {
    const el = document.getElementById(`module-${index}`);
    if (!el) return true;
    const near = Math.abs(el.getBoundingClientRect().top - MASTHEAD_OFFSET) <= 8;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const clamped = maxScroll > 0 && window.scrollY >= maxScroll - 2; // bottom of page — can't get closer
    return near || clamped;
  };
  const finish = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scrollend', onScrollEnd);
    window.clearTimeout(safety);
    if (probeTimer) window.clearTimeout(probeTimer);
    cb();
  };
  const onScrollEnd = () => { if (atRest()) finish(); };
  const hasScrollEnd = 'onscrollend' in window;
  const probe = () => {
    if (done) return;
    if (atRest()) finish();
    else probeTimer = window.setTimeout(probe, 80);
  };
  const safety = window.setTimeout(finish, hasScrollEnd ? 1400 : 1800);
  if (hasScrollEnd) window.addEventListener('scrollend', onScrollEnd);
  probeTimer = window.setTimeout(probe, 80);
};

// Time to wait out the held module's collapse (≈ --fold-duration-lg) before the
// post-collapse re-anchor measures the FINAL geometry.
const COLLAPSE_SETTLE = 760;

// V3.6.4 fix: after the held-open previous module collapses ABOVE the open
// target, the target's header can scroll above the masthead (browser scroll
// anchoring does NOT reliably compensate an animated collapse), leaving the user
// looking at the bottom of the card. Pull the target's top back to the offset —
// but only if it actually drifted UP. The caller owns the user-scroll bail so a
// user who intentionally scrolls during the collapse window is not yanked.
const reanchorModuleTop = (index: string) => {
  const el = document.getElementById(`module-${index}`);
  if (!el) return;
  const top = el.getBoundingClientRect().top;
  if (top < MASTHEAD_OFFSET - 4) {
    scrollToModuleOffset(index, prefersReducedMotion() ? 'auto' : 'smooth');
  }
};

// Inline flag of the United States — matte, flat official colors, hairline
// frame so it reads as an engraved jurisdiction mark on the cream colophon, not
// a glossy emoji. 13 stripes, 50 stars on the 6/5 alternating grid.
const UsFlag: React.FC<{ className?: string }> = ({ className }) => {
  const W = 38, H = 20;
  const stripe = H / 13;
  const cantonW = 0.4 * W;
  const cantonH = stripe * 7;
  const mx = cantonW * 0.06, my = cantonH * 0.1;
  const usableW = cantonW - 2 * mx, usableH = cantonH - 2 * my;
  const stars: React.ReactNode[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 11; col++) {
      if ((col + row) % 2 !== 0) continue;
      stars.push(
        <circle
          key={`${row}-${col}`}
          cx={mx + (col / 10) * usableW}
          cy={my + (row / 8) * usableH}
          r={0.34}
          fill="#FFFFFF"
        />
      );
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Flag of the United States" className={className}>
      <rect width={W} height={H} fill="#FFFFFF" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} y={i * 2 * stripe} width={W} height={stripe} fill="#B31942" />
      ))}
      <rect width={cantonW} height={cantonH} fill="#0A3161" />
      {stars}
      <rect width={W} height={H} fill="none" stroke="#000000" strokeOpacity="0.12" strokeWidth="0.5" />
    </svg>
  );
};

const App: React.FC = () => {
  const [openModuleIndex, setOpenModuleIndex] = useState<string | null>(null);
  // Previous module held OPEN transiently during a switch (delayed close) so it
  // doesn't collapse and steal vertical space while the target scrolls + folds.
  const [keepOpenIndex, setKeepOpenIndex] = useState<string | null>(null);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  // V3.6.8 Crease Map: the selected reading route (or null = neutral overview).
  const [selectedRoute, setSelectedRoute] = useState<RouteValue | null>(null);
  // Tab entrance arming — every exterior tab layer pans into rest position off
  // ONE shared page-load event, not N independent component mounts. Starts
  // false so first paint renders every tab off-plane; flips true one committed
  // frame later (+ timeout fallback for rAF-starved backgrounded tabs) so the
  // browser has a painted "from" state before the transition to armed fires —
  // same technique as Fold.tsx's data-pleat-open flip.
  const [tabsArmed, setTabsArmed] = useState(false);
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setTabsArmed(true));
    });
    const fallback = window.setTimeout(() => setTabsArmed(true), 90);
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(fallback);
    };
  }, []);
  // Latest scroll-first open request. A mutable ref (not state) so rapid clicks
  // resolve to the LAST module — an in-flight settle callback bails if superseded.
  const pendingRef = useRef<string | null>(null);
  // Mirror of openModuleIndex readable inside async callbacks (settle/timeout).
  const openRef = useRef<string | null>(null);
  // Pending delayed-close timer (clears the held-open previous module).
  const closeTimerRef = useRef<number | null>(null);
  const collapseSettleTimerRef = useRef<number | null>(null);
  const closeInteractionCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => { openRef.current = openModuleIndex; }, [openModuleIndex]);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (collapseSettleTimerRef.current !== null) {
      window.clearTimeout(collapseSettleTimerRef.current);
      collapseSettleTimerRef.current = null;
    }
    closeInteractionCleanupRef.current?.();
    closeInteractionCleanupRef.current = null;
  };

  // Sync ?read= with the selected route. A user selection PUSHES a history entry
  // (so Back steps back through routes); mount cleanup (?read=30s strip) REPLACES.
  // Defined before the mount effect uses it (closure).
  const writeRouteToUrl = (next: RouteValue | null, replace = false) => {
    try {
      const url = new URL(window.location.href);
      if (next) url.searchParams.set('read', next);
      else url.searchParams.delete('read');
      const method = replace ? 'replaceState' : 'pushState';
      history[method](null, document.title, url.toString());
    } catch (e) {
      // jsdom in tests doesn't always support URL — silently no-op.
    }
  };

  // Read ?read= on mount. ?read=30s is RETIRED (V3.6.8) — strip it back to the
  // neutral overview at /. Any route value (incl long-form aliases) selects it.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('read');
      // ?read=30s (retired) and ?read=full (Full Dossier = neutral flat sheet)
      // both strip back to the neutral overview at /.
      if (raw === '30s' || raw === 'full') { writeRouteToUrl(null, true); return; }
      const route = normalizeRouteValue(raw);
      if (route) setSelectedRoute(route);
    } catch (e) {
      // URLSearchParams unsupported (test env, etc.) — fall through.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Crease Map selection — stamp the route + sync ?read=. Never filters, opens,
  // or scrolls. null clears to the neutral overview.
  const selectRoute = (next: RouteValue | null) => {
    setSelectedRoute(next);
    writeRouteToUrl(next);
  };

  // Module 00 — FRONT MATTER. The route lives ONCE, in the Crease Map above the
  // stack; module 00 renders no duplicate.
  const frontMatterDisplay = useMemo(() => <FrontMatterContent />, []);

  // V3.6.8: the route is an ORIENTATION AID, never a filter. ALL modules always
  // render; the active route only drives the Index RECOMMENDED markers.
  const visibleModules = RENDERED_MODULES;
  const activeRoute = useMemo(
    () => (selectedRoute ? ROUTES.find(r => r.value === selectedRoute) ?? null : null),
    [selectedRoute]
  );
  const recommendedIndices = activeRoute ? activeRoute.modules : [];
  const recommendedLabel = activeRoute && activeRoute.modules.length ? activeRoute.label : undefined;

  // Deep-link init — open the target module if a #module-XX hash is present.
  // On root load with no hash: dossier starts fully folded (null). The first
  // user action is opening the file.
  //
  // V3.6.2: scroll the module into view FIRST, then open after the scroll frame
  // lands so the fold is visible (not finished off-screen). Two rAFs let the
  // browser's native anchor jump settle before we flip the open state.
  useEffect(() => {
    // Cold load: jump instantly to the hash module (no smooth travel to outrun),
    // then open after the native anchor jump lands (two rAFs).
    const hash = window.location.hash;
    if (hash.startsWith('#module-')) {
      const index = hash.replace('#module-', '');
      scrollToModuleOffset(index, 'auto');
      requestAnimationFrame(() => requestAnimationFrame(() => setOpenModuleIndex(index)));
    } else {
      // V3.6.4 root reset: no #module hash → start at the TOP, fully folded,
      // regardless of any restored scroll or ?read= lens. The dossier opens as
      // a fresh file, never resuming the prior scroll/module on refresh.
      try { window.scrollTo(0, 0); } catch (e) {}
    }
    // Back/forward — resync the whole app state FROM the URL (our own pushes
    // don't fire popstate, so this only runs on real history navigation). One
    // handler covers both ?read= (route) and #module- (open/close), so Back
    // steps back within the dossier: module → route → overview → exit.
    const onPop = () => {
      let route: RouteValue | null = null;
      try { route = normalizeRouteValue(new URLSearchParams(window.location.search).get('read')); } catch (e) {}
      setSelectedRoute(route);
      const h = window.location.hash;
      if (h.startsWith('#module-')) {
        const idx = h.replace('#module-', '');
        if (openRef.current !== idx) requestOpenModule(idx, false); // URL already correct
      } else if (openRef.current) {
        closeModule(false);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flat state reachable from anywhere: Escape walks one step back toward the
  // neutral overview. Priority: index → folded module. Repeated Escape from any
  // state provably lands on the flat sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isIndexOpen) { setIsIndexOpen(false); return; }
      if (openModuleIndex) {
        closeModule(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isIndexOpen, openModuleIndex]);

  // Write the module hash WITHOUT a native jump. pushState (not replace) so Back
  // closes the module; preserves any ?read= already in the URL.
  const writeModuleHash = (index: string) => {
    try {
      history.pushState(null, document.title, `${window.location.pathname}${window.location.search}#module-${index}`);
    } catch (e) {}
  };

  // Close the open module. `writeUrl` pushes the hash-less URL (a real Back step);
  // a popstate-driven close passes false (the URL is already correct).
  const closeModule = (writeUrl: boolean) => {
    pendingRef.current = null;
    clearCloseTimer();
    setKeepOpenIndex(null);
    setOpenModuleIndex(null);
    openRef.current = null;
    if (writeUrl) {
      try {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      } catch (e) {}
    }
  };

  // Scroll-first open: bring the module onstage, let the scroll settle, THEN flip
  // it open so the pleat cascade plays in view. pendingRef guards rapid re-clicks
  // — only the latest requested module actually opens.
  const requestOpenModule = (index: string, writeUrl = true) => {
    pendingRef.current = index;
    const commit = () => {
      if (pendingRef.current !== index) return; // superseded by a later request
      pendingRef.current = null;
      // Reading-stack: hold the PREVIOUS module open through the target's open +
      // fold so its collapse can't remove the stage above the target mid-motion.
      // Collapse it only after the target is stable (CLOSE_DELAY), THEN re-anchor
      // the target's top once the collapse settles — the collapse happens above
      // the target and scroll anchoring doesn't reliably keep it pinned, so
      // without this the card's header scrolls off the top ("stuck at bottom").
      clearCloseTimer();
      const prev = openRef.current;
      if (prev && prev !== index) {
        let userScrolledDuringClose = false;
        const markUserScrolledDuringClose = () => { userScrolledDuringClose = true; };
        window.addEventListener('wheel', markUserScrolledDuringClose, { passive: true });
        window.addEventListener('touchmove', markUserScrolledDuringClose, { passive: true });
        closeInteractionCleanupRef.current = () => {
          window.removeEventListener('wheel', markUserScrolledDuringClose);
          window.removeEventListener('touchmove', markUserScrolledDuringClose);
        };

        setKeepOpenIndex(prev);
        closeTimerRef.current = window.setTimeout(() => {
          closeTimerRef.current = null;
          setKeepOpenIndex(cur => (cur === prev ? null : cur));
          // prev now collapses above the target — re-anchor the target's top
          // after the collapse finishes (if it's still the open module).
          collapseSettleTimerRef.current = window.setTimeout(() => {
            collapseSettleTimerRef.current = null;
            closeInteractionCleanupRef.current?.();
            closeInteractionCleanupRef.current = null;
            if (openRef.current === index && !userScrolledDuringClose) reanchorModuleTop(index);
          }, COLLAPSE_SETTLE);
        }, CLOSE_DELAY);
      } else {
        setKeepOpenIndex(null);
      }
      setOpenModuleIndex(index);
      openRef.current = index;
      if (writeUrl) writeModuleHash(index);
    };
    const scrolled = scrollModuleIntoView(index);
    // Scrolled with motion → open once the scroll settles. Already in view (or
    // reduced motion, where the scroll is instant) → open now, in place.
    if (scrolled && !prefersReducedMotion()) afterScrollSettle(index, commit);
    else commit();
  };

  const handleToggle = (index: string) => {
    // Clicking the already-open module folds it immediately — no scroll-first.
    if (openModuleIndex === index) {
      closeModule(true);
      return;
    }
    if (pendingRef.current === index) return; // dedupe an in-flight request
    requestOpenModule(index);
  };

  const handleIndexNavigate = (index: string) => {
    setIsIndexOpen(false);
    // Let the overlay begin closing (it restores body scroll) before scroll-first.
    window.setTimeout(() => requestOpenModule(index), 60);
  };

  return (
    <div className="min-h-screen w-full relative">
      
      {/* Masthead — full-width so brand anchors to the viewport left edge and
          actions anchor to the right, independent of the max-w-6xl content
          column. Reads as document metadata, not part of any fold module. */}
      {/* Solid warm-paper bar: module bands, labels and controls scroll UNDER a
          clean edge instead of visually tangling with the logo/actions (V4 QA). */}
      <div className="fixed top-0 left-0 w-full z-40 pointer-events-none">
        <div className="px-6 md:px-10 py-4 flex justify-between items-start w-full bg-strata-cream border-b border-black/10">
         <div className="font-sans font-black text-xl tracking-tightest leading-none pointer-events-auto cursor-pointer text-black" onClick={() => window.scrollTo(0,0)}>
           CT<br/>DOSSIER<br/><span className="opacity-50">EBENZ AUGUSTAVE</span>
         </div>

         <div className="flex flex-col items-end gap-2 pointer-events-auto">
             <div className="flex items-center gap-3">
               <a
                  href={CONVERSATION_MAILTO}
                  aria-label="Request a conversation — opens a prefilled email"
                  className="hidden md:inline-block font-mono text-xs uppercase tracking-widest border border-black/40 px-3 py-1 hover:bg-black hover:text-white hover:border-black transition-colors text-black"
               >
                  REQUEST CONVERSATION -&gt;
               </a>
               <button
                  onClick={() => setIsIndexOpen(true)}
                  className="font-mono text-xs uppercase tracking-widest border border-black/40 px-3 py-1 hover:bg-black hover:text-white hover:border-black transition-colors text-black"
               >
                  INDEX ({INDEX_COUNT})
               </button>
             </div>
             <div className="hidden md:block font-mono text-micro text-right text-black/50">
               {SITE_VERSION.toUpperCase()} · NO API
             </div>
         </div>
        </div>
      </div>

      {/* pt-24/pt-32 clears the fixed masthead. Module 00 is first in the stack. */}
      <main className="w-full pt-24 md:pt-32" data-tab-armed={tabsArmed}>
        {/* The dossier's TOP FOLD — bet + folding route bands. Selecting a route
            stamps it + drives the Index markers; it never filters. */}
        <CreaseMap selectedRoute={selectedRoute} onSelectRoute={selectRoute} />

        {/* Render visible modules. Module 00 gets its dynamic responseDisplay
            injected here (carries lens state). stackIndex/stackCount drive the
            paper-stack z-index: earlier bands sit higher. */}
        {visibleModules.map((module, i) => {
          const m = module.index === '00'
            ? { ...module, responseDisplay: frontMatterDisplay }
            : module;
          return (
            <ModuleStrata
              key={m.id}
              module={m}
              // Open if it's the active module OR the previous one still held open
              // during a delayed-close switch (reading-stack: space preserved).
              isOpen={openModuleIndex === m.index || keepOpenIndex === m.index}
              onToggle={() => handleToggle(m.index)}
              stackIndex={i}
              stackCount={visibleModules.length}
            />
          );
        })}


        {/* Footer — dossier COLOPHON. Warm cream "inside back cover":
            three columns (Identity / Correspondence / Actions) + a small metadata
            seal. The old large serif closing statement is retired — the end is
            archival, not rhetorical. Cream #eee9dd reads as cover stock, a touch
            deeper than the body cream (#F2EFE4); #d6ccbb hairline seams. */}
        <footer className="w-full pt-16 pb-12 md:pt-20 md:pb-16 bg-[#eee9dd] text-[#111111] border-t border-[#d6ccbb]">
           <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-8">
                {/* Identity */}
                <div className="space-y-1">
                  <h3 className="font-sans font-bold tracking-tightest text-xl">CT DOSSIER</h3>
                  <p className="font-sans font-bold text-sm">EBENZ AUGUSTAVE</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#8a8378]">Art Director · Design Engineer</p>
                  <p className="font-mono text-xs text-[#8a8378] pt-2">{SITE_VERSION} · NO API</p>
                  <p className="font-mono text-micro uppercase tracking-wide text-[#8a8378]">Practice dossier / visual-language archive</p>
                  <p className="font-sans text-xs italic text-[#8a8378] pt-1 max-w-xs leading-relaxed">Versioned because the practice is still being refined in public.</p>
                </div>

                {/* Correspondence */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8a8378]">CORRESPONDENCE</span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    aria-label="Email Ebenz Augustave"
                    className="font-mono text-sm border-b border-[#111111] w-fit hover:bg-[#111111] hover:text-[#eee9dd] transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  {hasLinkedIn && (
                    <a
                      href={CONTACT.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Ebenz Augustave on LinkedIn"
                      className="font-mono text-sm border-b border-[#111111] w-fit hover:bg-[#111111] hover:text-[#eee9dd] transition-colors"
                    >
                      LinkedIn -&gt;
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8a8378]">ACTIONS</span>
                  <div className="flex flex-col items-start gap-2 font-mono text-sm uppercase tracking-widest">
                    <button onClick={() => setIsIndexOpen(true)} aria-label="Open dossier index" className="hover:underline">Index</button>
                    <a href={CONVERSATION_MAILTO} aria-label="Compose an inquiry — opens a prefilled email" className="hover:underline">Compose Inquiry</a>
                  </div>
                </div>
              </div>

              {/* Seal — small metadata closing stamp + a matte US flag mark,
                  subordinate to the grid. */}
              <div className="pt-5 border-t border-[#d6ccbb] flex items-center justify-between gap-4">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[#8a8378]">
                  Doctrine · Evidence · Conversation
                </p>
                <UsFlag className="h-3.5 w-auto shrink-0" />
              </div>
           </div>
        </footer>
      </main>

      {/* Manifest Overlay */}
      <ManifestOverlay
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        onNavigate={handleIndexNavigate}
        activeIndex={openModuleIndex}
        recommendedIndices={recommendedIndices}
        recommendedLabel={recommendedLabel}
      />
    </div>
  );
};

export default App;
