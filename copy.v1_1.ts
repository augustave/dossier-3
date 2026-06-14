/* copy.v1_1.ts
   CT Dossier copy — taste-led practice dossier.

   V3 REPOSITIONING (CT-PRD-MARY-01): the dossier moved from a
   "creative technologist" capability inventory to a taste-led practice
   dossier. Primary subject is taste; technology is supporting evidence.
   Section spine, in render order:
     01 TASTE        — where the work is sourced
     02 SEEING       — the cognitive lenses (was WORLD MODEL)
     03 DIRECTION    — how taste becomes form (holds the register explorer)
     04 NEIGHBORHOOD — adjacent practices (holds the old FIELD POSITION chart)
     05 PRACTICE     — how the work happens (was CREATIVE TECHNOLOGIST + OPERATING METHOD)
     06 PORTFOLIOS   — where the built work lives
     07 ENGAGEMENT   — when people call (replaced the ROLE MATRIX simulator)
   Voice: calmer than the v2 Meservey register — declarative, first person
   where it's natural, no self-mythologizing, no recruiter/role language. */

export const CT_DOSSIER_COPY_V120 = {
  meta: {
    version: "3.1.0",
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
        "The goal isn't to find what's trending. It's to find what continues to hold. Art movements. Religious architecture. Military doctrine. Industrial design. Institutional memory. Each one is a record of people solving hard problems under real constraint, and the work starts there — not because the past should be repeated, but because the past shows which forms survive.",
        "I sometimes call the process Anthropological Moodboarding: sourcing from deep historical and cultural strata instead of the live trend cycle. What comes out is direction that feels familiar without feeling derivative.",
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
        "Different disciplines describe the same problem in different words. The work sits in the overlap.",
      intro:
        "A military campaign. A cathedral. A software platform. A city. A brand. Each is an attempt to create coherence under constraint. Three lenses come back again and again.",
      lensesTitle: "THREE LENSES",
      lenses: [
        {
          code: "01",
          title: "SYSTEMS",
          person: "Michael Levin",
          question: "What lets parts become a coherent whole?",
          body:
            "The interest isn't biology — it's coordination. How complexity organizes itself without losing its identity.",
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

    // 03 — DIRECTION. The explicit home for art direction. Holds the register
    // explorer. V3.1: registers are now CIVILIZATIONAL, not domain-based — each
    // names a source of authority (Monastery / Forge / Oracle), so the register
    // system reads as a theory of taste rather than a palette selector.
    direction: {
      title: "DIRECTION",
      prompt: "HOW TASTE BECOMES FORM",
      hero: "Direction begins where references become decisions.",
      body: [
        "Typography. Color. Symbols. Editorial rhythm. Interface behavior.",
        "The goal isn't consistency for its own sake. It's recognition — a visual language that feels like itself wherever it shows up.",
      ].join("\n\n"),
      volTitle: "VISUAL OPERATING LANGUAGES",
      vol:
        "A visual language should not need a logo to be recognized. The type, spacing, symbols, diagrams, hierarchy, and behavior should already carry identity. Branding is what gets added. Visual language is what remains when the branding is removed.",

      registersTitle: "REGISTERS",
      registersHero: "Click a register. The source of authority changes.",
      registersFootnote: "Three registers. Different sources of authority, same discipline.",
      registers: [
        {
          code: "MN",
          name: "MONASTERY",
          domain: "Monastery",
          function: "Memory / Preservation / Restraint",
          mainLine: "Authority through restraint.",
          question: "What deserves to survive?",
          description:
            "Built from archives, rare books, field notes, religious architecture, illuminated margins, old libraries, and systems of preservation. Not nostalgic — concerned with what earns the right to remain. It uses silence, spacing, hierarchy, and material restraint to create authority. Preserved, not precious. Calm, not soft. Old enough to have memory; clear enough to be used now.",
          palette: [
            { name: "Parchment Bone", hex: "#E8E0D0", accent: false },
            { name: "Carbon Ink",     hex: "#111111", accent: false },
            { name: "Oxidized Blue",  hex: "#204C8D", accent: true  },
            { name: "Archive Grey",   hex: "#8A8A82", accent: false },
          ],
          protectedAccent: "Oxidized Blue",
          quote: "Not everything old is worth keeping. But anything that survives deserves inspection.",
          ironRule: "Nothing decorative unless it carries memory.",
          traits: [
            "Large margins", "Editorial hierarchy", "Serif emphasis",
            "Low saturation", "Document logic", "Quiet authority",
          ],
          avoid: [
            "Nostalgia cosplay", "Fake parchment", "Medieval cliché", "Museum stiffness",
          ],
        },
        {
          code: "FG",
          name: "FORGE",
          domain: "Forge",
          function: "Pressure / Endurance / Material Force",
          mainLine: "Authority through stress.",
          question: "What survives pressure?",
          description:
            "Built from foundries, shipyards, armor, tools, infrastructure, and objects designed to work before they were designed to sell. The closest register to Mass Over Swagger. It values weight, force, durability, and consequence — beauty that comes from usefulness under pressure. It should feel already tested. Clean not because it's fragile, but because anything unnecessary has been burned away.",
          palette: [
            { name: "Iron Black",    hex: "#0D0D0D", accent: false },
            { name: "Heat Rust",     hex: "#8A3A22", accent: false },
            { name: "Hammer Grey",   hex: "#5F6363", accent: false },
            { name: "Safety Orange", hex: "#FF4F00", accent: true  },
          ],
          protectedAccent: "Safety Orange",
          quote: "Effectiveness is a form of beauty.",
          ironRule: "If it cannot survive pressure, it does not belong.",
          traits: [
            "Dense blocks", "Strong rules", "Industrial spacing",
            "Material contrast", "Weighty type", "Utility-first composition",
          ],
          avoid: [
            "Tactical cosplay", "Fake military texture", "Overuse of orange", "Cyberpunk noise",
          ],
        },
        {
          code: "OR",
          name: "ORACLE",
          domain: "Oracle",
          function: "Signal / Perception / Invisible Systems",
          mainLine: "Authority through perception.",
          question: "What remains unseen?",
          description:
            "Built from radar, astronomy, bioelectric fields, intelligence diagrams, machine perception, and the attempt to make invisible systems legible. Not mystical decoration — perception design. For systems that can't be seen directly but still shape behavior: signals, fields, networks, patterns, latent structures. It should feel like the moment a hidden order becomes visible.",
          palette: [
            { name: "Anechoic Black", hex: "#0F1316", accent: false },
            { name: "Signal Green",   hex: "#42FC04", accent: true  },
            { name: "Spectral Blue",  hex: "#315CFF", accent: false },
            { name: "Ghost White",    hex: "#EDEDED", accent: false },
          ],
          protectedAccent: "Signal Green",
          quote: "The unseen still has structure.",
          ironRule: "Every signal must reveal something.",
          traits: [
            "Layered information", "Thin lines", "Signal traces",
            "Dark fields", "Diagram logic", "Emergent patterns",
          ],
          avoid: [
            "Generic AI neon", "Random particles", "Mystical fog", "Sci-fi interface cliché",
          ],
        },
      ],

      principleTitle: "WORKING PRINCIPLE",
      principle:
        "A strong visual language should survive translation — across products, teams, years, technologies, and contexts.",
      registersNote:
        "The register is not a theme. It is a rule system. It determines what the work is allowed to emphasize, what it must refuse, and where its authority comes from.",
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
        "The map shows neighboring territories — practices that share an interest in craft, technology, identity, publishing, and design. The point isn't comparison. It's orientation. Different practices optimize for different things: some for speed, some for experimentation, some for permanence. This one sits closest to where durable craft, systems thinking, visual direction, and AI-native production meet.",
      chartTitle: "A MAP OF NEIGHBORING PRACTICES",
      chartCaption:
        "Closest to the corner where durable work and AI-native production meet — a quiet part of the map.",
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

    // 05 — PRACTICE. Merges the old CREATIVE TECHNOLOGIST + OPERATING METHOD
    // into one narrative: Direction → Proof → Trust. Practitioner, not recruiter.
    practice: {
      title: "PRACTICE",
      prompt: "HOW THE WORK HAPPENS",
      hero: "The work runs across three connected layers.",
      layersTitle: "DIRECTION · PROOF · TRUST",
      layers: [
        {
          code: "01",
          title: "DIRECTION",
          body:
            "What should people understand? What should they remember? What should they believe? The visual and narrative system starts here.",
        },
        {
          code: "02",
          title: "PROOF",
          body:
            "Once the idea is clear, it becomes tangible — interfaces, diagrams, motion studies, interactive prototypes, working software. Anything a person can inspect instead of imagine.",
        },
        {
          code: "03",
          title: "TRUST",
          body:
            "Trust isn't made by aesthetics. It's made when claims survive inspection. The goal isn't persuasion; it's clarity strong enough that people can decide.",
        },
      ],
      rulesTitle: "WORKING RULES",
      rules: [
        "Evidence over claims.",
        "Build early.",
        "Explain simply.",
        "Write the rules down.",
        "Prefer inspection over presentation.",
        "Calm under load is a designed property.",
      ],
      shortTitle: "SHORT VERSION",
      short: "One head for the look, the build, and the story.",
    },

    // 06 — PORTFOLIOS. Where the built work lives. Order is taste-first:
    // art direction, then brand × product, then defense.
    portfolios: {
      title: "PORTFOLIOS",
      prompt: "WHERE THE WORK LIVES",
      hero:
        "The dossier describes the practice. The work lives elsewhere — one site per expression of the practice.",
      intro:
        "Each site stands alone. None of them needs to explain the whole system. That's this page's job.",
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
            "Doctrine-driven visual systems for autonomy, sensing, command, and technical communication. The same practice under harder constraints.",
        },
      ],
      outcomeLine:
        "The proof is distributed across the sites. This page explains why the work keeps returning to the same questions.",

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

    // 07 — ENGAGEMENT MODELS. Replaces the ROLE MATRIX simulator. Human
    // explanation of when people call, not a consulting framework or fit engine.
    engagement: {
      title: "ENGAGEMENT MODELS",
      prompt: "WHEN PEOPLE USUALLY CALL",
      hero: "Most engagements start in one of four situations.",
      models: [
        { code: "01", title: "NEW CATEGORY",         body: "The technology exists. Nobody understands it yet." },
        { code: "02", title: "TECHNICAL TRANSLATION", body: "The product works. The story doesn't." },
        { code: "03", title: "DESIGN LANGUAGE",       body: "The system functions. The identity is fragmented." },
        { code: "04", title: "EVIDENCE BUILDING",     body: "The team needs something people can inspect, not just discuss." },
      ],
      shortTitle: "SHORT VERSION",
      short: "Useful when direction, explanation, and execution need to stay connected.",
    },
  },
};
