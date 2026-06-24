/**
 * ThirtySecondView.jsx — CT DOSSIER · Move 1 (`?read=30s`)
 * ---------------------------------------------------------------------------
 * Thesis-first screen rendered in place of the dossier stack when ?read=30s.
 * The lower CTA row is a FOLDING LENS SELECTOR ("Read as —"): each lens is one
 * Record Card in two states — folded (label + descriptor + ▸) and unfolded
 * (detail + fields + "Enter this reading →"). Accordion (one open at a time),
 * fully reversible, respects prefers-reduced-motion. "Enter" routes to the lens.
 *
 * Props (all optional):
 *   onEnter(value) — called by a card's "Enter this reading". When provided, App
 *                    applies the lens + exits 30s in place (no reload).
 *   mailtoHref     — Compose Inquiry mailto (App passes CONVERSATION_MAILTO).
 *   plus DEFAULTS copy fields below.
 *
 * Analytics fire only if window.va / window.plausible exists — otherwise no-op.
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
const titleCase = (s) =>
  s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

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
/** Reads the current `?read=` value and re-renders if it changes (SPA-safe). */
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

/* -------------------------------- styles --------------------------------- */
/* Matte doctrine: paper #F2EFE4 (strata-cream), ink near-black, one signature
   green accent (#42FC04) reserved for the primary CTA. No gloss, no gradient. */
