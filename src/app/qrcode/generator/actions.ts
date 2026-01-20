"use server";

import {
  type CornerStyle,
  type ErrorCorrectionLevel,
  generateQRCode,
  type ModuleStyle,
} from "@life/qrcode-generator";

interface QRCodeFormState {
  svg: string | null;
  size: number | null;
  error: string | null;
}

export async function generateQRCodeAction(
  _prevState: QRCodeFormState,
  formData: FormData
): Promise<QRCodeFormState> {
  const data = formData.get("data");

  if (!data || typeof data !== "string" || data.trim() === "") {
    return {
      svg: null,
      size: null,
      error: "Please enter content for the QR code",
    };
  }

  const size = Number(formData.get("size")) || 256;
  const margin = Number(formData.get("margin")) || 4;
  const foregroundColor =
    (formData.get("foregroundColor") as string) || "#000000";
  const backgroundColor =
    (formData.get("backgroundColor") as string) || "#ffffff";
  const moduleStyle = (formData.get("moduleStyle") as ModuleStyle) || "square";
  const cornerStyle = (formData.get("cornerStyle") as CornerStyle) || "square";
  const errorCorrectionLevel =
    (formData.get("errorCorrectionLevel") as ErrorCorrectionLevel) || "M";

  try {
    const result = await generateQRCode({
      data: data.trim(),
      size: Math.min(Math.max(size, 64), 1024),
      margin: Math.min(Math.max(margin, 0), 20),
      foregroundColor,
      backgroundColor,
      moduleStyle,
      cornerStyle,
      errorCorrectionLevel,
    });

    return { svg: result.svg, size: result.size, error: null };
  } catch (error) {
    console.error("QR Code generation error:", error);
    return {
      svg: null,
      size: null,
      error: "Failed to generate QR code. Please try again.",
    };
  }
}
