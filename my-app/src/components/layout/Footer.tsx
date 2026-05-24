import React, { useState } from "react";
import { CELogo } from "../ui/Logo";
import { PhoneIcon } from "../ui/PhoneIcon";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";
import { Truck, InstagramLogo, FacebookLogo, LinkedinLogo, TiktokLogo } from "@phosphor-icons/react";

interface FooterProps {
  theme?: "dark" | "light";
  onCatalogClick?: () => void;
  onAboutClick?: () => void;
  onQuoteClick?: () => void;
  onContactClick?: () => void;
  onCareersClick?: () => void;
  onFleetClick?: () => void;
  onFaqClick?: () => void;
  onPrivacyClick?: () => void;
  onPricingClick?: () => void;
  onDriverSignupClick?: () => void;
}

const FooterLink: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  isLight?: boolean;
}> = ({ children, onClick, href, target, isLight }) => {
  const [hov, setHov] = useState(false);
  const style: React.CSSProperties = {
    color: hov ? "#CC0000" : (isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.35)"),
    fontSize: 13,
    marginBottom: 10,
    fontFamily: "'Barlow',sans-serif",
    cursor: "pointer",
    transition: "color 0.15s",
    display: "block",
    textDecoration: "none",
  };
  if (href) {
    return (
      <a href={href} target={target} rel="noreferrer"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={style}>
        {children}
      </a>
    );
  }
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick} style={style}>
      {children}
    </div>
  );
};

