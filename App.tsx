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

// Modules rendered on the main page (Manifest is handled via the overlay),
// sorted once at module-load time since CONTENT_MODULES is static.
const RENDERED_MODULES = CONTENT_MODULES
  .filter(m => m.id !== ModuleType.MANIFEST)
  .sort((a, b) => a.index.localeCompare(b.index));

// Index label count — derived from the rendered module count so the chrome
// can never go stale against the module list (was hardcoded "00").
const INDEX_COUNT = String(RENDERED_MODULES.length).padStart(2, '0');

/**
 * Faceted entry — audience reads. Each maps to a curated subset of the V3
 * taste-led spine, ordered by "start with" priority for that audience.
 * Every read still opens on TASTE or SEEING so the eye/point-of-view lands
 * before execution — the core of the CT-PRD-MARY-01 repositioning.
 *   hiring → 01 Taste / 04 Neighborhood     / 07 Portfolios
 *   client → 01 Taste / 03 Visual Languages / 08 Engagement
 *   collab → 02 Seeing / 03 Visual Languages / 05 Doctrine
 *   acad   → 02 Seeing / 06 Doctrine Library / 04 Neighborhood
 * NOTE: mapping is a sensible default pending an owner war-game; adjust here.
 */
type AudienceId = 'hiring' | 'client' | 'collab' | 'acad';

interface Audience {
  id: AudienceId;
  label: string;
  modules: string[];
}

const AUDIENCES: Audience[] = [
  { id: 'hiring', label: 'HIRING MANAGER', modules: ['01', '04', '07'] },
  { id: 'client', label: 'CLIENT',         modules: ['01', '03', '08'] },
  { id: 'collab', label: 'COLLABORATOR',   modules: ['02', '03', '05'] },
  { id: 'acad',   label: 'ACADEMIC',       modules: ['02', '06', '04'] }
];
const AUDIENCE_IDS = AUDIENCES.map(a => a.id);
const isAudienceId = (s: string | null): s is AudienceId =>
  s !== null && (AUDIENCE_IDS as string[]).includes(s);

// Built-work links shown in the hero front matter as document metadata (the
// per-register descriptions live in the Portfolios module, not here).
const WORK_LINKS = [
  { label: 'ART DIRECTION',   url: 'artdirector.rocks', href: 'https://artdirector.rocks/' },
  { label: 'BRAND × PRODUCT', url: 'brandproduct.dev',  href: 'https://brandproduct.dev/' },
  { label: 'DEFENSE',         url: 'defense.observer',  href: 'https://defense.observer/' },
];

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
      
      {/* Document chrome — aligned to the shared max-w-6xl grid so the logo and
          utility controls share the hero's horizontal rhythm (reads as document
          metadata, not a floating nav). Static; no scroll-spy label. */}
      <div className="fixed top-0 left-0 w-full z-40 pointer-events-none">
        <div className="container mx-auto max-w-6xl px-4 py-4 md:px-8 flex justify-between items-start">
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

      <main className="w-full">
        <section className="pt-28 md:pt-36 pb-16 md:pb-24 bg-strata-cream text-strata-black border-b border-black/10">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            {/* Front matter — composed like a monograph title page, not a hero.
                Cover label → thesis → role line → intro → built-work row →
                reading lens, on the shared grid with deliberate vertical rhythm. */}
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/45 mb-7 md:mb-9">
              PRACTICE FRONT MATTER
            </p>

            <h1 className="font-serif text-3xl md:text-[2.85rem] lg:text-5xl leading-[1.12] max-w-3xl">
              Taste is not preference.<br/>Taste is a sourcing discipline.
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/50 mt-6">
              Ebenz Augustave · Art Director · Design Engineer
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/40 mt-2">
              Visual language for complex systems.
            </p>

            <div className="mt-12 max-w-[800px] space-y-1.5">
              <p className="font-sans text-base md:text-lg leading-relaxed">
                <span className="font-bold">This is not a portfolio.</span> The built work lives elsewhere.
              </p>
              <p className="font-sans text-base md:text-lg leading-relaxed pt-2.5">
                This dossier documents the practice behind it: where references come from, how visual languages take shape, and why certain forms keep surviving after fashion moves on.
              </p>
            </div>

            {/* Recruitment thesis — a field note, not a banner. Names who the
                practice is for, before the built-work row. */}
            <div className="mt-10 max-w-[800px] border-l-2 border-black/30 pl-5">
              <p className="font-sans text-base md:text-lg leading-relaxed">
                <span className="font-bold">Useful when the capability is real, but the language has not caught up.</span>
              </p>
              <p className="font-sans text-base md:text-lg leading-relaxed mt-2.5">
                I help complex products, technical teams, and emerging categories become legible through visual language, doctrine, and inspectable form.
              </p>
              <p className="font-mono text-micro uppercase tracking-[0.2em] text-black/45 mt-4">
                For teams building complex systems that need direction, language, and form.
              </p>
            </div>

            {/* Built-work links — document metadata, not inline prose or cards. */}
            <div className="mt-10">
              <div className="font-mono text-micro uppercase tracking-[0.25em] text-black/40 mb-4">
                Built work lives at
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 max-w-3xl">
                {WORK_LINKS.map((w) => (
                  <a
                    key={w.href}
                    href={w.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${w.label.toLowerCase()} portfolio at ${w.url}`}
                    className="group/work block border-b border-black/20 hover:border-black pb-1.5 transition-colors"
                  >
                    <div className="font-mono text-xs uppercase tracking-widest text-black/55">{w.label}</div>
                    <div className="font-mono text-sm md:text-base text-black group-hover/work:underline mt-0.5">{w.url}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Reading lens — interpretive modes, not a form button group. */}
            <div className="mt-10" role="group" aria-label="Reading lens">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <span className="font-mono text-micro uppercase tracking-[0.25em] text-black/40">Reading Lens</span>
                {selectedAudience && (
                  <button
                    type="button"
                    onClick={clearAudience}
                    className="font-mono text-micro uppercase tracking-widest text-black/45 hover:text-black underline-offset-4 hover:underline transition-colors"
                    aria-label="Show all modules"
                  >
                    Study all
                  </button>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {AUDIENCES.map((a) => {
                  const isActive = selectedAudience === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => handleAudience(a.id)}
                      aria-pressed={isActive}
                      className={`font-mono text-xs uppercase tracking-widest border px-4 py-2 transition-colors ${
                        isActive
                          ? 'bg-black text-white border-black'
                          : 'bg-transparent text-black/70 border-black/30 hover:border-black hover:text-black'
                      }`}
                    >
                      {a.label}
                    </button>
                  );
                })}
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
          />
        ))}


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
