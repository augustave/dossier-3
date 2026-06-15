import React, { useRef, useEffect } from 'react';
import { ModuleData, ModuleType } from '../types';
import { COLORS } from '../constants';
import { CollapsibleDrawer } from './CollapsibleDrawer';
import { useClipboard } from '../hooks/useClipboard';
import { ChevronDownIcon, FingerprintIcon, LinkIcon, CheckIcon } from './icons';

interface ModuleStrataProps {
  module: ModuleData;
  isOpen: boolean;
  onToggle: () => void;
}

export const ModuleStrata: React.FC<ModuleStrataProps> = ({ module, isOpen, onToggle }) => {
  const themeClass = COLORS[module.themeColor];
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
      className={`relative w-full border-b border-black/10 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${themeClass} ${isOpen ? 'py-12 md:py-24' : 'py-8 md:py-12'} cursor-pointer group scroll-mt-[100px]`}
      onClick={(e) => {
        const target = e.target as Element;
        if (target.closest('a') || target.closest('button')) return;
        onToggle();
      }}
    >
      {/* Sole keyboard / screen-reader control. The section itself is a plain
          mouse click-target (no role/tabIndex); this button carries the
          aria-expanded/aria-controls state and becomes visible on focus. */}
      <button
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:top-2 focus:left-4 focus:p-2 focus:bg-white focus:text-black focus:border focus:border-black focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
      >
        {isOpen ? 'Collapse' : 'Expand'} {module.title}
      </button>
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
            
            {/* Share Button (Only visible on hover/open) */}
            <button 
              onClick={handleCopyLink}
              aria-describedby={linkStatusId}
              aria-label={`Copy link to ${module.title}`}
              className={`absolute -right-12 top-2 p-2 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity hidden md:block`}
              title="Copy link to module"
            >
              {linkCopied ? <CheckIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
            </button>
            <span id={linkStatusId} className="sr-only" role="status" aria-live="polite">
              {linkCopied ? 'Link copied to clipboard.' : ''}
            </span>
          </div>
          
          
          {/* Single visible open/close control — "+ STUDY" collapsed, "FOLD"
              expanded. Decorative (aria-hidden/tabIndex -1): the sr-only button
              above carries the accessible semantics; the band itself is clickable. */}
          <div className="hidden md:flex items-center gap-3 font-mono text-xs uppercase tracking-widest opacity-muted">
            <button
                aria-hidden="true"
                tabIndex={-1}
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className="flex items-center gap-2 hover:opacity-100 transition-opacity"
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
        <div
          id={panelId}
          // When collapsed the panel is `inert`: kept in the DOM for the fold
          // animation, but removed from the tab order and the accessibility tree
          // so screen readers and keyboard users don't reach a folded module's
          // chart, filter chips, or CTA links. Mirrors aria-expanded=false.
          inert={!isOpen}
          className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'max-h-[5000px] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'}`}
        >
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pt-8 border-t border-current/20">
            
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

        </div>
      </div>
    </section>
  );
};
