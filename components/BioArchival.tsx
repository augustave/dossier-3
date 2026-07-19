import React from 'react';

interface BioArchivalProps {
  /** Relative public path (Vite base './'), e.g. "bio/archival-cpo.jpg". */
  src: string;
  alt: string;
  eyebrow: string;
  caption: string;
}

/**
 * BioArchival — a flash-bulb-exposed archival print tied to the My First CPO
 * article in 01 BIOGRAPHY.
 *
 * Hover-gated: the print exists as an absolutely-positioned overlay on the
 * .bio-cpo-row (see index.css) and is exposed by the flash choreography only
 * while the article ledger is hovered or focus-within — pulling the print
 * from the file when you touch the article. Un-hover cancels the gated
 * animations (elements drop to base = the fully-exposed print) and the whole
 * figure slow-fades back into the void (the exit spec). Hover-in again
 * re-fires the flash from t=0 — the hover cycle IS the re-fire, so the
 * component itself is stateless.
 *
 * Touch / no-hover devices get the print statically, in flow (no flash).
 * All motion lives in CSS under the --bioarch-* law; the component is pure
 * structure: void backdrop (same asset, blurred+crushed — cached, no extra
 * fetch) → rotated print backs → the photo → grain → flash overlay → caption.
 */
export const BioArchival: React.FC<BioArchivalProps> = ({ src, alt, eyebrow, caption }) => (
  <figure className="bio-archival">
    <span className="bio-archival__stage">
      {/* Void — the same asset blurred + crushed dark; cached, no extra fetch. */}
      <img className="bio-archival__void" src={src} alt="" aria-hidden="true" />
      <span className="bio-archival__back bio-archival__back--1" aria-hidden="true" />
      <span className="bio-archival__back bio-archival__back--2" aria-hidden="true" />
      {/* Eager (default) + low priority: lazy inside a collapsed fold would
          race the flash snap on first hover and could expose a blank frame. */}
      <img
        className="bio-archival__img"
        src={src}
        alt={alt}
        decoding="async"
        fetchPriority="low"
      />
      <span className="bio-archival__grain" aria-hidden="true" />
      <span className="bio-archival__flash" aria-hidden="true" />
    </span>
    <figcaption className="bio-archival__caption mt-3 font-mono text-xs uppercase tracking-widest">
      <span className="block opacity-muted">{eyebrow}</span>
      <span className="block mt-1 normal-case tracking-wide opacity-tertiary">{caption}</span>
    </figcaption>
  </figure>
);
