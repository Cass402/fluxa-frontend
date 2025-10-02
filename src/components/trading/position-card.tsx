import { ArrowUpRight, LineChart, Droplet } from "lucide-react";

import type { FluxaPosition } from "@/lib/data/fluxa";

function statusLabel(status: FluxaPosition["status"]) {
  switch (status) {
    case "inRange":
      return {
        label: "In range",
        className:
          "bg-[color:var(--status-inRange-bg)] text-[color:var(--status-inRange-fg)]",
      };
    case "edge":
      return {
        label: "Near edge",
        className:
          "bg-[color:var(--status-warning-bg)] text-[color:var(--status-warning-fg)]",
      };
    default:
      return {
        label: "Out of range",
        className:
          "bg-[color:var(--status-danger-bg)] text-[color:var(--status-danger-fg)]",
      };
  }
}

function coverageWidthClass(percent: number) {
  if (percent >= 100) return "w-full";
  if (percent >= 95) return "w-[95%]";
  if (percent >= 90) return "w-[90%]";
  if (percent >= 85) return "w-[85%]";
  if (percent >= 80) return "w-[80%]";
  if (percent >= 75) return "w-[75%]";
  if (percent >= 70) return "w-[70%]";
  if (percent >= 65) return "w-[65%]";
  if (percent >= 60) return "w-[60%]";
  if (percent >= 55) return "w-[55%]";
  if (percent >= 50) return "w-[50%]";
  if (percent >= 45) return "w-[45%]";
  if (percent >= 40) return "w-[40%]";
  if (percent >= 35) return "w-[35%]";
  if (percent >= 30) return "w-[30%]";
  if (percent >= 25) return "w-[25%]";
  if (percent >= 20) return "w-[20%]";
  if (percent >= 15) return "w-[15%]";
  if (percent >= 10) return "w-[10%]";
  if (percent >= 5) return "w-[5%]";
  return "w-[2%]";
}

interface PositionCardProps {
  position: FluxaPosition;
}

export function PositionCard({ position }: PositionCardProps) {
  const statusInfo = statusLabel(position.status);
  const coveragePercent = Math.round(position.rangeCoverage * 100);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/95 p-5 shadow-[0_22px_50px_rgba(8,16,36,0.22)]">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
            {position.pool}
          </h3>
          <p className="text-sm text-[color:var(--text-muted)]">
            {position.pair}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
        >
          <Droplet className="size-3" aria-hidden="true" />
          {statusInfo.label}
        </span>
      </header>

      <dl className="grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
            Liquidity
          </dt>
          <dd className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">
            ${position.liquidityUsd.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
            24h Fees
          </dt>
          <dd className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">
            ${position.fees24hUsd.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
            APR
          </dt>
          <dd className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">
            {position.apr.toFixed(1)}%
          </dd>
        </div>
      </dl>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)]/60 p-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
            Range coverage
            <span>{coveragePercent}%</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-[color:var(--surface-card)]">
            <div
              className={`h-2 rounded-full bg-[color:var(--brand)] transition-all ${coverageWidthClass(coveragePercent)}`}
            />
          </div>
          <p className="mt-3 text-xs text-[color:var(--text-muted)]">
            Lower {position.priceRange.lower.toLocaleString()} → Upper{" "}
            {position.priceRange.upper.toLocaleString()} · Current{" "}
            {position.priceRange.current.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)]/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
            <LineChart
              className="size-4 text-[color:var(--brand)]"
              aria-hidden="true"
            />
            AI insight
          </div>
          <p className="mt-3 text-sm text-[color:var(--text-muted)]">
            {position.aiSummary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[color:var(--text-subtle)]">
            <span className="rounded-full border border-[color:var(--border-soft)] px-3 py-1">
              Fluxa share · {position.protocolShare}%
            </span>
            <span className="rounded-full border border-[color:var(--border-soft)] px-3 py-1">
              Unclaimed fees ${position.unclaimedFeesUsd.toLocaleString()}
            </span>
            <span className="rounded-full border border-[color:var(--border-soft)] px-3 py-1">
              In-range {position.timeInRangeHours}h
            </span>
          </div>
        </div>
      </div>

      <footer className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2"
        >
          {position.aiAction === "adjust"
            ? "Review reposition"
            : position.aiAction === "harvest"
              ? "Harvest fees"
              : "View details"}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--brand-soft)] hover:text-[color:var(--brand)]"
        >
          Export position
        </button>
      </footer>
    </article>
  );
}
