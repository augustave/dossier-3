import React from 'react';

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
  return (
    <div className={`fold${large ? ' fold--lg' : ''}`} data-open={open}>
      <div className={`fold__inner${className ? ` ${className}` : ''}`} inert={!open} {...rest}>
        {children}
      </div>
    </div>
  );
};
