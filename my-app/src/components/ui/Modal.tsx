import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode, KeyboardEvent } from "react";

export type ModalSize = "sm" | "md" | "lg" | "full";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  hideClose?: boolean;
}

const SIZE_WIDTH: Record<ModalSize, string> = {
  sm: "min(400px, 94vw)",
  md: "min(560px, 94vw)",
  lg: "min(760px, 94vw)",
  full: "min(1100px, 97vw)",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  hideClose = false,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<Element | null>(null);

  /* lock body scroll and save current focus */
  useEffect(() => {
    if (!open) return;
    prevFocusRef.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      const first = contentRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    });

    return () => {
      document.body.style.overflow = prev;
      cancelAnimationFrame(frame);
      (prevFocusRef.current as HTMLElement | null)?.focus();
    };
  }, [open]);

  /* escape key */
  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* focus trap */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab" || !contentRef.current) return;
      const nodes = Array.from(contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={closeOnOverlay ? onClose : undefined}
          aria-modal="true"
          role="dialog"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: "var(--z-modal)" as unknown as number,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 16px",
          }}
        >
          <motion.div
            key="modal-content"
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            style={{
              width: SIZE_WIDTH[size],
              maxHeight: "min(88vh, 900px)",
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-lg), 0 0 0 1px rgba(255,255,255,0.04)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* header */}
            {(title || !hideClose) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px 16px",
                  borderBottom: title ? "1px solid var(--color-border)" : undefined,
                  flexShrink: 0,
                }}
              >
                {title ? (
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "var(--text-xl)",
                      color: "var(--color-text)",
                      margin: 0,
                      lineHeight: "var(--leading-tight)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {title}
                  </h2>
                ) : (
                  <span />
                )}
                {!hideClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 34,
                      height: 34,
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                      background: "transparent",
                      color: "var(--color-text-tertiary)",
                      cursor: "pointer",
                      transition: `color var(--duration-fast) var(--ease-out),
                                   border-color var(--duration-fast) var(--ease-out),
                                   background var(--duration-fast) var(--ease-out)`,
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "var(--color-text)";
                      e.currentTarget.style.borderColor = "var(--color-border-strong)";
                      e.currentTarget.style.background = "var(--color-bg-elevated)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "var(--color-text-tertiary)";
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            )}

            {/* body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
                overscrollBehavior: "contain",
              }}
            >
              {children}
            </div>

            {/* footer */}
            {footer && (
              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid var(--color-border)",
                  flexShrink: 0,
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* convenience hook */
export function useModal(initial = false) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    toggle: () => setOpen((v: boolean) => !v),
  };
}
