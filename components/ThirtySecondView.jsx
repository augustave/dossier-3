/**
 * ThirtySecondView.jsx — CT DOSSIER · Move 1 (`?read=30s`)
 * ---------------------------------------------------------------------------
 * Thesis-first LANDING rendered in place of the dossier stack when ?read=30s.
 * Structure (V2, "Thesis-First, One Door" — design-panel winner):
 *   1. masthead strip
 *   2. BET ZONE (vertically dominant): kicker + spear (display) + support +
 *      an inline For/Not "fit line" (no separate block)
 *   3. ONE primary door — the only filled / only strata-blue element:
 *      "Enter the recommended reading →" routes to the hiring lens, with a
 *      mono route sub-label previewing the path.
 *   4. subordinate "Or read as —" folding lens rack (client / collaborator /
 *      academic / full dossier). Hiring lives in the door, not the rack.
 *   5. quiet footer: Compose inquiry + Built work lives elsewhere (links out).
 *
 * Doctrine: matte only (no glow/gradient/shadow/scale); strata-blue is the lone
 * accent and the lone fill; mono = metadata, Inter = titles/actions; strata-clay
 * earns exactly one job (the For/Not ticks). The folding accordion is preserved
 * verbatim (transformation-without-addition, reversibility, aria, reduced-motion).
 *
 * Props (all optional): onEnter(value), mailtoHref, + DEFAULTS copy fields.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { AUDIENCES } from "../constants";

/* ----------------------------- editable copy ----------------------------- */
const DEFAULTS = {
  spear:
    "AI-Native Design Engineer & Art Director — I turn complex systems into visual languages.",
  support:
    "I am not trying to make complex things simple. I am trying to make them legible without making them smaller.",
  forText: "teams whose thing is real, but the language around it hasn't caught up.",
  notForText: "trend-cycle branding, decoration, spectacle.",
  recommended: "hiring", // the lens the primary door routes to
  defaultOpen: null, // all rack cards folded by default (hiring is the door)
  email: "ebenz.aug@gmail.com",
  inquirySubject: "CT DOSSIER — fit",
  inquiryBody: [
    "I saw CT DOSSIER and wanted to discuss fit around:",
    "",
    "What is real:",
    "",
    "Where the language has not caught up:",
    "",
  ].join("\n"),
  footer: "CT DOSSIER · This is not a portfolio. The built work lives elsewhere.",
};

// Built work lives elsewhere — a footnote exit, never a competing module.
const WORK_SITES = ["artdirector.rocks", "brandproduct.dev", "defense.observer"];

/* ------------------------- lens cards (data-driven) ---------------------- */
const titleCase = (s) => s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

// "Recommended path: taste, systems, and built work." -> "taste · systems · built work"
const toDescriptor = (helper) =>
  helper
    .replace(/^recommended path:\s*/i, "")
    .replace(/\.\s*$/, "")
    .replace(/,?\s+and\s+/gi, " · ")
    .replace(/,\s*/g, " · ");

const PER_LENS = {
  hiring: { bestIf: "you're hiring design leadership", time: "~5 min" },
  client: { bestIf: "your thing is real but illegible", time: "~6 min" },
  collab: { bestIf: "you want to think or build together", time: "~6 min" },
  acad: { bestIf: "you want the framework and its sources", time: "~7 min" },
};

const toCard = (a) => ({
  label: titleCase(a.label),
  value: a.id,
  desc: toDescriptor(a.helper),
  detail: a.helper,
  fields: [
    ["Path", a.modules.join(" → ")],
    ["Best if", (PER_LENS[a.id] || {}).bestIf || "—"],
    ["Time", (PER_LENS[a.id] || {}).time || "—"],
  ],
});

const RECOMMENDED = AUDIENCES.find((a) => a.id === DEFAULTS.recommended);
const RECOMMENDED_CARD = RECOMMENDED ? toCard(RECOMMENDED) : null;

// Rack = every lens EXCEPT the recommended one (it lives in the door) + Full.
const LENS_CARDS = [
  ...AUDIENCES.filter((a) => a.id !== DEFAULTS.recommended).map(toCard),
  {
    label: "Full Dossier",
    value: "full",
    desc: "the whole archive · in order",
    detail: "Every module, unfiltered, in narrative order — the complete read.",
    fields: [
      ["Path", "00 → 08"],
      ["Best if", "you have time to read it all"],
      ["Time", "~12 min"],
    ],
  },
];

/* ------------------------------- analytics ------------------------------- */
function track(event, props = {}) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.va === "function") window.va("event", { name: event, ...props });
    else if (typeof window.plausible === "function") window.plausible(event, { props });
  } catch (_) {
    /* analytics is best-effort; never block the UI */
  }
}

