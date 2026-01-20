"use client";

import type {
  CornerStyle,
  ErrorCorrectionLevel,
  ModuleStyle,
} from "@life/qrcode-generator";
import { generateQRCode } from "@life/qrcode-generator";
import { motion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";

const COLOR_PRESETS = [
  { name: "Classic", fg: "#000000", bg: "#ffffff" },
  { name: "Ocean", fg: "#0ea5e9", bg: "#f0f9ff" },
  { name: "Forest", fg: "#059669", bg: "#ecfdf5" },
  { name: "Sunset", fg: "#f59e0b", bg: "#fffbeb" },
  { name: "Berry", fg: "#e11d48", bg: "#fff1f2" },
  { name: "Purple", fg: "#9333ea", bg: "#faf5ff" },
  { name: "Dark", fg: "#ffffff", bg: "#0f172a" },
];

const MODULE_STYLES: {
  value: ModuleStyle;
  label: string;
  icon: ReactNode;
}[] = [
  {
    value: "square",
    label: "Square",
    icon: (
      <div className="grid grid-cols-3 gap-1">
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
      </div>
    ),
  },
  {
    value: "rounded",
    label: "Rounded",
    icon: (
      <div className="grid grid-cols-3 gap-1">
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
      </div>
    ),
  },
  {
    value: "dots",
    label: "Dots",
    icon: (
      <div className="grid grid-cols-3 gap-1">
        <div className="h-2 w-2 rounded-full bg-current" />
        <div className="h-2 w-2 rounded-full bg-current" />
        <div className="h-2 w-2 rounded-full bg-current" />
        <div className="h-2 w-2 rounded-full bg-current" />
        <div className="h-2 w-2 rounded-full bg-current" />
        <div className="h-2 w-2 rounded-full bg-current" />
        <div className="h-2 w-2 rounded-full bg-current" />
        <div className="h-2 w-2 rounded-full bg-current" />
        <div className="h-2 w-2 rounded-full bg-current" />
      </div>
    ),
  },
  {
    value: "classy",
    label: "Classy",
    icon: (
      <div className="grid grid-cols-3 gap-1">
        <div className="relative h-2 w-2 bg-current">
          <div className="absolute top-0 left-0 h-1 w-1 bg-background" />
        </div>
        <div className="h-2 w-2 bg-current" />
        <div className="relative h-2 w-2 bg-current">
          <div className="absolute top-0 right-0 h-1 w-1 bg-background" />
        </div>
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
        <div className="h-2 w-2 bg-current" />
        <div className="relative h-2 w-2 bg-current">
          <div className="absolute bottom-0 left-0 h-1 w-1 bg-background" />
        </div>
        <div className="h-2 w-2 bg-current" />
        <div className="relative h-2 w-2 bg-current">
          <div className="absolute right-0 bottom-0 h-1 w-1 bg-background" />
        </div>
      </div>
    ),
  },
  {
    value: "classy-rounded",
    label: "Classy Rounded",
    icon: (
      <div className="grid grid-cols-3 gap-1">
        <div className="relative h-2 w-2 rounded-sm bg-current">
          <div className="absolute top-0 left-0 h-1 w-1 rounded-tl-sm bg-background" />
        </div>
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="relative h-2 w-2 rounded-sm bg-current">
          <div className="absolute top-0 right-0 h-1 w-1 rounded-tr-sm bg-background" />
        </div>
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="relative h-2 w-2 rounded-sm bg-current">
          <div className="absolute bottom-0 left-0 h-1 w-1 rounded-bl-sm bg-background" />
        </div>
        <div className="h-2 w-2 rounded-sm bg-current" />
        <div className="relative h-2 w-2 rounded-sm bg-current">
          <div className="absolute right-0 bottom-0 h-1 w-1 rounded-br-sm bg-background" />
        </div>
      </div>
    ),
  },
];

const CORNER_STYLES: {
  value: CornerStyle;
  label: string;
  icon: ReactNode;
}[] = [
  {
    value: "square",
    label: "Square",
    icon: (
      <div className="relative h-8 w-8 border-2 border-current">
        <div className="absolute inset-1 border-2 border-current">
          <div className="h-full w-full bg-current" />
        </div>
      </div>
    ),
  },
  {
    value: "rounded",
    label: "Rounded",
    icon: (
      <div className="relative h-8 w-8 rounded-md border-2 border-current">
        <div className="absolute inset-1 rounded-sm border-2 border-current">
          <div className="h-full w-full rounded-sm bg-current" />
        </div>
      </div>
    ),
  },
  {
    value: "extra-rounded",
    label: "Extra Rounded",
    icon: (
      <div className="relative h-8 w-8 rounded-lg border-2 border-current">
        <div className="absolute inset-1 rounded-md border-2 border-current">
          <div className="h-full w-full rounded-md bg-current" />
        </div>
      </div>
    ),
  },
];

const ERROR_CORRECTION_LEVELS: {
  value: ErrorCorrectionLevel;
  label: string;
  description: string;
  bars: number;
}[] = [
  { value: "L", label: "L", description: "7%", bars: 1 },
  { value: "M", label: "M", description: "15%", bars: 2 },
  { value: "Q", label: "Q", description: "25%", bars: 3 },
  { value: "H", label: "H", description: "30%", bars: 4 },
];

export function QRCodeForm() {
  const [content, setContent] = useState("https://yoshikouki.com");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [moduleStyle, setModuleStyle] = useState<ModuleStyle>("square");
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>("square");
  const [errorCorrectionLevel, setErrorCorrectionLevel] =
    useState<ErrorCorrectionLevel>("M");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(4);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!content) {
      setQrCode(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await generateQRCode({
          data: content,
          size,
          margin,
          foregroundColor,
          backgroundColor,
          moduleStyle,
          cornerStyle,
          errorCorrectionLevel,
        });
        setQrCode(result.svg);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate QR code"
        );
        setQrCode(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    content,
    size,
    margin,
    foregroundColor,
    backgroundColor,
    moduleStyle,
    cornerStyle,
    errorCorrectionLevel,
  ]);

  const handleDownload = (format: "svg" | "png") => {
    if (!qrCode) {
      return;
    }

    if (format === "svg") {
      const blob = new Blob([qrCode], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.svg";
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const svgBlob = new Blob([qrCode], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const pngUrl = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = pngUrl;
              link.download = "qrcode.png";
              link.click();
              URL.revokeObjectURL(pngUrl);
            }
          }, "image/png");
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Main Input */}
        <div className="space-y-3">
          <label
            className="block font-medium text-foreground text-sm uppercase tracking-wide opacity-60"
            htmlFor="content"
          >
            Enter Content
          </label>
          <textarea
            className="w-full resize-none rounded-2xl border-2 border-border bg-background/50 px-6 py-4 font-medium text-2xl text-foreground backdrop-blur-sm transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
            id="content"
            onChange={(e) => setContent(e.target.value)}
            placeholder="https://example.com"
            rows={3}
            value={content}
          />
        </div>

        {/* QR Code Preview */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {error && (
            <motion.div
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-destructive/20 bg-destructive/10 px-6 py-4 text-center text-destructive"
              initial={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
          {!error && qrCode && (
            <>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-br from-background to-muted p-8 shadow-2xl"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                {/* biome-ignore lint/performance/noImgElement: data URL is not supported by next/image */}
                <img
                  alt="Generated QR Code"
                  className="rounded-2xl"
                  height={size}
                  src={`data:image/svg+xml,${encodeURIComponent(qrCode)}`}
                  width={size}
                />
              </motion.div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <button
                  className="group relative overflow-hidden rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                  onClick={() => handleDownload("svg")}
                  type="button"
                >
                  <span className="relative z-10">Download SVG</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
                <button
                  className="group relative overflow-hidden rounded-full border-2 border-border bg-background px-8 py-3 font-semibold text-foreground shadow-lg transition-all hover:scale-105 hover:border-primary hover:shadow-xl active:scale-95"
                  onClick={() => handleDownload("png")}
                  type="button"
                >
                  <span className="relative z-10">Download PNG</span>
                </button>
              </motion.div>
            </>
          )}
          {!(error || qrCode) && (
            <motion.div
              animate={{ opacity: 1 }}
              className="py-16 text-center text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
            >
              Your QR code will appear here
            </motion.div>
          )}
        </motion.div>

        {/* Color Presets */}
        <div className="space-y-4">
          <div className="block font-medium text-foreground text-sm uppercase tracking-wide opacity-60">
            Color Presets
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {COLOR_PRESETS.map((preset) => (
              <button
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-md transition-all hover:scale-110 hover:shadow-xl active:scale-95"
                key={preset.name}
                onClick={() => {
                  setForegroundColor(preset.fg);
                  setBackgroundColor(preset.bg);
                }}
                style={{
                  background: `linear-gradient(135deg, ${preset.bg} 0%, ${preset.bg} 40%, ${preset.fg} 100%)`,
                }}
                title={preset.name}
                type="button"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-full bg-black/50 px-3 py-1 font-medium text-white text-xs backdrop-blur-sm">
                    {preset.name}
                  </span>
                </div>
                {foregroundColor === preset.fg &&
                  backgroundColor === preset.bg && (
                    <motion.div
                      animate={{ scale: 1 }}
                      className="absolute inset-0 rounded-2xl border-4 border-primary"
                      initial={{ scale: 0 }}
                      layoutId="activePreset"
                    />
                  )}
              </button>
            ))}
          </div>
        </div>

        {/* Module Style */}
        <div className="space-y-4">
          <div className="block font-medium text-foreground text-sm uppercase tracking-wide opacity-60">
            Module Style
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {MODULE_STYLES.map((style) => (
              <button
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 border-border bg-background/50 p-4 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                key={style.value}
                onClick={() => setModuleStyle(style.value)}
                type="button"
              >
                <div className="text-foreground">{style.icon}</div>
                <span className="font-medium text-foreground text-xs">
                  {style.label}
                </span>
                {moduleStyle === style.value && (
                  <motion.div
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-2xl border-4 border-primary"
                    initial={{ scale: 0 }}
                    layoutId="activeModuleStyle"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Corner Style */}
        <div className="space-y-4">
          <div className="block font-medium text-foreground text-sm uppercase tracking-wide opacity-60">
            Corner Style
          </div>
          <div className="grid grid-cols-3 gap-3">
            {CORNER_STYLES.map((style) => (
              <button
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 border-border bg-background/50 p-4 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                key={style.value}
                onClick={() => setCornerStyle(style.value)}
                type="button"
              >
                <div className="text-foreground">{style.icon}</div>
                <span className="font-medium text-foreground text-xs">
                  {style.label}
                </span>
                {cornerStyle === style.value && (
                  <motion.div
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-2xl border-4 border-primary"
                    initial={{ scale: 0 }}
                    layoutId="activeCornerStyle"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error Correction Level */}
        <div className="space-y-4">
          <div className="block font-medium text-foreground text-sm uppercase tracking-wide opacity-60">
            Error Correction
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ERROR_CORRECTION_LEVELS.map((level) => (
              <button
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 border-border bg-background/50 p-4 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                key={level.value}
                onClick={() => setErrorCorrectionLevel(level.value)}
                type="button"
              >
                <div className="flex h-8 items-end gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      className="w-2 rounded-t transition-all"
                      key={`${level.value}-${i + 1}`}
                      style={{
                        height: `${i < level.bars ? (i + 1) * 25 : 0}%`,
                        backgroundColor:
                          i < level.bars
                            ? "currentColor"
                            : "var(--color-muted)",
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-foreground text-sm">
                    {level.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {level.description}
                  </span>
                </div>
                {errorCorrectionLevel === level.value && (
                  <motion.div
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-2xl border-4 border-primary"
                    initial={{ scale: 0 }}
                    layoutId="activeErrorCorrection"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="space-y-4">
          <div className="block font-medium text-foreground text-sm uppercase tracking-wide opacity-60">
            Custom Colors
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <label
                className="block font-medium text-foreground text-sm"
                htmlFor="fg"
              >
                Foreground Color
              </label>
              <div className="flex gap-3">
                <input
                  className="h-14 w-14 cursor-pointer rounded-xl border-2 border-border transition-all hover:scale-105"
                  id="fg"
                  onChange={(e) => setForegroundColor(e.target.value)}
                  type="color"
                  value={foregroundColor}
                />
                <input
                  className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-2 font-mono text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                  onChange={(e) => setForegroundColor(e.target.value)}
                  pattern="^#[0-9A-Fa-f]{6}$"
                  type="text"
                  value={foregroundColor}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label
                className="block font-medium text-foreground text-sm"
                htmlFor="bg"
              >
                Background Color
              </label>
              <div className="flex gap-3">
                <input
                  className="h-14 w-14 cursor-pointer rounded-xl border-2 border-border transition-all hover:scale-105"
                  id="bg"
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  type="color"
                  value={backgroundColor}
                />
                <input
                  className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-2 font-mono text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  pattern="^#[0-9A-Fa-f]{6}$"
                  type="text"
                  value={backgroundColor}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Size & Margin */}
        <div className="space-y-4">
          <div className="block font-medium text-foreground text-sm uppercase tracking-wide opacity-60">
            Size & Margin
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <label
                className="block font-medium text-foreground text-sm"
                htmlFor="size"
              >
                Size: {size}px
              </label>
              <input
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary transition-all hover:bg-muted-foreground/20"
                id="size"
                max={512}
                min={128}
                onChange={(e) => setSize(Number(e.target.value))}
                step={32}
                type="range"
                value={size}
              />
            </div>

            <div className="space-y-3">
              <label
                className="block font-medium text-foreground text-sm"
                htmlFor="margin"
              >
                Margin: {margin}
              </label>
              <input
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary transition-all hover:bg-muted-foreground/20"
                id="margin"
                max={20}
                min={0}
                onChange={(e) => setMargin(Number(e.target.value))}
                type="range"
                value={margin}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
