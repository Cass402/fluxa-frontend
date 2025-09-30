import type { ReactNode } from "react";

interface MetricCardProps {
  value: string;
  label: string;
  annotation?: string;
  badge?: ReactNode;
  sparkline?: number[];
  sparklineLabel?: string;
}

export function MetricCard({
  value,
  label,
  annotation,
  badge,
  sparkline,
  sparklineLabel,
}: MetricCardProps) {
  let sparklinePath: string | null = null;
  let areaPath: string | null = null;

  if (sparkline && sparkline.length > 1) {
    const width = 90;
    const height = 36;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;

    sparklinePath = sparkline
      .map((point, index) => {
        const x = (index / (sparkline.length - 1)) * width;
        const normalized = (point - min) / range;
        const y = height - normalized * height;
        return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    areaPath = `${sparklinePath} L${width},${height} L0,${height} Z`;
  }

  const gradientSource = `${label}-${value}`;
  const gradientId = `metric-gradient-${gradientSource
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)]/90 px-5 py-6">
      <div className="flex items-baseline gap-3 text-3xl font-semibold text-[color:var(--foreground)]">
        <span>{value}</span>
        {badge ? (
          <span className="text-sm font-medium text-[color:var(--accent)]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-subtle)]">
        {label}
      </p>
      {annotation ? (
        <p className="text-sm text-[color:var(--text-muted)]">{annotation}</p>
      ) : null}
      {sparklinePath ? (
        <div className="mt-3 h-16 w-full">
          <span className="sr-only">
            {sparklineLabel ?? `${label} performance trend`}
          </span>
          <svg
            viewBox="0 0 90 36"
            role="presentation"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id={`${gradientId}-line`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.85" />
                <stop
                  offset="100%"
                  stopColor="var(--accent)"
                  stopOpacity="0.85"
                />
              </linearGradient>
              <linearGradient
                id={`${gradientId}-fill`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="var(--brand-soft)"
                  stopOpacity="0.55"
                />
                <stop
                  offset="100%"
                  stopColor="var(--surface-muted)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            {areaPath ? (
              <path
                d={areaPath}
                fill={`url(#${gradientId}-fill)`}
                className="opacity-80"
              />
            ) : null}
            <path
              d={sparklinePath}
              fill="none"
              stroke={`url(#${gradientId}-line)`}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
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