/* --------------------------- read the ?read param ------------------------ */
export function useReadParam() {
  const subscribe = (cb) => {
    window.addEventListener("popstate", cb);
    return () => window.removeEventListener("popstate", cb);
  };
  const get = () =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("read");
  return useSyncExternalStore(subscribe, get, () => null);
}

/** Fallback router used only when no onEnter prop is supplied. */
function setLens(value, reloadFallback = true) {
  const url = new URL(window.location.href);
  url.searchParams.set("read", value);
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
  if (reloadFallback) {
    setTimeout(() => {
      const stillHere = new URLSearchParams(window.location.search).get("read") === value;
      if (stillHere && document.getElementById("ct-30s-root")) window.location.reload();
    }, 50);
  }
}

/* ------ scoped CSS: ONLY the fold motion (Tailwind can't tween grid-rows) -- */
const FOLD_CSS = `
#ct-30s-root .lenses{perspective:1000px;}
#ct-30s-root .lens-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .32s ease;}
#ct-30s-root .lens[data-open="true"] .lens-panel{grid-template-rows:1fr;}
#ct-30s-root .lens-inner{overflow:hidden;transform-origin:top center;transform:rotateX(-7deg);opacity:0;transition:transform .32s ease,opacity .25s ease;}
#ct-30s-root .lens[data-open="true"] .lens-inner{transform:none;opacity:1;}
#ct-30s-root .lens-chev{transition:transform .25s ease;}
#ct-30s-root .lens[data-open="true"] .lens-chev{transform:rotate(90deg);}
@media (prefers-reduced-motion:reduce){
  #ct-30s-root .lens-panel,#ct-30s-root .lens-inner,#ct-30s-root .lens-chev{transition:none;}
  #ct-30s-root .lens-inner{transform:none;}
}
@media (prefers-reduced-motion:no-preference){
  #ct-30s-root .rise{animation:ct-rise .5s ease both;}
  #ct-30s-root .rise-1{animation:ct-rise .5s .08s ease both;}
  #ct-30s-root .rise-2{animation:ct-rise .5s .16s ease both;}
  #ct-30s-root .rise-3{animation:ct-rise .5s .24s ease both;}
}
@keyframes ct-rise{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
`;

