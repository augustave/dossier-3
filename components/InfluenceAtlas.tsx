import React, { useEffect, useId, useRef, useState } from 'react';

/* LEGACY (2026-07-18 eval): this component is imported NOWHERE — the live 02
   INFLUENCES widget is the FERRIS astrolabe iframe (public/ferris/). Its data
   (copy.v1_1.ts modules.influences.people + public/atlas/ images) rides along
   as dead weight. Kept for potential revival; owner decides deletion (T7 in
   audits/2026-07-18-venture-studio-eval/evaluation.md). */

export interface InfluencePerson {
  id: string;
  number?: string;
  name: string;
  shortLabel?: string;
  note: string;
  /** One-line lesson — "what still holds" (verbatim owner copy). */
  inheritance: string;
  inheritanceLine?: string;
  angleDegrees?: number;
  /** Radial slice label, 1-2 short words. */
  category: string;
  url?: string;
  optionalUrl?: string;
  images?: InfluenceImage[];
}

export interface InfluenceImage {
  src: string;
  kind?: string;
  alt?: string;
  focusX?: number;
  focusY?: number;
  scale?: number;
  opacity?: number;
}

interface InfluenceAtlasProps {
  hero: string;
  intro: string;
  intro2?: string;
  people: InfluencePerson[];
  atlasLabel: string;
}

interface Placement {
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  anchor?: 'left' | 'right';
}

const VB_W = 760;
const VB_H = 640;
const C_X = 385;
const C_Y = 330;
const R_RING = 166;
const R_OUTER = 238;
const R_LABEL = 226;
const R_TICK = 194;

const PLACEMENTS: Placement[] = [
  { x: 206, y: 30, w: 96, h: 168, rotate: -20, anchor: 'right' },
  { x: 348, y: 54, w: 118, h: 112, rotate: 5, anchor: 'right' },
  { x: 548, y: 70, w: 104, h: 150, rotate: 29, anchor: 'left' },
  { x: 558, y: 266, w: 136, h: 116, rotate: 3, anchor: 'left' },
  { x: 438, y: 452, w: 126, h: 152, rotate: 11, anchor: 'left' },
  { x: 214, y: 482, w: 162, h: 118, rotate: -13, anchor: 'right' },
  { x: 78, y: 326, w: 190, h: 104, rotate: -4, anchor: 'right' },
  { x: 104, y: 174, w: 136, h: 100, rotate: -17, anchor: 'right' },
];

const rad = (deg: number) => (deg * Math.PI) / 180;
const P = (r: number, deg: number): [number, number] => [
  C_X + r * Math.cos(rad(deg)),
  C_Y + r * Math.sin(rad(deg)),
];

const sliceMid = (i: number) => -67.5 + 45 * i;
const personAngle = (p: InfluencePerson, i: number) => p.angleDegrees ?? sliceMid(i);
const personNumber = (p: InfluencePerson, i: number) => p.number ?? String(i + 1).padStart(2, '0');
const personShortLabel = (p: InfluencePerson) => p.shortLabel ?? p.note;
const personInheritance = (p: InfluencePerson) => p.inheritanceLine ?? p.inheritance;
const personUrl = (p: InfluencePerson) => p.optionalUrl ?? p.url;
const personImages = (p: InfluencePerson): InfluenceImage[] =>
  (p.images?.length ? p.images : [])
    .filter((img) => img.kind !== 'profile' && !img.src.toLowerCase().includes('profile'));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const vectorGateOpen = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches;

interface Measured {
  origins: { x: number; y: number }[];
  stage: { left: number; top: number; sx: number; sy: number };
}

