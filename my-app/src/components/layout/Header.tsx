import React, { useState, useEffect } from "react";
import { CELogo } from "../ui/Logo";
import type { Session } from "../../services/authService";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface HeaderProps {
  cartCount: number;
  savedCount?: number;
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
  onCatalogClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  onQuoteClick: () => void;
  onCareersClick?: () => void;
  onNewsClick?: () => void;
  onReviewsClick?: () => void;
  onFleetClick?: () => void;
  onSavedClick?: () => void;
  onRequestsClick?: () => void;
  onLoginClick?: () => void;
  session?: Session | null;
  onLogout?: () => void;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
  onOrdersClick?: () => void;
}

const NavLink: React.FC<{ children: React.ReactNode; onClick?: () => void; isLight?: boolean; compact?: boolean }> = ({ children, onClick, isLight, compact }) => {
  const [hov, setHov] = useState(false);
  return (
    <span onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        color: hov ? "#fff" : (isLight ? "rgba(20,20,20,0.7)" : "rgba(255,255,255,0.65)"),
        background: hov ? "#CC0000" : "transparent",
        fontSize: 11, fontFamily: "'Barlow', sans-serif", fontWeight: 700, letterSpacing: compact ? 0 : 0.8,
        textTransform: "uppercase", padding: compact ? "6px 5px" : "6px 8px", borderRadius: 4,
        transition: "all 0.15s", cursor: "pointer", whiteSpace: "nowrap", display: "inline-block"
      }}
    >{children}</span>
  );
};

