import React from 'react';
import logoSrc from '../../assets/logo.jpg';

interface CELogoProps {
  size?: number;
  theme?: "dark" | "light";
}

export const CELogo: React.FC<CELogoProps> = ({ size = 48, theme = "dark" }) => {
  const bg = theme === "dark"
    ? "linear-gradient(135deg, #1a1a1a, #2a2a2a)"
    : "#ffffff";
  const boxShadow = theme === "dark"
    ? "0 0 0 2px rgba(204,0,0,0.4)"
    : "0 0 0 2px rgba(204,0,0,0.2)";
  return (
    <img
      src={logoSrc}
      alt="Click Express Inc"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        borderRadius: "50%",
        background: bg,
        boxShadow,
        display: "block",
        padding: size > 60 ? 6 : 3,
        transition: "background 0.3s, box-shadow 0.3s",
      }}
    />
  );
};