export const InfluenceAtlas: React.FC<InfluenceAtlasProps> = ({ hero, intro, intro2, people, atlasLabel }) => {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);
  const originRef = useRef<SVGCircleElement>(null);
  const vecGroupRef = useRef<SVGGElement>(null);
  const ghostRefs = useRef<(SVGLineElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cacheRef = useRef<Measured | null>(null);
  const activeRef = useRef<{ i: number } | null>(null);
  const rafRef = useRef(0);
  const roRafRef = useRef(0);
  const genRef = useRef(0);

  const [previewId, setPreviewId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);

  const activeId = lockedId ?? previewId;
  const activeIndex = activeId ? people.findIndex((p) => p.id === activeId) : -1;
  const locked = lockedId !== null;

  const measuredTarget = (m: Measured, i: number) => {
    const [x, y] = P(R_RING, personAngle(people[i], i));
    return {
      x: m.stage.left + x * m.stage.sx,
      y: m.stage.top + y * m.stage.sy,
    };
  };

  const measure = (): Measured => {
    if (cacheRef.current) return cacheRef.current;
    const stage = stageRef.current!.getBoundingClientRect();
    const svg = svgRef.current!.getBoundingClientRect();
    const m: Measured = {
      origins: people.map((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        const originX = r.left + r.width / 2 - stage.left;
        const originY = r.top + r.height / 2 - stage.top;
        return { x: originX, y: originY };
      }),
      stage: {
        left: svg.left - stage.left,
        top: svg.top - stage.top,
        sx: svg.width / VB_W,
        sy: svg.height / VB_H,
      },
    };
    cacheRef.current = m;
    return m;
  };

  const hideVector = (instant = false) => {
    const vg = vecGroupRef.current;
    if (!vg) return;
    genRef.current++;
    vg.style.transition = instant ? 'none' : 'opacity 120ms linear';
    vg.style.opacity = '0';
  };

  const drawGhosts = () => {
    if (!vectorGateOpen() || !stageRef.current || stageRef.current.offsetHeight < 80) return;
    const m = measure();
    people.forEach((_, i) => {
      const g = ghostRefs.current[i];
      if (!g) return;
      const o = m.origins[i];
      const n = measuredTarget(m, i);
      g.setAttribute('x1', String(o.x));
      g.setAttribute('y1', String(o.y));
      g.setAttribute('x2', String(n.x));
      g.setAttribute('y2', String(n.y));
    });
  };

  const drawVector = (i: number, instantPosition = false) => {
    const vg = vecGroupRef.current;
    const line = lineRef.current;
    const head = headRef.current;
    const origin = originRef.current;
    if (!vg || !line || !head || !origin) return;
    if (!vectorGateOpen()) {
      hideVector(true);
      return;
    }

    const gen = ++genRef.current;
    const m = measure();
    const o = m.origins[i];
    const n = measuredTarget(m, i);
    const dx = n.x - o.x;
    const dy = n.y - o.y;
    const L = Math.hypot(dx, dy) || 1;
    const ux = dx / L;
    const uy = dy / L;
    const tip = { x: n.x - ux * 5, y: n.y - uy * 5 };
    const lineEnd = { x: tip.x - ux * 7, y: tip.y - uy * 7 };
    const drawLen = Math.hypot(lineEnd.x - o.x, lineEnd.y - o.y);
    const angle = (Math.atan2(uy, ux) * 180) / Math.PI;

    origin.setAttribute('cx', String(o.x));
    origin.setAttribute('cy', String(o.y));
    line.setAttribute('d', `M ${o.x} ${o.y} L ${lineEnd.x} ${lineEnd.y}`);
    head.setAttribute('transform', `translate(${tip.x} ${tip.y}) rotate(${angle})`);
    vg.style.transition = 'none';
    vg.style.opacity = '1';

    if (prefersReducedMotion() || instantPosition) {
      line.style.transition = 'none';
      line.style.strokeDasharray = 'none';
      line.style.strokeDashoffset = '0';
      return;
    }

    const duration = Math.max(280, Math.min(420, 280 + (drawLen - 180) * 0.32));
    line.style.transition = 'none';
    line.style.strokeDasharray = String(drawLen);
    line.style.strokeDashoffset = String(drawLen);
    void line.getBoundingClientRect();
    rafRef.current = requestAnimationFrame(() => {
      if (genRef.current !== gen) return;
      line.style.transition = `stroke-dashoffset ${duration}ms var(--atlas-ease)`;
      line.style.strokeDashoffset = '0';
    });
  };

  useEffect(() => {
    activeRef.current = activeIndex >= 0 ? { i: activeIndex } : null;
    if (activeIndex < 0) {
      hideVector();
      setSettled(false);
      return;
    }
    drawVector(activeIndex);
    if (prefersReducedMotion()) {
      setSettled(true);
      return;
    }
    setSettled(false);
    const gen = genRef.current;
    const t = window.setTimeout(() => {
      if (genRef.current === gen) setSettled(true);
    }, 430);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    const recalc = () => {
      if (roRafRef.current) return;
      roRafRef.current = requestAnimationFrame(() => {
        roRafRef.current = 0;
        cacheRef.current = null;
        drawGhosts();
        const a = activeRef.current;
        if (a) drawVector(a.i, true);
        else hideVector(true);
      });
    };

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && stageRef.current) {
      ro = new ResizeObserver(recalc);
      ro.observe(stageRef.current);
    } else {
      window.addEventListener('resize', recalc);
    }
    window.addEventListener('scroll', recalc, { passive: true });
    drawGhosts();

    if (typeof document !== 'undefined' && (document as Document & { fonts?: FontFaceSet }).fonts?.ready) {
      (document as Document & { fonts: FontFaceSet }).fonts.ready.then(() => {
        cacheRef.current = null;
        drawGhosts();
      });
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', recalc);
      window.removeEventListener('scroll', recalc);
      if (roRafRef.current) cancelAnimationFrame(roRafRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lockedId === null) return;
    const idx = people.findIndex((p) => p.id === lockedId);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const fold = rootRef.current?.closest('.fold') as HTMLElement | null;
      if (!fold || fold.dataset.open !== 'true') {
        setLockedId(null);
        setPreviewId(null);
        return;
      }
      e.stopPropagation();
      setLockedId(null);
      setPreviewId(null);
      itemRefs.current[idx]?.focus();
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [lockedId, people]);

  const activate = (id: string) => {
    if (lockedId !== null) return;
    setPreviewId(id);
  };
  const deactivate = (e: React.FocusEvent | React.PointerEvent) => {
    if (lockedId !== null) return;
    const next = (e as React.FocusEvent).relatedTarget as Node | null;
    if (next && stageRef.current?.contains(next)) return;
    setPreviewId(null);
  };
  const toggleLock = (id: string) => {
    setLockedId(id);
    setPreviewId(id);
  };

  const readout = activeIndex >= 0 ? people[activeIndex] : null;
  const activePoint = activeIndex >= 0 ? P(R_LABEL, personAngle(people[activeIndex], activeIndex)) : [0, 0];

  return (
    <div ref={rootRef}>
      <div className="space-y-8 max-w-3xl">
        <p className="font-serif text-2xl md:text-4xl leading-relaxed">{hero}</p>
        <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed">{intro}</p>
        {intro2 && (
          <p className="font-sans text-lg md:text-xl opacity-secondary leading-relaxed">{intro2}</p>
        )}
      </div>

      <div
        ref={stageRef}
        data-atlas-active={activeId ?? ''}
        className="atlas-collage-stage relative mt-8"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          role="img"
          aria-label={atlasLabel}
          className="atlas-construction absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <pattern id={`${uid}-atlas-grid`} width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="currentColor" opacity="0.11" />
            </pattern>
          </defs>

          <rect width={VB_W} height={VB_H} fill={`url(#${uid}-atlas-grid)`} opacity="0.42" />
          <path
            d="M -8 356 C 92 390 154 310 248 336 C 318 358 360 394 454 340 C 552 280 650 318 768 266"
            fill="none"
            stroke="#6f8992"
            strokeOpacity="0.38"
            strokeWidth="5.5"
          />

          <g className="atlas-radial-field" stroke="currentColor" fill="none">
            {Array.from({ length: 48 }, (_, i) => {
              const a = i * 7.5;
              const [x1, y1] = P(28, a);
              const [x2, y2] = P(R_OUTER + (i % 6 === 0 ? 18 : 0), a);
              return (
                <line
                  key={a}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeOpacity={i % 6 === 0 ? 0.22 : 0.105}
                  strokeWidth={i % 6 === 0 ? 0.75 : 0.38}
                />
              );
            })}
            {[48, 88, 124, R_RING, R_OUTER].map((r, i) => (
              <circle key={r} cx={C_X} cy={C_Y} r={r} strokeOpacity={i === 2 ? 0.34 : 0.16} strokeWidth={i === 2 ? 1.1 : 0.6} />
            ))}
            <circle cx={C_X} cy={C_Y} r="3" fill="currentColor" opacity="0.28" />
          </g>

          <g className="atlas-arc-bands" stroke="currentColor" fill="none">
            {people.map((p, i) => {
              const angle = personAngle(p, i);
              const [x1, y1] = P(R_TICK, angle - 4);
              const [x2, y2] = P(R_TICK, angle + 4);
              const [cx, cy] = P(R_TICK + 8, angle);
              return <path key={p.id} d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} strokeOpacity="0.36" strokeWidth="2.2" />;
            })}
          </g>

          <g className="atlas-targets">
            {people.map((p, i) => {
              const [x, y] = P(R_RING, personAngle(p, i));
              const isActive = activeId === p.id;
              return (
                <circle
                  key={p.id}
                  cx={x}
                  cy={y}
                  r={isActive ? 5.2 : 3.4}
                  fill="currentColor"
                  opacity={activeId === null ? 0.46 : isActive ? 1 : 0.22}
                  className="atlas-node"
                  aria-hidden="true"
                  onPointerEnter={() => activate(p.id)}
                  onPointerLeave={deactivate}
                  onClick={(e) => { e.stopPropagation(); toggleLock(p.id); }}
                />
              );
            })}
            {readout && (
              <text
                x={activePoint[0]}
                y={activePoint[1]}
                textAnchor={activePoint[0] > C_X ? 'start' : 'end'}
                fontSize="10"
                letterSpacing="1.4"
                fill={locked ? '#6E7248' : 'currentColor'}
                opacity={settled ? 0.85 : 0}
                fontFamily="ui-monospace, monospace"
                className="atlas-readout"
              >
                {readout.category}
              </text>
            )}
          </g>
        </svg>

        {people.map((p, i) => {
          const placement = PLACEMENTS[i % PLACEMENTS.length];
          const isActive = activeId === p.id;
          const isDim = activeId !== null && !isActive;
          const inheritance = personInheritance(p);
          const href = personUrl(p);
          const images = personImages(p);
          return (
            <button
              type="button"
              key={p.id}
              ref={(el) => { itemRefs.current[i] = el; }}
              aria-pressed={lockedId === p.id}
              onPointerEnter={() => activate(p.id)}
              onPointerLeave={deactivate}
              onFocus={() => activate(p.id)}
              onBlur={deactivate}
              onClick={(e) => { e.stopPropagation(); toggleLock(p.id); }}
              className={`atlas-fragment ${isActive ? 'is-active' : ''} ${isDim ? 'is-dim' : ''}`}
              style={{
                left: `${(placement.x / VB_W) * 100}%`,
                top: `${(placement.y / VB_H) * 100}%`,
                width: `${(placement.w / VB_W) * 100}%`,
                minHeight: `${placement.h}px`,
                transform: `rotate(${placement.rotate}deg)`,
                transformOrigin: placement.anchor === 'left' ? 'left center' : 'right center',
                ['--fragment-rot' as string]: `${placement.rotate}deg`,
                ['--fragment-h' as string]: `${placement.h}px`,
              }}
            >
              {images.length > 0 && (
                <span
                  className={`atlas-fragment__cluster atlas-fragment__cluster--${Math.min(images.length, 3)}`}
                  data-image-count={images.length}
                  aria-hidden="true"
                >
                  {images.map((img, imageIndex) => (
                    <span
                      key={`${p.id}-${img.src}`}
                      className={`atlas-fragment__image atlas-fragment__image--${imageIndex} atlas-fragment__image--${img.kind ?? 'work'}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt ?? ''}
                        draggable={false}
                        style={{
                          objectPosition: `${(img.focusX ?? 0.5) * 100}% ${(img.focusY ?? 0.5) * 100}%`,
                          transform: `scale(${img.scale ?? 1})`,
                          opacity: img.opacity ?? undefined,
                        }}
                      />
                    </span>
                  ))}
                </span>
              )}
              <span className={`atlas-fragment__label atlas-fragment__label--${placement.anchor ?? 'right'}`}>
                <span className="atlas-fragment__number">{personNumber(p, i)}</span>
                <span className="atlas-fragment__name">{p.name}</span>
                <span className="atlas-fragment__note">{personShortLabel(p)}</span>
              </span>
              {isActive && (
                <span className="atlas-inherit block" data-open="true">
                  <span
                    id={`${uid}-line-${p.id}`}
                    className="atlas-inherit__inner block font-mono text-micro uppercase tracking-widest mt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {inheritance}
                  </span>
                </span>
              )}
              {href && lockedId === p.id && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block mt-2 font-mono text-micro uppercase tracking-widest opacity-tertiary hover:opacity-100 border-b border-current transition-opacity"
                >
                  Visit →
                </a>
              )}
            </button>
          );
        })}

        <svg
          aria-hidden="true"
          data-locked={locked}
          className="atlas-overlay absolute inset-0 z-30 pointer-events-none overflow-visible hidden md:block"
          style={{ width: '100%', height: '100%' }}
        >
          <g className="atlas-ghosts">
            {people.map((p, i) => (
              <line
                key={p.id}
                ref={(el) => { ghostRefs.current[i] = el; }}
                stroke="var(--text-primary)"
                strokeWidth="0.7"
                opacity="var(--atlas-ghost, 0.06)"
              />
            ))}
          </g>
          <g ref={vecGroupRef} style={{ opacity: 0 }}>
            <circle ref={originRef} className="atlas-vector-origin" r="2" fill="var(--text-primary)" opacity="0.65" />
            <path ref={lineRef} className="atlas-vector-line" fill="none" stroke="var(--text-primary)" strokeLinecap="butt" />
            <path
              ref={headRef}
              className="atlas-vector-head"
              d="M 0 0 L -7 -2.6 L -7 2.6 Z"
              fill="var(--text-primary)"
              style={{ opacity: settled ? 1 : 0, transition: 'opacity var(--atlas-label) linear' }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
