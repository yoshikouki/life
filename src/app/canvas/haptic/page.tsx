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
  const [selectedItem, setSelectedItem] = useState<{
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

  const handleItemClick = (item: KanbanItem, from: "left" | "right") => {
    triggerHaptic();
    setHapticCount((prev) => prev + 1);

    if (selectedItem?.item.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem({ item, from });
    }
  };

  const handleColumnClick = (to: "left" | "right") => {
    if (!selectedItem || selectedItem.from === to) {
      return;
    }

    triggerHaptic();
    setHapticCount((prev) => prev + 1);

    setKanban((prev) =>
      getNewKanbanState(prev, selectedItem.from, to, selectedItem.item)
    );
    setSelectedItem(null);
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

        {/* Tap to Move Section */}
        <section className="w-full max-w-md space-y-4">
          <h2 className="font-semibold text-lg">2. Tap to Move Kanban</h2>
          <p className="text-muted-foreground text-sm">
            Tap a card to select, then tap the other column to move it.
          </p>
          <div className="grid grid-cols-2 gap-4" role="application">
            <button
              aria-label="To Do column"
              className={`min-h-[200px] rounded-lg border-2 border-dashed p-3 text-left transition-colors ${
                selectedItem && selectedItem.from === "right"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900"
              }`}
              onClick={() => handleColumnClick("left")}
              type="button"
            >
              <h3 className="mb-3 font-medium text-gray-600 text-sm dark:text-gray-400">
                To Do
              </h3>
              <div className="space-y-2">
                {kanban.left.map((item) => (
                  <button
                    aria-label={item.title}
                    aria-pressed={selectedItem?.item.id === item.id}
                    className={`w-full rounded-md p-3 text-left shadow-sm transition-all ${
                      selectedItem?.item.id === item.id
                        ? "bg-blue-500 text-white"
                        : "bg-white active:scale-95 dark:bg-gray-800"
                    }`}
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item, "left");
                    }}
                    type="button"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </button>
            <button
              aria-label="Done column"
              className={`min-h-[200px] rounded-lg border-2 border-dashed p-3 text-left transition-colors ${
                selectedItem && selectedItem.from === "left"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900"
              }`}
              onClick={() => handleColumnClick("right")}
              type="button"
            >
              <h3 className="mb-3 font-medium text-gray-600 text-sm dark:text-gray-400">
                Done
              </h3>
              <div className="space-y-2">
                {kanban.right.map((item) => (
                  <button
                    aria-label={item.title}
                    aria-pressed={selectedItem?.item.id === item.id}
                    className={`w-full rounded-md p-3 text-left shadow-sm transition-all ${
                      selectedItem?.item.id === item.id
                        ? "bg-blue-500 text-white"
                        : "bg-white active:scale-95 dark:bg-gray-800"
                    }`}
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item, "right");
                    }}
                    type="button"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </button>
          </div>
          {selectedItem && (
            <p className="text-center text-muted-foreground text-sm">
              「{selectedItem.item.title}」を選択中 - 移動先のカラムをタップ
            </p>
          )}
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
