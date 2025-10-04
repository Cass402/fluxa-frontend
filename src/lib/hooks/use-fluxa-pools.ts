"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchFluxaPools, type FluxaPool } from "@/lib/data/fluxa";

const poolsOptions = queryOptions({
  queryKey: ["fluxa", "pools"],
  queryFn: async (): Promise<FluxaPool[]> => fetchFluxaPools(),
  staleTime: 300_000,
});

export function useFluxaPools() {
  return useQuery(poolsOptions);
}
