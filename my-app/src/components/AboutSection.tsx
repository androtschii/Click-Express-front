import React from "react";
import { CELogo } from "./Logo";

interface AboutSectionProps {
  onContactClick?: () => void;
  theme?: 'dark' | 'light';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  
  return (
    <section style={{ background: isDark ? "#0a0a0a" : "#ffffff", padding: "80px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
                <div key={l as string} style={{ background: isDark ? "rgba(204,0,0,0.08)" : "rgba(204,0,0,0.1)", border: `1px solid ${isDark ? "rgba(204,0,0,0.2)" : "rgba(204,0,0,0.25)"}`, borderRadius: 6, padding: "16px 12px", textAlign: "center" }}>
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

          <div>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, color: "#CC0000", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 24 }}>CONTACT INFORMATION</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "📍", label: "Address", value: "Hallandale Beach, FL, United States, 33009", href: "https://maps.google.com/?q=Hallandale+Beach+FL+33009" },
                { icon: "📞", label: "Phone", value: "+1 786-202-6599", href: "tel:+17862026599", highlight: true },
                { icon: "✉️", label: "Email", value: "clickexpress.inc@gmail.com", href: "mailto:clickexpress.inc@gmail.com" },
                { icon: "🔗", label: "Website", value: "clickexpressinc.com", href: "https://clickexpressinc.com" },
                { icon: "💬", label: "Messenger", value: "Click Express inc", href: "https://m.me/clickexpressinc" },
                { icon: "📸", label: "Instagram", value: "@clickexpress.official", href: "https://www.instagram.com/clickexpress.official" },
              ].map(item => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, borderRadius: 8, textDecoration: "none", transition: "all 0.2s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.background = "rgba(204,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"; e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}>
                  <div style={{ width: 40, height: 40, background: "rgba(204,0,0,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: item.highlight ? "#CC0000" : (isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)"), fontWeight: 600 }}>{item.value}</div>
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

