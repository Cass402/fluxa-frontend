import type { RiskBadge as RiskBadgeType } from "@/services/range-stats";

export interface RiskBadgeProps extends RiskBadgeType {
  className?: string;
}

const toneStyles = {
  positive:
    "bg-[color:var(--status-live-bg)] text-[color:var(--status-live-fg)] ring-1 ring-inset ring-[color:var(--status-live-ring)]",
  warning:
    "bg-[color:var(--status-preview-bg)] text-[color:var(--status-preview-fg)] ring-1 ring-inset ring-[color:var(--status-preview-ring)]",
  informational:
    "bg-[color:var(--status-soon-bg)] text-[color:var(--status-soon-fg)] ring-1 ring-inset ring-[color:var(--status-soon-ring)]",
};

/**
 * Renders a risk indicator badge with tone-based styling, aligned with Fluxa's
 * trust-first design principles. Each badge surfaces risk awareness information
 * without overwhelming the user.
 */
export function RiskBadge({
  label,
  tone,
  description,
  className,
}: RiskBadgeProps) {
  return (
    <div
      className={`inline-flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${toneStyles[tone]} ${className ?? ""}`.trim()}
      title={description}
      role="status"
      aria-label={`${label}: ${description}`}
    >
      <span
        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        aria-hidden="true"
      />
      <span className="flex-1">{label}</span>
    </div>
  );
}
