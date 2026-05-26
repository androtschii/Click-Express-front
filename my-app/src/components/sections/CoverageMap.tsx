import React, { useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useLanguage } from "../../context/LanguageContext";
import { useInView } from "../../hooks/useInView";

const GEO_URL = "/us-states.json";

// States where we actively dispatch each equipment type
const EQUIPMENT: Record<string, Set<string>> = {
  "Dry Van": new Set([
    "California","Oregon","Washington","Nevada","Arizona","New Mexico","Utah","Colorado","Idaho","Montana","Wyoming",
    "Texas","Oklahoma","Kansas","Nebraska","Iowa","Missouri","Arkansas","Louisiana","Mississippi","Alabama","Georgia",
    "Florida","South Carolina","North Carolina","Virginia","West Virginia","Kentucky","Tennessee","Indiana","Illinois",
    "Ohio","Michigan","Wisconsin","Minnesota","North Dakota","South Dakota","Pennsylvania","New York","New Jersey",
    "Connecticut","Rhode Island","Massachusetts","Vermont","New Hampshire","Maine","Maryland","Delaware",
  ]),
  "Flatbed": new Set([
    "Texas","Oklahoma","Kansas","Nebraska","Iowa","Missouri","Arkansas","Louisiana","Alabama","Georgia","Tennessee",
    "Kentucky","Indiana","Ohio","West Virginia","North Carolina","South Carolina","Pennsylvania","New York",
    "Michigan","Wisconsin","Minnesota","North Dakota","South Dakota","Montana","Wyoming","Colorado","Idaho",
    "Oregon","Washington","California","Illinois","Virginia","Mississippi",
  ]),
  "Reefer": new Set([
    "California","Oregon","Washington","Arizona","Nevada","Utah","Colorado","New Mexico","Idaho","Florida","Texas",
    "Georgia","North Carolina","Virginia","Pennsylvania","New York","New Jersey","Ohio","Illinois","Michigan",
    "Minnesota","Wisconsin","Iowa","Missouri","Tennessee","Alabama","Louisiana","Maryland","Connecticut","Massachusetts",
  ]),
};

const EQUIPMENT_LABELS: Record<string, { ru: string; color: string }> = {
  "Dry Van":  { ru: "Крытый фургон", color: "#CC0000" },
  "Flatbed":  { ru: "Платформа",     color: "#e06b00" },
  "Reefer":   { ru: "Рефрижератор",  color: "#0077cc" },
};

// Alaska and Hawaii FIPS — exclude from 48 states view
const EXCLUDE = new Set(["02", "15"]);

interface CoverageMapProps {
  theme?: "dark" | "light";
}

export const CoverageMap: React.FC<CoverageMapProps> = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const { ref, inView } = useInView<HTMLElement>(0.1);

  const [activeEquip, setActiveEquip] = useState<string>("Dry Van");
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const bg = isDark ? "#080808" : "#f5f5f5";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
  const mapBg = isDark ? "#0d0d0d" : "#e8e8e8";
  const strokeColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";

  const activeColor = EQUIPMENT_LABELS[activeEquip].color;
  const activeSet = EQUIPMENT[activeEquip];

  const STATS = [
    { num: "48", label: lang === "ru" ? "штатов" : "States" },
    { num: "500+", label: lang === "ru" ? "грузов" : "Loads" },
    { num: "2M+", label: lang === "ru" ? "миль" : "Miles" },
    { num: "24/7", label: lang === "ru" ? "диспетчер" : "Dispatch" },
  ];

  function getStateFill(name: string) {
    if (!activeSet.has(name)) {
      return isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
    }
    if (hoveredState === name) return activeColor;
    return activeColor + (isDark ? "55" : "44");
  }

  function getStateStroke(name: string) {
    if (hoveredState === name) return activeColor;
    return strokeColor;
  }

  return (
    <section ref={ref} style={{ background: bg, padding: "72px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          marginBottom: 36,
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
              ? "Выберите тип техники — увидите штаты, где мы активно работаем."
              : "Select equipment type to see states where we actively dispatch loads."}
          </p>
        </div>

        {/* Equipment tabs */}
        <div style={{
          display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.5s ease 0.15s",
        }}>
          {Object.entries(EQUIPMENT_LABELS).map(([key, { ru, color }]) => {
            const active = activeEquip === key;
            return (
              <button
                key={key}
                onClick={() => setActiveEquip(key)}
                style={{
                  padding: "8px 20px",
                  border: `1.5px solid ${active ? color : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)")}`,
                  borderRadius: 4,
                  background: active ? color + "22" : "transparent",
                  color: active ? color : subColor,
                  fontFamily: "'Barlow',sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, opacity: active ? 1 : 0.45 }} />
                {lang === "ru" ? ru : key}
                <span style={{ fontSize: 10, opacity: 0.7 }}>· {EQUIPMENT[key].size} {lang === "ru" ? "шт." : "states"}</span>
              </button>
            );
          })}
        </div>

        {/* Map */}
        <div style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
          background: mapBg,
          borderRadius: 10,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Hovered state tooltip */}
          {hoveredState && (
            <div style={{
              position: "absolute", top: 14, right: 16, zIndex: 10,
              background: isDark ? "#1a1a1a" : "#fff",
              border: `1px solid ${activeColor}44`,
              borderRadius: 6,
              padding: "8px 14px",
              fontFamily: "'Barlow',sans-serif",
              fontSize: 12,
              color: textColor,
              pointerEvents: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}>
              <span style={{ fontWeight: 800, color: activeColor }}>{hoveredState}</span>
              <span style={{ color: subColor, marginLeft: 8 }}>
                · {lang === "ru" ? EQUIPMENT_LABELS[activeEquip].ru : activeEquip}
              </span>
            </div>
          )}

          <ComposableMap
            projection="geoAlbersUsa"
            style={{ width: "100%", height: "auto" }}
            projectionConfig={{ scale: 900 }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) =>
                geographies
                  .filter((geo: any) => !EXCLUDE.has(geo.id as string))
                  .map((geo: any) => {
                    const name: string = geo.properties.name ?? "";
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => setHoveredState(name)}
                        onMouseLeave={() => setHoveredState(null)}
                        style={{
                          default: {
                            fill: getStateFill(name),
                            stroke: getStateStroke(name),
                            strokeWidth: 0.7,
                            outline: "none",
                            transition: "fill 0.2s, stroke 0.2s",
                          },
                          hover: {
                            fill: activeSet.has(name) ? activeColor : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"),
                            stroke: activeSet.has(name) ? activeColor : strokeColor,
                            strokeWidth: 1,
                            outline: "none",
                            cursor: activeSet.has(name) ? "pointer" : "default",
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* Legend */}
        <div style={{
          display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.5s ease 0.5s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 24, height: 10, borderRadius: 2, background: activeColor + "88", display: "inline-block" }} />
            <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: subColor, letterSpacing: 1 }}>
              {lang === "ru" ? "Активное покрытие" : "Active coverage"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 24, height: 10, borderRadius: 2, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)", display: "inline-block" }} />
            <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: subColor, letterSpacing: 1 }}>
              {lang === "ru" ? "По запросу" : "On request"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 48, marginTop: 44, flexWrap: "wrap", justifyContent: "center",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.55s",
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
