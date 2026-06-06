import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";
import { useInView } from "../../hooks/useInView";
import { ScrollStack } from "../ui/ScrollStack";

interface HaulTypesProps {
  theme?: "dark" | "light";
  onQuoteClick?: () => void;
}

const IMAGE_BY_TAG: Record<string, string> = {
  "01": "/images/flatbed.webp",
  "02": "/images/stepdeck.webp",
  "03": "/images/lowboy.webp",
  "04": "/images/conestoga.webp",
};

export const HaulTypes: React.FC<HaulTypesProps> = ({ theme = "dark", onQuoteClick }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const t = translations[lang].haulTypes;
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const [isMobile, setIsMobile] = React.useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);
  React.useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const bg      = isDark ? "#0a0a0a" : "#f4f0e8";
  const surface = isDark ? "#0e0e0e" : "#ffffff";
  const text    = isDark ? "#f0ede8" : "#0d0d0d";
  const muted   = isDark ? "rgba(240,237,232,0.55)" : "rgba(13,13,13,0.55)";
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  return (
    <section
      ref={ref}
      style={{
        background: bg,
        padding: "clamp(48px,6vw,80px) clamp(16px,5vw,64px) 0",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            marginBottom: 40,
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>
            ● {t.badge}
          </div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", color: text, textTransform: "uppercase", margin: "0 0 14px", letterSpacing: 1, lineHeight: 1.05 }}>
            {t.title} <span style={{ color: "#CC0000" }}>{t.titleHighlight}</span>
          </h2>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: muted, margin: 0, maxWidth: 640, lineHeight: 1.6 }}>
            {t.subtitle}
          </p>
        </div>

        <ScrollStack topOffset={92} layerOffset={14} scaleStep={0.035} fadeStep={0.14}>
          {t.types.map((type) => {
            const num = type.tag.split(" / ")[0];
            const img = IMAGE_BY_TAG[num];
            return (
              <div
                key={type.tag}
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.45)" : "0 20px 40px rgba(0,0,0,0.12)",
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.1fr) minmax(0, 1fr)",
                  minHeight: isMobile ? "auto" : 320,
                }}
              >
                <div style={{ padding: "clamp(24px,3.5vw,44px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase" }}>
                    {type.tag}
                  </div>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(22px,3vw,34px)", color: text, textTransform: "uppercase", margin: 0, letterSpacing: 0.5, lineHeight: 1.05 }}>
                    {type.name}
                  </h3>
                  <div style={{ display: "inline-flex", padding: "7px 12px", border: `1px solid ${border}`, borderRadius: 6, background: isDark ? "rgba(204,0,0,0.06)" : "rgba(204,0,0,0.04)", alignSelf: "flex-start" }}>
                    <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: text, letterSpacing: 0.4, fontVariantNumeric: "tabular-nums" }}>
                      {type.spec}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: muted, lineHeight: 1.65, margin: 0 }}>
                    {type.desc}
                  </p>
                </div>

                <div
                  style={{
                    position: "relative",
                    background: isDark
                      ? "radial-gradient(ellipse at 55% 60%, rgba(80,10,10,0.6) 0%, rgba(20,5,5,0.95) 70%)"
                      : "linear-gradient(160deg,#f5ecec 0%,#ede0e0 50%,#e8d8d8 100%)",
                    overflow: "hidden",
                    minHeight: isMobile ? 200 : 280,
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(135deg,rgba(204,0,0,${isDark?"0.05":"0.04"}) 0,rgba(204,0,0,${isDark?"0.05":"0.04"}) 1px,transparent 1px,transparent 22px)`, pointerEvents: "none" }} />
                  {img && (
                    <img
                      src={img}
                      alt={type.name}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "20px 24px",
                        position: "relative",
                        zIndex: 1,
                        filter: isDark
                          ? "drop-shadow(0 0 18px rgba(204,0,0,0.35)) brightness(1.4)"
                          : "drop-shadow(0 8px 18px rgba(0,0,0,0.22))",
                      }}
                    />
                  )}
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "linear-gradient(90deg,transparent,#CC0000 30%,#CC0000 70%,transparent)" }} />
                </div>
              </div>
            );
          })}
        </ScrollStack>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "48px 0 64px",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
          }}
        >
          {onQuoteClick && (
            <button
              onClick={onQuoteClick}
              style={{
                padding: "14px 36px",
                background: "linear-gradient(135deg,#CC0000,#ff3333)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(204,0,0,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(204,0,0,0.5)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(204,0,0,0.35)";
              }}
            >
              {t.cta}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
