import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  theme?: 'dark' | 'light';
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, theme = 'dark' }) => {
  const [focused, setFocused] = useState(false);
  const isDark = theme === 'dark';
  const { lang } = useLanguage();
  const placeholder = translations[lang].search.placeholder;

  return (
    <div style={{ position: "relative", flex: "1 1 280px" }}>
      <span
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 15,
          opacity: 0.4,
          pointerEvents: "none",
        }}
      >
        🔍
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 14px 12px 42px",
          background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
          border: `1px solid ${focused ? "#CC0000" : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.2)"}`,
          borderRadius: 4,
          color: isDark ? "#fff" : "#1a1a1a",
          fontSize: 14,
          fontFamily: "'Barlow',sans-serif",
          fontWeight: 600,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused && !isDark ? "0 0 0 3px rgba(204,0,0,0.1)" : "none",
        }}
      />
    </div>
  );
};