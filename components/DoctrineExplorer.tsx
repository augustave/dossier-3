import React, { useState } from 'react';

/**
 * Doctrine-in-motion explorer.
 *
 * A small stateful panel that demonstrates the practice's rule-making
 * pattern: palette + thesis + iron rule, swappable by clicking a tab.
 *
 * Lives at the end of Module 02 (Creative Technologist), after the
 * field position chart. Frames the polymath claim from the chart
 * ("AI-leveraged, permanence-oriented") with its operational output —
 * codified register systems that produce consistent artifacts across
 * domains.
 *
 * Data lives in `copy.v1_1.ts` under modules["01"].registers.
 * See PRD-DOCTRINE-EXPLORER.md.
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
  palette: PaletteSwatch[];
  thesis: string;
  ironRule: string;
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
        aria-label="Doctrine register selector"
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
        <div className="font-mono text-xs uppercase tracking-widest opacity-tertiary mb-4">
          {active.name}
        </div>

        {/* Palette swatches */}
        <div className="grid grid-cols-3 gap-3 mb-6">
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

        {/* Thesis */}
        <p className="font-serif italic text-lg md:text-xl leading-relaxed mb-5">
          &ldquo;{active.thesis}&rdquo;
        </p>

        {/* Iron rule */}
        <div className="border-l-2 border-white/30 pl-3">
          <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-1">
            Iron Rule
          </div>
          <p className="font-sans text-sm opacity-secondary leading-relaxed">
            {active.ironRule}
          </p>
        </div>
      </div>
    </div>
  );
};
