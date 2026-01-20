export { generateQRCode, generateQRMatrix } from "./generator";
export type { QRCodeSVGProps } from "./svg-renderer";
export { createQRCodeElement } from "./svg-renderer";
export type {
  CornerStyle,
  ErrorCorrectionLevel,
  LogoOptions,
  ModuleStyle,
  QRCodeGeneratorResult,
  QRCodeOptions,
  QRModulePosition,
} from "./types";

export const QRCODE_GENERATOR_VERSION = "0.0.1";
