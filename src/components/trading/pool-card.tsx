import { BadgeCheck, Rocket } from "lucide-react";

import type { FluxaPool } from "@/lib/data/fluxa";

const stageLabels: Record<
  FluxaPool["status"],
  { label: string; className: string }
> = {
  live: {
    label: "Live",
    className:
      "bg-[color:var(--status-inRange-bg)] text-[color:var(--status-inRange-fg)]",
  },
  beta: {
    label: "Beta",
    className:
      "bg-[color:var(--status-warning-bg)] text-[color:var(--status-warning-fg)]",
  },
  preview: {
    label: "Preview",
    className:
      "bg-[color:var(--status-soon-bg)] text-[color:var(--status-soon-fg)]",
  },
};

interface PoolCardProps {
  pool: FluxaPool;
}

export function PoolCard({ pool }: PoolCardProps) {
  const stageInfo = stageLabels[pool.status];

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/90 p-5 shadow-[0_18px_42px_rgba(9,18,39,0.18)] transition hover:border-[color:var(--brand-soft)]">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
            {pool.name}
          </h3>
          <p className="text-sm text-[color:var(--text-muted)]">{pool.pair}</p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${stageInfo.className}`}
        >
          <BadgeCheck className="size-3.5" aria-hidden="true" />
          {stageInfo.label}
        </span>
      </header>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
            TVL
          </dt>
          <dd className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">
            ${pool.tvlUsd.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
            APR
          </dt>
          <dd className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">
            {pool.apr.toFixed(1)}%
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
            Depth profile
          </dt>
          <dd className="mt-1 text-sm text-[color:var(--text-muted)]">
            {pool.depthScore}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-[color:var(--text-muted)]">
        {pool.description}
      </p>

      <footer className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2"
        >
          Launch pool
          <Rocket className="size-4" aria-hidden="true" />
        </button>
        {pool.badge ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--text-subtle)]">
            {pool.badge}
          </span>
        ) : null}
      </footer>
    </article>
  );
}
