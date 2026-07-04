import React, { useEffect, useRef } from 'react';
import { ModuleData, ModuleType } from '../types';
import { COLORS } from '../constants';
import { CollapsibleDrawer } from './CollapsibleDrawer';
import { Fold } from './Fold';
import { PleatFold } from './PleatFold';
import { useClipboard } from '../hooks/useClipboard';
import { ChevronDownIcon, FingerprintIcon, LinkIcon, CheckIcon } from './icons';
import { SplitFlap } from './SplitFlap';

// Unwrap the response into pleat rows. If it's a single wrapper element with
// several children (e.g. <div className="space-y-8">…</div>) or a Fragment,
// return those children as the rows + the wrapper's className, so its spacing
// (space-y-*) keeps applying once the children become pleats. A single
// component / string stays one row — safe, it keeps its own layout.
const unwrapResponse = (node: React.ReactNode): { className: string; rows: React.ReactNode[] } => {
  const arr = React.Children.toArray(node);
  const only = arr[0];
  if (arr.length === 1 && React.isValidElement(only)) {
    if (only.type === React.Fragment) {
      return { className: '', rows: React.Children.toArray((only.props as { children?: React.ReactNode }).children) };
    }
    const props = only.props as { className?: string; children?: React.ReactNode };
    const kids = React.Children.toArray(props.children);
    if (kids.length > 1) return { className: props.className ?? '', rows: kids };
  }
  return { className: '', rows: arr };
};

interface ModuleStrataProps {
  module: ModuleData;
  isOpen: boolean;
  onToggle: () => void;
  /** Position in the rendered stack (0 = top sheet). */
  stackIndex: number;
  /** Total bands rendered, for the z-index cascade. */
  stackCount: number;
}

