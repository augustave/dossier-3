import React from 'react';
import { ModuleData, ModuleType } from './types';
import { CT_DOSSIER_COPY_V120 as COPY } from './copy.v1_1';
import { VisualLanguages } from './components/VisualLanguages';
import { DoctrineLibrary } from './components/DoctrineLibrary';

export type AudienceId = 'hiring' | 'client' | 'collab' | 'acad';

export interface Audience {
  id: AudienceId;
  label: string;
  /** Recommended reading path (module indices). V3.6.1: this HIGHLIGHTS a path
      through the Index — it no longer filters/hides any module. Orientation aid,
      not a filter. Includes 00 so the path always starts at the cover. */
  modules: string[];
  /** Orientation helper line shown under the lens row when this lens is active. */
  helper: string;
}

export const AUDIENCES: Audience[] = [
  { id: 'hiring', label: 'HIRING MANAGER', modules: ['00', '03', '07', '08'],
    helper: 'Recommended path: visual language, built evidence, and biography.' },
  { id: 'client', label: 'CLIENT',         modules: ['00', '01', '03', '05', '07'],
    helper: 'Recommended path: taste, systems, doctrine, and built work.' },
  { id: 'collab', label: 'COLLABORATOR',   modules: ['00', '02', '03', '04', '06'],
    helper: 'Recommended path: lenses, registers, neighboring practices, and source texts.' },
  { id: 'acad',   label: 'ACADEMIC',       modules: ['00', '01', '04', '05', '06'],
    helper: 'Recommended path: sourcing discipline, neighborhood map, doctrine, and library.' }
];

export const COLORS = {
  blue: 'bg-strata-blue text-white border-white/20 theme-blue',
  cream: 'bg-strata-cream text-strata-black border-strata-black/20',
  black: 'bg-strata-black text-white border-white/20 theme-dark',
  clay: 'bg-strata-clay text-white border-white/20 theme-brown',
};

/**
 * Content modules for the CT Dossier — taste-led spine (V3.2).
 * Display index === narrative order (no more index/key mismatch).
 *   00 MANIFEST (overlay)  01 TASTE  02 SEEING  03 VISUAL LANGUAGES
 *   04 NEIGHBORHOOD  05 DOCTRINE  06 DOCTRINE LIBRARY  07 PORTFOLIOS  08 OPERATING BIOGRAPHY
 */
