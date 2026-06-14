import React from 'react';
import { ModuleData, ModuleType } from './types';
import { CT_DOSSIER_COPY_V120 as COPY } from './copy.v1_1';
import { CollapsibleDrawer } from './components/CollapsibleDrawer';
import { AnimatedGrid } from './components/AnimatedGrid';
import { DoctrineExplorer } from './components/DoctrineExplorer';

export const COLORS = {
  blue: 'bg-strata-blue text-white border-white/20 theme-blue',
  cream: 'bg-strata-cream text-strata-black border-strata-black/20',
  black: 'bg-strata-black text-white border-white/20 theme-dark',
  clay: 'bg-strata-clay text-white border-white/20 theme-brown',
};

export const RECRUIT_CARDS = [
  {
    name: "Visual Systems",
    role: "Design Language",
    capability: "Builds one consistent look across interface, brand, and docs.",
    signal: "Strong systems thinking for technical products.",
    desc: "Turns scattered pieces into one product that agrees with itself, instead of a pile of screens that look related."
  },
  {
    name: "Interactive Prototypes",
    role: "Product Proof",
    capability: "Makes a concept believable by making it work.",
    signal: "Goes from idea to working prototype fast.",
    desc: "Builds in real code so a team can feel the flow and the trust before anyone commits to polish."
  },
  {
    name: "Technical Narratives",
    role: "Systems Translation",
    capability: "Explains dense systems without dumbing them down.",
    signal: "Useful when engineering, product, and hiring all need the same story.",
    desc: "Turns mission-heavy, hard-to-follow work into something people can actually evaluate and decide on."
  }
];

const SELECTED_SYSTEMS_EVIDENCE = [
  {
    title: "GREY-EARTH / Live Deployment",
    description: "Deployed tactical terrain workstation showing real product execution, not just concept framing.",
    link: "https://grey-earth.vercel.app",
    linkLabel: "Open Live System"
  },
  {
    title: "GREY-EARTH / Source",
    description: "Next.js terrain workstation repo with manifest-first rendering, 2D/3D map logic, and Earth Engine integration.",
    link: "https://github.com/augustave/GREY-EARTH",
    linkLabel: "Open GitHub Repo"
  },
  {
    title: "DEADLIGHT / Source",
    description: "Public brand-system repo representing the visual governance layer behind the portfolio.",
    link: "https://github.com/augustave/deadlight",
    linkLabel: "Open GitHub Repo"
  },
  {
    title: "TACTICAL CANVAS / Source",
    description: "Mission-thread interface prototype focused on tactical workflow clarity and systems UI.",
    link: "https://github.com/augustave/TACTICAL-CANVAS",
    linkLabel: "Open GitHub Repo"
  },
  {
    title: "MINI-D / Source",
    description: "Autonomy-lab proof artifact oriented around evaluation, limits, and inspectable behavior.",
    link: "https://github.com/augustave/MINI-D",
    linkLabel: "Open GitHub Repo"
  },
  {
    title: "CCRT / Source",
    description: "Human-factors and high-assurance interface direction for warfighter-centered command environments.",
    link: "https://github.com/augustave/CCRT",
    linkLabel: "Open GitHub Repo"
  },
  {
    title: "TAK-G / Source",
    description: "Theater-level C2 simulator with 1,500+ track rendering, swarm kinematics, EMCON decay, and zero-trust SIGINT ghost tracks.",
    link: "https://github.com/augustave/TAK-FLOW",
    linkLabel: "Open GitHub Repo"
  }
];

/**
 * Content modules for the CT Dossier.
 * Display indices intentionally differ from copy keys to preserve the current shell.
 */
