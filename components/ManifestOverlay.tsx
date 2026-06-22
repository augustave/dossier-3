import React, { useEffect, useState } from 'react';
import { CONTENT_MODULES } from '../constants';
import { CT_DOSSIER_COPY_V120 as COPY } from '../copy.v1_1';
import { ModuleType } from '../types';
import { ArrowRightIcon, XIcon } from './icons';

interface ManifestOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: string) => void;
  /** Currently open module index (e.g. "03"), or null if all folded. */
  activeIndex: string | null;
  /** Module indices currently on the page — the active Reading Lens route, or
      all modules when no lens is selected. The Index lists ONLY these so a click
      can't target a filtered-out module. */
  visibleIndices: string[];
}

export const ManifestOverlay: React.FC<ManifestOverlayProps> = ({ isOpen, onClose, onNavigate, activeIndex, visibleIndices }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500); // Match transition duration
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col transition-all duration-[var(--fold-duration)] ease-[var(--fold-ease)] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-strata-cream/95 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Content Container */}
      <div className={`relative w-full max-w-6xl mx-auto px-4 md:px-8 h-full flex flex-col justify-center transition-transform duration-[var(--fold-duration)] ease-[var(--fold-ease)] delay-100 ${isOpen ? 'translate-y-0' : 'translate-y-8'}`}>
        
        {/* Header (Close Button) */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
           <button 
             onClick={onClose}
             className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-black text-white px-4 py-2 hover:bg-black/80 transition-colors"
           >
             <span>Close Index</span>
             <XIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
           </button>
        </div>

        <div className="mb-12">
          <h2 className="font-sans text-9xl font-bold tracking-tighter opacity-ghost select-none">INDEX</h2>
          {/* Personhood epigraph — VOICE v2 (PRD-VOICE-V2). Sets tone on open. */}
          <p className="font-serif text-2xl md:text-3xl opacity-secondary mt-2">{COPY.indexEpigraph}</p>
        </div>

        {/* Module list — narrative order. V3.6.9: lists ONLY the modules on the
            page (the active lens route, or all when no lens), so the Index is the
            route's map and a click can't target a filtered-out module. Active
            module shows OPEN. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {CONTENT_MODULES
            .filter(m => m.id !== ModuleType.MANIFEST)
            .filter(m => visibleIndices.includes(m.index))
            .sort((a, b) => a.index.localeCompare(b.index))
            .map((m) => {
              const isActive = m.index === activeIndex;
              const rowLabel = isActive ? `${m.index} ${m.title} — open` : `${m.index} ${m.title}`;
              return (
                <button
                  type="button"
                  key={m.index}
                  data-testid="manifest-item"
                  data-index={m.index}
                  onClick={() => onNavigate(m.index)}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={rowLabel}
                  className={`group/item w-full text-left flex items-baseline gap-4 cursor-pointer border-b pb-4 transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-strata-blue rounded-sm ${
                    isActive
                      ? 'border-strata-blue/40 pl-4'
                      : 'border-black/10 hover:pl-4'
                  }`}
                >
                  <span className={`font-mono text-3xl md:text-4xl font-bold transition-all ${
                    isActive
                      ? 'text-strata-blue opacity-100'
                      : 'opacity-subtle group-hover/item:opacity-primary group-hover/item:text-strata-blue'
                  }`}>
                    {m.index}
                  </span>
                  <span className="flex flex-col gap-1 min-w-0">
                    <span className={`font-sans text-xl md:text-2xl font-bold uppercase tracking-tight transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-secondary group-hover/item:opacity-100'
                    }`}>
                      {m.title}
                    </span>
                    <span className="font-mono text-micro uppercase tracking-widest opacity-subtle">
                      {m.promptText}
                    </span>
                  </span>
                  {isActive ? (
                    <span className="ml-auto self-center font-mono text-micro uppercase tracking-widest text-strata-blue opacity-70 shrink-0">
                      OPEN
                    </span>
                  ) : (
                    <ArrowRightIcon className="ml-auto self-center w-5 h-5 opacity-0 group-hover/item:opacity-primary transition-opacity shrink-0" />
                  )}
                </button>
              );
            })}
        </div>

        <div className="mt-12 font-mono text-xs opacity-subtle max-w-md">
            CT DOSSIER v{COPY.meta.version}<br/>
            NO API. STATIC GENERATION.<br/>
            TASTE-LED. {CONTENT_MODULES.filter(m => m.id !== ModuleType.MANIFEST).length} STRATA.
        </div>

      </div>
    </div>
  );
};
