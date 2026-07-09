import React from 'react';
import { RouteValue } from '../constants';

/**
 * CreaseMap — the dossier's TOP FRAME. V4.0.0 swap: the reading-route selector
 * was retired with the old spine; the frame now carries only the human thesis
 * ("THE BRAIN IS THE PRODUCT") above the five folds. Props are retained (App
 * still passes route state) but inert.
 */

const COPY = {
  eyebrow: 'The bet',
  role: 'AI-Native Design Engineer & Art Director',
  claim: 'THE BRAIN IS THE PRODUCT',
  offer: 'I design visual language for consequential systems — frontier AI products, defense-tech interfaces, and brands whose meaning has to hold under pressure.',
  offer2: 'The work begins where the thing is real, but the language around it has not caught up.',
};

/* Scoped fold motion — a lighter version of the dossier's pleat. Only the detail
   panel folds (unfolds into the stamp, with a rotateX crease); the rows are
   always present as seams. Panel close falls back to the base 0fr (the reliable
   direction — transitioning TO an explicit 0fr override wedges in Chromium, so we
   never do that here). All off under reduced motion. */
const CREASE_CSS = `
#crease-map-root .crease-rise{animation:crease-rise .45s ease both;}
@keyframes crease-rise{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
@media (prefers-reduced-motion:reduce){#crease-map-root .crease-rise{animation:none;}}
`;

const META = 'font-mono text-micro uppercase tracking-ultra text-strata-black opacity-subtle';

interface CreaseMapProps {
  selectedRoute: RouteValue | null;
  onSelectRoute: (value: RouteValue | null) => void;
}

export const CreaseMap: React.FC<CreaseMapProps> = ({ selectedRoute, onSelectRoute }) => {
  void selectedRoute; void onSelectRoute; // retained but inert (route selector retired in the swap)

  return (
    <section
      id="crease-map-root"
      aria-label="Reading routes"
      data-testid="crease-map"
      className="container mx-auto px-4 md:px-8 max-w-6xl mb-6 md:mb-10"
    >
      <style>{CREASE_CSS}</style>

      {/* Bet — compact top fold (module 00 carries the dossier thesis below) */}
      <div className="crease-rise max-w-3xl">
        <span className={META}>{COPY.eyebrow}</span>
        <p className="font-sans font-semibold text-body md:text-lead text-strata-black opacity-secondary mt-1.5">
          {COPY.role}
        </p>
        <h1 className="font-sans font-black tracking-tight leading-none text-heading md:text-display text-strata-black mt-1">
          {COPY.claim}
        </h1>
        <p className="font-sans text-body md:text-lead text-strata-black opacity-secondary mt-2 max-w-2xl">
          {COPY.offer}
        </p>
        <p className="font-sans text-body md:text-lead text-strata-black opacity-secondary mt-3 max-w-2xl">
          {COPY.offer2}
        </p>
      </div>
    </section>
  );
};
