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

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Loads");
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [bookCount, setBookCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const catalogRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" } as ScrollIntoViewOptions);
  };

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setLoads(LOADS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(id);
  }, []);

  const filtered = loads.filter((l: Load) => {
    const q = search.toLowerCase();
    const matchSearch =
      l.route.toLowerCase().includes(q) ||
      l.dest.toLowerCase().includes(q) ||
      l.cargo.toLowerCase().includes(q);
    const matchFilter =
      filter === "All Loads" ||
      l.type === filter ||
      l.tag === filter;
    return matchSearch && matchFilter;
  });

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
        savedCount={savedCount}
        theme={theme}
        onThemeToggle={toggleTheme}
        onCatalogClick={() => scrollTo(catalogRef)}
        onAboutClick={() => scrollTo(aboutRef)}
        onContactClick={() => scrollTo(contactRef)}
        onQuoteClick={() => setShowQuote(true)}
      />

      <Hero
        onViewLoads={() => scrollTo(catalogRef)}
        onQuoteClick={() => setShowQuote(true)}
      />

      <Ticker />
      <TrustStrip theme={theme} />

      <div ref={aboutRef}>
        <AboutSection onContactClick={() => scrollTo(contactRef)} theme={theme} />
      </div>

      <section
        ref={catalogRef}
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "72px clamp(20px,4vw,56px) 80px",
        }}
      >
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 700,
              fontSize: 10,
              color: "#CC0000",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            — Available Now
          </div>
          <h2
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 700,
              fontSize: "clamp(34px,5.5vw,56px)",
              color: textColor,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            THE BEST <span style={{ color: "#CC0000" }}>LOADS</span>{" "}
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: `1.5px ${theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}`,
              } as React.CSSProperties}
            >
              OF THE WEEK
            </span>
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
          onBook={() => {
            setBookCount(c => c + 1);
            notify("Load added to requests");
          }}
          onSave={(saved: boolean) => {
            setSavedCount(c => c + (saved ? 1 : -1));
            notify(saved ? "Saved to favorites" : "Removed from favorites");
          }}
        />
      </section>

      <div ref={contactRef}>
        <Footer
          theme={theme}
          onCatalogClick={() => scrollTo(catalogRef)}
          onAboutClick={() => scrollTo(aboutRef)}
          onQuoteClick={() => setShowQuote(true)}
        />
      </div>

      {showQuote && <QuoteModal onClose={() => setShowQuote(false)} theme={theme} />}

      {notifications.map((msg, idx) => (
        <Notification
          key={idx}
          text={msg}
          onClose={() => setNotifications((n) => n.filter((_, i) => i !== idx))}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;