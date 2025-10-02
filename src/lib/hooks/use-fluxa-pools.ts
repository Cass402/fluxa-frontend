"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";

import { getFluxaPools, type FluxaPool } from "@/lib/data/fluxa";

const poolsOptions = queryOptions({
  queryKey: ["fluxa", "pools"],
  queryFn: async (): Promise<FluxaPool[]> => getFluxaPools(),
  staleTime: 300_000,
});

export function useFluxaPools() {
  return useQuery(poolsOptions);
}
