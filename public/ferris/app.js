/* ============================================================
   DOSSIER — FERRIS · influence astrolabe engine
   Polar layout · live vector arrows · cardboard physics
   ============================================================ */
'use strict';

/* ---------- DATA ------------------------------------------- */
/* angle: degrees clockwise from north · r: board units (viewBox 1000, c=500)
   clips: dx/dy offsets in board units, w width in board units,
   ar = aspect ratio (w/h), tilt in deg, z stacking          */

const INFLUENCES = [
  {
    id:'NV', name:'NEVILLE BRODY', disc:'GRAPHIC LANGUAGE', angle:12, r:398,
    caption:'TYPE AS INSURGENCY. THE FACE, FUSE, ANTI-GRIDS. LANGUAGE TURNED GRAPHIC WEAPON.',
    clips:[
      {src:'IMAGES/NB_P.jpg',   alt:'Neville Brody portrait',    dx:60, dy:-44, w:64, ar:.70, tilt:8,  z:3},
      {src:'IMAGES/NV_01.jpeg', alt:'Neville Brody poster grid', dx:-36, dy:-8, w:114, ar:.80, tilt:6,  z:2},
      {src:'IMAGES/NV_02.jpg',  alt:'Ocean’s Twelve one-sheet', dx:54, dy:30, w:84, ar:.68, tilt:-11, z:1}
    ]
  },
  {
    id:'MTHV', name:'METAHAVEN', disc:'CRITICAL DESIGN', angle:96, r:404,
    caption:'DESIGN AS GEOPOLITICS. PROPAGANDA RESEARCH, SOFT POWER, COGNITIVE FUTURES.',
    clips:[
      {src:'IMAGES/MTHV_01.png', alt:'Metahaven — The Hard Question of Art', dx:-22, dy:-36, w:106, ar:.80, tilt:-5, z:2},
      {src:'IMAGES/MTVH_02.png', alt:'Metahaven — A Case for Geo-Design',   dx:42,  dy:52,  w:112, ar:1.01, tilt:9, z:1}
    ]
  },
  {
    id:'BK', name:'BARBARA KRUGER', disc:'PROPAGANDA / TEXT', angle:148, r:400,
    caption:'DECLARATIVE RED. IMAGE SEIZED, CAPTIONED, RETURNED AS ACCUSATION.',
    clips:[
      {src:'IMAGES/BK_01.jpeg', alt:'Your body is a battleground',    dx:-24, dy:14,  w:88, ar:.70, tilt:7,   z:2},
      {src:'IMAGES/BK_02.jpeg', alt:'Eyes are the window to the soul', dx:-84, dy:-46, w:44, ar:.41, tilt:-12, z:3},
      {src:'IMAGES/BK_P.jpeg',  alt:'Barbara Kruger portrait',        dx:56,  dy:-40, w:84, ar:.78, tilt:-6,  z:1}
    ]
  },
  {
    id:'AT', name:'ASH THORP', disc:'CONCEPT / 3D', angle:197, r:400,
    caption:'MACHINE SURFACES. VEHICLE AND SKULL RENDERED AS TOTEM OBJECTS.',
    clips:[
      {src:'IMAGES/AT_2.png',  alt:'Batmobile study in red smoke', dx:-30, dy:14,  w:138, ar:1.26, tilt:-7, z:1},
      {src:'IMAGES/AT_01.png', alt:'Wireframe head studies',       dx:46,  dy:-56, w:148, ar:1.91, tilt:5,  z:2}
    ]
  },
  {
    id:'WM', name:'WANGECHI MUTU', disc:'COLLAGE / BODY', angle:243, r:404,
    caption:'CUT ANATOMIES. MYTH GRAFTED ONTO MEDICAL PLATES. THE BODY RE-ASSEMBLED.',
    clips:[
      {src:'IMAGES/WM_01.jpeg', alt:'Cervical Hypertrophy collage', dx:-24, dy:-18, w:96, ar:.75, tilt:-9, z:2},
      {src:'IMAGES/WM_02.jpeg', alt:'Collaged portrait on green',   dx:50,  dy:36,  w:88, ar:.80, tilt:6,  z:1},
      {src:'IMAGES/WM_P.jpg',   alt:'Wangechi Mutu portrait',       dx:-66, dy:54,  w:64, ar:.75, tilt:12, z:3}
    ]
  },
  {
    id:'CH', name:'CHASE HUGHES', disc:'BEHAVIOR OPS', angle:288, r:396,
    caption:'INFLUENCE PROTOCOLS. BEHAVIOR MAPPED, INDEXED, OPERATIONALIZED.',
    clips:[
      {src:'IMAGES/CH_01.jpg', alt:'The Behavior Ops Manual', dx:-14, dy:-24, w:88,  ar:.66, tilt:8,  z:2},
      {src:'IMAGES/CH_02.jpg', alt:'Chase Hughes portrait',   dx:46,  dy:46,  w:104, ar:1.33, tilt:-6, z:1}
    ]
  },
  {
    id:'JK', name:'KELLY JOHNSON', disc:'SKUNK WORKS', angle:331, r:400,
    caption:'SKUNK WORKS DOCTRINE. SPEED, SECRECY, SHAPES THAT EVADE DETECTION.',
    clips:[
      {src:'IMAGES/JK_01.jpg',  alt:'F-117 Nighthawk in flight', dx:-28, dy:-8, w:136, ar:1.50, tilt:-6,  z:1},
      {src:'IMAGES/JK_02.jpeg', alt:'SR-71 Blackbird plan view', dx:46,  dy:6,  w:58,  ar:.52,  tilt:10,  z:3},
      {src:'IMAGES/JK_P.jpg',   alt:'Kelly Johnson portrait',    dx:-72, dy:48, w:80,  ar:1.23, tilt:-13, z:2}
    ]
  }
];

