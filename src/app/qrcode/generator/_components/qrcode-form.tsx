"use client";

import type {
  CornerStyle,
  ErrorCorrectionLevel,
  ModuleStyle,
} from "@life/qrcode-generator";
import { useActionState } from "react";
import { generateQRCodeAction } from "../actions";

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
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
];

interface QRCodeFormState {
  svg: string | null;
  error: string | null;
}

const inputClassName =
  "w-full rounded-lg border border-border bg-input px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary";

export function QRCodeForm() {
  const [state, formAction, isPending] = useActionState<
    QRCodeFormState,
    FormData
  >(generateQRCodeAction, { svg: null, error: null });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form action={formAction} className="space-y-6">
        <div>
          <label className="mb-2 block font-medium text-sm" htmlFor="data">
            Content
          </label>
          <input
            className={inputClassName}
            id="data"
            name="data"
            placeholder="https://example.com"
            required
            type="text"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-sm" htmlFor="size">
              Size (px)
            </label>
            <input
              className={inputClassName}
              defaultValue={256}
              id="size"
              max={1024}
              min={64}
              name="size"
              type="number"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-sm" htmlFor="margin">
              Margin
            </label>
            <input
              className={inputClassName}
              defaultValue={4}
              id="margin"
              max={20}
              min={0}
              name="margin"
              type="number"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="mb-2 block font-medium text-sm"
              htmlFor="foregroundColor"
            >
              Foreground Color
            </label>
            <div className="flex gap-2">
              <input
                className="h-12 w-12 cursor-pointer rounded-lg border border-border"
                defaultValue="#000000"
                id="foregroundColor"
                name="foregroundColor"
                type="color"
              />
              <input
                className="flex-1 rounded-lg border border-border bg-input px-4 py-3 text-base text-foreground focus:border-primary focus:ring-2 focus:ring-primary"
                defaultValue="#000000"
                name="foregroundColorText"
                pattern="^#[0-9A-Fa-f]{6}$"
                type="text"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-2 block font-medium text-sm"
              htmlFor="backgroundColor"
            >
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                className="h-12 w-12 cursor-pointer rounded-lg border border-border"
                defaultValue="#ffffff"
                id="backgroundColor"
                name="backgroundColor"
                type="color"
              />
              <input
                className="flex-1 rounded-lg border border-border bg-input px-4 py-3 text-base text-foreground focus:border-primary focus:ring-2 focus:ring-primary"
                defaultValue="#ffffff"
                name="backgroundColorText"
                pattern="^#[0-9A-Fa-f]{6}$"
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="mb-2 block font-medium text-sm"
              htmlFor="moduleStyle"
            >
              Module Style
            </label>
            <select
              className={inputClassName}
              defaultValue="square"
              id="moduleStyle"
              name="moduleStyle"
            >
              {MODULE_STYLES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="mb-2 block font-medium text-sm"
              htmlFor="cornerStyle"
            >
              Corner Style
            </label>
            <select
              className={inputClassName}
              defaultValue="square"
              id="cornerStyle"
              name="cornerStyle"
            >
              {CORNER_STYLES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            className="mb-2 block font-medium text-sm"
            htmlFor="errorCorrectionLevel"
          >
            Error Correction Level
          </label>
          <select
            className={inputClassName}
            defaultValue="M"
            id="errorCorrectionLevel"
            name="errorCorrectionLevel"
          >
            {ERROR_CORRECTION_LEVELS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-base text-primary-foreground transition-colors hover:bg-primary/90 focus:ring-4 focus:ring-ring disabled:opacity-50"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Generating..." : "Generate QR Code"}
        </button>
      </form>

      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8">
        {state.error && (
          <p className="text-center text-destructive">{state.error}</p>
        )}
        {state.svg ? (
          <div className="space-y-4">
            <div
              className="rounded-lg bg-white p-4 shadow-sm"
              dangerouslySetInnerHTML={{ __html: state.svg }}
            />
            <DownloadButton svg={state.svg} />
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Enter content and click Generate to create a QR code
          </p>
        )}
      </div>
    </div>
  );
}

function DownloadButton({ svg }: { svg: string }) {
  const handleDownload = (format: "svg" | "png") => {
    if (format === "svg") {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.svg";
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const svgBlob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
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
    <div className="flex gap-2">
      <button
        className="rounded-lg border border-border bg-secondary px-4 py-2 font-medium text-secondary-foreground text-sm transition-colors hover:bg-secondary/80"
        onClick={() => handleDownload("svg")}
        type="button"
      >
        Download SVG
      </button>
      <button
        className="rounded-lg border border-border bg-secondary px-4 py-2 font-medium text-secondary-foreground text-sm transition-colors hover:bg-secondary/80"
        onClick={() => handleDownload("png")}
        type="button"
      >
        Download PNG
      </button>
    </div>
  );
}
