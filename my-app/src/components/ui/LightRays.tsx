import React, { useEffect, useRef, useState } from "react";

interface LightRaysProps {
  color?: string;
  intensity?: number;
  speed?: number;
  origin?: "top" | "top-left" | "top-right" | "center-top";
  className?: string;
  blur?: number;
}

const ORIGIN_X: Record<NonNullable<LightRaysProps["origin"]>, string> = {
  "top": "50%",
  "top-left": "18%",
  "top-right": "82%",
  "center-top": "50%",
};

export const LightRays: React.FC<LightRaysProps> = ({
  color = "#CC0000",
  intensity = 0.45,
  speed = 1,
  origin = "top",
  className = "",
  blur = 60,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const dur = 9 / Math.max(speed, 0.1);
  const ox = ORIGIN_X[origin];

  const beams = [
    { rot: -22, w: 14, delay: 0, op: 1.0 },
    { rot: -10, w: 10, delay: 1.6, op: 0.9 },
    { rot:   2, w: 18, delay: 3.0, op: 0.7 },
    { rot:  14, w: 12, delay: 0.8, op: 0.85 },
    { rot:  26, w: 16, delay: 2.4, op: 0.6 },
  ];

  return (
    <div
      ref={ref}
      className={className}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <style>{`
        @keyframes lr-pulse {
          0%, 100% { opacity: var(--lr-min); transform-origin: ${ox} 0%; transform: rotate(var(--lr-rot)) scaleY(1); }
          50%      { opacity: var(--lr-max); transform-origin: ${ox} 0%; transform: rotate(calc(var(--lr-rot) + 1.5deg)) scaleY(1.04); }
        }
        @keyframes lr-glow {
          0%, 100% { opacity: ${intensity * 0.55}; }
          50%      { opacity: ${intensity * 0.85}; }
        }
      `}</style>

      {/* Soft radial bloom from the origin */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse 60% 80% at ${ox} 0%, ${color}33 0%, ${color}11 30%, transparent 65%)`,
          animation: visible && !reducedMotion ? `lr-glow ${dur * 0.7}s ease-in-out infinite` : "none",
          opacity: intensity * 0.6,
        }}
      />

      {/* Beams */}
      {visible && beams.map((b, i) => {
        const opMin = (intensity * b.op * 0.35).toFixed(3);
        const opMax = (intensity * b.op * 0.85).toFixed(3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "-8%",
              left: ox,
              width: `${b.w}vw`,
              height: "150%",
              marginLeft: `-${b.w / 2}vw`,
              background: `linear-gradient(180deg, ${color} 0%, ${color}66 18%, ${color}22 45%, transparent 78%)`,
              filter: `blur(${blur}px)`,
              mixBlendMode: "screen",
              willChange: "transform, opacity",
              ["--lr-rot" as never]: `${b.rot}deg`,
              ["--lr-min" as never]: opMin,
              ["--lr-max" as never]: opMax,
              transform: `rotate(${b.rot}deg)`,
              opacity: opMin,
              animation: reducedMotion
                ? "none"
                : `lr-pulse ${dur}s ease-in-out ${b.delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
};

export default LightRays;
