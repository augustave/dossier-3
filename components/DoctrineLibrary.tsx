import React, { useState, useMemo } from 'react';

/**
 * Doctrine Library (Module 06, V3.3 — CT-PRD-MARY-01.3).
 *
 * The shelf of written source texts behind the practice: essays, working
 * papers, rulebooks, manifestos. Typographic archive-record cards, not a blog
 * feed. A lightweight register filter narrows the shelf. CTAs are suppressed
 * when a card's href is null (the file isn't in /public/library/ yet) so no
 * broken links render. Data lives in copy.v1_1.ts under modules.doctrineLibrary.
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
  allLabel: string;
}

export const DoctrineLibrary: React.FC<DoctrineLibraryProps> = ({ cards, allLabel }) => {
  // null = show all; otherwise filter to cards carrying this register tag.
  const [filter, setFilter] = useState<string | null>(null);

  // Filter chips: ALL + the union of register tags actually present on cards,
  // in first-seen order (so the taxonomy can never drift from the data).
  const tags = useMemo(() => {
    const seen: string[] = [];
    cards.forEach(c => c.registers.forEach(r => { if (!seen.includes(r)) seen.push(r); }));
    return seen;
  }, [cards]);

  const visible = filter ? cards.filter(c => c.registers.includes(filter)) : cards;

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      aria-pressed={active}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`font-mono text-micro uppercase tracking-widest border px-3 py-1.5 transition-colors ${
        active ? 'bg-white text-black border-white' : 'bg-transparent text-white/70 border-white/25 hover:border-white/60 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the library by register">
        {chip(allLabel, filter === null, () => setFilter(null))}
        {tags.map(t => chip(t, filter === t, () => setFilter(prev => (prev === t ? null : t))))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {filter ? `${visible.length} of ${cards.length} documents shown, filtered by ${filter}.` : `All ${cards.length} documents shown.`}
      </p>

      {/* Archive-record cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map((doc) => (
          <div key={doc.id} className="border border-white/15 bg-black/20 p-5 md:p-6 flex flex-col">
            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">{doc.type}</span>
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

            <div className="border-l-2 border-white/20 pl-3 mb-5">
              <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-1">Why it matters</div>
              <p className="font-sans text-sm opacity-secondary leading-relaxed">{doc.why}</p>
            </div>

            {/* CTA at bottom — suppressed when the file isn't published yet. */}
            <div className="mt-auto">
              {doc.href && (
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-xs uppercase tracking-widest border border-white/40 px-3 py-2 hover:bg-white hover:text-black transition-colors w-fit inline-block"
                >
                  {doc.ctaLabel} -&gt;
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
