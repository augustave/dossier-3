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
    version: "4.0.0",
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
      title: "BIO",
      prompt: "WHO CARRIES THE PRACTICE",
      name: "EBENZ AUGUSTAVE",
      opening: "Born on the Notre Dame campus in South Bend, Indiana. Based in Brooklyn.",
      body: [
        "I am a product of Third World Culture and a childhood spent in the foreign service — raised across borders, where you learn early that meaning changes shape when it crosses one.",
        "My professional foundation is in the culinary arts: rooms, pacing, pressure, and the discipline of noticing what people need before they ask for it.",
        "Today I specialize in brand doctrine, visual languages, and transparent design systems — the visible thing, and the structure underneath it.",
      ],
      close: "Bring me in when the thing is real, but the language around it has not caught up.",

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

    // 02 — INFLUENCES. A curated constellation. List now; the interactive venn
    // is a v2 follow (PRD §13 parking lot). Eight practitioners (PRD §6 Tab 2).
    influences: {
      title: "INFLUENCES",
      prompt: "WHO SHAPED THE EYE",
      hero: "No practice develops in isolation.",
      intro:
        "A curated constellation — the practitioners whose thinking sits under the work. Shown as a list here; the interactive overlap map is a v2 follow.",
      people: [
        { name: "Neville Brody",   note: "rule-breaking systems" },
        { name: "Wangechi Mutu",   note: "transformation and collage" },
        { name: "Barbara Kruger",  note: "unforgettable visual argument" },
        { name: "Metahaven",       note: "conceptual complexity" },
        { name: "Ash Thorp",       note: "future-facing production" },
        { name: "Michael Levin",   note: "coordination and emergence" },
        { name: "Chase Hughes",    note: "adoption and behavior" },
        { name: "Kelly Johnson",   note: "constraints under reality" },
      ],
    },

    // 03 — AI. First-person statement + the Five Axioms + the AI essays
    // (PRD §6 Tab 3). The axiom label must read "Five" and Axiom V is present.
    ai: {
      title: "AI",
      prompt: "MULTIPLICATION, NOT REPLACEMENT",
      statement:
        "I do not think AI will replace our creativity in the slightest — this is about multiplication of innovation.",
      links: [
        { name: "DIRTY",         frame: "Brand as living system in the AGI era.",               href: "https://dirty.artdirector.rocks/" },
        { name: "Branding / AGI", frame: "Brand identity at the intersection of algorithm and archive.", href: "https://branding.artdirector.rocks/" },
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
      hero: "The defense work — the same practice, tested under harder constraints.",
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
      hero: "Brand under pressure — two essays.",
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
