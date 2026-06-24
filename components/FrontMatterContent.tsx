import React from 'react';

const WORK_LINKS = [
  { label: 'ART DIRECTION',   url: 'artdirector.rocks', href: 'https://artdirector.rocks/' },
  { label: 'BRAND × PRODUCT', url: 'brandproduct.dev',  href: 'https://brandproduct.dev/' },
  { label: 'DEFENSE',         url: 'defense.observer',  href: 'https://defense.observer/' },
];

/**
 * Module 00 — FRONT MATTER content. Self-pleating (2 rows): headline, work links.
 * Rendered bare by ModuleStrata (selfPleating path) so its own .pleatfold drives
 * the fold. V3.7.6: identity sublines + body + pullout removed (owner) — the cover
 * is now the taste thesis + where the built work lives.
 */
export const FrontMatterContent: React.FC = () => {
  return (
    <div className="pleatfold pleatfold--prose space-y-8">

      {/* Row 0 — Headline + identity */}
      <div className="pleat" style={{ transitionDelay: 'calc(var(--pleat-stagger) * 0)' }}>
        <h1 className="font-serif text-3xl md:text-[2.85rem] lg:text-5xl leading-[1.12] max-w-3xl">
          Taste is not preference.<br />Taste is a sourcing discipline.
        </h1>
      </div>

      {/* Row 1 — Built work links */}
      <div className="pleat" style={{ transitionDelay: 'calc(var(--pleat-stagger) * 1)' }}>
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

    </div>
  );
};