export const CONTENT_MODULES: ModuleData[] = [
  // 00 FRONT MATTER — the dossier cover. Folded by default; opening teaches the
  // interaction grammar. responseDisplay is injected dynamically in App.tsx
  // (it carries audience-lens state). Null here is safe — ManifestOverlay only
  // reads index/title; ModuleStrata receives the real ReactNode at render time.
  {
    id: ModuleType.FRONT_MATTER,
    index: "00",
    title: "FRONT MATTER",
    promptText: "PRACTICE FRONT MATTER",
    themeColor: 'cream',
    responseText: "Taste is not preference. Taste is a sourcing discipline.",
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

  // 01 — TASTE. Aesthetic authority first. Editorial, museum-catalogue energy.
  {
    id: ModuleType.TASTE,
    index: "01",
    title: COPY.modules.taste.title,
    promptText: COPY.modules.taste.prompt,
    themeColor: 'cream',
    responseText: COPY.modules.taste.hero,
    responseDisplay: (
      <div className="space-y-8">
        <div className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.taste.hero}
        </div>
        <div className="font-sans text-lg md:text-xl max-w-2xl opacity-secondary leading-relaxed">
          {COPY.modules.taste.body.split('\n\n').map((para, i) => (
            <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
          ))}
        </div>

        <div className="space-y-3 border-t border-current/20 pt-6">
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted">{COPY.modules.taste.beliefsTitle}</h4>
          <ul className="space-y-2">
            {COPY.modules.taste.beliefs.map((b, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="font-mono text-xs opacity-muted pt-1">&bull;</span>
                <span className="font-sans text-base md:text-lg opacity-secondary leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-current/20 pt-6">
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-2">{COPY.modules.taste.fieldNoteTitle}</h4>
          <p className="font-serif text-xl md:text-2xl italic opacity-tertiary leading-relaxed max-w-2xl">
            {COPY.modules.taste.fieldNote}
          </p>
        </div>
      </div>
    ),
  },

  // 02 — SEEING. The cognitive lenses (was WORLD MODEL). Reflective.
  {
    id: ModuleType.SEEING,
    index: "02",
    title: COPY.modules.seeing.title,
    promptText: COPY.modules.seeing.prompt,
    themeColor: 'clay',
    responseText: COPY.modules.seeing.hero,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.seeing.hero}
        </p>
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">
          {COPY.modules.seeing.intro}
        </p>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">{COPY.modules.seeing.lensesTitle}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COPY.modules.seeing.lenses.map((l, idx) => (
              <div key={idx} className="p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity">
                <div className="flex items-baseline justify-between mb-3 gap-3">
                  <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">LENS {l.code}</span>
                  <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">{l.title}</span>
                </div>
                <h4 className="font-serif text-xl md:text-2xl italic mb-2">{l.person}</h4>
                <p className="font-mono text-xs uppercase tracking-wide opacity-muted mb-3">{l.question}</p>
                <p className="font-sans text-sm opacity-secondary leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-current/20 pt-6">
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-3">{COPY.modules.seeing.shortTitle}</h4>
          <p className="font-serif text-xl md:text-2xl leading-relaxed">{COPY.modules.seeing.short}</p>
        </div>
      </div>
    ),
  },

  // 03 — VISUAL LANGUAGES (V3.2). Authored visual operating languages are the
  // centerpiece; the registers are demoted to grammar tags beneath them.
  {
    id: ModuleType.VISUAL_LANGUAGES,
    index: "03",
    title: COPY.modules.visualLanguages.title,
    promptText: COPY.modules.visualLanguages.prompt,
    themeColor: 'black',
    responseText: COPY.modules.visualLanguages.hero,
    responseDisplay: (
      <div className="space-y-8">
        <div className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.visualLanguages.hero}
        </div>
        <div className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-2xl">
          {COPY.modules.visualLanguages.body.split('\n\n').map((para, i) => (
            <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
          ))}
        </div>

        <div className="pt-4 border-t border-white/20">
          <VisualLanguages
            languages={COPY.modules.visualLanguages.languages}
            registers={COPY.modules.visualLanguages.registers}
            grammarTitle={COPY.modules.visualLanguages.registersGrammarTitle}
            grammarIntro={COPY.modules.visualLanguages.registersGrammarIntro}
          />
        </div>
      </div>
    ),
  },

  // 04 — THE NEIGHBORHOOD. Adjacent practices. Holds the old field-position
  // chart unchanged (visualization locked; only the framing softened from
  // "where I sit vs peers" to "a map of neighboring practices").
  {
    id: ModuleType.NEIGHBORHOOD,
    index: "04",
    title: COPY.modules.neighborhood.title,
    promptText: COPY.modules.neighborhood.prompt,
    themeColor: 'blue',
    responseText: COPY.modules.neighborhood.hero,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed">
          {COPY.modules.neighborhood.hero}
        </p>
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">
          {COPY.modules.neighborhood.intro}
        </p>

        <div className="pleat-chart mt-4 pt-8 border-t border-white/20">
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-3">
            {COPY.modules.neighborhood.chartTitle}
          </h4>

          <div className="bg-black/20 p-4 md:p-6 border border-white/10">
            <svg
              viewBox="0 0 680 580"
              className="w-full h-auto"
              role="img"
              aria-label="A map of neighboring practices. Fourteen adjacent practices plotted across craft-native to AI-native horizontally and ephemeral to durable vertically. Ven sits alone in the durable, AI-native corner, labeled doctrine-led AI."
              style={{ color: 'currentColor' }}
            >
              {/* Owned-zone wash — scoped to VEN's pocket in the deep
                  durable/AI-native corner. Locked visualization. */}
              <rect x="420" y="360" width="180" height="140" fill="#E5FF00" opacity="0.07"/>
              <rect x="420" y="360" width="180" height="140" fill="none" stroke="#E5FF00" strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 3"/>
              {/* Plot border */}
              <rect x="80" y="60" width="520" height="440" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2 2"/>
              {/* Axis cross */}
              <line x1="80" y1="280" x2="600" y2="280" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.5"/>
              <line x1="340" y1="60" x2="340" y2="500" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.5"/>

              {/* Quadrant labels — name work-modes, not the plotted practices. */}
              <text x="92" y="80" fontSize="10" letterSpacing="1.5" fill="currentColor" opacity="0.3" fontFamily="ui-monospace, monospace">{COPY.modules.neighborhood.fieldPositionQuadrants.tl}</text>
              <text x="588" y="80" textAnchor="end" fontSize="10" letterSpacing="1.5" fill="currentColor" opacity="0.3" fontFamily="ui-monospace, monospace">{COPY.modules.neighborhood.fieldPositionQuadrants.tr}</text>
              <text x="92" y="490" fontSize="10" letterSpacing="1.5" fill="currentColor" opacity="0.3" fontFamily="ui-monospace, monospace">{COPY.modules.neighborhood.fieldPositionQuadrants.bl}</text>
              <text x="588" y="490" textAnchor="end" fontSize="10" letterSpacing="1.5" fill="#E5FF00" opacity="0.85" fontFamily="ui-monospace, monospace">{COPY.modules.neighborhood.fieldPositionQuadrants.br}</text>

              {/* Axis labels */}
              <text x="80" y="46" textAnchor="start" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace">{COPY.modules.neighborhood.fieldPositionAxes.xLeft}</text>
              <text x="600" y="46" textAnchor="end" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace">{COPY.modules.neighborhood.fieldPositionAxes.xRight}</text>
              <text x="65" y="60" textAnchor="end" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace" transform="rotate(-90, 65, 60)">{COPY.modules.neighborhood.fieldPositionAxes.yTop}</text>
              <text x="65" y="500" textAnchor="start" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace" transform="rotate(-90, 65, 500)">{COPY.modules.neighborhood.fieldPositionAxes.yBottom}</text>

              {/* Adjacent-practice dots */}
              {COPY.modules.neighborhood.fieldPositionDesigners.map((d, i) => {
                const cx = 80 + (d.x / 100) * 520;
                const cy = 60 + (d.y / 100) * 440;
                return (
                  <g key={i} opacity="0.7">
                    <circle cx={cx} cy={cy} r="3" fill="currentColor"/>
                    <text x={cx + 8} y={cy + 3} fontSize="10" fill="currentColor" fontFamily="ui-monospace, monospace">{d.name}</text>
                  </g>
                );
              })}

              {/* Ven dot (highlighted, lime accent) */}
              {(() => {
                const v = COPY.modules.neighborhood.fieldPositionVen;
                const cx = 80 + (v.x / 100) * 520;
                const cy = 60 + (v.y / 100) * 440;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r="11" fill="none" stroke="#E5FF00" strokeWidth="0.5" strokeDasharray="2 1.5"/>
                    <circle cx={cx} cy={cy} r="7" fill="#E5FF00"/>
                    <text x={cx + 14} y={cy - 2} fontSize="11" fontWeight="500" fill="#E5FF00" fontFamily="ui-monospace, monospace">{v.label}</text>
                    <text x={cx + 14} y={cy + 11} fontSize="9" letterSpacing="1" fill="#E5FF00" opacity="0.8" fontFamily="ui-monospace, monospace">{v.sub}</text>
                  </g>
                );
              })()}

              {/* Legend strip */}
              <g transform="translate(80, 545)">
                <circle cx="5" cy="5" r="3" fill="currentColor" opacity="0.7"/>
                <text x="14" y="9" fontSize="10" fill="currentColor" opacity="0.7" fontFamily="ui-monospace, monospace">{COPY.modules.neighborhood.fieldPositionLegendPeers}</text>
                <circle cx="165" cy="5" r="5" fill="#E5FF00"/>
                <text x="176" y="9" fontSize="10" fill="#E5FF00" fontFamily="ui-monospace, monospace">VEN</text>
              </g>
            </svg>
          </div>

          <p className="font-mono text-xs uppercase tracking-wide opacity-muted mt-4">
            {COPY.modules.neighborhood.chartCaption}
          </p>
        </div>
      </div>
    ),
  },

  // 05 — DOCTRINE (V3.2, was PRACTICE). What the work obeys and refuses.
  // Direction → Form → Trust.
  {
    id: ModuleType.DOCTRINE,
    index: "05",
    title: COPY.modules.doctrine.title,
    promptText: COPY.modules.doctrine.prompt,
    themeColor: 'cream',
    responseText: COPY.modules.doctrine.hero,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.doctrine.hero}
        </p>
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">
          {COPY.modules.doctrine.intro}
        </p>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">{COPY.modules.doctrine.layersTitle}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COPY.modules.doctrine.layers.map((l, idx) => (
              <div key={idx} className="p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity">
                <div className="flex items-baseline justify-between mb-3 gap-3">
                  <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">{l.code}</span>
                  <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">{l.title}</span>
                </div>
                <p className="font-sans text-sm md:text-base opacity-secondary leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-current/20 pt-6">
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted">{COPY.modules.doctrine.rulesTitle}</h4>
          <ul className="space-y-2">
            {COPY.modules.doctrine.rules.map((b, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="font-mono text-xs opacity-muted pt-1">&bull;</span>
                <span className="font-sans text-base md:text-lg opacity-secondary leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-sans text-base md:text-lg opacity-secondary leading-relaxed border-t border-current/10 pt-4">
          {COPY.modules.doctrine.handoff}
        </p>

        <p className="font-serif text-lg md:text-xl italic opacity-tertiary">
          {COPY.modules.doctrine.short}
        </p>
      </div>
    ),
  },

  // 06 — DOCTRINE LIBRARY (V3.3). The shelf of written source texts.
  {
    id: ModuleType.DOCTRINE_LIBRARY,
    index: "06",
    title: COPY.modules.doctrineLibrary.title,
    promptText: COPY.modules.doctrineLibrary.prompt,
    themeColor: 'black',
    responseText: COPY.modules.doctrineLibrary.hero,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.doctrineLibrary.hero}
        </p>
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">
          {COPY.modules.doctrineLibrary.intro}
        </p>
        <p className="font-serif italic text-lg md:text-xl opacity-tertiary leading-relaxed max-w-3xl">
          {COPY.modules.doctrineLibrary.shelfLogic}
        </p>

        <div className="pt-4 border-t border-white/20">
          <DoctrineLibrary
            cards={COPY.modules.doctrineLibrary.cards}
            allLabel={COPY.modules.doctrineLibrary.filterAllLabel}
            pendingNote={COPY.modules.doctrineLibrary.pendingNote}
          />
        </div>
      </div>
    ),
  },

  // 07 — PORTFOLIOS. Where the built work lives. Taste-first order.
  {
    id: ModuleType.PORTFOLIOS,
    index: "07",
    title: COPY.modules.portfolios.title,
    promptText: COPY.modules.portfolios.prompt,
    themeColor: 'clay',
    responseText: COPY.modules.portfolios.hero,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed">
          {COPY.modules.portfolios.hero}
        </p>
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">
          {COPY.modules.portfolios.intro}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COPY.modules.portfolios.portfolioSites.map((site, idx) => (
            <a
              key={idx}
              href={`https://${site.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity group/site"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">{site.register}</div>
              <div className="font-mono text-lg md:text-xl tracking-tight mb-3 group-hover/site:underline">{site.domain}</div>
              <p className="font-sans text-sm opacity-secondary leading-relaxed">{site.frame}</p>
            </a>
          ))}
        </div>

        {COPY.modules.portfolios.outcomeLine && (
          <p className="font-serif italic text-lg md:text-xl opacity-tertiary border-t border-current/20 pt-6 max-w-3xl">
            {COPY.modules.portfolios.outcomeLine}
          </p>
        )}
      </div>
    ),
  },

  // 08 — OPERATING BIOGRAPHY (V3.5.1, replaced Engagement Models). Text-led,
  // first person — the human root of the practice. No cards.
  {
    id: ModuleType.BIOGRAPHY,
    index: "08",
    title: COPY.modules.biography.title,
    promptText: COPY.modules.biography.prompt,
    themeColor: 'black',
    responseText: COPY.modules.biography.opening,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed max-w-3xl">
          {COPY.modules.biography.opening}
        </p>
        <div className="font-sans text-base md:text-lg opacity-secondary leading-relaxed max-w-[820px] space-y-4">
          {COPY.modules.biography.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <p className="font-serif text-lg md:text-2xl italic opacity-secondary border-t border-white/10 pt-6 max-w-3xl">
          {COPY.modules.biography.close}
        </p>
      </div>
    ),
  },
];

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
