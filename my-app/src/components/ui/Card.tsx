import type { ReactNode, CSSProperties, MouseEventHandler } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  hoverable?: boolean;
  padding?: string | number;
  style?: CSSProperties;
  className?: string;
}

export function Card({ children, onClick, hoverable = false, padding = "var(--space-6)", style, className }: CardProps) {
  const base: CSSProperties = {
    background: "var(--color-bg-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding,
    cursor: onClick ? "pointer" : undefined,
    ...style,
  };

  if (!hoverable && !onClick) {
    return (
      <div style={base} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      style={base}
      className={className}
      onClick={onClick}
      whileHover={hoverable || onClick ? {
        y: -4,
        borderColor: "var(--color-brand-border)",
        boxShadow: "var(--shadow-brand)",
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
      } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
