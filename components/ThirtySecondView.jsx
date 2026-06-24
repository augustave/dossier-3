/**
 * ThirtySecondView.jsx — CT DOSSIER · Move 1 (`?read=30s`)
 * ---------------------------------------------------------------------------
 * Thesis-first screen rendered in place of the dossier stack when ?read=30s.
 * On-doctrine skin: the app's type system (Inter / Playfair / JetBrains Mono via
 * Tailwind), matte strata-cream paper + ink, and matte button treatment (no neon
 * fill). The lower CTA row is a FOLDING LENS SELECTOR ("Read as —"): each lens
 * is one Record Card — folded (label + descriptor + ▸) / unfolded (detail +
 * Path/Best-if/Time + "Enter this reading →"). Accordion, reversible, respects
 * prefers-reduced-motion.
 *
 * Props (all optional):
 *   onEnter(value) — applies the lens + exits 30s in place (App handles it).
 *   mailtoHref     — Compose Inquiry mailto (App passes CONVERSATION_MAILTO).
 *   plus DEFAULTS copy fields below.
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
  forText: "Teams whose thing is real, but the language around it hasn't caught up.",
  notForText: "Trend-cycle branding. Decoration. Spectacle.",
  defaultOpen: "hiring", // which card is unfolded on load (null = all folded)
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

const LENS_CARDS = [
  ...AUDIENCES.map((a) => ({
    label: titleCase(a.label),
    value: a.id,
    desc: toDescriptor(a.helper),
    detail: a.helper,
    fields: [
      ["Path", a.modules.join(" → ")],
      ["Best if", (PER_LENS[a.id] || {}).bestIf || "—"],
      ["Time", (PER_LENS[a.id] || {}).time || "—"],
    ],
  })),
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

  const label = "font-mono text-micro uppercase tracking-[0.25em] text-black/40";

  return (
    <div
      id="ct-30s-root"
      role="region"
      aria-label="CT Dossier — 30 second read"
      className="fixed inset-0 z-50 overflow-auto bg-strata-cream text-strata-black flex flex-col px-6 py-8 md:px-12 md:py-12"
    >
      <style>{FOLD_CSS}</style>

      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <span className={label}>CT DOSSIER · 30s</span>
        <span className={label}>Ebenz Augustave</span>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full max-w-3xl mx-auto py-8">
        <span className={`${label} rise`}>The bet</span>
        <h1 className="rise font-sans font-black tracking-tightest leading-[1.04] text-3xl md:text-5xl lg:text-[3.4rem] mt-2">
          {c.spear}
        </h1>
        <p className="rise-1 font-sans text-base md:text-lg leading-relaxed text-black/80 max-w-[48ch] mt-5">
          {c.support}
        </p>

        <div className="rise-2 grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
          <div className="border-t-2 border-black pt-2">
            <div className={`${label} text-black/45 mb-1.5`}>For</div>
            <div className="font-sans text-sm md:text-base leading-snug">{c.forText}</div>
          </div>
          <div className="border-t-2 border-black pt-2">
            <div className={`${label} text-black/45 mb-1.5`}>Not for</div>
            <div className="font-sans text-sm md:text-base leading-snug">{c.notForText}</div>
          </div>
        </div>

        {/* Folding lens selector — pick the reading written for you. */}
        <div className="lenses rise-3 mt-8 border-t border-black/15">
          <div className={`${label} mt-3.5 mb-1`}>Read as —</div>
          {LENS_CARDS.map((lens) => {
            const isOpen = open === lens.value;
            const panelId = `lens-panel-${lens.value}`;
            return (
              <div className="lens border-b border-black/15" key={lens.value} data-open={isOpen}>
                <button
                  type="button"
                  className="w-full flex items-baseline justify-between gap-4 bg-transparent text-left py-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-strata-black rounded-sm"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(lens.value)}
                >
                  <span className="flex items-baseline gap-3 md:gap-4 flex-wrap min-w-0">
                    <span className="font-mono text-sm font-bold uppercase tracking-[0.1em]">{lens.label}</span>
                    <span className="font-mono text-micro uppercase tracking-[0.08em] text-black/45">{lens.desc}</span>
                  </span>
                  <span className="lens-chev font-mono text-xs text-black/40 shrink-0" aria-hidden="true">▸</span>
                </button>
                <div className="lens-panel" id={panelId} role="region" aria-label={`${lens.label} reading`}>
                  <div className="lens-inner">
                    <p className="font-sans text-sm md:text-base leading-relaxed text-black/80 max-w-[54ch] pt-0.5 pb-3">
                      {lens.detail}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1.5 pb-3.5">
                      {lens.fields.map(([k, v]) => (
                        <span className="flex gap-2 font-mono text-micro tracking-[0.05em]" key={k}>
                          <b className="text-black/45 uppercase font-semibold whitespace-nowrap">{k}</b>
                          <span>{v}</span>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => enter(lens.value)}
                      className="font-mono text-xs uppercase tracking-widest border border-black/40 px-4 py-2 mb-4 hover:bg-strata-black hover:text-strata-cream hover:border-strata-black focus:outline-none focus-visible:ring-1 focus-visible:ring-strata-black transition-colors"
                    >
                      Enter this reading →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <a
            href={mailto}
            onClick={() => track("cta_click_compose", { read: "30s" })}
            className="inline-block font-mono text-xs uppercase tracking-widest border-b border-black/60 pb-0.5 hover:bg-strata-black hover:text-strata-cream hover:border-strata-black transition-colors"
          >
            Compose inquiry →
          </a>
        </div>
      </div>

      <div className={label}>{c.footer}</div>
    </div>
  );
}