/* Reference link per influence — official site / authoritative page.
   Rendered as a ↗ on each index row; opens in a new tab, never pins. */
const LINKS = {
  NV:   'https://www.brody-associates.com/',
  MTHV: 'https://metahaven.net/',
  BK:   'https://spruethmagers.com/artists/barbara-kruger/',
  AT:   'https://ashthorp.art/',
  WM:   'https://www.victoria-miro.com/artists/9-wangechi-mutu/',
  CH:   'https://chasehughes.com/',
  JK:   'https://www.lockheedmartin.com/en-us/news/features/history/johnson.html',
};
INFLUENCES.forEach(inf => { inf.url = LINKS[inf.id]; });

const DEFAULT_CAPTION = 'HOVER THE INDEX. ARROWS LOCATE EVIDENCE ON THE DIAL. DRAG THE BOARD TO ROTATE.';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- HELPERS ---------------------------------------- */

const SVGNS = 'http://www.w3.org/2000/svg';
const $  = s => document.querySelector(s);
const host = document.getElementById('ferris');    // widget root — origin for all overlay math
const el = (tag, attrs = {}) => {
  const n = document.createElementNS(SVGNS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};
/* polar: deg clockwise from north, board units around (500,500) */
const polar = (deg, r) => {
  const a = deg * Math.PI / 180;
  return { x: 500 + r * Math.sin(a), y: 500 - r * Math.cos(a) };
};
const hard = t => t * t * t;                 // sluggish start, abrupt stop
const pad3 = n => String(Math.round(n)).padStart(3, '0');

/* ---------- STATE ------------------------------------------ */

const S = {
  hoverId: null,
  pinId:   null,
  rot: 0,           // rendered angle
  rotTarget: 0,     // dragged angle
  dragging: false,
  moved: false,
  arrow: { id: null, t0: 0, done: false },
  stringsOn: false,
  typeTimer: null
};
const activeId = () => S.hoverId || S.pinId;

/* ---------- BUILD: INDEX ROWS ------------------------------ */

const list = $('#index-list');
INFLUENCES.forEach((inf, i) => {
  const li = document.createElement('li');
  li.className = 'row';
  li.dataset.id = inf.id;
  li.tabIndex = 0;
  li.style.setProperty('--d', (i * 70) + 'ms');
  li.innerHTML =
    `<span class="num">${String(i + 1).padStart(2, '0')}</span>` +
    `<span class="name">${inf.name}</span>` +
    `<span class="disc">${inf.disc} · ${inf.clips.length} EXHIBIT${inf.clips.length > 1 ? 'S' : ''}` +
      `${inf.url ? ` <a class="src" href="${inf.url}" target="_blank" rel="noopener noreferrer" aria-label="Open reference for ${inf.name} in a new tab">↗</a>` : ''}</span>` +
    `<span class="theta">θ ${pad3(inf.angle)}°</span>` +
    `<span class="tick"></span>`;
  list.appendChild(li);
  inf.rowEl = li;
  inf.tickEl = li.querySelector('.tick');
  const srcLink = li.querySelector('.src');
  if (srcLink) {
    // Follow the link without pinning the row (click) or firing the pin keydown (Enter).
    srcLink.addEventListener('click', e => e.stopPropagation());
    srcLink.addEventListener('keydown', e => { if (e.key === 'Enter') e.stopPropagation(); });
  }
});

/* ---------- BUILD: BOARD SVG ------------------------------- */

const svg = $('#board-svg');
const gStatic = el('g');
const gRotor  = el('g', { id: 'svg-rotor' });
svg.appendChild(gStatic);
svg.appendChild(gRotor);

/* rings */
[[420, '', 0], [300, 'faint', 120], [200, 'faint', 240], [140, 'faint', 360]].forEach(([r, cls, d]) => {
  const c = el('circle', { cx: 500, cy: 500, r, class: `ring ${cls} drawable`, pathLength: 100 });
  c.style.setProperty('--d', d + 'ms');
  gStatic.appendChild(c);
});

/* degree ticks — outer ring, every 6° */
for (let a = 0; a < 360; a += 6) {
  const p1 = polar(a, 414), p2 = polar(a, 420);
  gStatic.appendChild(el('line', {
    x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
    class: 'tickmark drawable', pathLength: 100
  })).style.setProperty('--d', (200 + a * 1.4) + 'ms');
}

/* crosshair + center stamp — the breathing lung stays void */
gStatic.appendChild(el('line', { x1: 466, y1: 500, x2: 534, y2: 500, class: 'crosshair drawable', pathLength: 100 })).style.setProperty('--d', '650ms');
gStatic.appendChild(el('line', { x1: 500, y1: 466, x2: 500, y2: 534, class: 'crosshair drawable', pathLength: 100 })).style.setProperty('--d', '650ms');
gStatic.appendChild(el('circle', { cx: 500, cy: 500, r: 14, class: 'ring faint drawable', pathLength: 100 })).style.setProperty('--d', '700ms');
const cstamp = el('text', { x: 500, y: 556, class: 'center-stamp' });
cstamp.textContent = 'FERRIS · REF 2026-07-09';
cstamp.classList.add('orbit-num');           // reuses stepped reveal
cstamp.style.setProperty('--d', '900ms');
gStatic.appendChild(cstamp);

/* sonar + idle sweep */
gStatic.appendChild(el('circle', { cx: 500, cy: 500, r: 420, class: 'sonar' }));
const sweepLine = el('line', { x1: 500, y1: 500, x2: 500, y2: 56, class: 'sweep' });
gStatic.appendChild(sweepLine);

/* slate conduit — organic stroke violating the geometry */
const THREAD_D = 'M -60 640 C 140 560, 230 720, 400 668 S 640 520, 758 474 S 980 428, 1070 366';
gStatic.appendChild(el('path', { d: THREAD_D, class: 'thread-band' }));
gStatic.appendChild(el('path', { d: THREAD_D, class: 'thread-flow' }));

/* numeral track (invisible path for curved text) */
const track = el('path', { id: 'num-track', d: 'M 500 55 A 445 445 0 1 1 499.9 55', fill: 'none' });
gStatic.appendChild(track);

/* rotating layer: spokes, node dots, curved numerals */
INFLUENCES.forEach((inf, i) => {
  const pIn = polar(inf.angle, 168), pOut = polar(inf.angle, 458);
  const spoke = el('line', {
    x1: pIn.x, y1: pIn.y, x2: pOut.x, y2: pOut.y,
    class: 'spoke drawable', pathLength: 100
  });
  spoke.style.setProperty('--d', (350 + i * 85) + 'ms');
  gRotor.appendChild(spoke);

  const t = el('text', { class: 'orbit-num' });
  t.style.setProperty('--d', (520 + i * 100) + 'ms');
  const tp = el('textPath', { startOffset: '0', href: '#num-track' });
  tp.setAttribute('href', '#num-track');
  tp.textContent = String(i + 1).padStart(2, '0');
  t.appendChild(tp);
  gRotor.appendChild(t);
  inf.numTp = tp;
});
/* place curved numerals once track length known */
requestAnimationFrame(() => {
  const L = track.getTotalLength();
  INFLUENCES.forEach(inf => {
    inf.numTp.setAttribute('startOffset', (((inf.angle - 2.5 + 360) % 360) / 360) * L);
  });
});

/* ---------- BUILD: ROTOR CLIPPINGS ------------------------- */

const rotor = $('#rotor');
const placeQueue = [];   // entry order, clockwise

INFLUENCES.forEach(inf => {
  const c = polar(inf.angle, inf.r);
  inf.cx = c.x; inf.cy = c.y;

  inf.clips.forEach(cl => {
    const d = document.createElement('figure');
    d.className = 'clip';
    d.dataset.id = inf.id;
    d.style.left  = (c.x + cl.dx) / 10 + '%';
    d.style.top   = (c.y + cl.dy) / 10 + '%';
    d.style.width = cl.w / 10 + '%';
    d.style.aspectRatio = cl.ar;
    d.style.zIndex = 20 + cl.z;
    d.style.setProperty('--tilt', cl.tilt + 'deg');
    const img = document.createElement('img');
    img.src = cl.src; img.alt = cl.alt; img.draggable = false;
    img.dataset.lightboxSrc = cl.src;
    d.appendChild(img);
    rotor.appendChild(d);
    placeQueue.push({ el: d, inf });
  });

  const pin = document.createElement('div');
  pin.className = 'pin' + (inf.red ? ' red' : '');
  pin.dataset.id = inf.id;
  pin.style.left = c.x / 10 + '%';
  pin.style.top  = c.y / 10 + '%';
  rotor.appendChild(pin);
  inf.pinEl = pin;

  const chipPos = polar(inf.angle, inf.r - 118);
  const chip = document.createElement('div');
  chip.className = 'chip';
  chip.dataset.id = inf.id;
  chip.style.left = chipPos.x / 10 + '%';
  chip.style.top  = chipPos.y / 10 + '%';
  chip.textContent = `${String(INFLUENCES.indexOf(inf) + 1).padStart(2, '0')} · ${inf.id}`;
  rotor.appendChild(chip);
  inf.chipEl = chip;
});

/* ---------- BUILD: OVERLAY --------------------------------- */

const overlay   = $('#overlay');
const gStrings  = $('#strings');
const arrowPath = $('#arrow-path');
const arrowHead = $('#arrow-head');

/* pin the overlay's pixel size to the widget box, so 1 SVG user-unit = 1 local px.
   (an SVG won't stretch from inset:0 alone, and % height collapses when the
   widget is auto-height on mobile — so size it explicitly and keep it live) */
function sizeOverlay() {
  overlay.setAttribute('width',  host.clientWidth);
  overlay.setAttribute('height', host.clientHeight);
}
if (window.ResizeObserver) new ResizeObserver(sizeOverlay).observe(host);
window.addEventListener('resize', sizeOverlay);
sizeOverlay();

INFLUENCES.forEach(inf => {
  const ln = el('line', { x1: 0, y1: 0, x2: 0, y2: 0 });
  gStrings.appendChild(ln);
  inf.stringEl = ln;
});
gStrings.style.opacity = 0;

/* ---------- STATE APPLICATION ------------------------------ */

function applyState() {
  const act = activeId();
  host.classList.toggle('focused', !!act);

  INFLUENCES.forEach(inf => {
    const on = inf.id === act;
    inf.rowEl.classList.toggle('active', on);
    inf.rowEl.classList.toggle('pinned', inf.id === S.pinId);
    inf.pinEl.classList.toggle('on', on);
    inf.chipEl.classList.toggle('on', on);
    inf.stringEl.classList.toggle('mute', on);
  });
  rotor.querySelectorAll('.clip').forEach(c =>
    c.classList.toggle('on', c.dataset.id === act));

  if (act && S.arrow.id !== act) {
    S.arrow = { id: act, t0: performance.now(), done: false };
    arrowHead.setAttribute('points', '');
  }
  if (!act) {
    S.arrow.id = null;
    arrowPath.setAttribute('d', '');
    arrowHead.setAttribute('points', '');
  }
}

function setHover(id) {
  if (S.hoverId === id) return;
  S.hoverId = id;
  applyState();
}

function setPin(id) {
  S.pinId = (S.pinId === id) ? null : id;
  applyState();
  if (S.pinId) {
    const inf = INFLUENCES.find(f => f.id === S.pinId);
    typeCaption(`${inf.name} — ${inf.caption}`);
  } else {
    setCaption(DEFAULT_CAPTION);
  }
}

/* ---------- CAPTION TYPEWRITER ----------------------------- */

const caption = $('#caption');

function setCaption(text) {           // instant stamp, no glide
  clearInterval(S.typeTimer);
  caption.textContent = text;
}
function typeCaption(text) {
  clearInterval(S.typeTimer);
  caption.textContent = '';
  if (REDUCED) { caption.textContent = text; return; }
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  caption.appendChild(cursor);
  let i = 0;
  S.typeTimer = setInterval(() => {
    if (i >= text.length) {
      clearInterval(S.typeTimer);
      setTimeout(() => cursor.remove(), 700);
      return;
    }
    const ch = document.createElement('span');
    ch.className = 'ch';
    ch.textContent = text[i++];
    caption.insertBefore(ch, cursor);
  }, 11);
}

/* ---------- GEOMETRY / MAIN LOOP --------------------------- */

/* center of a rect, expressed in coords local to the widget root `h`,
   so the overlay stays aligned no matter where the widget sits/scrolls */
const rectCenter = (r, h) => ({ x: r.left + r.width / 2 - h.left, y: r.top + r.height / 2 - h.top });

function frame(now) {
  /* --- dial physics: heavy drag, hard snap --- */
  if (S.dragging) {
    S.rot += (S.rotTarget - S.rot) * 0.16;          // friction while dragging
  }
  applyRot();

  const hr = host.getBoundingClientRect();          // widget-local origin, this frame

  /* --- string-lines: text → pin, always live --- */
  if (S.stringsOn) {
    INFLUENCES.forEach(inf => {
      const a = rectCenter(inf.tickEl.getBoundingClientRect(), hr);
      const b = rectCenter(inf.pinEl.getBoundingClientRect(), hr);
      const ln = inf.stringEl;
      ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y);
      ln.setAttribute('x2', b.x); ln.setAttribute('y2', b.y);
    });
  }

  /* --- interaction arrow: dogleg polyline, tracked live --- */
  const act = activeId();
  if (act && S.arrow.id === act) {
    const inf = INFLUENCES.find(f => f.id === act);
    const P0 = rectCenter(inf.tickEl.getBoundingClientRect(), hr);
    const P1 = rectCenter(inf.pinEl.getBoundingClientRect(), hr);
    const out = Math.min(220, Math.max(26, (P1.x - P0.x) * 0.30));
    const E  = { x: P0.x + out, y: P0.y };
    const d  = `M ${P0.x} ${P0.y} L ${E.x} ${E.y} L ${P1.x} ${P1.y}`;
    const L  = Math.abs(E.x - P0.x) + Math.hypot(P1.x - E.x, P1.y - E.y);
    arrowPath.setAttribute('d', d);
    arrowPath.setAttribute('stroke-dasharray', L);

    const t = REDUCED ? 1 : Math.min(1, (now - S.arrow.t0) / 190);
    arrowPath.setAttribute('stroke-dashoffset', L * (1 - hard(t)));

    if (t >= 1) {
      /* solid head + thud, stamped once */
      const seg = { x: P1.x - E.x, y: P1.y - E.y };
      const len = Math.hypot(seg.x, seg.y) || 1;
      const u   = { x: seg.x / len, y: seg.y / len };
      const b   = { x: P1.x - u.x * 12, y: P1.y - u.y * 12 };
      const n   = { x: -u.y * 4.6, y: u.x * 4.6 };
      arrowHead.setAttribute('points',
        `${P1.x},${P1.y} ${b.x + n.x},${b.y + n.y} ${b.x - n.x},${b.y - n.y}`);
      if (!S.arrow.done) {
        S.arrow.done = true;
        inf.pinEl.classList.add('thud');
        setTimeout(() => inf.pinEl.classList.remove('thud'), 560);
      }
    }
  }
  requestAnimationFrame(frame);
}

