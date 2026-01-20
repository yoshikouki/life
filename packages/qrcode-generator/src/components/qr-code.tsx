import { createQRCodeElement } from "../svg-renderer";
import type { QRCodeOptions } from "../types";

export interface QRCodeProps extends Omit<QRCodeOptions, "data"> {
  value: string;
  className?: string;
}

export async function QRCode({
  value,
  size = 256,
  margin = 4,
  errorCorrectionLevel = "M",
  foregroundColor = "#000000",
  backgroundColor = "#ffffff",
  moduleStyle = "square",
  cornerStyle = "square",
  className,
}: QRCodeProps) {
  return await createQRCodeElement({
    data: value,
    size,
    margin,
    errorCorrectionLevel,
    foregroundColor,
    backgroundColor,
    moduleStyle,
    cornerStyle,
    className,
  });
}
