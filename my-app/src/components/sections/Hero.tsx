import React, { useState, useContext } from "react";
import { ThemeContext } from "../../theme";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface HeroBtnProps {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}

export const HeroBtn: React.FC<HeroBtnProps> = ({ children, primary, onClick }) => {
  const [hov, setHov] = useState(false);
  const ctx = useContext(ThemeContext) as { theme?: 'dark' | 'light' };
  const btnTheme = ctx.theme || 'dark';
  const isLight = btnTheme === 'light';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: primary ? (hov ? "#aa0000" : "#CC0000") : "transparent",
        color: primary ? "#fff" : hov ? "#CC0000" : isLight ? "#1a1a1a" : "#fff",
        border: primary ? "none" : `1px solid ${hov ? "#CC0000" : isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.22)"}`,
        borderRadius: 4,
        padding: "16px 36px",
        fontFamily: "'Oswald',sans-serif",
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: 2,
        textTransform: "uppercase",
        cursor: "pointer",
        boxShadow: primary ? "0 6px 28px rgba(204,0,0,0.45)" : "none",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "all 0.18s",
      }}
    >
      {children}
    </button>
  );
};

interface HeroProps {
  onViewLoads?: () => void;
  onQuoteClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewLoads, onQuoteClick }) => {
  const context = useContext(ThemeContext) as { theme?: 'dark' | 'light'; toggleTheme?: () => void };
  const theme = context.theme || 'dark';
  const { lang } = useLanguage();
  const t = translations[lang].hero;
  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        background: theme === 'light' ? '#f4f4f4' : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: theme === 'dark'
            ? "url(/images/red%20freightliner%20cascadia%202026%20night.png)"
            : "url(/images/red%20freightliner%20cascadia%202026.PNG)",
          backgroundSize: "cover",
          backgroundPosition: "center 50%",
        }}
      />
      {/* Red accent on right side (light theme only) */}
      {theme === 'light' && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(204,0,0,0.18) 0%, rgba(204,0,0,0.06) 40%, transparent 65%)" }} />
      )}
      {/* Bottom red glow strip (light theme) */}
      {theme === 'light' && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to top, rgba(204,0,0,0.07) 0%, transparent 100%)" }} />
      )}
      <div
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "#CC0000" }}
      />
      <div
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#CC0000" }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "120px 64px 80px",
          maxWidth: 800,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid rgba(204,0,0,0.45)",
            borderRadius: 3,
            padding: "5px 16px",
            marginBottom: 28,
            background: "rgba(204,0,0,0.08)",
            animation: "heroSlideIn 0.6s ease 0.1s both",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#CC0000",
              animation: "pulse 1.5s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 700,
              fontSize: 10,
              color: "#CC0000",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {t.badge}
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(52px,8vw,100px)",
            color: theme === 'dark' ? "#fff" : "#000",
            lineHeight: 0.9,
            margin: "0 0 8px",
            textTransform: "uppercase",
            animation: "heroFadeUp 0.6s ease 0.2s both",
          }}
        >
          {t.line1}
        </h1>
        <h1
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(52px,8vw,100px)",
            color: theme === 'dark' ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.82)",
            lineHeight: 0.9,
            margin: "0 0 8px",
            textTransform: "uppercase",
            animation: "heroFadeUp 0.6s ease 0.35s both",
            textShadow: theme === 'dark' ? "0 2px 16px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7)" : "0 2px 12px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.7)",
          }}
        >
          {t.line2}
        </h1>
        <h1
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(52px,8vw,100px)",
            color: "#CC0000",
            lineHeight: 0.9,
            margin: "0 0 32px",
            textTransform: "uppercase",
            animation: "heroFadeUp 0.6s ease 0.5s both",
          }}
        >
          {t.line3}
        </h1>

        <p
          style={{
            fontFamily: "'Barlow',sans-serif",
            fontSize: 16,
            color: theme === 'dark' ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)",
            lineHeight: 1.8,
            maxWidth: 500,
            marginBottom: 40,
            animation: "heroFadeUp 0.6s ease 0.65s both",
            textShadow: theme === 'dark' ? "0 1px 8px rgba(0,0,0,0.95), 0 2px 24px rgba(0,0,0,0.8)" : "0 1px 6px rgba(255,255,255,0.95), 0 2px 16px rgba(255,255,255,0.8)",
          }}
        >
          {t.desc}
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "heroFadeUp 0.6s ease 0.8s both" }}>
          <HeroBtn primary onClick={onViewLoads}>
            {t.viewLoads}
          </HeroBtn>
          <HeroBtn onClick={onQuoteClick}>{t.getQuote}</HeroBtn>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}} @keyframes heroFadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } } @keyframes heroSlideIn { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </section>
  );
};

