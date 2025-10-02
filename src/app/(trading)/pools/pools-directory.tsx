"use client";

import { AlertTriangle, BookOpenCheck, Layers, RefreshCcw } from "lucide-react";

import { PoolCard } from "@/components/trading/pool-card";
import { useFluxaPools } from "@/lib/hooks/use-fluxa-pools";

export function PoolsDirectory() {
  const { data, isPending, isError, error, refetch, isFetching } =
    useFluxaPools();

  const pools = data ?? [];
  const showSkeleton = isPending && pools.length === 0;

  const handleRetry = () => {
    void refetch();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
            Fluxa pools directory
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--text-subtle)]">
            Each pool ships with decoded transactions, AI guardrails, and
            telemetry promised in Phase 1. Fluxa stays protocol-first; Phase 1.5
            overlays read-only Orca/Raydium visibility to help you plan
            migrations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[color:var(--text-subtle)]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] px-3 py-1 font-semibold">
            <Layers
              className="size-4 text-[color:var(--brand)]"
              aria-hidden="true"
            />
            Phase 1 focus
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] px-3 py-1 font-semibold">
            <BookOpenCheck
              className="size-4 text-[color:var(--brand)]"
              aria-hidden="true"
            />
            Audit-ready reporting
          </span>
        </div>
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
                Pool directory failed to refresh. Showing the last cached view.
              </p>
              {error instanceof Error ? (
                <p className="text-xs opacity-80">{error.message}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isFetching}
            className="inline-flex w-fit items-center gap-2 self-start rounded-lg border border-[color:var(--border-soft)] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[color:var(--brand)] transition hover:border-[color:var(--brand)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[color:var(--surface-card)]"
          >
            <RefreshCcw className="size-3.5" aria-hidden="true" />
            Retry sync
          </button>
        </div>
      )}

      <section aria-label="Fluxa pools" className="grid gap-6 md:grid-cols-2">
        {showSkeleton ? (
          <PoolsSkeleton />
        ) : pools.length > 0 ? (
          pools.map((pool) => <PoolCard key={pool.id} pool={pool} />)
        ) : (
          <PoolsEmptyState />
        )}
      </section>

      <section className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-6">
        <h2 className="text-lg font-semibold text-[color:var(--foreground)]">
          Roadmap callout · Phase 1.5 external lens
        </h2>
        <p className="mt-2 text-sm text-[color:var(--text-muted)]">
          Right after Fluxa mainnet launch, you&apos;ll see read-only Orca and
          Raydium positions inside this directory. Migration recipes and AI
          subscription upsells follow once Fluxa liquidity deepens, keeping the
          protocol narrative intact while capturing demand early.
        </p>
      </section>
    </div>
  );
}

function PoolsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-56 animate-pulse rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]"
        />
      ))}
    </>
  );
}

function PoolsEmptyState() {
  return (
    <div className="md:col-span-2">
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/80 px-6 py-16 text-center text-sm text-[color:var(--text-muted)]">
        <p className="max-w-lg text-base font-semibold text-[color:var(--foreground)]">
          Fluxa pools are provisioning now. As vaults open, you&apos;ll see
          depth, spreads, and agent coverage populate automatically.
        </p>
        <p className="text-xs text-[color:var(--text-subtle)]">
          External protocol visibility lands in Phase 1.5—no signatures
          required.
        </p>
      </div>
    </div>
  );
}
