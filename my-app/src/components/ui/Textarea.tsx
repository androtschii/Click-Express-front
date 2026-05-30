import React, { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, style, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={id}
          {...props}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "var(--color-bg-elevated)",
            border: `1px solid ${error ? "var(--color-error)" : "var(--color-border-strong)"}`,
            borderRadius: "var(--radius-md)",
            color: "var(--color-text)",
            fontSize: "var(--text-base)",
            fontFamily: "var(--font-sans)",
            outline: "none",
            resize: "vertical",
            minHeight: 100,
            lineHeight: "var(--leading-normal)",
            transition: `border-color var(--duration-normal) var(--ease-out),
                         box-shadow var(--duration-normal) var(--ease-out)`,
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
        />
        {(error || hint) && (
          <p style={{ fontSize: "var(--text-xs)", color: error ? "var(--color-error)" : "var(--color-text-tertiary)", fontFamily: "var(--font-sans)", margin: 0 }}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
