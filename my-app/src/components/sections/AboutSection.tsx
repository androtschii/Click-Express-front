import React from "react";
import { CELogo } from "../ui/Logo";
import { Phone, Mail } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface AboutSectionProps {
  onContactClick?: () => void;
  theme?: 'dark' | 'light';
}

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <defs>
      <radialGradient id="ig1" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497"/>
        <stop offset="5%" stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#ig1)"/>
    <circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="1.8" fill="none"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const MapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#CC0000"/>
    <circle cx="12" cy="9" r="2.5" fill="#fff"/>
  </svg>
);

const contactsBase = [
  { icon: <MapIcon />, iconBg: "rgba(204,0,0,0.15)", key: "Address" as const, value: "Hallandale Beach, FL, United States, 33009", href: "https://maps.google.com/?q=Hallandale+Beach+FL+33009", highlight: false },
  { icon: <Phone size={20} color="#22C55E" strokeWidth={2} />, iconBg: "rgba(34,197,94,0.15)", key: "Phone" as const, value: "+1 786-202-6599", href: "tel:+17862026599", highlight: true },
  { icon: <Mail size={20} color="#60A5FA" strokeWidth={2} />, iconBg: "rgba(96,165,250,0.15)", key: "Email" as const, value: "clickexpress.inc@gmail.com", href: "mailto:clickexpress.inc@gmail.com", highlight: false },
  { icon: <LinkedInIcon />, iconBg: "rgba(10,102,194,0.15)", key: "LinkedIn" as const, value: "Click Express Inc", href: "https://www.linkedin.com/company/clickexpressinc", highlight: false },
  { icon: <FacebookIcon />, iconBg: "rgba(24,119,242,0.15)", key: "Facebook" as const, value: "Click Express Inc", href: "https://www.facebook.com/share/1FP9dJ2L4i/", highlight: false },
  { icon: <InstagramIcon />, iconBg: "rgba(214,36,159,0.15)", key: "Instagram" as const, value: "@clickexpress.official", href: "https://www.instagram.com/clickexpress.official", highlight: false },
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const { lang } = useLanguage();
  const t = translations[lang].about;

  return (
    <section style={{ background: isDark ? "#0a0a0a" : "#ffffff", padding: "80px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ marginBottom: 60, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>
              {t.who}
            </div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(32px,5vw,54px)", color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase", lineHeight: 1 }}>
              {t.title} <span style={{ color: "#CC0000" }}>{t.titleHighlight}</span> {t.titleEnd}
            </h2>
          </div>
          <button onClick={onContactClick} style={{ background: "#CC0000", color: "#fff", border: "none", borderRadius: 4, padding: "12px 28px", fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 18px rgba(204,0,0,0.4)" }}>
            {t.getInTouch}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
              <div style={{ width: 110, height: 110, borderRadius: "50%", border: "3px solid #CC0000", padding: 6, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(204,0,0,0.3)", flexShrink: 0 }}>
                <CELogo size={98} />
              </div>
              <div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: isDark ? "#fff" : "#1a1a1a", letterSpacing: 1, textTransform: "uppercase" }}>
                  <span style={{ color: "#CC0000" }}>CLICK</span> EXPRESS INC
                </div>
                <div style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)", letterSpacing: 2.5, fontFamily: "'Barlow',sans-serif", marginTop: 4 }}>
                  {t.tagline}
                </div>
              </div>
            </div>

            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.7)", lineHeight: 1.9, marginBottom: 20 }}>
              {t.para1}
            </p>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.7)", lineHeight: 1.9, marginBottom: 32 }}>
              {t.para2}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
              {[["2019", t.stats.founded], ["48", t.stats.states], ["24/7", t.stats.dispatch]].map(([n, l]) => (
                <div key={l} style={{ background: isDark ? "rgba(204,0,0,0.08)" : "rgba(204,0,0,0.1)", border: `1px solid ${isDark ? "rgba(204,0,0,0.2)" : "rgba(204,0,0,0.25)"}`, borderRadius: 6, padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: "#CC0000" }}>{n}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {t.badges.map(c => (
                <span key={c} style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 20, padding: "5px 14px", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)", letterSpacing: 1.5, textTransform: "uppercase" }}>
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, color: "#CC0000", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 24 }}>
              {t.contactInfo}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {contactsBase.map(item => (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 10, textDecoration: "none", transition: "all 0.2s", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.background = "rgba(204,0,0,0.06)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"; e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={{ width: 42, height: 42, background: item.iconBg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>
                      {t.contactLabels[item.key]}
                    </div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: item.highlight ? "#22C55E" : (isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.8)"), fontWeight: 600 }}>
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};