/* ------------------------------- component ------------------------------- */
export default function ThirtySecondView(props) {
  const c = { ...DEFAULTS, ...props };
  const [open, setOpen] = useState(c.defaultOpen);

  useEffect(() => {
    track("lens_view", { read: "30s" });
  }, []);

  const mailto =
    c.mailtoHref ||
    `mailto:${c.email}` +
      `?subject=${encodeURIComponent(c.inquirySubject)}` +
      `&body=${encodeURIComponent(c.inquiryBody)}`;

  const toggle = (value) =>
    setOpen((cur) => {
      const next = cur === value ? null : value;
      if (next) track("lens_unfold", { lens: value });
      return next;
    });

  const enter = (value) => {
    track("lens_selected", { from: "30s", to: value });
    if (typeof c.onEnter === "function") c.onEnter(value);
    else setLens(value);
  };

  // Shared token shorthands (named tokens, not raw utilities).
  const META = "font-mono text-micro uppercase tracking-ultra text-strata-black opacity-subtle";
  const KEY = "font-mono text-micro uppercase tracking-wider text-strata-black opacity-muted";
  const routePath = RECOMMENDED_CARD ? RECOMMENDED_CARD.fields[0][1] : "";
  const routeTime = (PER_LENS[c.recommended] || {}).time || "";

  return (
    <div
      id="ct-30s-root"
      role="region"
      aria-label="CT Dossier — 30 second read"
      className="fixed inset-0 z-50 overflow-auto bg-strata-cream text-strata-black flex flex-col px-6 py-8 md:px-12 md:py-10"
    >
      <style>{FOLD_CSS}</style>

      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <span className={META}>CT DOSSIER · 30s</span>
        <span className={META}>Ebenz Augustave</span>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full max-w-3xl mx-auto py-6">
        {/* BET ZONE — vertically dominant */}
        <span className="rise font-mono text-micro uppercase tracking-ultra text-strata-black opacity-subtle">The bet</span>
        <h1 className="rise font-sans font-black tracking-tightest leading-[1.04] text-heading md:text-display lg:text-hero text-strata-black mt-2">
          {c.spear}
        </h1>
        <p className="rise-1 font-sans text-body-lg leading-relaxed text-strata-black opacity-tertiary max-w-[46ch] mt-4">
          {c.support}
        </p>
        {/* Fit line — one inline qualifier, NOT a separate block */}
        <p className="rise-1 font-sans text-caption text-strata-black opacity-tertiary max-w-[52ch] mt-3">
          <span className="font-mono text-micro uppercase tracking-ultra text-strata-clay mr-1.5 whitespace-nowrap">For</span>
          {c.forText}{" "}
          <span className="font-mono text-micro uppercase tracking-ultra text-strata-clay mr-1.5 whitespace-nowrap">Not for</span>
          {c.notForText}
        </p>

        {/* PRIMARY DOOR — the only filled / only strata-blue element */}
        <div className="rise-2 mt-8">
          <button
            type="button"
            onClick={() => enter(c.recommended)}
            className="font-sans font-bold text-body-lg text-white bg-strata-blue px-6 py-3.5 transition-colors hover:bg-strata-black focus:outline-none focus-visible:ring-1 focus-visible:ring-strata-black focus-visible:ring-offset-2 focus-visible:ring-offset-strata-cream"
          >
            Enter the recommended reading →
          </button>
          {RECOMMENDED_CARD && (
            <p className={`${KEY} mt-2.5`}>
              {RECOMMENDED_CARD.label} path · {routePath} · {routeTime}
            </p>
          )}
        </div>

        {/* SUBORDINATE RACK — the folding lens selector */}
        <div className="lenses rise-3 mt-9 border-t border-strata-black opacity-ghost" />
        <div className="rise-3 lenses">
          <div className={`${KEY} mt-3.5 mb-1`}>Or read as —</div>
          {LENS_CARDS.map((lens) => {
            const isOpen = open === lens.value;
            const panelId = `lens-panel-${lens.value}`;
            return (
              <div className="lens border-b border-strata-black/10" key={lens.value} data-open={isOpen}>
                <button
                  type="button"
                  className="group w-full flex items-baseline justify-between gap-4 bg-transparent text-left py-3 pl-3 -ml-3 border-l-2 border-transparent transition-colors hover:bg-strata-black/5 hover:border-strata-black/40 focus:outline-none focus-visible:bg-strata-black/5 focus-visible:border-strata-black/40"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(lens.value)}
                >
                  <span className="flex items-baseline gap-3 md:gap-4 flex-wrap min-w-0">
                    <span className="font-sans font-semibold text-caption tracking-tight text-strata-black opacity-secondary group-hover:opacity-primary">
                      {lens.label}
                    </span>
                    <span className="font-mono text-micro uppercase tracking-wider text-strata-black opacity-muted">
                      {lens.desc}
                    </span>
                  </span>
                  <span className="lens-chev font-mono text-micro text-strata-black opacity-muted group-hover:opacity-secondary shrink-0" aria-hidden="true">▸</span>
                </button>
                <div className="lens-panel" id={panelId} role="region" aria-label={`${lens.label} reading`}>
                  <div className="lens-inner">
                    <p className="font-sans text-caption leading-relaxed text-strata-black opacity-tertiary max-w-[54ch] pt-0.5 pb-3">
                      {lens.detail}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1.5 pb-3.5">
                      {lens.fields.map(([k, v]) => (
                        <span className="flex gap-2 font-mono text-micro tracking-wide" key={k}>
                          <b className={KEY}>{k}</b>
                          <span className="text-strata-black opacity-secondary">{v}</span>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => enter(lens.value)}
                      className="font-mono text-micro uppercase tracking-wider text-strata-black border border-strata-black/40 px-4 py-2 mb-4 transition-colors hover:bg-strata-black hover:text-strata-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-strata-black"
                    >
                      Enter this reading →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* QUIET FOOTER ROW — conversion + work exit, both ink-on-cream */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <a
            href={mailto}
            onClick={() => track("cta_click_compose", { read: "30s" })}
            className="inline-block font-mono text-micro uppercase tracking-wider text-strata-black border-b border-strata-black/50 pb-0.5 transition-colors hover:bg-strata-black hover:text-strata-cream w-fit"
          >
            Compose inquiry →
          </a>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={KEY}>Built work lives elsewhere</span>
            {WORK_SITES.map((d, i) => (
              <span key={d} className="flex items-baseline gap-2">
                <a
                  href={`https://${d}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-micro text-strata-black opacity-secondary border-b border-strata-black/40 transition-colors hover:bg-strata-black hover:text-strata-cream"
                >
                  {d}
                </a>
                {i < WORK_SITES.length - 1 && <span className="font-mono text-micro text-strata-black opacity-faint">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={META}>{c.footer}</div>
    </div>
  );
}
