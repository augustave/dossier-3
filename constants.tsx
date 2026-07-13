import React from 'react';
import { ModuleData, ModuleType } from './types';
import { CT_DOSSIER_COPY_V120 as COPY } from './copy.v1_1';
import { Card } from './components/Card';
import { DynamismPlates } from './components/DynamismPlates';
import { FerrisInfluences } from './components/FerrisInfluences';
import { NeighborPracticesMap } from './components/NeighborPracticesMap';

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

        <div className="max-w-2xl">
          <Card
            href={COPY.modules.bio.article.href}
            eyebrow={COPY.modules.bio.article.eyebrow}
            title={COPY.modules.bio.article.title}
            subtitle={COPY.modules.bio.article.subtitle}
          />
        </div>

        {/* "Where Do I Fall" — the neighborhood map. Chart geometry locked. */}
        <div className="pleat-chart mt-4 pt-8 border-t border-white/20">
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">
            {COPY.modules.bio.chartTitle}
          </h4>

          <NeighborPracticesMap />

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
    // A leading pull-quote over the FERRIS "Index of Influences" astrolabe
    // (self-contained iframe widget, see FerrisInfluences). Two rows now, so the
    // band pleats normally — safe: the iframe has no inner pleats to double-rotate.
    responseDisplay: (
      <div className="space-y-10">
        <blockquote className="font-serif text-2xl md:text-4xl leading-tight max-w-3xl">
          &ldquo;{COPY.modules.influences.quote}&rdquo;
        </blockquote>
        <FerrisInfluences />
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
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">
          {COPY.modules.ai.statementBody}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          {COPY.modules.ai.links.map((l, i) => (
            <Card key={i} href={l.href} eyebrow={l.register} title={l.name} subtitle={l.frame} arrow="visit" />
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
        <ul className="font-serif text-2xl md:text-3xl leading-tight space-y-1 max-w-3xl">
          {COPY.modules.americanDynamism.pillars.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COPY.modules.americanDynamism.links.map((l, i) => (
            <Card key={i} href={l.href} eyebrow={l.register} title={l.name} arrow="visit" />
          ))}
        </div>

        {/* Doctrine Plates — appended micro-interaction; band above unchanged. */}
        <DynamismPlates />
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
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">
          {COPY.modules.brand.sub}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COPY.modules.brand.essays.map((e, i) => (
            <Card key={i} href={resolveHref(e.href)} eyebrow="Essay" title={e.title} subtitle={e.subtitle} cta={e.ctaLabel} />
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