const PhoneLink: React.FC<{ isLight?: boolean }> = ({ isLight }) => {
  const [hov, setHov] = useState(false);
  return (
    <a href="tel:+17862026599" title="+1 786-202-6599" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0, transition: "all 0.2s" }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: hov ? "linear-gradient(135deg,#CC0000,#ff4d4d)" : (isLight ? "rgba(204,0,0,0.12)" : "linear-gradient(135deg,rgba(204,0,0,0.3),rgba(204,0,0,0.1))"),
        border: `1px solid ${hov ? "#CC0000" : "rgba(204,0,0,0.4)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: hov ? "0 0 14px rgba(204,0,0,0.6)" : "none",
        transition: "all 0.2s", flexShrink: 0,
      }}>
        <svg width="15" height="15" viewBox="0 0 256 256" fill={hov ? "#fff" : "#CC0000"} style={{ transition: "fill 0.2s" }}>
          <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"/>
        </svg>
      </div>
    </a>
  );
};

export const Header: React.FC<HeaderProps> = ({
  cartCount, savedCount = 0, theme = 'dark', onThemeToggle,
  onCatalogClick, onAboutClick, onContactClick, onQuoteClick, onCareersClick, onNewsClick, onReviewsClick, onFleetClick, onSavedClick, onRequestsClick, onLoginClick,
  session, onLogout, onLogoClick, onProfileClick, onOrdersClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [reqHov, setReqHov] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSavedClick = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 600);
    if (onSavedClick) onSavedClick();
  };

  const isLight = theme === 'light';

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999, height: 70,
      background: isLight
        ? (scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)")
        : (scrolled ? "rgba(8,0,0,0.92)" : "linear-gradient(180deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.3) 100%)"),
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: isLight
        ? (scrolled ? "1px solid rgba(204,0,0,0.18)" : "1px solid rgba(204,0,0,0.1)")
        : (scrolled ? "1px solid rgba(204,0,0,0.3)" : "none"),
      boxShadow: isLight
        ? (scrolled ? "0 4px 24px rgba(0,0,0,0.1)" : "0 2px 12px rgba(0,0,0,0.06)")
        : "none",
      transition: "background 0.3s, border 0.3s, box-shadow 0.3s",
      display: "flex", alignItems: "center", padding: "0 16px", gap: 8,
    }}>
      {/* Red glow line at top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent 0%,#CC0000 30%,#ff3333 60%,#CC0000 80%,transparent 100%)", opacity: isLight ? 1 : (scrolled ? 1 : 0.6), transition: "opacity 0.3s" }} />
      {/* Subtle red glow under top line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16, background: "linear-gradient(180deg,rgba(204,0,0,0.18) 0%,transparent 100%)", pointerEvents: "none" }} />

      <style>{`
        @keyframes heartPulse { 0%{transform:scale(1)} 25%{transform:scale(1.4)} 50%{transform:scale(1.1)} 75%{transform:scale(1.25)} 100%{transform:scale(1)} }
        @keyframes ringOut { 0%{transform:translate(-50%,-50%) scale(0.3);opacity:1} 100%{transform:translate(-50%,-50%) scale(2.5);opacity:0} }
      `}</style>

      <div onClick={onLogoClick || (() => window.scrollTo({ top: 0, behavior: "smooth" }))} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
        <CELogo size={42} theme={theme} />
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 19, color: isLight ? "#1a1a1a" : "#fff", letterSpacing: 1, textTransform: "uppercase" }}>
            <span style={{ color: "#CC0000" }}>CLICK</span> EXPRESS
          </div>
          <div style={{ fontSize: 7.5, color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.3)", fontFamily: "'Barlow',sans-serif", letterSpacing: 2, textTransform: "uppercase", marginTop: 1 }}>
            Inc · Heavy Freight
          </div>
        </div>
      </div>

      <div style={{ width: 1, height: 30, background: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)", flexShrink: 0 }} />

      <nav style={{ display: "flex", gap: lang === 'ru' ? 0 : 2, flex: 1 }}>
        <NavLink onClick={onCatalogClick} isLight={isLight} compact={lang === 'ru'}>{t.nav.catalog}</NavLink>
        <NavLink onClick={onQuoteClick} isLight={isLight} compact={lang === 'ru'}>{t.nav.getQuote}</NavLink>
        <NavLink onClick={onAboutClick} isLight={isLight} compact={lang === 'ru'}>{t.nav.aboutUs}</NavLink>
        <NavLink onClick={onContactClick} isLight={isLight} compact={lang === 'ru'}>{t.nav.contact}</NavLink>
        <NavLink onClick={onCareersClick} isLight={isLight} compact={lang === 'ru'}>{t.nav.careers}</NavLink>
        <NavLink onClick={onNewsClick} isLight={isLight} compact={lang === 'ru'}>{t.nav.news}</NavLink>
        <NavLink onClick={onReviewsClick} isLight={isLight} compact={lang === 'ru'}>{t.nav.reviews}</NavLink>
        <NavLink onClick={onFleetClick} isLight={isLight} compact={lang === 'ru'}>{t.nav.fleet}</NavLink>
      </nav>

      <PhoneLink isLight={isLight} />

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

      <button
        onClick={toggleLang}
        style={{
          display: "flex", alignItems: "center", gap: 0,
          background: "transparent", border: `1px solid ${isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)"}`,
          borderRadius: 4, overflow: "hidden", cursor: "pointer", flexShrink: 0,
          padding: 0,
        }}
      >
        {(['en', 'ru'] as const).map(l => (
          <span key={l} style={{
            padding: "5px 9px",
            fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11,
            letterSpacing: 1, textTransform: "uppercase",
            background: lang === l ? "#CC0000" : "transparent",
            color: lang === l ? "#fff" : (isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)"),
            transition: "all 0.15s",
          }}>{l}</span>
        ))}
      </button>

      {savedCount > 0 && (
        <div onClick={handleSavedClick} style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #CC0000, #ff4d6d)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: heartBurst ? "0 0 24px rgba(204,0,0,0.8)" : "0 0 14px rgba(204,0,0,0.45)",
            animation: heartBurst ? "heartPulse 0.6s ease" : "none",
            transition: "box-shadow 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(204,0,0,0.9)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = heartBurst ? "0 0 24px rgba(204,0,0,0.8)" : "0 0 14px rgba(204,0,0,0.45)"; }}
          >
            {heartBurst && (
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 40, height: 40, borderRadius: "50%", border: "2px solid #ff4d6d", animation: "ringOut 0.5s ease-out forwards", pointerEvents: "none" }} />
            )}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#fff" style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,0.4))" }} />
            </svg>
          </div>
          <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow',sans-serif", fontWeight: 900, fontSize: 10, color: "#CC0000", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}>
            {savedCount}
          </div>
        </div>
      )}

      {session ? (
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div onClick={() => setUserMenuOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 10px 4px 4px", borderRadius: 24, border: "1px solid rgba(204,0,0,0.4)", background: "rgba(204,0,0,0.1)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(204,0,0,0.2)"; e.currentTarget.style.borderColor = "#CC0000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(204,0,0,0.1)"; e.currentTarget.style.borderColor = "rgba(204,0,0,0.4)"; }}>
            {session.avatar ? (
              <img src={session.avatar} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1px solid #CC0000" }} />
            ) : (
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#CC0000,#ff4d4d)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>
                {session.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, color: isLight ? "#1a1a1a" : "rgba(255,255,255,0.85)", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {session.name.split(" ")[0]}
            </span>
            <svg width="10" height="10" viewBox="0 0 256 256" fill={isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)"} style={{ transform: userMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
            </svg>
          </div>

          {userMenuOpen && (
            <div onClick={() => setUserMenuOpen(false)} style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 190, background: isLight ? "#fff" : "#0f0f0f", border: `1px solid ${isLight ? "rgba(204,0,0,0.2)" : "rgba(204,0,0,0.3)"}`, borderRadius: 10, overflow: "hidden", boxShadow: isLight ? "0 8px 40px rgba(0,0,0,0.15)" : "0 16px 40px rgba(0,0,0,0.7)", zIndex: 100 }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}` }}>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: isLight ? "#1a1a1a" : "#fff" }}>{session.name}</div>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.35)", marginTop: 2 }}>{session.email}</div>
              </div>
              <div style={{ padding: "6px 0" }}>
                {[
                  { label: t.header.myProfile, icon: "👤", onClick: onProfileClick },
                  { label: t.header.myOrders, icon: "📋", onClick: onOrdersClick },
                ].map(item => (
                  <div key={item.label} onClick={() => { setUserMenuOpen(false); item.onClick?.(); }} style={{ padding: "9px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontSize: 13, color: isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(204,0,0,0.08)"; e.currentTarget.style.color = "#CC0000"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)"; }}>
                    <span>{item.icon}</span>{item.label}
                  </div>
                ))}
                <div style={{ margin: "6px 0", height: 1, background: isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)" }} />
                <div onClick={onLogout} style={{ padding: "9px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#CC0000", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(204,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <span>🚪</span> {t.header.signOut}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button onClick={onLoginClick} style={{ background: "transparent", border: `1px solid ${isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"}`, borderRadius: 20, padding: "7px 18px", color: isLight ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.7)", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#CC0000"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"; e.currentTarget.style.color = isLight ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.7)"; }}>
          {t.header.login}
        </button>
      )}

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
        <svg width="14" height="14" viewBox="0 0 256 256" fill="#fff" style={{ flexShrink: 0 }}>
          <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/>
        </svg>
        {t.header.requests}
        {cartCount > 0 && (
          <span style={{ background: "#fff", color: "#CC0000", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
        )}
      </button>
    </header>
  );
};