export const ModuleStrata: React.FC<ModuleStrataProps> = ({ module, isOpen, onToggle, stackIndex, stackCount }) => {
  const themeClass = COLORS[module.themeColor];
  // Which bands get the tab entrance motion — same set as before (cream/blue/clay),
  // no image attached to it on this version, just the pan-to-rest layer.
  const hasTab =
    module.themeColor === 'cream' ||
    module.themeColor === 'blue' ||
    module.themeColor === 'clay';

  // Paper-stack z-index: earlier bands sit HIGHER so each sheet's drop shadow
  // draws over the (opaque) band below instead of being painted over by it.
  // The open band lifts above the whole stack. All values stay < the fixed
  // header (z-40) and the overlays (z-50+).
  const zIndex = isOpen ? stackCount + 10 : stackCount - stackIndex;

  // Elevation shadow per band. Dark / white-text bands (blue, black, clay) keep
  // the full paper-lift drop shadow + a faint matte ambient highlight at the
  // sheet's TOP edge (inset) — the lit edge of a lifted sheet.
  //
  // V3.6.4: CREAM bands flatten. The old wide soft drop (0 16/34px, 17/32px blur)
  // cast onto the cream band BELOW it (cream-over-cream: 00 → 01) read as a
  // top-down "SaaS hero" gradient. Cream now uses a TIGHT, subtle paper-depth so
  // the band-to-band transition is the crisp matte hairline seam (border-b),
  // not a soft gradient. Dark-band lift is unchanged.
  // Literal class strings (not interpolated) so Tailwind's JIT emits them.
  const isDarkBand = module.themeColor !== 'cream';
  const shadowClass = isOpen
    ? (isDarkBand
        ? 'shadow-[0_34px_32px_rgba(0,0,0,0.15),0_-14px_18px_rgba(0,0,0,0.06),inset_0_6px_9px_-5px_rgba(255,255,255,0.13)]'
        : 'shadow-[0_3px_8px_-2px_rgba(0,0,0,0.08)]')
    : (isDarkBand
        ? 'shadow-[0_16px_17px_rgba(0,0,0,0.065),inset_0_6px_9px_-5px_rgba(255,255,255,0.13)]'
        : 'shadow-[0_1px_2px_rgba(0,0,0,0.05)]');

  const resp = unwrapResponse(module.responseDisplay);
  // A response that is a single custom component (Visual Languages, Doctrine
  // Library) pleats its OWN rows internally — render it bare so we don't wrap
  // it in one big rotating block (which would double-rotate its inner pleats).
  const selfPleating =
    resp.rows.length === 1 &&
    React.isValidElement(resp.rows[0]) &&
    typeof (resp.rows[0] as React.ReactElement).type === 'function';
  const containerRef = useRef<HTMLElement>(null);
  const { copy, copied: linkCopied } = useClipboard();
  const panelId = `module-panel-${module.index}`;
  const linkStatusId = `module-link-status-${module.index}`;

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // V3.6.2 choreography has TWO scrolls:
  //   1. App scroll-first (BEFORE open) — brings the band onstage so the pleat
  //      cascade plays in view, never off-screen.
  //   2. THIS post-fold RE-ANCHOR — once the fold has settled, pull the band's
  //      TOP back to the masthead-safe position. The open can shift the document
  //      mid-animation (most often a PREVIOUSLY-OPEN module COLLAPSING above this
  //      one), which leaves the freshly-opened card sitting "down". Re-anchoring
  //      against the FINAL geometry lands the user at the top of the card:
  //      "click → fold → back up to the top of the card."
  // Latch on the section's padding-top transitionend (the band finished growing →
  // layout is final), with a timeout fallback. Only runs on open, never on close.
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const el = containerRef.current;
    const HEADER_OFFSET = 100; // matches scroll-mt-[100px] / fixed masthead height
    const reduced = prefersReducedMotion();
    let cancelled = false;
    let userScrolled = false;
    let fallbackId: number | undefined;

    // If the user grabs the scroll during the fold window, DON'T yank them back.
    const markUser = () => { userScrolled = true; };
    window.addEventListener('wheel', markUser, { passive: true });
    window.addEventListener('touchmove', markUser, { passive: true });

    const teardown = () => {
      el.removeEventListener('transitionend', onEnd);
      window.removeEventListener('wheel', markUser);
      window.removeEventListener('touchmove', markUser);
      if (fallbackId) window.clearTimeout(fallbackId);
    };

    const reanchor = () => {
      teardown();
      if (cancelled || userScrolled || !containerRef.current) return;
      const rectTop = el.getBoundingClientRect().top;
      // Already at the top — scroll anchoring held the card while a module above
      // collapsed, or scroll-first already nailed it. Skip the needless second
      // scroll so the flagship case is one motion, not a settle-then-slide jump.
      if (Math.abs(rectTop - HEADER_OFFSET) <= 4) return;
      window.scrollTo({ top: rectTop + window.scrollY - HEADER_OFFSET, behavior: reduced ? 'auto' : 'smooth' });
    };

    function onEnd(e: TransitionEvent) {
      // Section transitions padding + box-shadow; latch padding-top so we fire
      // once, and only for THIS section (not a bubbled child transition).
      if (e.target !== el || e.propertyName !== 'padding-top') return;
      reanchor();
    }

    el.addEventListener('transitionend', onEnd);
    // Fallback when no transitionend fires (reduced motion, interrupted layout).
    fallbackId = window.setTimeout(reanchor, reduced ? 80 : 900);

    return () => {
      cancelled = true;
      teardown();
    };
  }, [isOpen]);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#module-${module.index}`;
    await copy(url);
  };

    // Artifacts UI Removed

  return (
    <section
      ref={containerRef}
      id={`module-${module.index}`}
      aria-label={`Module ${module.index}: ${module.title}`}
      // PRD v1.0.2: scroll-margin-top added for fixed header offset
      // EVERY band reads as a sheet of paper with a full-width pure-black
      // elevation drop shadow UNDERNEATH it — always, even closed (the
      // persistent stack). The OPEN band lifts higher: a deeper shadow below
      // plus a faint one above. `zIndex` (set via style) makes earlier sheets
      // sit above the next so each shadow draws over the opaque band below.
      // Elevation shadow, not a colour gradient — matte, on-doctrine.
      style={{ zIndex }}
      className={`relative w-full border-b border-black/10 transition-[padding,box-shadow] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${themeClass} ${isOpen ? 'py-12 md:py-24' : 'py-8 md:py-12'} ${shadowClass} cursor-pointer group scroll-mt-[100px]`}
      onClick={(e) => {
        const target = e.target as Element;
        if (target.closest('a') || target.closest('button')) return;
        onToggle();
      }}
    >
      {hasTab && (
        <div
          className="module-tab-skin"
          aria-hidden="true"
          style={{ transitionDelay: `calc(var(--tab-stagger) * ${stackIndex})` }}
        />
      )}
      <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Header Band */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-12 select-none">
          <div className="flex items-baseline gap-6 relative">
             <span className="module-index font-mono text-4xl md:text-6xl font-bold tracking-tighter" aria-hidden="true">
              {module.index}
            </span>
            <h2 className="font-sans text-3xl md:text-5xl font-bold uppercase tracking-tightest leading-none">
              <SplitFlap text={module.title} open={isOpen} />
            </h2>
            <span id={linkStatusId} className="sr-only" role="status" aria-live="polite">
              {linkCopied ? 'Link copied to clipboard.' : ''}
            </span>
          </div>
          
          
          {/* Single open/close control. The ONLY visible label is "+ STUDY"
              (collapsed) / "FOLD" (expanded); the descriptive Expand/Collapse
              wording lives in aria-label, never as visible text. This button is
              the real focusable control (carries aria-expanded/-controls), so no
              separate sr-only toggle is needed. */}
          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest opacity-muted shrink-0">
            {/* Copy-link — hidden until the band is hovered or this button takes
                keyboard focus (focus-visible). Same rule on every module. */}
            <button
                onClick={handleCopyLink}
                aria-label={`Copy link to ${module.title}`}
                title="Copy link to module"
                className="hidden md:inline-flex p-1 opacity-0 group-hover:opacity-60 hover:!opacity-100 focus-visible:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-current rounded-sm transition-opacity"
            >
                {linkCopied ? <CheckIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            </button>
            <button
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${module.title}`}
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className="flex items-center gap-2 hover:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-current rounded-sm px-1 transition-opacity"
            >
                <span>{isOpen ? 'FOLD' : '+ STUDY'}</span>
                <div className={`transform transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronDownIcon />
                </div>
            </button>
          </div>
        </div>

        {/* Primary Content (Prompt + Response) - Visible when Open */}
        {/* Primary content panel — folds via the shared <Fold> primitive.
            Inert when collapsed: kept in the DOM for the fold animation but
            removed from tab order + a11y tree (mirrors aria-expanded=false).
            `large` selects the 700ms strata duration. */}
        <Fold open={isOpen} large id={panelId}>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mt-8 pt-8">
            
            {/* Content column — full width (the evidence sidebar was removed in V3.1). */}
            <div className="md:col-span-12">

              {/* Prompt block — chrome (the 'summary' line), not pleated. */}
              <div className="mb-6">
                <span className="font-mono text-micro uppercase tracking-widest block mb-2" style={{ color: 'var(--text-muted)' }}>
                  Prompt
                </span>
                <div className="font-mono text-xs uppercase tracking-widest border-l-2 pl-4 py-1 leading-relaxed" style={{ color: 'var(--text-primary)', borderColor: 'var(--hairline)' }}>
                  {module.promptText}
                </div>
              </div>

              {/* Response label — chrome. */}
              <div className="mb-3">
                <span className="font-mono text-micro uppercase tracking-widest block" style={{ color: 'var(--text-muted)' }}>
                  Response
                </span>
              </div>
              {/* Response — the origami PLEAT ACCORDION. The response wrapper is
                  unwrapped into its rows; each becomes a mountain/valley pleat.
                  The wrapper's spacing (space-y-*) + the serif base ride along
                  via className, so typography + rhythm are unchanged. A single
                  self-pleating component renders bare (it folds its own cards). */}
              <div className="mb-12 font-serif text-xl md:text-3xl leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {selfPleating ? (
                  resp.rows[0]
                ) : (
                  <PleatFold open={isOpen} className={`pleatfold--prose${resp.className ? ` ${resp.className}` : ''}`}>
                    {resp.rows}
                  </PleatFold>
                )}
              </div>



                {/* Generic implications drawer (unused by current modules,
                    kept as a generic affordance). Role-fit cards and the
                    Role Matrix simulator were removed in the V3 reposition. */}
                {module.implications && (
                   <CollapsibleDrawer title={`${module.implications.title}`} icon={<FingerprintIcon className="w-4 h-4"/>}>
                       <ul className="space-y-4 mt-4">
                        {module.implications.content.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start pl-4 border-l-2 border-current/30">
                            <span className="font-mono text-xs pt-1 opacity-50">{(i + 1).toString().padStart(2, '0')}</span>
                            <span className="font-sans text-lg">{item}</span>
                          </li>
                        ))}
                       </ul>
                   </CollapsibleDrawer>
                )}

              </div>
          </div>

        </Fold>
      </div>
    </section>
  );
};
