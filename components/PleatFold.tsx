import React from 'react';

interface PleatFoldProps {
  /** When true the accordion is unfolded flat (open); false folds it up. */
  open: boolean;
  /** Extra classes on the container — carries the unwrapped wrapper's spacing
   *  (space-y-*) + base typography so the pleats keep their original layout. */
  className?: string;
  children: React.ReactNode;
}

/**
 * PleatFold — an open module's content rows unfold like an origami accordion.
 *
 * Each direct child becomes a PLEAT with an alternating MOUNTAIN / VALLEY
 * crease: odd rows hinge about their top edge (mountain), even rows about their
 * bottom edge (valley), so the stack zig-zags. Folded (closed) the pleats stand
 * up and fade; open they rotate flat into readable rows. Continuous and exactly
 * reversible — one sheet reconfiguring (companion to the record-card-fold
 * thesis figure). The opening cascades top→bottom; closing folds bottom→top.
 *
 * 3D (rotateX + perspective) — runs on real GPUs (the live site). The
 * reduced-motion / no-3D path (see `.pleat` @media in index.css) drops the
 * rotation to a plain fade, so content is never left tilted or hidden.
 */
export const PleatFold: React.FC<PleatFoldProps> = ({ open, className, children }) => {
  const rows = React.Children.toArray(children).filter(Boolean);
  const n = rows.length;
  return (
    <div className={`pleatfold${className ? ` ${className}` : ''}`} data-open={open}>
      {rows.map((row, i) => (
        <div
          key={i}
          className="pleat"
          // Cascade the creases: open runs top→bottom, close folds bottom→top.
          style={{ transitionDelay: `${(open ? i : n - 1 - i) * 130}ms` }}
        >
          {row}
        </div>
      ))}
    </div>
  );
};
