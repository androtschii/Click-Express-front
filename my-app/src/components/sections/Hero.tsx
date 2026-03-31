import React, { useState, useContext, useEffect } from "react";
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
  const isDark = theme === 'dark';

  const [counts, setCounts] = useState({ loads: 0, states: 0, miles: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const targets = { loads: 500, states: 48, miles: 2 };
    const steps = 55;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const p = 1 - Math.pow(1 - step / steps, 3);
      setCounts({ loads: Math.round(targets.loads * p), states: Math.round(targets.states * p), miles: Math.round(targets.miles * p * 10) / 10 });
      if (step >= steps) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallaxShift = scrollY * 0.3;

  return (
    <section style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", background: isDark ? '#0a0a0a' : '#f4f4f4' }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes heroFadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes heroSlideIn{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes scrollBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
        @keyframes heroPulseRing{0%{transform:scale(0.85);opacity:0.6}100%{transform:scale(1.6);opacity:0}}
        @keyframes statReveal{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* BG image with parallax */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: isDark ? "url(/images/red%20freightliner%20cascadia%202026%20night.png)" : "url(/images/red%20freightliner%20cascadia%202026.PNG)", backgroundSize: "cover", backgroundPosition: `center calc(50% + ${parallaxShift}px)`, transition: "background-position 0.05s linear" }} />

      {/* Dot grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: isDark ? "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)" : "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, background: isDark ? "radial-gradient(ellipse at 30% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)" : "radial-gradient(ellipse at 30% 50%, transparent 25%, rgba(244,240,232,0.55) 100%)", pointerEvents: "none" }} />

      {/* Light theme accents */}
      {!isDark && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(204,0,0,0.18) 0%, rgba(204,0,0,0.06) 40%, transparent 65%)", pointerEvents: "none" }} />}

      {/* Left red bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "linear-gradient(to bottom, #CC0000, #880000)" }} />
      {/* Bottom red line */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #CC0000 0%, #ff3333 40%, #CC0000 100%)" }} />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 2, padding: "120px clamp(24px,5vw,64px) 160px", maxWidth: 860, width: "100%" }}>

        {/* Live badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(204,0,0,0.45)", padding: "6px 16px", marginBottom: 32, background: "rgba(204,0,0,0.08)", animation: "heroSlideIn 0.6s ease 0.1s both", position: "relative" }}>
          <div style={{ position: "relative", width: 8, height: 8 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#CC0000", animation: "heroPulseRing 1.4s ease-out infinite" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#CC0000" }} />
          </div>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase" }}>{t.badge}</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(48px,7.5vw,96px)", color: isDark ? "#fff" : "#0d0d0d", lineHeight: 1.05, margin: "0 0 4px", textTransform: "uppercase", animation: "heroFadeUp 0.6s ease 0.2s both", letterSpacing: -1, whiteSpace: "nowrap" }}>{t.line1}</h1>
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(48px,7.5vw,96px)", color: isDark ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.78)", lineHeight: 1.05, margin: "0 0 4px", textTransform: "uppercase", animation: "heroFadeUp 0.6s ease 0.32s both", letterSpacing: -1, whiteSpace: "nowrap", textShadow: isDark ? "0 2px 20px rgba(0,0,0,0.95)" : "0 2px 14px rgba(255,255,255,0.9)" }}>{t.line2}</h1>
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(48px,7.5vw,96px)", color: "#CC0000", lineHeight: 1.05, margin: "0 0 36px", textTransform: "uppercase", animation: "heroFadeUp 0.6s ease 0.44s both", letterSpacing: -1, whiteSpace: "nowrap" }}>{t.line3}</h1>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.84)", lineHeight: 1.85, maxWidth: 480, marginBottom: 44, animation: "heroFadeUp 0.6s ease 0.58s both", textShadow: isDark ? "0 1px 8px rgba(0,0,0,0.95)" : "0 1px 6px rgba(255,255,255,0.9)" }}>{t.desc}</p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "heroFadeUp 0.6s ease 0.72s both" }}>
          <HeroBtn primary onClick={onViewLoads}>{t.viewLoads}</HeroBtn>
          <HeroBtn onClick={onQuoteClick}>{t.getQuote}</HeroBtn>
        </div>

        {/* Animated stats row */}
        <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap", animation: "statReveal 0.7s ease 1.1s both" }}>
          {[
            { val: `${counts.loads}+`, label: lang === 'ru' ? 'Грузов доставлено' : 'Loads Delivered' },
            { val: counts.states, label: lang === 'ru' ? 'Штатов покрыто' : 'States Covered' },
            { val: '24/7', label: lang === 'ru' ? 'Поддержка' : 'Dispatch Support' },
            { val: `${counts.miles}M+`, label: lang === 'ru' ? 'Миль пройдено' : 'Miles Hauled' },
          ].map(({ val, label }, i) => (
            <div key={i} style={{ position: "relative" }}>
              {i > 0 && <div style={{ position: "absolute", left: -20, top: "10%", bottom: "10%", width: 1, background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)" }} />}
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(28px,4vw,40px)", color: "#CC0000", lineHeight: 1, textShadow: "0 0 20px rgba(204,0,0,0.4)" }}>{val}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, animation: "heroFadeUp 0.6s ease 1.4s both", opacity: scrollY > 60 ? 0 : 1, transition: "opacity 0.3s", pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 8, letterSpacing: 4, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", textTransform: "uppercase" }}>{lang === 'ru' ? 'СКРОЛЛ' : 'SCROLL'}</span>
        <div style={{ width: 22, height: 36, border: `2px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`, borderRadius: 11, display: "flex", justifyContent: "center", paddingTop: 6 }}>
          <div style={{ width: 3, height: 8, borderRadius: 2, background: "#CC0000", animation: "scrollBounce 1.6s ease infinite" }} />
        </div>
      </div>
    </section>
  );
};

