import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CONTENT_MODULES, AudienceId, AUDIENCES } from './constants';
import { ModuleStrata } from './components/ModuleStrata';
import { ManifestOverlay } from './components/ManifestOverlay';
import { FrontMatterContent } from './components/FrontMatterContent';
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

// Index label count — derived from the rendered module count so the chrome
// can never go stale against the module list (was hardcoded "00").
const INDEX_COUNT = String(RENDERED_MODULES.length).padStart(2, '0');

const AUDIENCE_IDS = AUDIENCES.map(a => a.id);
const isAudienceId = (s: string | null): s is AudienceId =>
  s !== null && (AUDIENCE_IDS as string[]).includes(s);

// ?read= accepts the canonical ids AND their long-form spellings, so a shared
// /?read=collaborator or /?read=academic resolves the same lens as the short id.
const READ_ALIASES: Record<string, AudienceId> = {
  collaborator: 'collab',
  academic: 'acad',
};
const normalizeAudienceId = (s: string | null): AudienceId | null => {
  if (s === null) return null;
  if (isAudienceId(s)) return s;
  return READ_ALIASES[s] ?? null;
};

// Reading-path notation: "00 -> 03 -> 07 -> 08".
const formatPath = (modules: string[]) => modules.join(' → ');

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
const scrollModuleIntoView = (index: string): boolean => {
  const el = document.getElementById(`module-${index}`);
  if (!el) return false;
  const delta = Math.abs(el.getBoundingClientRect().top - MASTHEAD_OFFSET);
  if (delta <= 4) return false;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  return true;
};

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
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }
};

