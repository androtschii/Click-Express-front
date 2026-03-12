import React, { useContext } from "react";
import { ThemeContext } from "../theme";

export const Ticker: React.FC = () => {
  const context = useContext(ThemeContext) as { theme?: 'dark' | 'light'; toggleTheme?: () => void };
  const theme = context.theme || 'dark';
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
  const text = items.map(i => `${i}  ·  `).join("");
  return (
    <div
      style={{
        background: theme === 'dark' ? "#CC0000" : "#aa0000",
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
          color: theme === 'dark' ? "#fff" : "#000",
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

