import React, { useState } from "react";
import type { Load } from "../../types/index";
import { useLanguage } from "../../context/LanguageContext";

interface Props {
  loads: Load[];
  theme?: "dark" | "light";
  onDetails?: (load: Load) => void;
}

function extractState(route: string): string | null {
  const m = route.match(/,\s*([A-Z]{2})$/);
  return m ? m[1] : null;
}

// Approximate state center positions as % of container (continental US bounding box)
const STATE_POS: Record<string, [number, number]> = {
  WA: [7, 9],   OR: [7, 24],  CA: [9, 52],  NV: [14, 43], ID: [18, 20], MT: [25, 11],
  WY: [30, 26], UT: [24, 41], CO: [33, 43], AZ: [23, 62], NM: [31, 62],
  ND: [43, 9],  SD: [42, 21], NE: [43, 33], KS: [46, 44], OK: [48, 55], TX: [43, 73],
  MN: [54, 13], IA: [54, 30], MO: [56, 44], AR: [56, 59], LA: [56, 73],
  WI: [61, 20], IL: [61, 37], MI: [70, 23], IN: [67, 38],
  TN: [66, 54], AL: [66, 66], MS: [61, 67], KY: [68, 48],
  OH: [72, 37], GA: [71, 67], FL: [74, 85],
  SC: [75, 63], NC: [77, 56], WV: [76, 43], VA: [78, 48],
  PA: [81, 34], NY: [83, 26], MD: [84, 41], DE: [86, 41],
  NJ: [86, 36], CT: [89, 30], RI: [91, 30], MA: [90, 25],
  VT: [88, 20], NH: [91, 20], ME: [94, 15],
};

