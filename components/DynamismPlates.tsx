import React, { useEffect, useState } from 'react';

/**
 * Doctrine Plates — a compact plate archive appended to AMERICAN DYNAMISM (04).
 * Motion follows the AD GREEN spec (Images/DYNAMISIM-DO/AD_GREEN_FINE.md):
 * constant-velocity line drawing (stroke-dasharray trace), mechanical typesetting,
 * rigid [ ] bracket selection, 1px→2px rule thickening, instant exits — no fades,
 * springs, glows or shadows. Visual law lives in the `--plate-*` block in index.css.
 * The index row IS the interaction (house pattern); images load only when opened.
 */

const PLATES = [
  { n: '01', title: 'THE AESTHETICS OF ALGORITHMIC WARFARE' },
  { n: '02', title: 'THE ARCHITECTURE OF INTERFACE THEATRE' },
  { n: '03', title: 'THE DEFENSE INDUSTRIAL PARADIGM SHIFT' },
  { n: '04', title: 'THE EPISTEMOLOGY OF TOTAL VISIBILITY' },
  { n: '05', title: 'GAMIFYING THE MODERN KILL CHAIN' },
  { n: '06', title: 'THE ARCHITECTURE OF ACTION' },
  { n: '07', title: 'THE ATTRITION OF MORAL AGENCY' },
  { n: '08', title: 'THE CYBORG WARFIGHTER' },
  { n: '09', title: 'THE WEAPONIZATION OF PRIVACY DISCOURSE' },
  { n: '10', title: 'THE CONVERGENCE OF AD-TECH AND TARGETING' },
];

const TYPE_TICK_MS = 14;   // one metronome tick; 2 chars per tick, constant rate
const CHARS_PER_TICK = 2;

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const DynamismPlates: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  // Bumped on every plate change so the stage remounts and the frame re-traces.
  const [drawKey, setDrawKey] = useState(0);
  const [typed, setTyped] = useState('');

  const caption =
    open !== null ? `PLATE ${PLATES[open].n} / 10 — ${PLATES[open].title}` : '';

  const select = (i: number) => {
    setOpen(i);
    setDrawKey((k) => k + 1);
  };
  const toggle = (i: number) => (open === i ? setOpen(null) : select(i));

  // Mechanical typesetting: fixed tick, no easing, permanent once printed.
  useEffect(() => {
    if (open === null) {
      setTyped('');
      return;
    }
    if (prefersReducedMotion()) {
      setTyped(caption);
      return;
    }
    setTyped('');
    let i = 0;
    const t = window.setInterval(() => {
      i += CHARS_PER_TICK;
      setTyped(caption.slice(0, i));
      if (i >= caption.length) window.clearInterval(t);
    }, TYPE_TICK_MS);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, drawKey]);

  // ESC closes; arrows step plates (discrete jumps) while open.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        select((open + 1) % PLATES.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        select((open + PLATES.length - 1) % PLATES.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="mt-4 pt-8 border-t border-white/20">
      <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-3">
        DOCTRINE PLATES · THE AESTHETICS OF ALGORITHMIC WARFARE — 10 SHEETS
      </h4>

      <div className="plate-strip font-mono text-sm" role="group" aria-label="Doctrine plates index">
        {PLATES.map((p, i) => (
          <button
            key={p.n}
            type="button"
            className={`plate-token${open === i ? ' is-open' : ''}`}
            aria-expanded={open === i}
            aria-controls="plate-viewer"
            aria-label={`Plate ${p.n} — ${p.title}`}
            onClick={() => toggle(i)}
          >
            {p.n}
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          id="plate-viewer"
          role="region"
          aria-label={`Plate ${PLATES[open].n} — ${PLATES[open].title}`}
          className="mt-5"
        >
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <p className="font-mono text-xs uppercase tracking-wide min-h-[1.2em]">
              {typed}
              {typed.length < caption.length && (
                <span className="plate-caret" aria-hidden="true" />
              )}
            </p>
            <button
              type="button"
              className="plate-close font-mono text-xs uppercase tracking-widest shrink-0"
              onClick={() => setOpen(null)}
            >
              [ CLOSE ]
            </button>
          </div>

          {/* keyed: plate change remounts the stage → frame re-traces, image re-snaps */}
          <div className="plate-stage" key={drawKey}>
            <svg
              className="plate-frame"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect x="0.2" y="0.2" width="99.6" height="99.6" pathLength="100" className="plate-trace" />
            </svg>
            {/* No loading="lazy": the viewer only mounts on click, so conditional
                rendering IS the lazy gate — deferring further just delays paint. */}
            <img
              src={`dynamism/plate-${PLATES[open].n}.jpg`}
              alt={`Plate ${PLATES[open].n} — ${PLATES[open].title}`}
              className="plate-img block w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
