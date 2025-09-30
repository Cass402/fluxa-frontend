import type { ReactNode } from "react";

import { Sparkline } from "@/components/sparkline";

interface MetricCardProps {
  value: string;
  label: string;
  annotation?: string;
  badge?: ReactNode;
  sparkline?: number[];
  sparklineLabel?: string;
  sparklineColor?: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function MetricCard({
  value,
  label,
  annotation,
  badge,
  sparkline,
  sparklineLabel,
  sparklineColor,
}: MetricCardProps) {
  const hasSparkline = Boolean(
    sparkline && sparkline.length > 1 && sparklineLabel?.length
  );
  const descriptionId = annotation
    ? `metric-${slugify(label)}-description`
    : undefined;

  return (
    <div className="relative flex flex-col gap-2.5 overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)]/90 px-4 py-5 sm:gap-3 sm:px-5 sm:py-6">
      {hasSparkline ? (
        <div className="flex items-center justify-end">
          <Sparkline
            points={sparkline!}
            label={sparklineLabel!}
            color={sparklineColor}
            width={136}
            height={60}
          />
        </div>
      ) : null}
      <div className="flex items-baseline gap-2.5 text-2xl font-semibold text-[color:var(--foreground)] sm:gap-3 sm:text-3xl">
        <span {...(descriptionId ? { "aria-describedby": descriptionId } : {})}>
          {value}
        </span>
        {badge ? (
          <span className="text-xs font-medium text-[color:var(--accent)] sm:text-sm">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-subtle)] sm:text-xs">
        {label}
      </p>
      {annotation ? (
        <p
          id={descriptionId}
          className="text-xs leading-relaxed text-[color:var(--text-muted)] sm:text-sm"
        >
          {annotation}
        </p>
      ) : null}
      <span
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
        aria-hidden="true"
      >
        <span className="absolute inset-x-6 top-0 h-[2px] rounded-full bg-[color:var(--brand-soft)]" />
      </span>
    </div>
  );
}
