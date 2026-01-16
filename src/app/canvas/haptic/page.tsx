"use client";

import { useEffect, useRef, useState } from "react";
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
  const [draggedItem, setDraggedItem] = useState<{
    item: KanbanItem;
    from: "left" | "right";
  } | null>(null);

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

  const handleDragStart = (item: KanbanItem, from: "left" | "right") => {
    setDraggedItem({ item, from });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (to: "left" | "right") => {
    if (!draggedItem || draggedItem.from === to) {
      setDraggedItem(null);
      return;
    }

    triggerHaptic();
    setHapticCount((prev) => prev + 1);

    setKanban((prev) =>
      getNewKanbanState(prev, draggedItem.from, to, draggedItem.item)
    );
    setDraggedItem(null);
  };

  return (
    <div className="min-h-[300vh] w-full">
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
              onDragOver={handleDragOver}
              onDrop={() => handleDrop("left")}
              role="listbox"
            >
              <h3 className="mb-3 font-medium text-gray-600 text-sm dark:text-gray-400">
                To Do
              </h3>
              <div className="space-y-2">
                {kanban.left.map((item) => (
                  <div
                    aria-label={item.title}
                    className="cursor-grab rounded-md bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing dark:bg-gray-800"
                    draggable
                    key={item.id}
                    onDragStart={() => handleDragStart(item, "left")}
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
              onDragOver={handleDragOver}
              onDrop={() => handleDrop("right")}
              role="listbox"
            >
              <h3 className="mb-3 font-medium text-gray-600 text-sm dark:text-gray-400">
                Done
              </h3>
              <div className="space-y-2">
                {kanban.right.map((item) => (
                  <div
                    aria-label={item.title}
                    className="cursor-grab rounded-md bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing dark:bg-gray-800"
                    draggable
                    key={item.id}
                    onDragStart={() => handleDragStart(item, "right")}
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
