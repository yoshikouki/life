"use client";

import { useRef, useState } from "react";

interface KanbanItem {
  id: string;
  title: string;
}

interface KanbanState {
  left: KanbanItem[];
  right: KanbanItem[];
}

interface DragKanbanProps {
  onHaptic: () => void;
}

interface DragState {
  item: KanbanItem;
  from: "left" | "right";
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
}

const DRAG_THRESHOLD = 15;

export function DragKanban({ onHaptic }: DragKanbanProps) {
  const [kanban, setKanban] = useState<KanbanState>({
    left: [
      { id: "d1", title: "Drag A" },
      { id: "d2", title: "Drag B" },
    ],
    right: [{ id: "d3", title: "Drag C" }],
  });
  const [dragState, setDragState] = useState<DragState | null>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  const getDropTarget = (clientX: number): "left" | "right" | null => {
    const leftRect = leftColumnRef.current?.getBoundingClientRect();
    const rightRect = rightColumnRef.current?.getBoundingClientRect();

    if (leftRect && clientX >= leftRect.left && clientX <= leftRect.right) {
      return "left";
    }
    if (rightRect && clientX >= rightRect.left && clientX <= rightRect.right) {
      return "right";
    }
    return null;
  };

  const moveItem = (
    from: "left" | "right",
    to: "left" | "right",
    item: KanbanItem
  ) => {
    setKanban((prev) => {
      const fromItems = prev[from].filter((i) => i.id !== item.id);
      const toItems = [...prev[to], item];
      return {
        left: from === "left" ? fromItems : toItems,
        right: from === "right" ? fromItems : toItems,
      };
    });
  };

  const handleTouchStart = (
    e: React.TouchEvent,
    item: KanbanItem,
    from: "left" | "right"
  ) => {
    const touch = e.touches[0];
    setDragState({
      item,
      from,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: false,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState) {
      return;
    }

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragState.startX;
    const deltaY = touch.clientY - dragState.startY;
    const distance = Math.hypot(deltaX, deltaY);

    // ドラッグ開始判定
    if (!dragState.isDragging && distance > DRAG_THRESHOLD) {
      setDragState((prev) =>
        prev
          ? {
              ...prev,
              isDragging: true,
              currentX: touch.clientX,
              currentY: touch.clientY,
            }
          : null
      );
      // ドラッグ開始時にスクロールを防止
      e.preventDefault();
    } else if (dragState.isDragging) {
      setDragState((prev) =>
        prev
          ? { ...prev, currentX: touch.clientX, currentY: touch.clientY }
          : null
      );
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!dragState) {
      return;
    }

    if (dragState.isDragging) {
      // ドラッグ完了 - ドロップ先を判定
      const dropTarget = getDropTarget(dragState.currentX);
      if (dropTarget && dropTarget !== dragState.from) {
        moveItem(dragState.from, dropTarget, dragState.item);
        onHaptic(); // ドロップ成功時にhaptic
      }
    } else {
      // タップ（移動なし） - hapticのみ発火
      onHaptic();
    }

    setDragState(null);
  };

  const handleTouchCancel = () => {
    setDragState(null);
  };

  const renderItem = (item: KanbanItem, from: "left" | "right") => {
    const isBeingDragged =
      dragState?.item.id === item.id && dragState.isDragging;

    return (
      <div
        className={`w-full select-none rounded-md p-3 text-left shadow-sm transition-all ${
          isBeingDragged
            ? "scale-105 bg-green-500 text-white shadow-lg"
            : "bg-white active:scale-95 dark:bg-gray-800"
        }`}
        key={item.id}
        onTouchCancel={handleTouchCancel}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={(e) => handleTouchStart(e, item, from)}
        style={{
          touchAction: "pan-y", // 縦スクロールは許可、横スクロールはドラッグ用
        }}
      >
        {item.title}
      </div>
    );
  };

  const isDropTargetActive = (column: "left" | "right") => {
    return dragState?.isDragging && dragState.from !== column;
  };

  return (
    <section className="w-full max-w-md space-y-4">
      <h2 className="font-semibold text-lg">4. Drag & Drop Kanban</h2>
      <p className="text-muted-foreground text-sm">
        カードを横にドラッグして移動。ドロップ成功時にhaptic。
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`min-h-[200px] rounded-lg border-2 border-dashed p-3 transition-colors ${
            isDropTargetActive("left")
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900"
          }`}
          ref={leftColumnRef}
        >
          <h3 className="mb-3 font-medium text-gray-600 text-sm dark:text-gray-400">
            To Do
          </h3>
          <div className="space-y-2">
            {kanban.left.map((item) => renderItem(item, "left"))}
          </div>
        </div>
        <div
          className={`min-h-[200px] rounded-lg border-2 border-dashed p-3 transition-colors ${
            isDropTargetActive("right")
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900"
          }`}
          ref={rightColumnRef}
        >
          <h3 className="mb-3 font-medium text-gray-600 text-sm dark:text-gray-400">
            Done
          </h3>
          <div className="space-y-2">
            {kanban.right.map((item) => renderItem(item, "right"))}
          </div>
        </div>
      </div>
      {dragState?.isDragging && (
        <p className="text-center text-muted-foreground text-sm">
          「{dragState.item.title}」をドラッグ中...
        </p>
      )}
    </section>
  );
}
