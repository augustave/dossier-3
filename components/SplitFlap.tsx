import React, { useEffect, useRef, useState } from 'react';

// Split-flap (Solari departure-board) title reveal — TEST feature.
//
// PHYSICS (recalculated for realism + haptics):
//   • Each leaf FALLS under gravity (ease-in accelerate) and CLACKS into the stop
//     with a small overshoot + settle bounce — not a symmetric fade.
//   • A position runs a fast CYCLING phase, then HOMES into its target: it steps
//     alphabetically through the last few glyphs (…X, Y, Z, target) while the
//     cadence DECELERATES into the stop — the mechanical "settle".
//   • Positions lock left→right (FORWARD, on scroll-in) or right→left (REVERSE,
//     re-fired on every band open) — the title re-boards "while the fold engages".
//   • A subtle haptic pulse fires as each letter locks (mobile; cascades L→R).
//
// Cells reserve the FINAL glyph's width (CSS ::after) so the proportional title
// never reflows while flaps spin; the settled state is exactly the normal title.
// A generation token cancels any in-flight play so overlapping triggers can't
// interleave timers.

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const GLEN = GLYPHS.length;
const NBSP = ' ';
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLEN)];
// k steps before `target` in the flap sequence (the homing approach).
const glyphBefore = (target: string, k: number) => {
  const idx = GLYPHS.indexOf(target);
  if (idx < 0) return target;
  return GLYPHS[(idx - k + GLEN * Math.ceil(k / GLEN + 1)) % GLEN];
};

// --- physics constants (ms) ---
const STAGGER = 72;          // gap between adjacent positions locking (the cascade)
const SPIN = 480;            // earliest position's run length (start → lock)
const FLAP_MS = 72;          // mechanical step rate during the cycling phase
// Decelerating gaps for the final homing flaps (growing = easing into the stop).
const HOMING_GAPS = [88, 132, 190];

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
  /** Subtle vibration as each letter locks (mobile; ignored where unsupported). */
  haptics?: boolean;
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
  haptics = true,
}) => {
  const finals = Array.from(text);
  const [cells, setCells] = useState<Cell[]>(() => finalCells(finals));
  const [dir, setDir] = useState<Direction>('forward');
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);
  const prevOpenRef = useRef(open);
  const genRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(id => {
      window.clearInterval(id);
      window.clearTimeout(id);
    });
    timersRef.current = [];
  };

  const buzz = (ms: number) => {
    if (!haptics) return;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(ms);
      }
    } catch {
      /* vibrate can throw on some platforms — ignore */
    }
  };

  const play = (direction: Direction) => {
    clearTimers();
    const gen = ++genRef.current;
    setDir(direction);
    const len = finals.length;

    // Drop every non-space cell into the cycling state at once.
    setCells(prev =>
      finals.map((c, i) =>
        c === ' '
          ? { ch: NBSP, n: prev[i]?.n ?? 0, locked: true }
          : { ch: randomGlyph(), n: (prev[i]?.n ?? 0) + 1, locked: false }
      )
    );

    const setCell = (i: number, ch: string, locked: boolean) =>
      setCells(prev => {
        const next = prev.slice();
        next[i] = { ch, n: (next[i]?.n ?? 0) + 1, locked };
        return next;
      });

    const homingDur = HOMING_GAPS.reduce((a, b) => a + b, 0);

    finals.forEach((target, i) => {
      if (target === ' ') return;
      const order = direction === 'reverse' ? len - 1 - i : i;
      const lockAt = order * STAGGER + SPIN;
      const homingStart = Math.max(0, lockAt - homingDur);

      // Cycling phase — fast random flaps until the homing window opens.
      const cycleId = window.setInterval(() => {
        if (genRef.current !== gen) return;
        setCells(prev => {
          if (prev[i]?.locked) return prev;
          const next = prev.slice();
          next[i] = { ch: randomGlyph(), n: next[i].n + 1, locked: false };
          return next;
        });
      }, FLAP_MS);
      timersRef.current.push(cycleId);

      // Homing phase — stop cycling, step alphabetically into the target while
      // the cadence decelerates, landing on the locking clack.
      const homeId = window.setTimeout(() => {
        window.clearInterval(cycleId);
        if (genRef.current !== gen) return;
        const steps = HOMING_GAPS.length;
        let t = 0;
        HOMING_GAPS.forEach((gap, k) => {
          t += gap;
          const isLock = k === steps - 1;
          const ch = isLock ? target : glyphBefore(target, steps - 1 - k);
          const id = window.setTimeout(() => {
            if (genRef.current !== gen) return;
            setCell(i, ch, isLock);
            if (isLock) buzz(6);
          }, t);
          timersRef.current.push(id);
        });
      }, homingStart);
      timersRef.current.push(homeId);
    });
  };

  // Re-sync to a new word (latent here — titles are constant — keeps the contract).
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
      startedRef.current = true;
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
