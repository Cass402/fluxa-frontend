"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AlertTriangle, BadgeCheck, RefreshCcw, Wallet } from "lucide-react";

import { AIGuardrailPanel } from "@/components/trading/ai-guardrail-panel";
import { GuardrailDetailDialog } from "@/components/trading/guardrail-detail-dialog";
import { PositionCard } from "@/components/trading/position-card";
import { PositionSummary } from "@/components/trading/position-summary";
import { TrustMetricCard } from "@/components/trading/trust-metric-card";
import { isMockDataEnabled } from "@/lib/config/feature-flags";
import type { GuardrailInsight } from "@/lib/data/fluxa";
import { useFluxaPositionsOverview } from "@/lib/hooks/use-fluxa-positions";

/**
 * Positions dashboard - shows all CLMM positions for connected wallet.
 * Implements progressive disclosure: empty state → first position → advanced features.
 */
export default function PositionsPage() {
  const { connected } = useWallet();
  const [guardrailOpen, setGuardrailOpen] = useState(false);
  const [selectedGuardrail, setSelectedGuardrail] =
    useState<GuardrailInsight | null>(null);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const isMocking = isMockDataEnabled();
  const { positionsQuery, guardrailQuery, trustMetricsQuery, summaryMetrics } =
    useFluxaPositionsOverview();

  const positions = positionsQuery.data ?? [];
  const guardrails = guardrailQuery.data ?? [];
  const trustMetrics = trustMetricsQuery.data ?? [];

  const isPending =
    positionsQuery.isPending ||
    guardrailQuery.isPending ||
    trustMetricsQuery.isPending;
  const hasHydratedData =
    positions.length > 0 || guardrails.length > 0 || trustMetrics.length > 0;
  const showSkeleton = isPending && !hasHydratedData;

  const isError =
    positionsQuery.isError ||
    guardrailQuery.isError ||
    trustMetricsQuery.isError;
  const combinedError =
    positionsQuery.error || guardrailQuery.error || trustMetricsQuery.error;
  const isRefetching =
    positionsQuery.isFetching ||
    guardrailQuery.isFetching ||
    trustMetricsQuery.isFetching;

  const handleRetry = () => {
    void Promise.all([
      positionsQuery.refetch(),
      guardrailQuery.refetch(),
      trustMetricsQuery.refetch(),
    ]);
  };

  const handleGuardrailSelect = (insight: GuardrailInsight) => {
    setSelectedGuardrail(insight);
    setGuardrailOpen(true);
  };

  const toCsvValue = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const handleExport = () => {
    if (positions.length === 0) {
      return;
    }

    try {
      const headers = [
        "Pool",
        "Pair",
        "Liquidity USD",
        "Fees 24h USD",
        "Total Fees USD",
        "APR %",
        "Range Lower",
        "Range Upper",
        "Current Price",
        "Range Coverage %",
        "Status",
        "Protocol Share %",
        "Unclaimed Fees USD",
        "Time In Range Hours",
        "AI Summary",
        "AI Action",
      ];

      const rows = positions.map((position) => {
        const coveragePercent = (position.rangeCoverage * 100).toFixed(1);
        const protocolShare = `${position.protocolShare.toFixed(0)}%`;
        const apr = position.apr.toFixed(2);
        return [
          position.pool,
          position.pair,
          position.liquidityUsd.toFixed(2),
          position.fees24hUsd.toFixed(2),
          position.totalFeesUsd.toFixed(2),
          apr,
          position.priceRange.lower,
          position.priceRange.upper,
          position.priceRange.current,
          coveragePercent,
          position.status,
          protocolShare,
          position.unclaimedFeesUsd.toFixed(2),
          position.timeInRangeHours,
          position.aiSummary,
          position.aiAction ?? "",
        ]
          .map(toCsvValue)
          .join(",");
      });

      const csv = [headers.map(toCsvValue).join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `fluxa-positions-${new Date().toISOString().slice(0, 19)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportFeedback(
        `Exported ${positions.length} position${positions.length === 1 ? "" : "s"} to CSV.`
      );
    } catch (error) {
      console.error("Failed to generate CSV", error);
      setExportFeedback("Unable to generate CSV right now. Please retry.");
    }
  };

  useEffect(() => {
    if (!exportFeedback) {
      return;
    }

    const timeout = window.setTimeout(() => setExportFeedback(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [exportFeedback]);

  if (!connected) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          {/* Icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[color:var(--brand-soft)]">
            <Wallet className="size-8 text-[color:var(--brand)]" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">
              Connect Your Wallet
            </h1>
            <p className="text-sm text-[color:var(--text-subtle)]">
              Access your Fluxa CLMM positions with full telemetry and AI
              guardrails. External protocol visibility arrives right after
              launch.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--text-subtle)]">
              Why Connect?
            </h2>
            <ul className="space-y-2 text-left text-sm text-[color:var(--foreground)]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>Live Fluxa pool telemetry with risk-first reporting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>AI guardrails that explain every recommendation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>Roadmap: read-only Orca/Raydium views post launch</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>We never request transaction signatures</span>
              </li>
            </ul>
          </div>

          {/* Connect Button */}
          <WalletMultiButton className="!h-12 !w-full !rounded-lg !bg-[color:var(--brand)] !text-base !font-semibold !text-white !transition-all hover:!bg-[color:var(--brand-hover)] focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[color:var(--brand)] focus-visible:!ring-offset-2" />

          {/* Security Note */}
          <p className="text-xs text-[color:var(--text-subtle)]">
            Fluxa is read-only. We only fetch public blockchain data—no
            permissions, no signatures, no risk.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
            Fluxa positions desk
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--text-subtle)]">
            Track every Fluxa CLMM deployment with explainable AI guardrails.
            Phase 1.5 adds read-only Orca/Raydium visibility so you can decide
            when to migrate liquidity.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] px-4 py-1.5 text-xs font-semibold text-[color:var(--brand)]">
          <BadgeCheck className="size-4" aria-hidden="true" />
          {isMocking ? "Fluxa preview dataset" : "Fluxa mainnet beta"}
        </span>
        <p className="text-xs text-[color:var(--text-subtle)]">
          {isMocking
            ? "Mock telemetry is active via NEXT_PUBLIC_USE_MOCKS. Disable once live Solana feeds are connected."
            : "Live telemetry connected. Leave NEXT_PUBLIC_USE_MOCKS=false in production."}
        </p>
      </section>

      {isError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 shadow-[0_14px_35px_rgba(10,19,40,0.08)] dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-semibold">
                Telemetry refresh is delayed. Showing the latest cached data.
              </p>
              {combinedError instanceof Error ? (
                <p className="text-xs opacity-80">{combinedError.message}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRefetching}
            className="inline-flex w-fit items-center gap-2 self-start rounded-lg border border-[color:var(--border-soft)] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[color:var(--brand)] transition hover:border-[color:var(--brand)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[color:var(--surface-card)]"
          >
            <RefreshCcw className="size-3.5" aria-hidden="true" />
            Retry sync
          </button>
        </div>
      )}

      {showSkeleton ? (
        <SummarySkeleton />
      ) : (
        <PositionSummary metrics={summaryMetrics} />
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        {showSkeleton ? (
          <GuardrailSkeleton />
        ) : (
          <AIGuardrailPanel
            insights={guardrails}
            onSelect={handleGuardrailSelect}
          />
        )}
        <section aria-label="Trust telemetry" className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
            Reliability telemetry
          </h2>
          {showSkeleton ? (
            <TrustTelemetrySkeleton />
          ) : trustMetrics.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {trustMetrics.map((metric) => (
                <TrustMetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/80 p-4 text-sm text-[color:var(--text-muted)]">
              Trust telemetry will light up once your first Fluxa deployment is
              live.
            </div>
          )}
        </section>
      </div>

      <section aria-label="Active Fluxa positions" className="space-y-4">
        <header className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)]">
              Active positions ({positions.length})
            </h2>
            <p className="text-sm text-[color:var(--text-muted)]">
              All data routed through Helius RPC with live AI agents narrating
              every action. Roadmap: add external protocol visibility in Phase
              1.5.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--brand-soft)] hover:text-[color:var(--brand)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={positions.length === 0 || showSkeleton}
            >
              Export performance CSV
            </button>
            {exportFeedback ? (
              <p
                className="text-xs text-[color:var(--text-subtle)]"
                aria-live="polite"
              >
                {exportFeedback}
              </p>
            ) : null}
          </div>
        </header>

        {showSkeleton ? (
          <PositionsSkeleton />
        ) : positions.length > 0 ? (
          <div className="grid gap-5">
            {positions.map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        ) : (
          <PositionsEmptyState />
        )}
      </section>

      <GuardrailDetailDialog
        open={guardrailOpen}
        onOpenChange={(open) => {
          setGuardrailOpen(open);
          if (!open) {
            setSelectedGuardrail(null);
          }
        }}
        insight={selectedGuardrail}
      />
    </div>
  );
}

function SummarySkeleton() {
  return (
    <section
      aria-label="Portfolio summary loading"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/70 p-4"
        >
          <div className="h-3 w-24 rounded bg-[color:var(--border-soft)]" />
          <div className="mt-6 h-8 w-32 rounded bg-[color:var(--border-soft)]" />
          <div className="mt-4 h-3 w-40 rounded bg-[color:var(--border-subtle)]" />
        </div>
      ))}
    </section>
  );
}

function GuardrailSkeleton() {
  return (
    <section className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="h-4 w-48 animate-pulse rounded bg-[color:var(--border-soft)]" />
          <div className="h-3 w-64 animate-pulse rounded bg-[color:var(--border-subtle)]" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex h-full animate-pulse flex-col justify-between rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-4"
            >
              <div className="h-3 w-24 rounded bg-[color:var(--border-subtle)]" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-36 rounded bg-[color:var(--border-soft)]" />
                <div className="h-3 w-40 rounded bg-[color:var(--border-subtle)]" />
              </div>
              <div className="mt-4 h-8 w-28 rounded bg-[color:var(--border-soft)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustTelemetrySkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]"
        />
      ))}
    </div>
  );
}

function PositionsSkeleton() {
  return (
    <div className="grid gap-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6"
        >
          <div className="h-4 w-48 rounded bg-[color:var(--border-soft)]" />
          <div className="mt-4 h-3 w-56 rounded bg-[color:var(--border-subtle)]" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="h-16 rounded bg-[color:var(--border-subtle)]" />
            <div className="h-16 rounded bg-[color:var(--border-subtle)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PositionsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/80 px-6 py-16 text-center text-sm text-[color:var(--text-muted)]">
      <p className="max-w-md text-base font-semibold text-[color:var(--foreground)]">
        No Fluxa positions yet. Deploy your first strategy to activate AI
        guardrails and trust telemetry.
      </p>
      <div className="space-y-2 text-xs text-[color:var(--text-subtle)]">
        <p>We&apos;ll surface Orca/Raydium visibility right after launch.</p>
        <p>Fluxa stays read-only—no signatures, no permissions.</p>
      </div>
      <Link
        href="/pools"
        className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
      >
        Explore Fluxa pools
      </Link>
    </div>
  );
}
