import React, { useContext } from "react";
import { ThemeContext } from "../../theme";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

export const Ticker: React.FC = () => {
  const context = useContext(ThemeContext) as { theme?: 'dark' | 'light'; toggleTheme?: () => void };
  const theme = context.theme || 'dark';
  const { lang } = useLanguage();
  const items = translations[lang].ticker as readonly string[];
  const text = items.map(i => `${i}  ·  `).join("");
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

