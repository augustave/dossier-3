import React, { useState } from 'react';
import { Fold } from './Fold';

/**
 * Visual Languages (Module 03).
 *
 * Three authored visual operating languages (DOSSIER / DEADLIGHT / IAA) as
 * design-system specimens. A compact register filter sits ABOVE the cards
 * (clicking a register highlights the languages built on it); the full register
 * grammar exposition stays below as read-only "grammar underneath."
 *
 * Cards are calm by default — name, prose, source of authority, CTA — with the
 * spec (governing rules / includes / refuses) folded behind a per-card "Full
 * spec" toggle (progressive disclosure, matching the page's fold metaphor).
 * Each card carries a register-color top accent, consistent with the Doctrine
 * Library. Data lives in copy.v1_1.ts under modules.visualLanguages.
 */

export interface LanguageCta {
  label: string;
  href: string;
}

export interface VisualLanguage {
  id: string;
  name: string;
  label: string;
  type: string;
  context: string;
  registers: string[];
  shortCopy: string;
  governingRules: string[];
  includes: string[];
  sourceOfAuthority: string;
  refuses: string[];
  cta: LanguageCta | null;
  secondaryCta: LanguageCta | null;
}

export interface RegisterGrammar {
  id: string;
  code: string;
  name: string;
  function: string;
  question: string;
  usedWhen: string;
  color: string;
}

interface VisualLanguagesProps {
  languages: VisualLanguage[];
  registers: RegisterGrammar[];
  grammarTitle: string;
  grammarIntro: string;
}

// Resolve a CTA href: leave absolute http(s) URLs untouched; prefix relative
// library paths with the deployment base (BASE_URL) so they resolve under the
// /CT-DOSSIER/ GitHub Pages base instead of 404-ing at the site root.
const assetHref = (href: string): string =>
  /^https?:\/\//.test(href) ? href : `${import.meta.env.BASE_URL}${href}`;

// Cap the inline spec lists so a card teases breadth without dumping the full
// spec (the rest lives in the linked document).
const SPEC_CAP = 6;

interface LanguageCardProps {
  lang: VisualLanguage;
  accent: string;
  tagColor: (name: string) => string;
  dimmed: boolean;
  highlight: string | null;
}

