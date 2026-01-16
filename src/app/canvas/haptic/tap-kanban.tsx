"use client";

import { useState } from "react";

interface KanbanItem {
  id: string;
  title: string;
}

interface KanbanState {
  left: KanbanItem[];
  right: KanbanItem[];
}

interface TapKanbanProps {
  onHaptic: () => void;
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

export function TapKanban({ onHaptic }: TapKanbanProps) {
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

  const handleItemClick = (item: KanbanItem, from: "left" | "right") => {
    onHaptic();

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

    onHaptic();

    setKanban((prev) =>
      getNewKanbanState(prev, selectedItem.from, to, selectedItem.item)
    );
    setSelectedItem(null);
  };

  return (
    <section className="w-full max-w-md space-y-4">
      <h2 className="font-semibold text-lg">2. Tap to Move Kanban</h2>
      <p className="text-muted-foreground text-sm">
        Tap a card to select, then tap the other column to move it.
      </p>
      <div className="grid grid-cols-2 gap-4" role="application">
        <div
          className={`min-h-[200px] rounded-lg border-2 border-dashed p-3 transition-colors ${
            selectedItem && selectedItem.from === "right"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900"
          }`}
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
                onClick={() => handleItemClick(item, "left")}
                type="button"
              >
                {item.title}
              </button>
            ))}
            {selectedItem && selectedItem.from === "right" && (
              <button
                className="w-full rounded-md border-2 border-blue-400 border-dashed p-3 text-center text-blue-600 transition-all active:scale-95 dark:text-blue-400"
                onClick={() => handleColumnClick("left")}
                type="button"
              >
                ここに移動
              </button>
            )}
          </div>
        </div>
        <div
          className={`min-h-[200px] rounded-lg border-2 border-dashed p-3 transition-colors ${
            selectedItem && selectedItem.from === "left"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900"
          }`}
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
                onClick={() => handleItemClick(item, "right")}
                type="button"
              >
                {item.title}
              </button>
            ))}
            {selectedItem && selectedItem.from === "left" && (
              <button
                className="w-full rounded-md border-2 border-blue-400 border-dashed p-3 text-center text-blue-600 transition-all active:scale-95 dark:text-blue-400"
                onClick={() => handleColumnClick("right")}
                type="button"
              >
                ここに移動
              </button>
            )}
          </div>
        </div>
      </div>
      {selectedItem && (
        <p className="text-center text-muted-foreground text-sm">
          「{selectedItem.item.title}」を選択中 - 移動先のカラムをタップ
        </p>
      )}
    </section>
  );
}
