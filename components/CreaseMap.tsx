import React, { useState } from 'react';
import { ROUTES, RouteValue } from '../constants';

/**
 * CreaseMap — V3.6.8. The dossier's TOP FOLD and route selector. Replaces the old
 * reading-lens strip (no hero button, no default route, no Change Lens / Study All
 * / Start Path). The route is an ORIENTATION AID — it stamps a path + drives the
 * Index RECOMMENDED markers, and NEVER filters; all 9 modules stay rendered below.
 *
 * Fold-native interaction (the dossier's own pleat language, lighter):
 *   • OVERVIEW — five route bands, each a folded row.
 *   • SELECT   — the chosen band UNFOLDS into its route stamp (grid-rows 0fr→1fr +
 *                a rotateX crease) while the OTHER rows fold away (collapse to 0).
 *   • FOLD BACK — clicking the open band's header re-folds it; the others unfold
 *                back to the overview (reversible, no trap).
 */

const COPY = {
  eyebrow: 'The bet',
  role: 'AI-Native Design Engineer & Art Director',
  claim: 'THE BRAIN IS THE PRODUCT',
};

/* Scoped fold motion — a lighter version of the dossier's pleat. Two folds:
   the whole row (fold away when another route is stamped) and the detail panel
   (unfold into the stamp, with a rotateX crease). All off under reduced motion. */
const CREASE_CSS = `
#crease-map-root .crease-rise{animation:crease-rise .45s ease both;}
@keyframes crease-rise{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}

#crease-map-root .band-row{display:grid;grid-template-rows:1fr;transition:grid-template-rows .34s ease,opacity .3s ease;}
#crease-map-root .band-row[data-open="false"]{grid-template-rows:0fr;opacity:0;pointer-events:none;}
#crease-map-root .band-row > .band-row-inner{overflow:hidden;min-height:0;}

#crease-map-root .band-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .34s ease;}
#crease-map-root .band-panel[data-open="true"]{grid-template-rows:1fr;}
#crease-map-root .band-panel > .band-panel-inner{overflow:hidden;min-height:0;transform-origin:top center;transform:rotateX(-7deg);opacity:0;transition:transform .34s ease,opacity .28s ease;}
#crease-map-root .band-panel[data-open="true"] > .band-panel-inner{transform:none;opacity:1;}

@media (prefers-reduced-motion:reduce){
  #crease-map-root .crease-rise{animation:none;}
  #crease-map-root .band-row,#crease-map-root .band-panel{transition:none;}
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
  // While a route is stamped, `expanded` folds the five bands back open so the
  // reader can switch (no trap — PRD §3.3).
  const [expanded, setExpanded] = useState(false);
  const hasRoute = ROUTES.some((r) => r.value === selectedRoute);
  const showOverview = !hasRoute || expanded;

  const onBandClick = (value: RouteValue) => {
    if (value === selectedRoute && !showOverview) {
      setExpanded(true); // fold the stamp back to the overview
    } else {
      onSelectRoute(value);
      setExpanded(false); // unfold this band into its stamp; fold the others away
    }
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
      </div>

      {/* Route system — folding bands */}
      <div className="mt-7 border-t border-strata-black/10 pt-3" aria-live="polite">
        <div className={`${KEY} mb-1`}>Read as —</div>
        <div role="list">
          {ROUTES.map((r) => {
            const isActive = r.value === selectedRoute;
            const rowOpen = showOverview || isActive;   // non-active rows fold away when stamped
            const panelOpen = isActive && !showOverview; // the selected stamp is unfolded
            const panelId = `route-panel-${r.value}`;
            return (
              <div
                key={r.value}
                className="band-row"
                data-open={rowOpen}
                data-testid={`band-row-${r.value}`}
              >
                <div className="band-row-inner">
                  <button
                    type="button"
                    role="listitem"
                    data-testid={`route-band-${r.value}`}
                    aria-pressed={isActive}
                    aria-expanded={panelOpen}
                    aria-controls={panelId}
                    aria-label={`Read as ${r.label} — ${r.path}, ${r.time}`}
                    onClick={() => onBandClick(r.value)}
                    className="crease-band group w-full flex items-baseline justify-between gap-4 text-left py-3 pl-3 -ml-3 border-l-2 border-transparent border-b border-strata-black/10 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-px hover:bg-strata-black/5 hover:border-l-strata-black/40 focus:outline-none focus-visible:bg-strata-black/5 focus-visible:border-l-strata-black/40"
                  >
                    <span className="flex items-baseline gap-3 md:gap-4 flex-wrap min-w-0">
                      <span className="font-mono text-micro uppercase tracking-wider text-strata-black opacity-muted">{r.prefix}</span>
                      <span className="font-sans font-semibold text-caption tracking-tight text-strata-black opacity-secondary group-hover:opacity-primary">{r.label}</span>
                    </span>
                    <span className="font-mono text-micro text-strata-black opacity-muted shrink-0">
                      <span data-testid={panelOpen ? 'route-stamp-path' : undefined}>{r.path}</span>
                      {r.tag ? ` · ${r.tag}` : ''} · {r.time.toUpperCase()}
                    </span>
                  </button>

                  {/* Detail panel — the band unfolded into a route stamp. */}
                  <div className="band-panel" id={panelId} data-open={panelOpen} role="region" aria-label={`${r.label} reading`}>
                    <div className="band-panel-inner" data-testid={panelOpen ? 'route-stamp' : undefined}>
                      <p className="font-sans text-caption text-strata-black opacity-tertiary max-w-[54ch] pt-2">{r.helper}</p>
                      <p className={`${KEY} mt-2`}>Best if · {r.bestIf}</p>
                      <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        aria-label="Fold back to all routes"
                        className="font-mono text-micro uppercase tracking-wider text-strata-black opacity-faint hover:opacity-muted transition-opacity mt-2 pb-2"
                      >
                        Fold back to all routes ↺
                      </button>
                    </div>
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
