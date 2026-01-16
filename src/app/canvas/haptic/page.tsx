"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHaptic } from "use-haptic";

const SCROLL_THRESHOLD = 100;

interface KanbanItem {
  id: string;
  title: string;
}

interface KanbanState {
  left: KanbanItem[];
  right: KanbanItem[];
}

interface DragState {
  item: KanbanItem;
  from: "left" | "right";
  x: number;
  y: number;
  startX: number;
  startY: number;
}

const getNewKanbanState = (
  prev: KanbanState,
  from: "left" | "right",
  to: "left" | "right",
  item: KanbanItem
): KanbanState => {
  const fromItems = prev[from].filter((i) => i.id !== item.id);
  const toItems = [...prev[to], item];

  if (from === "left" && to === "right") {
    return { left: fromItems, right: toItems };
  }
  return { left: toItems, right: fromItems };
};

export default function HapticPage() {
  const { triggerHaptic } = useHaptic();
  const [scrollY, setScrollY] = useState(0);
  const [hapticCount, setHapticCount] = useState(0);
  const lastHapticThreshold = useRef(0);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  const [kanban, setKanban] = useState<KanbanState>({
    left: [
      { id: "1", title: "Task A" },
      { id: "2", title: "Task B" },
      { id: "3", title: "Task C" },
    ],
    right: [{ id: "4", title: "Task D" }],
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const currentThreshold = Math.floor(currentScrollY / SCROLL_THRESHOLD);

      if (currentThreshold !== lastHapticThreshold.current) {
        triggerHaptic();
        setHapticCount((prev) => prev + 1);
        lastHapticThreshold.current = currentThreshold;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerHaptic]);

  const handleTouchStart = useCallback(
    (item: KanbanItem, from: "left" | "right", e: React.TouchEvent) => {
      const touch = e.touches[0];
      triggerHaptic();
      setHapticCount((prev) => prev + 1);
      setDragState({
        item,
        from,
        x: touch.clientX,
        y: touch.clientY,
        startX: touch.clientX,
        startY: touch.clientY,
      });
    },
    [triggerHaptic]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragState) {
        return;
      }
      const touch = e.touches[0];
      setDragState((prev) =>
        prev ? { ...prev, x: touch.clientX, y: touch.clientY } : null
      );
    },
    [dragState]
  );

  const handleTouchEnd = useCallback(() => {
    if (!dragState) {
      return;
    }

    const leftRect = leftColumnRef.current?.getBoundingClientRect();
    const rightRect = rightColumnRef.current?.getBoundingClientRect();

    let dropTarget: "left" | "right" | null = null;

    if (leftRect && isPointInRect(dragState.x, dragState.y, leftRect)) {
      dropTarget = "left";
    } else if (
      rightRect &&
      isPointInRect(dragState.x, dragState.y, rightRect)
    ) {
      dropTarget = "right";
    }

    if (dropTarget && dropTarget !== dragState.from) {
      triggerHaptic();
      setHapticCount((prev) => prev + 1);
      setKanban((prev) =>
        getNewKanbanState(prev, dragState.from, dropTarget, dragState.item)
      );
    }

    setDragState(null);
  }, [dragState, triggerHaptic]);

  return (
    <div
      className="min-h-[300vh] w-full"
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {dragState && (
        <div
          className="pointer-events-none fixed z-50 rounded-md bg-blue-500 p-3 text-white opacity-90 shadow-lg"
          style={{
            left: dragState.x - 50,
            top: dragState.y - 20,
          }}
        >
          {dragState.item.title}
        </div>
      )}

      <div className="fixed top-4 right-4 z-10 rounded-lg bg-black/80 p-4 text-white backdrop-blur">
        <p className="font-mono text-sm">Haptic triggered: {hapticCount}x</p>
        <p className="mt-1 text-gray-400 text-xs">iOS Safari 18.0+ required</p>
      </div>

      <div className="flex flex-col items-center gap-16 px-4 py-20">
        <h1 className="font-bold text-2xl">Haptic Feedback Experiments</h1>

        {/* Button Click Section */}
        <section className="w-full max-w-md space-y-4">
          <h2 className="font-semibold text-lg">1. Button Click</h2>
          <p className="text-muted-foreground text-sm">
            Tap the button to feel haptic feedback.
          </p>
          <button
            className="w-full rounded-lg bg-blue-600 px-6 py-4 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
            onClick={() => {
              triggerHaptic();
              setHapticCount((prev) => prev + 1);
            }}
            type="button"
          >
            Tap for Haptic
          </button>
        </section>

        {/* Drag and Drop Section */}
        <section className="w-full max-w-md space-y-4">
          <h2 className="font-semibold text-lg">2. Drag & Drop Kanban</h2>
          <p className="text-muted-foreground text-sm">
            Drag a card to the other column to feel haptic feedback.
          </p>
          <div className="grid grid-cols-2 gap-4" role="application">
            <div
              aria-label="To Do column"
              className="min-h-[200px] rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-900"
              ref={leftColumnRef}
              role="listbox"
            >
              <h3 className="mb-3 font-medium text-gray-600 text-sm dark:text-gray-400">
                To Do
              </h3>
              <div className="space-y-2">
                {kanban.left.map((item) => (
                  <div
                    aria-label={item.title}
                    className={`touch-none select-none rounded-md bg-white p-3 shadow-sm transition-all dark:bg-gray-800 ${
                      dragState?.item.id === item.id
                        ? "opacity-50"
                        : "active:scale-95"
                    }`}
                    key={item.id}
                    onTouchStart={(e) => handleTouchStart(item, "left", e)}
                    role="option"
                    tabIndex={0}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
            <div
              aria-label="Done column"
              className="min-h-[200px] rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-900"
              ref={rightColumnRef}
              role="listbox"
            >
              <h3 className="mb-3 font-medium text-gray-600 text-sm dark:text-gray-400">
                Done
              </h3>
              <div className="space-y-2">
                {kanban.right.map((item) => (
                  <div
                    aria-label={item.title}
                    className={`touch-none select-none rounded-md bg-white p-3 shadow-sm transition-all dark:bg-gray-800 ${
                      dragState?.item.id === item.id
                        ? "opacity-50"
                        : "active:scale-95"
                    }`}
                    key={item.id}
                    onTouchStart={(e) => handleTouchStart(item, "right", e)}
                    role="option"
                    tabIndex={0}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scroll Section */}
        <section className="w-full max-w-md space-y-4">
          <h2 className="font-semibold text-lg">3. Scroll</h2>
          <p className="text-muted-foreground text-sm">
            Scroll down to feel haptic feedback every {SCROLL_THRESHOLD}px.
          </p>
          <div className="rounded-lg bg-accent/20 p-3">
            <p className="font-mono text-sm">
              Scroll Y: {Math.round(scrollY)}px
            </p>
            <p className="font-mono text-sm">
              Threshold: {Math.floor(scrollY / SCROLL_THRESHOLD)}
            </p>
          </div>
        </section>

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
      </div>
    </div>
  );
}

function isPointInRect(x: number, y: number, rect: DOMRect): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
