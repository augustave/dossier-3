import React, { useState, useEffect, useMemo } from 'react';
import { CONTENT_MODULES } from './constants';
import { ModuleStrata } from './components/ModuleStrata';
import { InquiryPanel } from './components/InquiryPanel';
import { ManifestOverlay } from './components/ManifestOverlay';
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
const TARGET_ROLES = [
  'Creative Technologist',
  'Visual Designer, Defense',
  'Design Technologist',
  'Product Designer, Mission Systems',
  'Brand Designer, Technical Products'
];

// Modules rendered on the main page (Manifest is handled via the overlay),
// sorted once at module-load time since CONTENT_MODULES is static.
const RENDERED_MODULES = CONTENT_MODULES
  .filter(m => m.id !== ModuleType.MANIFEST)
  .sort((a, b) => a.index.localeCompare(b.index));

/**
 * Faceted entry — audience reads. Each maps to a curated subset of
 * module indices, ordered by "start with" priority for that audience.
 * War-gamed mapping (see PRD-FACETED-ENTRY.md):
 *   hiring → 01 Role fit / 02 Creative technologist (chart) / 05 Portfolios
 *   client → 01 Role fit / 03 Operating method (explorer)   / 05 Portfolios
 *   collab → 02 Creative technologist (chart) / 04 World model / 03 Operating method (explorer)
 *   acad   → 04 World model / 02 Creative tech. (chart)      / 03 Operating method (explorer)
 */
type AudienceId = 'hiring' | 'client' | 'collab' | 'acad';

interface Audience {
  id: AudienceId;
  label: string;
  modules: string[];
}

const AUDIENCES: Audience[] = [
  { id: 'hiring', label: 'HIRING MANAGER', modules: ['01', '02', '05'] },
  { id: 'client', label: 'CLIENT',         modules: ['01', '03', '05'] },
  { id: 'collab', label: 'COLLABORATOR',   modules: ['02', '04', '03'] },
  { id: 'acad',   label: 'ACADEMIC',       modules: ['04', '02', '03'] }
];
const AUDIENCE_IDS = AUDIENCES.map(a => a.id);
const isAudienceId = (s: string | null): s is AudienceId =>
  s !== null && (AUDIENCE_IDS as string[]).includes(s);

