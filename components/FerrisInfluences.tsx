import React, { useEffect, useRef, useState } from 'react';

/**
 * "Index of Influences" — the FERRIS astrolabe widget, embedded verbatim from
 * `public/ferris/index.html`. Self-contained vanilla HTML/CSS/JS (linen canvas,
 * radial dial, pinned photo clippings, live SVG arrows) with its own palette and
 * self-hosted fonts; an iframe keeps all of it isolated from the cream INFLUENCES
 * band. The widget reports its content height (see its `ferris-height` post) —
 * fixed on desktop, auto when it stacks below ~900px — and we size the frame to
 * it so there's no inner scrollbar. Relative `src` respects Vite's `base: './'`.
 */
export const FerrisInfluences: React.FC = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Fallback ≈ the widget's desktop height before it reports in.
  const [height, setHeight] = useState<number>(820);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const data = e.data;
      if (
        data &&
        data.type === 'ferris-height' &&
        typeof data.height === 'number'
      ) {
        setHeight(Math.max(320, Math.ceil(data.height)));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="overflow-hidden">
      <iframe
        ref={frameRef}
        src="ferris/index.html"
        title="Index of Influences — interactive astrolabe"
        loading="lazy"
        scrolling="no"
        className="block w-full"
        style={{ height, border: 0 }}
      />
    </div>
  );
};
