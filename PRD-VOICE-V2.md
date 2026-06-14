# PRD — Voice Doctrine v2 (First-Person Meservey)

**Parent:** `HANDOFF.md`
**Doc version:** 1.0
**Status:** IMPLEMENTED 2026-06-12 (uncommitted). ROLE FIT pilot (§5) + fast-follow migration: M01 hero+body, M03 hero/body/grid/close, `meta`→2.0.0 + new rule. tsc clean, 20/20 tests, v2 voice-lint clean. COMPLETE site-wide: ROLE FIT + M01 + M03 + field-chart caption + M05 + WORLD MODEL hero all first person; zero impersonal prose remains (terminal notes / manifesto bullets / footer slogan kept by design).
**Supersedes:** the `copy.v1_1.ts` `meta.rule` ("no first-person pronoun…") and the v1.2.0 third-person doctrine. On implementation, `meta.version` → 2.0.0 and `meta.rule` is replaced (§4).

---

## 1. Why this exists

The dossier's substance is right; the *room* is wrong. Current copy reads as **competence performance** — a defense-tech operator pitching defense-tech operators — which is the correct register for `defense.observer` but the wrong one for a culture-fit hire. Target register: **Lulu Cheng Meservey.** Plain English, declarative, named stakes, quotable lines, zero framework-speak. The person you'd want in the room.

Test for every line: *would a smart person say this out loud to a friend?* If not, cut it.

Where v1 breaks against that standard: jargon that flags "not one of us" to non-defense readers (`visual operating language`, `EMCON confidence decay`, `Tactical Brutalism framework`, `validated claims sheet`); deck-sentences no one would say aloud ("My work sits between engineering truth and operator confidence"); and no stakes, no opinion, no taste signals. The one section already in this register is WORLD MODEL's reveal ("Control systems over aesthetics…") — it's the template, keep it.

---

## 2. The register shift

| From (v1.2.0) | To (v2) |
|---|---|
| Third person, no "I" | **First person.** "I make hard things easy to look at." |
| Skills list / artifact list | **Stakes + opinion.** Who, what's at stake, why now, why me. |
| Frameworks named as nouns | **Plain verbs.** Say the thing, not the method's name. |
| Adjective-noun compliance stacks | **One clear sentence a person would actually say.** |
| Neutral, hedged, even | **Taste by refusal.** Name what won't ship and the room you'd walk out of. |

Still binding from before: **mass over swagger** (declarative ≠ loud; confidence without brag), **evidence over claims**, no project name-drops on the dossier surface.

---

## 3. New rules

1. **First person is allowed and preferred** for thesis / role-fit / method / culture-fit moments. Warm, not braggy.
2. **Plain English only.** The "say it to a friend" test gates every line.
3. **Name the stakes.** What breaks if this hire isn't made; what kind of company would waste this person.
4. **Taste by refusal.** State what won't ship and what meeting/room is refused. This is the culture-fit signal v1 lacks.
5. **Enemies are CATEGORIES, never real people.** "A company that wants three contractors and a status update" — yes. Naming a real competitor/person as bad — never (backfires; off-limits).
6. **No framework-nouns, no jargon flags, no defense acronyms in body copy.** Acronyms (EMCON, SIGINT, etc.) live on `defense.observer`, not here.
7. **One quotable line per module** a recruiter can repeat to a hiring manager and have it land.
8. **No fabricated biography.** Every claim traces to the corpus (calm under load, whole-system sight, builds the proof, explains across audiences, refuses spectacle).

---

## 4. Rewritten voice gate (replaces the v1 lint)

**Banned (carry over):** "excited/thrilled/honored/humbled", "had the pleasure of", "passionate about", "game-changer", "leverages/unlocks" verb-spam, "AI-powered" as adjective, "reach out", "in today's fast-paced world", 3+ hashtag clusters, em-dash-and-hedge.

**Banned (new — jargon flags):** `visual operating language`, `deterministic brand systems`, `fabrication-grade governance`, `validated claims sheet`, `artifact contract`, any `…→…→… loop` named as a framework, any framework-as-noun, any defense acronym in body copy.

**Removed from the gate:** the "no first-person pronoun" prohibition. First person now passes.

**Required (new):** each module must (a) pass the say-it-to-a-friend test, (b) carry at least one named stake or refusal, (c) contain one quotable line. Enemies present? Must be a category, not a person.

### Jargon → plain swaps (apply globally)
| Flagged | Plain |
|---|---|
| "a visual operating language" | "a look the whole product agrees on" |
| "deterministic brand systems" | "one look, one set of rules" |
| "validated claims sheet" / "artifact contract" | "something you can open and check yourself" |
| "coherence → influence → ship loop" | "make it cohere, make people believe it, ship it" |
| "technical storytelling" | "make the room get it" |
| "interactive prototypes" | "something you can actually click" |

---

## 5. ROLE FIT — locked reference cut (maps to `copy.v1_1.ts` `modules["02"]`)

> First-person Meservey. This is the calibration sample; the rest of the site matches its register.

**prompt:** `WHAT TO HIRE THIS FOR`

**lead:**
"Hire me when the product is real but no one can see it yet. The gap between what a thing does and what people believe it does is where good technology goes to die. Closing it is the whole job."

**people[0] — "A look the whole product agrees on."**
"One look, one set of rules, so the product reads as built — not as a pitch. Two designers hit the same problem and draw the same answer. I won't ship work that's prettier than the thing it's selling."
*tags:* design systems · brand systems · one product, one language

