import React from 'react';

export const Ticker: React.FC = () => {
  const items = [
    "LOADS DON'T MOVE THEMSELVES",
    "ALWAYS MOVING",
    "RELIABILITY",
    "PRODUCTIVITY",
    "USA-WIDE HEAVY FREIGHT",
    "FROM SCREEN TO THE HIGHWAY",
    "WHERE ROUTES ARE BORN",
    "BEHIND EVERY LOAD — A DISPATCHER",
  ];
  const text = items.map((i) => `${i}  ·  `).join("");

  return (
    <div
      style={{
        background: "#CC0000",
        overflow: "hidden",
        padding: "13px 0",
        borderTop: "2px solid #aa0000",
        borderBottom: "2px solid #aa0000",
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: "ticker 30s linear infinite",
          whiteSpace: "nowrap",
          fontFamily: "'Oswald',sans-serif",
          fontWeight: 700,
          fontSize: 13,
          color: "#fff",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        {text}
        {text}
      </div>
      <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
};

export const TrustStrip: React.FC = () => {
  return (
    <div
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px clamp(20px,5vw,64px)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
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
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 26px",
            borderRight: i < 5 ? "1px solid rgba(255,255,255,0.07)" : "none",
          }}
        >
          <span style={{ fontSize: 15 }}>{icon}</span>
          <span
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 700,
              fontSize: 11,
              color: "rgba(255,255,255,0.45)",
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
