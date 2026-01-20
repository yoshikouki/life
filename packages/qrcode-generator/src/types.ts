export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type ModuleStyle =
  | "square"
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded";

export type CornerStyle = "square" | "rounded" | "extra-rounded";

export interface QRCodeOptions {
  data: string;
  size?: number;
  margin?: number;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  foregroundColor?: string;
  backgroundColor?: string;
  moduleStyle?: ModuleStyle;
  cornerStyle?: CornerStyle;
  cornerDotStyle?: ModuleStyle;
  logo?: LogoOptions;
}

export interface LogoOptions {
  src: string;
  size?: number;
  margin?: number;
  borderRadius?: number;
}

export interface QRCodeGeneratorResult {
  svg: string;
  matrix: boolean[][];
  size: number;
}

export interface QRModulePosition {
  row: number;
  col: number;
  isPositionPattern: boolean;
  isAlignmentPattern: boolean;
  isTimingPattern: boolean;
}
