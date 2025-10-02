"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { waitlistSchema, type WaitlistPayload } from "@/lib/schemas/waitlist";
import { startClientSpan, trackWaitlistSubmission } from "@/lib/telemetry";

interface WaitlistResponse {
  success: boolean;
  message?: string;
  alreadyExists?: boolean;
}

async function submitWaitlist(
  payload: WaitlistPayload
): Promise<WaitlistResponse> {
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => undefined)) as
      | { message?: string }
      | undefined;
    throw new Error(errorBody?.message ?? "Failed to join the waitlist.");
  }

  return (await response.json()) as WaitlistResponse;
}

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistPayload>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: submitWaitlist,
  });

  const onSubmit = handleSubmit(async (values) => {
    const span = startClientSpan("waitlist.submit", {
      attributes: {
        location: "landing_closing",
        backend: "supabase",
      },
    });

    setStatus("idle");
    setSuccessMessage(null);
    mutation.reset();

    try {
      const result = await mutation.mutateAsync(values);
      trackWaitlistSubmission({
        emailDomain: values.email.split("@").at(1) ?? "unknown",
        location: "landing_closing",
        status: "ok",
        metadata: {
          backend: "supabase",
          alreadyExists: result.alreadyExists ?? false,
        },
      });
      span.end({ status: "ok" });
      reset();
      setSuccessMessage(
        result.message ?? "You’re on the list. We’ll reach out shortly."
      );
      setStatus(result.success ? "success" : "error");
    } catch (error) {
      trackWaitlistSubmission({
        emailDomain: values.email.split("@").at(1) ?? "unknown",
        location: "landing_closing",
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          backend: "supabase",
        },
      });
      span.end({ status: "error", error });
      setStatus("error");
    }
  });

  const serverError =
    mutation.error instanceof Error ? mutation.error.message : null;

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]"
      aria-label="Join the Fluxa waitlist"
      noValidate
    >
      <div className="flex flex-col gap-2 sm:col-span-1">
        <label className="sr-only" htmlFor="email">
          Work email
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          placeholder="you@example.com"
          className="mt-1 block w-full rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--background)] px-4 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--text-subtle)] focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          required
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email ? (
          <p
            id="email-error"
            className="text-xs text-[color:var(--status-error)]"
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}
        <div aria-live="polite">
          {serverError && !errors.email ? (
            <p
              className="text-xs text-[color:var(--status-error)]"
              role="alert"
            >
              {serverError}
            </p>
          ) : null}
          {status === "success" ? (
            <p
              className="text-xs text-[color:var(--status-success)]"
              role="status"
            >
              {successMessage ??
                "You&apos;re on the list. We&apos;ll reach out shortly."}
            </p>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        className="h-12 rounded-full bg-[color:var(--brand)] px-6 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 focus-visible:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Joining…" : "Join Waitlist"}
      </button>
    </form>
  );
}
