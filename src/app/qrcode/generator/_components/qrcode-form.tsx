"use client";

import type {
  CornerStyle,
  ErrorCorrectionLevel,
  ModuleStyle,
} from "@life/qrcode-generator";
import { generateQRCode } from "@life/qrcode-generator";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const COLOR_PRESETS = [
  { name: "Classic", fg: "#000000", bg: "#ffffff" },
  { name: "Ocean", fg: "#0ea5e9", bg: "#f0f9ff" },
  { name: "Forest", fg: "#059669", bg: "#ecfdf5" },
  { name: "Sunset", fg: "#f59e0b", bg: "#fffbeb" },
  { name: "Berry", fg: "#e11d48", bg: "#fff1f2" },
  { name: "Purple", fg: "#9333ea", bg: "#faf5ff" },
  { name: "Dark", fg: "#ffffff", bg: "#0f172a" },
];

const MODULE_STYLES: { value: ModuleStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
];

const CORNER_STYLES: { value: CornerStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

const ERROR_CORRECTION_LEVELS: {
  value: ErrorCorrectionLevel;
  label: string;
}[] = [
  { value: "L", label: "Low" },
  { value: "M", label: "Medium" },
  { value: "Q", label: "High" },
  { value: "H", label: "Highest" },
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
  const [showAdvanced, setShowAdvanced] = useState(false);
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

        {/* Advanced Settings */}
        <div className="space-y-4">
          <button
            className="flex w-full items-center justify-between rounded-2xl border-2 border-border bg-background/50 px-6 py-4 font-medium text-foreground text-sm uppercase tracking-wide backdrop-blur-sm transition-all hover:border-primary hover:bg-background"
            onClick={() => setShowAdvanced(!showAdvanced)}
            type="button"
          >
            <span className="opacity-60">Advanced Options</span>
            <motion.svg
              animate={{ rotate: showAdvanced ? 180 : 0 }}
              aria-label="Toggle advanced options"
              className="h-5 w-5 opacity-60"
              fill="none"
              role="img"
              stroke="currentColor"
              strokeWidth={2}
              transition={{ duration: 0.3 }}
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </button>

          {showAdvanced && (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-6 overflow-hidden rounded-2xl border-2 border-border bg-background/50 p-6 backdrop-blur-sm"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Custom Colors */}
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

              {/* Size & Margin */}
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

              {/* Styles */}
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-3">
                  <label
                    className="block font-medium text-foreground text-sm"
                    htmlFor="moduleStyle"
                  >
                    Module Style
                  </label>
                  <select
                    className="w-full cursor-pointer rounded-xl border-2 border-border bg-background px-4 py-3 text-foreground transition-all hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                    id="moduleStyle"
                    onChange={(e) =>
                      setModuleStyle(e.target.value as ModuleStyle)
                    }
                    value={moduleStyle}
                  >
                    {MODULE_STYLES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label
                    className="block font-medium text-foreground text-sm"
                    htmlFor="cornerStyle"
                  >
                    Corner Style
                  </label>
                  <select
                    className="w-full cursor-pointer rounded-xl border-2 border-border bg-background px-4 py-3 text-foreground transition-all hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                    id="cornerStyle"
                    onChange={(e) =>
                      setCornerStyle(e.target.value as CornerStyle)
                    }
                    value={cornerStyle}
                  >
                    {CORNER_STYLES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label
                    className="block font-medium text-foreground text-sm"
                    htmlFor="errorCorrectionLevel"
                  >
                    Error Correction
                  </label>
                  <select
                    className="w-full cursor-pointer rounded-xl border-2 border-border bg-background px-4 py-3 text-foreground transition-all hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                    id="errorCorrectionLevel"
                    onChange={(e) =>
                      setErrorCorrectionLevel(
                        e.target.value as ErrorCorrectionLevel
                      )
                    }
                    value={errorCorrectionLevel}
                  >
                    {ERROR_CORRECTION_LEVELS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
