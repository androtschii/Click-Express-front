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

type CellResult = { value: string; isWin: boolean; isWorse: boolean };

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
  const surface  = isDark ? "#111"    : "#f7f7f7";
  const border   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)";
  const textPrim = isDark ? "#f0ede8" : "#111";
  const textMute = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";

  const multi = loads.length > 1;

  // Best values
  const bestPrice = best(loads, "price", "max");
  const bestMiles = best(loads, "miles", "min");
  const bestRpm   = Math.max(...loads.map(l => l.price / l.miles));
  const bestDrive = Math.min(...loads.map(l => l.miles / 55));

  // Worst values
  const worstPrice = best(loads, "price", "min");
  const worstMiles = best(loads, "miles", "max");
  const worstRpm   = Math.min(...loads.map(l => l.price / l.miles));
  const worstDrive = Math.max(...loads.map(l => l.miles / 55));

  const rows: { label: string; render: (l: Load) => CellResult }[] = [
    {
      label: lang === "ru" ? "Маршрут" : "Route",
      render: l => ({ value: `${l.route} → ${l.dest}`, isWin: false, isWorse: false }),
    },
    {
      label: lang === "ru" ? "Цена" : "Price",
      render: l => ({
        value: `$${l.price.toLocaleString()}`,
        isWin:  l.price === bestPrice,
        isWorse: multi && l.price === worstPrice && bestPrice !== worstPrice,
      }),
    },
    {
      label: lang === "ru" ? "Расстояние" : "Distance",
      render: l => ({
        value: `${l.miles.toLocaleString()} mi`,
        isWin:  l.miles === bestMiles,
        isWorse: multi && l.miles === worstMiles && bestMiles !== worstMiles,
      }),
    },
    {
      label: "$/mi",
      render: l => {
        const rpm = l.price / l.miles;
        return {
          value: `$${rpm.toFixed(2)}/mi`,
          isWin:  Math.abs(rpm - bestRpm) < 0.001,
          isWorse: multi && Math.abs(rpm - worstRpm) < 0.001 && Math.abs(bestRpm - worstRpm) > 0.001,
        };
      },
    },
    {
      label: lang === "ru" ? "Время в пути" : "Drive Time",
      render: l => {
        const h = Math.floor(l.miles / 55);
        const m = Math.round(((l.miles / 55) - h) * 60);
        const driveH = l.miles / 55;
        return {
          value: `${h}h ${m}m`,
          isWin:  Math.abs(driveH - bestDrive) < 0.01,
          isWorse: multi && Math.abs(driveH - worstDrive) < 0.01 && Math.abs(bestDrive - worstDrive) > 0.01,
        };
      },
    },
    {
      label: lang === "ru" ? "Тип" : "Type",
      render: l => ({ value: l.type, isWin: false, isWorse: false }),
    },
    {
      label: lang === "ru" ? "Груз" : "Cargo",
      render: l => ({ value: l.cargo, isWin: false, isWorse: false }),
    },
    {
      label: "Tag",
      render: l => ({ value: l.tag ?? "—", isWin: false, isWorse: false }),
    },
  ];

  // Win count per load (for badge)
  const winsPerLoad = loads.map(l => rows.filter(row => row.render(l).isWin).length);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes compareIn { from{opacity:0;transform:scale(0.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .cmp-row-same td { opacity:0.48; }
        .cmp-row-same:hover td { opacity:0.8 !important; transition:opacity 0.15s; }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{ background: bg, border: `1px solid ${border}`, borderTop: "3px solid #CC0000", width: "100%", maxWidth: 880, maxHeight: "90vh", display: "flex", flexDirection: "column", animation: "compareIn 0.28s cubic-bezier(0.22,1,0.36,1) both", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
      >
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 9, letterSpacing: 4, color: "#CC0000", textTransform: "uppercase", marginBottom: 4 }}>
              {lang === "ru" ? "СРАВНЕНИЕ ГРУЗОВ" : "LOAD COMPARISON"}
            </div>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, color: textPrim, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {loads.length} {lang === "ru" ? "ГРУЗА" : "LOADS"}{" "}
              <span style={{ color: "#CC0000" }}>{lang === "ru" ? "СРАВНИВАЮТСЯ" : "SIDE BY SIDE"}</span>
            </div>
          </div>
          <button onClick={onClose}
            style={{ width: 36, height: 36, border: `1px solid ${border}`, background: "transparent", color: textMute, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.color = "#CC0000"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; (e.currentTarget as HTMLElement).style.color = textMute; }}>
            ✕
          </button>
        </div>

        {/* Scrollable table */}
        <div style={{ overflowY: "auto", overflowX: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
            <thead>
              <tr>
                <th style={{ width: 130, padding: "12px 16px", background: surface, borderBottom: `1px solid ${border}`, fontFamily: "'Anton',sans-serif", fontSize: 9, letterSpacing: 3, color: textMute, textTransform: "uppercase", textAlign: "left" }}>
                  {lang === "ru" ? "ПАРАМЕТР" : "PARAMETER"}
                </th>
                {loads.map((l, li) => (
                  <th key={l.id} style={{ padding: 0, borderBottom: `1px solid ${border}`, borderLeft: `1px solid ${border}`, verticalAlign: "top", minWidth: 200 }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ height: 120, overflow: "hidden", position: "relative" }}>
                        <img src={l.image} alt={l.route} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 72%", filter: isDark ? "brightness(0.55)" : "brightness(0.8)" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 55%)" }} />
                        <div style={{ position: "absolute", bottom: 8, left: 10, right: 34 }}>
                          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 18, color: "#fff", lineHeight: 1 }}>${l.price.toLocaleString()}</div>
                          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.route} → {l.dest}</div>
                        </div>
                        {/* Wins badge */}
                        {multi && winsPerLoad[li] > 0 && (
                          <div style={{ position: "absolute", top: 8, left: 8, background: "#00b450", color: "#fff", borderRadius: 10, padding: "2px 8px", fontFamily: "'Anton',sans-serif", fontSize: 9, letterSpacing: 2 }}>
                            ★ {winsPerLoad[li]} {lang === "ru" ? "ПОБЕДА" : "WIN"}{winsPerLoad[li] > 1 ? "S" : ""}
                          </div>
                        )}
                      </div>
                      <button onClick={() => onRemove(l.id)} title={lang === "ru" ? "Убрать" : "Remove"}
                        style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, border: "none", background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.8)", borderRadius: 3, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, ri) => {
                const cells = loads.map(l => row.render(l));
                const allSame = multi && cells.every(c => c.value === cells[0].value);
                const hasDiff = multi && !allSame;

                return (
                  <tr key={ri} className={allSame ? "cmp-row-same" : ""} style={{ background: ri % 2 === 0 ? bg : surface }}>
                    {/* Label cell */}
                    <td style={{ padding: "11px 16px", borderBottom: `1px solid ${border}`, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 9, letterSpacing: 2, color: textMute, textTransform: "uppercase" }}>
                          {row.label}
                        </span>
                        {allSame && (
                          <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: textMute, opacity: 0.6 }}>≡</span>
                        )}
                        {hasDiff && (
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(234,179,8,0.75)", flexShrink: 0, display: "inline-block" }} title="Values differ" />
                        )}
                      </div>
                    </td>

                    {/* Value cells */}
                    {cells.map((cell, ci) => {
                      const l = loads[ci];
                      const isTextDiff = hasDiff && !cell.isWin && !cell.isWorse;
                      return (
                        <td key={l.id} style={{ padding: "11px 16px", borderBottom: `1px solid ${border}`, borderLeft: `1px solid ${border}`, textAlign: "center" }}>
                          <span style={{
                            fontFamily: (cell.isWin || cell.isWorse) ? "'Anton',sans-serif" : "'DM Sans',sans-serif",
                            fontSize: (cell.isWin || cell.isWorse) ? 15 : 13,
                            fontWeight: (!cell.isWin && !cell.isWorse) ? 600 : undefined,
                            color: cell.isWin ? "#00b450" : cell.isWorse ? "#CC0000" : textPrim,
                            background: cell.isWin
                              ? (isDark ? "rgba(0,180,80,0.13)" : "rgba(0,180,80,0.1)")
                              : cell.isWorse
                              ? (isDark ? "rgba(204,0,0,0.13)" : "rgba(204,0,0,0.08)")
                              : isTextDiff
                              ? (isDark ? "rgba(234,179,8,0.09)" : "rgba(234,179,8,0.11)")
                              : "transparent",
                            padding: (cell.isWin || cell.isWorse || isTextDiff) ? "2px 8px" : undefined,
                            borderRadius: (cell.isWin || cell.isWorse || isTextDiff) ? 3 : undefined,
                            border: isTextDiff ? `1px solid rgba(234,179,8,0.28)` : undefined,
                            display: "inline-block",
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: row.label === (lang === "ru" ? "Маршрут" : "Route") ? "normal" : "nowrap",
                          }}>
                            {cell.isWin && "★ "}{cell.isWorse && "↓ "}{cell.value}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Action row */}
              <tr>
                <td style={{ padding: "14px 16px", background: bg }} />
                {loads.map(l => (
                  <td key={l.id} style={{ padding: "14px 16px", borderLeft: `1px solid ${border}`, background: bg }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button onClick={() => onBook?.(l)}
                        style={{ padding: "10px", width: "100%", border: "none", cursor: "pointer", background: bookedIds.includes(l.id) ? "rgba(0,180,80,0.12)" : "#CC0000", color: bookedIds.includes(l.id) ? "#00b450" : "#fff", fontFamily: "'Anton',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", transition: "all 0.15s" }}
                        onMouseEnter={e => { if (!bookedIds.includes(l.id)) (e.currentTarget as HTMLElement).style.background = "#aa0000"; }}
                        onMouseLeave={e => { if (!bookedIds.includes(l.id)) (e.currentTarget as HTMLElement).style.background = "#CC0000"; }}>
                        {bookedIds.includes(l.id) ? (lang === "ru" ? "✓ ЗАЯВЛЕНО" : "✓ REQUESTED") : (lang === "ru" ? "ЗАЯВИТЬ ГРУЗ" : "BOOK LOAD")}
                      </button>
                      {onDetails && (
                        <button onClick={() => { onClose(); setTimeout(() => onDetails(l), 80); }}
                          style={{ padding: "8px", width: "100%", background: "transparent", border: `1px solid ${border}`, color: textMute, cursor: "pointer", fontFamily: "'Anton',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", transition: "all 0.15s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.color = "#CC0000"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; (e.currentTarget as HTMLElement).style.color = textMute; }}>
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

        {/* Legend */}
        {multi && (
          <div style={{ padding: "10px 20px", borderTop: `1px solid ${border}`, display: "flex", gap: 18, alignItems: "center", flexShrink: 0, background: surface, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 8, letterSpacing: 2, color: textMute, textTransform: "uppercase" }}>
              {lang === "ru" ? "ЛЕГЕНДА:" : "LEGEND:"}
            </span>
            {[
              { mark: "★", color: "#00b450", bg: isDark ? "rgba(0,180,80,0.13)" : "rgba(0,180,80,0.1)", label: lang === "ru" ? "Лучшее" : "Best" },
              { mark: "↓", color: "#CC0000", bg: isDark ? "rgba(204,0,0,0.13)" : "rgba(204,0,0,0.08)", label: lang === "ru" ? "Худшее" : "Worst" },
              { mark: "◆", color: "rgba(234,179,8,0.9)", bg: isDark ? "rgba(234,179,8,0.09)" : "rgba(234,179,8,0.11)", label: lang === "ru" ? "Различие" : "Differs" },
              { mark: "≡", color: textMute, bg: "transparent", label: lang === "ru" ? "Одинаково" : "Identical" },
            ].map(item => (
              <div key={item.mark} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 11, color: item.color, background: item.bg, padding: "1px 6px", borderRadius: 2, border: item.mark === "◆" ? "1px solid rgba(234,179,8,0.28)" : undefined }}>
                  {item.mark}
                </span>
                <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: textMute, fontWeight: 600 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