const LanguageCard: React.FC<LanguageCardProps> = ({ lang, accent, tagColor, dimmed, highlight }) => {
  const [open, setOpen] = useState(false);
  const specId = `vl-spec-${lang.id}`;

  return (
    <div
      // 2px top accent in the primary register color (scannable variety + a tie
      // to the register grammar). When a register filter is active, matching
      // cards also get an inset ring in the active register's color — a positive
      // highlight, not just dimming the rest.
      style={{
        borderTopColor: accent,
        borderTopWidth: '2px',
        // Inline opacity (not a Tailwind class): the dynamic `opacity-30` class
        // wasn't being emitted, so the filter dim never applied. Inline is robust.
        opacity: dimmed ? 0.3 : 1,
        boxShadow: highlight ? `inset 0 0 0 1px ${highlight}` : undefined,
      }}
      className="border border-white/15 bg-black/20 p-5 md:p-6 transition-opacity duration-300"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4 mb-1">
        <h5 className="font-sans text-2xl md:text-3xl font-bold uppercase tracking-tight">{lang.name}</h5>
        <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">{lang.label}</span>
      </div>
      <div className="font-mono text-micro uppercase tracking-wide opacity-muted mb-4">
        {lang.type} · {lang.context}
      </div>

      {/* Register tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {lang.registers.map((tag) => (
          <span
            key={tag}
            className="font-mono text-micro uppercase tracking-widest border px-2 py-1 flex items-center gap-1.5"
            style={{ borderColor: `${tagColor(tag)}66` }}
          >
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: tagColor(tag) }} />
            {tag}
          </span>
        ))}
      </div>

      {/* Short copy — leads the card. */}
      <p className="font-sans text-sm md:text-base opacity-secondary leading-relaxed mb-4">
        {lang.shortCopy}
      </p>

      {/* Full-spec toggle — keeps the card calm by default. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={specId}
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="font-mono text-micro uppercase tracking-widest opacity-muted hover:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-current rounded-sm transition-opacity"
      >
        {open ? 'Hide spec ↑' : 'Full spec ↓'}
      </button>

      {/* Spec — folds via the shared <Fold> primitive (was a bare mount):
          now stays in the DOM and goes inert when closed, like every other fold.
          Spacing/crease live on an inner child so they collapse to nothing when
          folded (padding/border on .fold__inner itself would leave a sliver). */}
      <Fold open={open} id={specId}>
        <div className="mt-4 pt-4 border-t space-y-4" style={{ borderColor: 'var(--fold-crease)' }}>
          <div className="flex flex-wrap gap-1.5">
            {lang.governingRules.map((g) => (
              <span key={g} className="font-mono text-micro uppercase tracking-wide border border-white/20 px-2 py-1 opacity-secondary">
                {g}
              </span>
            ))}
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-micro uppercase tracking-wide leading-relaxed">
              <span className="opacity-tertiary">System includes — </span>
              <span className="opacity-muted">{lang.includes.slice(0, SPEC_CAP).join(', ')}</span>
            </p>
            <p className="font-mono text-micro uppercase tracking-wide leading-relaxed">
              <span className="opacity-tertiary">Refuses — </span>
              <span className="opacity-muted">{lang.refuses.slice(0, SPEC_CAP).join(', ')}</span>
            </p>
          </div>
        </div>
      </Fold>

      {/* Source of authority + optional CTAs — always visible at the foot. */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mt-5 pt-4 border-t border-white/10">
        <div>
          <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-1">Source of authority</div>
          <p className="font-serif italic text-lg">{lang.sourceOfAuthority}</p>
        </div>
        {(lang.cta || lang.secondaryCta) && (
          <div className="flex flex-wrap gap-2">
            {[lang.cta, lang.secondaryCta].filter(Boolean).map((c) => (
              <a
                key={c!.href}
                href={assetHref(c!.href)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-xs uppercase tracking-widest border border-white/40 px-3 py-2 hover:bg-white hover:text-black transition-colors whitespace-nowrap w-fit"
              >
                {c!.label} -&gt;
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const VisualLanguages: React.FC<VisualLanguagesProps> = ({
  languages,
  registers,
  grammarTitle,
  grammarIntro,
}) => {
  // Active register NAME being highlighted, or null for all.
  const [active, setActive] = useState<string | null>(null);

  const colorFor = (registerName: string): string => {
    const r = registers.find(reg => reg.name.toLowerCase() === registerName.toLowerCase());
    return r?.color ?? 'rgba(255,255,255,0.35)';
  };

  const usesActive = (lang: VisualLanguage): boolean =>
    active === null || lang.registers.some(r => r.toLowerCase() === active.toLowerCase());

  const toggle = (name: string) => setActive(prev => (prev === name ? null : name));

  const chip = (label: string, color: string | null, isActive: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      aria-pressed={isActive}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`font-mono text-micro uppercase tracking-widest border px-3 py-2 flex items-center gap-1.5 transition-colors ${
        isActive ? 'bg-white text-black border-white' : 'bg-transparent text-white/70 border-white/25 hover:border-white/60 hover:text-white'
      }`}
    >
      {color && <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}
      {label}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Filter strip — discoverable above the cards (mirrors the Doctrine
          Library chips). Highlights the languages built on a register. */}
      <div className="space-y-2">
        <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary">Highlight by register</div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Highlight languages by register">
          {chip('ALL', null, active === null, () => setActive(null))}
          {registers.map(r => chip(r.name, r.color, active === r.name, () => toggle(r.name)))}
        </div>
      </div>

      {/* Language specimen cards — each an origami pleat row (alternating
          mountain/valley), unfolding flat when the module opens. */}
      <div className="pleatfold space-y-5">
        {languages.map((lang, i) => (
          <div key={lang.id} className="pleat" style={{ transitionDelay: `calc(var(--pleat-stagger) * ${i})` }}>
            <LanguageCard
              lang={lang}
              accent={colorFor(lang.registers[0])}
              tagColor={colorFor}
              dimmed={!usesActive(lang)}
              highlight={active !== null && usesActive(lang) ? colorFor(active) : null}
            />
          </div>
        ))}
      </div>

      {/* Register grammar — read-only exposition; the "grammar underneath" the
          languages. Filtering lives in the chip strip above. */}
      <div className="pt-6 mt-2 border-t border-white/20">
        <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-2">{grammarTitle}</h4>
        <p className="font-sans text-sm md:text-base opacity-secondary leading-relaxed max-w-2xl mb-5">{grammarIntro}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {registers.map((r) => (
            <div key={r.id} className="p-4 border border-white/15">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="font-mono text-xs uppercase tracking-widest">{r.code} · {r.name}</span>
              </div>
              <div className="font-mono text-micro uppercase tracking-wide opacity-tertiary mb-2">{r.function}</div>
              <p className="font-serif italic text-base mb-2">{r.question}</p>
              <p className="font-sans text-xs opacity-muted leading-relaxed">{r.usedWhen}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
