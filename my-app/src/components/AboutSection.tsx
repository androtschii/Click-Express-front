import React from "react";
import { CELogo } from "./Logo";
import { Phone, Mail } from "lucide-react";

interface AboutSectionProps {
  onContactClick?: () => void;
  theme?: 'dark' | 'light';
}

// Instagram SVG иконка (оригинальный градиент)
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

// Messenger SVG иконка
const MessengerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="mg1" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0078FF"/>
        <stop offset="100%" stopColor="#A033FF"/>
      </linearGradient>
    </defs>
    <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.7 1.1 5.13 2.89 6.89L4.5 21l2.94-1.54A10.52 10.52 0 0012 20.52C17.523 20.52 22 16.373 22 11.26 22 6.145 17.523 2 12 2z" fill="url(#mg1)"/>
    <path d="M6.5 14l3.5-3.75 2 2 3.5-2.25-3.5 3.75-2-2L6.5 14z" fill="#fff"/>
  </svg>
);

// Google Maps иконка
const MapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#CC0000"/>
    <circle cx="12" cy="9" r="2.5" fill="#fff"/>
  </svg>
);

// Website иконка
const WebIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#4A90D9" strokeWidth="1.8" fill="none"/>
    <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#4A90D9" strokeWidth="1.8" fill="none"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="#4A90D9" strokeWidth="1.8"/>
    <line x1="3" y1="8" x2="21" y2="8" stroke="#4A90D9" strokeWidth="1.2" strokeDasharray="2"/>
    <line x1="3" y1="16" x2="21" y2="16" stroke="#4A90D9" strokeWidth="1.2" strokeDasharray="2"/>
  </svg>
);

const contacts = [
  {
    icon: <MapIcon />,
    iconBg: "rgba(204,0,0,0.15)",
    label: "Address",
    value: "Hallandale Beach, FL, United States, 33009",
    href: "https://maps.google.com/?q=Hallandale+Beach+FL+33009",
    highlight: false,
  },
  {
    icon: <Phone size={20} color="#22C55E" strokeWidth={2} />,
    iconBg: "rgba(34,197,94,0.15)",
    label: "Phone",
    value: "+1 786-202-6599",
    href: "tel:+17862026599",
    highlight: true,
  },
  {
    icon: <Mail size={20} color="#60A5FA" strokeWidth={2} />,
    iconBg: "rgba(96,165,250,0.15)",
    label: "Email",
    value: "clickexpress.inc@gmail.com",
    href: "mailto:clickexpress.inc@gmail.com",
    highlight: false,
  },
  {
    icon: <WebIcon />,
    iconBg: "rgba(74,144,217,0.15)",
    label: "Website",
    value: "clickexpressinc.com",
    href: "https://clickexpressinc.com",
    highlight: false,
  },
  {
    icon: <MessengerIcon />,
    iconBg: "rgba(160,51,255,0.15)",
    label: "Messenger",
    value: "Click Express inc",
    href: "https://m.me/clickexpressinc",
    highlight: false,
  },
  {
    icon: <InstagramIcon />,
    iconBg: "rgba(214,36,159,0.15)",
    label: "Instagram",
    value: "@clickexpress.official",
    href: "https://www.instagram.com/clickexpress.official",
    highlight: false,
  },
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick, theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <section style={{ background: isDark ? "#0a0a0a" : "#ffffff", padding: "80px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Заголовок */}
        <div style={{ marginBottom: 60, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>
              — Who We Are
            </div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(32px,5vw,54px)", color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase", lineHeight: 1 }}>
              ABOUT <span style={{ color: "#CC0000" }}>CLICK EXPRESS</span> INC
            </h2>
          </div>
          <button onClick={onContactClick} style={{ background: "#CC0000", color: "#fff", border: "none", borderRadius: 4, padding: "12px 28px", fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 18px rgba(204,0,0,0.4)" }}>
            GET IN TOUCH
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

          {/* Левая колонка */}
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
                  HEAVY FREIGHT SOLUTIONS · EST. 2019
                </div>
              </div>
            </div>

            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.7)", lineHeight: 1.9, marginBottom: 20 }}>
              Click Express Inc is a USA-based heavy freight carrier founded in 2019. We specialize in full truckload, partial, flatbed, and oversized shipments across all 48 continental states.
            </p>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.7)", lineHeight: 1.9, marginBottom: 32 }}>
              Our purpose is to empower businesses with uninterrupted performance, ensuring stability, reliability, and efficiency. Behind every load is a dedicated dispatcher working around the clock.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
              {[["2019", "Founded"], ["48", "States"], ["24/7", "Dispatch"]].map(([n, l]) => (
                <div key={l} style={{ background: isDark ? "rgba(204,0,0,0.08)" : "rgba(204,0,0,0.1)", border: `1px solid ${isDark ? "rgba(204,0,0,0.2)" : "rgba(204,0,0,0.25)"}`, borderRadius: 6, padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: "#CC0000" }}>{n}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["DOT Certified", "FMCSA Licensed", "Fully Insured", "GPS Tracked"].map(c => (
                <span key={c} style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 20, padding: "5px 14px", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)", letterSpacing: 1.5, textTransform: "uppercase" }}>
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>

          {/* Правая колонка — контакты */}
          <div>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, color: "#CC0000", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 24 }}>
              CONTACT INFORMATION
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {contacts.map(item => (
                <a
                  key={item.label}
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
                      {item.label}
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