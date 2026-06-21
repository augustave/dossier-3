import React, { useEffect, useRef, useState } from 'react';

// Split-flap (Solari departure-board) title reveal — TEST feature.
// Each character flips through glyphs and locks to its final letter:
//   • FORWARD cascade (left→right, top-hinged flap) fired once when the band
//     scrolls into view.
//   • REVERSE cascade (right→left, bottom-hinged flap) re-fired every time the
//     band OPENS — the title re-boards in reverse "while the fold is engaging".
// Cells reserve the FINAL glyph's width (CSS ::after), so the proportional title
// never reflows while the flaps spin, and the settled state is exactly the
// normal title. A generation token cancels any in-flight play so an overlapping
// trigger (scroll-in then click) can never interleave timers.

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const NBSP = ' ';
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

type Direction = 'forward' | 'reverse';

interface Cell {
  ch: string;
  n: number;       // bump on every change → re-keys the glyph → replays the flap
  locked: boolean;
}

interface SplitFlapProps {
  text: string;
  className?: string;
  /** Re-fires the cascade in REVERSE on each false→true edge (band opening). */
  open?: boolean;
  /** ms between each character LOCKING (the cascade). 20% slower than the original. */
  stagger?: number;
  /** ms a character spends flipping before it locks. */
  spin?: number;
  /** ms between glyph changes while flipping. */
  tick?: number;
}

const finalCells = (finals: string[]): Cell[] =>
  finals.map(c => ({ ch: c === ' ' ? NBSP : c, n: 0, locked: true }));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canAnimate = () =>
  !prefersReducedMotion() && typeof IntersectionObserver !== 'undefined';

export const SplitFlap: React.FC<SplitFlapProps> = ({
  text,
  className = '',
  open = false,
  stagger = 72,
  spin = 432,
  tick = 54,
}) => {
  const finals = Array.from(text);
  // Initialise to the FINAL text — robust: readable before/without JS, SSR-safe.
  const [cells, setCells] = useState<Cell[]>(() => finalCells(finals));
  const [dir, setDir] = useState<Direction>('forward');
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);   // forward cascade fires at most once
  const prevOpenRef = useRef(open);
  const genRef = useRef(0);           // generation token — invalidates stale timers
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(id => {
      window.clearInterval(id);
      window.clearTimeout(id);
    });
    timersRef.current = [];
  };

  const play = (direction: Direction) => {
    clearTimers();
    const gen = ++genRef.current;
    setDir(direction);
    const len = finals.length;

    // Kick every non-space cell into the cycling state at once.
    setCells(prev =>
      finals.map((c, i) =>
        c === ' '
          ? { ch: NBSP, n: prev[i]?.n ?? 0, locked: true }
          : { ch: randomGlyph(), n: (prev[i]?.n ?? 0) + 1, locked: false }
      )
    );

    finals.forEach((target, i) => {
      if (target === ' ') return;
      // forward: i locks in index order; reverse: rightmost locks first.
      const order = direction === 'reverse' ? len - 1 - i : i;

      const intervalId = window.setInterval(() => {
        if (genRef.current !== gen) return; // superseded by a newer play
        setCells(prev => {
          if (prev[i]?.locked) return prev;
          const next = prev.slice();
          next[i] = { ch: randomGlyph(), n: next[i].n + 1, locked: false };
          return next;
        });
      }, tick);
      timersRef.current.push(intervalId);

      const lockId = window.setTimeout(() => {
        window.clearInterval(intervalId);
        if (genRef.current !== gen) return;
        setCells(prev => {
          const next = prev.slice();
          next[i] = { ch: target, n: next[i].n + 1, locked: true };
          return next;
        });
      }, order * stagger + spin);
      timersRef.current.push(lockId);
    });
  };

  // Re-sync to a new word: render it immediately, cancel any in-flight timers,
  // and allow the forward cascade to replay when it next enters view. (Latent in
  // this app — titles are constant — but keeps the component contract correct.)
  useEffect(() => {
    clearTimers();
    genRef.current += 1;
    startedRef.current = false;
    setCells(finalCells(Array.from(text)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // FORWARD — once, when the band scrolls into view.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!canAnimate()) {
      setCells(finalCells(finals));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          if (!startedRef.current) {
            startedRef.current = true;
            play('forward');
          }
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

  // REVERSE — on each open (false→true) edge, "while the fold is engaging".
  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;
    if (open && !wasOpen && canAnimate()) {
      startedRef.current = true; // a manual open also counts as "revealed"
      play('reverse');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <span ref={ref} className={`splitflap ${className}`.trim()} aria-label={text}>
      {cells.map((cell, i) => (
        <span
          key={i}
          className="splitflap__cell"
          data-final={finals[i] === ' ' ? NBSP : finals[i]}
          aria-hidden="true"
        >
          <span
            key={cell.n}
            className={
              'splitflap__glyph' +
              (cell.locked ? ' is-locked' : '') +
              (dir === 'reverse' ? ' splitflap__glyph--rev' : '')
            }
          >
            {cell.ch}
          </span>
        </span>
      ))}
    </span>
  );
};
