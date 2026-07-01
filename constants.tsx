import React from 'react';
import { ModuleData, ModuleType } from './types';
import { CT_DOSSIER_COPY_V120 as COPY } from './copy.v1_1';

export type AudienceId = 'hiring' | 'client' | 'collab' | 'acad';

export interface Audience {
  id: AudienceId;
  label: string;
  modules: string[];
  helper: string;
}

// V4.0.0 swap: the reading-route / audience-lens system was retired with the
// old spine (it indexed the old fold numbers and is not in the PRD). The types
// and empty exports remain so App.tsx / CreaseMap compile unchanged; the
// CreaseMap now renders only the thesis frame.
export const AUDIENCES: Audience[] = [];

export type RouteValue = AudienceId | 'full';

export interface RouteBand {
  value: RouteValue;
  label: string;
  prefix: 'MOUNTAIN' | 'VALLEY' | 'FLAT SHEET';
  path: string;
  tag?: string;
  time: string;
  helper: string;
  bestIf: string;
  modules: string[];
}

export const ROUTES: RouteBand[] = [];

export const isRouteValue = (s: string | null): s is RouteValue =>
  s !== null && ROUTES.some((r) => r.value === s);

export const COLORS = {
  blue: 'bg-strata-blue text-white border-white/20 theme-blue',
  cream: 'bg-strata-cream text-strata-black border-strata-black/20',
  black: 'bg-strata-black text-white border-white/20 theme-dark',
  clay: 'bg-strata-clay text-white border-white/20 theme-brown',
};

// Resolve a copy href: absolute http(s) untouched; a relative library path is
// prefixed with the Vite base so it resolves on both the root and any subpath.
const resolveHref = (href: string) =>
  href.startsWith('http') ? href : `${import.meta.env.BASE_URL}${href}`;

/**
 * Content modules — V4.0.0 PRD "site swap" spine. Display index === render order.
 *   00 FRONT MATTER (cover)  01 BIO  02 INFLUENCES  03 AI
 *   04 AMERICAN DYNAMISM  05 BRAND       (MANIFEST = index overlay, not rendered inline)
 */
