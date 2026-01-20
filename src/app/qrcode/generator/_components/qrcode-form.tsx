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
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
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
                className="h-12 w-12 cursor-pointer rounded-lg border border-gray-300"
                defaultValue="#000000"
                id="foregroundColor"
                name="foregroundColor"
                type="color"
              />
              <input
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
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
                className="h-12 w-12 cursor-pointer rounded-lg border border-gray-300"
                defaultValue="#ffffff"
                id="backgroundColor"
                name="backgroundColor"
                type="color"
              />
              <input
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
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
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
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
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-base text-white transition-colors hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Generating..." : "Generate QR Code"}
        </button>
      </form>

      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-800">
        {state.error && (
          <p className="text-center text-red-500">{state.error}</p>
        )}
        {state.svg ? (
          <div className="space-y-4">
            <div
              className="rounded-lg bg-white p-4 shadow-sm"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG is generated by our server action from @life/qrcode-generator
              dangerouslySetInnerHTML={{ __html: state.svg }}
            />
            <DownloadButton svg={state.svg} />
          </div>
        ) : (
          <p className="text-center text-gray-500">
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
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
        onClick={() => handleDownload("svg")}
        type="button"
      >
        Download SVG
      </button>
      <button
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
        onClick={() => handleDownload("png")}
        type="button"
      >
        Download PNG
      </button>
    </div>
  );
}
