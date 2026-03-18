import React, { useState, useEffect } from "react";
import { CELogo } from "./Logo";

interface HeaderProps {
  cartCount: number;
  savedCount?: number;
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
  onCatalogClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  onQuoteClick: () => void;
  onSavedClick?: () => void;
}

const NavLink: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        color: hov ? "#fff" : "rgba(255,255,255,0.65)",
        background: hov ? "rgba(204,0,0,0.14)" : "transparent",
        fontSize: 12, fontFamily: "'Barlow', sans-serif",
        fontWeight: 600, letterSpacing: 1.8,
        textTransform: "uppercase", padding: "6px 14px",
        borderRadius: 4, transition: "all 0.15s",
        cursor: "pointer", whiteSpace: "nowrap", display: "inline-block",
      }}
    >{children}</span>
  );
};

const PhoneLink: React.FC = () => {
  const [hov, setHov] = useState(false);
  return (
    <a href="tel:+17862026599"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        color: hov ? "#CC0000" : "rgba(255,255,255,0.5)",
        fontSize: 13, fontFamily: "'Barlow',sans-serif",
        fontWeight: 600, textDecoration: "none",
        flexShrink: 0, whiteSpace: "nowrap", transition: "color 0.15s",
      }}
    >📞 +1 786-202-6599</a>
  );
};

export const Header: React.FC<HeaderProps> = ({
  cartCount, savedCount = 0, theme = 'dark', onThemeToggle,
  onCatalogClick, onAboutClick, onContactClick, onQuoteClick, onSavedClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [reqHov, setReqHov] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      height: 70,
      background: scrolled ? "rgba(8,0,0,0.97)" : "linear-gradient(180deg,rgba(0,0,0,0.82) 0%,transparent 100%)",
      backdropFilter: scrolled ? "blur(18px)" : "none",
      borderBottom: scrolled ? "2px solid #CC0000" : "none",
      transition: "background 0.3s, border 0.3s",
      display: "flex", alignItems: "center",
      padding: "0 28px", gap: 24,
    }}>

      {/* Лого */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
      >
        <CELogo size={42} />
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 19, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>
            <span style={{ color: "#CC0000" }}>CLICK</span> EXPRESS
          </div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.38)", fontFamily: "'Barlow',sans-serif", letterSpacing: 2.5, textTransform: "uppercase", marginTop: 2 }}>
            Inc · Heavy Freight
          </div>
        </div>
      </div>

      <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

      {/* Навигация */}
      <nav style={{ display: "flex", gap: 2, flex: 1 }}>
        <NavLink onClick={onCatalogClick}>Catalog</NavLink>
        <NavLink onClick={onQuoteClick}>Get Quote</NavLink>
        <NavLink onClick={onAboutClick}>About Us</NavLink>
        <NavLink onClick={onContactClick}>Contact</NavLink>
      </nav>

      <PhoneLink />

      {/* Красивый переключатель темы */}
      {onThemeToggle && (
        <div
          onClick={onThemeToggle}
          style={{
            width: 56, height: 28,
            borderRadius: 14,
            background: theme === 'dark'
              ? "linear-gradient(135deg, #0d0d2b 0%, #1a1a4e 100%)"
              : "linear-gradient(135deg, #56CCF2 0%, #F7971E 100%)",
            border: `2px solid ${theme === 'dark' ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)"}`,
            cursor: "pointer",
            position: "relative",
            flexShrink: 0,
            transition: "all 0.4s ease",
            boxShadow: theme === 'dark'
              ? "0 0 10px rgba(80,80,200,0.4)"
              : "0 0 10px rgba(255,180,0,0.5)",
          }}
        >
          {/* Звёзды в тёмной теме */}
          {theme === 'dark' && (
            <>
              <div style={{ position: "absolute", top: 4, left: 8, width: 2, height: 2, borderRadius: "50%", background: "#fff", opacity: 0.8 }} />
              <div style={{ position: "absolute", top: 8, left: 14, width: 1.5, height: 1.5, borderRadius: "50%", background: "#fff", opacity: 0.6 }} />
              <div style={{ position: "absolute", top: 6, left: 20, width: 1, height: 1, borderRadius: "50%", background: "#fff", opacity: 0.7 }} />
            </>
          )}
          {/* Шарик (луна/солнце) */}
          <div style={{
            position: "absolute",
            top: 2,
            left: theme === 'dark' ? 2 : 26,
            width: 20, height: 20,
            borderRadius: "50%",
            background: theme === 'dark'
              ? "radial-gradient(circle at 35% 35%, #e8e8ff 0%, #9090c0 100%)"
              : "radial-gradient(circle at 35% 35%, #FFF176 0%, #FFB300 100%)",
            boxShadow: theme === 'dark'
              ? "0 0 6px rgba(180,180,255,0.9), inset -3px -2px 0 rgba(100,100,180,0.4)"
              : "0 0 10px rgba(255,200,0,0.9)",
            transition: "all 0.4s ease",
          }} />
        </div>
      )}

      {/* Счётчик сохранённых */}
      {savedCount > 0 && (
        <div
          onClick={onSavedClick}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(204,0,0,0.15)",
            border: "1px solid rgba(204,0,0,0.35)",
            borderRadius: 20, padding: "5px 12px",
            fontFamily: "'Barlow',sans-serif", fontWeight: 700,
            fontSize: 12, color: "#fff", flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <span style={{ color: "#CC0000", fontSize: 14 }}>♥</span>
          {savedCount}
        </div>
      )}

      {/* Кнопка Requests */}
      <button
        onMouseEnter={() => setReqHov(true)}
        onMouseLeave={() => setReqHov(false)}
        onClick={onCatalogClick}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: reqHov ? "#aa0000" : "#CC0000",
          color: "#fff", border: "none", borderRadius: 5,
          padding: "10px 20px", fontFamily: "'Barlow',sans-serif",
          fontWeight: 800, fontSize: 12, letterSpacing: 1.5,
          textTransform: "uppercase", cursor: "pointer",
          flexShrink: 0, whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(204,0,0,0.4)",
          transform: reqHov ? "translateY(-1px)" : "none",
          transition: "all 0.15s",
        }}
      >
        📋 Requests
        {cartCount > 0 && (
          <span style={{
            background: "#fff", color: "#CC0000", borderRadius: "50%",
            width: 18, height: 18, fontSize: 10, fontWeight: 900,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>{cartCount}</span>
        )}
      </button>
    </header>
  );
};