export const CONTENT_MODULES: ModuleData[] = [
  // 00 FRONT MATTER — the cover. responseDisplay is injected in App.tsx
  // (FrontMatterContent). ManifestOverlay only reads index/title.
  {
    id: ModuleType.FRONT_MATTER,
    index: "00",
    title: "FRONT MATTER",
    promptText: "PRACTICE FRONT MATTER",
    themeColor: 'cream',
    responseText: "Different disciplines, one obsession. The brain is the product.",
    responseDisplay: null,
  },

  {
    id: ModuleType.MANIFEST,
    index: "00",
    title: "MANIFEST",
    promptText: "NAVIGATION INDEX",
    themeColor: 'cream',
    responseText: "Select a stratum to jump to its coordinates.",
    responseDisplay: "Select a stratum to jump to its coordinates.",
  },

  // 01 — BIO. The human root + the neighborhood map + the My First CPO article.
  // Blue theme keeps the map's native identity (lime owned-zone on a dark field).
  {
    id: ModuleType.BIO,
    index: "01",
    title: COPY.modules.bio.title,
    promptText: COPY.modules.bio.prompt,
    themeColor: 'blue',
    responseText: COPY.modules.bio.opening,
    responseDisplay: (
      <div className="space-y-8">
        <div className="font-mono text-xs uppercase tracking-[0.25em] opacity-muted">
          {COPY.modules.bio.name}
        </div>
        <p className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.bio.opening}
        </p>
        <div className="font-sans text-base md:text-lg opacity-secondary leading-relaxed max-w-[820px] space-y-4">
          {COPY.modules.bio.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <p className="font-serif text-lg md:text-2xl italic opacity-secondary border-t border-white/10 pt-6 max-w-3xl">
          {COPY.modules.bio.close}
        </p>

        {/* My First CPO — the BIO article */}
        <a
          href={COPY.modules.bio.article.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="block p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity group/article max-w-2xl"
        >
          <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">{COPY.modules.bio.article.eyebrow}</div>
          <div className="font-serif text-xl md:text-2xl italic mb-1 group-hover/article:underline">{COPY.modules.bio.article.title}</div>
          <p className="font-sans text-sm opacity-secondary leading-relaxed">{COPY.modules.bio.article.subtitle}</p>
        </a>

        {/* "Where Do I Fall" — the neighborhood map. Chart geometry locked. */}
        <div className="pleat-chart mt-4 pt-8 border-t border-white/20">
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-3">
            {COPY.modules.bio.chartTitle}
          </h4>
          <p className="font-sans text-sm opacity-secondary leading-relaxed mb-4 max-w-xl">
            {COPY.modules.bio.chartFraming}
          </p>

          <div className="bg-black/20 p-4 md:p-6 border border-white/10">
            <svg
              viewBox="0 0 680 580"
              className="w-full h-auto"
              role="img"
              aria-label="A map of neighboring practices. Fourteen adjacent practices plotted across craft-native to AI-native horizontally and ephemeral to durable vertically. This practice (ME) sits alone in the durable, AI-native corner, labeled doctrine-led AI."
              style={{ color: 'currentColor' }}
            >
              {/* Owned-zone wash — this practice's pocket in the durable/AI-native corner. */}
              <rect x="420" y="360" width="180" height="140" fill="#E5FF00" opacity="0.07"/>
              <rect x="420" y="360" width="180" height="140" fill="none" stroke="#E5FF00" strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 3"/>
              {/* Plot border */}
              <rect x="80" y="60" width="520" height="440" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2 2"/>
              {/* Axis cross */}
              <line x1="80" y1="280" x2="600" y2="280" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.5"/>
              <line x1="340" y1="60" x2="340" y2="500" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.5"/>

              {/* Quadrant labels — name work-modes, not the plotted practices. */}
              <text x="92" y="80" fontSize="10" letterSpacing="1.5" fill="currentColor" opacity="0.3" fontFamily="ui-monospace, monospace">{COPY.modules.bio.fieldPositionQuadrants.tl}</text>
              <text x="588" y="80" textAnchor="end" fontSize="10" letterSpacing="1.5" fill="currentColor" opacity="0.3" fontFamily="ui-monospace, monospace">{COPY.modules.bio.fieldPositionQuadrants.tr}</text>
              <text x="92" y="490" fontSize="10" letterSpacing="1.5" fill="currentColor" opacity="0.3" fontFamily="ui-monospace, monospace">{COPY.modules.bio.fieldPositionQuadrants.bl}</text>
              <text x="588" y="490" textAnchor="end" fontSize="10" letterSpacing="1.5" fill="#E5FF00" opacity="0.85" fontFamily="ui-monospace, monospace">{COPY.modules.bio.fieldPositionQuadrants.br}</text>

              {/* Axis labels */}
              <text x="80" y="46" textAnchor="start" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace">{COPY.modules.bio.fieldPositionAxes.xLeft}</text>
              <text x="600" y="46" textAnchor="end" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace">{COPY.modules.bio.fieldPositionAxes.xRight}</text>
              <text x="65" y="60" textAnchor="end" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace" transform="rotate(-90, 65, 60)">{COPY.modules.bio.fieldPositionAxes.yTop}</text>
              <text x="65" y="500" textAnchor="start" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace" transform="rotate(-90, 65, 500)">{COPY.modules.bio.fieldPositionAxes.yBottom}</text>

              {/* Adjacent-practice dots */}
              {COPY.modules.bio.fieldPositionDesigners.map((d, i) => {
                const cx = 80 + (d.x / 100) * 520;
                const cy = 60 + (d.y / 100) * 440;
                return (
                  <g key={i} opacity="0.7">
                    <circle cx={cx} cy={cy} r="3" fill="currentColor"/>
                    <text x={cx + 8} y={cy + 3} fontSize="10" fill="currentColor" fontFamily="ui-monospace, monospace">{d.name}</text>
                  </g>
                );
              })}

              {/* ME dot (highlighted, lime accent) */}
              {(() => {
                const v = COPY.modules.bio.fieldPositionVen;
                const cx = 80 + (v.x / 100) * 520;
                const cy = 60 + (v.y / 100) * 440;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r="11" fill="none" stroke="#E5FF00" strokeWidth="0.5" strokeDasharray="2 1.5"/>
                    <circle cx={cx} cy={cy} r="7" fill="#E5FF00"/>
                    <text x={cx + 14} y={cy + 3} fontSize="11" fontWeight="500" fill="#E5FF00" fontFamily="ui-monospace, monospace">{v.label}</text>
                  </g>
                );
              })()}

              {/* Legend strip */}
              <g transform="translate(80, 545)">
                <circle cx="5" cy="5" r="3" fill="currentColor" opacity="0.7"/>
                <text x="14" y="9" fontSize="10" fill="currentColor" opacity="0.7" fontFamily="ui-monospace, monospace">{COPY.modules.bio.fieldPositionLegendPeers}</text>
                <circle cx="165" cy="5" r="5" fill="#E5FF00"/>
                <text x="176" y="9" fontSize="10" fill="#E5FF00" fontFamily="ui-monospace, monospace">ME</text>
              </g>
            </svg>
          </div>

          <p className="font-mono text-xs uppercase tracking-wide opacity-muted mt-4">
            {COPY.modules.bio.chartCaption}
          </p>
        </div>
      </div>
    ),
  },

  // 02 — INFLUENCES. The curated constellation.
  {
    id: ModuleType.INFLUENCES,
    index: "02",
    title: COPY.modules.influences.title,
    promptText: COPY.modules.influences.prompt,
    themeColor: 'cream',
    responseText: COPY.modules.influences.hero,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.influences.hero}
        </p>
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">
          {COPY.modules.influences.intro}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 border-t border-current/20 pt-6">
          {COPY.modules.influences.people.map((p, i) => (
            <div key={i} className="flex items-baseline gap-3">
              <span className="font-mono text-micro opacity-tertiary pt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="font-serif text-xl md:text-2xl italic">{p.name}</div>
                <div className="font-sans text-sm opacity-secondary leading-relaxed">{p.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 03 — AI. Statement + the Five Axioms + the AI essays.
  {
    id: ModuleType.AI,
    index: "03",
    title: COPY.modules.ai.title,
    promptText: COPY.modules.ai.prompt,
    themeColor: 'black',
    responseText: COPY.modules.ai.statement,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.ai.statement}
        </p>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-1">{COPY.modules.ai.axiomsTitle}</h4>
          <p className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-4">{COPY.modules.ai.axiomsCountLabel} axioms</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COPY.modules.ai.axioms.map((a, i) => (
              <div key={i} className="p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-lg tracking-widest opacity-tertiary">{a.numeral}</span>
                  <span className="font-serif text-xl md:text-2xl italic">{a.title}</span>
                </div>
                <p className="font-mono text-xs uppercase tracking-wide opacity-muted">{a.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/20 pt-6">
          {COPY.modules.ai.links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="block p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity group/link"
            >
              <div className="font-mono text-lg md:text-xl tracking-tight mb-2 group-hover/link:underline">{l.name}</div>
              <p className="font-sans text-sm opacity-secondary leading-relaxed">{l.frame}</p>
            </a>
          ))}
        </div>
      </div>
    ),
  },

  // 04 — AMERICAN DYNAMISM. The defense center.
  {
    id: ModuleType.AMERICAN_DYNAMISM,
    index: "04",
    title: COPY.modules.americanDynamism.title,
    promptText: COPY.modules.americanDynamism.prompt,
    themeColor: 'clay',
    responseText: COPY.modules.americanDynamism.hero,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.americanDynamism.hero}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COPY.modules.americanDynamism.links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="block p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity group/link"
            >
              <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">{l.register}</div>
              <div className="font-serif text-xl md:text-2xl italic group-hover/link:underline">{l.name}</div>
            </a>
          ))}
        </div>
      </div>
    ),
  },

  // 05 — BRAND. Two essays (outbound URLs pending; local PDFs as placeholders).
  {
    id: ModuleType.BRAND,
    index: "05",
    title: COPY.modules.brand.title,
    promptText: COPY.modules.brand.prompt,
    themeColor: 'black',
    responseText: COPY.modules.brand.hero,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.brand.hero}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COPY.modules.brand.essays.map((e, i) => (
            <a
              key={i}
              href={resolveHref(e.href)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="block p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity group/essay"
            >
              <div className="font-serif text-xl md:text-2xl italic mb-1 group-hover/essay:underline">{e.title}</div>
              <p className="font-sans text-sm opacity-secondary leading-relaxed mb-3">{e.subtitle}</p>
              <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">{e.ctaLabel} -&gt;</span>
            </a>
          ))}
        </div>
      </div>
    ),
  },
];

