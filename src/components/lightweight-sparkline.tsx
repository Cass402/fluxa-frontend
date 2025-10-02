"use client";

import { useEffect, useRef } from "react";
import {
  AreaSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";

import type { RangeStatPoint } from "@/services/range-stats";

interface LightweightSparklineProps {
  series: RangeStatPoint[];
  color?: string;
  height?: number;
}

/**
 * Renders a minimal sparkline using Lightweight Charts, matching the muted
 * aesthetic of the rest of the landing metrics.
 */
export function LightweightSparkline({
  series,
  color = "rgba(76, 93, 255, 1)",
  height = 160,
}: LightweightSparklineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartApi = useRef<IChartApi | null>(null);
  const areaSeries = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const chart = createChart(container, {
      width: container.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "var(--text-muted)",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: false,
      },
      handleScale: false,
      handleScroll: false,
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false },
        mode: 0,
      },
    });

    const topColor = withAlpha(color, 0.4);
    const bottomColor = withAlpha(color, 0.08);
    const seriesApi = chart.addSeries(AreaSeries, {
      lineColor: color,
      lineWidth: 2,
      topColor,
      bottomColor,
      priceLineVisible: false,
    });

    chartApi.current = chart;
    areaSeries.current = seriesApi;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        chart.applyOptions({ width });
        chart.timeScale().fitContent();
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartApi.current = null;
      areaSeries.current = null;
    };
  }, [color, height]);

  useEffect(() => {
    if (!areaSeries.current) {
      return;
    }

    const points = series.map((point) => ({
      time: point.time as UTCTimestamp,
      value: point.value,
    }));

    areaSeries.current.setData(points);

    chartApi.current?.timeScale().fitContent();
  }, [series]);

  return <div ref={containerRef} className="h-full w-full" />;
}

function withAlpha(baseColor: string, alpha: number) {
  if (baseColor.startsWith("rgb")) {
    const body = baseColor.replace(/rgba?\(/, "").replace(/\)/, "");
    const parts = body
      .split(",")
      .slice(0, 3)
      .map((part) => part.trim());
    return `rgba(${parts.join(",")}, ${alpha})`;
  }

  return baseColor;
}
