import React from 'react';
import logoSrc from '../assets/logo.jpg';

interface CELogoProps {
  size?: number;
}

export const CELogo: React.FC<CELogoProps> = ({ size = 48 }) => {
  return (
    <img
      src={logoSrc}
      alt="Click Express Inc"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        borderRadius: "50%",
        background: "#fff",
        display: "block",
        padding: size > 60 ? 6 : 3,
      }}
    />
  );
};