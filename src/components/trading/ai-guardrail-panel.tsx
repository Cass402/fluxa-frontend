import { ShieldCheck, AlertTriangle, Clock } from "lucide-react";

import type { GuardrailInsight } from "@/lib/data/fluxa";

function urgencyIcon(urgency: GuardrailInsight["urgency"]) {
  switch (urgency) {
    case "now":
      return (
        <AlertTriangle
          className="size-4 text-[color:var(--status-danger-fg)]"
          aria-hidden="true"
        />
      );
    case "soon":
      return (
        <Clock
          className="size-4 text-[color:var(--brand)]"
          aria-hidden="true"
        />
      );
    default:
      return (
        <ShieldCheck
          className="size-4 text-[color:var(--text-subtle)]"
          aria-hidden="true"
        />
      );
  }
}

const urgencyLabel: Record<GuardrailInsight["urgency"], string> = {
  now: "Act now",
  soon: "Plan adjustment",
  monitor: "Monitor",
};

interface GuardrailPanelProps {
  insights: GuardrailInsight[];
}

export function AIGuardrailPanel({ insights }: GuardrailPanelProps) {
  return (
    <section
      aria-label="AI guardrail insights"
      className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[color:var(--foreground)]">
            AI guardrails watching 24/7
          </h2>
          <p className="text-sm text-[color:var(--text-muted)]">
            Every recommendation includes rationale and urgency. Human override
            is always available.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] px-3 py-1 text-xs font-medium text-[color:var(--text-subtle)]">
          <ShieldCheck
            className="size-4 text-[color:var(--brand)]"
            aria-hidden="true"
          />
          Institutional mode
        </span>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {insights.map((insight) => (
          <article
            key={insight.id}
            className="flex h-full flex-col justify-between rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-4"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
              {urgencyIcon(insight.urgency)}
              {urgencyLabel[insight.urgency]}
            </div>
            <div className="mt-4 space-y-3">
              <h3 className="text-sm font-semibold text-[color:var(--foreground)]">
                {insight.title}
              </h3>
              <p className="text-sm text-[color:var(--text-muted)]">
                {insight.description}
              </p>
              <p className="text-xs text-[color:var(--text-subtle)]">
                {insight.impact}
              </p>
            </div>
            <button
              type="button"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg border border-[color:var(--border-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--brand)] transition-colors hover:border-[color:var(--brand)]"
            >
              {insight.cta}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
