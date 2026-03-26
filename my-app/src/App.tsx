import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider, useTheme } from "./theme";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { translations } from "./i18n/translations";
import { Header } from "./components/layout/Header";
import { Hero } from "./components/sections/Hero";
import { Ticker } from "./components/layout/Ticker";
import { TrustStrip } from "./components/sections/TrustStrip";
import { AboutSection } from "./components/sections/AboutSection";
import { Footer } from "./components/layout/Footer";
import { QuoteModal } from "./components/Modals/QuoteModal";
import { AuthModal } from "./components/Modals/AuthModal";
import { getSession, logout, type Session } from "./services/authService";
import { LoadListView } from "./components/loads/LoadList";
import { LoadDetailPage } from "./components/loads/LoadDetailPage";
import { CareersPage } from "./components/pages/CareersPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { OrdersPage } from "./components/pages/OrdersPage";
import { Notification } from "./components/ui/Notification";
import { PhoneIcon } from "./components/ui/PhoneIcon";
import { LOADS } from "./utils/data";
import type { Load } from "./types/index";
import { filterLoads, fetchLoads } from "./services/loadService.ts";

// ── Анимированное сердечко для секции "Лучшие грузы недели" ──────────────
function WeeklyHeartBtn({ saved, onClick }: { saved: boolean; onClick: () => void }) {
  const [burst, setBurst] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!saved) { setBurst(true); setTimeout(() => setBurst(false), 600); }
    onClick();
  };
  return (
    <button onClick={handleClick} style={{ position:"absolute", top:10, right:10, zIndex:3, width:38, height:38, borderRadius:"50%", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", background: saved ? "linear-gradient(135deg, #ff4d6d, #CC0000)" : "rgba(0,0,0,0.55)", boxShadow: saved ? "0 0 16px rgba(204,0,0,0.7), 0 0 32px rgba(204,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.4)", transition:"all 0.3s ease", animation: burst ? "heartBeat 0.6s ease" : "none", overflow:"visible" }}>
      {burst && <div style={{ position:"absolute", left:"50%", top:"50%", width:38, height:38, borderRadius:"50%", border:"2px solid #ff4d6d", animation:"burstRing 0.5s ease-out forwards", pointerEvents:"none", transform:"translate(-50%,-50%)" }} />}
      {burst && [0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        return <div key={i} style={{ position:"absolute", left:"50%", top:"50%", width:5, height:5, borderRadius:"50%", background: i%2===0 ? "#ff4d6d" : "#FFB300", animation:"particle 0.5s ease-out forwards", "--tx":`${Math.cos(rad)*18}px`, "--ty":`${Math.sin(rad)*18}px`, pointerEvents:"none" } as React.CSSProperties} />;
      })}
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ transition:"all 0.3s", filter: saved ? "drop-shadow(0 0 4px rgba(255,100,100,0.8))" : "none" }}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={saved ? "#fff" : "none"} stroke={saved ? "#fff" : "rgba(255,255,255,0.9)"} strokeWidth={saved ? "0" : "2"} style={{ transition:"all 0.3s" }} />
      </svg>
    </button>
  );
}

