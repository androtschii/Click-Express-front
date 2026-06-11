import React, { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, style, ...props }, ref) => {
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
          <select
            ref={ref}
            id={id}
            {...props}
            style={{
              width: "100%",
              padding: "10px 36px 10px 14px",
              background: "var(--color-bg-elevated)",
              border: `1px solid ${error ? "var(--color-error)" : "var(--color-border-strong)"}`,
              borderRadius: "var(--radius-md)",
              color: props.value === "" || props.value === undefined ? "var(--color-text-tertiary)" : "var(--color-text)",
              fontSize: "var(--text-base)",
              fontFamily: "var(--font-sans)",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
              transition: `border-color var(--duration-normal) var(--ease-out)`,
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = error ? "var(--color-error)" : "var(--color-brand)";
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-brand-muted)";
              props.onFocus?.(e);
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = error ? "var(--color-error)" : "var(--color-border-strong)";
              e.currentTarget.style.boxShadow = "none";
              props.onBlur?.(e);
            }}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--color-text-tertiary)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        {(error || hint) && (
          <p style={{ fontSize: "var(--text-xs)", color: error ? "var(--color-error)" : "var(--color-text-tertiary)", fontFamily: "var(--font-sans)", margin: 0 }}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
