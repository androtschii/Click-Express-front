import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider, useTheme } from "./theme";
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
import { Notification } from "./components/ui/Notification";
import { PhoneIcon } from "./components/ui/PhoneIcon";
import { LOADS } from "./utils/data";
import type { Load } from "./types/index";
import { filterLoads, fetchLoads } from "./services/loadService.ts";

// ── Панель избранного ─────────────────────────────────────────────────────
function FavoritesPanel({ loads, theme, onClose, onDetails, onRemove }: { loads: Load[]; theme: string; onClose: () => void; onDetails?: (l: Load) => void; onRemove?: (l: Load) => void }) {
  const isDark = theme === "dark";
  const bord = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(420px, 100vw)", background: isDark ? "#0f0f0f" : "#fff", borderLeft: "2px solid #CC0000", display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${bord}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Saved</div>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase" }}>FAVORITES <span style={{ color: "#CC0000" }}>({loads.length})</span></h3>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 36, height: 36, color: isDark ? "rgba(255,255,255,0.5)" : "#666", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {loads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", fontSize: 14 }}>No saved loads yet</p>
            </div>
          ) : loads.map(l => (
            <div key={l.id} onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }}
              style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${bord}`, borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = bord; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div style={{ position: "relative", height: 110 }}>
                <img src={l.image} alt={l.route} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.85))" }} />
                <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "3px 8px", fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 1, backdropFilter: "blur(4px)" }}>VIEW →</div>
                <div style={{ position: "absolute", bottom: 8, left: 12 }}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>${l.price.toLocaleString()} <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>/ {l.miles.toLocaleString()} mi</span></div>
                  <div style={{ display: "inline-block", background: "#CC0000", color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 7, letterSpacing: 2, textTransform: "uppercase", padding: "2px 8px", borderRadius: 2, marginTop: 2 }}>{l.type}</div>
                </div>
              </div>
              <div style={{ padding: "8px 12px 10px" }}>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: isDark ? "rgba(255,255,255,0.85)" : "#1a1a1a", marginBottom: 2 }}>{l.route} → {l.dest}</div>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{l.cargo}</div>
                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }} style={{ flex: 1, padding: "6px", background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 6, color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#CC0000"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(204,0,0,0.1)"; e.currentTarget.style.color = "#CC0000"; }}>
                    View Details →
                  </button>
                  <button onClick={() => onRemove && onRemove(l)} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${bord}`, borderRadius: 6, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", fontFamily: "'Barlow',sans-serif", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff4d6d"; e.currentTarget.style.color = "#ff4d6d"; e.currentTarget.style.background = "rgba(255,77,109,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = bord; e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    Unlike
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loads.length > 0 && (
          <div style={{ padding: "14px 24px", borderTop: `1px solid ${bord}`, display: "flex", alignItems: "center", gap: 8 }}>
            <PhoneIcon size={14} color="#CC0000" />
            <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>To book: </span>
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
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(480px, 100vw)", background: isDark ? "#0f0f0f" : "#fff", borderLeft: "2px solid #CC0000", display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.5)" }}>
        {/* Заголовок */}
        <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${bord}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Booked</div>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase" }}>REQUESTS <span style={{ color: "#CC0000" }}>({loads.length})</span></h3>
          </div>
          <button onClick={onClose} style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: "50%", width: 36, height: 36, color: "#CC0000", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Список */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {loads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", fontSize: 14 }}>No requests yet</p>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)", fontSize: 12, marginTop: 6 }}>Click BOOK LOAD on any card</p>
            </div>
          ) : loads.map((l, idx) => (
            <div key={`${l.id}-${idx}`}
              onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }}
              style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: "1px solid rgba(0,180,80,0.25)", borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,180,80,0.25)"; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div style={{ position: "relative", height: 120 }}>
                <img src={l.image} alt={l.route} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.9))" }} />
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
                  <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", borderRadius: 12, padding: "3px 8px", fontFamily: "'Barlow',sans-serif", fontSize: 9, letterSpacing: 1, backdropFilter: "blur(4px)" }}>VIEW →</div>
                  <div style={{ background: "rgba(0,180,80,0.9)", color: "#fff", borderRadius: 20, padding: "4px 12px", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1 }}>✓ REQUESTED</div>
                </div>
                <div style={{ position: "absolute", bottom: 8, left: 12 }}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", lineHeight: 1 }}>
                    ${l.price.toLocaleString()} <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>/ {l.miles.toLocaleString()} mi</span>
                  </div>
                  <div style={{ display: "inline-block", background: "#CC0000", color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 7, letterSpacing: 2, textTransform: "uppercase", padding: "2px 8px", borderRadius: 2, marginTop: 3 }}>{l.type}</div>
                </div>
              </div>
              <div style={{ padding: "10px 14px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", border: "2px solid #CC0000", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: isDark ? "rgba(255,255,255,0.9)" : "#1a1a1a" }}>{l.route}</span>
                  <span style={{ color: "#CC0000", fontSize: 10 }}>→</span>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#CC0000", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: isDark ? "rgba(255,255,255,0.9)" : "#1a1a1a" }}>{l.dest}</span>
                </div>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{l.cargo}</div>
                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }} style={{ flex: 1, padding: "6px", background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 6, color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#CC0000"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(204,0,0,0.1)"; e.currentTarget.style.color = "#CC0000"; }}>
                    View Details →
                  </button>
                  <button onClick={() => onCancel && onCancel(l)} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${bord}`, borderRadius: 6, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", fontFamily: "'Barlow',sans-serif", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#CC0000"; e.currentTarget.style.background = "rgba(204,0,0,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = bord; e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                    ✕ Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Футер */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`, textAlign: "center" }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>
            Our dispatcher will contact you shortly
          </div>
          <a href="tel:+17862026599" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: "#CC0000", textDecoration: "none" }}><PhoneIcon size={14} color="#CC0000" />+1 786-202-6599</a>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
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
    notify(saved ? "Saved to favorites" : "Removed from favorites");
  };

  const handleCancelBook = (load?: Load) => {
    if (load) setBookedLoads(prev => prev.filter(l => l.id !== load.id));
    notify("Request cancelled");
  };

  const handleBook = (load?: Load) => {
    if (load) setBookedLoads(prev => [...prev, load]);
    notify("Load added to requests");
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
      onCareersClick={() => { setDetailLoad(null); setShowCareers(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      onSavedClick={() => setShowFavorites(true)}
      onRequestsClick={() => setShowRequests(true)}
      onLoginClick={() => setShowAuth(true)}
      session={session}
      onLogout={() => { logout(); setSession(null); }}
      onLogoClick={() => { setDetailLoad(null); setShowCareers(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
    />
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
        {showFavorites && <FavoritesPanel loads={savedLoads} theme={theme} onClose={() => setShowFavorites(false)} onDetails={(l) => { setShowFavorites(false); setDetailLoad(l); window.scrollTo({ top: 0 }); }} onRemove={(l) => { handleSave(l, false); notify("Removed from favorites"); }} />}
        {showRequests && <RequestsPanel loads={bookedLoads} theme={theme} onClose={() => setShowRequests(false)} onDetails={(l) => { setShowRequests(false); setDetailLoad(l); window.scrollTo({ top: 0 }); }} onCancel={(l) => handleCancelBook(l)} />}
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

      {/* ── WEEKLY BEST ──────────────────────────────────────────────────── */}
      {!loading && (() => {
        const best = loads.filter(l => l.tag === "Best Load of the Week").slice(0, 4);
        if (!best.length) return null;
        return (
          <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px clamp(20px,4vw,56px) 0" }}>
            <style>{`
              @keyframes weeklyGlow { 0%,100%{box-shadow:0 0 20px rgba(204,0,0,0.25)} 50%{box-shadow:0 0 40px rgba(204,0,0,0.55)} }
              @keyframes starSpin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
            `}</style>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#CC0000,#ff4d4d)", display:"flex", alignItems:"center", justifyContent:"center", animation:"weeklyGlow 2s ease infinite", flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:4, textTransform:"uppercase", marginBottom:4 }}>★ Weekly Special</div>
                <h2 style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:"clamp(26px,4vw,42px)", color:textColor, textTransform:"uppercase", lineHeight:1 }}>
                  BEST LOAD <span style={{ color:"#CC0000" }}>OF THE WEEK</span>
                </h2>
              </div>
            </div>

            {/* Horizontal scroll cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
              {best.map((l, i) => {
                const isSaved = savedLoads.some(s => s.id === l.id);
                const isBooked = bookedLoads.some(b => b.id === l.id);
                return (
                <div key={l.id} onClick={() => { setDetailLoad(l); window.scrollTo({ top:0, behavior:"smooth" }); }}
                  style={{ borderRadius:12, overflow:"hidden", cursor:"pointer", border:"1px solid rgba(204,0,0,0.35)", background:cardBg, animation:`weeklyGlow ${2 + i * 0.3}s ease infinite`, transition:"transform 0.25s, box-shadow 0.25s", position:"relative" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-6px)"; (e.currentTarget as HTMLElement).style.border="1px solid #CC0000"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.border="1px solid rgba(204,0,0,0.35)"; }}
                >
                  <div style={{ position:"absolute", top:10, left:10, zIndex:2, background:"linear-gradient(135deg,#CC0000,#ff4d4d)", borderRadius:20, padding:"4px 10px", display:"flex", alignItems:"center", gap:5, boxShadow:"0 4px 12px rgba(204,0,0,0.5)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:8, color:"#fff", letterSpacing:1.5, textTransform:"uppercase" }}>Best of Week</span>
                  </div>
                  {/* Heart button */}
                  <div onClick={e => { e.stopPropagation(); handleSave(l, !isSaved); }} style={{ position:"absolute", top:10, right:10, zIndex:2, width:32, height:32, borderRadius:"50%", background: isSaved ? "rgba(204,0,0,0.85)" : "rgba(0,0,0,0.5)", border:`1px solid ${isSaved ? "#CC0000" : "rgba(255,255,255,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", backdropFilter:"blur(4px)", transition:"all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="scale(1.15)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="scale(1)"; }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? "#fff" : "none"} stroke={isSaved ? "none" : "#fff"} strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                  <div style={{ position:"relative", height:160 }}>
                    <img src={l.image} alt={l.route} style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.6)" }} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.9))" }} />
                    <div style={{ position:"absolute", bottom:12, left:14 }}>
                      <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:28, color:"#fff", lineHeight:1, textShadow:"0 2px 8px rgba(0,0,0,0.8)" }}>${l.price.toLocaleString()}</div>
                      <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"rgba(255,255,255,0.55)", marginTop:2 }}>{l.miles.toLocaleString()} miles · {(l.price/l.miles).toFixed(2)}/mi</div>
                    </div>
                  </div>
                  <div style={{ padding:"12px 14px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", border:"2px solid #CC0000" }} />
                      <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:textColor }}>{l.route}</span>
                      <span style={{ color:"#CC0000" }}>→</span>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:"#CC0000" }} />
                      <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:textColor }}>{l.dest}</span>
                    </div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:theme==="dark"?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.45)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>{l.cargo}</div>
                    {/* Book button */}
                    <div onClick={e => e.stopPropagation()}>
                      <button onClick={() => isBooked ? handleCancelBook(l) : handleBook(l)} style={{ width:"100%", padding:"7px", background: isBooked ? "rgba(0,180,80,0.12)" : "#CC0000", border: isBooked ? "1px solid rgba(0,180,80,0.4)" : "none", borderRadius:6, color: isBooked ? "#00b450" : "#fff", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.opacity="0.85"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}>
                        {isBooked ? "✓ REQUESTED" : "BOOK LOAD"}
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
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
      {showFavorites && <FavoritesPanel loads={savedLoads} theme={theme} onClose={() => setShowFavorites(false)} onDetails={(l) => { setShowFavorites(false); setDetailLoad(l); window.scrollTo({ top: 0 }); }} onRemove={(l) => { handleSave(l, false); notify("Removed from favorites"); }} />}
      {showRequests && <RequestsPanel loads={bookedLoads} theme={theme} onClose={() => setShowRequests(false)} onDetails={(l) => { setShowRequests(false); setDetailLoad(l); window.scrollTo({ top: 0 }); }} onCancel={(l) => handleCancelBook(l)} />}
      {notifications.map((msg, idx) => (
        <Notification key={idx} text={msg} onClose={() => setNotifications(n => n.filter((_, i) => i !== idx))} />
      ))}
    </div>
  );
}

function App() {
  return <ThemeProvider><AppContent /></ThemeProvider>;
}

export default App;