export const LoadMapView: React.FC<Props> = ({ loads, theme = "dark", onDetails }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const byState: Record<string, Load[]> = {};
  loads.forEach(l => {
    const st = extractState(l.route);
    if (st && STATE_POS[st]) {
      (byState[st] ??= []).push(l);
    }
  });

  const textMuted   = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";
  const tooltipBg   = isDark ? "#141414" : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)";

  return (
    <div style={{ border: `1px solid ${borderColor}`, overflow: "hidden", background: isDark ? "#0a0a0a" : "#fff" }}>
      <style>{`
        @keyframes pinDrop { from { transform: translate(-50%,-50%) translateY(-12px) scale(0.7); opacity:0; } to { transform: translate(-50%,-50%) translateY(0) scale(1); opacity:1; } }
        @keyframes pinPulse { 0%,100%{box-shadow:0 2px 10px rgba(0,0,0,0.5)} 50%{box-shadow:0 4px 20px rgba(204,0,0,0.75),0 0 0 5px rgba(204,0,0,0.12)} }
      `}</style>

      {/* Header */}
      <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${borderColor}`, background: isDark ? "#0e0e0e" : "#fafafa" }}>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 3, color: "#CC0000", textTransform: "uppercase" }}>
          📍 {lang === "ru" ? "Карта грузов — США" : "Load Map — USA"}
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: textMuted }}>
          {Object.keys(byState).length} {lang === "ru" ? "штатов" : "states"} · {loads.length} {lang === "ru" ? "грузов" : "loads"}
        </span>
      </div>

      {/* Map area */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingBottom: "55%",
        backgroundColor: isDark ? "#0d1824" : "#ddeaf7",
        backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,80,180,0.07)"} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}>
        {/* Bounding box outline */}
        <div style={{
          position: "absolute", inset: "4% 2% 10% 2%",
          border: `1px dashed ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)"}`,
          pointerEvents: "none",
        }} />

        {/* Watermark */}
        <div style={{
          position: "absolute", bottom: "12%", left: "50%", transform: "translateX(-50%)",
          fontFamily: "'Anton', sans-serif", fontSize: "clamp(8px,1.1vw,11px)",
          letterSpacing: 5, color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.07)",
          textTransform: "uppercase", pointerEvents: "none", whiteSpace: "nowrap",
        }}>CONTINENTAL UNITED STATES</div>

        {/* Pins */}
        {Object.entries(byState).map(([st, stLoads]) => {
          const [x, y] = STATE_POS[st];
          const isHov = hovered === st;
          const isSel = selected === st;
          const count = stLoads.length;
          const show  = isHov || isSel;

          // Smart tooltip positioning to avoid clipping
          const tipLeft      = x > 78 ? "auto"           : "50%";
          const tipRight     = x > 78 ? "0"              : "auto";
          const tipTransform = x > 78 ? "none"           : "translateX(-50%)";
          const tipBottom    = y < 25 ? "auto"           : "calc(100% + 10px)";
          const tipTop       = y < 25 ? "calc(100% + 10px)" : "auto";

          return (
            <div key={st} style={{
              position: "absolute",
              left: `${x}%`, top: `${y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: show ? 20 : 5,
              cursor: "pointer",
              animation: "pinDrop 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
              onMouseEnter={() => setHovered(st)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (count === 1) { onDetails?.(stLoads[0]); }
                else { setSelected(isSel ? null : st); }
              }}
            >
              {/* Marker shape */}
              <div style={{
                width: 28, height: 28,
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(-45deg)",
                background: isHov || isSel ? "#e60000" : "#CC0000",
                border: `2px solid ${isDark ? "rgba(255,255,255,0.45)" : "#fff"}`,
                boxShadow: isHov || isSel
                  ? "0 4px 20px rgba(204,0,0,0.75), 0 0 0 5px rgba(204,0,0,0.15)"
                  : "0 2px 10px rgba(0,0,0,0.5)",
                transition: "all 0.18s ease",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <span style={{ transform: "rotate(45deg)", fontFamily: "'Anton', sans-serif", fontSize: 7.5, color: "#fff", letterSpacing: 0.2, lineHeight: 1 }}>
                  {st}
                </span>
                {count > 1 && (
                  <div style={{
                    position: "absolute", top: -7, right: -7, transform: "rotate(45deg)",
                    width: 15, height: 15, borderRadius: "50%",
                    background: "#fff", color: "#CC0000",
                    fontFamily: "'Anton', sans-serif", fontSize: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}>{count}</div>
                )}
              </div>

              {/* Tooltip */}
              {show && (
                <div style={{
                  position: "absolute",
                  bottom: tipBottom, top: tipTop,
                  left: tipLeft, right: tipRight,
                  transform: tipTransform,
                  background: tooltipBg,
                  border: `1px solid ${borderColor}`,
                  borderTop: "2px solid #CC0000",
                  padding: "10px 14px",
                  minWidth: 210, maxWidth: 270,
                  boxShadow: "0 8px 36px rgba(0,0,0,0.45)",
                  zIndex: 30, pointerEvents: "none",
                }}>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>
                    {st} · {count} {lang === "ru" ? (count === 1 ? "груз" : count < 5 ? "груза" : "грузов") : count === 1 ? "load" : "loads"}
                  </div>
                  {stLoads.slice(0, 3).map((l, i) => (
                    <div key={l.id} style={{
                      paddingBottom: i < Math.min(count, 3) - 1 ? 7 : 0,
                      marginBottom: i < Math.min(count, 3) - 1 ? 7 : 0,
                      borderBottom: i < Math.min(count, 3) - 1 ? `1px solid ${borderColor}` : "none",
                    }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, color: isDark ? "#f0ede8" : "#111", marginBottom: 2 }}>
                        {l.route} → {l.dest}
                      </div>
                      <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, color: "#CC0000" }}>
                        ${l.price.toLocaleString()} · {l.miles.toLocaleString()} mi
                      </div>
                    </div>
                  ))}
                  {count > 3 && (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: textMuted, marginTop: 5 }}>
                      +{count - 3} {lang === "ru" ? "ещё" : "more"}
                    </div>
                  )}
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 9, color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.3)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 8 }}>
                    {count === 1
                      ? (lang === "ru" ? "НАЖМИТЕ →" : "CLICK TO VIEW →")
                      : (lang === "ru" ? "НАЖМИТЕ ДЛЯ ВЫБОРА →" : "CLICK TO SELECT →")}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {Object.keys(byState).length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 40 }}>🗺️</div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 3, color: textMuted, textTransform: "uppercase" }}>
              {lang === "ru" ? "НЕТ ГРУЗОВ" : "NO LOADS FOUND"}
            </div>
          </div>
        )}
      </div>

      {/* Multi-load panel for selected state */}
      {selected && byState[selected] && (
        <div style={{ padding: "14px 20px", borderTop: `2px solid #CC0000`, background: isDark ? "#0e0e0e" : "#fafafa" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 2, color: "#CC0000", textTransform: "uppercase" }}>
              {lang === "ru" ? `Грузы из ${selected}` : `Loads from ${selected}`} ({byState[selected].length})
            </span>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: textMuted, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 4px" }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {byState[selected].map(l => (
              <div key={l.id} onClick={() => onDetails?.(l)} style={{
                flex: "1 1 200px", padding: "10px 14px",
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                border: `1px solid ${borderColor}`,
                cursor: "pointer", transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = borderColor; }}
              >
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: isDark ? "#f0ede8" : "#111", marginBottom: 3 }}>
                  {l.route} → {l.dest}
                </div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 12, color: "#CC0000" }}>
                  ${l.price.toLocaleString()} · {(l.price / l.miles).toFixed(2)}/mi
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
