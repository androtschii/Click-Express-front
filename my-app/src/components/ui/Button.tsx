import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  className?: string;
  "aria-label"?: string;
  form?: string;
}

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: { padding: "6px 14px", fontSize: "var(--text-xs)", gap: 6, borderRadius: "var(--radius-sm)", height: 32 },
  md: { padding: "9px 20px", fontSize: "var(--text-sm)", gap: 8, borderRadius: "var(--radius-md)", height: 40 },
  lg: { padding: "12px 28px", fontSize: "var(--text-base)", gap: 10, borderRadius: "var(--radius-md)", height: 48 },
};

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--color-brand)",
    color: "#fff",
    border: "1px solid transparent",
  },
  secondary: {
    background: "var(--color-bg-elevated)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border-strong)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-text-secondary)",
    border: "1px solid transparent",
  },
  danger: {
    background: "var(--color-error)",
    color: "#fff",
    border: "1px solid transparent",
  },
};

const VARIANT_HOVER: Record<ButtonVariant, CSSProperties> = {
  primary: { background: "var(--color-brand-hover)", boxShadow: "var(--shadow-brand)" },
  secondary: { background: "var(--color-bg-hover)", borderColor: "var(--color-brand-border)" },
  ghost: { background: "var(--color-bg-hover)", color: "var(--color-text)" },
  danger: { opacity: 0.88, boxShadow: "0 4px 16px rgba(239,68,68,0.35)" },
};

function Spinner({ size }: { size: ButtonSize }) {
  const dim = size === "sm" ? 12 : size === "md" ? 14 : 16;
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "btn-spin 0.7s linear infinite", flexShrink: 0 }}
    >
      <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      style,
      onClick,
      type = "button",
      className,
      "aria-label": ariaLabel,
      form,
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const base: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      letterSpacing: "0.02em",
      lineHeight: 1,
      cursor: isDisabled ? "not-allowed" : "pointer",
      outline: "none",
      userSelect: "none",
      whiteSpace: "nowrap",
      transition: `background var(--duration-fast) var(--ease-out),
                   border-color var(--duration-fast) var(--ease-out),
                   box-shadow var(--duration-fast) var(--ease-out),
                   opacity var(--duration-fast) var(--ease-out)`,
      opacity: isDisabled ? 0.45 : 1,
      width: fullWidth ? "100%" : undefined,
      ...SIZE_STYLES[size],
      ...VARIANT_STYLES[variant],
      ...style,
    };

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        type={type}
        onClick={onClick}
        className={className}
        aria-label={ariaLabel}
        form={form}
        style={base}
        whileHover={
          !isDisabled
            ? { ...VARIANT_HOVER[variant], transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } }
            : undefined
        }
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        transition={{ duration: 0.15 }}
      >
        {loading ? (
          <Spinner size={size} />
        ) : (
          leftIcon && <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{leftIcon}</span>
        )}
        {children && <span style={{ lineHeight: 1 }}>{children}</span>}
        {!loading && rightIcon && (
          <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
