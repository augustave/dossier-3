/**
 * ThirtySecondView.jsx — CT DOSSIER · Move 1 (`?read=30s`)
 * ---------------------------------------------------------------------------
 * A self-contained, thesis-first screen. Integrated into App.tsx: App detects
 * `?read=30s` and renders this in place of the dossier stack.
 *
 * Props (all optional):
 *   onReadFull   — called by "Read the full dossier". When provided, App handles
 *                  the in-place transition (sets the hiring lens, exits 30s) and
 *                  this component does NOT touch the URL itself.
 *   mailtoHref   — overrides the computed Compose Inquiry mailto so it matches
 *                  the rest of the app (App passes CONVERSATION_MAILTO).
 *   plus any DEFAULTS field below (spear, support, forText, …) to override copy.
 *
 * Analytics events fire only if window.va (Vercel) or window.plausible exists —
 * otherwise they no-op.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useSyncExternalStore } from "react";

/* ----------------------------- editable copy ----------------------------- */
const DEFAULTS = {
  spear:
    "AI-Native Design Engineer & Art Director — I turn complex systems into visual languages.",
  support:
    "I am not trying to make complex things simple. I am trying to make them legible without making them smaller.",
  forText: "Teams whose thing is real, but the language around it hasn't caught up.",
  notForText: "Trend-cycle branding. Decoration. Spectacle.",
  fullLens: "hiring", // which lens "Read the full dossier" switches to
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

/** Switch the lens in place. Updates the URL and notifies SPA listeners; if
 *  nothing in the app reacts to `read`, it reloads as a guaranteed fallback. */
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
#ct-30s-root .core{flex:1; display:flex; flex-direction:column; justify-content:center; max-width:60ch; margin:0 auto; width:100%;}
#ct-30s-root .bet{font-size:clamp(28px,5vw,52px); line-height:1.04; letter-spacing:-.02em; font-weight:800; margin:10px 0 0;}
#ct-30s-root .support{font-size:clamp(15px,2.2vw,19px); color:var(--ink); max-width:48ch; margin:20px 0 0;}
#ct-30s-root .fornot{display:grid; grid-template-columns:1fr 1fr; gap:18px; margin:36px 0 0;}
#ct-30s-root .fornot > div{border-top:2px solid var(--ink); padding-top:10px;}
#ct-30s-root .fornot .lab{font-family:ui-monospace,monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--ink2); margin-bottom:6px;}
#ct-30s-root .fornot .val{font-size:15px; line-height:1.4;}
#ct-30s-root .ctas{display:flex; gap:12px; flex-wrap:wrap; margin:40px 0 0;}
#ct-30s-root .btn{font-family:ui-monospace,monospace; font-size:12px; letter-spacing:.12em; text-transform:uppercase;
  padding:13px 20px; border:2px solid var(--ink); background:transparent; color:var(--ink);
  cursor:pointer; text-decoration:none; display:inline-block; transition:background .12s,color .12s;}
#ct-30s-root .btn:hover{background:var(--ink); color:var(--paper);}
#ct-30s-root .btn.primary{background:var(--green); border-color:var(--green);}
#ct-30s-root .btn.primary:hover{background:var(--ink); border-color:var(--ink); color:var(--paper);}
#ct-30s-root .foot{margin-top:28px;}
@media (max-width:560px){ #ct-30s-root .fornot{grid-template-columns:1fr;} }
@media (prefers-reduced-motion:no-preference){
  #ct-30s-root .bet{animation:ct-rise .5s ease both;}
  #ct-30s-root .support{animation:ct-rise .5s .08s ease both;}
  #ct-30s-root .fornot{animation:ct-rise .5s .16s ease both;}
  #ct-30s-root .ctas{animation:ct-rise .5s .24s ease both;}
}
@keyframes ct-rise{from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;}}
`;

/* ------------------------------- component ------------------------------- */
export default function ThirtySecondView(props) {
  const c = { ...DEFAULTS, ...props };

  useEffect(() => {
    track("lens_view", { read: "30s" });
  }, []);

  const mailto =
    c.mailtoHref ||
    `mailto:${c.email}` +
      `?subject=${encodeURIComponent(c.inquirySubject)}` +
      `&body=${encodeURIComponent(c.inquiryBody)}`;

  const onReadFull = () => {
    track("lens_selected", { from: "30s", to: c.fullLens });
    if (typeof c.onReadFull === "function") c.onReadFull();
    else setLens(c.fullLens);
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

        <div className="ctas">
          <button className="btn" onClick={onReadFull}>
            Read the full dossier →
          </button>
          <a
            className="btn primary"
            href={mailto}
            onClick={() => track("cta_click_compose", { read: "30s" })}
          >
            Compose inquiry →
          </a>
        </div>
      </div>

      <div className="foot mono">{c.footer}</div>
    </div>
  );
}
