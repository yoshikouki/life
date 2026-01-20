import { generateQRCode } from "../generator";
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
  const result = await generateQRCode({
    data: value,
    size,
    margin,
    errorCorrectionLevel,
    foregroundColor,
    backgroundColor,
    moduleStyle,
    cornerStyle,
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: result.svg }}
      style={
        {
          "--qr-bg": backgroundColor,
          display: "inline-block",
        } as React.CSSProperties
      }
    />
  );
}