const App: React.FC = () => {
  const [openModuleIndex, setOpenModuleIndex] = useState<string | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [inquiryContext, setInquiryContext] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<AudienceId | null>(null);

  // Read ?read= URL param on mount. Shareable views: ct-dossier/?read=hiring etc.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const read = params.get('read');
      if (isAudienceId(read)) setSelectedAudience(read);
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

  const handleAudience = (id: AudienceId) => {
    const next = selectedAudience === id ? null : id;
    setSelectedAudience(next);
    writeAudienceToUrl(next);
  };

  const clearAudience = () => {
    setSelectedAudience(null);
    writeAudienceToUrl(null);
  };

  // Modules currently visible. When an audience is selected, render only that
  // audience's curated subset, in the audience's preferred order. Otherwise
  // the full index-sorted list.
  const visibleModules = useMemo(() => {
    if (!selectedAudience) return RENDERED_MODULES;
    const audience = AUDIENCES.find(a => a.id === selectedAudience);
    if (!audience) return RENDERED_MODULES;
    return audience.modules
      .map(idx => RENDERED_MODULES.find(m => m.index === idx))
      .filter((m): m is (typeof RENDERED_MODULES)[number] => m !== undefined);
  }, [selectedAudience]);

  // Handle initialization (Deep Link > Default Module 01)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#module-')) {
      const index = hash.replace('#module-', '');
      setOpenModuleIndex(index);
    } else {
        setOpenModuleIndex("01");
        try {
            history.replaceState(null, document.title, '#module-01');
        } catch(e) {}
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash;
      if (currentHash.startsWith('#module-')) {
        const index = currentHash.replace('#module-', '');
        setOpenModuleIndex(index);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggle = (index: string) => {
    if (openModuleIndex === index) {
      setOpenModuleIndex(null);
      // clear hash without jump
      try {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      } catch (e) {}
    } else {
      setOpenModuleIndex(index);
       try {
        window.location.hash = `module-${index}`;
      } catch (e) {}
    }
  };

  const handleIndexNavigate = (index: string) => {
      setIsIndexOpen(false);
      // Small delay to allow overlay to close before scrolling/expanding
      setTimeout(() => {
          handleToggle(index);
          // Ensure it's open if it wasn't
          setOpenModuleIndex(index);
          window.location.hash = `module-${index}`;
      }, 300);
  };

  const handleInquiryRequest = (context: string) => {
    setInquiryContext(context);
    setIsInquiryOpen(true);
  };

  return (
    <div className="min-h-screen w-full relative">
      
      {/* Navigation / Brand Overlay */}
      <div className="fixed top-0 left-0 w-full z-40 pointer-events-none px-4 py-4 md:px-8 flex justify-between items-start">
         <div className="font-sans font-black text-xl tracking-tightest leading-none pointer-events-auto cursor-pointer text-black" onClick={() => window.scrollTo(0,0)}>
           CT<br/>DOSSIER<br/><span className="opacity-50">EBENZ AUGUSTAVE</span>
         </div>
         
         <div className="flex flex-col items-end gap-2 pointer-events-auto">
             <div className="flex items-center gap-4">
               <button 
                  onClick={() => handleInquiryRequest("General Inquiry")}
                  className="hidden md:block font-mono text-xs uppercase tracking-widest border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors text-black"
               >
                  REQUEST CONVERSATION -&gt;
               </button>
               <button 
                  onClick={() => setIsIndexOpen(true)}
                  className="font-mono text-xs uppercase tracking-widest border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors text-black"
               >
                  INDEX (00)
               </button>
             </div>
             <div className="hidden md:block font-mono text-micro text-right text-black">
               {SITE_VERSION.toUpperCase()} <br/> NO API
             </div>
         </div>
      </div>

      <main className="w-full">
        <section className="pt-28 md:pt-36 pb-6 md:pb-10 bg-strata-cream text-strata-black border-b border-black/10">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="mb-5 md:mb-6 max-w-3xl">
              <p className="font-sans text-base md:text-lg leading-relaxed">
                <span className="font-bold">This is not a portfolio.</span> The built work lives at three dedicated sites —{' '}
                <a href="https://artdirector.rocks" target="_blank" rel="noreferrer" className="font-mono text-sm border-b border-black hover:bg-black hover:text-white transition-colors">artdirector.rocks</a>,{' '}
                <a href="https://brandproduct.dev" target="_blank" rel="noreferrer" className="font-mono text-sm border-b border-black hover:bg-black hover:text-white transition-colors">brandproduct.dev</a>, and{' '}
                <a href="https://defense.observer" target="_blank" rel="noreferrer" className="font-mono text-sm border-b border-black hover:bg-black hover:text-white transition-colors">defense.observer</a>.
                {' '}This is the practice behind them: how I think, how I build, and what I want to be hired to do.
              </p>
            </div>

            {/* Faceted entry — audience filter */}
            <div className="mb-5 md:mb-6 flex items-center gap-3 flex-wrap" role="group" aria-label="Reader audience filter">
              <span className="font-mono text-xs uppercase tracking-widest opacity-50 whitespace-nowrap">Reading as</span>
              <div className="flex gap-2 flex-wrap">
                {AUDIENCES.map((a) => {
                  const isActive = selectedAudience === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => handleAudience(a.id)}
                      aria-pressed={isActive}
                      className={`font-mono text-xs uppercase tracking-widest border border-black px-3 py-1 transition-colors ${
                        isActive
                          ? 'bg-black text-white'
                          : 'bg-transparent text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
              {selectedAudience && (
                <button
                  type="button"
                  onClick={clearAudience}
                  className="font-mono text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity ml-auto"
                  aria-label="Show all modules"
                >
                  Show all ✕
                </button>
              )}
            </div>

            <div className="border border-black/15 bg-white/70 backdrop-blur-sm p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                <div className="md:w-56 shrink-0">
                  <div className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Target Roles</div>
                  <p className="font-sans text-sm md:text-base leading-relaxed">
                    I'm built for roles that span interface, narrative, prototyping, and technical communication — not the ones that pick one and drop the rest.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {TARGET_ROLES.map((role) => (
                    <span
                      key={role}
                      className="font-mono text-xs uppercase tracking-widest border border-black px-3 py-2 bg-strata-cream"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Render visible modules (filtered by selected audience if any). */}
        {visibleModules.map((module) => (
          <ModuleStrata
            key={module.id}
            module={module}
            isOpen={openModuleIndex === module.index}
            onToggle={() => handleToggle(module.index)}
            onInquiryRequest={handleInquiryRequest}
          />
        ))}


        {/* Footer Restored per PRD v1.0.2.
            Direct-contact block added 2026-06-10: the dossier's job is to convert
            a warm visitor into a reply, so the bottom of the page now carries a
            real, always-live destination (plain email + LinkedIn) — not only the
            composer. See contact.ts for the single source of truth. */}
        <footer className="w-full py-12 md:py-24 bg-white text-black border-t border-black/10 mt-12">
           <div className="container mx-auto px-4 md:px-8 max-w-6xl flex flex-col md:flex-row justify-between items-start gap-10">
              <div>
                <h3 className="font-sans font-bold tracking-tightest text-xl mb-2">CT DOSSIER</h3>
                <p className="font-mono text-xs opacity-50">{SITE_VERSION} + NO API</p>
              </div>

              {/* Direct contact — always visible, no composer required. */}
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-widest opacity-50">Direct</span>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-mono text-sm border-b border-black w-fit hover:bg-black hover:text-white transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
                {hasLinkedIn && (
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm border-b border-black w-fit hover:bg-black hover:text-white transition-colors"
                  >
                    LinkedIn -&gt;
                  </a>
                )}
              </div>

              <div className="flex gap-8 font-mono text-xs uppercase tracking-widest">
                 <button onClick={() => setIsIndexOpen(true)} className="hover:underline">Index</button>
                 <button onClick={() => handleInquiryRequest("Footer Contact")} className="hover:underline">Compose Inquiry</button>
              </div>
           </div>
        </footer>
      </main>

      {/* Manifest Overlay */}
      <ManifestOverlay 
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        onNavigate={handleIndexNavigate}
      />

      {/* Slide-over Panel */}
      <InquiryPanel 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)}
        context={inquiryContext}
        contactEmail={CONTACT_EMAIL}
      />
    </div>
  );
};

export default App;
