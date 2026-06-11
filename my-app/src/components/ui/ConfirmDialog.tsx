import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

let _showConfirm: ((opts: ConfirmOptions) => Promise<boolean>) | null = null;

export function confirm(opts: ConfirmOptions): Promise<boolean> {
  if (!_showConfirm) return Promise.resolve(window.confirm(opts.title));
  return _showConfirm(opts);
}

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);

  const showConfirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setState({ ...opts, resolve });
    });
  }, []);

  _showConfirm = showConfirm;

  const handleClose = (value: boolean) => {
    state?.resolve(value);
    setState(null);
  };

  useEffect(() => {
    if (!state) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose(false);
      if (e.key === "Enter") handleClose(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [state]);

  return (
    <>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            key="confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => handleClose(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "var(--z-modal)",
            }}
          >
            <motion.div
              key="confirm-dialog"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border-strong)",
                borderRadius: "var(--radius-lg)",
                padding: "28px 28px 24px",
                width: "min(380px, 90vw)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <p style={{
                fontSize: "var(--text-md)",
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: state.message ? 8 : 24,
                lineHeight: "var(--leading-tight)",
              }}>
                {state.title}
              </p>
              {state.message && (
                <p style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  marginBottom: 24,
                  lineHeight: "var(--leading-normal)",
                }}>
                  {state.message}
                </p>
              )}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  onClick={() => handleClose(false)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border-strong)",
                    background: "transparent",
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: `all var(--duration-normal) var(--ease-out)`,
                  }}
                >
                  {state.cancelLabel ?? "Cancel"}
                </button>
                <button
                  onClick={() => handleClose(true)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: state.danger ? "var(--color-error)" : "var(--color-brand)",
                    color: "#fff",
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: `opacity var(--duration-normal) var(--ease-out)`,
                  }}
                >
                  {state.confirmLabel ?? "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
