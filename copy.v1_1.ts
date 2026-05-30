/* copy.v1_1.ts
   CT Dossier copy — recruiter-facing, systems-led, deterministic.
   Source: portfolio strategy, brand brief, and current app IA. */

export const CT_DOSSIER_COPY_V120 = {
  meta: {
    version: "1.2.0",
    voice: "personal-technical",
    rule: "first-person, no hype, no mysticism",
  },

  modules: {
    "01": {
      title: "CREATIVE TECHNOLOGIST",
      prompt: "PRACTICE THESIS",
      hero:
        "I design systems that make complex technical work legible.",
      body:
        [
          "My work sits between engineering truth and operator confidence. I have done this across C2 theater simulators managing 1,500+ simultaneous tracks, autonomous drone swarm visualizations, and deterministic brand systems for defense-software products.",
          "I build visual operating languages, interactive prototypes, and technical narratives for products that have to be understood before they can be trusted. The method is consistent: evidence over claims, working artifacts over slide decks, and design that holds up under technical scrutiny.",
          "The through-line: turn difficult systems into clear interfaces, proof artifacts, and stories that survive contact with engineers, operators, and procurement."
        ].join("\n\n"),
      noteTitle: "NOTE",
      noteLines: [
        "[!] Multidisciplinary by default.",
        "[!] Interface, narrative, and system logic stay connected.",
        "[!] If it cannot be explained clearly, it is not ready.",
      ],

      // Field position chart (Doc 2 axes: Craft↔AI horizontal,
      // Velocity↔Permanence vertical). Plotted designers and Ven's
      // position are doctrine-locked; see PRD-FIELD-POSITION.md.
      fieldPositionTitle: "FIELD POSITION",
      fieldPositionAbove: "Here is where the practice sits relative to peers.",
      fieldPositionBelow: "AI-leveraged, permanence-oriented. A sparse quadrant by design.",
      fieldPositionAxes: {
        xLeft: "CRAFT",
        xRight: "AI",
        yTop: "VELOCITY",
        yBottom: "PERMANENCE"
      },
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
        { name: "Haas",           x: 95, y: 14 }
      ],
      fieldPositionVen: {
        x: 62,
        y: 70,
        label: "VEN",
        sub: "Doctrine + agent orchestration"
      },

    },

    "02": {
      title: "ROLE FIT",
      prompt:
        "WHAT I DO BEST",
      lead:
        [
          "I am strongest in roles that sit between concept, product, and technical communication.",
          "The value is not one medium. The value is making the whole system readable."
        ].join("\n"),
      people: [
        {
          name: "Visual Operating Languages",
          body:
            [
              "I build coherent visual systems for products that need to feel credible, disciplined, and operational rather than speculative. DEADLIGHT codifies trust/proof/consequence framing into a reusable grammar. CYPHER generates deterministic tactical marks from cryptographic seeds with fabrication-grade governance.",
              "That includes interface grammar, typography, hierarchy, diagrams, and documentation patterns that scale across screens, decks, and classified-style artifacts."
            ].join("\n\n"),
          tags: ["design systems", "brand systems", "interface grammar"],
          prevents: "Work that looks polished but does not cohere."
        },
        {
          name: "Interactive Prototypes",
          body:
            [
              "I do not stop at static comps when the idea needs behavior to be believed. TAK-G is a theater-level C2 simulator rendering 1,500+ entities with swarm kinematics, EMCON confidence decay, and zero-trust SIGINT ghost tracks. GREY-EARTH is a live tactical terrain workstation with Earth Engine integration.",
              "I build in React, Vite, Three.js, and vanilla WebGL stacks so teams can evaluate flow, not just appearance."
            ].join("\n\n"),
          tags: ["rapid prototyping", "front-end", "interaction architecture"],
          prevents: "Concepts that sound strong but cannot survive contact with use."
        },
        {
          name: "Technical Storytelling",
          body:
            [
              "I translate dense engineering, autonomy, geospatial, and mission-oriented ideas into recruiter-ready, stakeholder-ready, and operator-legible artifacts. The Tactical Brutalism framework I developed bridges three audiences simultaneously: operators who need lethality clarity, stakeholders who need compliance confidence, and engineers who need architectural honesty.",
              "The goal is not spectacle. It is a stronger decision surface backed by evidence."
            ].join("\n\n"),
          tags: ["visual storytelling", "systems explanation", "product narrative"],
          prevents: "Important work that stays trapped inside engineering context."
        },
      ],
      together:
        [
          "Together these form the core hiring signal:",
          "1) coherent systems thinking,",
          "2) working prototypes,",
          "3) clear communication for technical audiences."
        ].join("\n"),
      oneLine:
        "I bridge system logic, interface behavior, and technical narrative in one practice.",

      // Three-signal coordinate strip — small visual anchor at the
      // top of Module 01. Mirrors the field-position chart's "this is
      // a coordinate" pattern at the role-fit scale. Each strip cell
      // = one of the three hiring signals.
      signalStripTitle: "THREE SIGNALS",
      signalStrip: [
        { code: "01", label: "Visual systems",      sub: "Design language" },
        { code: "02", label: "Interactive proto.",  sub: "Product proof" },
        { code: "03", label: "Technical narrative", sub: "Systems translation" }
      ]
    },

    "03": {
      title: "OPERATING METHOD",
      prompt: "HOW I WORK",
      hero: "I move from concept to proof quickly, but I still need the work to hold together.",
      body:
        [
          "I work well on teams that need someone to define the visual language, prototype the interaction, and tighten the story around why the product matters.",
          "My default move is to find the governing structure first: what the operator needs to know, what the stakeholder needs to believe, and what the system needs to show.",
          "From there I turn ambiguity into artifacts: interface studies, motion tests, mockups, diagrams, deck systems, or live prototypes.",
          "The operating principle that runs through the portfolio is evidence over claims. Each project carries a validated claims sheet, a test plan, and a case study designed to survive a 30-minute technical walkthrough."
        ].join("\n\n"),
      bulletsTitle: "DEFAULT BIAS",
      bullets: [
        "Treat complex products as communication systems, not just feature sets.",
        "Every external claim maps to test or report evidence. No assertion without artifact.",
        "Use prototypes to test credibility and flow before polish becomes expensive.",
        "Codify the grammar into a reusable system: 10 defense-adjacent projects now share a common artifact contract covering architecture, threat model, validation, and case study.",
      ],
      grid: {
        leftTitle: "PRIMARY TENSION",
        leftBody: "I can sprint ahead of formalization when the concept is still unfolding.",
        rightTitle: "COUNTER-BALANCE",
        rightBody: "Codify the grammar once the signal is real so the system stays reusable.",
      },
      close:
        "The short version: I am most useful where design, product sense, and technical articulation need to meet in one person.",

      // Doctrine-in-motion explorer. Moved here from Module 02 per
      // war-game findings (PRD-DOCTRINE-EXPLORER.md §placement-v2).
      // Operating Method is the explorer's natural home — it literally
      // shows the operational output of the method described above.
      // Visible to Client, Collaborator, and Academic audiences.
      doctrineExplorerTitle: "DOCTRINE IN MOTION",
      doctrineExplorerHero: "Click a register. The rules switch.",
      doctrineExplorerFootnote: "Three of N canonical registers. Different domains, same engineering.",
      registers: [
        {
          code: "CW",
          name: "Coldwater Pragmatism",
          domain: "Maritime",
          palette: [
            { name: "Haze grey",      hex: "#6F777C", accent: false },
            { name: "Anechoic black", hex: "#0F1316", accent: false },
            { name: "Safety orange",  hex: "#FF4F00", accent: true  }
          ],
          thesis: "The ocean doesn't care about your DoD rating. Build like it.",
          ironRule: "One protected accent — safety orange — for alert, survival, flotation. Never decoration."
        },
        {
          code: "RB",
          name: "Rustbelt Kinetic",
          domain: "Industrial",
          palette: [
            { name: "Bridgeport green", hex: "#3D5C44", accent: false },
            { name: "Forged iron",      hex: "#2B2B2B", accent: false },
            { name: "MIG arc-blue",     hex: "#7AB5FF", accent: true  }
          ],
          thesis: "The prototype is the brochure. The line is the product.",
          ironRule: "Cultural lineage required. A palette without 30+ year industrial heritage is a moodboard."
        },
        {
          code: "AN",
          name: "Anechoic Minimal",
          domain: "Spectrum",
          palette: [
            { name: "True blackout",   hex: "#000000", accent: false },
            { name: "Mu-metal silver", hex: "#B8B8B0", accent: false },
            { name: "P31 phosphor",    hex: "#3CFF7A", accent: true  }
          ],
          thesis: "Spectrum is terrain. We hold the high ground.",
          ironRule: "Anti-glint is doctrine. Matte only. The only permitted shine is environmental."
        }
      ]
    },

    "04": {
      title: "PORTFOLIOS",
      prompt: "WHERE THE WORK LIVES",
      hero: "The built work lives at three dedicated sites — one per register.",
      outcomeLine: "Each site stands alone. None of them tries to say what the practice is — that's this dossier's job.",
      body: "",
      wedgesTitle: "",
      wedges: [] as string[],
      _archivedWedges: [
        "Tactical OS: visual governance, component grammar, and interface rules for high-assurance environments.",
        "Spatial Intelligence: terrain, sensor, and geospatial products that make evidence readable across surfaces.",
        "Autonomous Command: swarm, simulation, and operational prototypes that show system behavior under load.",
        "High-Assurance Safety: human-factors, bias mitigation, and trust-building interfaces for consequential decisions.",
      ],
      // first30 retired — per-project proof lines now live on the
      // three portfolio sites (artdirector.rocks / brandproduct.dev /
      // defense.observer). The dossier no longer doubles as casework.
      first30Title: "",
      first30: "",
      companiesTitle: "",
      companies: [] as Array<{
        name: string;
        tagline: string;
        why: string;
        match: string;
        proof: string;
        artifact: string;
        link: string;
        doctrineExcerpt?: { quote: string; source: string };
      }>,
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
             source: "Five-Question Gate, Q5 — BRAND_DECISION_MATRIX"
           },
           link: "https://github.com/augustave/deadlight"
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
             source: "DOSSIER VOL Specification v3.0, §0 Ethos"
           },
           link: "https://github.com/augustave/DossierMap"
        },
        {
           name: "GREY-EARTH",
           tagline: "Live tactical terrain workstation",
           why: "A production-minded terrain analysis surface with real interaction logic, map workflows, and operator-facing clarity.",
           match: "Product design + front-end implementation",
           proof: "Proves I can ship a live workstation, not just a visual concept.",
           artifact: "Terrain analysis workflows, 2D/3D map modes, Earth Engine integration, and a manifest-first render model.",
           link: "https://grey-earth.vercel.app"
        },
        {
           name: "TACTICAL CANVAS",
           tagline: "Mission workflow prototype",
           why: "An interface study focused on visible task flow, command confidence, and stronger mission-state communication.",
           match: "Rapid prototyping + systems UI",
           proof: "Proves I can prototype mission logic so users see the full thread from observation to tasking. Validated through a 30-minute technical walkthrough dry run.",
           artifact: "Shared mission state, radar surface work, dossier layers, and an end-to-end interaction story.",
           link: "https://github.com/augustave/TACTICAL-CANVAS"
        },
        {
           name: "MINI-D",
           tagline: "Autonomy verification lab",
           why: "A research-grade sandbox for making autonomy claims testable, bounded, and easier to inspect.",
           match: "Simulation design + falsifiable proof",
           proof: "Proves I can design evaluation environments, not just hero demos.",
           artifact: "Chain-of-verification, comms-degradation scenarios, and comparative baseline testing through limits, thresholds, and inspectable outputs.",
           link: "https://github.com/augustave/MINI-D"
        },
        {
           name: "WAR-F",
           tagline: "Brutalist typographic swarm simulator",
           why: "A 64-agent drone-swarm doctrine simulator rendered as a Maciunas-Fluxus / Swiss-brutalist diagram in pure black and white.",
           match: "Simulation design + visual doctrine",
           proof: "Proves I can render system behavior as a structural diagram, not a sci-fi UI — and that doctrine and aesthetic can be the same artifact.",
           artifact: "Four finite cost surfaces (Latency / Bandwidth / Endurance / Attention), gated commitment doctrine, trust-degradation visuals, inverted-block state grammar.",
           link: "https://github.com/augustave/warfare"
        },
        {
           name: "CCRT",
           tagline: "Human-factors and bias mitigation study",
           why: "An evidence-led interface direction for warfighter-centered command environments and safer decision-making.",
           match: "Human factors + high-assurance UI",
           proof: "Proves I can use interface design to reduce misread risk instead of simply making complex systems look advanced.",
           artifact: "Bias-mitigation framing, safety-critical readability, and operator-centered command surface design.",
           link: "https://github.com/augustave/CCRT"
        },
        {
           name: "TAK-G",
           tagline: "Theater-level C2 simulator",
           why: "A high-fidelity command-and-control visualization managing 1,500+ multi-domain tracks with swarm kinematics and zero-trust guardrails.",
           match: "Simulation design + systems UI + front-end engineering",
           proof: "Proves I can build production-grade interaction systems for high-density operational environments, not just concepts.",
           artifact: "Three.js WebGL renderer, topological swarm cohesion, EMCON confidence decay, uncertain pointer framework, and full telemetry HUD.",
           link: "https://tak-h.vercel.app/"
        }
      ],
      companiesSynthesis: "",
      portfolioSitesTitle: "",
      portfolioSites: [
        {
          domain: "artdirector.rocks",
          register: "Art direction",
          frame: "Editorial, typographic, identity. Where the page is the product."
        },
        {
          domain: "brandproduct.dev",
          register: "Brand × product",
          frame: "Design systems, interface grammar, shipped product surfaces. The non-defense lane."
        },
        {
          domain: "defense.observer",
          register: "Defense",
          frame: "Doctrine-driven visual systems for autonomy, sensing, and command. The lane this dossier orbits."
        }
      ],
      doctrineCardsTitle: "",
      doctrineCardsHero: "",
      doctrineCards: [] as Array<any>,
      _archivedDoctrineCards: [
        {
          name: "SEAL",
          thesisLine: "Brand doctrine for defense-tech, organized along the sea / air / land operational taxonomy.",
          doctrineExcerpt: {
            quote: "Sea, air, land — every domain has a doctrine. Every doctrine has a look.",
            source: "SEAL README"
          },
          artifactFormat: "skill" as const,
          governingUnits: "5 palettes / 8 iron rules / 6 document types",
          proves: "I can codify a brand doctrine as a distributable skill — typology, rules, and document grammar that other practitioners can install and obey.",
          link: "https://augustave.github.io/SEAL/",
          domain: "cross-domain" as const,
          implementations: [
            { name: "DEADRISE — Coldwater Pragmatism v1.0",   link: "https://github.com/augustave/DEADRISE",         pending: true },
            { name: "ARS-RUSBELT — Rustbelt Kinetic",         link: "https://github.com/augustave/ARS-RUSBELT",      pending: true },
            { name: "ANECHOIC MINIMAL — spectrum doctrine",   link: "https://github.com/augustave/ANECHOIC-MINIMAL", pending: true }
          ]
        },
        {
          name: "DYNAMISM DOSSIER",
          thesisLine: "Declassified-archive presentation of the American Dynamism thesis, derived from 7+ hours of primary-source interviews.",
          doctrineExcerpt: {
            quote: "How do we win the next century? Not by becoming more like them. By becoming more like us.",
            source: "Dynamism Dossier, Plate 10"
          },
          artifactFormat: "interactive" as const,
          governingUnits: "66 entities / 10 transcripts / 8 doctrines / 12 archival plates",
          proves: "I can run a real corpus-to-structure pipeline — entity extraction, thesis decomposition, doctrine extraction via a reusable 18-field YAML template — and render the result as a navigable feedback-looped interface.",
          link: "https://augustave.github.io/dynamism/",
          domain: "editorial" as const,
          implementations: [
            { name: "New Media Operating System (a16z-style swarm)", link: "https://augustave.github.io/new-media-operating-system-demo/" },
            { name: "A16Z Editorial Webapp (4-surface product)",     link: "https://github.com/augustave/AD-A16Z",                            pending: true }
          ]
        },
        {
          name: "LIFT BENCH",
          thesisLine: "Founder engineering bench for the DARPA Lift Challenge — agent orchestration as a substitute for a traditional aero/mech team.",
          doctrineExcerpt: {
            quote: "The realistic competitive target is one of the three $500K innovation awards. The 'most promising overall' category rewards novel configuration and systems-level thinking.",
            source: "LIFT_BENCH.md, Strategic Position"
          },
          artifactFormat: "framework" as const,
          governingUnits: "3 cells (Airframe / Power / Program) / star topology / 1 decision gate",
          proves: "I can design a multi-agent engineering bench against a real DARPA constraint set (≤55 lbs, 4:1 payload-to-weight, 5 NM VTOL circuit) and reason explicitly about what agents can and cannot do.",
          link: "https://github.com/augustave/LIFT-STDY",
          domain: "air" as const
        }
      ]
    },

    worldModel: {
      title: "WORLD MODEL",
      prompt: "WHAT MY THREE PICKS REVEAL",
      hero: "I'd recruit three people into a Skunkworks. The picks reveal the practice.",
      intro:
        "Levin, Hughes, Johnson — three operators of invisible systems. Not doers, not talkers; people who steer reality by understanding the control layer underneath it. Read as a stack, they are three layers of one machine.",
      layersTitle: "THREE LAYERS OF ONE MACHINE",
      layers: [
        {
          layer: "KERNEL",
          sub: "Self-organizing substrate",
          person: "Michael Levin · Tufts",
          body: "Treats biology as a programmable, goal-seeking information system — bioelectric signals as the control layer for form and repair. He gives me a framework for designing systems where parts reliably assemble into wholes, even after damage."
        },
        {
          layer: "MIDDLEWARE",
          sub: "Human interface",
          person: "Chase Hughes",
          body: "Operationalizes human behavior under uncertainty — baseline, deviation, incentive, frame control. Treats persuasion as systems engineering, not charisma. The difference between great tech and a system humans actually adopt."
        },
        {
          layer: "APPLICATION",
          sub: "Ship engine",
          person: "Kelly Johnson · Skunk Works",
          body: "Built impossible machines fast by making constraints and simplicity do the heavy lifting. Skunk Works wasn't a vibe; it was an operating system — small teams, direct comms, rapid decisions, test early."
        }
      ],
      revealTitle: "WHAT THE PICKS SAY",
      reveal:
        "Control systems over aesthetics. High-stakes environments over comfort. Paradigm-changers over optimizers. A bias toward synthesis. I am not trying to make a product — I am trying to make an operating system for outcomes.",
      frameworkTitle: "THE LOOP",
      framework: [
        "Coherence — what must stay true for the system to work; the signals that separate healthy from drifting.",
        "Influence — who must believe what, and what behavior must change for adoption.",
        "Ship — the smallest real deployment that proves value in the wild."
      ],
      close:
        "Three failure modes kill ambitious work: the system won't cohere, the humans won't align, the thing won't ship. Each pick solves one."
    },
  },
};
