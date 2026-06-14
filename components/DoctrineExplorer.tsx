import React, { useState } from 'react';

/**
 * Register explorer.
 *
 * A stateful panel that demonstrates the practice's rule-making system: each
 * register is a SOURCE OF AUTHORITY (Monastery / Forge / Oracle) with its own
 * palette, quote, iron rule, and design traits — swappable by clicking a tab.
 * V3.1 (CT-PRD-MARY-01.1) replaced the old domain registers (Maritime /
 * Industrial / Spectrum) with civilizational ones so the section reads as a
 * theory of taste, not a palette selector.
 *
 * Lives in the DIRECTION module (03). Data lives in
 * `copy.v1_1.ts` under modules.direction.registers.
 */

export interface PaletteSwatch {
  name: string;
  hex: string;
  accent: boolean;
}

export interface DoctrineRegister {
  code: string;
  name: string;
  domain: string;
  function: string;
  mainLine: string;
  question: string;
  description: string;
  palette: PaletteSwatch[];
  protectedAccent: string;
  quote: string;
  ironRule: string;
  traits: string[];
  avoid: string[];
}

interface DoctrineExplorerProps {
  registers: DoctrineRegister[];
}

export const DoctrineExplorer: React.FC<DoctrineExplorerProps> = ({ registers }) => {
  const [activeCode, setActiveCode] = useState<string>(registers[0]?.code ?? '');
  const active = registers.find(r => r.code === activeCode) ?? registers[0];

  if (!active) return null;

  return (
    <div className="bg-black/20 border border-white/10">
      {/* Tab row */}
      <div
        className="flex border-b border-white/10"
        role="tablist"
        aria-label="Register selector"
      >
        {registers.map(r => {
          const isActive = r.code === activeCode;
          return (
            <button
              key={r.code}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={(event) => {
                event.stopPropagation();
                setActiveCode(r.code);
              }}
              className={`flex-1 font-mono text-xs uppercase tracking-widest px-3 py-3 transition-colors border-r border-white/10 last:border-r-0 ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {r.code} <span className="opacity-50">·</span> {r.domain}
            </button>
          );
        })}
      </div>

      {/* Panel content */}
      <div
        className="p-5 md:p-6"
        role="tabpanel"
        data-testid={`doctrine-panel-${active.code}`}
      >
        {/* Header: name + function + main line + core question */}
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h5 className="font-serif text-2xl md:text-3xl">{active.name}</h5>
          <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary text-right">
            {active.function}
          </span>
        </div>
        <p className="font-serif italic text-lg md:text-xl mb-1">{active.mainLine}</p>
        <p className="font-mono text-xs uppercase tracking-wide opacity-muted mb-5">
          {active.question}
        </p>

        {/* Description */}
        <p className="font-sans text-sm md:text-base opacity-secondary leading-relaxed mb-6">
          {active.description}
        </p>

        {/* Palette swatches */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
          {active.palette.map((s) => (
            <div key={s.hex}>
              <div
                className="h-14 mb-2 border border-white/20"
                style={{ backgroundColor: s.hex }}
                aria-label={`Swatch ${s.name}, ${s.hex}`}
              />
              <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary truncate">
                {s.name}
              </div>
              <div className="font-mono text-micro opacity-muted flex items-center gap-2 mt-0.5">
                <span>{s.hex}</span>
                {s.accent && (
                  <span className="border border-current/40 px-1 py-0 text-micro uppercase tracking-widest opacity-tertiary">
                    Accent
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono text-micro uppercase tracking-widest opacity-muted mb-6">
          Protected accent · {active.protectedAccent}
        </p>

        {/* Quote */}
        <p className="font-serif italic text-lg md:text-xl leading-relaxed mb-5">
          &ldquo;{active.quote}&rdquo;
        </p>

        {/* Iron rule */}
        <div className="border-l-2 border-white/30 pl-3 mb-6">
          <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-1">
            Iron Rule
          </div>
          <p className="font-sans text-sm opacity-secondary leading-relaxed">
            {active.ironRule}
          </p>
        </div>

        {/* Traits + avoid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">
              Leans into
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {active.traits.map((t) => (
                <li key={t} className="font-mono text-micro uppercase tracking-wide border border-white/20 px-2 py-1 opacity-secondary">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">
              Refuses
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {active.avoid.map((t) => (
                <li key={t} className="font-mono text-micro uppercase tracking-wide border border-white/10 px-2 py-1 opacity-muted line-through decoration-white/30">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