// Retained for InquiryPanel (not part of the swap spine; kept for its component
// + tests). Not rendered in the main App surface.
export const INQUIRY_OPTIONS = {
  assess: [
    "Taste & Direction",
    "Systems Thinking",
    "Prototype Process",
    "Visual Language Range",
    "Mission / Domain Context"
  ],
  challenge: [
    "Project Scope",
    "Technical Fluency",
    "Collaboration Style",
    "Engagement Fit",
    "Portfolio Walkthrough"
  ]
};

export const INQUIRY_QUESTIONS: Record<string, string[]> = {
  "Taste & Direction": [
    "Where does your visual direction come from, and how do you keep it from drifting into trend?",
    "How do you decide which historical or cultural references actually earn their place in the work?",
    "What makes a system feel coherent to you rather than just consistent?",
    "How do you keep a strong point of view without making every project look the same?"
  ],
  "Systems Thinking": [
    "How do you move from a complex system to a legible interface without oversimplifying it?",
    "What constraints usually shape your design decisions first: operator cognition, technical reality, or stakeholder communication?",
    "How do you decide what must stay visible versus what can remain implicit?",
    "What makes a system feel trustworthy to you?"
  ],
  "Prototype Process": [
    "When do you stay in static design versus move into a working prototype?",
    "What do you prototype first: flow, hierarchy, motion, or proof of technical credibility?",
    "How do you use front-end implementation to de-risk product ideas?",
    "What makes a prototype successful for you?"
  ],
  "Visual Language Range": [
    "How do you keep a strong point of view without making every project look the same?",
    "What parts of the visual system are fixed and what parts shift per domain?",
    "How do brand, interface, and motion stay coherent in your work?",
    "Where do you deliberately reject generic tech aesthetics?"
  ],
  "Mission / Domain Context": [
    "Why do defense, autonomy, geospatial, or high-assurance systems hold your attention?",
    "How do you avoid turning consequential domains into empty spectacle?",
    "What have these mission-oriented projects taught you about trust and legibility?",
    "How do you adapt your output for procurement, stakeholders, and operators at the same time?"
  ],
  "Project Scope": [
    "What do you own end to end on a typical project, and where do you want deeper collaboration?",
    "Which parts of the workflow do you prefer to keep in-house rather than hand off early?",
    "What project shapes are the best fit for your skill mix?"
  ],
  "Technical Fluency": [
    "How deep into implementation do you usually go when building prototypes?",
    "What tools or stacks are central to the way you work today?",
    "How do you collaborate with engineering without losing the quality of the concept?",
    "How do you keep a design's intent intact once it meets real engineering constraints?"
  ],
  "Collaboration Style": [
    "How do you work with product, engineering, and marketing when the brief is still ambiguous?",
    "What kind of feedback helps you sharpen the work fastest?",
    "What conditions produce your best work on a team?",
    "How do you keep what operators need to hear and what reviewers need to see in the same artifact?"
  ],
  "Engagement Fit": [
    "What kind of situation is the best moment to bring you in?",
    "Where can you accelerate a team immediately without a long onboarding runway?",
    "What does a strong first month of work look like for you?"
  ],
  "Portfolio Walkthrough": [
    "Which two projects should someone review first to understand the full range?",
    "How do the projects connect instead of reading like separate experiments?",
    "If you had 10 minutes, which artifacts would you walk through and why?"
  ]
};
