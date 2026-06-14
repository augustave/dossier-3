/* copy.v1_1.ts
   CT Dossier copy — recruiter-facing, systems-led, deterministic.
   Source: portfolio strategy, brand brief, and current app IA. */

export const CT_DOSSIER_COPY_V120 = {
  meta: {
    version: "2.0.0",
    voice: "first-person Meservey: plain English, declarative, named stakes, taste by refusal, quotable; no framework-speak (PRD-VOICE-V2)",
    rule: "first person; say it the way a sharp person says it to a friend; name the stakes; show taste by refusal; enemies are categories not people; mass over swagger; evidence over claims; no project name-drops",
  },

  // INDEX overlay epigraph — VOICE v2 personhood touch (2026-06-12). One
  // declarative line under the INDEX wordmark; sets tone the moment the
  // index opens. Source: the Manifesto's "I build work that's built to survive."
  indexEpigraph: "I build work that's built to survive.",

  modules: {
    "01": {
      title: "CREATIVE TECHNOLOGIST",
      prompt: "PRACTICE THESIS",
      hero:
        "I make hard things easy to look at — and easy to trust.",
      // Thesis kicker — IAA integration 4.2, placement (A), owner-approved
      // 2026-06-07. Used once on the surface; nowhere else.
      heroKicker: "Taste with a load rating.",
      body:
        [
          "Most serious technology is real long before anyone can see it clearly. When that gap stays open, the best work in the building stays invisible — and a worse, louder product wins the room. Closing it is the job I take.",
          "I'm calm under pressure because I was trained to be, not because nothing's gone wrong — my father taught me young to walk straight at the worst case and ask what holds. It's why I read paintings about death, the encirclement of armies, and the alien logic of machine intelligence as the same document: each one is a record of a system under maximum load, showing which decisions held and which ones were fatal.",
          "I build the look, the working prototype, and the story for why it matters in one pass. Evidence over claims. Things you can click over things you can only watch. Work that holds up when an engineer leans in.",
          "I don't ship things because they look impressive. Strip the styling away — if it stops making sense, it was never finished. I'd rather make a true thing legible than make a thin thing look good."
        ].join("\n\n"),
      noteTitle: "NOTE",
      noteLines: [
        "[!] One head for the look, the build, and the story.",
        "[!] Interface, narrative, and logic stay in the same hands.",
        "[!] If it can't be said plainly, it isn't ready.",
      ],

      // Field position chart (Doc 2 axes, pole labels amended v1.1:
      // method Craft-native↔AI-native horizontal, output Ephemeral↔Durable
      // vertical). Plotted designers and Ven's position are doctrine-locked;
      // see PRD-FIELD-POSITION.md §9 changelog for the 2026-06-07 amendment.
      fieldPositionTitle: "FIELD POSITION",
      fieldPositionAbove: "Here's where I sit relative to peers.",
      fieldPositionBelow: "AI-native, built to last — a sparse quadrant by design.",
      fieldPositionAxes: {
        xLeft: "CRAFT-NATIVE",
        xRight: "AI-NATIVE",
        yTop: "EPHEMERAL",
        yBottom: "DURABLE"
      },
      // Quadrant labels name work-modes, not the plotted people.
      fieldPositionQuadrants: {
        tl: "TREND CRAFT",
        tr: "FAST & DISPOSABLE",
        bl: "LEGACY CRAFT",
        br: "DOCTRINE-LED AI"
      },
      fieldPositionLegendPeers: "peer designers",
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
        // v1.1: repositioned from x62/y70 — doctrine-lock amendment,
        // owner-signed 2026-06-07. Lock re-applies at this coordinate.
        x: 72,
        y: 78,
        label: "VEN",
        sub: "Doctrine + agent orchestration"
      },

    },

    // VOICE v2 PILOT (PRD-VOICE-V2, war-gamed 2026-06-12): this module is
    // first-person "Meservey" — the rest of the site is still impersonal v1.3.0
    // until full migration (§6). Do not third-person this module back.
    "02": {
      title: "ROLE FIT",
      prompt:
        "WHAT TO HIRE THIS FOR",
      lead:
        [
          "Hire me when the product is real but no one can see it yet.",
          "The gap between what a thing does and what people believe it does is where good technology goes to die. Closing it is the whole job."
        ].join("\n"),
      people: [
        {
          name: "A look the whole product agrees on.",
          body:
            [
              "One look, one set of rules, so the product reads as built — not as a pitch. Two designers hit the same problem and draw the same answer.",
              "I won't ship work that's prettier than the thing it's selling."
            ].join("\n\n"),
          tags: ["design systems", "brand systems", "one product, one language"],
          prevents: "Polish that doesn't cohere."
        },
        {
          name: "Something you can actually click.",
          body:
            [
              "When nobody will believe an idea until it moves, I build it for real, in code — so the team can judge how it feels, not just how it looks. A live thing you can drive, holding together under load.",
              "No hero demos that die the moment someone touches them."
            ].join("\n\n"),
          tags: ["rapid prototyping", "front-end", "real interaction"],
          prevents: "Demos that can't survive contact with use."
        },
        {
          name: "Make the room get it.",
          body:
            [
              "Hard, mission-heavy work made to land with three people at once: the operator who needs it clear, the buyer who needs to trust it, the engineer who needs it honest.",
              "Not spectacle — a better decision, backed by something real. If it can't be said plainly, it isn't ready."
            ].join("\n\n"),
          tags: ["visual storytelling", "systems explanation", "plain-English why"],
          prevents: "Good work trapped inside engineering context."
        },
      ],
      together:
        [
          "Most teams split these three jobs across three people and a standing meeting. I'd rather do them in one head.",
          "One person who sees the whole system, builds the proof, and makes the room get it — and gets calmer, not louder, when it's on fire."
        ].join("\n"),
      cultureFit:
        "Wrong room: three contractors and a status update. Right room: a small team that needs one person to own the whole picture and move.",
      oneLine:
        "One person for the look, the build, and the reason it matters — and it holds when things break.",

      // Three-signal coordinate strip — small visual anchor at the
      // top of Module 01. Mirrors the field-position chart's "this is
      // a coordinate" pattern at the role-fit scale. Each strip cell
      // = one of the three hiring signals.
      signalStripTitle: "THREE SIGNALS",
      signalStrip: [
        { code: "01", label: "The look",  sub: "One product, one language" },
        { code: "02", label: "The proof", sub: "Something you can click" },
        { code: "03", label: "The why",   sub: "Make the room get it" }
      ]
    },

    "03": {
      title: "OPERATING METHOD",
      prompt: "HOW THE WORK HAPPENS",
      hero: "I move fast from idea to proof — and the work still has to hold together.",
      body:
        [
          "I'm best on teams that need one person to set the look, build the prototype, and tighten the reason the product matters.",
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
        "Calm under load is a designed property, not a temperament. The worse the situation, the more deliberate the work.",
      ],
      grid: {
        leftTitle: "PRIMARY TENSION",
        leftBody: "I run ahead of the paperwork while an idea is still taking shape.",
        rightTitle: "COUNTER-BALANCE",
        rightBody: "Once it's proven real, I lock the rules down so the work stays reusable.",
      },
      // close: deliberately NOT "I'd rather do them in one head" — that line
      // belongs to ROLE FIT (modules["02"].together); the Client facet sees
      // both 01 and 03, so this close stays method-flavored to avoid repeat.
      close:
        "Short version: I get to proof fast, I stay calm when it breaks, and I ship nothing that can't be opened and checked.",

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
      hero: "My built work lives at three sites — one per register.",
      outcomeLine: "Each site stands alone. None of them tries to say what I do — that's this page's job.",
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
      hero: "Three people I'd recruit into a Skunkworks. The picks reveal how I work.",
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
