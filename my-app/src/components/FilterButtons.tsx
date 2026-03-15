import React, { useState } from "react";

const FILTERS = ["All Loads", "Full Load", "Partial", "Military Load"];

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
          : `1px solid ${hov ? "#CC0000" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.15)"}`,
        background: active
          ? "#CC0000"
          : hov
          ? "rgba(204,0,0,0.1)"
          : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
        color: active
          ? "#fff"
          : hov
          ? isDark ? "#fff" : "#CC0000"
          : isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        fontFamily: "'Barlow',sans-serif",
        fontWeight: 700,
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
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {FILTERS.map(f => (
        <FilterBtn key={f} label={f} active={active === f} onClick={() => onChange(f)} theme={theme} />
      ))}
    </div>
  );
};