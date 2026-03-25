import React from "react";
import { CELogo } from "../ui/Logo";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface AboutSectionProps {
  onContactClick?: () => void;
  theme?: 'dark' | 'light';
}

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 256 256" fill="#E1306C">
    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 256 256" fill="#0A66C2">
    <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 256 256" fill="#1877F2">
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"/>
  </svg>
);

const MapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 256 256" fill="#CC0000">
    <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 256 256" fill="#22C55E">
    <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 256 256" fill="#60A5FA">
    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/>
  </svg>
);

const contactsBase = [
  { icon: <MapIcon />, iconBg: "rgba(204,0,0,0.15)", key: "Address" as const, value: "Hallandale Beach, FL, United States, 33009", href: "https://maps.google.com/?q=Hallandale+Beach+FL+33009", highlight: false },
  { icon: <PhoneIcon />, iconBg: "rgba(34,197,94,0.15)", key: "Phone" as const, value: "+1 786-202-6599", href: "tel:+17862026599", highlight: true },
  { icon: <MailIcon />, iconBg: "rgba(96,165,250,0.15)", key: "Email" as const, value: "clickexpress.inc@gmail.com", href: "mailto:clickexpress.inc@gmail.com", highlight: false },
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