// ── Панель избранного ─────────────────────────────────────────────────────
function FavoritesPanel({ loads, theme, onClose, onDetails, onRemove }: { loads: Load[]; theme: string; onClose: () => void; onDetails?: (l: Load) => void; onRemove?: (l: Load) => void }) {
  const isDark = theme === "dark";
  const bord = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const { lang } = useLanguage();
  const t = translations[lang].favorites;
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(480px, 100vw)", background: isDark ? "#0a0a0a" : "#fff", borderLeft: "2px solid #CC0000", display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${bord}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{t.saved}</div>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 24, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase" }}>{t.title} <span style={{ color: "#CC0000" }}>({loads.length})</span></h3>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 38, height: 38, color: isDark ? "rgba(255,255,255,0.5)" : "#666", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", padding: "16px 20px" }}>
          {loads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>🤍</div>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", fontSize: 15 }}>{t.empty}</p>
            </div>
          ) : (
            <>
              {loads.map(l => (
                <div key={l.id} onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }}
                  style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${bord}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s", marginBottom: 14 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = bord; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div style={{ position: "relative", height: 260 }}>
                    <img src={l.image} alt={l.route} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 72%", filter: isDark ? "brightness(0.62)" : "brightness(0.75)" }} />
                    <div style={{ position: "absolute", inset: 0, background: isDark ? "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.88))" : "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65))" }} />
                    {l.tag && (
                      <div style={{ position: "absolute", top: 10, left: 10, background: l.tag === "Military Load" ? "#1a3a6b" : "#CC0000", color: "#fff", padding: "4px 10px", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", borderRadius: 4 }}>
                        {l.tag === "Best Load of the Week" ? "★ " : "✈ "}{l.tag}
                      </div>
                    )}
                    <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "3px 10px", fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "rgba(255,255,255,0.8)", letterSpacing: 1, backdropFilter: "blur(4px)" }}>VIEW →</div>
                    <div style={{ position: "absolute", bottom: 12, left: 14 }}>
                      <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: "#fff", lineHeight: 1 }}>${l.price.toLocaleString()}</div>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{l.miles.toLocaleString()} mi · ${(l.price / l.miles).toFixed(2)}/mi</div>
                      <div style={{ display: "inline-block", background: "#CC0000", color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", padding: "2px 8px", borderRadius: 2, marginTop: 4 }}>{l.type}</div>
                    </div>
                  </div>
                  <div style={{ padding: "10px 14px 12px" }}>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: isDark ? "rgba(255,255,255,0.9)" : "#1a1a1a", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.route} → {l.dest}</div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{l.cargo}</div>
                    <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }} style={{ flex: 1, padding: "8px", background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 6, color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#CC0000"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(204,0,0,0.1)"; e.currentTarget.style.color = "#CC0000"; }}>
                        {t.viewDetails}
                      </button>
                      <button onClick={() => onRemove && onRemove(l)} style={{ padding: "8px 16px", background: "rgba(255,77,109,0.12)", border: "1px solid rgba(255,77,109,0.4)", borderRadius: 6, color: "#ff4d6d", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s", flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#ff4d6d"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,77,109,0.12)"; e.currentTarget.style.color = "#ff4d6d"; }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        {t.unlike}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {loads.length > 0 && (
          <div style={{ padding: "14px 24px", borderTop: `1px solid ${bord}`, display: "flex", alignItems: "center", gap: 8 }}>
            <PhoneIcon size={14} color="#CC0000" />
            <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>{t.toBook} </span>
            <a href="tel:+17862026599" style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: "#CC0000", textDecoration: "none" }}>+1 786-202-6599</a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Панель заявок ─────────────────────────────────────────────────────────
function RequestsPanel({ loads, theme, onClose, onDetails, onCancel }: { loads: Load[]; theme: string; onClose: () => void; onDetails?: (l: Load) => void; onCancel?: (l: Load) => void }) {
  const isDark = theme === "dark";
  const bord = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const { lang } = useLanguage();
  const t = translations[lang].requests;
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(480px, 100vw)", background: isDark ? "#0a0a0a" : "#fff", borderLeft: "2px solid #CC0000", display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.6)" }}>
        <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${bord}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{t.booked}</div>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase" }}>{t.title} <span style={{ color: "#CC0000" }}>({loads.length})</span></h3>
          </div>
          <button onClick={onClose} style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: "50%", width: 40, height: 40, color: "#CC0000", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", padding: "16px 20px" }}>
          {loads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>📋</div>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", fontSize: 15 }}>{t.empty}</p>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)", fontSize: 12, marginTop: 6 }}>{t.emptyHint}</p>
            </div>
          ) : loads.map((l, idx) => (
                <div key={`${l.id}-${idx}`}
                  onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }}
                  style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: "1px solid rgba(0,180,80,0.3)", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s", marginBottom: 14 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,180,80,0.3)"; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div style={{ position: "relative", height: 260 }}>
                    <img src={l.image} alt={l.route} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 72%", filter: isDark ? "brightness(0.62)" : "brightness(0.75)" }} />
                    <div style={{ position: "absolute", inset: 0, background: isDark ? "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.88))" : "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65))" }} />
                    <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
                      <div style={{ background: "rgba(0,180,80,0.9)", color: "#fff", borderRadius: 20, padding: "5px 12px", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: 1 }}>✓ REQUESTED</div>
                    </div>
                    {l.tag && (
                      <div style={{ position: "absolute", top: 10, left: 10, background: l.tag === "Military Load" ? "#1a3a6b" : "#CC0000", color: "#fff", padding: "4px 10px", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", borderRadius: 4 }}>
                        {l.tag === "Best Load of the Week" ? "★ " : "✈ "}{l.tag}
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 12, left: 14 }}>
                      <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: "#fff", lineHeight: 1 }}>${l.price.toLocaleString()}</div>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{l.miles.toLocaleString()} mi · ${(l.price / l.miles).toFixed(2)}/mi</div>
                      <div style={{ display: "inline-block", background: "#CC0000", color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", padding: "2px 8px", borderRadius: 2, marginTop: 4 }}>{l.type}</div>
                    </div>
                  </div>
                  <div style={{ padding: "10px 14px 12px" }}>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: isDark ? "rgba(255,255,255,0.9)" : "#1a1a1a", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.route} → {l.dest}</div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{l.cargo}</div>
                    <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }} style={{ flex: 1, padding: "8px", background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 6, color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#CC0000"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(204,0,0,0.1)"; e.currentTarget.style.color = "#CC0000"; }}>
                        {t.viewDetails}
                      </button>
                      <button onClick={() => onCancel && onCancel(l)} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${bord}`, borderRadius: 6, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", fontFamily: "'Barlow',sans-serif", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#CC0000"; e.currentTarget.style.background = "rgba(204,0,0,0.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = bord; e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                </div>
          ))}
        </div>

        {/* Футер */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`, textAlign: "center" }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>
            {t.dispatcher}
          </div>
          <a href="tel:+17862026599" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: "#CC0000", textDecoration: "none" }}><PhoneIcon size={14} color="#CC0000" />+1 786-202-6599</a>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { lang } = useLanguage();
  const tn = translations[lang].notifications;
  const [weeklyIdx, setWeeklyIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Loads");
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedLoads, setBookedLoads] = useState<Load[]>([]);
  const [savedLoads, setSavedLoads] = useState<Load[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [session, setSession] = useState<Session | null>(() => getSession());
  const [detailLoad, setDetailLoad] = useState<Load | null>(null);
  const [showCareers, setShowCareers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const catalogRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" } as ScrollIntoViewOptions);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const run = async () => {
      try {
        const data = await fetchLoads(LOADS);
        setLoads(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = filterLoads(loads, search, filter);

  const handleSave = (load: Load, saved: boolean) => {
    setSavedLoads(prev => saved ? [...prev, load] : prev.filter(l => l.id !== load.id));
    notify(saved ? tn.savedToFavorites : tn.removedFromFavorites);
  };

  const handleCancelBook = (load?: Load) => {
    if (load) setBookedLoads(prev => prev.filter(l => l.id !== load.id));
    notify(tn.requestCancelled);
  };

  const handleBook = (load?: Load) => {
    if (load) setBookedLoads(prev => [...prev, load]);
    notify(tn.loadAdded);
  };

  const notify = (text: string) => {
    setNotifications(n => [...n, text]);
  };

  const bgColor = theme === "dark" ? "#080808" : "#f5f5f5";
  const textColor = theme === "dark" ? "#fff" : "#1a1a1a";
  const cardBg = theme === "dark" ? "#0d0d0d" : "#ffffff";

  const sharedStyle = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500;600;700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:${bgColor};color:${textColor};transition: background 0.3s, color 0.3s;}
      ::selection{background:#CC0000;color:#fff;}
      ::-webkit-scrollbar{width:6px;}
      ::-webkit-scrollbar-track{background:${theme === "dark" ? "#0a0a0a" : "#e0e0e0"};}
      ::-webkit-scrollbar-thumb{background:#CC0000;border-radius:3px;}
      input::placeholder{color:${theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)"};}
    `}</style>
  );

  const sharedHeader = (
    <Header
      cartCount={bookedLoads.length}
      savedCount={savedLoads.length}
      theme={theme}
      onThemeToggle={toggleTheme}
      onCatalogClick={() => { setDetailLoad(null); setShowCareers(false); setTimeout(() => scrollTo(catalogRef), 50); }}
      onAboutClick={() => { setDetailLoad(null); setShowCareers(false); setTimeout(() => scrollTo(aboutRef), 50); }}
      onContactClick={() => { setDetailLoad(null); setShowCareers(false); setTimeout(() => scrollTo(contactRef), 50); }}
      onQuoteClick={() => setShowQuote(true)}
      onCareersClick={() => { setDetailLoad(null); setShowCareers(true); setShowProfile(false); setShowOrders(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      onSavedClick={() => setShowFavorites(true)}
      onRequestsClick={() => setShowRequests(true)}
      onLoginClick={() => setShowAuth(true)}
      session={session}
      onLogout={() => { logout(); setSession(null); setShowProfile(false); setShowOrders(false); }}
      onLogoClick={() => { setDetailLoad(null); setShowCareers(false); setShowProfile(false); setShowOrders(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      onProfileClick={() => { setDetailLoad(null); setShowCareers(false); setShowOrders(false); setShowProfile(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      onOrdersClick={() => { setDetailLoad(null); setShowCareers(false); setShowProfile(false); setShowOrders(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
    />
  );

  const sharedPanels = (
    <>
      {showFavorites && <FavoritesPanel loads={savedLoads} theme={theme} onClose={() => setShowFavorites(false)} onDetails={(l) => { setShowFavorites(false); setDetailLoad(l); window.scrollTo({ top: 0 }); }} onRemove={(l) => { handleSave(l, false); notify(tn.removedFromFavorites); }} />}
      {showRequests && <RequestsPanel loads={bookedLoads} theme={theme} onClose={() => setShowRequests(false)} onDetails={(l) => { setShowRequests(false); setDetailLoad(l); window.scrollTo({ top: 0 }); }} onCancel={(l) => handleCancelBook(l)} />}
    </>
  );

  // ── Detail page — full screen ──────────────────────────────────────────
  if (detailLoad) {
    return (
      <div style={{ background: bgColor, minHeight: "100vh", color: textColor }}>
        {sharedStyle}
        {sharedHeader}
        <div style={{ paddingTop: 70 }}>
          <LoadDetailPage
            load={detailLoad}
            theme={theme}
            isBooked={bookedLoads.some(l => l.id === detailLoad.id)}
            onClose={() => { setDetailLoad(null); setTimeout(() => scrollTo(catalogRef), 80); }}
            onBook={(load) => handleBook(load)}
            onCancelBook={(load) => handleCancelBook(load)}
          />
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} theme={theme} onSuccess={(s) => { setSession(s); setShowAuth(false); }} />}
        {showQuote && <QuoteModal onClose={() => setShowQuote(false)} theme={theme} />}
        {sharedPanels}
        {notifications.map((msg, idx) => (
          <Notification key={idx} text={msg} onClose={() => setNotifications(n => n.filter((_, i) => i !== idx))} />
        ))}
      </div>
    );
  }

  // ── Careers page ──────────────────────────────────────────────────────
  if (showCareers) {
    return (
      <div style={{ background: bgColor, minHeight: "100vh", color: textColor }}>
        {sharedStyle}
        {sharedHeader}
        <div style={{ paddingTop: 70 }}>
          <CareersPage theme={theme} onBack={() => { setShowCareers(false); window.scrollTo({ top: 0 }); }} />
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} theme={theme} onSuccess={(s) => { setSession(s); setShowAuth(false); }} />}
        {showQuote && <QuoteModal onClose={() => setShowQuote(false)} theme={theme} />}
        {sharedPanels}
      </div>
    );
  }

  // ── Profile page ───────────────────────────────────────────────────────
  if (showProfile && session) {
    return (
      <div style={{ background: bgColor, minHeight: "100vh", color: textColor }}>
        {sharedStyle}
        {sharedHeader}
        <div style={{ paddingTop: 70 }}>
          <ProfilePage
            session={session}
            theme={theme}
            savedLoads={savedLoads}
            bookedLoads={bookedLoads}
            onBack={() => { setShowProfile(false); window.scrollTo({ top: 0 }); }}
            onBrowseLoads={() => { setShowProfile(false); setTimeout(() => scrollTo(catalogRef), 80); }}
            onLogout={() => { logout(); setSession(null); setShowProfile(false); }}
            onSessionUpdate={(name) => setSession(s => s ? { ...s, name } : s)}
            onDetails={(l) => { setShowProfile(false); setDetailLoad(l); window.scrollTo({ top: 0 }); }}
            onSaveRemove={(l) => handleSave(l, false)}
            onOrderCancel={(l) => handleCancelBook(l)}
          />
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} theme={theme} onSuccess={(s) => { setSession(s); setShowAuth(false); }} />}
        {showQuote && <QuoteModal onClose={() => setShowQuote(false)} theme={theme} />}
        {sharedPanels}
      </div>
    );
  }

  // ── Orders page ────────────────────────────────────────────────────────
  if (showOrders) {
    return (
      <div style={{ background: bgColor, minHeight: "100vh", color: textColor }}>
        {sharedStyle}
        {sharedHeader}
        <div style={{ paddingTop: 70 }}>
          <OrdersPage
            orders={bookedLoads}
            theme={theme}
            onBack={() => { setShowOrders(false); window.scrollTo({ top: 0 }); }}
            onBrowseLoads={() => { setShowOrders(false); setTimeout(() => scrollTo(catalogRef), 80); }}
            onCancel={(load) => { handleCancelBook(load); }}
            onDetails={(load) => { setShowOrders(false); setDetailLoad(load); window.scrollTo({ top: 0 }); }}
          />
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} theme={theme} onSuccess={(s) => { setSession(s); setShowAuth(false); }} />}
        {showQuote && <QuoteModal onClose={() => setShowQuote(false)} theme={theme} />}
        {sharedPanels}
        {notifications.map((msg, idx) => (
          <Notification key={idx} text={msg} onClose={() => setNotifications(n => n.filter((_, i) => i !== idx))} />
        ))}
      </div>
    );
  }

  // ── Main page ──────────────────────────────────────────────────────────
  return (
    <div style={{ background: bgColor, minHeight: "100vh", color: textColor, transition: "background 0.3s, color 0.3s" }}>
      {sharedStyle}
      {sharedHeader}
      <Hero onViewLoads={() => scrollTo(catalogRef)} onQuoteClick={() => setShowQuote(true)} />
      <Ticker />
      <TrustStrip theme={theme} />
      <div ref={aboutRef}>
        <AboutSection onContactClick={() => scrollTo(contactRef)} theme={theme} />
      </div>

      {/* ── WEEKLY BEST CAROUSEL ─────────────────────────────────────────── */}
      {!loading && (() => {
        const best = loads.filter(l => l.tag === "Best Load of the Week").slice(0, 6);
        if (!best.length) return null;
        const tw = translations[lang].weeklyBest;
        const visible = 3;
        const maxIdx = Math.max(0, best.length - visible);
        const canPrev = weeklyIdx > 0;
        const canNext = weeklyIdx < maxIdx;
        const needArrows = best.length > visible;
        // track width: e.g. 4 cards → 133.33%; each card → 25% of track = 33.33% of viewport
        const trackW = (best.length / visible) * 100;
        // one step = 1/best.length of track width
        const step = 100 / best.length;

        const arrowBase: React.CSSProperties = {
          position: "absolute", top: "50%", zIndex: 10,
          width: 52, height: 52, borderRadius: "50%", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
        };

        return (
          <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px clamp(20px,4vw,56px) 0" }}>
            <style>{`
              @keyframes weeklyGlow{0%,100%{box-shadow:0 0 20px rgba(204,0,0,0.25)}50%{box-shadow:0 0 40px rgba(204,0,0,0.55)}}
              @keyframes heartBeat{0%{transform:scale(1)}25%{transform:scale(1.4)}50%{transform:scale(1.1)}75%{transform:scale(1.25)}100%{transform:scale(1)}}
              @keyframes burstRing{0%{transform:translate(-50%,-50%) scale(0.3);opacity:1}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
              @keyframes particle{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
            `}</style>

            {/* Заголовок */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#CC0000,#ff4d4d)", display:"flex", alignItems:"center", justifyContent:"center", animation:"weeklyGlow 2s ease infinite", flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 256 256" fill="#fff"><path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"/></svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:4, textTransform:"uppercase", marginBottom:4 }}>★ {tw.badge}</div>
                <h2 style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:"clamp(26px,4vw,42px)", color:textColor, textTransform:"uppercase", lineHeight:1 }}>
                  {tw.title} <span style={{ color:"#CC0000" }}>{tw.titleHighlight}</span>
                </h2>
              </div>
            </div>

            {/* Карусель + стрелки по бокам */}
            <div style={{ position:"relative", padding: needArrows ? "0 68px" : "0" }}>

              {/* Левая стрелка */}
              {needArrows && (
                <button
                  onClick={() => canPrev && setWeeklyIdx(i => i - 1)}
                  style={{ ...arrowBase, left: 0, transform: "translateY(-50%)", cursor: canPrev ? "pointer" : "default",
                    background: canPrev ? "linear-gradient(135deg,#CC0000,#ff3333)" : "rgba(255,255,255,0.05)",
                    boxShadow: canPrev ? "0 8px 28px rgba(204,0,0,0.55), 0 0 0 1px rgba(204,0,0,0.25)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => { if (canPrev) { (e.currentTarget as HTMLElement).style.transform="translateY(-50%) scale(1.12)"; (e.currentTarget as HTMLElement).style.boxShadow="0 14px 40px rgba(204,0,0,0.75), 0 0 0 2px rgba(204,0,0,0.4)"; }}}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-50%) scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = canPrev ? "0 8px 28px rgba(204,0,0,0.55), 0 0 0 1px rgba(204,0,0,0.25)" : "inset 0 0 0 1px rgba(255,255,255,0.07)"; }}
                >
                  <svg width="22" height="22" viewBox="0 0 256 256" fill={canPrev ? "#fff" : "rgba(255,255,255,0.18)"}>
                    <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                  </svg>
                </button>
              )}

              {/* Правая стрелка */}
              {needArrows && (
                <button
                  onClick={() => canNext && setWeeklyIdx(i => i + 1)}
                  style={{ ...arrowBase, right: 0, transform: "translateY(-50%)", cursor: canNext ? "pointer" : "default",
                    background: canNext ? "linear-gradient(135deg,#CC0000,#ff3333)" : "rgba(255,255,255,0.05)",
                    boxShadow: canNext ? "0 8px 28px rgba(204,0,0,0.55), 0 0 0 1px rgba(204,0,0,0.25)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => { if (canNext) { (e.currentTarget as HTMLElement).style.transform="translateY(-50%) scale(1.12)"; (e.currentTarget as HTMLElement).style.boxShadow="0 14px 40px rgba(204,0,0,0.75), 0 0 0 2px rgba(204,0,0,0.4)"; }}}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-50%) scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = canNext ? "0 8px 28px rgba(204,0,0,0.55), 0 0 0 1px rgba(204,0,0,0.25)" : "inset 0 0 0 1px rgba(255,255,255,0.07)"; }}
                >
                  <svg width="22" height="22" viewBox="0 0 256 256" fill={canNext ? "#fff" : "rgba(255,255,255,0.18)"}>
                    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
                  </svg>
                </button>
              )}

              {/* Viewport */}
              <div style={{ overflow:"hidden" }}>
                {/* Track — явная ширина для точного translateX */}
                <div style={{
                  display: "flex",
                  width: `${trackW}%`,
                  transform: `translateX(-${weeklyIdx * step}%)`,
                  transition: "transform 0.48s cubic-bezier(0.25,0.46,0.45,0.94)",
                }}>
                  {best.map((l, i) => {
                    const isSaved = savedLoads.some(s => s.id === l.id);
                    const isBooked = bookedLoads.some(b => b.id === l.id);
                    return (
                      <div key={l.id} style={{ width:`${100 / best.length}%`, padding:"0 8px", boxSizing:"border-box" }}>
                        <div onClick={() => { setDetailLoad(l); window.scrollTo({ top:0, behavior:"smooth" }); }}
                          style={{ borderRadius:12, overflow:"hidden", cursor:"pointer", border:"1px solid rgba(204,0,0,0.35)", background:cardBg, animation:`weeklyGlow ${2+i*0.3}s ease infinite`, transition:"transform 0.25s, border-color 0.2s", position:"relative" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-6px)"; (e.currentTarget as HTMLElement).style.borderColor="#CC0000"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.borderColor="rgba(204,0,0,0.35)"; }}>

                          <div style={{ position:"absolute", top:10, left:10, zIndex:2, background:"linear-gradient(135deg,#CC0000,#ff4d4d)", borderRadius:20, padding:"4px 10px", display:"flex", alignItems:"center", gap:5, boxShadow:"0 4px 12px rgba(204,0,0,0.5)" }}>
                            <svg width="10" height="10" viewBox="0 0 256 256" fill="#fff"><path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"/></svg>
                            <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:8, color:"#fff", letterSpacing:1.5, textTransform:"uppercase" }}>{tw.cardBadge}</span>
                          </div>

                          <WeeklyHeartBtn saved={isSaved} onClick={() => handleSave(l, !isSaved)} />

                          <div style={{ position:"relative", height:210 }}>
                            <img src={l.image} alt={l.route} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 72%", filter: theme === 'dark' ? "brightness(0.6)" : "brightness(0.75)" }} />
                            <div style={{ position:"absolute", inset:0, background: theme === 'dark' ? "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.9))" : "linear-gradient(to bottom,transparent 25%,rgba(0,0,0,0.68))" }} />
                            <div style={{ position:"absolute", bottom:12, left:14 }}>
                              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:28, color:"#fff", lineHeight:1, textShadow:"0 2px 8px rgba(0,0,0,0.8)" }}>${l.price.toLocaleString()}</div>
                              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"rgba(255,255,255,0.55)", marginTop:2 }}>{l.miles.toLocaleString()} mi · {(l.price/l.miles).toFixed(2)}/mi</div>
                            </div>
                          </div>

                          <div style={{ padding:"12px 14px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, flexWrap:"wrap" }}>
                              <div style={{ width:7, height:7, borderRadius:"50%", border:"2px solid #CC0000", flexShrink:0 }} />
                              <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:textColor }}>{l.route}</span>
                              <span style={{ color:"#CC0000" }}>→</span>
                              <div style={{ width:7, height:7, borderRadius:"50%", background:"#CC0000", flexShrink:0 }} />
                              <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:textColor }}>{l.dest}</span>
                            </div>
                            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:theme==="dark"?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.45)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>{l.cargo}</div>
                            <div onClick={e => e.stopPropagation()}>
                              <button onClick={() => isBooked ? handleCancelBook(l) : handleBook(l)}
                                style={{ width:"100%", padding:"8px", background: isBooked ? "rgba(0,180,80,0.12)" : "#CC0000", border: isBooked ? "1px solid rgba(0,180,80,0.4)" : "none", borderRadius:6, color: isBooked ? "#00b450" : "#fff", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.opacity="0.85"; }}
                                onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}>
                                {isBooked ? tw.requested : tw.bookLoad}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Точки снизу */}
            {needArrows && (
              <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:18 }}>
                {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                  <div key={i} onClick={() => setWeeklyIdx(i)}
                    style={{ width: weeklyIdx === i ? 28 : 8, height:8, borderRadius:4, background: weeklyIdx === i ? "#CC0000" : "rgba(204,0,0,0.28)", cursor:"pointer", transition:"all 0.35s ease", boxShadow: weeklyIdx === i ? "0 0 10px rgba(204,0,0,0.5)" : "none" }} />
                ))}
              </div>
            )}

            <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(204,0,0,0.4),transparent)", margin:"40px 0 0" }} />
          </section>
        );
      })()}

      <section ref={catalogRef} style={{ maxWidth: 1240, margin: "0 auto", padding: "56px clamp(20px,4vw,56px) 80px" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>— Available Now</div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(34px,5.5vw,56px)", color: textColor, textTransform: "uppercase", lineHeight: 1 }}>
            THE BEST <span style={{ color: "#CC0000" }}>LOADS</span>{" "}
            <span style={{ color: "transparent", WebkitTextStroke: `1.5px ${theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}` } as React.CSSProperties}>OF THE WEEK</span>
          </h2>
        </div>

        <LoadListView
          loads={filtered}
          loading={loading}
          error={error}
          search={search}
          filter={filter}
          theme={theme}
          cardBg={cardBg}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onBook={(load?: Load) => handleBook(load)}
          onCancelBook={(load?: Load) => handleCancelBook(load)}
          onSave={(saved: boolean, load?: Load) => { if (load) handleSave(load, saved); }}
          onDetails={(load: Load) => { setDetailLoad(load); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          bookedIds={bookedLoads.map(l => l.id)}
          savedIds={savedLoads.map(l => l.id)}
        />
      </section>

      <div ref={contactRef}>
        <Footer theme={theme} onCatalogClick={() => scrollTo(catalogRef)} onAboutClick={() => scrollTo(aboutRef)} onQuoteClick={() => setShowQuote(true)} onContactClick={() => scrollTo(contactRef)} onCareersClick={() => { setShowCareers(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} theme={theme} onSuccess={(s) => { setSession(s); setShowAuth(false); }} />}
      {showQuote && <QuoteModal onClose={() => setShowQuote(false)} theme={theme} />}
      {showFavorites && <FavoritesPanel loads={savedLoads} theme={theme} onClose={() => setShowFavorites(false)} onDetails={(l) => { setShowFavorites(false); setDetailLoad(l); window.scrollTo({ top: 0 }); }} onRemove={(l) => { handleSave(l, false); notify(tn.removedFromFavorites); }} />}
      {showRequests && <RequestsPanel loads={bookedLoads} theme={theme} onClose={() => setShowRequests(false)} onDetails={(l) => { setShowRequests(false); setDetailLoad(l); window.scrollTo({ top: 0 }); }} onCancel={(l) => handleCancelBook(l)} />}
      {notifications.map((msg, idx) => (
        <Notification key={idx} text={msg} onClose={() => setNotifications(n => n.filter((_, i) => i !== idx))} />
      ))}
    </div>
  );
}

function App() {
  return <LanguageProvider><ThemeProvider><AppContent /></ThemeProvider></LanguageProvider>;
}

export default App;