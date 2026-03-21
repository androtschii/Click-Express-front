import React, { useState, useEffect } from "react";
import { CELogo } from "./Logo";
import type { Session } from "../services/authService";

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
  onRequestsClick?: () => void;
  onLoginClick?: () => void;
  session?: Session | null;
  onLogout?: () => void;
  onLogoClick?: () => void;
}

const NavLink: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <span onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ color: hov ? "#fff" : "rgba(255,255,255,0.65)", background: hov ? "rgba(204,0,0,0.14)" : "transparent", fontSize: 12, fontFamily: "'Barlow', sans-serif", fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", padding: "6px 14px", borderRadius: 4, transition: "all 0.15s", cursor: "pointer", whiteSpace: "nowrap", display: "inline-block" }}
    >{children}</span>
  );
};

const PhoneLink: React.FC = () => {
  const [hov, setHov] = useState(false);
  return (
    <a href="tel:+17862026599" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap", transition: "all 0.2s" }}
    >
      {/* Красивая иконка телефона */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: hov
          ? "linear-gradient(135deg, #CC0000, #ff4d4d)"
          : "linear-gradient(135deg, rgba(204,0,0,0.3), rgba(204,0,0,0.1))",
        border: `1px solid ${hov ? "#CC0000" : "rgba(204,0,0,0.4)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: hov ? "0 0 12px rgba(204,0,0,0.5)" : "none",
        transition: "all 0.2s", flexShrink: 0,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
            fill={hov ? "#fff" : "#CC0000"} style={{ transition: "fill 0.2s" }} />
        </svg>
      </div>
      <span style={{ color: hov ? "#fff" : "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "'Barlow',sans-serif", fontWeight: 600, transition: "color 0.2s" }}>
        +1 786-202-6599
      </span>
    </a>
  );
};

export const Header: React.FC<HeaderProps> = ({
  cartCount, savedCount = 0, theme = 'dark', onThemeToggle,
  onCatalogClick, onAboutClick, onContactClick, onQuoteClick, onSavedClick, onRequestsClick, onLoginClick,
  session, onLogout, onLogoClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [reqHov, setReqHov] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSavedClick = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 600);
    onSavedClick && onSavedClick();
  };

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999, height: 70,
      background: scrolled ? "rgba(8,0,0,0.38)" : "linear-gradient(180deg,rgba(0,0,0,0.32) 0%,transparent 100%)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: scrolled ? "1px solid rgba(204,0,0,0.3)" : "none",
      transition: "background 0.3s, border 0.3s",
      display: "flex", alignItems: "center", padding: "0 28px", gap: 24,
    }}>
      <style>{`
        @keyframes heartPulse { 0%{transform:scale(1)} 25%{transform:scale(1.4)} 50%{transform:scale(1.1)} 75%{transform:scale(1.25)} 100%{transform:scale(1)} }
        @keyframes ringOut { 0%{transform:translate(-50%,-50%) scale(0.3);opacity:1} 100%{transform:translate(-50%,-50%) scale(2.5);opacity:0} }
      `}</style>

      {/* Лого */}
      <div onClick={onLogoClick || (() => window.scrollTo({ top: 0, behavior: "smooth" }))} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
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

      <nav style={{ display: "flex", gap: 2, flex: 1 }}>
        <NavLink onClick={onCatalogClick}>Catalog</NavLink>
        <NavLink onClick={onQuoteClick}>Get Quote</NavLink>
        <NavLink onClick={onAboutClick}>About Us</NavLink>
        <NavLink onClick={onContactClick}>Contact</NavLink>
      </nav>

      <PhoneLink />

      {/* Переключатель темы */}
      {onThemeToggle && (
        <div onClick={onThemeToggle} style={{
          width: 56, height: 28, borderRadius: 14,
          background: theme === 'dark' ? "linear-gradient(135deg, #0d0d2b 0%, #1a1a4e 100%)" : "linear-gradient(135deg, #56CCF2 0%, #F7971E 100%)",
          border: `2px solid ${theme === 'dark' ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)"}`,
          cursor: "pointer", position: "relative", flexShrink: 0, transition: "all 0.4s ease",
          boxShadow: theme === 'dark' ? "0 0 10px rgba(80,80,200,0.4)" : "0 0 10px rgba(255,180,0,0.5)",
        }}>
          {theme === 'dark' && (<>
            <div style={{ position: "absolute", top: 4, left: 8, width: 2, height: 2, borderRadius: "50%", background: "#fff", opacity: 0.8 }} />
            <div style={{ position: "absolute", top: 8, left: 14, width: 1.5, height: 1.5, borderRadius: "50%", background: "#fff", opacity: 0.6 }} />
            <div style={{ position: "absolute", top: 6, left: 20, width: 1, height: 1, borderRadius: "50%", background: "#fff", opacity: 0.7 }} />
          </>)}
          <div style={{
            position: "absolute", top: 2, left: theme === 'dark' ? 2 : 26, width: 20, height: 20, borderRadius: "50%",
            background: theme === 'dark' ? "radial-gradient(circle at 35% 35%, #e8e8ff 0%, #9090c0 100%)" : "radial-gradient(circle at 35% 35%, #FFF176 0%, #FFB300 100%)",
            boxShadow: theme === 'dark' ? "0 0 6px rgba(180,180,255,0.9), inset -3px -2px 0 rgba(100,100,180,0.4)" : "0 0 10px rgba(255,200,0,0.9)",
            transition: "all 0.4s ease",
          }} />
        </div>
      )}

      {/* Красивое сердечко с анимацией */}
      {savedCount > 0 && (
        <div onClick={handleSavedClick} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "linear-gradient(135deg, rgba(204,0,0,0.2), rgba(255,77,109,0.15))",
          border: "1px solid rgba(204,0,0,0.45)",
          borderRadius: 20, padding: "5px 14px 5px 8px",
          cursor: "pointer", flexShrink: 0, position: "relative",
          boxShadow: "0 0 12px rgba(204,0,0,0.2)",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(204,0,0,0.5)"; e.currentTarget.style.background = "linear-gradient(135deg, rgba(204,0,0,0.35), rgba(255,77,109,0.25))"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 12px rgba(204,0,0,0.2)"; e.currentTarget.style.background = "linear-gradient(135deg, rgba(204,0,0,0.2), rgba(255,77,109,0.15))"; }}
        >
          {/* Кольцо взрыва */}
          {heartBurst && (
            <div style={{ position: "absolute", left: "18px", top: "50%", width: 28, height: 28, borderRadius: "50%", border: "2px solid #ff4d6d", animation: "ringOut 0.5s ease-out forwards", pointerEvents: "none" }} />
          )}
          {/* SVG сердечко */}
          <div style={{ animation: heartBurst ? "heartPulse 0.6s ease" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff4d6d"/>
                  <stop offset="100%" stopColor="#CC0000"/>
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="url(#hg)" style={{ filter: "drop-shadow(0 0 4px rgba(255,77,109,0.8))" }} />
            </svg>
          </div>
          <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 13, color: "#fff" }}>{savedCount}</span>
        </div>
      )}

      {/* Login / User avatar */}
      {session ? (
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div onClick={() => setUserMenuOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 10px 4px 4px", borderRadius: 24, border: "1px solid rgba(204,0,0,0.4)", background: "rgba(204,0,0,0.1)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(204,0,0,0.2)"; e.currentTarget.style.borderColor = "#CC0000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(204,0,0,0.1)"; e.currentTarget.style.borderColor = "rgba(204,0,0,0.4)"; }}>
            {/* Avatar circle */}
            {session.avatar ? (
              <img src={session.avatar} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1px solid #CC0000" }} />
            ) : (
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#CC0000,#ff4d4d)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>
                {session.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, color: "rgba(255,255,255,0.85)", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {session.name.split(" ")[0]}
            </span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)" style={{ transform: userMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>

          {/* Dropdown */}
          {userMenuOpen && (
            <div onClick={() => setUserMenuOpen(false)} style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 180, background: "#0f0f0f", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 10, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.7)", zIndex: 100 }}>
              <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>{session.name}</div>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{session.email}</div>
              </div>
              <div style={{ padding: "6px 0" }}>
                {[{ label: "My Profile", icon: "👤" }, { label: "My Orders", icon: "📋" }].map(item => (
                  <div key={item.label} style={{ padding: "9px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(204,0,0,0.1)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                    <span>{item.icon}</span>{item.label}
                  </div>
                ))}
                <div style={{ margin: "6px 0", height: 1, background: "rgba(255,255,255,0.07)" }} />
                <div onClick={onLogout} style={{ padding: "9px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#ff6b6b", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(204,0,0,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <span>🚪</span> Sign Out
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button onClick={onLoginClick} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "7px 18px", color: "rgba(255,255,255,0.7)", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
          LOGIN
        </button>
      )}

      {/* Кнопка Requests */}
      <button
        onMouseEnter={() => setReqHov(true)}
        onMouseLeave={() => setReqHov(false)}
        onClick={onRequestsClick || onCatalogClick}
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" fill="#fff"/>
        </svg>
        Requests
        {cartCount > 0 && (
          <span style={{ background: "#fff", color: "#CC0000", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
        )}
      </button>
    </header>
  );
};