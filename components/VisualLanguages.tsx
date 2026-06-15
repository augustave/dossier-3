import React, { useState } from 'react';

/**
 * Visual Languages (Module 03, V3.2 — CT-PRD-MARY-01.2).
 *
 * The centerpiece of the DIRECTION → VISUAL LANGUAGES rework: three authored
 * visual operating languages (DOSSIER / DEADLIGHT / IAA) presented as
 * design-system specimens. The registers (Monastery / Forge / Oracle) are
 * demoted to grammar tags underneath; clicking a register highlights the
 * languages built on it (Option A filtering). Data lives in
 * `copy.v1_1.ts` under modules.visualLanguages.
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

export const VisualLanguages: React.FC<VisualLanguagesProps> = ({
  languages,
  registers,
  grammarTitle,
  grammarIntro,
}) => {
  // Active register NAME (uppercase) being highlighted, or null for all.
  const [active, setActive] = useState<string | null>(null);

  const colorFor = (registerName: string): string => {
    const r = registers.find(reg => reg.name.toLowerCase() === registerName.toLowerCase());
    return r?.color ?? '#FFFFFF';
  };

  const usesActive = (lang: VisualLanguage): boolean =>
    active === null || lang.registers.some(r => r.toLowerCase() === active.toLowerCase());

  const toggle = (name: string) => setActive(prev => (prev === name ? null : name));

  return (
    <div className="space-y-5">
      {/* Language specimen cards */}
      {languages.map((lang) => {
        const dimmed = !usesActive(lang);
        return (
          <div
            key={lang.id}
            // Dimming is a visual-only highlight (Option A). No aria-hidden here:
            // the card holds a focusable CTA (DEADLIGHT), and hiding a subtree
            // with a tabbable link is an aria-hidden-focus / WCAG 4.1.2 violation.
            className={`border border-white/15 bg-black/20 p-5 md:p-6 transition-opacity duration-300 ${
              dimmed ? 'opacity-30' : 'opacity-100'
            }`}
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
                  style={{ borderColor: `${colorFor(tag)}66` }}
                >
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: colorFor(tag) }} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Short copy */}
            <p className="font-sans text-sm md:text-base opacity-secondary leading-relaxed mb-5">
              {lang.shortCopy}
            </p>

            {/* Governing rules */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {lang.governingRules.map((g) => (
                <span key={g} className="font-mono text-micro uppercase tracking-wide border border-white/20 px-2 py-1 opacity-secondary">
                  {g}
                </span>
              ))}
            </div>

            {/* System includes + refuses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-white/10">
              <div>
                <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">System includes</div>
                <ul className="flex flex-wrap gap-1.5">
                  {lang.includes.map((it) => (
                    <li key={it} className="font-mono text-micro uppercase tracking-wide border border-white/15 px-1.5 py-0.5 opacity-muted">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">Refuses</div>
                <ul className="flex flex-wrap gap-1.5">
                  {lang.refuses.map((it) => (
                    <li key={it} className="font-mono text-micro uppercase tracking-wide border border-white/10 px-1.5 py-0.5 opacity-muted line-through decoration-white/30">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Source of authority + optional CTAs (suppressed when href missing) */}
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
                      href={c!.href}
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
      })}

      {/* Register grammar */}
      <div className="pt-6 mt-2 border-t border-white/20">
        <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-2">{grammarTitle}</h4>
        <p className="font-sans text-sm md:text-base opacity-secondary leading-relaxed max-w-2xl mb-5">{grammarIntro}</p>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          role="group"
          aria-label="Register grammar — highlight languages by register"
        >
          {registers.map((r) => {
            const isActive = active === r.name;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={isActive}
                onClick={(e) => { e.stopPropagation(); toggle(r.name); }}
                className={`text-left p-4 border transition-colors ${
                  isActive ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'
                }`}
                style={{ borderColor: isActive ? r.color : 'rgba(255,255,255,0.15)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="font-mono text-xs uppercase tracking-widest">{r.code} · {r.name}</span>
                </div>
                <div className="font-mono text-micro uppercase tracking-wide opacity-tertiary mb-2">{r.function}</div>
                <p className="font-serif italic text-base mb-2">{r.question}</p>
                <p className="font-sans text-xs opacity-muted leading-relaxed">{r.usedWhen}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
