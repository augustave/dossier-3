import React, { useRef, useEffect } from 'react';
import { ModuleData, ModuleType } from '../types';
import { COLORS } from '../constants';
import { CollapsibleDrawer } from './CollapsibleDrawer';
import { Fold } from './Fold';
import { useClipboard } from '../hooks/useClipboard';
import { ChevronDownIcon, FingerprintIcon, LinkIcon, CheckIcon } from './icons';

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

  // Paper-stack z-index: earlier bands sit HIGHER so each sheet's drop shadow
  // draws over the (opaque) band below instead of being painted over by it.
  // The open band lifts above the whole stack. All values stay < the fixed
  // header (z-40) and the overlays (z-50+).
  const zIndex = isOpen ? stackCount + 10 : stackCount - stackIndex;
  const containerRef = useRef<HTMLElement>(null);
  const { copy, copied: linkCopied } = useClipboard();
  const panelId = `module-panel-${module.index}`;
  const linkStatusId = `module-link-status-${module.index}`;

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Snap to view when opened.
  // We wait for the section's open transition to settle before scrolling so
  // the scroll target is computed against the FINAL geometry, not the
  // mid-animation geometry. Otherwise the band overshoots: scrollIntoView
  // captures offsetTop while the section is still expanding, and the
  // smooth-scroll lands above the actual band header.
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const el = containerRef.current;
    const HEADER_OFFSET = 100; // matches scroll-mt-[100px] / fixed header height
    let cancelled = false;
    let fallbackId: number | undefined;

    const doScroll = () => {
      if (cancelled || !containerRef.current) return;
      const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior });
    };

    const onEnd = (e: TransitionEvent) => {
      // Section transitions multiple props; latch onto padding-top so we fire once.
      if (e.target !== el) return;
      if (e.propertyName !== 'padding-top') return;
      el.removeEventListener('transitionend', onEnd);
      if (fallbackId) window.clearTimeout(fallbackId);
      doScroll();
    };

    el.addEventListener('transitionend', onEnd);
    // Fallback: if no transitionend fires (reduced motion, instant layout, etc.).
    fallbackId = window.setTimeout(() => {
      el.removeEventListener('transitionend', onEnd);
      doScroll();
    }, 750);

    return () => {
      cancelled = true;
      el.removeEventListener('transitionend', onEnd);
      if (fallbackId) window.clearTimeout(fallbackId);
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
      className={`relative w-full border-b border-black/10 transition-[padding,box-shadow] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${themeClass} ${isOpen ? 'py-12 md:py-24 shadow-[0_34px_64px_rgba(0,0,0,0.30),0_-14px_36px_rgba(0,0,0,0.12)]' : 'py-8 md:py-12 shadow-[0_16px_34px_rgba(0,0,0,0.13)]'} cursor-pointer group scroll-mt-[100px]`}
      onClick={(e) => {
        const target = e.target as Element;
        if (target.closest('a') || target.closest('button')) return;
        onToggle();
      }}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Header Band */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-12 select-none">
          <div className="flex items-baseline gap-6 relative">
             <span className="module-index font-mono text-4xl md:text-6xl font-bold tracking-tighter" aria-hidden="true">
              {module.index}
            </span>
            <h2 className="font-sans text-3xl md:text-5xl font-bold uppercase tracking-tightest leading-none">
              {module.title}
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

        {/* PRD v1.0.2: Band Preview Mode (Visible when Collapsed) */}
        {!isOpen && (
            <div className="hidden md:grid grid-cols-12 gap-8 mt-6 items-start opacity-100 transition-opacity duration-500">
                <div className="col-span-12 border-l-2 pl-6" style={{ borderColor: 'var(--hairline)' }}>
                    <p className="font-mono text-sm md:text-base uppercase tracking-wide leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                        {module.promptText}
                    </p>
                </div>
            </div>
        )}

        {/* Primary Content (Prompt + Response) - Visible when Open */}
        {/* Primary content panel — folds via the shared <Fold> primitive.
            Inert when collapsed: kept in the DOM for the fold animation but
            removed from tab order + a11y tree (mirrors aria-expanded=false).
            `large` selects the 700ms strata duration. */}
        <Fold open={isOpen} large id={panelId}>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mt-8 pt-8 border-t" style={{ borderColor: 'var(--fold-crease)' }}>
            
            {/* Content column — full width (the evidence sidebar was removed in V3.1). */}
            <div className="md:col-span-12">
              
              {/* Prompt Block */}
              <div className="mb-6">
                <span className="font-mono text-micro uppercase tracking-widest block mb-2" style={{ color: 'var(--text-muted)' }}>
                  Prompt
                </span>
                <div className="font-mono text-xs uppercase tracking-widest border-l-2 pl-4 py-1 leading-relaxed" style={{ color: 'var(--text-primary)', borderColor: 'var(--hairline)' }}>
                  {module.promptText}
                </div>
              </div>

              {/* Response Block */}
              <div className="mb-12">
                 <span className="font-mono text-micro uppercase tracking-widest block mb-2" style={{ color: 'var(--text-muted)' }}>
                  Response
                </span>
                <div className="font-serif text-xl md:text-3xl leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {module.responseDisplay}
                </div>
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
