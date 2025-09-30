"use client";

import { useId, useMemo } from "react";
import { area, curveCatmullRom, line } from "d3-shape";
import { motion, useReducedMotion } from "motion/react";

interface SparklineProps {
  points: number[];
  label: string;
  color?: string;
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 128;
const DEFAULT_HEIGHT = 56;
const PADDING = 6;

function createScales(
  values: number[],
  width: number,
  height: number,
  padding: number
) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const usableWidth = Math.max(width - padding * 2, 1);
  const usableHeight = Math.max(height - padding * 2, 1);

  const getX = (index: number) =>
    padding + (usableWidth * index) / Math.max(values.length - 1, 1);
  const getY = (value: number) =>
    height - padding - ((value - min) / range) * usableHeight;

  return { getX, getY };
}

export function Sparkline({
  points,
  label,
  color = "var(--brand)",
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: SparklineProps) {
  const { linePath, areaPath, terminal } = useMemo(() => {
    if (points.length < 2) {
      return {
        linePath: "",
        areaPath: "",
        terminal: { x: width - PADDING, y: height / 2 },
      };
    }

    const { getX, getY } = createScales(points, width, height, PADDING);

    const lineGenerator = line<number>()
      .x((_value: number, index: number) => getX(index))
      .y((value: number) => getY(value))
      .curve(curveCatmullRom.alpha(0.8));

    const areaGenerator = area<number>()
      .x((_value: number, index: number) => getX(index))
      .y0(() => height - PADDING)
      .y1((value: number) => getY(value))
      .curve(curveCatmullRom.alpha(0.8));

    return {
      linePath: lineGenerator(points) ?? "",
      areaPath: areaGenerator(points) ?? "",
      terminal: {
        x: getX(points.length - 1),
        y: getY(points[points.length - 1]),
      },
    };
  }, [points, width, height]);
  const gradientId = useId();
  const prefersReducedMotion = useReducedMotion();

  if (!linePath) {
    return null;
  }

  return (
    <motion.svg
      role="img"
      aria-label={label}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none select-none"
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {areaPath ? (
        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scaleY: 0.9 }
          }
          whileInView={
            prefersReducedMotion
              ? { opacity: 0.28 }
              : { opacity: 0.28, scaleY: 1 }
          }
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: "50% 100%" }}
        />
      ) : null}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: prefersReducedMotion ? 0.4 : 0.9,
          ease: "easeInOut",
        }}
      />
      <motion.circle
        cx={terminal.x}
        cy={terminal.y}
        r={3.5}
        fill={color}
        initial={
          prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }
        }
        whileInView={
          prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
        }
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : 0.45 }}
      />
    </motion.svg>
  );
}
