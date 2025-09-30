"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";

interface FeatureFlagOptions {
  defaultEnabled?: boolean;
}

interface FeatureFlagState<TPayload = unknown> {
  enabled: boolean;
  variant?: string;
  payload?: TPayload;
  available: boolean;
}

function getFeatureFlagState<TPayload>(
  flagKey: string,
  defaultEnabled: boolean
): FeatureFlagState<TPayload> {
  const isEnabled = Boolean(
    posthog.isFeatureEnabled(flagKey) ?? defaultEnabled
  );
  const variantRaw = posthog.getFeatureFlag?.(flagKey);
  const variant = typeof variantRaw === "string" ? variantRaw : undefined;
  const payload = (posthog.getFeatureFlagPayload?.(flagKey) ?? undefined) as
    | TPayload
    | undefined;

  return {
    enabled: variant ? variant !== "false" : isEnabled,
    variant: variant ?? undefined,
    payload,
    available: true,
  };
}

export function useFeatureFlag<TPayload = unknown>(
  flagKey: string | undefined,
  options: FeatureFlagOptions = {}
): FeatureFlagState<TPayload> {
  const defaultEnabled = options.defaultEnabled ?? true;
  const [state, setState] = useState<FeatureFlagState<TPayload>>({
    enabled: defaultEnabled,
    variant: undefined,
    payload: undefined,
    available: false,
  });

  useEffect(() => {
    if (!flagKey) {
      setState({
        enabled: defaultEnabled,
        variant: undefined,
        payload: undefined,
        available: false,
      });
      return;
    }

    const updateState = () => {
      setState(getFeatureFlagState<TPayload>(flagKey, defaultEnabled));
    };

    // Attempt to synchronously read current flag values.
    updateState();

    if (typeof posthog.onFeatureFlags === "function") {
      const handler = () => updateState();
      posthog.onFeatureFlags(handler);

      return () => {
        const maybeOff = (
          posthog as unknown as {
            offFeatureFlags?: (cb: () => void) => void;
          }
        ).offFeatureFlags;

        if (typeof maybeOff === "function") {
          maybeOff(handler);
        }
      };
    }

    return;
  }, [flagKey, defaultEnabled]);

  return state;
}
