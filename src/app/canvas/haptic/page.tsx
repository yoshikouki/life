"use client";

import { useCallback, useState } from "react";
import { useHaptic } from "use-haptic";
import { ButtonHaptic } from "./button-haptic";
import { DragKanban } from "./drag-kanban";
import { ScrollHaptic, ScrollMarkers } from "./scroll-haptic";
import { TapKanban } from "./tap-kanban";

export default function HapticPage() {
  const { triggerHaptic } = useHaptic();
  const [hapticCount, setHapticCount] = useState(0);

  const handleHaptic = useCallback(() => {
    triggerHaptic();
    setHapticCount((prev) => prev + 1);
  }, [triggerHaptic]);

  return (
    <div className="min-h-[300vh] w-full">
      <div className="fixed top-4 right-4 z-10 rounded-lg bg-black/80 p-4 text-white backdrop-blur">
        <p className="font-mono text-sm">Haptic triggered: {hapticCount}x</p>
        <p className="mt-1 text-gray-400 text-xs">iOS Safari 18.0+ required</p>
      </div>

      <div className="flex flex-col items-center gap-16 px-4 py-20">
        <h1 className="font-bold text-2xl">Haptic Feedback Experiments</h1>

        <ButtonHaptic onHaptic={handleHaptic} />
        <TapKanban onHaptic={handleHaptic} />
        <ScrollHaptic onHaptic={handleHaptic} />
        <DragKanban onHaptic={handleHaptic} />
        <ScrollMarkers />
      </div>
    </div>
  );
}
