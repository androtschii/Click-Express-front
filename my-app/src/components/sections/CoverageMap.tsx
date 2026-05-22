import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useInView } from "../../hooks/useInView";

interface CoverageMapProps {
  theme?: "dark" | "light";
}

// [abbr, row, col] — tile grid, 12 cols × 7 rows
const TILES: [string, number, number][] = [
  ["WA", 1, 0], ["OR", 2, 0], ["CA", 3, 0],
  ["ID", 2, 1], ["NV", 3, 1], ["AZ", 4, 1],
  ["MT", 1, 2], ["WY", 2, 2], ["UT", 3, 2], ["NM", 4, 2],
  ["ND", 1, 3], ["SD", 2, 3], ["CO", 3, 3], ["KS", 4, 3], ["OK", 5, 3], ["TX", 6, 3],
  ["MN", 1, 4], ["IA", 2, 4], ["NE", 3, 4], ["AR", 4, 4], ["LA", 5, 4],
  ["WI", 2, 5], ["MO", 3, 5], ["KY", 4, 5], ["MS", 5, 5],
  ["MI", 1, 6], ["IL", 3, 6], ["TN", 4, 6], ["AL", 5, 6], ["GA", 6, 6],
  ["IN", 3, 7], ["WV", 4, 7], ["NC", 5, 7], ["FL", 6, 7],
  ["OH", 3, 8], ["VA", 4, 8], ["SC", 5, 8],
  ["PA", 2, 8], ["NY", 1, 8],
  ["VT", 0, 9], ["MA", 1, 9], ["CT", 2, 9], ["NJ", 3, 9], ["MD", 4, 9],
  ["NH", 0, 10], ["RI", 1, 10], ["DE", 3, 10],
  ["ME", 0, 11],
];

const COLS = 12;
const ROWS = 7;
const TW = 52;
const TH = 36;
const GAP = 5;
const MAP_W = COLS * (TW + GAP) - GAP;
const MAP_H = ROWS * (TH + GAP) - GAP;

export const CoverageMap: React.FC<CoverageMapProps> = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const [hovered, setHovered] = useState<string | null>(null);
  const { ref, inView } = useInView<HTMLElement>(0.12);

  const bg = isDark ? "#080808" : "#f5f5f5";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
  const tileFill = isDark ? "rgba(204,0,0,0.12)" : "rgba(204,0,0,0.08)";
  const tileStroke = isDark ? "rgba(204,0,0,0.3)" : "rgba(204,0,0,0.25)";
  const tileTxt = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)";

  const STATS = [
    { num: "48", label: lang === "ru" ? "штатов" : "States" },
    { num: "500+", label: lang === "ru" ? "грузов" : "Loads" },
    { num: "2M+", label: lang === "ru" ? "миль" : "Miles" },
    { num: "24/7", label: lang === "ru" ? "диспетчер" : "Dispatch" },
  ];

  return (
    <section ref={ref} style={{ background: bg, padding: "72px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          marginBottom: 44,
        }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 20, height: 2, background: "#CC0000", display: "inline-block" }} />
            {lang === "ru" ? "Зона покрытия" : "Service Coverage"}
          </div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,46px)", color: textColor, textTransform: "uppercase", lineHeight: 1, marginBottom: 12 }}>
            {lang === "ru" ? "ПОКРЫВАЕМ " : "COVERING "}<span style={{ color: "#CC0000" }}>{lang === "ru" ? "ВСЕ 48 ШТАТОВ" : "ALL 48 STATES"}</span>
          </h2>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: subColor, lineHeight: 1.7, maxWidth: 520, margin: 0 }}>
            {lang === "ru"
              ? "От Западного до Восточного побережья — наши диспетчеры находят грузы по всей континентальной части США."
              : "Coast to coast — our dispatchers source loads across every continental US state, any route, any equipment."}
          </p>
        </div>

        <div style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.8s ease 0.25s",
          overflowX: "auto",
          paddingBottom: 8,
        }}>
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            style={{ width: "100%", maxWidth: MAP_W, minWidth: 360, display: "block", margin: "0 auto" }}
          >
            {TILES.map(([abbr, row, col], idx) => {
              const x = col * (TW + GAP);
              const y = row * (TH + GAP);
              const isHov = hovered === abbr;
              return (
                <g
                  key={abbr}
                  onMouseEnter={() => setHovered(abbr)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "default" }}
                >
                  <rect
                    x={x} y={y} width={TW} height={TH}
                    rx={5} ry={5}
                    fill={isHov ? "#CC0000" : tileFill}
                    stroke={isHov ? "#CC0000" : tileStroke}
                    strokeWidth={1}
                    opacity={inView ? 1 : 0}
                    style={{
                      transition: `fill 0.15s, stroke 0.15s, opacity 0.4s ${(idx * 12)}ms`,
                    }}
                  />
                  <text
                    x={x + TW / 2}
                    y={y + TH / 2 + 4}
                    textAnchor="middle"
                    fontFamily="'Barlow',sans-serif"
                    fontWeight="700"
                    fontSize={11}
                    letterSpacing={0.8}
                    fill={isHov ? "#fff" : tileTxt}
                    style={{ transition: "fill 0.15s", pointerEvents: "none", userSelect: "none" }}
                  >
                    {abbr}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{
          display: "flex", gap: 48, marginTop: 44, flexWrap: "wrap", justifyContent: "center",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}>
          {STATS.map(({ num, label }, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(32px,4.5vw,48px)", color: "#CC0000", lineHeight: 1 }}>{num}</div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: subColor, letterSpacing: 2, textTransform: "uppercase", marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
