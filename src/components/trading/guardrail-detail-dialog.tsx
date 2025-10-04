"use client";

import { useMemo, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import type { GuardrailInsight } from "@/lib/data/fluxa";
import { useFluxaPositionEvents } from "@/lib/hooks/use-fluxa-market";

type GuardrailDetailDialogProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  insight: GuardrailInsight | null;
};

const urgencyTone = {
  now: {
    label: "Act now",
    badge: "bg-red-500/15 text-red-600 dark:text-red-200",
    icon: <AlertTriangle className="size-4" aria-hidden="true" />,
  },
  soon: {
    label: "Plan adjustment",
    badge: "bg-[color:var(--brand-soft)] text-[color:var(--brand)]",
    icon: <Clock className="size-4" aria-hidden="true" />,
  },
  monitor: {
    label: "Monitor",
    badge: "bg-[color:var(--surface-muted)] text-[color:var(--text-subtle)]",
    icon: <ShieldCheck className="size-4" aria-hidden="true" />,
  },
} as const satisfies Record<
  GuardrailInsight["urgency"],
  { label: string; badge: string; icon: ReactNode }
>;

export function GuardrailDetailDialog({
  open,
  onOpenChange,
  insight,
}: GuardrailDetailDialogProps) {
  const positionId = insight?.positionId ?? "";
  const shouldFetch = open && Boolean(positionId);
  const eventsQuery = useFluxaPositionEvents(positionId, shouldFetch);

  const timeline = useMemo(() => {
    if (!eventsQuery.data || eventsQuery.data.length === 0) {
      return [];
    }

    return eventsQuery.data.map((event) => {
      const timestamp = new Date(event.timestamp);
      return {
        ...event,
        relativeTime: formatDistanceToNow(timestamp, { addSuffix: true }),
      };
    });
  }, [eventsQuery.data]);

  const tone = insight ? urgencyTone[insight.urgency] : null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-0 top-[10%] z-50 mx-auto w-full max-w-2xl rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6 shadow-[0_28px_80px_rgba(10,19,40,0.28)] focus-visible:outline-none">
          <header className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Dialog.Title className="text-xl font-semibold text-[color:var(--foreground)]">
                {insight?.title ?? "Guardrail detail"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-[color:var(--text-muted)]">
                {insight?.description ??
                  "Review guardrail context and recent AI actions."}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="rounded-full border border-[color:var(--border-soft)] p-2 text-[color:var(--text-subtle)] transition hover:text-[color:var(--brand)]"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </header>

          {insight ? (
            <div className="mt-6 space-y-6">
              <section className="grid gap-4 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)]/80 p-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tone?.badge ?? "bg-[color:var(--surface-muted)] text-[color:var(--text-subtle)]"}`}
                  >
                    {tone?.icon}
                    {tone?.label}
                  </span>
                  <p className="text-sm text-[color:var(--text-muted)]">
                    {insight.impact}
                  </p>
                </div>
                <div className="space-y-2 rounded-lg border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] p-3 text-xs text-[color:var(--text-subtle)]">
                  <p className="font-semibold text-[color:var(--foreground)]">
                    AI recommendation
                  </p>
                  <p>{insight.cta}</p>
                  <p className="text-[color:var(--text-muted)]">
                    Human override remains available via treasury console.
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
                  Recent telemetry & actions
                </h3>
                <div className="rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]">
                  {eventsQuery.isPending ? (
                    <div className="flex items-center justify-center gap-3 p-6 text-sm text-[color:var(--text-subtle)]">
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Fetching AI event log…
                    </div>
                  ) : eventsQuery.isError ? (
                    <div className="space-y-2 p-6 text-sm text-red-600 dark:text-red-300">
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertTriangle className="size-4" aria-hidden="true" />
                        Unable to load timeline
                      </div>
                      <p className="text-xs opacity-80">
                        {eventsQuery.error instanceof Error
                          ? eventsQuery.error.message
                          : "Unknown error"}
                      </p>
                    </div>
                  ) : timeline.length === 0 ? (
                    <div className="p-6 text-sm text-[color:var(--text-subtle)]">
                      No recent activity logged for this guardrail.
                    </div>
                  ) : (
                    <ol className="divide-y divide-[color:var(--border-subtle)]">
                      {timeline.map((event) => (
                        <li key={event.id} className="p-4">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
                              <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border-soft)] px-2 py-0.5 text-[10px] font-semibold">
                                {event.type}
                              </span>
                              <span>{event.relativeTime}</span>
                            </div>
                            <span className="text-xs text-[color:var(--text-muted)]">
                              AI actor: {event.aiActor}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
                            {event.title}
                          </p>
                          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                            {event.description}
                          </p>
                          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[color:var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[color:var(--brand)]">
                            <ArrowUpRight
                              className="size-3"
                              aria-hidden="true"
                            />
                            {event.impact}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