function applyRot() {
  rotor.style.setProperty('--rot', S.rot + 'deg');
  gRotor.setAttribute('transform', `rotate(${S.rot} 500 500)`);
  $('#rot-readout').textContent = `ROT ${pad3(((S.rot % 360) + 360) % 360)}°`;
}

/* ---------- DIAL DRAG -------------------------------------- */

const board = $('#board');
board.style.touchAction = 'none';
let lastPointerAngle = 0;

const pointerAngle = e => {
  const r = board.getBoundingClientRect();
  return Math.atan2(e.clientY - (r.top + r.height / 2),
                    e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
};

board.addEventListener('pointerdown', e => {
  S.dragging = true;
  S.moved = false;
  lastPointerAngle = pointerAngle(e);
  board.setPointerCapture(e.pointerId);
});
board.addEventListener('pointermove', e => {
  if (!S.dragging) return;
  const a = pointerAngle(e);
  let d = a - lastPointerAngle;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  lastPointerAngle = a;
  S.rotTarget += d;
  if (Math.abs(S.rotTarget - S.rot) > 1.5) S.moved = true;
});
function endDrag() {
  if (!S.dragging) return;
  S.dragging = false;
  S.rotTarget = Math.round(S.rotTarget / 45) * 45;   // detent
  S.rot = S.rotTarget;                               // HARD snap — no ease-out
  applyRot();
}
board.addEventListener('pointerup', endDrag);
board.addEventListener('pointercancel', endDrag);

/* ---------- LIGHTBOX (click an image to blow it up) --------
   Mounted at document.body — NOT inside #board/#rotor/#ferris — so it can
   never be clipped by an ancestor's overflow/stacking context, and its
   position:fixed is always relative to the real viewport. Target resolution
   uses delegation from `document` in the CAPTURE phase: a genuine click on an
   image is intercepted and stopPropagation()'d before it ever reaches board's
   own bubble-phase click handler, so board never also fires setPin/rotation
   for that click — no coordination needed between the two systems beyond
   that one stopPropagation. A drag (>6px pointer movement) is deliberately
   let bubble through untouched, so board's own S.moved-gated pin logic still
   applies exactly as before.                                              */
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'false');
lightbox.setAttribute('aria-hidden', 'true');
lightbox.innerHTML =
  '<button type="button" class="lb-close" aria-label="Close image">&times;</button>' +
  '<img alt="">' +
  '<div class="lb-cap"></div>';
