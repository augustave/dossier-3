import React, { useState, useEffect } from 'react';
import { CONTENT_MODULES } from './constants';
import { ModuleStrata } from './components/ModuleStrata';
import { InquiryPanel } from './components/InquiryPanel';
import { ManifestOverlay } from './components/ManifestOverlay';
import { ModuleType } from './types';

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL?.trim() ?? '';
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

const App: React.FC = () => {
  const [openModuleIndex, setOpenModuleIndex] = useState<string | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [inquiryContext, setInquiryContext] = useState<string>("");

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
               V1.2.0 <br/> NO API
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
                {' '}This is the practice behind them: how I think, how I work, what I recruit for.
              </p>
            </div>
            <div className="border border-black/15 bg-white/70 backdrop-blur-sm p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                <div className="md:w-56 shrink-0">
                  <div className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Target Roles</div>
                  <p className="font-sans text-sm md:text-base leading-relaxed">
                    Best fit for multidisciplinary roles spanning interface, narrative, prototyping, and technical communication.
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

        {/* Render all modules EXCEPT Manifest (Module 00) */}
        {RENDERED_MODULES.map((module) => (
          <ModuleStrata
            key={module.id}
            module={module}
            isOpen={openModuleIndex === module.index}
            onToggle={() => handleToggle(module.index)}
            onInquiryRequest={handleInquiryRequest}
          />
        ))}


        {/* Footer Restored per PRD v1.0.2 */}
        <footer className="w-full py-12 md:py-24 bg-white text-black border-t border-black/10 mt-12">
           <div className="container mx-auto px-4 md:px-8 max-w-6xl flex flex-col md:flex-row justify-between items-baseline gap-8">
              <div>
                <h3 className="font-sans font-bold tracking-tightest text-xl mb-2">CT DOSSIER</h3>
                <p className="font-mono text-xs opacity-50">v1.2.0 + NO API</p>
              </div>
              <div className="flex gap-8 font-mono text-xs uppercase tracking-widest">
                 <button onClick={() => setIsIndexOpen(true)} className="hover:underline">Index</button>
                 <button onClick={() => handleInquiryRequest("Footer Contact")} className="hover:underline">Request Conversation</button>
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
