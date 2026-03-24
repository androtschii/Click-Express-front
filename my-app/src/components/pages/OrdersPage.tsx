import React from "react";
import type { Load } from "../../types/index";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface OrdersPageProps {
  orders: Load[];
  theme?: "dark" | "light";
  onBack?: () => void;
  onCancel?: (load: Load) => void;
  onDetails?: (load: Load) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  theme = "dark",
  onBack,
  onCancel,
  onDetails,
}) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const t = translations[lang].orders;

  const bg = isDark ? "#080808" : "#f5f5f5";
  const card = isDark ? "#0d0d0d" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const text = isDark ? "#fff" : "#1a1a1a";
  const muted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", background: bg, padding: "clamp(24px,4vw,56px) clamp(16px,4vw,40px)" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .order-card:hover { border-color: rgba(204,0,0,0.5) !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important; }
        .order-card { transition: all 0.2s; }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
        {/* Back button */}
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: muted, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 1, cursor: "pointer", marginBottom: 32, padding: 0, display: "flex", alignItems: "center", gap: 6, transition: "color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#CC0000"; }}
          onMouseLeave={e => { e.currentTarget.style.color = muted; }}>
          {t.back}
        </button>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>● {lang === "ru" ? "ЗАКАЗЫ" : "ORDERS"}</div>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", color: text, textTransform: "uppercase", lineHeight: 1 }}>
            MY <span style={{ color: "#CC0000" }}>ORDERS</span>
          </h1>
        </div>

        {/* Summary badge */}
        {orders.length > 0 && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(204,0,0,0.08)", border: "1px solid rgba(204,0,0,0.22)", borderRadius: 6, padding: "8px 18px", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: "#CC0000", letterSpacing: 1, marginBottom: 24, textTransform: "uppercase" }}>
            📋 {orders.length} {t.booked}
          </div>
        )}

        {/* Empty state */}
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", border: `1px dashed ${border}`, borderRadius: 12 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <p style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 20, color: text, marginBottom: 8 }}>{t.empty}</p>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: muted }}>{t.emptyHint}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {orders.map((load, idx) => (
              <div key={load.id} className="order-card" style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden", boxShadow: "none" }}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  {/* Image column */}
                  <div style={{ width: 130, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                    <img src={load.image} alt={load.route} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(0,0,0,0.4))" }} />
                    <div style={{ position: "absolute", top: 10, left: 10, background: "#CC0000", color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", padding: "3px 8px", borderRadius: 3 }}>
                      {load.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                          {t.orderId} #{String(idx + 1).padStart(3, "0")}
                        </div>
                        <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 18, color: text, lineHeight: 1.2 }}>{load.route}</div>
                        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: muted, marginTop: 4 }}>
                          {load.miles.toLocaleString()} {t.miles} · {load.weight}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: "#CC0000" }}>${load.price.toLocaleString()}</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "3px 10px", marginTop: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                          <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "#22c55e" }}>{t.booked}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button onClick={() => onDetails?.(load)} style={{ padding: "7px 16px", background: "transparent", border: "1px solid rgba(204,0,0,0.35)", borderRadius: 5, color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(204,0,0,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                        {t.viewDetails}
                      </button>
                      <button onClick={() => onCancel?.(load)} style={{ padding: "7px 16px", background: "transparent", border: `1px solid ${border}`, borderRadius: 5, color: muted, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#ff6b6b"; e.currentTarget.style.borderColor = "rgba(204,0,0,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = border; }}>
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