**people[1] — "Something you can actually click."**
"When nobody will believe an idea until it moves, I build it for real, in code — so the team can judge how it feels, not just how it looks. A live thing you can drive, holding together under load. No hero demos that die the moment someone touches them."
*tags:* rapid prototyping · front-end · real interaction

**people[2] — "Make the room get it."**
"Hard, mission-heavy work made to land with three people at once: the operator who needs it clear, the buyer who needs to trust it, the engineer who needs it honest. Not spectacle — a better decision, backed by something real. If it can't be said plainly, it isn't ready."
*tags:* visual storytelling · systems explanation · plain-English why

**together:**
"Most teams split these three jobs across three people and a standing meeting. I'd rather do them in one head. One person who sees the whole system, builds the proof, and makes the room get it — and gets calmer, not louder, when it's on fire."

**cultureFit (new key):**
"Wrong room: three contractors and a status update. Right room: a small team that needs one person to own the whole picture and move."

**oneLine:**
"One person for the look, the build, and the reason it matters — and it holds when things break."

**signalStrip (de-jargoned):** `The look` (one product, one language) · `The proof` (something you can click) · `The why` (make the room get it)

---

## 6. Site-wide migration map (after ROLE FIT is approved)

Re-voice these for consistency; first person can't live in one module only.

- **M01 hero** — ✅ DONE → "I make hard things easy to look at — and easy to trust." (kicker "Taste with a load rating." kept; M01 body lightly first-person'd so the hero isn't stranded.)
- **M03 close** — ✅ DONE, but **NOT** the originally-suggested "I'd rather do them in one head" — that collides with ROLE FIT's `together` (the Client facet sees both 01 and 03). Method-flavored instead: "Short version: I get to proof fast, I stay calm when it breaks, and I ship nothing that can't be opened and checked." M03 hero/body/grid also first-person'd.
- **M03 DEFAULT BIAS pressure bullet** — kept; redundancy with ROLE FIT's "calmer, not louder" judged acceptable (different module job, no facet sees both phrasings back-to-back except Client, where they're a screen apart and differently framed).
- **Module 02 body / field-chart caption** — ✅ DONE. Body was already first-person'd in the fast-follow; field-chart caption → "Here's where I sit relative to peers." (footer slogan "AI-native, built to last…" kept as a slogan). Also swept the last "the practice" tells: M05 PORTFOLIOS hero + outcome line, and the WORLD MODEL *hero* ("…reveal how I work"). No impersonal prose remains on the surface.
- **WORLD MODEL reveal** — KEPT as-is (already the register; the template). Only its hero phrase "the practice" → "how I work" was touched.
- **Intentionally NOT first-person (by design):** terminal `[!]` note lines, the DEFAULT BIAS manifesto bullets (imperative), the chart footer slogan.
- **`meta`** — ✅ DONE: `version`→2.0.0; `rule`→ first person / named stakes / taste by refusal / enemies-as-categories / mass over swagger / evidence over claims; `voice` updated.

---

## 7. War-game (run before implementation)

Risk unique to v2: first person + named enemies can tip from confident to braggy. Walk the four facets; the live question is tone, not structure.
- **Collaborator** (senior peer): does "I'd rather do them in one head" read as confidence or arrogance? (mass over swagger is the kill line — if it struts, soften.)
- **Hiring Manager:** does the lead's stakes line land in the 7-minute read, or feel dramatic?
- **Academic:** does the plainness read as lack of rigor? (It shouldn't — rigor lives in WORLD MODEL + the chart.)
- **Client:** does "wrong room / right room" read as picky or as clarity?

Kill criteria: any line struts, any enemy reads as a real person, or any module loses its quotable line.

### War-game RUN 2026-06-12 — scope: ROLE FIT alone (owner chose staged rollout)

Key realization that de-risks the stage: **the rest of the site is *impersonal* (no pronoun), not third-person "he."** So a first-person ROLE FIT doesn't clash with a "he" voice — it reads as the one place the person steps forward and speaks directly. That's a feature, not an inconsistency, as long as full migration (§6) follows before the gap feels arbitrary.

| Persona (facet) | Sees ROLE FIT? | Verdict |
|---|---|---|
| Hiring Manager (01→02→05) | Yes, first thing | PASS — stakes line ("where good technology goes to die") lands fast; quotable closer is repeatable to a hiring manager |
| Client (01→03→05) | Yes, first thing | PASS — "wrong room / right room" reads as clarity, not picky |
| Collaborator (02→04→03) | Yes (03-adjacent) | PASS with watch — "I'd rather do them in one head" is the strut-risk line; mitigated by following it with the calm-under-fire clause (earns it). Hold to mass-over-swagger. |
| Academic (04→02→03) | Yes | PASS — plainness doesn't undercut rigor; rigor lives in WORLD MODEL + the chart |

**Outcome:** SHIP ROLE FIT in first person now. Defaults applied for the two unresolved §8 questions: tags lightly de-jargoned (kept as scan keywords, not removed); `cultureFit` rendered as its own short line after `together`. `meta` stays 1.3.0 — ROLE FIT is the v2 **pilot**; flip to 2.0.0 only at full-site migration. Fast-follow M01 hero + M03 close so the first-person warmth isn't stranded in one module.

---

## 8. Open questions

1. Apply v2 to the whole site in one pass, or ship ROLE FIT alone first and watch it?
2. Tags on the signal blocks — de-jargon fully (§5) or keep recruiter-scan keywords?
3. The `cultureFit` line — its own block, or folded into `together`?
