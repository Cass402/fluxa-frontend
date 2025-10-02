import { Sparkles } from "lucide-react";

interface SummaryMetric {
  label: string;
  value: string;
  helper: string;
}

interface PositionSummaryProps {
  metrics: SummaryMetric[];
}

export function PositionSummary({ metrics }: PositionSummaryProps) {
  return (
    <section
      aria-label="Portfolio summary"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className="flex flex-col justify-between rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/90 p-4 shadow-[0_14px_35px_rgba(10,19,40,0.14)]"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
            <Sparkles
              className="size-3.5 text-[color:var(--brand)]"
              aria-hidden="true"
            />
            {metric.label}
          </div>
          <p className="mt-4 text-2xl font-semibold text-[color:var(--foreground)]">
            {metric.value}
          </p>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            {metric.helper}
          </p>
        </article>
      ))}
    </section>
  );
}
