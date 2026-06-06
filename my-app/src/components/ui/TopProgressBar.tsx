import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function TopProgressBar() {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");

  useEffect(() => {
    setPhase("running");
    const done = setTimeout(() => setPhase("done"), 350);
    const idle = setTimeout(() => setPhase("idle"), 620);
    return () => { clearTimeout(done); clearTimeout(idle); };
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        zIndex: 10000,
        pointerEvents: "none",
        background: "linear-gradient(90deg, #CC0000, #ff4d4d)",
        boxShadow: "0 0 12px rgba(204,0,0,0.7)",
        width: phase === "running" ? "72%" : "100%",
        opacity: phase === "done" ? 0 : 1,
        transformOrigin: "left",
        transition:
          phase === "running"
            ? "width 0.32s cubic-bezier(0.16,1,0.3,1)"
            : "width 0.15s ease, opacity 0.25s ease 0.05s",
      }}
    />
  );
}
