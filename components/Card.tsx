import React from 'react';

interface CardProps {
  href: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** CTA label without the arrow — arrow glyph is chosen by `arrow`. Defaults to "Read". */
  cta?: string;
  /** "read" for in-site articles/essays, "visit" for external project/tool links. */
  arrow?: 'read' | 'visit';
  /** Optional second rail line (real value only — year, tag). Renders under KIND when present. */
  meta?: string;
  image?: { src: string; alt: string };
}

// Card — the one surface for every eyebrow + title + CTA link block (BIO
// article, AI tools, American Dynamism projects, Brand essays). Ledger split:
// a mono metadata rail (KIND on top, CTA at the foot) divided from serif
// content by a hairline, seated on a horizontal ledger rule — a filing-card /
// spec-sheet, not a bordered text box.
//
// Borderless and no fill ON PURPOSE: text is currentColor, so it inherits each
// band's own foreground (dark on cream, light on blue/clay/black) with no
// per-theme override — nothing to wash out. The two hairlines (top rule +
// vertical divider) reuse --hairline, which is already theme-aware. Roman
// serif title, not italic — italic reads "blog"; roman reads "record". No 3D,
// no color, no gloss — mass over swagger.
export const Card: React.FC<CardProps> = ({ href, eyebrow, title, subtitle, cta = 'Read', arrow = 'read', meta, image }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(event) => event.stopPropagation()}
    aria-label={subtitle ? `${title} — ${subtitle}` : title}
    className="group/card relative block w-full border-t border-[color:var(--hairline)] pt-5 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
  >
    {image && (
      <img
        src={image.src}
        alt={image.alt}
        className="mb-5 block w-full aspect-[3/2] object-cover grayscale group-hover/card:grayscale-[60%] transition-[filter] duration-[var(--card-duration)] ease-[var(--card-ease)]"
      />
    )}
    <div className="flex">
      {/* Metadata rail — stretches to the content's full height (flex align-stretch),
          so the divider runs the whole card and the CTA sits at its foot. */}
      <div className="w-16 sm:w-20 shrink-0 pr-4 border-r border-[color:var(--hairline)] flex flex-col justify-between gap-6">
        <div>
          <span className="block font-mono text-micro uppercase tracking-widest opacity-tertiary">{eyebrow}</span>
          {meta && <span className="block font-mono text-micro uppercase tracking-widest opacity-muted mt-2">{meta}</span>}
        </div>
        <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary whitespace-nowrap transition-transform duration-[var(--card-duration)] ease-[var(--card-ease)] group-hover/card:translate-x-1 group-focus-visible/card:translate-x-1">
          {cta}&nbsp;{arrow === 'visit' ? '↗' : '→'}
        </span>
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0 pl-4 sm:pl-6">
        <div className="font-serif text-xl md:text-2xl leading-tight">{title}</div>
        {subtitle && <p className="font-sans text-sm opacity-secondary leading-relaxed mt-2 max-w-md">{subtitle}</p>}
      </div>
    </div>
  </a>
);
