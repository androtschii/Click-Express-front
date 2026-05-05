import React, { useEffect, useRef, useState } from "react";

interface ThreadsProps {
  color?: string;
  count?: number;
  opacity?: number;
  speed?: number;
  thickness?: number;
  className?: string;
}

export const Threads: React.FC<ThreadsProps> = ({
  color = "#eab308",
  count = 14,
  opacity = 0.35,
  speed = 1,
  thickness = 1,
  className = "",
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

  const threads = React.useMemo(() => {
    const out = [] as { y: number; amp: number; freq: number; phase: number; dur: number }[];
    for (let i = 0; i < count; i++) {
      const y = (i + 0.5) * (100 / count);
      const amp = 8 + Math.random() * 16;
      const freq = 1.6 + Math.random() * 1.4;
      const phase = Math.random() * Math.PI * 2;
      const dur = (8 + Math.random() * 8) / Math.max(speed, 0.1);
      out.push({ y, amp, freq, phase, dur });
    }
    return out;
  }, [count, speed]);

  const buildPath = (y: number, amp: number, freq: number, phase: number) => {
    const points: string[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 100;
      const yy = y + Math.sin((i / steps) * Math.PI * freq + phase) * (amp * 0.18);
      points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${yy.toFixed(2)}`);
    }
    return points.join(" ");
  };

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
        @keyframes threads-drift {
          0% { transform: translateX(-4%); opacity: 0.6; }
          50% { transform: translateX(4%); opacity: 1; }
          100% { transform: translateX(-4%); opacity: 0.6; }
        }
      `}</style>
      {visible && (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}
        >
          {threads.map((t, i) => (
            <path
              key={i}
              d={buildPath(t.y, t.amp, t.freq, t.phase)}
              fill="none"
              stroke={color}
              strokeWidth={thickness * 0.12}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                animation: reducedMotion ? "none" : `threads-drift ${t.dur}s ease-in-out infinite`,
                animationDelay: `${(i % 5) * 0.3}s`,
                transformOrigin: "center",
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
};

export default Threads;
