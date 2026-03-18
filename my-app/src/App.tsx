import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider, useTheme } from "./theme";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Ticker } from "./components/Ticker";
import { TrustStrip } from "./components/TrustStrip";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";
import { QuoteModal } from "./components/QuoteModal";
import { LoadListView } from "./components/LoadList";
import { Notification } from "./components/Notification";
import { LOADS } from "./utils/data";
import type { Load } from "./types/index";
import { filterLoads, fetchLoads } from "./services/loadService.ts";

// ── Панель избранного ─────────────────────────────────────────────────────
function FavoritesPanel({ loads, theme, onClose }: { loads: Load[]; theme: string; onClose: () => void }) {
  const isDark = theme === "dark";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "min(420px, 100vw)",
          background: isDark ? "#0f0f0f" : "#fff",
          borderLeft: "2px solid #CC0000",
          display: "flex", flexDirection: "column",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Заголовок */}
        <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Saved</div>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase" }}>
              FAVORITES <span style={{ color: "#CC0000" }}>({loads.length})</span>
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 36, height: 36, color: isDark ? "rgba(255,255,255,0.5)" : "#666", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Список */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {loads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", fontSize: 14 }}>No saved loads yet</p>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)", fontSize: 12, marginTop: 6 }}>Click ♥ on any load to save it</p>
            </div>
          ) : (
            loads.map(l => (
              <div key={l.id} style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ position: "relative", height: 120 }}>
                  <img src={l.image} alt={l.route} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.85))" }} />
                  <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: "#fff" }}>
                      ${l.price.toLocaleString()}
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginLeft: 6 }}>/ {l.miles.toLocaleString()} mi</span>
                    </div>
                    <div style={{ display: "inline-block", background: "#CC0000", color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", padding: "2px 8px", borderRadius: 2, marginTop: 3 }}>{l.type}</div>
                  </div>
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: isDark ? "rgba(255,255,255,0.85)" : "#1a1a1a" }}>
                    {l.route} → {l.dest}
                  </div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{l.cargo}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Футер панели */}
        {loads.length > 0 && (
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}` }}>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", textAlign: "center" }}>
              📞 To book: <span style={{ color: "#CC0000", fontWeight: 700 }}>+1 786-202-6599</span>
            </div>
          </div>
        )}
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
  const [bookCount, setBookCount] = useState(0);
  const [savedLoads, setSavedLoads] = useState<Load[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
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
    setSavedLoads(prev =>
      saved ? [...prev, load] : prev.filter(l => l.id !== load.id)
    );
    notify(saved ? "Saved to favorites" : "Removed from favorites");
  };

  const notify = (text: string) => {
    setNotifications(n => [...n, text]);
  };

  const bgColor = theme === "dark" ? "#080808" : "#f5f5f5";
  const textColor = theme === "dark" ? "#fff" : "#1a1a1a";
  const cardBg = theme === "dark" ? "#0d0d0d" : "#ffffff";

  return (
    <div style={{ background: bgColor, minHeight: "100vh", color: textColor, transition: "background 0.3s, color 0.3s" }}>
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

      <Header
        cartCount={bookCount}
        savedCount={savedLoads.length}
        theme={theme}
        onThemeToggle={toggleTheme}
        onCatalogClick={() => scrollTo(catalogRef)}
        onAboutClick={() => scrollTo(aboutRef)}
        onContactClick={() => scrollTo(contactRef)}
        onQuoteClick={() => setShowQuote(true)}
        onSavedClick={() => setShowFavorites(true)}
      />
      <Hero onViewLoads={() => scrollTo(catalogRef)} onQuoteClick={() => setShowQuote(true)} />
      <Ticker />
      <TrustStrip theme={theme} />
      <div ref={aboutRef}>
        <AboutSection onContactClick={() => scrollTo(contactRef)} theme={theme} />
      </div>

      <section ref={catalogRef} style={{ maxWidth: 1240, margin: "0 auto", padding: "72px clamp(20px,4vw,56px) 80px" }}>
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
          onBook={() => { setBookCount(c => c + 1); notify("Load added to requests"); }}
          onSave={(saved: boolean, load?: Load) => {
            if (load) handleSave(load, saved);
          }}
        />
      </section>

      <div ref={contactRef}>
        <Footer theme={theme} onCatalogClick={() => scrollTo(catalogRef)} onAboutClick={() => scrollTo(aboutRef)} onQuoteClick={() => setShowQuote(true)} />
      </div>

      {showQuote && <QuoteModal onClose={() => setShowQuote(false)} theme={theme} />}
      {showFavorites && <FavoritesPanel loads={savedLoads} theme={theme} onClose={() => setShowFavorites(false)} />}
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