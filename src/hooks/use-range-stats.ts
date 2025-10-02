"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import {
  fetchRangeStats,
  type RangeStatsPayload,
} from "@/services/range-stats";

/**
 * Query helper that hydrates the Trading Desk preview with simulated data.
 * Swap the underlying fetcher for the Solana adapter when ready.
 */
export function useRangeStatsQuery(
  options?: Omit<UseQueryOptions<RangeStatsPayload>, "queryKey" | "queryFn">
) {
  return useQuery<RangeStatsPayload>({
    queryKey: ["range-stats"],
    queryFn: fetchRangeStats,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}
