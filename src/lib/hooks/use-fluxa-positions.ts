"use client";

import { useMemo } from "react";
import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  fetchGuardrailInsights,
  fetchMockFluxaPositions,
  fetchTrustMetrics,
  type FluxaPosition,
  type GuardrailInsight,
  type TrustMetric,
} from "@/lib/data/fluxa";

const positionsOptions = queryOptions({
  queryKey: ["fluxa", "positions"],
  queryFn: async (): Promise<FluxaPosition[]> => fetchMockFluxaPositions(),
  staleTime: 10_000,
});

const guardrailOptions = queryOptions({
  queryKey: ["fluxa", "guardrails"],
  queryFn: async (): Promise<GuardrailInsight[]> => fetchGuardrailInsights(),
  staleTime: 30_000,
});

const trustMetricsOptions = queryOptions({
  queryKey: ["fluxa", "trust-metrics"],
  queryFn: async (): Promise<TrustMetric[]> => fetchTrustMetrics(),
  staleTime: 30_000,
});

export function useFluxaPositions() {
  return useQuery(positionsOptions);
}

export function useFluxaGuardrailInsights() {
  return useQuery(guardrailOptions);
}

export function useFluxaTrustMetrics() {
  return useQuery(trustMetricsOptions);
}

interface SummaryMetric {
  label: string;
  value: string;
  helper: string;
}

export function useFluxaPositionsOverview() {
  const positionsQuery = useFluxaPositions();
  const guardrailQuery = useFluxaGuardrailInsights();
  const trustMetricsQuery = useFluxaTrustMetrics();

  const summaryMetrics: SummaryMetric[] = useMemo(() => {
    const positions = positionsQuery.data ?? [];

    const totals = positions.reduce(
      (acc, position) => {
        acc.liquidity += position.liquidityUsd;
        acc.fees24h += position.fees24hUsd;
        acc.unclaimed += position.unclaimedFeesUsd;
        return acc;
      },
      { liquidity: 0, fees24h: 0, unclaimed: 0 }
    );

    const averageApr =
      positions.length > 0
        ? positions.reduce((sum, position) => sum + position.apr, 0) /
          positions.length
        : 0;

    return [
      {
        label: "Total liquidity",
        value: `$${totals.liquidity.toLocaleString()}`,
        helper: "Fluxa pools deployed under your treasury mandates",
      },
      {
        label: "Fees last 24h",
        value: `$${totals.fees24h.toLocaleString()}`,
        helper: "Realized yield, net of protocol skim",
      },
      {
        label: "Unclaimed fees",
        value: `$${totals.unclaimed.toLocaleString()}`,
        helper: "AI schedules harvest once targets are crossed",
      },
      {
        label: "Average APR",
        value: `${averageApr.toFixed(1)}%`,
        helper: "Weighted across active Fluxa pools",
      },
    ];
  }, [positionsQuery.data]);

  return {
    positionsQuery,
    guardrailQuery,
    trustMetricsQuery,
    summaryMetrics,
  };
}