const NewsletterStrip: React.FC<{ isLight: boolean; lang: string }> = ({ isLight, lang }) => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const border = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)";
  const text = isLight ? "#1a1a1a" : "#fff";
  const muted = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  };

  return (
    <div style={{ borderTop: `1px solid ${border}`, paddingTop: 28, marginBottom: 0, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" as const, justifyContent: "space-between" }}>
      <div>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16, color: text, marginBottom: 4 }}>
          {lang === "ru" ? "Будьте в курсе" : "Stay in the Loop"}
        </div>
        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: muted }}>
          {lang === "ru" ? "Новые грузы и новости индустрии" : "New loads, market insights, and freight news"}
        </div>
      </div>
      {done ? (
        <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: "#22c55e" }}>✓ {lang === "ru" ? "Подписка оформлена!" : "Subscribed!"}</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={lang === "ru" ? "Ваш email" : "your@email.com"}
            style={{ padding: "9px 14px", borderRadius: 5, border: `1px solid ${border}`, background: isLight ? "#f8f8f8" : "rgba(255,255,255,0.05)", color: text, fontFamily: "'Barlow',sans-serif", fontSize: 13, outline: "none", width: 200 }}
          />
          <button type="submit" style={{ padding: "9px 18px", background: "#CC0000", color: "#fff", border: "none", borderRadius: 5, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" as const, cursor: "pointer", whiteSpace: "nowrap" as const }}>
            {lang === "ru" ? "Подписаться" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
};

export const Footer: React.FC<FooterProps> = ({
  theme = "dark",
  onCatalogClick,
  onAboutClick,
  onQuoteClick,
  onContactClick,
  onCareersClick,
  onFleetClick,
  onFaqClick,
  onPrivacyClick,
  onPricingClick,
  onDriverSignupClick,
}) => {
  const { lang } = useLanguage();
  const t = translations[lang].footer;
  const isLight = theme === "light";
  const bg = isLight ? "#f5f5f5" : "#050505";
  const textColor = isLight ? "#1a1a1a" : "#fff";
  const mutedColor = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.33)";
  const subtleColor = isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.28)";
  const dividerColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)";
  const iconFill = isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.4)";

  const stats = [
    { value: "500+", label: lang === "ru" ? "Доставленных грузов" : "Loads Delivered" },
    { value: "48", label: lang === "ru" ? "Штатов США" : "States Covered" },
    { value: "24/7", label: lang === "ru" ? "Поддержка диспетчера" : "Dispatch Support" },
    { value: "5+", label: lang === "ru" ? "Лет на рынке" : "Years in Business" },
  ];

  return (
    <>
      <style>{`
        .footer-stats-grid { grid-template-columns: repeat(4,1fr); }
        .footer-main-grid { grid-template-columns: 2fr 1fr 1fr 1fr; gap: 44px; }
        @media (max-width: 900px) {
          .footer-main-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        }
        @media (max-width: 600px) {
          .footer-stats-grid { grid-template-columns: repeat(2,1fr); row-gap: 28px; }
          .footer-main-grid { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>
 {/* Stats strip — always red, bold */}
      <div style={{
        background: "linear-gradient(135deg,#CC0000 0%,#aa0000 40%,#880000 100%)",
        padding: "44px clamp(20px,5vw,64px)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: "3%", top: "50%", transform: "translateY(-50%)", opacity: 0.07, userSelect: "none", pointerEvents: "none", lineHeight: 1 }}><Truck size={130} weight="duotone" color="#CC0000" /></div>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 80px)", pointerEvents: "none" }} />
        <div className="footer-stats-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 24, position: "relative", zIndex: 1 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(32px,4vw,52px)", color: "#fff", lineHeight: 1, textShadow: "0 2px 20px rgba(0,0,0,0.25)" }}>{s.value}</div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 2, textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ background: bg, borderTop: "3px solid #CC0000", padding: "52px clamp(20px,5vw,64px) 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="footer-main-grid" style={{ display: "grid", marginBottom: 44 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
                <CELogo size={46} />
                <div>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 19, color: textColor, letterSpacing: 1, textTransform: "uppercase" }}>
                    <span style={{ color: "#CC0000" }}>CLICK</span> EXPRESS INC
                  </div>
                  <div style={{ fontSize: 8, color: subtleColor, letterSpacing: 2.5, fontFamily: "'Barlow',sans-serif" }}>
                    HEAVY FREIGHT SOLUTIONS
                  </div>
                </div>
              </div>
              <p style={{ color: mutedColor, fontSize: 13, lineHeight: 1.75, fontFamily: "'Barlow',sans-serif", maxWidth: 270 }}>
                {t.tagline}
              </p>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="tel:+17862026599" style={{ color: "#CC0000", fontSize: 13, fontFamily: "'Barlow',sans-serif", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 7 }}>
                  <PhoneIcon size={14} color="#CC0000" />
                  +1 786-202-6599
                </a>
                <a href="mailto:clickexpress.inc@gmail.com" style={{ color: mutedColor, fontSize: 12, fontFamily: "'Barlow',sans-serif", textDecoration: "none", display: "flex", alignItems: "center", gap: 7 }}>
                  <svg width="13" height="13" viewBox="0 0 256 256" fill={iconFill}>
                    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
                  </svg>
                  clickexpress.inc@gmail.com
                </a>
                <span style={{ color: subtleColor, fontSize: 12, fontFamily: "'Barlow',sans-serif", display: "flex", alignItems: "center", gap: 7 }}>
                  <svg width="12" height="12" viewBox="0 0 256 256" fill={subtleColor}>
                    <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
                  </svg>
                  Hallandale Beach, FL 33009
                </span>
              </div>
              <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                {[
                  { href: "https://www.instagram.com/clickexpress.official", Icon: InstagramLogo, label: "Instagram" },
                  { href: "https://www.facebook.com/clickexpress", Icon: FacebookLogo, label: "Facebook" },
                  { href: "https://www.linkedin.com/company/clickexpress", Icon: LinkedinLogo, label: "LinkedIn" },
                  { href: "https://www.tiktok.com/@clickexpress", Icon: TiktokLogo, label: "TikTok" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: mutedColor, textDecoration: "none", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.color = "#CC0000"; (e.currentTarget as HTMLElement).style.background = "rgba(204,0,0,0.08)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = mutedColor; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <s.Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, color: "#CC0000", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16 }}>
                {t.services}
              </div>
              {t.serviceItems.map((item, i) => (
                <FooterLink key={i} onClick={onCatalogClick} isLight={isLight}>{item}</FooterLink>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, color: "#CC0000", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16 }}>
                {t.company}
              </div>
              {[
                { label: t.companyItems[0], onClick: onAboutClick },
                { label: t.companyItems[1], onClick: onFleetClick },
                { label: t.companyItems[2], onClick: onAboutClick },
                { label: t.companyItems[3], onClick: onCareersClick },
                { label: t.companyItems[4], onClick: onContactClick },
              ].map((item, i) => (
                <FooterLink key={i} onClick={item.onClick} isLight={isLight}>{item.label}</FooterLink>
              ))}
 <FooterLink href="https://www.instagram.com/clickexpress.official" target="_blank" isLight={isLight}>
                {t.companyItems[5]}
              </FooterLink>
            </div>

            <div>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, color: "#CC0000", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16 }}>
                {t.quickLinks}
              </div>
              <FooterLink onClick={onCatalogClick} isLight={isLight}>{t.quickItems[0]}</FooterLink>
              <FooterLink onClick={onQuoteClick} isLight={isLight}>{t.quickItems[1]}</FooterLink>
 <FooterLink href="https://www.instagram.com/clickexpress.official" target="_blank" isLight={isLight}>
                {t.quickItems[2]}
              </FooterLink>
              <FooterLink onClick={onContactClick} isLight={isLight}>{t.quickItems[3]}</FooterLink>
              <FooterLink onClick={onPricingClick} isLight={isLight}>{lang === "ru" ? "Тарифы" : "Pricing"}</FooterLink>
              <FooterLink onClick={onDriverSignupClick} isLight={isLight}>{lang === "ru" ? "Водителям" : "Drive With Us"}</FooterLink>
              <FooterLink onClick={onFaqClick} isLight={isLight}>FAQ</FooterLink>
              <FooterLink onClick={onPrivacyClick} isLight={isLight}>{lang === "ru" ? "Конфиденциальность" : "Privacy Policy"}</FooterLink>
            </div>
          </div>

          <NewsletterStrip isLight={isLight} lang={lang} />

          <div style={{ borderTop: `1px solid ${dividerColor}`, paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 16 }}>
              {[
                { label: "FMCSA Registered", icon: "🛡️" },
                { label: "MC Licensed", icon: "✅" },
                { label: "DOT Compliant", icon: "⚖️" },
                { label: "Fully Insured", icon: "🔒" },
              ].map(b => (
                <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`, borderRadius: 20 }}>
                  <span style={{ fontSize: 11 }}>{b.icon}</span>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: subtleColor, letterSpacing: 0.8, textTransform: "uppercase" as const }}>{b.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 10 }}>
              <p style={{ color: subtleColor, fontSize: 12, fontFamily: "'Barlow',sans-serif" }}>
                {t.copyright}
              </p>
              <p style={{ color: isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)", fontSize: 11, fontFamily: "'Barlow',sans-serif" }}>
                React · UTM Lab
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
