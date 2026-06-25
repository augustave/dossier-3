import React from 'react';
import { ROUTES, RouteValue } from '../constants';

/**
 * CreaseMap — the dossier's TOP FOLD and reading-route selector.
 *
 * Model:
 *   • ENTRY (neutral) — every route band is shown at once as a compact seam: no
 *     stamp, no helper / Best-if, no Change Lens / Study All / Start Path. Full
 *     Dossier is the neutral flat sheet (no ?read).
 *   • SELECT — the chosen route unfolds into its stamp (path · helper · Best if);
 *     the OTHER routes stay visible as compact seams so the reader can switch
 *     directly. Only one stamp is open at a time; rows never collapse away.
 *   • NEUTRAL — clicking Full Dossier, or the already-active route, returns to
 *     the neutral flat sheet and clears ?read (URL → /).
 *
 * The route is an ORIENTATION AID — it stamps a path + drives the Index
 * RECOMMENDED markers, and NEVER filters; all 9 modules stay rendered below.
 */

const COPY = {
  eyebrow: 'The bet',
  role: 'AI-Native Design Engineer & Art Director',
  claim: 'THE BRAIN IS THE PRODUCT',
  offer: 'I turn complex systems into visual languages.',
};

/* Scoped fold motion — a lighter version of the dossier's pleat. Only the detail
   panel folds (unfolds into the stamp, with a rotateX crease); the rows are
   always present as seams. Panel close falls back to the base 0fr (the reliable
   direction — transitioning TO an explicit 0fr override wedges in Chromium, so we
   never do that here). All off under reduced motion. */
const CREASE_CSS = `
#crease-map-root .crease-rise{animation:crease-rise .45s ease both;}
@keyframes crease-rise{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}

#crease-map-root .band-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .34s ease;}
#crease-map-root .band-panel[data-open="true"]{grid-template-rows:1fr;}
#crease-map-root .band-panel > .band-panel-inner{overflow:hidden;min-height:0;transform-origin:top center;transform:rotateX(-7deg);opacity:0;transition:transform .34s ease,opacity .28s ease;}
#crease-map-root .band-panel[data-open="true"] > .band-panel-inner{transform:none;opacity:1;}

@media (prefers-reduced-motion:reduce){
  #crease-map-root .crease-rise{animation:none;}
  #crease-map-root .band-panel{transition:none;}
  #crease-map-root .band-panel > .band-panel-inner{transition:none;transform:none;}
  #crease-map-root .crease-band{transition:none !important;}
  #crease-map-root .crease-band:hover{transform:none !important;}
}
`;

const META = 'font-mono text-micro uppercase tracking-ultra text-strata-black opacity-subtle';
const KEY = 'font-mono text-micro uppercase tracking-wider text-strata-black opacity-muted';

interface CreaseMapProps {
  selectedRoute: RouteValue | null;
  onSelectRoute: (value: RouteValue | null) => void;
}

export const CreaseMap: React.FC<CreaseMapProps> = ({ selectedRoute, onSelectRoute }) => {
  const onBandClick = (value: RouteValue) => {
    // Full Dossier is the neutral flat sheet (no ?read). Clicking it — or the
    // already-active route — returns to neutral and clears ?read.
    if (value === 'full' || value === selectedRoute) onSelectRoute(null);
    else onSelectRoute(value);
  };

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
        <p className="font-sans text-body md:text-lead text-strata-black opacity-secondary mt-2">
          {COPY.offer}
        </p>
      </div>

      {/* Route system — every band is a seam; the selected one unfolds its stamp. */}
      <div className="mt-7 border-t border-strata-black/10 pt-3" aria-live="polite">
        <div className={`${KEY} mb-1`}>Read as —</div>
        <div role="list">
          {ROUTES.map((r) => {
            const isFull = r.value === 'full';
            const isActive = r.value === selectedRoute; // full is never selectedRoute
            const panelOpen = isActive;
            const panelId = `route-panel-${r.value}`;
            return (
              <div key={r.value} className="band-row" data-testid={`band-row-${r.value}`}>
                <button
                  type="button"
                  role="listitem"
                  data-testid={`route-band-${r.value}`}
                  aria-pressed={isActive}
                  aria-expanded={panelOpen}
                  aria-controls={panelId}
                  aria-label={isFull
                    ? 'Full Dossier — every module, no recommended route'
                    : `Read as ${r.label} — ${r.path}, ${r.time}`}
                  onClick={() => onBandClick(r.value)}
                  className="crease-band group w-full grid grid-cols-[1fr_auto] items-baseline gap-4 text-left py-3 pl-3 -ml-3 border-l-2 border-transparent border-b border-strata-black/10 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-px hover:bg-strata-black/5 hover:border-l-strata-black/40 focus:outline-none focus-visible:bg-strata-black/5 focus-visible:border-l-strata-black/40"
                >
                  {/* Left column — fold type + audience */}
                  <span className="flex items-baseline gap-3 md:gap-4 min-w-0">
                    <span className="font-mono text-micro uppercase tracking-wider text-strata-black opacity-muted shrink-0">{r.prefix}</span>
                    <span className="font-sans font-semibold text-caption tracking-tight text-strata-black opacity-secondary group-hover:opacity-primary truncate">{r.label}</span>
                  </span>
                  {/* Right column — module path + time */}
                  <span className="font-mono text-micro text-strata-black opacity-muted shrink-0 text-right">
                    <span data-testid={panelOpen ? 'route-stamp-path' : undefined}>{r.path}</span>
                    {r.tag ? ` · ${r.tag}` : ''} · {r.time.toUpperCase()}
                  </span>
                </button>

                {/* Detail panel — the selected band unfolded into its stamp. The
                    detail renders ONLY when active (not just CSS-collapsed), so a
                    non-selected seam can never leak a stamp even if the scoped
                    fold CSS fails to apply. */}
                <div className="band-panel" id={panelId} data-testid={panelId} data-open={panelOpen} role="region" aria-label={`${r.label} reading`}>
                  <div className="band-panel-inner" data-testid={panelOpen ? 'route-stamp' : undefined}>
                    {panelOpen && (
                      <>
                        <p className="font-sans text-caption text-strata-black opacity-tertiary max-w-[54ch] pt-2">{r.helper}</p>
                        <p className={`${KEY} mt-2 pb-2`}>Best if · {r.bestIf}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