document.body.appendChild(lightbox);
const lbImg = lightbox.querySelector('img');
const lbCap = lightbox.querySelector('.lb-cap');
const lbCloseBtn = lightbox.querySelector('.lb-close');
let bodyOverflowBeforeLightbox = '';

function openLightbox(src, alt) {
  lbImg.src = src; lbImg.alt = alt || '';
  lbCap.innerHTML = (alt || 'EXHIBIT') + '<span class="esc">ESC — CLOSE</span>';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.setAttribute('aria-modal', 'true');
  bodyOverflowBeforeLightbox = document.body.style.overflow;
  document.body.style.overflow = 'hidden';             // lock background scroll
}
function closeLightbox() {
  if (!lightbox.classList.contains('open')) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.setAttribute('aria-modal', 'false');
  lbImg.removeAttribute('src');
  document.body.style.overflow = bodyOverflowBeforeLightbox;   // restore exactly
}
lightbox.addEventListener('click', e => {
  if (e.target === lightbox || e.target === lbCloseBtn) closeLightbox();
});

/* delegated, capture-phase — never bound per-image, survives board rebuilds */
let lbPointerStart = null;
document.addEventListener('pointerdown', e => {
  const t = e.target.closest('[data-lightbox-src]');
  if (!t) return;
  lbPointerStart = { x: e.clientX, y: e.clientY };
}, true);
document.addEventListener('click', e => {
  const started = lbPointerStart;
  lbPointerStart = null;
  // Resolve the real element under the pointer via hit-testing, not just
  // e.target — some browsers retarget click's target to the pointer-capture
  // element (here, #board) after setPointerCapture, which would otherwise
  // make closest() miss the image entirely.
  const hitEl = document.elementFromPoint(e.clientX, e.clientY);
  const target = (hitEl && hitEl.closest('[data-lightbox-src]')) ||
                 e.target.closest('[data-lightbox-src]');
  if (!target) return;
  if (started) {
    const dx = Math.abs(e.clientX - started.x);
    const dy = Math.abs(e.clientY - started.y);
    if (dx > 6 || dy > 6) return;                      // a drag, not a click
  }
  e.preventDefault();
  e.stopPropagation();                                  // board never sees this click
  openLightbox(target.dataset.lightboxSrc || target.src, target.alt || '');
}, true);

