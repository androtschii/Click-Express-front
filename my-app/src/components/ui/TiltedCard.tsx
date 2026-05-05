import React, { useRef, useState } from "react";

interface TiltedCardProps {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  glare?: boolean;
  glareOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const isTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  maxTilt = 8,
  scale = 1.02,
  perspective = 1000,
  glare = true,
  glareOpacity = 0.18,
  className = "",
  style,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("");
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice()) return;
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * maxTilt;
    const rotX = -((y - cy) / cy) * maxTilt;
    setTransform(`perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale},${scale},${scale})`);
    if (glare) {
      setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: glareOpacity });
    }
  };

  const handleLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`);
    setGlarePos(p => ({ ...p, opacity: 0 }));
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        position: "relative",
        transform,
        transformStyle: "preserve-3d",
        transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
      {glare && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}) 0%, transparent 60%)`,
            transition: "opacity 0.2s ease",
            mixBlendMode: "soft-light",
            borderRadius: "inherit",
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
};

export default TiltedCard;
