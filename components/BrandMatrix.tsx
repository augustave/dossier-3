import React from 'react';

/**
 * BRAND — the structural matrix. The grid itself is the primary expression: a
 * matte, reductive index of the practice's working vocabulary. Rendered full-
 * bleed (100vw) as a three-region 12-column grid: a meta block (label + hint),
 * the vocabulary as a static wrapping hairline grid (reading order, left→right),
 * and the two live links (Branding / AGI, Creative Strategy) as a stacked widget
 * column apart from the index. Hovering a cell instantly inverts it (a version
 * swap, same layout bounds — no fade, matte doctrine). Three cells carry the
 * CoTR green (#42FC04). Static: no scroll track, so it never makes a page-level
 * horizontal scrollbar (the .strata-band clip absorbs the 100vw overshoot).
 *
 * Each tile that carries an `image` gets a sudden-apparition hover: the matched
 * still pops in centered over the cell — instant (no fade), matching the
 * matte doctrine already used for the cell invert. Hover-capable devices only
 * (see .brand-cell__apparition, index.css) — on touch the grid is unaffected.
 */
type Tile = {
  label: string;
  accent?: boolean;
  note?: string;
  href?: string;
  arrow?: string;
  eyebrow?: string;
  image?: string;
};

export const BrandMatrix: React.FC<{ hint?: string; tiles: Tile[]; links: Tile[] }> = ({
  hint,
  tiles,
  links,
}) => {
  return (
    <div className="brand-matrix">
      {/* LEFT — meta. The only reading block; capped to a legible measure. */}
      <aside className="brand-meta font-mono">
        <div className="brand-meta__label">05 · BRAND</div>
        {hint && <p className="brand-meta__hint">{hint}</p>}
      </aside>

      {/* CENTER — the vocabulary as a static wrapping hairline grid. Row-major
          auto-placement = reading order, so the index numbers run in sequence. */}
      <div className="brand-grid font-mono" role="list" aria-label="Brand vocabulary matrix">
        {tiles.map((t, i) => {
          const idx = String(i + 1).padStart(2, '0');
          return (
            <div
              key={i}
              className={`brand-cell${t.accent ? ' brand-cell--accent' : ''}`}
              role="listitem"
              title={t.note}
            >
              <span className="brand-cell__idx">{idx}</span>
              <span className="brand-cell__label">{t.label}</span>
              {t.image && (
                <img
                  className="brand-cell__apparition"
                  src={t.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT — the two live links, stacked as their own widget column. */}
      <aside className="brand-links font-mono">
        {links.map((l, i) => (
          <a
            key={i}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="brand-cell brand-cell--link"
            role="listitem"
          >
            {l.eyebrow && <span className="brand-cell__eyebrow">{l.eyebrow}</span>}
            <span className="brand-cell__label">
              <span>{l.label}</span>
              <span className="brand-cell__arrow"> {l.arrow === 'visit' ? '↗' : '→'}</span>
            </span>
          </a>
        ))}
      </aside>
    </div>
  );
};
