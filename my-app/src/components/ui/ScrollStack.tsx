import React, { useRef, useEffect, useState, type ReactNode } from "react";

interface ScrollStackProps {
  children: ReactNode;
  topOffset?: number;
  layerOffset?: number;
  scaleStep?: number;
  fadeStep?: number;
  className?: string;
}

export const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  topOffset = 90,
  layerOffset = 14,
  scaleStep = 0.04,
  fadeStep = 0.18,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const items = React.Children.toArray(children);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const cards = el.querySelectorAll<HTMLElement>(".ss-card");
      let active = 0;
      const triggerY = topOffset + 80;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= triggerY) active = i;
      });
      setActiveIdx(active);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [topOffset]);

  return (
    <div ref={containerRef} className={className} style={{ position: "relative" }}>
      {items.map((child, i) => {
        const depth = Math.max(0, activeIdx - i);
        const scale = Math.max(0.82, 1 - depth * scaleStep);
        const opacity = Math.max(0.35, 1 - depth * fadeStep);
        return (
          <div
            key={i}
            className="ss-card"
            style={{
              position: "sticky",
              top: topOffset + i * layerOffset,
              zIndex: i + 1,
              transform: `scale(${scale})`,
              transformOrigin: "center top",
              opacity,
              transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease",
              willChange: "transform, opacity",
              marginBottom: 18,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default ScrollStack;