board.addEventListener('click', e => {
  if (S.moved) { S.moved = false; return; }
  const t = e.target.closest('[data-id]');
  if (t) setPin(t.dataset.id);
  else if (S.pinId) setPin(S.pinId);                 // empty board = release
}, true);

/* ---------- ROW + CLUSTER EVENTS --------------------------- */

INFLUENCES.forEach(inf => {
  inf.rowEl.addEventListener('mouseenter', () => setHover(inf.id));
  inf.rowEl.addEventListener('mouseleave', () => setHover(null));
  inf.rowEl.addEventListener('focus', () => setHover(inf.id));
  inf.rowEl.addEventListener('blur',  () => setHover(null));
  inf.rowEl.addEventListener('click', () => setPin(inf.id));
  inf.rowEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPin(inf.id); }
  });
});

rotor.addEventListener('mouseover', e => {
  const t = e.target.closest('[data-id]');
  if (t) setHover(t.dataset.id);
});
rotor.addEventListener('mouseout', e => {
  const to = e.relatedTarget;
  if (!(to && to.closest && to.closest('[data-id]'))) setHover(null);
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) { closeLightbox(); return; }
  if (e.key === 'Escape' && S.pinId) setPin(S.pinId);
  if (e.key === 'ArrowRight') { S.rotTarget += 45; S.rot = S.rotTarget; applyRot(); }
  if (e.key === 'ArrowLeft')  { S.rotTarget -= 45; S.rot = S.rotTarget; applyRot(); }
});

