import React, { useId, type ReactNode, type CSSProperties } from "react";

interface ElectricBorderProps {
  children: ReactNode;
  color?: string;
  speed?: number;
  thickness?: number;
  radius?: number;
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = "#CC0000",
  speed = 1,
  thickness = 2,
  radius = 8,
  glow = true,
  className = "",
  style,
}) => {
  const rawId = useId();
  const filterId = `eb-${rawId.replace(/[:]/g, "")}`;
  const dur = 4 / Math.max(speed, 0.1);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        ...style,
      }}
    >
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: -thickness,
          width: `calc(100% + ${thickness * 2}px)`,
          height: `calc(100% + ${thickness * 2}px)`,
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 0,
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.04" numOctaves="2" seed="1" result="noise">
              <animate attributeName="seed" values="1;7;1" dur={`${dur}s`} repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
          </filter>
          <filter id={`${filterId}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {glow && (
          <rect
            x="1.5"
            y="1.5"
            width="calc(100% - 3px)"
            height="calc(100% - 3px)"
            fill="none"
            stroke={color}
            strokeWidth={thickness * 1.6}
            strokeOpacity="0.45"
            rx={radius}
            filter={`url(#${filterId}) url(#${filterId}-glow)`}
          />
        )}
        <rect
          x="1.5"
          y="1.5"
          width="calc(100% - 3px)"
          height="calc(100% - 3px)"
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          rx={radius}
          filter={`url(#${filterId})`}
        />
      </svg>

      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>{children}</div>
    </div>
  );
};

export default ElectricBorder;
