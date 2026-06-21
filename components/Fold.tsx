import React, { useEffect, useRef, useState } from 'react';

interface FoldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true the fold is open (content revealed). */
  open: boolean;
  /** Use the larger duration token (module strata panel). */
  large?: boolean;
  /** Applied to the inner content wrapper (the element that carries id/aria). */
  className?: string;
  children: React.ReactNode;
}

/**
 * Fold — the single collapse primitive for the whole interface.
 *
 * One grammar for every fold (module panel, drawer, spec). Collapses to the
 * EXACT content height via `grid-template-rows: 0fr → 1fr` (see `.fold` in
 * index.css) — no max-height guess. When closed the inner content is kept in
 * the DOM but marked `inert`, so it animates yet stays out of the tab order
 * and the accessibility tree. id/aria-* are forwarded to the inner element so
 * existing `aria-controls` wiring keeps pointing at real content.
 */
export const Fold: React.FC<FoldProps> = ({ open, large, className, children, ...rest }) => {
  const innerRef = useRef<HTMLDivElement>(null);
  // Pleat-open lags the height/opacity open by one COMMITTED frame.
  //
  // Why: the pleat rows' rotate transition is keyed (in index.css) on
  // `data-pleat-open`, NOT `data-open`. While closed, the fold collapses to
  // grid-rows:0fr + opacity:0, so the pleat subtree has zero paint area. If the
  // rotate trigger flipped on the SAME frame the height opens, the browser has
  // no painted "from" state to interpolate and SNAPS the rows flat — the first
  // open shows no fold; only after an open→close cycle (which paints the rows)
  // does a reopen animate. Opening height first, forcing a paint, THEN flipping
  // the pleats gives the rotate a real baseline on every first open.
  const [pleatOpen, setPleatOpen] = useState(open);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (open === prevOpen.current) return;
    prevOpen.current = open;
    // Closing: fold the rows up immediately (bottom→top), in lockstep with height.
    if (!open) {
      setPleatOpen(false);
      return;
    }
    // Opening: height is already expanding (data-open is true this render). Wait
    // one frame, force the now-growing closed rows to commit a paint, then flip
    // the pleats so their rotate transition runs from a real baseline. A timeout
    // fallback guarantees the flip even where rAF is starved (background/headless
    // tabs) — pleat opacity is keyed on data-open in CSS, so content is never
    // hidden by a late flip; only the rotate baseline depends on this.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      void innerRef.current?.offsetHeight; // force reflow → commit the closed paint
      raf2 = requestAnimationFrame(() => setPleatOpen(true));
    });
    const fallback = window.setTimeout(() => setPleatOpen(true), 90);
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(fallback);
    };
  }, [open]);

  return (
    <div className={`fold${large ? ' fold--lg' : ''}`} data-open={open} data-pleat-open={pleatOpen}>
      <div ref={innerRef} className={`fold__inner${className ? ` ${className}` : ''}`} inert={!open} {...rest}>
        {children}
      </div>
    </div>
  );
};
