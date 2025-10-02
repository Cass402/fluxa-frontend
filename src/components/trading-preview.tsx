"use client";

import { Loader2 } from "lucide-react";

import { LightweightSparkline } from "@/components/lightweight-sparkline";
import { RiskBadge } from "@/components/risk-badge";
import { StatusPill } from "@/components/status-pill";
import { useRangeStatsQuery } from "@/hooks/use-range-stats";

/**
 * Trading Desk Preview section that demonstrates Fluxa's trust-first approach
 * to liquidity management. Shows live position metrics, risk badges, and price
 * history via sparkline visualization.
 *
 * Aligns with PRD behavioral principles:
 * - Risk-first design: badges surface guardrails, slippage, and status
 * - Progressive disclosure: complexity revealed through clear indicators
 * - Institutional clarity: exact metrics without cognitive overload
 */
export function TradingPreview() {
  const { data, isLoading, isError, refetch } = useRangeStatsQuery();

  if (isLoading) {
    return (
      <section
        id="trading-preview"
        className="flex flex-col gap-6 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-8 shadow-[0_35px_70px_rgba(12,18,36,0.28)]"
        aria-busy="true"
        aria-label="Loading trading desk preview"
      >
        <div className="flex items-center justify-center gap-3 py-12">
          <Loader2
            className="size-5 animate-spin text-[color:var(--brand)]"
            aria-hidden="true"
          />
          <span className="text-sm text-[color:var(--text-muted)]">
            Fetching latest market data...
          </span>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section
        id="trading-preview"
        className="flex flex-col gap-6 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-8 shadow-[0_35px_70px_rgba(12,18,36,0.28)]"
        role="alert"
        aria-label="Error loading trading desk preview"
      >
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
            Unable to load trading data
          </h3>
          <p className="max-w-md text-sm text-[color:var(--text-muted)]">
            Network or API temporarily unavailable. Please try again in a
            moment.
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/70 px-5 py-2 text-sm font-semibold text-[color:var(--brand)] transition duration-200 hover:border-[color:var(--brand)]"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="trading-preview"
      className="flex flex-col gap-8 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-8 shadow-[0_35px_70px_rgba(12,18,36,0.28)] sm:gap-10"
      aria-labelledby="trading-preview-heading"
    >
      <header className="flex flex-col gap-4">
        <StatusPill stage={data.liveStage} />
        <div className="flex flex-col gap-3">
          <h2
            id="trading-preview-heading"
            className="text-2xl font-semibold text-[color:var(--foreground)] sm:text-3xl"
          >
            Risk-Aware Trading Desk
          </h2>
          <p className="max-w-2xl text-pretty text-sm text-[color:var(--text-muted)] sm:text-base">
            Real-time position metrics with risk guardrails. Live data, preview
            simulations, and roadmap features clearly labeled.
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
              {data.pool}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold tabular-nums text-[color:var(--foreground)] sm:text-5xl">
                ${data.currentPrice.toFixed(2)}
              </span>
              <span className="text-sm text-[color:var(--text-muted)]">
                Current Price
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--text-subtle)]">
                Range Bounds
              </span>
              <span className="text-lg font-semibold tabular-nums text-[color:var(--foreground)]">
                ${data.lowerBound.toFixed(2)} – ${data.upperBound.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--text-subtle)]">
                Concentration
              </span>
              <span className="text-lg font-semibold text-[color:var(--foreground)]">
                {data.concentration}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--text-subtle)]">
                Projected Fees
              </span>
              <span className="text-lg font-semibold text-[color:var(--foreground)]">
                {data.projectedFees}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--text-subtle)]">
                Hedging
              </span>
              <span className="text-lg font-semibold capitalize text-[color:var(--foreground)]">
                {data.hedgingStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
              Risk Indicators
            </span>
            <div className="flex flex-col gap-2.5">
              {data.badges.map((badge, index) => (
                <RiskBadge
                  key={`${badge.label}-${index}`}
                  label={badge.label}
                  tone={badge.tone}
                  description={badge.description}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
              Price History
            </span>
            <span className="text-xs text-[color:var(--text-subtle)]">
              {data.windowLabel}
            </span>
          </div>
          <div
            className="h-[200px] overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-4 sm:h-[240px]"
            aria-label={`Price history sparkline for ${data.pool} over ${data.windowLabel}`}
          >
            <LightweightSparkline
              series={data.sparkline}
              color="var(--brand)"
              height={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
