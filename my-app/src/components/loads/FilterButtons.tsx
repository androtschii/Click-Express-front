import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

// Internal filter keys stay in English (used by loadService.ts filterLoads)
const FILTER_KEYS = ["All Loads", "Full Load", "Partial", "Military Load"] as const;

interface FilterBtnProps {
  label: string;
  active: boolean;
  onClick?: () => void;
  theme?: 'dark' | 'light';
}

const FilterBtn: React.FC<FilterBtnProps> = ({ label, active, onClick, theme = 'dark' }) => {
  const [hov, setHov] = useState(false);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 20px",
        borderRadius: 4,
        border: active
          ? "none"
          : `1px solid ${hov ? "#CC0000" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.22)"}`,
        background: active
          ? "#CC0000"
          : hov
          ? "rgba(204,0,0,0.08)"
          : isDark ? "rgba(255,255,255,0.04)" : "#fff",
        color: active
          ? "#fff"
          : hov
          ? "#CC0000"
          : isDark ? "rgba(255,255,255,0.55)" : "#1a1a1a",
        fontFamily: "'Barlow',sans-serif",
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        cursor: "pointer",
        boxShadow: active ? "0 4px 14px rgba(204,0,0,0.4)" : "none",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
};

interface FilterButtonsProps {
  active: string;
  onChange: (label: string) => void;
  theme?: 'dark' | 'light';
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({ active, onChange, theme = 'dark' }) => {
  const { lang } = useLanguage();
  const tf = translations[lang].filters;
  const labels = [tf.allLoads, tf.fullLoad, tf.partial, tf.military];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {FILTER_KEYS.map((key, i) => (
        <FilterBtn key={key} label={labels[i]} active={active === key} onClick={() => onChange(key)} theme={theme} />
      ))}
    </div>
  );
};