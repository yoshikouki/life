"use client";

import { useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD = 100;

interface ScrollHapticProps {
  onHaptic: () => void;
}

export function ScrollHaptic({ onHaptic }: ScrollHapticProps) {
  const [scrollY, setScrollY] = useState(0);
  const lastHapticThreshold = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const currentThreshold = Math.floor(currentScrollY / SCROLL_THRESHOLD);

      if (currentThreshold !== lastHapticThreshold.current) {
        onHaptic();
        lastHapticThreshold.current = currentThreshold;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onHaptic]);

  return (
    <section className="w-full max-w-md space-y-4">
      <h2 className="font-semibold text-lg">3. Scroll</h2>
      <p className="text-muted-foreground text-sm">
        Scroll down to feel haptic feedback every {SCROLL_THRESHOLD}px.
      </p>
      <div className="rounded-lg bg-accent/20 p-3">
        <p className="font-mono text-sm">Scroll Y: {Math.round(scrollY)}px</p>
        <p className="font-mono text-sm">
          Threshold: {Math.floor(scrollY / SCROLL_THRESHOLD)}
        </p>
      </div>
    </section>
  );
}

export function ScrollMarkers() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          className="flex h-32 w-full max-w-md items-center justify-center rounded-lg border bg-accent/10"
          key={`section-${i + 1}`}
        >
          <span className="font-mono text-muted-foreground">
            {(i + 1) * SCROLL_THRESHOLD}px
          </span>
        </div>
      ))}
    </>
  );
}
