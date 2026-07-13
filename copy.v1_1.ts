/* copy.v1_1.ts
   CT Dossier copy — V4.0.0 "site swap" (PRD-dossier-swap).

   The dossier moved from the taste-led 8-fold spine to the PRD's five-section
   calling-card spine. Frame (top, before the folds): the human thesis,
   "THE BRAIN IS THE PRODUCT" (lives in CreaseMap). Then five folds:
     01 BIO                — the human root + the neighborhood map + My First CPO
     02 INFLUENCES         — the curated constellation (8 practitioners)
     03 AI                 — statement + the Five Axioms + AI essays
     04 AMERICAN DYNAMISM  — the defense center (Hand of God / Am. Dynamo / White Girls)
     05 BRAND              — Under Fire + Creative Strategy
   Voice: first person where natural (esp. BIO/AI), plainspoken, no
   self-mythologizing. "Tab" in the PRD == "fold" here (owner confirmed). */

export const CT_DOSSIER_COPY_V120 = {
  meta: {
    version: "4.0.2",
    voice: "first person where natural (bio, AI); plainspoken; a polymath read as one mind, not a résumé; mass over swagger",
    rule: "the brain is the product; the through-line is one obsession across creative tech, defense, and brand; link out to the deep portfolios rather than repeat them",
  },

  // INDEX overlay epigraph — the swap thesis, plainly. Sets tone on open.
  indexEpigraph: "Different disciplines, one obsession. The brain is the product.",

  modules: {
    // 01 — BIO. The human root of the practice + the neighborhood map + the
    // My First CPO article.
    //
    // NOTE (owner action pending): opening/body reconstructed from the PRD bio
    // spine (PRD-dossier-swap §6, Tab 1), which trails off with "…". Facts are
    // strictly those the PRD states; the connective prose is a draft for the
    // owner's edit — replace `body`/`opening` with the final bio text.
    bio: {
      title: "BIOGRAPHY",
      prompt: "WHO CARRIES THE PRACTICE",
      name: "EBENZ AUGUSTAVE",
      opening: "Born on the Notre Dame campus in South Bend, Indiana. Based in Brooklyn.",
      body: [
        "I am a product of Third World Culture and a childhood spent in the foreign service — raised across borders, where you learn early that meaning changes shape when it crosses one.",
        "My professional foundation is in the culinary arts. My background taught me to read rooms, pressure, timing, and ambiguity before I ever called it design.",
        "The kitchen gave me pacing. Photography gave me the eye. Product design gave me the system. AI gave me the new surface.",
      ],

      // My First CPO — the BIO article (PRD §6 Tab 1).
      article: {
        eyebrow: "ARTICLE",
        title: "My First CPO",
        subtitle: "The unlikely product-design lessons from my father",
        href: "https://cpo-blue.vercel.app",
      },

      // "Where Do I Fall" — the neighborhood map (moved into BIO per PRD §6/§7).
      // Quadrants relabelled to neutral; framing line converts naming into
      // citation. Chart geometry is locked.
      chartTitle: "A MAP OF NEIGHBORING PRACTICES",
      chartFraming: "Practitioners I study and measure myself against.",
      chartCaption:
        "The corner where durable work meets AI-native production — a quiet part of the map.",
      fieldPositionAxes: {
        xLeft: "CRAFT-NATIVE",
        xRight: "AI-NATIVE",
        yTop: "EPHEMERAL",
        yBottom: "DURABLE",
      },
      fieldPositionQuadrants: {
        tl: "CULTURAL",
        tr: "HIGH-VELOCITY",
        bl: "HERITAGE CRAFT",
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
        label: "ME",
      },
    },

    // 02 — INFLUENCES. A curated constellation rendered as an interactive
    // lineage atlas. Eight practitioners (PRD §6 Tab 2).
    influences: {
      title: "INFLUENCES",
      prompt: "WHO SHAPED THE EYE",
      hero: "No practice develops in isolation.",
      intro:
        "I do not treat references as moodboard decoration. I study people, systems, buildings, interfaces, campaigns, rituals, and machines that solved real problems under pressure. Then I translate what still holds.",
      intro2:
        "A useful reference is not something to imitate. It is something that survived contact with reality.",
      quote: "I grew up between LOCKHEED and GQ Magazine.",
      // Atlas fields: id/number/name/shortLabel/inheritanceLine/angleDegrees/
      // category are the coordinate source of truth; images fill the slice.
      people: [
        {
          id: "brody",
          number: "01",
          name: "Neville Brody",
          shortLabel: "rule-breaking systems",
          note: "rule-breaking systems",
          inheritance: "Break the grid without losing the system.",
          inheritanceLine: "Break the grid without losing the system.",
          angleDegrees: -67.5,
          category: "TYPOGRAPHY",
          images: [
            { src: "/atlas/brody-work-1.jpeg", kind: "work", scale: 1.08, focusX: 0.42, focusY: 0.48 },
            { src: "/atlas/brody-work-2.jpg", kind: "work" },
          ],
        },
        {
          id: "mutu",
          number: "02",
          name: "Wangechi Mutu",
          shortLabel: "transformation and collage",
          note: "transformation and collage",
          inheritance: "Collage as transformation, not decoration.",
          inheritanceLine: "Collage as transformation, not decoration.",
          angleDegrees: -22.5,
          category: "FORM",
          images: [
            { src: "/atlas/mutu-work-1.jpeg", kind: "work", scale: 2.1, focusX: 0.5, focusY: 0.16 },
            { src: "/atlas/mutu-work-2.jpeg", kind: "work", scale: 2.4, focusX: 0.5, focusY: 0.12 },
          ],
        },
        {
          id: "kruger",
          number: "03",
          name: "Barbara Kruger",
          shortLabel: "unforgettable visual argument",
          note: "unforgettable visual argument",
          inheritance: "Language as visual weapon.",
          inheritanceLine: "Language as visual weapon.",
          angleDegrees: 22.5,
          category: "ARGUMENT",
          images: [
            { src: "/atlas/kruger-work-1.jpeg", kind: "work", scale: 1.7, focusX: 0.5, focusY: 0.35 },
          ],
        },
        {
          id: "metahaven",
          number: "04",
          name: "Metahaven",
          shortLabel: "conceptual complexity",
          note: "conceptual complexity",
          inheritance: "Complex systems can still have a visual charge.",
          inheritanceLine: "Complex systems can still have a visual charge.",
          angleDegrees: 67.5,
          category: "THEORY",
          images: [
            { src: "/atlas/metahaven-work-1.png", kind: "work", scale: 1.24, focusX: 0.52, focusY: 0.42 },
            { src: "/atlas/metahaven-work-2.png", kind: "work" },
          ],
        },
        {
          id: "ash_thorp",
          number: "05",
          name: "Ash Thorp",
          shortLabel: "future-facing production",
          note: "future-facing production",
          inheritance: "Production quality as a world-building tool.",
          inheritanceLine: "Production quality as a world-building tool.",
          angleDegrees: 112.5,
          category: "PRODUCTION",
          images: [
            { src: "/atlas/thorp-work-1.png", kind: "work", scale: 1.38, focusX: 0.45, focusY: 0.48 },
            { src: "/atlas/thorp-work-2.png", kind: "work" },
          ],
        },
        {
          id: "michael_levin",
          number: "06",
          name: "Michael Levin",
          shortLabel: "coordination and emergence",
          note: "coordination and emergence",
          inheritance: "Intelligence as coordination across parts.",
          inheritanceLine: "Intelligence as coordination across parts.",
          angleDegrees: 157.5,
          category: "EMERGENCE",
          images: [
            { src: "/atlas/levin-f.svg", kind: "diagram", scale: 1.0, focusX: 0.5, focusY: 0.5 },
          ],
        },
        {
          id: "chase_hughes",
          number: "07",
          name: "Chase Hughes",
          shortLabel: "adoption and behavior",
          note: "adoption and behavior",
          inheritance: "Systems only matter if humans can adopt them.",
          inheritanceLine: "Systems only matter if humans can adopt them.",
          angleDegrees: 202.5,
          category: "BEHAVIOR",
          images: [
            { src: "/atlas/hughes-work-1.jpg", kind: "work", scale: 1.7, focusX: 0.52, focusY: 0.2 },
          ],
        },
        {
          id: "kelly_johnson",
          number: "08",
          name: "Kelly Johnson",
          shortLabel: "constraints under reality",
          note: "constraints under reality",
          inheritance: "Beauty under hard operational constraint.",
          inheritanceLine: "Beauty under hard operational constraint.",
          angleDegrees: 247.5,
          category: "ENGINEERING",
          images: [
            { src: "/atlas/johnson-work-1.jpg", kind: "work", scale: 1.35, focusX: 0.45, focusY: 0.52 },
            { src: "/atlas/johnson-work-2.jpeg", kind: "work" },
          ],
        },
      ],
      atlasLabel:
        "Influence atlas: eight practitioners arranged as a radial lineage map — Neville Brody, Wangechi Mutu, Barbara Kruger, Metahaven, Ash Thorp, Michael Levin, Chase Hughes, and Kelly Johnson. Hovering or focusing a name draws a vector to its coordinate.",
    },

    // 03 — AI. First-person statement + the Five Axioms + the AI essays
    // (PRD §6 Tab 3). The axiom label must read "Five" and Axiom V is present.
    ai: {
      title: "ARTIFICIAL INTELLIGENCE",
      prompt: "MULTIPLICATION, NOT REPLACEMENT",
      statement:
        "I do not think AI replaces creativity. I think it changes where creativity lives.",
      statementBody:
        "As machines take on more production, human value moves toward direction, taste, judgment, restraint, and the ability to make intelligence legible to other humans. The design problem is no longer only how something looks. It is how something thinks, explains itself, and earns trust.",
      links: [
        { register: "Tool", name: "DIRTY",         frame: "Brand as living system in the AGI era.",               href: "https://dirty.artdirector.rocks/" },
        { register: "Tool", name: "Branding / AGI", frame: "Brand identity at the intersection of algorithm and archive.", href: "https://branding.artdirector.rocks/" },
      ],
      axiomsTitle: "THE FIVE AXIOMS OF ALGORITHMIC INNOVATION",
      axiomsCountLabel: "Five",
      axioms: [
        { numeral: "I",   title: "Relentless Innovation", note: "Beyond the Known" },
        { numeral: "II",  title: "Limitless Creativity",  note: "Unbound Imagination" },
        { numeral: "III", title: "Disruption is Progress", note: "Challenge Boundaries" },
        { numeral: "IV",  title: "Intelligence First",    note: "Logic Amplifies Beauty" },
        { numeral: "V",   title: "Visual Impact",         note: "Command Memory" },
      ],
    },

    // 04 — AMERICAN DYNAMISM. The defense center (PRD §6 Tab 4). Three outbound
    // pieces. Frames left minimal — not fabricating descriptions of the works.
    americanDynamism: {
      title: "AMERICAN DYNAMISM",
      prompt: "THE DEFENSE CENTER",
      hero: "My perspective will always center on contributing to the development of technology that serves the following pillars:",
      pillars: ["Family", "Industry", "Defense"],
      links: [
        { name: "Hand of God",     register: "Project",  href: "https://augustave.github.io/HANDOFGOD" },
        { name: "American Dynamo", register: "Thesis",   href: "https://american-dynamo.vercel.app" },
        { name: "White Girls",     register: "Project",  href: "https://whitegirls.note.menu" },
      ],
    },

    // 05 — BRAND. Two essays (PRD §6 Tab 5). Outbound URLs are TBD in the PRD;
    // wired to the existing local PDF assets as placeholders until the owner
    // supplies the public links.
    brand: {
      title: "BRAND",
      prompt: "WHERE THE LANGUAGE HOLDS",
      hero: "Brand is where the language holds.",
      sub: "Not the logo. Not the campaign. The deeper system: what the company refuses, what it repeats, what it protects, and what still reads when the surface changes. A useful brand is not louder. It is harder to break.",
      // pending: true → local PDF placeholder; swap href when the outbound URL lands.
      essays: [
        {
          title: "Under Fire",
          subtitle: "Product thinking and the Battle of Stalingrad",
          ctaLabel: "READ PAPER",
          href: "library/design-under-fire-stalingrad.pdf",
          pending: true,
        },
        {
          title: "Creative Strategy",
          subtitle: "Ethos and compliant go-to-market for defense startups",
          ctaLabel: "READ STRATEGY",
          href: "library/creative-strategy-5-4.pdf",
          pending: true,
        },
      ],
    },
  },
};
