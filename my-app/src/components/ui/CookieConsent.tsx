import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

const STORAGE_KEY = "ce_cookie_consent";

interface CookieConsentProps {
  theme?: "dark" | "light";
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ theme = "dark" }) => {
  const [visible, setVisible] = useState(false);
  const { lang } = useLanguage();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem(STORAGE_KEY, "accepted"); setVisible(false); };
  const decline = () => { localStorage.setItem(STORAGE_KEY, "declined"); setVisible(false); };

  if (!visible) return null;

  const text = lang === "ru"
    ? "Мы используем cookies для улучшения работы сайта. Продолжая использование, вы соглашаетесь с нашей политикой конфиденциальности."
    : "We use cookies to improve your experience. By continuing to use the site, you agree to our privacy policy.";

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 3000,
      background: isDark ? "rgba(8,8,8,0.97)" : "rgba(255,255,255,0.97)",
      borderTop: "3px solid #CC0000",
      backdropFilter: "blur(12px)",
      padding: "16px clamp(16px,5vw,48px)",
      display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
      boxShadow: "0 -8px 32px rgba(0,0,0,0.3)",
    }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)", lineHeight: 1.6 }}>
          🍪 {text}
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button onClick={decline} style={{
          padding: "8px 18px", border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
          borderRadius: 4, background: "transparent", cursor: "pointer",
          fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: 0.5,
          color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#CC0000"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"; e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"; }}>
          {lang === "ru" ? "Отклонить" : "Decline"}
        </button>
        <button onClick={accept} style={{
          padding: "8px 22px", border: "none", borderRadius: 4,
          background: "#CC0000", cursor: "pointer",
          fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 0.5,
          color: "#fff", transition: "background 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#aa0000"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#CC0000"; }}>
          {lang === "ru" ? "Принять" : "Accept"}
        </button>
      </div>
    </div>
  );
};
