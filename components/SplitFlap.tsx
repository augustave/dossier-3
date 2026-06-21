import React, { useEffect, useRef, useState } from 'react';

// Split-flap (Solari departure-board) title reveal — TEST feature (V3.6.3).
// Each character flips through glyphs and locks to its final letter, cascading
// left→right, fired when the band scrolls into view. Cells reserve the FINAL
// glyph's width (CSS ::after), so the proportional title never jitters while the
// flaps spin, and the settled state is exactly the normal title.

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const NBSP = ' ';
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

interface Cell {
  ch: string;
  n: number;       // bump on every change → re-keys the glyph → replays the flap
  locked: boolean;
}

interface SplitFlapProps {
  text: string;
  className?: string;
  /** ms between each character LOCKING (the left→right cascade). */
  stagger?: number;
  /** ms a character spends flipping before it locks. */
  spin?: number;
  /** ms between glyph changes while flipping. */
  tick?: number;
}

const finalCells = (finals: string[]): Cell[] =>
  finals.map(c => ({ ch: c === ' ' ? NBSP : c, n: 0, locked: true }));

export const SplitFlap: React.FC<SplitFlapProps> = ({
  text,
  className = '',
  stagger = 60,
  spin = 360,
  tick = 45,
}) => {
  const finals = Array.from(text);
  // Initialise to the FINAL text — robust: always readable before/without JS,
  // and SSR/jsdom-safe. The scramble plays on scroll-into-view.
  const [cells, setCells] = useState<Cell[]>(() => finalCells(finals));
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // No animation environment (reduced motion, or no IntersectionObserver as in
    // jsdom) → just show the final text.
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setCells(finalCells(finals));
      return;
    }

    const clearTimers = () => {
      timers.current.forEach(id => {
        window.clearInterval(id);
        window.clearTimeout(id);
      });
      timers.current = [];
    };

    const run = () => {
      if (started.current) return;
      started.current = true;

      // Kick every non-space cell into the cycling state at once.
      setCells(finals.map(c =>
        c === ' '
          ? { ch: NBSP, n: 0, locked: true }
          : { ch: randomGlyph(), n: 1, locked: false }
      ));

      finals.forEach((target, i) => {
        if (target === ' ') return;
        const intervalId = window.setInterval(() => {
          setCells(prev => {
            if (prev[i]?.locked) return prev;
            const next = prev.slice();
            next[i] = { ch: randomGlyph(), n: next[i].n + 1, locked: false };
            return next;
          });
        }, tick);
        timers.current.push(intervalId);

        const lockId = window.setTimeout(() => {
          window.clearInterval(intervalId);
          setCells(prev => {
            const next = prev.slice();
            next[i] = { ch: target, n: next[i].n + 1, locked: true };
            return next;
          });
        }, i * stagger + spin);
        timers.current.push(lockId);
      });
    };

    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span ref={ref} className={`splitflap ${className}`.trim()} aria-label={text}>
      {cells.map((cell, i) => (
        <span
          key={i}
          className="splitflap__cell"
          data-final={finals[i] === ' ' ? NBSP : finals[i]}
          aria-hidden="true"
        >
          <span key={cell.n} className={`splitflap__glyph${cell.locked ? ' is-locked' : ''}`}>
            {cell.ch}
          </span>
        </span>
      ))}
    </span>
  );
};