const CSS = `
#ct-30s-root{
  --paper:#F2EFE4; --ink:#15140F; --ink2:#52503f; --line:#cdc8b4; --green:#42FC04;
  position:fixed; inset:0; background:var(--paper); color:var(--ink);
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
  display:flex; flex-direction:column; padding:clamp(20px,5vw,56px);
  overflow:auto; z-index:50; -webkit-font-smoothing:antialiased;
}
#ct-30s-root .mono{font-family:ui-monospace,"SF Mono","Roboto Mono",Menlo,monospace;
  font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:var(--ink2);}
#ct-30s-root .top{display:flex; justify-content:space-between; align-items:baseline; gap:12px; flex-wrap:wrap;}
#ct-30s-root .core{flex:1; display:flex; flex-direction:column; justify-content:center; max-width:64ch; margin:0 auto; width:100%;}
#ct-30s-root .bet{font-size:clamp(26px,4.4vw,46px); line-height:1.05; letter-spacing:-.02em; font-weight:800; margin:10px 0 0;}
#ct-30s-root .support{font-size:clamp(14px,2vw,18px); color:var(--ink); max-width:48ch; margin:16px 0 0;}
#ct-30s-root .fornot{display:grid; grid-template-columns:1fr 1fr; gap:18px; margin:26px 0 0;}
#ct-30s-root .fornot > div{border-top:2px solid var(--ink); padding-top:8px;}
#ct-30s-root .fornot .lab{font-family:ui-monospace,monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--ink2); margin-bottom:5px;}
#ct-30s-root .fornot .val{font-size:14px; line-height:1.4;}

/* Folding lens selector */
#ct-30s-root .lenses{margin:30px 0 0; border-top:1px solid var(--line); perspective:900px;}
#ct-30s-root .lenstitle{margin:14px 0 4px;}
#ct-30s-root .lens{border-bottom:1px solid var(--line);}
#ct-30s-root .lens__head{width:100%; display:flex; align-items:baseline; justify-content:space-between; gap:14px;
  background:transparent; border:0; cursor:pointer; text-align:left; padding:13px 2px; color:var(--ink); font:inherit;}
#ct-30s-root .lens__l{display:flex; align-items:baseline; gap:14px; flex-wrap:wrap; min-width:0;}
#ct-30s-root .lens__label{font-family:ui-monospace,monospace; font-size:13px; letter-spacing:.1em; text-transform:uppercase; font-weight:700;}
#ct-30s-root .lens__desc{font-family:ui-monospace,monospace; font-size:11px; letter-spacing:.06em; color:var(--ink2); text-transform:uppercase;}
#ct-30s-root .lens__chev{font-family:ui-monospace,monospace; font-size:12px; color:var(--ink2); transition:transform .25s ease; flex:0 0 auto;}
#ct-30s-root .lens[data-open="true"] .lens__chev{transform:rotate(90deg);}
#ct-30s-root .lens__panel{display:grid; grid-template-rows:0fr; transition:grid-template-rows .3s ease;}
#ct-30s-root .lens[data-open="true"] .lens__panel{grid-template-rows:1fr;}
#ct-30s-root .lens__inner{overflow:hidden; transform-origin:top center; transform:rotateX(-7deg); opacity:.0; transition:transform .3s ease,opacity .25s ease;}
#ct-30s-root .lens[data-open="true"] .lens__inner{transform:rotateX(0); opacity:1;}
#ct-30s-root .lens__detail{font-size:14px; line-height:1.5; max-width:54ch; padding:2px 0 12px;}
#ct-30s-root .lens__fields{display:flex; flex-wrap:wrap; gap:5px 22px; padding:0 0 14px;}
#ct-30s-root .lens__field{display:flex; gap:8px; font-family:ui-monospace,monospace; font-size:11px; letter-spacing:.05em;}
#ct-30s-root .lens__field b{color:var(--ink2); text-transform:uppercase; font-weight:700; white-space:nowrap;}
#ct-30s-root .lens__enter{font-family:ui-monospace,monospace; font-size:12px; letter-spacing:.12em; text-transform:uppercase;
  padding:11px 18px; border:2px solid var(--green); background:var(--green); color:var(--ink); cursor:pointer;
  margin:0 0 16px; transition:background .12s,color .12s,border-color .12s;}
#ct-30s-root .lens__enter:hover{background:var(--ink); border-color:var(--ink); color:var(--paper);}

#ct-30s-root .compose{margin:18px 0 0;}
#ct-30s-root .compose a{font-family:ui-monospace,monospace; font-size:12px; letter-spacing:.12em; text-transform:uppercase;
  color:var(--ink); text-decoration:none; border-bottom:1px solid var(--ink); padding-bottom:2px;}
#ct-30s-root .compose a:hover{background:var(--ink); color:var(--paper); border-color:var(--ink);}
#ct-30s-root .foot{margin-top:24px;}

#ct-30s-root *:focus-visible{outline:2px solid var(--ink); outline-offset:2px;}
@media (max-width:560px){ #ct-30s-root .fornot{grid-template-columns:1fr;} }
@media (prefers-reduced-motion:no-preference){
  #ct-30s-root .bet{animation:ct-rise .5s ease both;}
  #ct-30s-root .support{animation:ct-rise .5s .08s ease both;}
  #ct-30s-root .fornot{animation:ct-rise .5s .16s ease both;}
  #ct-30s-root .lenses{animation:ct-rise .5s .24s ease both;}
}
@media (prefers-reduced-motion:reduce){
  #ct-30s-root .lens__panel{transition:none;}
  #ct-30s-root .lens__inner{transition:none; transform:none;}
  #ct-30s-root .lens__chev{transition:none;}
}
@keyframes ct-rise{from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;}}
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

  const toggle = (value) => {
    setOpen((cur) => {
      const next = cur === value ? null : value;
      if (next) track("lens_unfold", { lens: value });
      return next;
    });
  };

  const enter = (value) => {
    track("lens_selected", { from: "30s", to: value });
    if (typeof c.onEnter === "function") c.onEnter(value);
    else setLens(value);
  };

  return (
    <div id="ct-30s-root" role="region" aria-label="CT Dossier — 30 second read">
      <style>{CSS}</style>

      <div className="top">
        <span className="mono">CT DOSSIER · 30s</span>
        <span className="mono">Ebenz Augustave</span>
      </div>

      <div className="core">
        <span className="mono">The bet</span>
        <h1 className="bet">{c.spear}</h1>
        <p className="support">{c.support}</p>

        <div className="fornot">
          <div>
            <div className="lab">For</div>
            <div className="val">{c.forText}</div>
          </div>
          <div>
            <div className="lab">Not for</div>
            <div className="val">{c.notForText}</div>
          </div>
        </div>

        {/* Folding lens selector — pick the reading written for you. */}
        <div className="lenses">
          <div className="mono lenstitle">Read as —</div>
          {LENS_CARDS.map((lens) => {
            const isOpen = open === lens.value;
            const panelId = `lens-panel-${lens.value}`;
            return (
              <div className="lens" key={lens.value} data-open={isOpen}>
                <button
                  type="button"
                  className="lens__head"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(lens.value)}
                >
                  <span className="lens__l">
                    <span className="lens__label">{lens.label}</span>
                    <span className="lens__desc">{lens.desc}</span>
                  </span>
                  <span className="lens__chev" aria-hidden="true">▸</span>
                </button>
                <div className="lens__panel" id={panelId} role="region" aria-label={`${lens.label} reading`}>
                  <div className="lens__inner">
                    <p className="lens__detail">{lens.detail}</p>
                    <div className="lens__fields">
                      {lens.fields.map(([k, v]) => (
                        <span className="lens__field" key={k}>
                          <b>{k}</b>
                          <span>{v}</span>
                        </span>
                      ))}
                    </div>
                    <button type="button" className="lens__enter" onClick={() => enter(lens.value)}>
                      Enter this reading →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="compose">
          <a href={mailto} onClick={() => track("cta_click_compose", { read: "30s" })}>
            Compose inquiry →
          </a>
        </div>
      </div>

      <div className="foot mono">{c.footer}</div>
    </div>
  );
}
