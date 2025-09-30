import type { ReactNode } from "react";

interface MetricCardProps {
  value: string;
  label: string;
  annotation?: string;
  badge?: ReactNode;
}

export function MetricCard({
  value,
  label,
  annotation,
  badge,
}: MetricCardProps) {
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
      <span
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
        aria-hidden="true"
      >
        <span className="absolute inset-x-6 top-0 h-[2px] rounded-full bg-[color:var(--brand-soft)]" />
      </span>
    </div>
  );
}
