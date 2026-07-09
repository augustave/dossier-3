import React, { useEffect, useRef, useState } from 'react';

interface IndexOdometerProps {
  /** Two-char band index, e.g. "04". */
  index: string;
  /** True while the row is hovered — drives the units-reel spin. */
  spin: boolean;
  /** Flagship band (04): stays lit; the reel does not idle-spin. */
  alwaysOn?: boolean;
}

// Units reel is a vertical strip of 20 digits (0-9 twice) clipped in a 1em
// window. Idle sits on the FIRST occurrence of the target; on hover it rolls
// forward one full lap and lands on the SECOND occurrence — a slot-machine
// catch, not a jump. Heights are in `em` so it scales with the responsive
// font-size without px math. Coloring (outline idle → solid lit) + the color
// wipe live in CSS on the row; this component owns structure + the roll.
const STRIP = Array.from({ length: 20 }, (_, i) => i % 10);

export const IndexOdometer: React.FC<IndexOdometerProps> = ({ index, spin, alwaysOn }) => {
  const tens = index[0] ?? '0';
  const units = Number(index[1] ?? index[0] ?? 0);
  const stripRef = useRef<HTMLSpanElement>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    if (spin) {
      // Snap to the first-occurrence baseline with no animation, force a reflow,
      // then next frame roll one lap forward to the second occurrence.
      el.style.transition = 'none';
      el.style.transform = `translateY(-${units}em)`;
      void el.offsetHeight; // commit the reset
      const raf = requestAnimationFrame(() => {
        el.style.transition = 'transform 420ms cubic-bezier(0.15, 0.85, 0.25, 1)';
        el.style.transform = `translateY(-${units + 10}em)`;
      });
      setSpinning(true);
      const done = window.setTimeout(() => setSpinning(false), 430);
      return () => { cancelAnimationFrame(raf); window.clearTimeout(done); };
    }
    // Un-hover: snap back to the first occurrence, invisibly, ready to roll again.
    el.style.transition = 'none';
    el.style.transform = `translateY(-${units}em)`;
    setSpinning(false);
  }, [spin, units]);

  return (
    <span className="odometer font-mono text-4xl md:text-6xl font-bold tracking-tighter" aria-hidden="true">
      <span className="odo-tens">{tens}</span>
      <span className="reel">
        <span
          ref={stripRef}
          className={`reel-strip${spinning ? ' is-spinning' : ''}`}
          style={{ transform: `translateY(-${units}em)` }}
        >
          {STRIP.map((d, i) => (
            <span key={i} className="reel-digit">{d}</span>
          ))}
        </span>
      </span>
    </span>
  );
};
