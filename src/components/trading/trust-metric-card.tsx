import { ArrowUpRight, Minus } from "lucide-react";

import type { TrustMetric } from "@/lib/data/fluxa";

function trendIcon(trend: TrustMetric["trend"]) {
  switch (trend) {
    case "up":
      return (
        <ArrowUpRight
          className="size-3 text-[color:var(--status-inRange-fg)]"
          aria-hidden="true"
        />
      );
    case "down":
      return (
        <ArrowUpRight
          className="size-3 rotate-180 text-[color:var(--status-danger-fg)]"
          aria-hidden="true"
        />
      );
    default:
      return (
        <Minus
          className="size-3 text-[color:var(--text-subtle)]"
          aria-hidden="true"
        />
      );
  }
}

const trendLabel: Record<TrustMetric["trend"], string> = {
  up: "Improving",
  down: "Degraded",
  steady: "Stable",
};

interface TrustMetricCardProps {
  metric: TrustMetric;
}

export function TrustMetricCard({ metric }: TrustMetricCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/80 p-4">
      <header className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
        <span>{metric.label}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--surface-muted)] px-2.5 py-1 text-[10px] font-semibold text-[color:var(--text-subtle)]">
          {trendIcon(metric.trend)}
          {trendLabel[metric.trend]}
        </span>
      </header>
      <p className="text-2xl font-semibold text-[color:var(--foreground)]">
        {metric.value}
      </p>
      <p className="text-xs text-[color:var(--text-muted)]">{metric.helper}</p>
    </article>
  );
}
