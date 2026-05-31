/* copy.v1_1.ts
   CT Dossier copy — recruiter-facing, systems-led, deterministic.
   Source: portfolio strategy, brand brief, and current app IA. */

export const CT_DOSSIER_COPY_V120 = {
  meta: {
    version: "1.2.0",
    voice: "plainspoken, named stakes, no frameworks-as-nouns",
    rule: "no first-person pronoun; personal and warm, the way a sharp person talks; no project name-drops",
  },

  modules: {
    "01": {
      title: "CREATIVE TECHNOLOGIST",
      prompt: "PRACTICE THESIS",
      hero:
        "Complex technical work, made easy to look at — and easy to trust.",
      body:
        [
          "Most serious technology is real long before anyone can see it clearly. That gap — between what the engineering actually does and what a person believes about it — is the whole job here.",
          "The look, the working prototype, and the story for why it matters, built together. Evidence over claims. Things you can click over things you can only watch. Work that holds up when an engineer leans in.",
          "Nothing ships because it looks impressive. Strip the styling away, and if it stops making sense, it was never finished."
        ].join("\n\n"),
      noteTitle: "NOTE",
      noteLines: [
        "[!] One head for the look, the build, and the story.",
        "[!] Interface, narrative, and logic stay in the same hands.",
        "[!] If it can't be said plainly, it isn't ready.",
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
        "WHERE IT'S STRONGEST",
      lead:
        [
          "Best brought in when the product is real but nobody can see it yet.",
          "Not one medium — the whole thing, made readable at a glance."
        ].join("\n"),
      people: [
        {
          name: "Visual Operating Languages",
          body:
            [
              "One consistent look, so a product reads as built and serious instead of speculative. One fixed set of rules, so two people never draw the same thing two different ways.",
              "Type, hierarchy, diagrams, and the small rules that keep everything feeling like one product."
            ].join("\n\n"),
          tags: ["design systems", "brand systems", "interface grammar"],
          prevents: "Work that looks polished but does not cohere."
        },
        {
          name: "Interactive Prototypes",
          body:
            [
              "When an idea has to move before anyone will believe it, it gets built — not described. Hundreds of things on screen at once, holding together under load. A live workstation people can actually drive.",
              "Real front-end code, so a team can judge how it feels, not just how it looks."
            ].join("\n\n"),
          tags: ["rapid prototyping", "front-end", "interaction architecture"],
          prevents: "Concepts that sound strong but cannot survive contact with use."
        },
        {
          name: "Technical Storytelling",
          body:
            [
              "Dense, mission-heavy work, made to land with three different people in the same room: the operator who needs it clear, the buyer who needs to trust it, the engineer who needs it honest.",
              "Not spectacle. A better decision, backed by something real."
            ].join("\n\n"),
          tags: ["visual storytelling", "systems explanation", "product narrative"],
          prevents: "Important work that stays trapped inside engineering context."
        },
      ],
      together:
        [
          "Put together, the signal is simple:",
          "someone who sees the whole system, builds the proof, and explains it to a room that doesn't share a vocabulary."
        ].join("\n"),
      oneLine:
        "One person for the look, the build, and the story.",

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
      prompt: "HOW THE WORK HAPPENS",
      hero: "Fast from idea to proof — but the work still has to hold together.",
      body:
        [
          "Best on teams that need one person to set the look, build the prototype, and tighten the reason the product matters.",
          "It starts with the spine: what the operator has to know, what the buyer has to believe, what the system has to show. Everything else hangs off that.",
          "Then the fog turns into things you can hold — interface studies, motion tests, mockups, diagrams, live prototypes.",
          "The rule underneath all of it: evidence over claims. Nothing goes out that can't be backed with something you can open and check yourself in half an hour."
        ].join("\n\n"),
      bulletsTitle: "DEFAULT BIAS",
      bullets: [
        "Treat a product as something to be understood, not just a stack of features.",
        "Every claim points at proof. No assertion without something you can open.",
        "Prototype early to find out if people believe it — before polish gets expensive.",
        "Write the rules down once, so the next project inherits them instead of rebuilding from scratch.",
      ],
      grid: {
        leftTitle: "PRIMARY TENSION",
        leftBody: "Runs ahead of the paperwork while an idea is still taking shape.",
        rightTitle: "COUNTER-BALANCE",
        rightBody: "Once it's proven real, the rules get locked down so the work stays reusable.",
      },
      close:
        "Short version: most useful where design, product sense, and plain explanation have to live in one head.",

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
      hero: "Three people worth recruiting into a Skunkworks. The picks reveal the practice.",
      intro:
        "Levin, Hughes, Johnson — three people who run invisible systems. Not loud, not busy; they move outcomes by understanding the control layer underneath. Stacked together, they're three layers of one machine.",
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
        "Control systems over aesthetics. High-stakes environments over comfort. Paradigm-changers over optimizers. A bias toward synthesis. Not a product — an operating system for outcomes.",
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
