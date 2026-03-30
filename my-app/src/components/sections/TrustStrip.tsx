import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface TrustStripProps {
  theme?: 'dark' | 'light';
}

export const TrustStrip: React.FC<TrustStripProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const { lang } = useLanguage();
  const badges = translations[lang].trustStrip as readonly string[];
  const icons = ["🏴", "🛡️", "📡", "⚡", "🇺🇸", "🏗️"];
  return (
    <div
      style={{
        background: isDark ? "#0a0a0a" : "#fff",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.1)",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.1)",
        padding: "20px clamp(20px,5vw,64px)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 0",
      }}
    >
      {icons.map((icon, i) => {
        const label = badges[i];
        return (
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
              fontWeight: 800,
              fontSize: 11,
              color: isDark ? "rgba(255,255,255,0.55)" : "#1a1a1a",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
        );
      })}
    </div>
  );
};

