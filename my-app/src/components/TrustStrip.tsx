import React from "react";

interface TrustStripProps {
  theme?: 'dark' | 'light';
}

export const TrustStrip: React.FC<TrustStripProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        background: isDark ? "#0a0a0a" : "#f0f0f0",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
        padding: "20px clamp(20px,5vw,64px)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 0",
      }}
    >
      {[
        ["🏴", "DOT & FMCSA Certified"],
        ["🛡️", "Fully Insured"],
        ["📡", "GPS Tracked"],
        ["⚡", "24/7 Dispatch"],
        ["🇺🇸", "48 States"],
        ["🏗️", "Oversized Loads OK"],
      ].map(([icon, label], i) => (
        <div
          key={label as string}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 26px",
            borderRight: i < 5 ? (isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.1)") : "none",
          }}
        >
          <span style={{ fontSize: 15 }}>{icon}</span>
          <span
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 700,
              fontSize: 11,
              color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

