interface CELogoProps {
  size?: number;
  theme?: "dark" | "light";
}

export const CELogo: React.FC<CELogoProps> = ({ size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Click Express Inc"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width="48" height="48" rx="10" fill="#CC0000" />
      <text
        x="24"
        y="33"
        fontFamily="'Arial Black', 'Barlow', sans-serif"
        fontSize="20"
        fontWeight="900"
        fill="#ffffff"
        textAnchor="middle"
        letterSpacing="-1"
      >
        CE
      </text>
      <rect x="0" y="0" width="48" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
};
