import type { ReactNode, CSSProperties } from "react";

type BadgeVariant = "default" | "brand" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: CSSProperties;
}

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  default: { background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" },
  brand:   { background: "var(--color-brand-muted)", color: "var(--color-brand)", border: "1px solid var(--color-brand-border)" },
  success: { background: "var(--color-success-bg)", color: "var(--color-success)", border: "1px solid rgba(34,197,94,0.2)" },
  warning: { background: "var(--color-warning-bg)", color: "var(--color-warning)", border: "1px solid rgba(245,158,11,0.2)" },
  error:   { background: "var(--color-error-bg)", color: "var(--color-error)", border: "1px solid rgba(239,68,68,0.2)" },
  info:    { background: "var(--color-info-bg)", color: "var(--color-info)", border: "1px solid rgba(59,130,246,0.2)" },
};

const sizeStyles: Record<BadgeSize, CSSProperties> = {
  sm: { fontSize: "var(--text-xs)", padding: "2px 8px", borderRadius: "var(--radius-full)" },
  md: { fontSize: "var(--text-sm)", padding: "4px 10px", borderRadius: "var(--radius-full)" },
};

export function Badge({ children, variant = "default", size = "md", dot, style }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontWeight: 600,
        fontFamily: "var(--font-sans)",
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "currentColor",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}

const statusMap: Record<string, BadgeVariant> = {
  new: "info",
  active: "success",
  approved: "success",
  completed: "success",
  available: "success",
  pending: "warning",
  "in transit": "warning",
  processing: "warning",
  rejected: "error",
  cancelled: "error",
  deleted: "error",
  inactive: "default",
  unavailable: "default",
};

interface StatusBadgeProps {
  status: string;
  size?: BadgeSize;
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const variant = statusMap[status.toLowerCase()] ?? "default";
  return (
    <Badge variant={variant} size={size} dot>
      {status}
    </Badge>
  );
}
