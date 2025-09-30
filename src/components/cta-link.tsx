"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { trackCtaClick } from "@/lib/telemetry";
import { useFeatureFlag } from "@/hooks/use-feature-flag";

interface CtaLinkProps extends ComponentProps<typeof Link> {
  eventId: string;
  label: string;
  location: string;
  metadata?: Record<string, unknown>;
  featureFlag?: string;
  featureFlagDefaultEnabled?: boolean;
}

export function CtaLink({
  eventId,
  label,
  location,
  metadata,
  featureFlag,
  featureFlagDefaultEnabled,
  onClick,
  href,
  ...rest
}: CtaLinkProps) {
  const flagState = useFeatureFlag(featureFlag, {
    defaultEnabled: featureFlagDefaultEnabled ?? true,
  });
  const isEnabled = featureFlag ? flagState.enabled : true;

  if (!isEnabled) {
    return null;
  }

  const handleClick: ComponentProps<typeof Link>["onClick"] = (event) => {
    const telemetryMetadata: Record<string, unknown> = {
      ...metadata,
    };

    if (featureFlag) {
      telemetryMetadata.feature_flag = featureFlag;
      telemetryMetadata.feature_flag_available = flagState.available;
      if (flagState.variant) {
        telemetryMetadata.feature_flag_variant = flagState.variant;
      }
      if (flagState.payload !== undefined) {
        telemetryMetadata.feature_flag_payload = flagState.payload;
      }
    }

    trackCtaClick({
      id: eventId,
      label,
      location,
      href: normalizeHref(href),
      metadata: telemetryMetadata,
    });

    onClick?.(event);
  };

  return (
    <Link {...rest} href={href} onClick={handleClick}>
      {rest.children}
    </Link>
  );
}

function normalizeHref(href: ComponentProps<typeof Link>["href"]): string {
  if (typeof href === "string") {
    return href;
  }

  if (href.pathname) {
    return href.pathname;
  }

  return "unknown";
}
