/* copy.v1_1.ts
   CT Dossier copy — taste-led practice dossier.

   V3 REPOSITIONING (CT-PRD-MARY-01): the dossier moved from a
   "creative technologist" capability inventory to a taste-led practice
   dossier. Primary subject is taste; technology is supporting evidence.
   Section spine, in render order:
     01 TASTE            — where the work is sourced
     02 SEEING           — the cognitive lenses (was WORLD MODEL)
     03 VISUAL LANGUAGES — how taste becomes authored systems (language cards + register grammar)
     04 NEIGHBORHOOD     — adjacent practices (holds the old FIELD POSITION chart)
     05 DOCTRINE         — what the work obeys and refuses (was PRACTICE)
     06 DOCTRINE LIBRARY — the written source texts behind the practice
     07 PORTFOLIOS       — where the built work lives
     08 OPERATING BIOGRAPHY — the human root of the practice (V3.5.1, was ENGAGEMENT MODELS)
   Voice: calmer than the v2 Meservey register — declarative, first person
   where it's natural, no self-mythologizing, no recruiter/role language. */

export const CT_DOSSIER_COPY_V120 = {
  meta: {
    version: "3.6.4",
    voice: "taste-led, calm, declarative; first person where natural; reduce operator/mission/system jargon; increase taste/direction/culture/history/form/craft (CT-PRD-MARY-01)",
    rule: "taste is the subject, technology is evidence; museum-catalogue restraint over dashboard energy; show a point of view before showing the ability to build; enemies are categories not people; mass over swagger",
  },

  // INDEX overlay epigraph — the repositioning thesis, stated plainly. Sets
  // the tone the moment the index opens.
  indexEpigraph: "Taste is not preference. Taste is a sourcing discipline.",

  modules: {
    // 01 — TASTE. Establishes aesthetic authority before any capability claim.
    taste: {
      title: "TASTE",
      prompt: "WHAT SHAPES THE WORK",
      hero: "Most creative work begins with preference. Mine begins with excavation.",
      body: [
        "The goal isn't to find what's trending. It's to find what holds. Art movements. Religious architecture. Military doctrine. Industrial design. Institutional memory. Each is a record of people solving hard problems under real constraint. I start there — not to repeat the past, but because it shows which forms survive.",
        "I call this Anthropological Moodboarding: sourcing from deep historical and cultural strata, not the live trend cycle. What comes out feels familiar without feeling derivative.",
        "Less trend. More lineage.",
      ].join("\n\n"),
      beliefsTitle: "WORKING BELIEFS",
      beliefs: [
        "Taste is a sourcing discipline.",
        "Authority comes from coherence, not decoration.",
        "Restraint scales better than spectacle.",
        "History is a design library.",
        "Visual language should survive contact with reality.",
        "Fashion changes. Structure remains.",
      ],
      fieldNoteTitle: "FIELD NOTE",
      fieldNote:
        "A useful design reference isn't necessarily beautiful. It's something that solved a problem so well that people kept coming back to it.",
    },

    // 02 — SEEING. The cognitive framework. Reflective, not performative.
    // Keeps the three picks (Levin / Hughes / Johnson) but reframes them as
    // recurring lenses rather than people to recruit.
    seeing: {
      title: "SEEING",
      prompt: "HOW I LOOK AT THINGS",
      hero:
        "Different disciplines name the same problem differently. I work in the overlap.",
      intro:
        "A military campaign. A cathedral. A software platform. A city. A brand. Each tries to make coherence under constraint. Three lenses I keep returning to.",
      lensesTitle: "THREE LENSES",
      lenses: [
        {
          code: "01",
          title: "SYSTEMS",
          person: "Michael Levin",
          question: "What lets parts become a coherent whole?",
          body:
            "I'm not after biology — I'm after coordination: how complexity organizes itself without losing its identity.",
        },
        {
          code: "02",
          title: "HUMANS",
          person: "Chase Hughes",
          question: "Why do some things get adopted and others don't?",
          body:
            "Technology doesn't spread because it's correct. It spreads because people understand it, trust it, and can place themselves inside it.",
        },
        {
          code: "03",
          title: "CONSTRAINTS",
          person: "Kelly Johnson",
          question: "What survives contact with reality?",
          body:
            "Constraints aren't obstacles. They're design inputs. Most things get better when they're forced to choose.",
        },
      ],
      shortTitle: "SHORT VERSION",
      short:
        "Coherence. Adoption. Survival. Most ambitious work fails because one of the three breaks first.",
    },

    // 03 — VISUAL LANGUAGES (V3.2, was DIRECTION). Proves taste becomes
    // authored, reusable visual operating languages. Three language cards
    // (DOSSIER / DEADLIGHT / IAA) are the centerpiece; the registers
    // (Monastery / Forge / Oracle) are demoted to grammar tags underneath.
    visualLanguages: {
      title: "VISUAL LANGUAGES",
      prompt: "HOW TASTE BECOMES SYSTEMS",
      hero: "Taste becomes useful when it can repeat without becoming generic.",
      body: [
        "A visual language is not a moodboard. It's a rule system for how a thing should look, speak, behave, refuse, and survive translation.",
        "I author these as visual languages — each with its own palette, type, component logic, interaction vocabulary, and source of authority. The registers underneath: Monastery, Forge, Oracle. Not themes. Grammar.",
      ].join("\n\n"),

      // CTA hrefs: relative paths under public/library/ (the component prepends
      // import.meta.env.BASE_URL so they resolve under the /CT-DOSSIER/ Pages
      // base); absolute http(s) hrefs are left untouched. null = suppressed (no
      // file deployed yet → no broken link). V3.4.1 asset wiring.
      //   DOSSIER   -> library/dossier-visual-operating-language-v4.pdf  (wired)
      //   DEADLIGHT -> deadlight.vercel.app (external); rulebook PDF not deployed
      //   IAA       -> manifesto / brand-architecture files not deployed (suppressed)
      languages: [
        {
          id: "dossier",
          name: "DOSSIER",
          label: "Visual Operating Language v4.0",
          type: "Design-token system + component grammar",
          context: "Intelligence-style geospatial products",
          registers: ["Forge", "Oracle"],
          shortCopy:
            "A visual operating language for intelligence-style geospatial products — physical substrate, tactical illumination, dense data, and dossier-like interaction that treats the interface as a handled object.",
          governingRules: ["Physical constraints", "Utilitarian canvas", "Tactical illumination"],
          includes: [
            "Substrate palette", "Tactical markers", "Heatmap ramp", "Typography rules",
            "Status badges", "Alert components", "Intel cards", "Scatter / heatmap / gauge grammar",
            "GeoJSON projection logic", "Entity dossier stack", "Layout rules",
            "Interaction vocabulary", "Motion and elevation tokens",
          ],
          sourceOfAuthority: "Constraint. Visibility. Operational legibility.",
          refuses: [
            "Decorative data", "Generic dark mode", "Fake sci-fi interface language",
            "Unmapped color meaning", "Cosmetic motion", "Gradients that hide information",
          ],
          cta: { label: "VIEW SPEC", href: "library/dossier-visual-operating-language-v4.pdf" },
          secondaryCta: null,
        },
        {
          id: "deadlight",
          name: "DEADLIGHT",
          label: "Visual Systems Specification v2.0",
          type: "Defense-technology visual rulebook",
          context: "Defense-technology communication",
          registers: ["Forge", "Oracle", "Monastery"],
          shortCopy:
            "A production-grade visual system for making invisible structure visible under pressure. DEADLIGHT governs defense-technology communication — presentations, product visualization, mark systems, exhibition, collage R&D, tactical interfaces. Not a mood. A rulebook, where every register and protocol resolves into one visual grammar.",
          governingRules: [
            "Controlled occlusion", "Material is meaning", "Color is functional",
            "Scale is accountability", "The system survives density",
            "The collage feeds the system", "Range proves discipline",
          ],
          includes: [
            "Material registers", "Type registers", "Color protocol", "Content functions",
            "Production categories", "R&D practice", "Mark systems", "Gallery rules", "Scope boundaries",
          ],
          sourceOfAuthority: "Pressure. Visibility. Controlled revelation.",
          refuses: [
            "Decorative texture", "Unmapped accent color", "Heroic military cliché",
            "Generic terminal aesthetics", "Portfolio-only spectacle",
            "Density that collapses the system", "Outliers that are not killed or codified",
          ],
          cta: { label: "VIEW DEADLIGHT", href: "https://deadlight.vercel.app/" },
          secondaryCta: null,
        },
        {
          id: "iaa",
          name: "IAA",
          label: "Identity Architecture Agent",
          type: "Brand doctrine + identity architecture system",
          context: "Personal brand / art direction / cognitive identity",
          registers: ["Monastery", "Forge"],
          shortCopy:
            "A brand architecture system that turns biography, taste, pressure, and memory into a coherent identity. IAA is where the practice turns back on itself: it doesn't ask what style I like — it asks what keeps appearing across the work, and what that reveals.",
          governingRules: ["Mass over swagger", "Lineage over trend", "Constraint as input", "Taste with a load rating"],
          includes: [
            "Brand architecture", "Voice principles", "Taste doctrine",
            "Personal mythology refinement", "Visual authority rules", "Positioning language",
            "Refusal logic", "Creative identity map",
          ],
          sourceOfAuthority: "Lineage. Pressure. Authorship.",
          refuses: [
            "Generic personal branding", "Trend-cycle identity", "Empty mystique",
            "Technology without taste", "Style without worldview", "Over-explaining what should be felt",
          ],
          cta: null,
          secondaryCta: null,
        },
      ],

      registersGrammarTitle: "REGISTER GRAMMAR",
      registersGrammarIntro:
        "The registers are not themes. They are sources of authority — they explain where a visual language gets its weight.",
      registers: [
        {
          id: "monastery",
          code: "MN",
          name: "MONASTERY",
          function: "Memory / Preservation / Restraint",
          question: "What deserves to survive?",
          usedWhen: "When the work needs quiet authority, archival logic, editorial pacing, and cultural memory.",
          color: "#204C8D",
        },
        {
          id: "forge",
          code: "FG",
          name: "FORGE",
          function: "Pressure / Endurance / Material Force",
          question: "What survives pressure?",
          usedWhen: "When the work needs weight, consequence, durability, and visible constraint.",
          color: "#FF4F00",
        },
        {
          id: "oracle",
          code: "OR",
          name: "ORACLE",
          function: "Signal / Perception / Invisible Systems",
          question: "What remains unseen?",
          usedWhen: "When the work needs to reveal hidden structures, signals, networks, patterns, or latent systems.",
          color: "#42FC04",
        },
      ],
    },

    // 04 — THE NEIGHBORHOOD. Orientation, not ranking. Holds the old FIELD
    // POSITION chart unchanged (visualization is locked per CT-PRD-MARY-01;
    // only the surrounding copy softened from comparison to orientation).
    // Peer names remain placeholders pending the battlecard pass.
    neighborhood: {
      title: "THE NEIGHBORHOOD",
      prompt: "ADJACENT PRACTICES",
      hero: "No practice develops in isolation.",
      intro:
        "The map plots neighboring practices — craft, technology, identity, publishing, design. Not a ranking; an orientation. Some optimize for speed, some for experimentation, some for permanence. I sit where durable craft, systems thinking, visual direction, and AI-native production meet.",
      chartTitle: "A MAP OF NEIGHBORING PRACTICES",
      chartCaption:
        "The corner where durable work meets AI-native production — a quiet part of the map.",
      fieldPositionAxes: {
        xLeft: "CRAFT-NATIVE",
        xRight: "AI-NATIVE",
        yTop: "EPHEMERAL",
        yBottom: "DURABLE",
      },
      fieldPositionQuadrants: {
        tl: "TREND CRAFT",
        tr: "FAST & DISPOSABLE",
        bl: "LEGACY CRAFT",
        br: "DOCTRINE-LED AI",
      },
      fieldPositionLegendPeers: "neighboring practices",
      fieldPositionDesigners: [
        { name: "Tarka",          x: 5,  y: 90 },
        { name: "Van Schneider",  x: 10, y: 85 },
        { name: "Campdera",       x: 15, y: 80 },
        { name: "Varley",         x: 30, y: 25 },
        { name: "Mans",           x: 40, y: 50 },
        { name: "Akdağ",          x: 50, y: 45 },
        { name: "Cardona",        x: 55, y: 52 },
        { name: "Brucker",        x: 65, y: 30 },
        { name: "Dannaway",       x: 70, y: 55 },
        { name: "Verma",          x: 72, y: 62 },
        { name: "Zada",           x: 80, y: 20 },
        { name: "Meyer",          x: 85, y: 15 },
        { name: "Flynn",          x: 90, y: 10 },
        { name: "Haas",           x: 95, y: 14 },
      ],
      fieldPositionVen: {
        x: 72,
        y: 78,
        label: "VEN",
        sub: "Doctrine + agent orchestration",
      },
    },

    // 05 — DOCTRINE (V3.2, was PRACTICE). What the work obeys and refuses.
    // Direction → Form → Trust (Proof routed through art direction as Form).
    doctrine: {
      title: "DOCTRINE",
      prompt: "WHAT THE WORK OBEYS AND REFUSES",
      hero: "My work isn't held together by style. It's held together by rules.",
      intro:
        "A doctrine is what I obey when taste, pressure, and execution start to conflict. It sets what the work can become — and what it refuses.",
      layersTitle: "DIRECTION · FORM · TRUST",
      layers: [
        {
          code: "01",
          title: "DIRECTION",
          body:
            "What should people understand? Remember? Believe? The system begins here: deciding what matters before anything is built.",
        },
        {
          code: "02",
          title: "FORM",
          body:
            "Once direction is clear, it needs a body: interfaces, diagrams, motion, prototypes, working software. Form lets people inspect the idea instead of imagining it.",
        },
        {
          code: "03",
          title: "TRUST",
          body:
            "Trust isn't made by aesthetics. It's made when the form keeps its promise. Not persuasion — clarity strong enough to decide on.",
        },
      ],
      rulesTitle: "WORKING DOCTRINE",
      rules: [
        "Taste is a sourcing discipline.",
        "Constraint is an input, not an obstacle.",
        "Visual language must survive translation.",
        "Nothing decorative unless it carries meaning.",
        "Build only when the idea demands form.",
        "Evidence matters, but spectacle does not.",
        "Calm under load is a designed property.",
        "The work should know what it refuses.",
      ],
      // Handoff into the Doctrine Library — renders before the short close.
      handoff: "The library below is where those rules are argued in longer form.",
      short: "One head for the eye, the system, and the artifact.",
    },

    // 06 — DOCTRINE LIBRARY (V3.3 + V3.4.1). The shelf of written source texts
    // behind the practice. card.href is a relative path under public/library/
    // (component prepends BASE_URL) for deployed assets, or null when the file
    // isn't deployed yet (CTA suppressed, no broken link).
    doctrineLibrary: {
      title: "DOCTRINE LIBRARY",
      prompt: "WHERE THE THINKING LIVES",
      hero: "The work has a written layer.",
      intro:
        "Essays, rulebooks, white papers — where I name the laws before they become visual systems. Each answers a recurring question: what survives pressure, what deserves preserving, what shows only under stress, what a brand keeps as everything changes.",
      shelfLogic:
        "Each text anchors a different part of the practice: pressure, memory, signal, brand, systems, or identity.",
      filterAllLabel: "ALL",
      // Footer line for cards whose document isn't published yet — archival
      // cataloguing, not a "coming soon" teaser. Keeps every card's footer filled.
      pendingNote: "Indexed · not yet public.",
      cards: [
        {
          id: "design-under-fire",
          title: "Design Under Fire",
          subtitle: "Product Thinking and the Battle of Stalingrad",
          type: "Working paper",
          registers: ["Forge", "Systems"],
          description: "A working paper on systems failure, iterative adaptation, and design laws under maximum pressure.",
          why: "The Forge doctrine. It argues that design principles are domain-invariant: the failures that kill products, campaigns, spacecraft, and organizations often rhyme.",
          ctaLabel: "READ PAPER",
          href: "library/design-under-fire-stalingrad.pdf",
        },
        {
          id: "creative-strategy-54",
          title: "Creative Strategy 5:4",
          subtitle: "Ethos and Compliant Go-to-Market for Defense Startups",
          type: "Strategic doctrine",
          registers: ["Forge", "Oracle"],
          description: "A strategy document for creative work where trust, compliance, and operational credibility become first-class product features.",
          why: "The bridge between visual language and institutional trust. It explains why defense creative must function as a risk-managed evidence system, not just marketing.",
          ctaLabel: "READ STRATEGY",
          href: "library/creative-strategy-5-4.pdf",
        },
        {
          id: "watchman-builder",
          title: "The Watchman Builder",
          subtitle: "An American Dynamism Doctrine for First-Sight, Moral Force, and Civilizational Continuity",
          type: "Essay / white paper",
          registers: ["Monastery", "Forge"],
          description: "An essay on builders, protection, first-sight, moral force, and the village as the unit of defense.",
          why: "The moral doctrine under the technical work. It gives the practice a theory of protection, memory, and civilizational continuity.",
          ctaLabel: "READ ESSAY",
          href: null, // /library/watchman-builder-american-dynamism.md
        },
        {
          id: "algorithmic-aesthetics",
          title: "A New Visual Language for the Age of AGI",
          subtitle: "Algorithmic Aesthetics and the Non-Human Gaze",
          type: "Article",
          registers: ["Oracle"],
          description: "A speculative article on brand design for machine intelligence, algorithmic identity, non-human perception, and visual systems beyond human-centric aesthetics.",
          why: "The Oracle doctrine. It explains the recurring interest in signal, fragmentation, non-human perception, organic–technological fusion, and the #42FC04 signature.",
          ctaLabel: "READ ARTICLE",
          href: null, // /library/a-new-visual-language-for-the-age-of-agi.md
        },
        {
          id: "dirty-canvas",
          title: "Dirty Canvas",
          subtitle: "Brand as Living System in the AGI Era",
          type: "Brand essay",
          registers: ["Monastery", "Oracle"],
          description: "An essay on brand as emotional contract, live API, creative partner, and unfinished system.",
          why: "The brand doctrine. It explains why a brand system should behave like a living rule-set with soul, not a static cage.",
          ctaLabel: "READ ESSAY",
          href: "https://dirty.artdirector.rocks/",
        },
        {
          id: "iaa-manifesto",
          title: "IAA Manifesto",
          subtitle: "Mass Over Swagger",
          type: "Manifesto",
          registers: ["Monastery", "Forge"],
          description: "A working manifesto on taste, pressure, restraint, discomfort, and the difference between work built to be admired and work built to survive.",
          why: "The identity doctrine. It names the emotional and philosophical source of the practice: taste with a load rating.",
          ctaLabel: "READ MANIFESTO",
          href: null, // /library/iaa-manifesto.md
        },
        {
          id: "iaa-brand-architecture",
          title: "IAA Brand Architecture",
          subtitle: "Cognitive Brand Architecture",
          type: "Brand architecture document",
          registers: ["Monastery", "Forge", "Oracle"],
          description: "A structured identity document mapping the practice across themes, methods, psychic architecture, market translation, and proprietary frameworks.",
          why: "The meta-system. It codifies Anthropological Moodboarding, Invariance Auditing, the Evidence Engine, and Generative Discomfort.",
          ctaLabel: "VIEW ARCHITECTURE",
          href: null, // /library/iaa-brand-architecture.md
        },
        {
          id: "rubric-design-system",
          title: "Rubric Design System",
          subtitle: "A codified evaluation and design-language artifact",
          type: "Design system / rubric",
          registers: ["Systems", "Oracle"],
          description: "A structured design-system artifact for turning judgment, criteria, and evaluation into a usable visual and conceptual framework.",
          why: "This extends the dossier beyond aesthetics into evaluation logic — how taste becomes criteria.",
          ctaLabel: "VIEW SYSTEM",
          href: "library/rubric-design-system.html",
        },
        {
          id: "hospitaller-codex",
          title: "Hospitaller Codex",
          subtitle: "A doctrine of care, defense, and institutional memory",
          type: "Codex / doctrine artifact",
          registers: ["Monastery", "Forge"],
          description: "A codex-style artifact exploring the relationship between protection, care, duty, and institutional continuity.",
          why: "This belongs to the Monastery / Forge axis: memory and protection, care and defense, restraint and force.",
          ctaLabel: "VIEW CODEX",
          href: "library/hospitaller-codex.html",
        },
        {
          id: "hospitaller-doctrine-brief",
          title: "Hospitaller Doctrine Brief",
          subtitle: "A brief on protection, service, and the moral architecture of force",
          type: "Doctrine brief",
          registers: ["Monastery", "Forge"],
          description: "A compact doctrine brief on the Hospitaller pattern: care first, defense as the outer wall, and force subordinated to protection.",
          why: "This sharpens the moral logic behind the defense work. It frames power as a duty of care, not an aesthetic of aggression.",
          ctaLabel: "READ BRIEF",
          href: "library/hospitaller-doctrine-brief.html",
        },
        {
          id: "algorithmic-branding-archive",
          title: "Algorithmic Branding Archive",
          subtitle: "Brand identity at the intersection of algorithm and archive",
          type: "Archive / brand study",
          registers: ["Oracle", "Monastery"],
          description: "A working archive on how algorithmic systems reshape brand identity — collecting the patterns where computation and brand development meet.",
          why: "The applied edge of the Oracle doctrine: brand-building when the audience, the medium, and the maker are increasingly non-human.",
          ctaLabel: "VIEW ARCHIVE",
          href: "https://branding.artdirector.rocks/",
        },
        {
          id: "my-first-cpo",
          title: "My First CPO",
          subtitle: "The Unlikely Product Design Lessons from My Father",
          type: "Essay",
          registers: ["Monastery", "Forge"],
          description: "An essay drawing product-design lessons from a childhood with the author's father — where what you observe and what's actually there rarely match.",
          why: "The personal root of the practice's discipline: perception under pressure, and the habit of testing assumptions before trusting them.",
          ctaLabel: "READ ESSAY",
          href: "https://medium.com/@ebenz.aug/my-first-cpo-1587997fe93f",
        },
      ],
    },

    // 07 — PORTFOLIOS. Where the built work lives. Order is taste-first:
    // art direction, then brand × product, then defense.
    portfolios: {
      title: "PORTFOLIOS",
      prompt: "WHERE THE WORK LIVES",
      hero:
        "This dossier describes how I work. The built work lives elsewhere — one site per expression of the practice.",
      intro:
        "Each site stands alone. None of them has to explain the whole system. That's what I do here.",
      portfolioSites: [
        {
          domain: "artdirector.rocks",
          register: "Art direction",
          frame:
            "Editorial systems, identity, typography, atmosphere, and visual language. Where the page itself becomes the product.",
        },
        {
          domain: "brandproduct.dev",
          register: "Brand × product",
          frame:
            "Design systems, interfaces, product surfaces, and interaction patterns. Where visual language becomes usable structure.",
        },
        {
          domain: "defense.observer",
          register: "Defense",
          frame:
            "Visual systems for autonomy, sensing, command, and technical communication. The same practice tested under harder constraints.",
        },
      ],
      outcomeLine:
        "The proof is spread across the sites. Here I explain why I keep returning to the same questions.",

      // --- Preserved for restoration only (see HANDOFF.md §3). Not rendered. ---
      _archivedWedges: [
        "Tactical OS: visual governance, component grammar, and interface rules for high-assurance environments.",
        "Spatial Intelligence: terrain, sensor, and geospatial products that make evidence readable across surfaces.",
        "Autonomous Command: swarm, simulation, and operational prototypes that show system behavior under load.",
        "High-Assurance Safety: human-factors, bias mitigation, and trust-building interfaces for consequential decisions.",
      ],
      _archivedCompanies: [
        {
           name: "DEADLIGHT",
           tagline: "Visual governance for high-assurance systems",
           why: "A deterministic brand and interface language for mission-critical software and technical storytelling.",
           match: "Design system + strategic narrative",
           proof: "Proves I can codify a full visual operating system rather than style artifacts one by one.",
           artifact: "Three-layer brand architecture (Trust + Proof + Consequence), four visual modes, and a Tactical Brutalism doctrine used across 10 defense-adjacent projects.",
           doctrineExcerpt: {
             quote: "If the dramatic styling is removed, does the artifact still communicate authority? If the answer is no, the frame is relying on style instead of system.",
             source: "Five-Question Gate, Q5 — BRAND_DECISION_MATRIX",
           },
           link: "https://github.com/augustave/deadlight",
        },
        {
           name: "DOSSIER VOL / DOSSIERMAP",
           tagline: "Component grammar for intelligence-style products",
           why: "A visual operating specification that turns geospatial and intelligence interfaces into a coherent system.",
           match: "Interface grammar + documentation",
           proof: "Proves I can define tokens, layout rules, and map-facing interface language at the system level.",
           artifact: "RFC 7946-compliant token system: 11-step substrate palette, nine fixed-vocabulary semantic states, GeoJSON projection engine, intel-card anatomy, three-column operational grid, motion and z-index discipline.",
           doctrineExcerpt: {
             quote: "Raw Substrate, Hyper-Visible Data. The interface simulates a physical, heavily-handled intelligence dossier. The base is utilitarian and drab; the data layers are explosive and precise.",
             source: "DOSSIER VOL Specification v3.0, §0 Ethos",
           },
           link: "https://github.com/augustave/DossierMap",
        },
        {
           name: "GREY-EARTH",
           tagline: "Live tactical terrain workstation",
           why: "A production-minded terrain analysis surface with real interaction logic, map workflows, and operator-facing clarity.",
           match: "Product design + front-end implementation",
           proof: "Proves I can ship a live workstation, not just a visual concept.",
           artifact: "Terrain analysis workflows, 2D/3D map modes, Earth Engine integration, and a manifest-first render model.",
           link: "https://grey-earth.vercel.app",
        },
        {
           name: "TACTICAL CANVAS",
           tagline: "Mission workflow prototype",
           why: "An interface study focused on visible task flow, command confidence, and stronger mission-state communication.",
           match: "Rapid prototyping + systems UI",
           proof: "Proves I can prototype mission logic so users see the full thread from observation to tasking. Validated through a 30-minute technical walkthrough dry run.",
           artifact: "Shared mission state, radar surface work, dossier layers, and an end-to-end interaction story.",
           link: "https://github.com/augustave/TACTICAL-CANVAS",
        },
        {
           name: "MINI-D",
           tagline: "Autonomy verification lab",
           why: "A research-grade sandbox for making autonomy claims testable, bounded, and easier to inspect.",
           match: "Simulation design + falsifiable proof",
           proof: "Proves I can design evaluation environments, not just hero demos.",
           artifact: "Chain-of-verification, comms-degradation scenarios, and comparative baseline testing through limits, thresholds, and inspectable outputs.",
           link: "https://github.com/augustave/MINI-D",
        },
        {
           name: "WAR-F",
           tagline: "Brutalist typographic swarm simulator",
           why: "A 64-agent drone-swarm doctrine simulator rendered as a Maciunas-Fluxus / Swiss-brutalist diagram in pure black and white.",
           match: "Simulation design + visual doctrine",
           proof: "Proves I can render system behavior as a structural diagram, not a sci-fi UI — and that doctrine and aesthetic can be the same artifact.",
           artifact: "Four finite cost surfaces (Latency / Bandwidth / Endurance / Attention), gated commitment doctrine, trust-degradation visuals, inverted-block state grammar.",
           link: "https://github.com/augustave/warfare",
        },
        {
           name: "CCRT",
           tagline: "Human-factors and bias mitigation study",
           why: "An evidence-led interface direction for warfighter-centered command environments and safer decision-making.",
           match: "Human factors + high-assurance UI",
           proof: "Proves I can use interface design to reduce misread risk instead of simply making complex systems look advanced.",
           artifact: "Bias-mitigation framing, safety-critical readability, and operator-centered command surface design.",
           link: "https://github.com/augustave/CCRT",
        },
        {
           name: "TAK-G",
           tagline: "Theater-level C2 simulator",
           why: "A high-fidelity command-and-control visualization managing 1,500+ multi-domain tracks with swarm kinematics and zero-trust guardrails.",
           match: "Simulation design + systems UI + front-end engineering",
           proof: "Proves I can build production-grade interaction systems for high-density operational environments, not just concepts.",
           artifact: "Three.js WebGL renderer, topological swarm cohesion, EMCON confidence decay, uncertain pointer framework, and full telemetry HUD.",
           link: "https://tak-h.vercel.app/",
        },
      ],
      _archivedDoctrineCards: [
        {
          name: "SEAL",
          thesisLine: "Brand doctrine for defense-tech, organized along the sea / air / land operational taxonomy.",
          doctrineExcerpt: {
            quote: "Sea, air, land — every domain has a doctrine. Every doctrine has a look.",
            source: "SEAL README",
          },
          artifactFormat: "skill" as const,
          governingUnits: "5 palettes / 8 iron rules / 6 document types",
          proves: "I can codify a brand doctrine as a distributable skill — typology, rules, and document grammar that other practitioners can install and obey.",
          link: "https://augustave.github.io/SEAL/",
          domain: "cross-domain" as const,
          implementations: [
            { name: "DEADRISE — Coldwater Pragmatism v1.0",   link: "https://github.com/augustave/DEADRISE",         pending: true },
            { name: "ARS-RUSBELT — Rustbelt Kinetic",         link: "https://github.com/augustave/ARS-RUSBELT",      pending: true },
            { name: "ANECHOIC MINIMAL — spectrum doctrine",   link: "https://github.com/augustave/ANECHOIC-MINIMAL", pending: true },
          ],
        },
        {
          name: "DYNAMISM DOSSIER",
          thesisLine: "Declassified-archive presentation of the American Dynamism thesis, derived from 7+ hours of primary-source interviews.",
          doctrineExcerpt: {
            quote: "How do we win the next century? Not by becoming more like them. By becoming more like us.",
            source: "Dynamism Dossier, Plate 10",
          },
          artifactFormat: "interactive" as const,
          governingUnits: "66 entities / 10 transcripts / 8 doctrines / 12 archival plates",
          proves: "I can run a real corpus-to-structure pipeline — entity extraction, thesis decomposition, doctrine extraction via a reusable 18-field YAML template — and render the result as a navigable feedback-looped interface.",
          link: "https://augustave.github.io/dynamism/",
          domain: "editorial" as const,
          implementations: [
            { name: "New Media Operating System (a16z-style swarm)", link: "https://augustave.github.io/new-media-operating-system-demo/" },
            { name: "A16Z Editorial Webapp (4-surface product)",     link: "https://github.com/augustave/AD-A16Z",                            pending: true },
          ],
        },
        {
          name: "LIFT BENCH",
          thesisLine: "Founder engineering bench for the DARPA Lift Challenge — agent orchestration as a substitute for a traditional aero/mech team.",
          doctrineExcerpt: {
            quote: "The realistic competitive target is one of the three $500K innovation awards. The 'most promising overall' category rewards novel configuration and systems-level thinking.",
            source: "LIFT_BENCH.md, Strategic Position",
          },
          artifactFormat: "framework" as const,
          governingUnits: "3 cells (Airframe / Power / Program) / star topology / 1 decision gate",
          proves: "I can design a multi-agent engineering bench against a real DARPA constraint set (≤55 lbs, 4:1 payload-to-weight, 5 NM VTOL circuit) and reason explicitly about what agents can and cannot do.",
          link: "https://github.com/augustave/LIFT-STDY",
          domain: "air" as const,
        },
      ],
    },

    // 08 — OPERATING BIOGRAPHY (V3.5.1, replaced ENGAGEMENT MODELS). First-person
    // authored testimony — the human root of the practice, not a service menu.
    biography: {
      title: "OPERATING BIOGRAPHY",
      prompt: "WHO CARRIES THE PRACTICE",
      opening: "I learned to read surfaces before I had language for what I was reading.",
      body: [
        "Before design, there was photography: light, framing, atmosphere, timing, and the strange way an image can tell the truth without explaining itself.",
        "Before product language, there was service: rooms, pacing, pressure, hospitality, and the discipline of noticing what people need before they ask for it.",
        "Fashion taught me that signal has grammar.",
        "Food taught me that sequence matters.",
        "Restaurants taught me that pressure reveals the real system.",
        "Languages taught me that meaning changes shape when it crosses a border.",
        "Design gave those instincts structure.",
        "Machine intelligence gave them a new terrain.",
        "The practice comes from that crossing. Image and service. Taste and pressure. Memory and systems. The visible thing and the thing underneath it.",
        "That is why the work keeps returning to visual language, doctrine, source texts, and inspectable form.",
        "I am not trying to make complex things simple.",
        "I am trying to make them legible without making them smaller.",
      ],
      close: "Bring me in when the thing is real, but the language around it has not caught up.",
    },
  },
};
