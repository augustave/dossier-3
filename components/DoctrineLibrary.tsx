import React from 'react';

/**
 * Doctrine Library (Module 06, V3.3 — CT-PRD-MARY-01.3).
 *
 * The shelf of written source texts behind the practice: essays, working
 * papers, rulebooks, manifestos. Typographic archive-record cards, not a blog
 * feed. CTAs are suppressed when a card's href is null (the file isn't in
 * /public/library/ yet) so no broken links render. The register filter strip
 * was removed (V3.7.x) — the registers survive only as blue/orange/green color
 * accents + tags on the cards. Data lives in copy.v1_1.ts under
 * modules.doctrineLibrary.
 */

export interface DoctrineDoc {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  registers: string[];
  description: string;
  why: string;
  ctaLabel: string;
  href: string | null;
}

interface DoctrineLibraryProps {
  cards: DoctrineDoc[];
  pendingNote: string;
}

// Register accent colors — mirrored from modules.visualLanguages.registers so the
// library and Visual Languages share one color language (blue / orange / green).
// A card's accent is the first of its registers that has a color (Systems/etc.
// fall through to a sibling).
const REGISTER_COLOR: Record<string, string> = {
  Monastery: '#204C8D',
  Forge: '#FF4F00',
  Oracle: '#42FC04',
};
const accentFor = (registers: string[]): string => {
  const hit = registers.find(r => REGISTER_COLOR[r]);
  return hit ? REGISTER_COLOR[hit] : 'rgba(255,255,255,0.35)';
};

// Resolve a CTA href: absolute http(s) untouched; relative library paths get the
// deployment base (BASE_URL) so they resolve under the deployment base.
const assetHref = (href: string): string =>
  /^https?:\/\//.test(href) ? href : `${import.meta.env.BASE_URL}${href}`;

export const DoctrineLibrary: React.FC<DoctrineLibraryProps> = ({ cards, pendingNote }) => {
  return (
    <div className="space-y-5">
      {/* Archive-record cards */}
      <div className="pleatfold pleatfold--archive grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((doc, i) => (
          <div
            key={doc.id}
            // 2px top accent + a low, uniform-direction pleat so each archive
            // card folds quietly IN PLACE — stable grid, no cross-column zigzag.
            style={{ borderTopColor: accentFor(doc.registers), borderTopWidth: '2px', transitionDelay: `calc(var(--pleat-stagger) * ${i})` }}
            className="pleat border border-white/15 bg-black/20 p-5 md:p-6 flex flex-col"
          >
            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-micro uppercase tracking-widest opacity-secondary">{doc.type}</span>
              <span className="opacity-30">·</span>
              {doc.registers.map((r) => (
                <span key={r} className="font-mono text-micro uppercase tracking-wide border border-white/20 px-1.5 py-0.5 opacity-secondary">
                  {r}
                </span>
              ))}
            </div>

            <h5 className="font-serif text-xl md:text-2xl leading-tight mb-1">{doc.title}</h5>
            <p className="font-mono text-xs uppercase tracking-wide opacity-muted mb-4 leading-relaxed">{doc.subtitle}</p>

            <p className="font-sans text-sm opacity-secondary leading-relaxed mb-4">{doc.description}</p>

            {/* "Why it matters" note — label dropped; the indent + italic mark it
                as a secondary annotation distinct from the description above. */}
            <p className="font-sans italic text-sm opacity-muted leading-relaxed border-l-2 border-white/20 pl-3 mb-5">
              {doc.why}
            </p>

            {/* Footer always filled: live CTA, or an archival catalog line when
                the document isn't published yet (never a broken/empty button). */}
            <div className="mt-auto pt-1">
              {doc.href ? (
                <a
                  href={assetHref(doc.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-xs uppercase tracking-widest border border-white/40 px-3 py-2 hover:bg-white hover:text-black transition-colors w-fit inline-block"
                >
                  {doc.ctaLabel} -&gt;
                </a>
              ) : (
                <span className="font-mono text-micro uppercase tracking-widest opacity-muted">
                  {pendingNote}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