const App: React.FC = () => {
  const [openModuleIndex, setOpenModuleIndex] = useState<string | null>(null);
  // Previous module held OPEN transiently during a switch (delayed close) so it
  // doesn't collapse and steal vertical space while the target scrolls + folds.
  const [keepOpenIndex, setKeepOpenIndex] = useState<string | null>(null);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<AudienceId | null>(null);
  // Selected lens collapses to a route stamp; CHANGE LENS reveals the four
  // choices again so the reader can switch without touching the URL.
  const [lensPickerOpen, setLensPickerOpen] = useState(false);
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

  // Read ?read= URL param on mount. Shareable views: ct-dossier/?read=hiring etc.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const read = normalizeAudienceId(params.get('read'));
      if (read) setSelectedAudience(read);
    } catch (e) {
      // URLSearchParams unsupported (test env, etc.) — fall through.
    }
  }, []);

  // Sync URL when audience changes. Uses replaceState so back-button isn't polluted.
  const writeAudienceToUrl = (next: AudienceId | null) => {
    try {
      const url = new URL(window.location.href);
      if (next) url.searchParams.set('read', next);
      else url.searchParams.delete('read');
      history.replaceState(null, document.title, url.toString());
    } catch (e) {
      // jsdom in tests doesn't always support URL — silently no-op.
    }
  };

  // Selecting a lens stamps the route and collapses the picker. Never opens or
  // scrolls anything.
  const selectLens = (id: AudienceId) => {
    setSelectedAudience(id);
    writeAudienceToUrl(id);
    setLensPickerOpen(false);
  };

  // CHANGE LENS — reveal the four choices again, keeping the current selection
  // until a new one is picked.
  const changeLens = () => setLensPickerOpen(true);

  const clearAudience = () => {
    setSelectedAudience(null);
    writeAudienceToUrl(null);
    setLensPickerOpen(false);
  };

  // Module 00 — FRONT MATTER. The Reading Lens lives ONCE, in the strip above
  // the stack; module 00 no longer renders a duplicate lens block.
  const frontMatterDisplay = useMemo(() => <FrontMatterContent />, []);

  // V3.6.1: the Reading Lens is an ORIENTATION AID, not a filter. Every module
  // stays on the page in narrative order, always. The lens only drives (a) the
  // helper line in module 00 and (b) the RECOMMENDED markers in the Index.
  const visibleModules = RENDERED_MODULES;

  // Recommended reading path for the active lens — module indices the Index marks
  // as RECOMMENDED. Empty when no lens is selected. Never hides anything.
  const recommendedIndices = useMemo(
    () => (selectedAudience ? AUDIENCES.find(a => a.id === selectedAudience)?.modules ?? [] : []),
    [selectedAudience]
  );
  const selectedLens = useMemo(
    () => (selectedAudience ? AUDIENCES.find(a => a.id === selectedAudience) ?? null : null),
    [selectedAudience]
  );

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
      const el = document.getElementById(`module-${index}`);
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      requestAnimationFrame(() => requestAnimationFrame(() => setOpenModuleIndex(index)));
    } else {
      // V3.6.4 root reset: no #module hash → start at the TOP, fully folded,
      // regardless of any restored scroll or ?read= lens. The dossier opens as
      // a fresh file, never resuming the prior scroll/module on refresh.
      try { window.scrollTo(0, 0); } catch (e) {}
    }
    // Our own opens use replaceState (no hashchange). This fires only on EXTERNAL
    // hash changes (typed URL, back/forward) — route them through the SAME
    // scroll-first + settle path as a click so the fold never plays mid-scroll.
    const onHash = () => {
      const h = window.location.hash;
      if (!h.startsWith('#module-')) return;
      requestOpenModule(h.replace('#module-', ''));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
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
        clearCloseTimer();
        setKeepOpenIndex(null);
        setOpenModuleIndex(null);
        openRef.current = null;
        try {
          history.pushState("", document.title, window.location.pathname + window.location.search);
        } catch (e) {}
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isIndexOpen, openModuleIndex]);

  // Write the module hash WITHOUT a native jump or hashchange (replaceState),
  // so it never fights the smooth scroll or re-enters openFromHash.
  const writeModuleHash = (index: string) => {
    try {
      history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}#module-${index}`);
    } catch (e) {}
  };

  // Scroll-first open: bring the module onstage, let the scroll settle, THEN flip
  // it open so the pleat cascade plays in view. pendingRef guards rapid re-clicks
  // — only the latest requested module actually opens.
  const requestOpenModule = (index: string) => {
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
      writeModuleHash(index);
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
      pendingRef.current = null;
      clearCloseTimer();
      setKeepOpenIndex(null);
      setOpenModuleIndex(null);
      openRef.current = null;
      try {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      } catch (e) {}
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
      <div className="fixed top-0 left-0 w-full z-40 pointer-events-none">
        <div className="px-6 md:px-10 py-4 flex justify-between items-start w-full">
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
      <main className="w-full pt-24 md:pt-32">
        <section
          aria-label="Reading Lens"
          data-testid="reading-lens-strip"
          className="container mx-auto px-4 md:px-8 max-w-6xl mb-4 md:mb-6"
        >
          <div className="border-y border-black/10 py-3 md:py-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            {/* The lens is a route STAMP. A selected lens collapses to route
                metadata + a single CHANGE LENS control; the four choices return
                only when the reader asks for them. Lives ONCE here (module 00
                renders no duplicate). Never opens or scrolls anything. */}
            <div className="flex flex-col gap-1 min-w-0" aria-live="polite">
              <span className="font-mono text-micro uppercase tracking-[0.25em] text-black/40">
                Reading Lens
              </span>
              {selectedLens && !lensPickerOpen ? (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-micro uppercase tracking-[0.22em] text-black/70">
                    Reading path · {selectedLens.label}
                  </span>
                  <span className="font-mono text-xs md:text-sm tracking-[0.3em] text-strata-blue" data-testid="reading-lens-path">
                    {formatPath(selectedLens.modules)}
                  </span>
                  <span className="font-mono text-micro uppercase tracking-[0.18em] text-black/55 leading-relaxed" data-testid="active-reading-lens">
                    {selectedLens.helper}
                  </span>
                  <button
                    type="button"
                    onClick={changeLens}
                    aria-label="Change reading lens"
                    className="self-start mt-1 font-mono text-micro uppercase tracking-widest text-black/45 hover:text-black underline-offset-4 hover:underline transition-colors"
                  >
                    Change lens
                  </button>
                </div>
              ) : (
                <span className="font-mono text-micro uppercase tracking-[0.18em] text-black/55 leading-relaxed" data-testid="active-reading-lens">
                  Select a reading lens.
                </span>
              )}
            </div>
            {/* Picker — shown when no lens is chosen OR when CHANGE LENS reveals
                the choices. Once a lens is selected the choices are removed
                entirely (not hidden) so they leave the tab order. */}
            {(!selectedAudience || lensPickerOpen) && (
              <div className="flex flex-wrap gap-2 shrink-0">
                {AUDIENCES.map((a) => {
                  const isActive = selectedAudience === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => selectLens(a.id)}
                      aria-pressed={isActive}
                      aria-label={`Set reading lens: ${a.label}`}
                      className={`font-mono text-micro md:text-xs uppercase tracking-widest border px-3 py-1.5 transition-colors ${
                        isActive
                          ? 'bg-black text-white border-black'
                          : 'bg-transparent text-black/60 border-black/25 hover:border-black hover:text-black'
                      }`}
                    >
                      {a.label}
                    </button>
                  );
                })}
                {selectedAudience && (
                  <button
                    type="button"
                    onClick={clearAudience}
                    aria-label="Clear reading lens"
                    className="font-mono text-micro md:text-xs uppercase tracking-widest border border-black/20 px-3 py-1.5 text-black/45 hover:text-black hover:border-black transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

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


        {/* Footer — dossier colophon (V3.5.0). Three columns (Identity /
            Correspondence / Actions) on the shared grid + a full-width closing
            doctrine line. Contact paths come from contact.ts. */}
        <footer className="w-full py-12 md:py-24 bg-white text-black border-t border-black/10 mt-12">
           <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                {/* Identity */}
                <div className="space-y-1">
                  <h3 className="font-sans font-bold tracking-tightest text-xl">CT DOSSIER</h3>
                  <p className="font-sans font-bold text-sm">EBENZ AUGUSTAVE</p>
                  <p className="font-mono text-xs uppercase tracking-widest opacity-60">Art Director · Design Engineer</p>
                  <p className="font-mono text-xs opacity-50 pt-2">{SITE_VERSION} · NO API</p>
                  <p className="font-mono text-micro uppercase tracking-wide opacity-50">Practice dossier / visual-language archive</p>
                  <p className="font-sans text-xs italic opacity-50 pt-1 max-w-xs leading-relaxed">Versioned because the practice is still being refined in public.</p>
                </div>

                {/* Correspondence */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest opacity-50">CORRESPONDENCE</span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    aria-label="Email Ebenz Augustave"
                    className="font-mono text-sm border-b border-black w-fit hover:bg-black hover:text-white transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  {hasLinkedIn && (
                    <a
                      href={CONTACT.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Ebenz Augustave on LinkedIn"
                      className="font-mono text-sm border-b border-black w-fit hover:bg-black hover:text-white transition-colors"
                    >
                      LinkedIn -&gt;
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest opacity-50">ACTIONS</span>
                  <div className="flex flex-col items-start gap-2 font-mono text-sm uppercase tracking-widest">
                    <button onClick={() => setIsIndexOpen(true)} aria-label="Open dossier index" className="hover:underline">Index</button>
                    <a href={CONVERSATION_MAILTO} aria-label="Compose an inquiry — opens a prefilled email" className="hover:underline">Compose Inquiry</a>
                  </div>
                </div>
              </div>

              {/* Closing doctrine line */}
              <div className="mt-12 pt-8 border-t border-black/10">
                <p className="font-serif text-lg md:text-2xl leading-relaxed">
                  The dossier is the doctrine.<br/>
                  The portfolio sites are the evidence.<br/>
                  The conversation is where fit is tested.
                </p>
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
        recommendedLabel={selectedLens?.label}
      />
    </div>
  );
};

export default App;
