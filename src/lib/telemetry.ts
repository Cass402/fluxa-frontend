"use client";

import posthog from "posthog-js";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

type SpanStatus = "ok" | "error";

interface SpanEndOptions {
  status?: SpanStatus;
  error?: unknown;
}

interface StartSpanOptions {
  attributes?: Record<string, unknown>;
}

interface TrackCtaPayload {
  id: string;
  label: string;
  location: string;
  href: string;
  metadata?: Record<string, unknown>;
}

interface TrackWaitlistPayload {
  emailDomain: string;
  location: string;
  status: SpanStatus;
  error?: string;
  metadata?: Record<string, unknown>;
}

let telemetryInitialized = false;
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_URL =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

function isTelemetryUsable() {
  return typeof window !== "undefined" && Boolean(POSTHOG_KEY);
}

export function initTelemetry() {
  if (telemetryInitialized || typeof window === "undefined") {
    return;
  }

  telemetryInitialized = true;

  if (!POSTHOG_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.info("PostHog key missing: telemetry disabled.");
    }
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_URL,
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
  });

  // Ensure feature flags are fetched early for gating UI.
  posthog.reloadFeatureFlags();

  registerWebVitals();
}

function registerWebVitals() {
  const sendMetric = (metric: {
    name: string;
    value: number;
    rating: "good" | "needs-improvement" | "poor";
    id: string;
  }) => {
    if (!POSTHOG_KEY) {
      return;
    }

    posthog.capture("web_vital", {
      metric: metric.name,
      value: Math.round(metric.value * 1000) / 1000,
      rating: metric.rating,
      metricId: metric.id,
    });
  };

  onCLS(sendMetric);
  onFCP(sendMetric);
  onINP(sendMetric);
  onLCP(sendMetric);
  onTTFB(sendMetric);
}

export function startClientSpan(name: string, options: StartSpanOptions = {}) {
  const spanId = `${name}-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
  const startMark = `${spanId}-start`;

  if (typeof performance !== "undefined") {
    performance.mark(startMark);
  }

  return {
    end(endOptions: SpanEndOptions = {}) {
      if (typeof performance === "undefined") {
        if (POSTHOG_KEY) {
          posthog.capture("otel.span.client", {
            name,
            attributes: options.attributes,
            status: endOptions.status ?? "ok",
            error: serializeError(endOptions.error),
          });
        }
        return;
      }

      const endMark = `${spanId}-end`;
      const measureName = `${spanId}-measure`;

      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      const [measure] = performance.getEntriesByName(measureName);

      if (POSTHOG_KEY) {
        posthog.capture("otel.span.client", {
          name,
          attributes: options.attributes,
          duration: measure?.duration ?? null,
          status: endOptions.status ?? "ok",
          error: serializeError(endOptions.error),
        });
      }

      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
    },
  };
}

export function trackCtaClick(payload: TrackCtaPayload) {
  const span = startClientSpan(`cta:${payload.id}`, {
    attributes: {
      location: payload.location,
      href: payload.href,
      ...payload.metadata,
    },
  });

  if (isTelemetryUsable()) {
    posthog.capture("cta_click", {
      id: payload.id,
      label: payload.label,
      location: payload.location,
      href: payload.href,
      ...payload.metadata,
    });
  }

  span.end();
}

export function trackWaitlistSubmission(payload: TrackWaitlistPayload) {
  if (!isTelemetryUsable()) {
    return;
  }

  posthog.capture("waitlist_submission", {
    email_domain: payload.emailDomain,
    location: payload.location,
    status: payload.status,
    error: payload.error,
    ...payload.metadata,
  });
}

function serializeError(error: unknown) {
  if (!error) {
    return undefined;
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  return { message: JSON.stringify(error) };
}
