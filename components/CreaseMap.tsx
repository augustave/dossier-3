import React, { useState } from 'react';
import { ROUTES, RouteValue } from '../constants';

/**
 * CreaseMap — V3.6.8. The dossier's TOP FOLD and route selector. Replaces the
 * old reading-lens strip (no hero button, no default lens, no Change Lens / Study
 * All / Start Path). Two reversible sub-states:
 *   • OVERVIEW   — compact bet + "Read as —" + five folding route bands.
 *   • SELECTED   — the chosen route unfolds into a route stamp; the others fold
 *                  away. Clicking the stamp folds back to the overview.
 * The row IS the interaction. Selecting a route only stamps it + drives the Index
 * RECOMMENDED markers — it NEVER filters; all 9 modules stay rendered below.
 * Matte doctrine: mono = metadata, Inter = the bet, strata-clay only on For/Not.
 */

const COPY = {
  eyebrow: 'The bet',
  spear:
    'AI-Native Design Engineer & Art Director — I turn complex systems into visual languages.',
  support:
    'I am not trying to make complex things simple. I am trying to make them legible without making them smaller.',
  forText: "teams whose thing is real, but the language around it hasn't caught up.",
  notForText: 'trend-cycle branding, decoration, spectacle.',
};

/* Scoped fold motion — a lighter version of the dossier's pleat. The band lifts
   like a crease on hover; the stamp/bands rise on enter. All off under reduced
   motion. */
const CREASE_CSS = `
#crease-map-root .crease-rise{animation:crease-rise .45s ease both;}
@keyframes crease-rise{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
@media (prefers-reduced-motion:reduce){
  #crease-map-root .crease-rise{animation:none;}
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
  // When a route is active, the overview collapses to its stamp; expanding folds
  // the five bands back open so the reader can switch (no trap — PRD §3.3).
  const [expanded, setExpanded] = useState(false);
  const active = ROUTES.find((r) => r.value === selectedRoute) ?? null;
  const showOverview = !active || expanded;

  const pick = (value: RouteValue) => {
    onSelectRoute(value);
    setExpanded(false);
  };

  return (
    <section
      id="crease-map-root"
      aria-label="Reading routes"
      data-testid="crease-map"
      className="container mx-auto px-4 md:px-8 max-w-6xl mb-6 md:mb-10"
    >
      <style>{CREASE_CSS}</style>

      {/* Bet — compact top fold (not a full hero; module 00 carries the dossier thesis) */}
      <div className="crease-rise max-w-3xl">
        <span className={META}>{COPY.eyebrow}</span>
        <h1 className="font-sans font-bold tracking-tight leading-tight text-subhead md:text-heading text-strata-black mt-1.5">
          {COPY.spear}
        </h1>
        <p className="font-sans text-caption md:text-body leading-relaxed text-strata-black opacity-tertiary max-w-[48ch] mt-3">
          {COPY.support}
        </p>
        <p className="font-sans text-caption text-strata-black opacity-tertiary max-w-[54ch] mt-2">
          <span className="font-mono text-micro uppercase tracking-ultra text-strata-clay mr-1.5 whitespace-nowrap">For</span>
          {COPY.forText}{' '}
          <span className="font-mono text-micro uppercase tracking-ultra text-strata-clay mr-1.5 whitespace-nowrap">Not for</span>
          {COPY.notForText}
        </p>
      </div>

      {/* Route system */}
      <div className="mt-7 border-t border-strata-black/10 pt-3" aria-live="polite">
        {showOverview ? (
          <>
            <div className={`${KEY} mb-1`}>Read as —</div>
            <div role="list">
              {ROUTES.map((r) => {
                const isActive = r.value === selectedRoute;
                return (
                  <button
                    key={r.value}
                    type="button"
                    role="listitem"
                    data-testid={`route-band-${r.value}`}
                    aria-pressed={isActive}
                    aria-label={`Read as ${r.label} — ${r.path}, ${r.time}`}
                    onClick={() => pick(r.value)}
                    className="crease-band group w-full flex items-baseline justify-between gap-4 text-left py-3 pl-3 -ml-3 border-l-2 border-transparent border-b border-strata-black/10 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-px hover:bg-strata-black/5 hover:border-l-strata-black/40 focus:outline-none focus-visible:bg-strata-black/5 focus-visible:border-l-strata-black/40"
                  >
                    <span className="flex items-baseline gap-3 md:gap-4 flex-wrap min-w-0">
                      <span className="font-mono text-micro uppercase tracking-wider text-strata-black opacity-muted">{r.prefix}</span>
                      <span className="font-sans font-semibold text-caption tracking-tight text-strata-black opacity-secondary group-hover:opacity-primary">{r.label}</span>
                    </span>
                    <span className="font-mono text-micro text-strata-black opacity-muted shrink-0">{r.path} · {r.time.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // Selected route stamp — the band unfolded. Click to fold back.
          <button
            type="button"
            data-testid="route-stamp"
            aria-label={`${active.label} route selected — fold back to all routes`}
            onClick={() => setExpanded(true)}
            className="crease-rise group w-full text-left pl-3 -ml-3 border-l-2 border-strata-black/30 py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-strata-black"
          >
            <div className={KEY}>Reading path · {active.label}</div>
            <div className="font-mono text-caption tracking-[0.22em] text-strata-black mt-1" data-testid="route-stamp-path">{active.path}</div>
            <div className="font-sans text-caption text-strata-black opacity-tertiary mt-1.5 max-w-[54ch]">{active.helper}</div>
            <div className={`${KEY} mt-1.5`}>Best if · {active.bestIf}</div>
            <div className={KEY}>Time · {active.time}</div>
            <div className="font-mono text-micro uppercase tracking-wider text-strata-black opacity-faint group-hover:opacity-muted transition-opacity mt-2">Fold back to all routes ↺</div>
          </button>
        )}
      </div>
    </section>
  );
};
