import type { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  style?: CSSProperties;
}

export function EmptyState({ icon, title, description, action, style }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "56px 32px",
        textAlign: "center",
        gap: "var(--space-4)",
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            marginBottom: "var(--space-2)",
          }}
        >
          {icon}
        </div>
      )}
      <p
        style={{
          fontSize: "var(--text-lg)",
          fontWeight: 700,
          color: "var(--color-text)",
          lineHeight: "var(--leading-tight)",
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
            maxWidth: 320,
            lineHeight: "var(--leading-normal)",
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: "var(--space-2)" }}>{action}</div>}
    </motion.div>
  );
}
