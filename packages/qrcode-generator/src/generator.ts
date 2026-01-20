import QRCode from "qrcode";
import type {
  ErrorCorrectionLevel,
  QRCodeGeneratorResult,
  QRCodeOptions,
} from "./types";

const DEFAULT_SIZE = 256;
const DEFAULT_MARGIN = 4;
const DEFAULT_ERROR_CORRECTION: ErrorCorrectionLevel = "M";

const POSITION_MIDDLE_PATTERN =
  /<rect([^>]*)class="qr-position-middle"([^>]*)\/>/g;
const FILL_CURRENT_COLOR_PATTERN = /fill="currentColor"/;

export async function generateQRMatrix(
  data: string,
  errorCorrectionLevel: ErrorCorrectionLevel = DEFAULT_ERROR_CORRECTION
): Promise<boolean[][]> {
  const qr = await QRCode.create(data, {
    errorCorrectionLevel,
  });

  const size = qr.modules.size;
  const matrix: boolean[][] = [];

  for (let row = 0; row < size; row++) {
    matrix[row] = [];
    for (let col = 0; col < size; col++) {
      matrix[row][col] = qr.modules.get(row, col) === 1;
    }
  }

  return matrix;
}

export function isPositionPattern(
  row: number,
  col: number,
  size: number
): boolean {
  const topLeft = row < 7 && col < 7;
  const topRight = row < 7 && col >= size - 7;
  const bottomLeft = row >= size - 7 && col < 7;
  return topLeft || topRight || bottomLeft;
}

export function isAlignmentPattern(
  row: number,
  col: number,
  alignmentPatternPositions: number[]
): boolean {
  const lastPos = alignmentPatternPositions.at(-1) ?? 0;
  for (const posRow of alignmentPatternPositions) {
    for (const posCol of alignmentPatternPositions) {
      if (
        Math.abs(row - posRow) <= 2 &&
        Math.abs(col - posCol) <= 2 &&
        !(posRow < 7 && posCol < 7) &&
        !(posRow < 7 && posCol >= lastPos - 4) &&
        !(posRow >= lastPos - 4 && posCol < 7)
      ) {
        return true;
      }
    }
  }
  return false;
}

export function isTimingPattern(
  row: number,
  col: number,
  size: number
): boolean {
  return (
    (row === 6 && col >= 8 && col <= size - 9) ||
    (col === 6 && row >= 8 && row <= size - 9)
  );
}

export async function generateQRCode(
  options: QRCodeOptions
): Promise<QRCodeGeneratorResult> {
  const {
    data,
    size = DEFAULT_SIZE,
    margin = DEFAULT_MARGIN,
    errorCorrectionLevel = DEFAULT_ERROR_CORRECTION,
    foregroundColor = "#000000",
    backgroundColor = "#ffffff",
    moduleStyle = "square",
    cornerStyle = "square",
  } = options;

  const matrix = await generateQRMatrix(data, errorCorrectionLevel);
  const moduleCount = matrix.length;
  const moduleSize = (size - margin * 2) / moduleCount;

  let paths = "";
  const processedPositionPatterns = new Set<string>();

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!matrix[row][col]) {
        continue;
      }

      const x = margin + col * moduleSize;
      const y = margin + row * moduleSize;

      if (isPositionPattern(row, col, moduleCount)) {
        const patternKey = getPositionPatternKey(row, col, moduleCount);
        if (!processedPositionPatterns.has(patternKey)) {
          processedPositionPatterns.add(patternKey);
          const patternX =
            margin + getPatternStartCol(col, moduleCount) * moduleSize;
          const patternY =
            margin + getPatternStartRow(row, moduleCount) * moduleSize;
          paths += renderPositionPattern(
            patternX,
            patternY,
            moduleSize,
            cornerStyle
          );
        }
        continue;
      }

      paths += renderModule(x, y, moduleSize, moduleStyle);
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
  <g fill="${foregroundColor}">
    ${paths}
  </g>
</svg>`;

  return { svg, matrix, size };
}

export function getPositionPatternKey(
  row: number,
  col: number,
  size: number
): string {
  if (row < 7 && col < 7) {
    return "top-left";
  }
  if (row < 7 && col >= size - 7) {
    return "top-right";
  }
  return "bottom-left";
}

export function getPatternStartRow(row: number, size: number): number {
  if (row < 7) {
    return 0;
  }
  return size - 7;
}

export function getPatternStartCol(col: number, size: number): number {
  if (col < 7) {
    return 0;
  }
  return size - 7;
}

function renderModule(
  x: number,
  y: number,
  size: number,
  style: string
): string {
  const gap = size * 0.1;
  const adjustedSize = size - gap;

  switch (style) {
    case "rounded":
      return `<rect x="${x + gap / 2}" y="${y + gap / 2}" width="${adjustedSize}" height="${adjustedSize}" rx="${adjustedSize * 0.3}"/>`;
    case "dots": {
      const radius = adjustedSize / 2;
      return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${radius * 0.85}"/>`;
    }
    case "classy":
      return `<rect x="${x + gap / 2}" y="${y + gap / 2}" width="${adjustedSize}" height="${adjustedSize}" rx="${adjustedSize * 0.15}"/>`;
    case "classy-rounded":
      return `<rect x="${x + gap / 2}" y="${y + gap / 2}" width="${adjustedSize}" height="${adjustedSize}" rx="${adjustedSize * 0.5}"/>`;
    default:
      return `<rect x="${x}" y="${y}" width="${size}" height="${size}"/>`;
  }
}

function renderPositionPattern(
  x: number,
  y: number,
  moduleSize: number,
  style: string
): string {
  const outerSize = moduleSize * 7;
  const middleSize = moduleSize * 5;
  const innerSize = moduleSize * 3;
  const middleOffset = moduleSize;
  const innerOffset = moduleSize * 2;

  let rx = "0";
  switch (style) {
    case "rounded":
      rx = String(moduleSize * 1.5);
      break;
    case "extra-rounded":
      rx = String(moduleSize * 2.5);
      break;
    default:
      break;
  }

  return `
    <rect x="${x}" y="${y}" width="${outerSize}" height="${outerSize}" rx="${rx}"/>
    <rect x="${x + middleOffset}" y="${y + middleOffset}" width="${middleSize}" height="${middleSize}" rx="${rx === "0" ? "0" : String(Number.parseFloat(rx) * 0.7)}" fill="currentColor" class="qr-position-middle"/>
    <rect x="${x + innerOffset}" y="${y + innerOffset}" width="${innerSize}" height="${innerSize}" rx="${rx === "0" ? "0" : String(Number.parseFloat(rx) * 0.5)}"/>
  `.replace(POSITION_MIDDLE_PATTERN, (match) => {
    return match.replace(
      FILL_CURRENT_COLOR_PATTERN,
      'fill="var(--qr-bg, #ffffff)"'
    );
  });
}
