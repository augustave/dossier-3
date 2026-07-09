import React, { useEffect, useRef, useState } from 'react';

/**
 * Interactive "Map of Neighboring Practices" — embedded verbatim from
 * `public/neighboring-practices.html`. That artifact is a self-contained olive
 * plate (32 practitioners + ranked side panel + hover/click doctrine-fit detail)
 * with its own palette, font import and JS; an iframe keeps all of it isolated
 * from the blue BIO band. The artifact posts its content height on load / resize
 * (see its `postHeight`), and we size the frame to it so there is no inner
 * scrollbar. Relative `src` respects Vite's `base: './'`.
 */
export const NeighborPracticesMap: React.FC = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Fallback height covers first paint / no-JS before the artifact reports in.
  const [height, setHeight] = useState<number>(1200);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const data = e.data;
      if (
        data &&
        data.type === 'neighbor-map-height' &&
        typeof data.height === 'number'
      ) {
        setHeight(Math.max(320, Math.ceil(data.height)));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="bg-black/20 border border-white/10 overflow-hidden">
      <iframe
        ref={frameRef}
        src="neighboring-practices.html"
        title="A map of neighboring practices — interactive"
        loading="lazy"
        scrolling="no"
        className="block w-full"
        style={{ height, border: 0 }}
      />
    </div>
  );
};
