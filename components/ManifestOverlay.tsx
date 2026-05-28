import React, { useEffect, useState } from 'react';
import { CONTENT_MODULES } from '../constants';
import { ModuleType } from '../types';
import { ArrowRightIcon, XIcon } from './icons';

interface ManifestOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: string) => void;
}

export const ManifestOverlay: React.FC<ManifestOverlayProps> = ({ isOpen, onClose, onNavigate }) => {
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
      className={`fixed inset-0 z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-strata-cream/95 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Content Container */}
      <div className={`relative w-full max-w-6xl mx-auto px-4 md:px-8 h-full flex flex-col justify-center transition-transform duration-500 delay-100 ${isOpen ? 'translate-y-0' : 'translate-y-8'}`}>
        
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
        </div>

        {/* Module List - Current custom order: 02, 01, 03, 04, 05, 06 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {CONTENT_MODULES
            .filter(m => m.id !== ModuleType.MANIFEST)
            .sort((a, b) => {
                const order = ["02", "01", "03", "04", "05", "06"];
                return order.indexOf(a.index) - order.indexOf(b.index);
            })
            .map((m) => (
             <div
               key={m.index}
               data-testid="manifest-item"
               data-index={m.index}
               onClick={() => onNavigate(m.index)}
               className="group/item flex items-baseline gap-4 cursor-pointer border-b border-black/10 pb-4 hover:pl-4 transition-all duration-300"
             >
               <span className="font-mono text-3xl md:text-4xl font-bold opacity-subtle group-hover/item:opacity-primary group-hover/item:text-strata-blue transition-all">
                 {m.index}
               </span>
               <span className="font-sans text-xl md:text-2xl font-bold uppercase tracking-tight">
                 {m.title}
               </span>
               <ArrowRightIcon className="ml-auto w-5 h-5 opacity-0 group-hover/item:opacity-primary transition-opacity" />
             </div>
          ))}
        </div>

        <div className="mt-12 font-mono text-xs opacity-subtle max-w-md">
            CT DOSSIER v1.2.0<br/>
            NO API. STATIC GENERATION.<br/>
            ROLE MATRIX: LAZY MOUNTED.
        </div>

      </div>
    </div>
  );
};
