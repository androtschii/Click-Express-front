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
  const [hovIdx, setHovIdx] = React.useState<number | null>(null);
  return (
    <div style={{ background: isDark ? "#0a0a0a" : "#f4f0e8", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)"}`, borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)"}`, padding: "0 clamp(20px,5vw,64px)", display: "flex", flexWrap: "wrap", justifyContent: "center", overflow: "hidden" }}>
      {icons.map((icon, i) => {
        const label = badges[i];
        const isHov = hovIdx === i;
        return (
          <div key={label as string} onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 24px", borderRight: i < 5 ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}` : "none", background: isHov ? (isDark ? "rgba(204,0,0,0.06)" : "rgba(204,0,0,0.04)") : "transparent", transition: "background 0.15s", cursor: "default", position: "relative" }}>
            {isHov && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#CC0000" }} />}
            <span style={{ fontSize: 16, filter: isHov ? "drop-shadow(0 0 4px rgba(204,0,0,0.5))" : "none", transition: "filter 0.15s" }}>{icon}</span>
            <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 10, color: isHov ? "#CC0000" : (isDark ? "rgba(255,255,255,0.52)" : "rgba(13,13,13,0.6)"), letterSpacing: 2.5, textTransform: "uppercase", transition: "color 0.15s", whiteSpace: "nowrap" }}>
              {label as string}
            </span>
          </div>
        );
      })}
    </div>
  );
};

