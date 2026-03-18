import { useState } from "react";
import type { Load } from "../types/index";

interface FavoritesPanelProps {
  loads: Load[];
  theme: string;
  onClose: () => void;
}

function FavoriteCard({ load, theme }: { load: Load; theme: string }) {
  const isDark = theme === "dark";
  const [booked, setBooked] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <div style={{
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      borderRadius: 10, overflow: "hidden",
      transition: "transform 0.2s",
    }}>
      {/* Фото */}
      <div style={{ position: "relative", height: 130 }}>
        <img src={load.image} alt={load.route} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.9))" }} />
        {load.tag && (
          <div style={{ position: "absolute", top: 0, left: 0, background: load.tag === "Military Load" ? "#1a3a6b" : "#CC0000", color: "#fff", padding: "4px 10px", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", borderBottomRightRadius: 6 }}>
            {load.tag}
          </div>
        )}
        <div style={{ position: "absolute", bottom: 10, left: 12 }}>
          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 24, color: "#fff", lineHeight: 1 }}>
            ${load.price.toLocaleString()}
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginLeft: 5 }}>/ {load.miles.toLocaleString()} mi</span>
          </div>
          <div style={{ display: "inline-block", background: "#CC0000", color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 7, letterSpacing: 2, textTransform: "uppercase", padding: "2px 8px", borderRadius: 2, marginTop: 4 }}>{load.type}</div>
        </div>
      </div>

      {/* Инфо */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", border: "2px solid #CC0000", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: isDark ? "rgba(255,255,255,0.9)" : "#1a1a1a" }}>{load.route}</span>
          <span style={{ color: "#CC0000", fontSize: 10 }}>→</span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#CC0000", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: isDark ? "rgba(255,255,255,0.9)" : "#1a1a1a" }}>{load.dest}</span>
        </div>
        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{load.cargo}</div>

        {/* Кнопка Book Load */}
        <button
          onClick={() => setBooked(true)}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          disabled={booked}
          style={{
            width: "100%",
            background: booked ? "rgba(0,180,80,0.1)" : hov ? "#aa0000" : "#CC0000",
            color: booked ? "#00b450" : "#fff",
            border: booked ? "1px solid rgba(0,180,80,0.3)" : "none",
            borderRadius: 6, padding: "9px",
            fontFamily: "'Oswald',sans-serif", fontWeight: 600,
            fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase",
            cursor: booked ? "default" : "pointer",
            transition: "all 0.15s",
            boxShadow: !booked ? "0 3px 12px rgba(204,0,0,0.35)" : "none",
          }}
        >
          {booked ? "✓ REQUESTED" : "📋 BOOK LOAD"}
        </button>
      </div>
    </div>
  );
}

export function FavoritesPanel({ loads, theme, onClose }: FavoritesPanelProps) {
  const isDark = theme === "dark";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "min(480px, 100vw)",
          background: isDark ? "#0f0f0f" : "#fff",
          borderLeft: "2px solid #CC0000",
          display: "flex", flexDirection: "column",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Заголовок */}
        <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Saved Loads</div>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase" }}>
              FAVORITES <span style={{ color: "#CC0000" }}>({loads.length})</span>
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: "50%", width: 36, height: 36, color: "#CC0000", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Список */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {loads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🤍</div>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", fontSize: 14 }}>No saved loads yet</p>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)", fontSize: 12, marginTop: 6 }}>Click ♥ on any load card to save it here</p>
            </div>
          ) : (
            loads.map(l => <FavoriteCard key={l.id} load={l} theme={theme} />)
          )}
        </div>

        {/* Футер */}
        {loads.length > 0 && (
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`, textAlign: "center" }}>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>
              Need help? Call dispatch: <span style={{ color: "#CC0000", fontWeight: 700 }}>+1 786-202-6599</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}