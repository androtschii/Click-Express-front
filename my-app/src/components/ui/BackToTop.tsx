import React, { useEffect, useState } from "react";

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "fixed",
        bottom: 90,
        right: 24,
        width: 46,
        height: 46,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: hov ? "#aa0000" : "#CC0000",
        boxShadow: hov
          ? "0 6px 24px rgba(204,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)"
          : "0 4px 16px rgba(204,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1200,
        opacity: visible ? 1 : 0,
        transform: visible
          ? hov ? "translateY(-3px) scale(1.08)" : "translateY(0) scale(1)"
          : "translateY(16px) scale(0.85)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s ease, transform 0.25s ease, background 0.15s, box-shadow 0.15s",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};
