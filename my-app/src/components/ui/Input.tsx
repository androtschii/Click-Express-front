import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, style, className, ...props }, ref) => {
    const id = props.id ?? props.name;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
        {label && (
          <label
            htmlFor={id}
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          {leftIcon && (
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-tertiary)",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            {...props}
            style={{
              width: "100%",
              padding: leftIcon ? "10px 14px 10px 38px" : rightIcon ? "10px 38px 10px 14px" : "10px 14px",
              background: "var(--color-bg-elevated)",
              border: `1px solid ${error ? "var(--color-error)" : "var(--color-border-strong)"}`,
              borderRadius: "var(--radius-md)",
              color: "var(--color-text)",
              fontSize: "var(--text-base)",
              fontFamily: "var(--font-sans)",
              outline: "none",
              transition: `border-color var(--duration-normal) var(--ease-out),
                           box-shadow var(--duration-normal) var(--ease-out)`,
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = error ? "var(--color-error)" : "var(--color-brand)";
              e.currentTarget.style.boxShadow = error
                ? "0 0 0 3px rgba(239,68,68,0.15)"
                : "0 0 0 3px var(--color-brand-muted)";
              props.onFocus?.(e);
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = error ? "var(--color-error)" : "var(--color-border-strong)";
              e.currentTarget.style.boxShadow = "none";
              props.onBlur?.(e);
            }}
          />
          {rightIcon && (
            <span
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-tertiary)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {rightIcon}
            </span>
          )}
        </div>
        {(error || hint) && (
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: error ? "var(--color-error)" : "var(--color-text-tertiary)",
              fontFamily: "var(--font-sans)",
              margin: 0,
            }}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