export const CONTENT_MODULES: ModuleData[] = [
  {
    id: ModuleType.MANIFEST,
    index: "00",
    title: "MANIFEST",
    promptText: "NAVIGATION INDEX",
    themeColor: 'cream',
    responseText: "Select a stratum to jump to its coordinates.",
    responseDisplay: "Select a stratum to jump to its coordinates.",
  },
  {
    id: ModuleType.THESIS,
    index: "02",
    title: COPY.modules["01"].title,
    promptText: COPY.modules["01"].prompt,
    themeColor: 'blue',
    responseText: COPY.modules["01"].hero,
    responseDisplay: (
      <div className="space-y-8">
        <div className="font-mono text-sm leading-relaxed opacity-tertiary border-l-2 border-white/30 pl-4">
          FILE: {COPY.meta.version}<br/>
          MODE: {COPY.modules["01"].noteLines[0]} / {COPY.modules["01"].noteLines[1]}<br/>
          NO API. NO PORTFOLIO THEATER.
        </div>
        <div className="font-serif text-2xl md:text-4xl leading-relaxed">
          {COPY.modules["01"].hero}
        </div>
        {/* Thesis kicker — IAA integration 4.2 (A), owner-approved + war-gamed
            2026-06-07. Claim sits directly above the chart that supplies its
            coordinate. Used once on the surface. See PRD-IAA-INTEGRATION.md. */}
        <div className="font-mono text-sm uppercase tracking-widest opacity-secondary -mt-4">
          {COPY.modules["01"].heroKicker}
        </div>
        <div className="font-sans text-lg md:text-xl max-w-2xl opacity-secondary leading-relaxed">
          {COPY.modules["01"].body.split('\n\n').map((para, i) => (
            <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
          ))}
        </div>

        {/* Field position chart — Doc 2 axes, war-gamed placement.
            Sits at the end of Module 02 so a recruiter who filters
            to the Hiring Manager audience sees the polymath claim
            as a coordinate, not a sentence. See PRD-FIELD-POSITION.md. */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-3">
            {COPY.modules["01"].fieldPositionTitle}
          </h4>
          <p className="font-serif text-xl md:text-2xl leading-relaxed mb-6 max-w-2xl">
            {COPY.modules["01"].fieldPositionAbove}
          </p>

          <div className="bg-black/20 p-4 md:p-6 border border-white/10">
            <svg
              viewBox="0 0 680 580"
              className="w-full h-auto"
              role="img"
              aria-label="Field position chart. Fourteen peer designers plotted across craft-native to AI-native horizontally and ephemeral to durable vertically. Ven sits alone in the durable AI-native quadrant, labeled doctrine-led AI."
              style={{ color: 'currentColor' }}
            >
              {/* Owned-zone wash — PRD-FIELD-POSITION v1.1 (tightened per
                  visual QA 2026-06-07). Scoped to VEN's pocket in the deep
                  durable/AI-native corner, BELOW the locked Cardona/Dannaway/
                  Verma band — so the shaded "owned" zone holds only VEN and
                  the footer's "sparse" claim is literally true. Peer dots are
                  doctrine-locked and cannot be moved, so the wash moves. */}
              <rect x="420" y="360" width="180" height="140" fill="#E5FF00" opacity="0.07"/>
              <rect x="420" y="360" width="180" height="140" fill="none" stroke="#E5FF00" strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 3"/>
              {/* Plot border */}
              <rect x="80" y="60" width="520" height="440" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2 2"/>
              {/* Axis cross */}
              <line x1="80" y1="280" x2="600" y2="280" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.5"/>
              <line x1="340" y1="60" x2="340" y2="500" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.5"/>

              {/* Quadrant labels (v1.1) — name work-modes, not the plotted
                  people. Low-opacity mono; owned quadrant in chartreuse. */}
              <text x="92" y="80" fontSize="10" letterSpacing="1.5" fill="currentColor" opacity="0.3" fontFamily="ui-monospace, monospace">{COPY.modules["01"].fieldPositionQuadrants.tl}</text>
              <text x="588" y="80" textAnchor="end" fontSize="10" letterSpacing="1.5" fill="currentColor" opacity="0.3" fontFamily="ui-monospace, monospace">{COPY.modules["01"].fieldPositionQuadrants.tr}</text>
              <text x="92" y="490" fontSize="10" letterSpacing="1.5" fill="currentColor" opacity="0.3" fontFamily="ui-monospace, monospace">{COPY.modules["01"].fieldPositionQuadrants.bl}</text>
              <text x="588" y="490" textAnchor="end" fontSize="10" letterSpacing="1.5" fill="#E5FF00" opacity="0.85" fontFamily="ui-monospace, monospace">{COPY.modules["01"].fieldPositionQuadrants.br}</text>

              {/* Axis labels */}
              <text x="80" y="46" textAnchor="start" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace">{COPY.modules["01"].fieldPositionAxes.xLeft}</text>
              <text x="600" y="46" textAnchor="end" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace">{COPY.modules["01"].fieldPositionAxes.xRight}</text>
              <text x="65" y="60" textAnchor="end" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace" transform="rotate(-90, 65, 60)">{COPY.modules["01"].fieldPositionAxes.yTop}</text>
              <text x="65" y="500" textAnchor="start" fontSize="11" letterSpacing="2" fill="currentColor" fontFamily="ui-monospace, monospace" transform="rotate(-90, 65, 500)">{COPY.modules["01"].fieldPositionAxes.yBottom}</text>

              {/* Designer dots (gray label, 3px dot) */}
              {COPY.modules["01"].fieldPositionDesigners.map((d, i) => {
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
                const v = COPY.modules["01"].fieldPositionVen;
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
                <text x="14" y="9" fontSize="10" fill="currentColor" opacity="0.7" fontFamily="ui-monospace, monospace">{COPY.modules["01"].fieldPositionLegendPeers}</text>
                <circle cx="165" cy="5" r="5" fill="#E5FF00"/>
                <text x="176" y="9" fontSize="10" fill="#E5FF00" fontFamily="ui-monospace, monospace">VEN</text>
              </g>
            </svg>
          </div>

          <p className="font-mono text-xs uppercase tracking-wide opacity-muted mt-4">
            {COPY.modules["01"].fieldPositionBelow}
          </p>
        </div>
      </div>
    )
  },
  {
    id: ModuleType.RECRUITS,
    index: "01",
    title: COPY.modules["02"].title,
    promptText: COPY.modules["02"].prompt,
    themeColor: 'cream',
    responseText: COPY.modules["02"].oneLine,
    responseDisplay: (
      <div className="space-y-8">
        {/* Three-signal coordinate strip — small visual anchor before
            the lead. Mirrors the field-position chart "this is a coordinate"
            pattern at the role-fit scale. See war-game restructure. */}
        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-3">
            {COPY.modules["02"].signalStripTitle}
          </h4>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {COPY.modules["02"].signalStrip.map((s) => (
              <div key={s.code} className="border border-current/30 p-3 md:p-4">
                <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">
                  SIGNAL · {s.code}
                </div>
                <div className="font-mono text-sm uppercase tracking-wider mb-1">{s.label}</div>
                <div className="font-mono text-micro opacity-muted">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="font-serif text-2xl md:text-4xl leading-relaxed opacity-secondary mb-6">
            {COPY.modules["02"].lead.split('\n').map((line, i) => (
              <span key={i}>{line}{i < 1 && <br/>}</span>
            ))}
        </div>
        <ul className="space-y-6">
          {COPY.modules["02"].people.map((p, i) => (
             <li key={i}>
                <strong className="font-serif text-xl md:text-2xl block mb-2">{p.name}</strong>
                <div className="font-sans text-base md:text-lg opacity-secondary leading-relaxed">
                  {p.body.split('\n\n').map((para, j) => (
                    <p key={j} className={j > 0 ? 'mt-3' : ''}>{para}</p>
                  ))}
                </div>
             </li>
          ))}
        </ul>
        <p className="font-mono text-sm opacity-muted mt-4 border-t border-black/10 pt-4 leading-relaxed">
          {COPY.modules["02"].together.split('\n').map((line, i) => (
            <span key={i}>{line}{i < COPY.modules["02"].together.split('\n').length - 1 && <br/>}</span>
          ))}
        </p>
        {/* Culture-fit line — VOICE v2 (taste by refusal: names the wrong/right room). */}
        <p className="font-serif text-lg md:text-xl mt-6 leading-relaxed">
          {COPY.modules["02"].cultureFit}
        </p>
      </div>
    ),
  },
  {
    id: ModuleType.MODEL,
    index: "03",
    title: COPY.modules["03"].title,
    promptText: COPY.modules["03"].prompt,
    themeColor: 'black',
    responseText: COPY.modules["03"].hero,
    responseDisplay: (
      <div className="space-y-8">
        <div>
           <div className="font-serif text-2xl md:text-4xl leading-relaxed mb-4">
             {COPY.modules["03"].hero}
           </div>
           <div className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed">
             {COPY.modules["03"].body.split('\n\n').map((para, i) => (
               <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
             ))}
           </div>
        </div>

        <div className="space-y-3">
           <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted">{COPY.modules["03"].bulletsTitle}</h4>
           <ul className="space-y-2">
             {COPY.modules["03"].bullets.map((b, i) => (
               <li key={i} className="flex gap-3 items-start">
                 <span className="font-mono text-xs opacity-muted pt-1">&bull;</span>
                 <span className="font-sans text-base md:text-lg opacity-secondary leading-relaxed">{b}</span>
               </li>
             ))}
           </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/20">
           <div>
              <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-2">{COPY.modules["03"].grid.leftTitle}:</h4>
              <p className="font-sans text-base md:text-lg font-bold">{COPY.modules["03"].grid.leftBody}</p>
           </div>
           <div>
              <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-2">{COPY.modules["03"].grid.rightTitle}:</h4>
              <p className="font-sans text-base md:text-lg font-bold">{COPY.modules["03"].grid.rightBody}</p>
           </div>
        </div>
        <p className="font-serif text-lg md:text-xl italic opacity-tertiary border-t border-white/10 pt-4 mt-4">{COPY.modules["03"].close}</p>

        {/* Doctrine in motion — tabbed register explorer.
            Moved here from Module 02 per war-game findings.
            See PRD-DOCTRINE-EXPLORER.md (placement v2). */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-3">
            {COPY.modules["03"].doctrineExplorerTitle}
          </h4>
          <p className="font-serif text-xl md:text-2xl leading-relaxed mb-6 max-w-2xl">
            {COPY.modules["03"].doctrineExplorerHero}
          </p>
          <DoctrineExplorer registers={COPY.modules["03"].registers} />
          <p className="font-mono text-xs uppercase tracking-wide opacity-muted mt-4">
            {COPY.modules["03"].doctrineExplorerFootnote}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: ModuleType.WORLD_MODEL,
    index: "04",
    title: COPY.modules.worldModel.title,
    promptText: COPY.modules.worldModel.prompt,
    themeColor: 'black',
    responseText: COPY.modules.worldModel.hero,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed">
          {COPY.modules.worldModel.hero}
        </p>
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed max-w-3xl">
          {COPY.modules.worldModel.intro}
        </p>

        <div>
            <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">{COPY.modules.worldModel.layersTitle}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COPY.modules.worldModel.layers.map((l, idx) => (
                    <div key={idx} className="p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity">
                        <div className="flex items-baseline justify-between mb-3 gap-3">
                            <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">{l.layer}</span>
                            <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">0{idx + 1}</span>
                        </div>
                        <div className="font-mono text-xs uppercase tracking-wide opacity-muted mb-1">{l.sub}</div>
                        <h4 className="font-serif text-xl md:text-2xl italic mb-3">{l.person}</h4>
                        <p className="font-sans text-sm opacity-secondary leading-relaxed">{l.body}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="border-t border-white/20 pt-6">
            <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-3">{COPY.modules.worldModel.revealTitle}</h4>
            <p className="font-serif text-xl md:text-2xl leading-relaxed">{COPY.modules.worldModel.reveal}</p>
        </div>

        <div className="border-t border-white/20 pt-6">
            <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">{COPY.modules.worldModel.frameworkTitle}</h4>
            <ul className="space-y-3">
                {COPY.modules.worldModel.framework.map((f, idx) => {
                    const dashIndex = f.indexOf('—');
                    const label = dashIndex > -1 ? f.substring(0, dashIndex).trim() : f;
                    const content = dashIndex > -1 ? f.substring(dashIndex + 1).trim() : '';
                    return (
                        <li key={idx} className="flex gap-4 items-start">
                            <span className="font-mono text-xs uppercase tracking-wider opacity-muted whitespace-nowrap pt-1 min-w-[5rem]">{label}</span>
                            <span className="font-sans text-base md:text-lg opacity-secondary leading-relaxed">{content}</span>
                        </li>
                    );
                })}
            </ul>
        </div>

        <p className="font-serif text-lg md:text-xl italic opacity-tertiary border-t border-white/10 pt-4">{COPY.modules.worldModel.close}</p>
      </div>
    ),
  },
  {
    id: ModuleType.COMPANIES,
    index: "05",
    title: COPY.modules["04"].title,
    promptText: COPY.modules["04"].prompt,
    themeColor: 'clay',
    responseText: COPY.modules["04"].hero,
    evidence: SELECTED_SYSTEMS_EVIDENCE,
    responseDisplay: (
      <div className="space-y-8">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed">
          {COPY.modules["04"].hero}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COPY.modules["04"].portfolioSites.map((site, idx) => (
                <a
                    key={idx}
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity group/site"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">{site.register}</div>
                    <div className="font-mono text-lg md:text-xl tracking-tight mb-3 group-hover/site:underline">{site.domain}</div>
                    <p className="font-sans text-sm opacity-secondary leading-relaxed">{site.frame}</p>
                </a>
            ))}
        </div>

        {COPY.modules["04"].outcomeLine && (
          <p className="font-serif italic text-lg md:text-xl opacity-tertiary border-t border-current/20 pt-6 max-w-3xl">
            {COPY.modules["04"].outcomeLine}
          </p>
        )}

      </div>
    ),
  },
  {
    id: ModuleType.SIMULATOR,
    index: "06",
    title: "ROLE MATRIX",
    promptText: "WHERE THE FIT IS",
    themeColor: 'blue',
    responseText: "Match the work and the team to the role that actually fits.",
    responseDisplay: "Match the work and the team to the role that actually fits.",
  }
];

export const INQUIRY_OPTIONS = {
  assess: [
    "Role Fit",
    "Systems Thinking",
    "Prototype Process",
    "Visual Design Range",
    "Mission / Domain Context"
  ],
  challenge: [
    "Project Scope",
    "Technical Fluency",
    "Collaboration Style",
    "Hiring Need",
    "Portfolio Walkthrough"
  ]
};

export const INQUIRY_QUESTIONS: Record<string, string[]> = {
  "Role Fit": [
    "What kinds of roles are you targeting most directly right now?",
    "Where do you create the most leverage: product concepting, interface systems, or technical storytelling?",
    "What sort of team would use your range best instead of flattening it into one lane?",
    "What is the strongest signal recruiters should take from this dossier?"
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
  "Visual Design Range": [
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
    "What does your defense-readiness artifact contract look like, and how did you arrive at that structure?"
  ],
  "Collaboration Style": [
    "How do you work with product, engineering, and marketing when the brief is still ambiguous?",
    "What kind of feedback helps you sharpen the work fastest?",
    "What conditions produce your best work on a team?",
    "How do you bridge the rhetoric gap between what operators need to hear and what compliance reviewers need to see?"
  ],
  "Hiring Need": [
    "What kind of team problem are you best suited to solve in the first 90 days?",
    "Where can you accelerate a team immediately without a long onboarding runway?",
    "What signals tell you a role is actually designed for someone with your range?"
  ],
  "Portfolio Walkthrough": [
    "Which two projects should someone review first to understand the full range?",
    "How do the projects connect instead of reading like separate experiments?",
    "If you had 10 minutes with a recruiter, which artifacts would you walk them through and why?"
  ]
};
