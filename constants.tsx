import React from 'react';
import { ModuleData, ModuleType } from './types';
import { CT_DOSSIER_COPY_V120 as COPY } from './copy.v1_1';
import { CollapsibleDrawer } from './components/CollapsibleDrawer';
import { AnimatedGrid } from './components/AnimatedGrid';

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
    capability: "Builds coherence across interface, brand, and documentation.",
    signal: "Strong design-system thinking for technical products.",
    desc: "Turns scattered artifacts into one readable operating language. DEADLIGHT codifies trust/proof/consequence framing; CYPHER generates deterministic tactical marks with fabrication-grade governance."
  },
  {
    name: "Interactive Prototypes",
    role: "Product Proof",
    capability: "Makes product concepts believable through working behavior.",
    signal: "Can move from concept frame to functional prototype quickly.",
    desc: "Uses front-end implementation to test flow and trust before the team commits polish. TAK-G renders 1,500+ tracks with real swarm kinematics. GREY-EARTH is a live terrain workstation with Earth Engine integration."
  },
  {
    name: "Technical Narratives",
    role: "Systems Translation",
    capability: "Explains dense systems without flattening their complexity.",
    signal: "Useful where engineering, product, and recruiting all need the same story.",
    desc: "Translates autonomy, geospatial, sensing, and mission-software concepts into artifacts people can evaluate. The Tactical Brutalism framework bridges operators, stakeholders, and engineers within a single visual vocabulary."
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
        <div className="font-sans text-lg md:text-xl max-w-2xl opacity-secondary leading-relaxed">
          {COPY.modules["01"].body.split('\n\n').map((para, i) => (
            <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
          ))}
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
        <div className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed">
           {COPY.modules["04"].body.split('\n\n').map((para, i) => (
             <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
           ))}
        </div>

        <div className="bg-black/5 p-6 border border-black/10">
           <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">{COPY.modules["04"].wedgesTitle}</h4>
           <ul className="space-y-3">
             {COPY.modules["04"].wedges.map((w, i) => (
               <li key={i} className="flex gap-3 items-start">
                 <span className="font-mono text-xs opacity-muted pt-0.5">0{i + 1}</span>
                 <span className="font-sans text-base md:text-lg opacity-secondary leading-relaxed">{w}</span>
               </li>
             ))}
           </ul>
        </div>

        {COPY.modules["04"].first30 && COPY.modules["04"].first30.length > 0 && (
        <div>
             <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">{COPY.modules["04"].first30Title}</h4>
             <div className="space-y-4">
               {COPY.modules["04"].first30.split('\n').map((line, i) => {
                 const colonIndex = line.indexOf(':');
                 const label = line.substring(0, colonIndex);
                 const content = line.substring(colonIndex + 1).trim();
                 return (
                   <div key={i} className="flex gap-4 items-start">
                     <span className="font-mono text-xs uppercase tracking-wider opacity-muted whitespace-nowrap pt-1">
                       {label}:
                     </span>
                     <span className="font-sans text-base md:text-lg opacity-secondary leading-relaxed">
                       {content}
                     </span>
                   </div>
                 );
               })}
             </div>
        </div>
        )}

        {COPY.modules["04"].companies.length > 0 && (
        <div className="mt-8">
             <CollapsibleDrawer title={COPY.modules["04"].companiesTitle} defaultOpen={true}>
                 <AnimatedGrid>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                       {COPY.modules["04"].companies.map((c, idx) => (
                     <div key={idx} className="p-6 border border-current opacity-secondary hover:opacity-primary transition-opacity">
                        <div className="flex items-start justify-between mb-2 gap-3">
                          <h4 className="font-serif text-xl md:text-2xl italic">{c.name}</h4>
                          {(c.link.includes('vercel.app') || c.link.includes('netlify.app') || c.link.includes('github.io')) && (
                            <span className="font-mono text-micro uppercase tracking-widest border border-current px-2 py-0.5 opacity-tertiary whitespace-nowrap mt-1">LIVE</span>
                          )}
                        </div>
                        <div className="font-mono text-xs uppercase tracking-widest mb-4 opacity-tertiary">{c.tagline}</div>
                        <p className="font-sans text-sm opacity-secondary leading-relaxed mb-4">{c.why}</p>
                        <p className="font-mono text-xs uppercase tracking-wide opacity-muted mb-3">
                          PROVES: {c.proof}
                        </p>
                        <p className="font-sans text-sm opacity-secondary leading-relaxed mb-4">
                          {c.artifact}
                        </p>
                        {c.doctrineExcerpt && (
                          <blockquote className="border-l-2 border-current/40 pl-3 py-1 mb-4">
                            <p className="font-serif italic text-sm leading-relaxed opacity-secondary">
                              &ldquo;{c.doctrineExcerpt.quote}&rdquo;
                            </p>
                            <p className="font-mono text-micro uppercase tracking-widest opacity-tertiary mt-2">
                              — {c.doctrineExcerpt.source}
                            </p>
                          </blockquote>
                        )}
                        <div className="pt-4 border-t border-current/20 flex items-center gap-2">
                           <span className="font-mono text-micro uppercase opacity-tertiary">{c.match}</span>
                        </div>
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 mt-4 font-mono text-xs uppercase tracking-widest border border-current px-3 py-2 hover:bg-black hover:text-white transition-colors"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Review Artifact
                        </a>
                     </div>
                   ))}
                 </div>
                 </AnimatedGrid>
             </CollapsibleDrawer>
        </div>
        )}

        {COPY.modules["04"].companiesSynthesis && (
        <div className="mt-8 p-6 border-t border-current/20">
            <p className="font-sans text-base md:text-lg opacity-secondary leading-relaxed">
                {COPY.modules["04"].companiesSynthesis}
            </p>
        </div>
        )}

        <div className="mt-8">
            <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-4">
                {COPY.modules["04"].portfolioSitesTitle}
            </h4>
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
        </div>

        <div className="mt-12 pt-8 border-t-2 border-current/30">
            <div className="mb-6">
                <h4 className="font-mono text-xs uppercase tracking-widest opacity-muted mb-2">
                    {COPY.modules["04"].doctrineCardsTitle}
                </h4>
                <p className="font-sans text-base md:text-lg opacity-secondary leading-relaxed max-w-3xl">
                    {COPY.modules["04"].doctrineCardsHero}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COPY.modules["04"].doctrineCards.map((d, idx) => (
                    <div key={idx} className="p-6 border border-current bg-black/5 opacity-secondary hover:opacity-primary transition-opacity">
                        <div className="flex items-baseline justify-between mb-3 gap-3">
                            <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">
                                DOCTRINE // {String(idx + 1).padStart(2, '0')}
                            </span>
                            {d.domain && (
                                <span className="font-mono text-micro uppercase tracking-widest opacity-tertiary">
                                    {d.domain}
                                </span>
                            )}
                        </div>
                        <h4 className="font-mono text-xl md:text-2xl uppercase tracking-wide mb-3">{d.name}</h4>
                        <p className="font-sans text-sm opacity-secondary leading-relaxed mb-4">{d.thesisLine}</p>

                        <blockquote className="border-l-2 border-current/40 pl-3 py-1 mb-4">
                            <p className="font-serif italic text-sm leading-relaxed opacity-secondary">
                                &ldquo;{d.doctrineExcerpt.quote}&rdquo;
                            </p>
                            <p className="font-mono text-micro uppercase tracking-widest opacity-tertiary mt-2">
                                — {d.doctrineExcerpt.source}
                            </p>
                        </blockquote>

                        <div className="font-mono text-xs uppercase tracking-wide opacity-muted mb-2">
                            FORMAT: {d.artifactFormat}
                        </div>
                        <div className="font-mono text-xs uppercase tracking-wide opacity-muted mb-3">
                            UNITS: {d.governingUnits}
                        </div>
                        <p className="font-mono text-xs uppercase tracking-wide opacity-muted mb-3">
                            PROVES: {d.proves}
                        </p>

                        {d.implementations && d.implementations.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-current/20">
                                <div className="font-mono text-micro uppercase tracking-widest opacity-tertiary mb-2">
                                    Implementations
                                </div>
                                <ul className="space-y-1">
                                    {d.implementations.map((impl, j) => (
                                        <li key={j} className="font-mono text-xs opacity-secondary flex items-start gap-2">
                                            {impl.pending ? (
                                                <>
                                                    <span>· {impl.name}</span>
                                                    <span className="font-mono text-micro uppercase tracking-widest border border-current/40 px-1.5 py-0 opacity-tertiary whitespace-nowrap" aria-label="Repository link pending verification">
                                                        REPO PENDING
                                                    </span>
                                                </>
                                            ) : (
                                                <a
                                                    href={impl.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="hover:underline"
                                                    onClick={(event) => event.stopPropagation()}
                                                >
                                                    · {impl.name}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <a
                            href={d.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 mt-4 font-mono text-xs uppercase tracking-widest border border-current px-3 py-2 hover:bg-black hover:text-white transition-colors"
                            onClick={(event) => event.stopPropagation()}
                        >
                            Open Doctrine
                        </a>
                    </div>
                ))}
            </div>
        </div>
      </div>
    ),
  },
  {
    id: ModuleType.SIMULATOR,
    index: "06",
    title: "ROLE MATRIX",
    promptText: "INTERACTIVE FIT LENS",
    themeColor: 'blue',
    responseText: "Map the kind of work and environment against the role I am most likely to play well.",
    responseDisplay: "Map the kind of work and environment against the role I am most likely to play well.",
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
