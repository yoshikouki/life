import type { ReactElement } from "react";
import {
  generateQRMatrix,
  getPatternStartCol,
  getPatternStartRow,
  getPositionPatternKey,
  isPositionPattern,
} from "./generator";
import type {
  CornerStyle,
  ErrorCorrectionLevel,
  ModuleStyle,
  QRCodeOptions,
} from "./types";

const DEFAULT_SIZE = 256;
const DEFAULT_MARGIN = 4;
const DEFAULT_ERROR_CORRECTION: ErrorCorrectionLevel = "M";

export interface QRCodeSVGProps extends Omit<QRCodeOptions, "logo"> {
  className?: string;
}

interface ModuleProps {
  x: number;
  y: number;
  size: number;
  style: ModuleStyle;
}

interface PositionPatternProps {
  x: number;
  y: number;
  moduleSize: number;
  style: CornerStyle;
  foregroundColor: string;
  backgroundColor: string;
}

function Module({ x, y, size, style }: ModuleProps): ReactElement {
  const gap = size * 0.1;
  const adjustedSize = size - gap;

  switch (style) {
    case "rounded":
      return (
        <rect
          height={adjustedSize}
          rx={adjustedSize * 0.3}
          width={adjustedSize}
          x={x + gap / 2}
          y={y + gap / 2}
        />
      );
    case "dots": {
      const radius = adjustedSize / 2;
      return <circle cx={x + size / 2} cy={y + size / 2} r={radius * 0.85} />;
    }
    case "classy":
      return (
        <rect
          height={adjustedSize}
          rx={adjustedSize * 0.15}
          width={adjustedSize}
          x={x + gap / 2}
          y={y + gap / 2}
        />
      );
    case "classy-rounded":
      return (
        <rect
          height={adjustedSize}
          rx={adjustedSize * 0.5}
          width={adjustedSize}
          x={x + gap / 2}
          y={y + gap / 2}
        />
      );
    default:
      return <rect height={size} width={size} x={x} y={y} />;
  }
}

function PositionPattern({
  x,
  y,
  moduleSize,
  style,
  backgroundColor,
}: PositionPatternProps): ReactElement {
  const outerSize = moduleSize * 7;
  const middleSize = moduleSize * 5;
  const innerSize = moduleSize * 3;
  const middleOffset = moduleSize;
  const innerOffset = moduleSize * 2;

  let rx = 0;
  switch (style) {
    case "rounded":
      rx = moduleSize * 1.5;
      break;
    case "extra-rounded":
      rx = moduleSize * 2.5;
      break;
    default:
      break;
  }

  return (
    <>
      <rect height={outerSize} rx={rx} width={outerSize} x={x} y={y} />
      <rect
        fill={backgroundColor}
        height={middleSize}
        rx={rx === 0 ? 0 : rx * 0.7}
        width={middleSize}
        x={x + middleOffset}
        y={y + middleOffset}
      />
      <rect
        height={innerSize}
        rx={rx === 0 ? 0 : rx * 0.5}
        width={innerSize}
        x={x + innerOffset}
        y={y + innerOffset}
      />
    </>
  );
}

export async function createQRCodeElement(
  props: QRCodeSVGProps
): Promise<ReactElement> {
  const {
    data,
    size = DEFAULT_SIZE,
    margin = DEFAULT_MARGIN,
    errorCorrectionLevel = DEFAULT_ERROR_CORRECTION,
    foregroundColor = "#000000",
    backgroundColor = "#ffffff",
    moduleStyle = "square",
    cornerStyle = "square",
    className,
  } = props;

  const matrix = await generateQRMatrix(data, errorCorrectionLevel);
  const moduleCount = matrix.length;
  const moduleSize = (size - margin * 2) / moduleCount;

  const elements: ReactElement[] = [];
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
          elements.push(
            <PositionPattern
              backgroundColor={backgroundColor}
              foregroundColor={foregroundColor}
              key={`position-${patternKey}`}
              moduleSize={moduleSize}
              style={cornerStyle}
              x={patternX}
              y={patternY}
            />
          );
        }
        continue;
      }

      elements.push(
        <Module
          key={`module-${row}-${col}`}
          size={moduleSize}
          style={moduleStyle}
          x={x}
          y={y}
        />
      );
    }
  }

  return (
    <svg
      aria-label="QR Code"
      className={className}
      height={size}
      role="img"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>QR Code</title>
      <rect fill={backgroundColor} height={size} width={size} />
      <g fill={foregroundColor}>{elements}</g>
    </svg>
  );
}
