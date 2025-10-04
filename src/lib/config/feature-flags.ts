/**
 * Feature flag helpers centralizing environment-based toggles.
 *
 * NEXT_PUBLIC_USE_MOCKS (default: "true") determines whether client flows
 * should rely on the mock data layer in {@link ../data/fluxa}.
 *
 * When the flag is disabled, callers are expected to replace mock fetchers
 * with live implementations. Until those implementations exist we surface a
 * descriptive error so the integration work cannot be overlooked.
 */
export const featureFlags = {
  /**
   * Use mock data fetchers instead of live Solana/Helius integrations.
   * Defaults to true so preview builds remain fully interactive.
   */
  useMockData:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_USE_MOCKS !== "false"
      : true,
} as const;

/** Indicates whether the application should read from the mock data layer. */
export function isMockDataEnabled(): boolean {
  return featureFlags.useMockData;
}

/**
 * Throws a descriptive error if a mock-powered surface is executed while the
 * global mock flag is disabled. This ensures we wire real data before turning
 * the flag off in production environments.
 */
export function ensureMockDataEnabled(featureName: string): void {
  if (isMockDataEnabled()) {
    return;
  }

  throw new Error(
    `[Fluxa] ${featureName} still relies on mock data. Re-enable mocks via NEXT_PUBLIC_USE_MOCKS or replace the mock fetcher with a live implementation.`
  );
}
