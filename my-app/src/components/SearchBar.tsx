import React, { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);
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
        placeholder="Search by city or state..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 14px 12px 42px",
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${focused ? "#CC0000" : "rgba(255,255,255,0.12)"}`,
          borderRadius: 4,
          color: "#fff",
          fontSize: 14,
          fontFamily: "'Barlow',sans-serif",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
      />
    </div>
  );
};