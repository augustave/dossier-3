import React from 'react';
import { AudienceId, AUDIENCES } from '../constants';

const WORK_LINKS = [
  { label: 'ART DIRECTION',   url: 'artdirector.rocks', href: 'https://artdirector.rocks/' },
  { label: 'BRAND × PRODUCT', url: 'brandproduct.dev',  href: 'https://brandproduct.dev/' },
  { label: 'DEFENSE',         url: 'defense.observer',  href: 'https://defense.observer/' },
];

interface FrontMatterContentProps {
  selectedAudience: AudienceId | null;
  /** Whether the four lens choices are revealed (CHANGE LENS state). */
  pickerOpen: boolean;
  onSelect: (id: AudienceId) => void;
  onChangeLens: () => void;
  onClear: () => void;
}

/**
 * Module 00 — FRONT MATTER content. Self-pleating (5 rows): headline+identity,
 * body, pullout, work links, reading lens. Rendered bare by ModuleStrata
 * (selfPleating path) so its own .pleatfold drives the fold. The module's
 * .fold[data-open='true'] ancestor triggers the pleat CSS — no open prop needed.
 */
export const FrontMatterContent: React.FC<FrontMatterContentProps> = ({
  selectedAudience,
  pickerOpen,
  onSelect,
  onChangeLens,
  onClear,
}) => {
  const selectedLens = selectedAudience
    ? AUDIENCES.find((a) => a.id === selectedAudience) ?? null
    : null;
  return (
    <div className="pleatfold pleatfold--prose space-y-8">

      {/* Row 0 — Headline + identity */}
      <div className="pleat" style={{ transitionDelay: 'calc(var(--pleat-stagger) * 0)' }}>
        <h1 className="font-serif text-3xl md:text-[2.85rem] lg:text-5xl leading-[1.12] max-w-3xl">
          Taste is not preference.<br />Taste is a sourcing discipline.
        </h1>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/50 mt-6">
          Ebenz Augustave · Art Director · Design Engineer
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/40 mt-2">
          Visual language for complex systems.
        </p>
      </div>

      {/* Row 1 — Body */}
      <div className="pleat" style={{ transitionDelay: 'calc(var(--pleat-stagger) * 1)' }}>
        <div className="max-w-[800px] space-y-1.5">
          <p className="font-sans text-base md:text-lg leading-relaxed">
            <span className="font-bold">This is not a portfolio.</span> The built work lives elsewhere.
          </p>
          <p className="font-sans text-base md:text-lg leading-relaxed pt-2.5">
            This documents the practice behind it: where my references come from, how the visual languages form, and why some outlast fashion.
          </p>
        </div>
      </div>

      {/* Row 2 — Pullout */}
      <div className="pleat" style={{ transitionDelay: 'calc(var(--pleat-stagger) * 2)' }}>
        <div className="max-w-[800px] border-l-2 border-black/30 pl-5">
          <p className="font-sans text-base md:text-lg leading-relaxed">
            <span className="font-bold">Useful when the capability is real, but the language has not caught up.</span>
          </p>
          <p className="font-sans text-base md:text-lg leading-relaxed mt-2.5">
            I make complex products and emerging categories legible — through visual language, doctrine, and inspectable form.
          </p>
          <p className="font-mono text-micro uppercase tracking-[0.2em] text-black/45 mt-4">
            For teams building complex systems that need direction, language, and form.
          </p>
        </div>
      </div>

      {/* Row 3 — Built work links */}
      <div className="pleat" style={{ transitionDelay: 'calc(var(--pleat-stagger) * 3)' }}>
        <div>
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
      </div>

      {/* Row 4 — Reading Lens. V3.6.6: selected route metadata, not a tab strip.
          A chosen lens collapses to the route stamp; the four choices return on
          CHANGE LENS. Never opens a module; the Index handles navigation. */}
      <div className="pleat" style={{ transitionDelay: 'calc(var(--pleat-stagger) * 4)' }}>
        <div role="group" aria-label="Reading Lens">
          <span className="font-mono text-micro uppercase tracking-[0.25em] text-black/40 block mb-3">Reading Lens</span>

          {selectedLens && !pickerOpen ? (
            <div aria-live="polite">
              <p className="font-mono text-micro uppercase tracking-[0.22em] text-black/70 mb-1.5">
                Reading path · {selectedLens.label}
              </p>
              <p className="font-mono text-sm tracking-[0.3em] text-strata-blue mb-1.5">
                {selectedLens.modules.join(' → ')}
              </p>
              <p className="font-mono text-micro uppercase tracking-[0.18em] text-black/55 leading-relaxed">
                {selectedLens.helper}
              </p>
              <div className="flex gap-4 mt-3">
                <button
                  type="button"
                  onClick={onChangeLens}
                  aria-label="Change reading lens"
                  className="font-mono text-micro uppercase tracking-widest text-black/70 hover:text-black underline-offset-4 hover:underline transition-colors"
                >
                  Change lens
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Show all modules"
                  className="font-mono text-micro uppercase tracking-widest text-black/40 hover:text-black underline-offset-4 hover:underline transition-colors"
                >
                  Study all
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap" aria-live="polite">
              {AUDIENCES.map((a) => {
                const isActive = selectedAudience === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onSelect(a.id)}
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
              {selectedAudience && (
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Show all modules"
                  className="font-mono text-xs uppercase tracking-widest border border-black/20 px-4 py-2 text-black/45 hover:text-black hover:border-black transition-colors"
                >
                  Study all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