/* ---------- ENTRY CHOREOGRAPHY ----------------------------- */
/* linen → grid draws → thread flows → evidence pins → type stamps */

function enter() {
  host.classList.remove('pre');

  if (REDUCED) {
    host.classList.add('no-motion', 'p-grid', 'p-thread', 'p-type');
    placeQueue.forEach(q => q.el.classList.add('placed'));
    INFLUENCES.forEach(inf => { inf.pinEl.classList.add('placed'); inf.chipEl.classList.add('placed'); });
    gStrings.style.opacity = 1;
    S.stringsOn = true;
    setCaption(DEFAULT_CAPTION);
    return;
  }

  setTimeout(() => host.classList.add('p-grid'), 350);
  setTimeout(() => host.classList.add('p-thread'), 1200);

  placeQueue.forEach((q, i) => {
    setTimeout(() => {
      q.el.classList.add('placed');
      if (!q.inf.pinEl.classList.contains('placed')) {
        q.inf.pinEl.classList.add('placed');
        q.inf.chipEl.classList.add('placed');
        q.inf.pinEl.classList.add('thud');
        setTimeout(() => q.inf.pinEl.classList.remove('thud'), 560);
      }
    }, 1450 + i * 95);
  });

  const tType = 1450 + placeQueue.length * 95 + 260;
  setTimeout(() => {
    host.classList.add('p-type');
    gStrings.style.opacity = 1;
    S.stringsOn = true;
  }, tType);
  setTimeout(() => typeCaption(DEFAULT_CAPTION), tType + 650);
}

/* ---------- GO --------------------------------------------- */

applyRot();
requestAnimationFrame(frame);
enter();
