import React, { useState, useEffect, useMemo } from 'react';
import { CONTENT_MODULES, AudienceId, AUDIENCES } from './constants';
import { ModuleStrata } from './components/ModuleStrata';
import { InquiryPanel } from './components/InquiryPanel';
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

  // Dynamic responseDisplay for module 00 — carries audience-lens state that
  // can't live in the static CONTENT_MODULES constant.
  const frontMatterDisplay = useMemo(() => (
    <FrontMatterContent
      selectedAudience={selectedAudience}
      onAudience={handleAudience}
      onClear={clearAudience}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [selectedAudience]);

  // Modules currently visible. Module 00 (dossier cover) always appears first;
  // audience lens only filters modules 01–08.
  const front00 = RENDERED_MODULES.find(m => m.index === '00');
  const visibleModules = useMemo(() => {
    if (!selectedAudience) return RENDERED_MODULES;
    const audience = AUDIENCES.find(a => a.id === selectedAudience);
    if (!audience) return RENDERED_MODULES;
    const filtered = audience.modules
      .map(idx => RENDERED_MODULES.find(m => m.index === idx))
      .filter((m): m is (typeof RENDERED_MODULES)[number] => m !== undefined);
    return front00 ? [front00, ...filtered] : filtered;
  }, [selectedAudience]);

  // Reversibility invariant: if lens changes and the open module is now hidden,
  // fold everything back to the closed overview (null). The user picks what to
  // open next — no auto-open.
  useEffect(() => {
    if (openModuleIndex && !visibleModules.some(m => m.index === openModuleIndex)) {
      setOpenModuleIndex(null);
      try {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
      } catch (e) {}
    }
  }, [visibleModules, openModuleIndex]);

  // Deep-link init — open the target module if a #module-XX hash is present.
  // On root load with no hash: dossier starts fully folded (null). The first
  // user action is opening the file.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#module-')) {
      const index = hash.replace('#module-', '');
      setOpenModuleIndex(index);
    }
    // else: no auto-open; stay null.

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

  // Flat state reachable from anywhere: Escape walks one step back toward the
  // neutral overview. Priority: inquiry → index → folded module. Repeated
  // Escape from any state provably lands on the flat sheet. The inquiry panel
  // owns its own Escape close, so we defer to it and never double-handle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isInquiryOpen) return; // InquiryPanel handles its own Escape
      if (isIndexOpen) { setIsIndexOpen(false); return; }
      if (openModuleIndex) {
        setOpenModuleIndex(null);
        try {
          history.pushState("", document.title, window.location.pathname + window.location.search);
        } catch (e) {}
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isInquiryOpen, isIndexOpen, openModuleIndex]);

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
               <button
                  onClick={() => handleInquiryRequest("General Inquiry")}
                  className="hidden md:block font-mono text-xs uppercase tracking-widest border border-black/40 px-3 py-1 hover:bg-black hover:text-white hover:border-black transition-colors text-black"
               >
                  REQUEST CONVERSATION -&gt;
               </button>
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
              isOpen={openModuleIndex === m.index}
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
                    <button onClick={() => handleInquiryRequest("Footer Contact")} aria-label="Compose inquiry" className="hover:underline">Compose Inquiry</button>
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
