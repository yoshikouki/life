"use client";

interface ButtonHapticProps {
  onHaptic: () => void;
}

export function ButtonHaptic({ onHaptic }: ButtonHapticProps) {
  return (
    <section className="w-full max-w-md space-y-4">
      <h2 className="font-semibold text-lg">1. Button Click</h2>
      <p className="text-muted-foreground text-sm">
        Tap the button to feel haptic feedback.
      </p>
      <button
        className="w-full rounded-lg bg-blue-600 px-6 py-4 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        onClick={onHaptic}
        type="button"
      >
        Tap for Haptic
      </button>
    </section>
  );
}
