"use client";

/**
 * Market data hooks are backed by mock fetchers until NEXT_PUBLIC_USE_MOCKS
 * is disabled and real Solana/Helius integrations are wired in.
 */

import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  fetchFluxaLiquidityProfile,
  fetchFluxaPositionEvents,
  fetchFluxaPriceHistory,
  fetchFluxaSwapQuote,
  type FluxaLiquidityBand,
  type FluxaPositionEvent,
  type FluxaPricePoint,
  type FluxaSwapQuote,
  type FluxaSwapQuoteRequest,
  type PriceHistoryOptions,
} from "@/lib/data/fluxa";

function priceHistoryOptions(poolId: string, options?: PriceHistoryOptions) {
  return queryOptions({
    queryKey: [
      "fluxa",
      "price-history",
      poolId,
      options?.points ?? null,
      options?.resolutionMinutes ?? null,
    ],
    queryFn: async (): Promise<FluxaPricePoint[]> =>
      fetchFluxaPriceHistory(poolId, options),
    staleTime: 60_000,
  });
}

function liquidityProfileOptions(poolId: string) {
  return queryOptions({
    queryKey: ["fluxa", "liquidity-profile", poolId],
    queryFn: async (): Promise<FluxaLiquidityBand[]> =>
      fetchFluxaLiquidityProfile(poolId),
    staleTime: 120_000,
  });
}

function positionEventsOptions(positionId: string) {
  return queryOptions({
    queryKey: ["fluxa", "position-events", positionId],
    queryFn: async (): Promise<FluxaPositionEvent[]> =>
      fetchFluxaPositionEvents(positionId),
    staleTime: 120_000,
  });
}

function swapQuoteOptions(request: FluxaSwapQuoteRequest) {
  return queryOptions({
    queryKey: [
      "fluxa",
      "swap-quote",
      request.poolId,
      request.side,
      request.inputToken,
      request.outputToken,
      Number(request.inputAmount.toFixed(4)),
      request.slippageToleranceBps,
    ],
    queryFn: async (): Promise<FluxaSwapQuote> => fetchFluxaSwapQuote(request),
    staleTime: 5_000,
  });
}

export function useFluxaPriceHistory(
  poolId: string,
  options?: PriceHistoryOptions
) {
  return useQuery(priceHistoryOptions(poolId, options));
}

export function useFluxaLiquidityProfile(poolId: string) {
  return useQuery(liquidityProfileOptions(poolId));
}

export function useFluxaPositionEvents(positionId: string, enabled = true) {
  return useQuery({
    ...positionEventsOptions(positionId),
    enabled,
  });
}

export function useFluxaSwapQuote(
  request: FluxaSwapQuoteRequest,
  enabled = true
) {
  return useQuery({
    ...swapQuoteOptions(request),
    enabled,
  });
}

export const fluxaMarketQueryOptions = {
  priceHistory: priceHistoryOptions,
  liquidityProfile: liquidityProfileOptions,
  positionEvents: positionEventsOptions,
  swapQuote: swapQuoteOptions,
};
