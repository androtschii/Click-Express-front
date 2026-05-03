import React, { useEffect } from "react";
import type { Load } from "../../types/index";
import { useLanguage } from "../../context/LanguageContext";

interface Props {
  loads: Load[];
  theme?: "dark" | "light";
  onClose: () => void;
  onBook?: (load: Load) => void;
  onDetails?: (load: Load) => void;
  onRemove: (id: number) => void;
  bookedIds?: number[];
}

function best(loads: Load[], key: keyof Load, mode: "max" | "min"): number {
  const vals = loads.map(l => l[key] as number);
  return mode === "max" ? Math.max(...vals) : Math.min(...vals);
}

export const CompareModal: React.FC<Props> = ({
  loads, theme = "dark", onClose, onBook, onDetails, onRemove, bookedIds = [],
}) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const bg       = isDark ? "#0a0a0a" : "#fff";
  const surface  = isDark ? "#111" : "#f7f7f7";
  const border   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)";
  const textPrim = isDark ? "#f0ede8" : "#111";
  const textMute = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";

  const bestPrice  = best(loads, "price", "max");
  const bestMiles  = best(loads, "miles", "min");
  const bestRpm    = Math.max(...loads.map(l => l.price / l.miles));
  const bestDrive  = Math.min(...loads.map(l => l.miles / 55));

  const rows: { label: string; render: (l: Load) => { value: string; isWin: boolean } }[] = [
    {
      label: lang === "ru" ? "Цена" : "Price",
      render: l => ({ value: `$${l.price.toLocaleString()}`, isWin: l.price === bestPrice }),
    },
    {
      label: lang === "ru" ? "Расстояние" : "Distance",
      render: l => ({ value: `${l.miles.toLocaleString()} mi`, isWin: l.miles === bestMiles }),
    },
    {
      label: "$/mi",
      render: l => {
        const rpm = l.price / l.miles;
        return { value: `$${rpm.toFixed(2)}/mi`, isWin: Math.abs(rpm - bestRpm) < 0.001 };
      },
    },
    {
      label: lang === "ru" ? "Время в пути" : "Drive Time",
      render: l => {
        const h = Math.floor(l.miles / 55);
        const m = Math.round(((l.miles / 55) - h) * 60);
        const driveH = l.miles / 55;
        return { value: `${h}h ${m}m`, isWin: Math.abs(driveH - bestDrive) < 0.01 };
      },
    },
    {
      label: lang === "ru" ? "Тип" : "Type",
      render: l => ({ value: l.type, isWin: false }),
    },
    {
      label: lang === "ru" ? "Груз" : "Cargo",
      render: l => ({ value: l.cargo, isWin: false }),
    },
    {
      label: "Tag",
      render: l => ({ value: l.tag ?? "—", isWin: false }),
    },
  ];

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes compareIn { from { opacity:0; transform:scale(0.96) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: bg, border: `1px solid ${border}`, borderTop: "3px solid #CC0000", width: "100%", maxWidth: 880, maxHeight: "90vh", display: "flex", flexDirection: "column", animation: "compareIn 0.28s cubic-bezier(0.22,1,0.36,1) both", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
      >
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 9, letterSpacing: 4, color: "#CC0000", textTransform: "uppercase", marginBottom: 4 }}>
              {lang === "ru" ? "СРАВНЕНИЕ ГРУЗОВ" : "LOAD COMPARISON"}
            </div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: textPrim, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {loads.length} {lang === "ru" ? "ГРУЗА" : "LOADS"}{" "}
              <span style={{ color: "#CC0000" }}>{lang === "ru" ? "СРАВНИВАЮТСЯ" : "SIDE BY SIDE"}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, border: `1px solid ${border}`, background: "transparent", color: textMute, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.color = "#CC0000"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; (e.currentTarget as HTMLElement).style.color = textMute; }}>
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
            {/* Load image headers */}
            <thead>
              <tr>
                <th style={{ width: 130, padding: "12px 16px", background: surface, borderBottom: `1px solid ${border}`, fontFamily: "'Anton', sans-serif", fontSize: 9, letterSpacing: 3, color: textMute, textTransform: "uppercase", textAlign: "left" }}>
                  {lang === "ru" ? "ПАРАМЕТР" : "PARAMETER"}
                </th>
                {loads.map(l => (
                  <th key={l.id} style={{ padding: 0, borderBottom: `1px solid ${border}`, borderLeft: `1px solid ${border}`, verticalAlign: "top", minWidth: 200 }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ height: 120, overflow: "hidden", position: "relative" }}>
                        <img src={l.image} alt={l.route} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 72%", filter: isDark ? "brightness(0.55)" : "brightness(0.8)" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 55%)" }} />
                        <div style={{ position: "absolute", bottom: 8, left: 10, right: 34 }}>
                          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, color: "#fff", lineHeight: 1 }}>${l.price.toLocaleString()}</div>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.route} → {l.dest}</div>
                        </div>
                      </div>
                      {/* Remove from compare */}
                      <button
                        onClick={() => onRemove(l.id)}
                        title={lang === "ru" ? "Убрать" : "Remove"}
                        style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, border: "none", background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.8)", borderRadius: 3, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
                      >✕</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Data rows */}
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? bg : surface }}>
                  <td style={{ padding: "11px 16px", fontFamily: "'Anton', sans-serif", fontSize: 9, letterSpacing: 2, color: textMute, textTransform: "uppercase", borderBottom: `1px solid ${border}`, whiteSpace: "nowrap" }}>
                    {row.label}
                  </td>
                  {loads.map(l => {
                    const { value, isWin } = row.render(l);
                    return (
                      <td key={l.id} style={{ padding: "11px 16px", borderBottom: `1px solid ${border}`, borderLeft: `1px solid ${border}`, textAlign: "center" }}>
                        <span style={{
                          fontFamily: isWin ? "'Anton', sans-serif" : "'DM Sans', sans-serif",
                          fontSize: isWin ? 15 : 13,
                          fontWeight: isWin ? undefined : 600,
                          color: isWin ? "#00b450" : textPrim,
                          background: isWin ? (isDark ? "rgba(0,180,80,0.1)" : "rgba(0,180,80,0.08)") : "transparent",
                          padding: isWin ? "2px 8px" : undefined,
                          borderRadius: isWin ? 3 : undefined,
                          display: "inline-block",
                        }}>
                          {isWin && "★ "}{value}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Route row */}
              <tr style={{ background: surface }}>
                <td style={{ padding: "11px 16px", fontFamily: "'Anton', sans-serif", fontSize: 9, letterSpacing: 2, color: textMute, textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>
                  {lang === "ru" ? "МАРШРУТ" : "ROUTE"}
                </td>
                {loads.map(l => (
                  <td key={l.id} style={{ padding: "11px 16px", borderBottom: `1px solid ${border}`, borderLeft: `1px solid ${border}`, textAlign: "center" }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, color: textPrim }}>
                      {l.route}
                    </div>
                    <div style={{ color: "#CC0000", fontSize: 11, margin: "2px 0" }}>→</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, color: textPrim }}>
                      {l.dest}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Action row */}
              <tr>
                <td style={{ padding: "14px 16px", background: bg }} />
                {loads.map(l => (
                  <td key={l.id} style={{ padding: "14px 16px", borderLeft: `1px solid ${border}`, background: bg }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button
                        onClick={() => { onBook?.(l); }}
                        style={{
                          padding: "10px", width: "100%", border: "none", cursor: "pointer",
                          background: bookedIds.includes(l.id) ? "rgba(0,180,80,0.12)" : "#CC0000",
                          color: bookedIds.includes(l.id) ? "#00b450" : "#fff",
                          fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!bookedIds.includes(l.id)) (e.currentTarget as HTMLElement).style.background = "#aa0000"; }}
                        onMouseLeave={e => { if (!bookedIds.includes(l.id)) (e.currentTarget as HTMLElement).style.background = "#CC0000"; }}
                      >
                        {bookedIds.includes(l.id) ? (lang === "ru" ? "✓ ЗАЯВЛЕНО" : "✓ REQUESTED") : (lang === "ru" ? "ЗАЯВИТЬ ГРУЗ" : "BOOK LOAD")}
                      </button>
                      {onDetails && (
                        <button
                          onClick={() => { onClose(); setTimeout(() => onDetails(l), 80); }}
                          style={{ padding: "8px", width: "100%", background: "transparent", border: `1px solid ${border}`, color: textMute, cursor: "pointer", fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", transition: "all 0.15s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.color = "#CC0000"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; (e.currentTarget as HTMLElement).style.color = textMute; }}
                        >
                          {lang === "ru" ? "ПОДРОБНЕЕ →" : "VIEW DETAILS →"}
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
