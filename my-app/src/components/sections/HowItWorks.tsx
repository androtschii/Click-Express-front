import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";
import { useInView } from "../../hooks/useInView";
import { ChatTeardropDots, Headset, Truck, MapPinLine } from "@phosphor-icons/react";
import { LightRays } from "../ui/LightRays";

interface HowItWorksProps {
  theme?: "dark" | "light";
  onQuoteClick?: () => void;
}

const ICONS = [ChatTeardropDots, Headset, Truck, MapPinLine];

export const HowItWorks: React.FC<HowItWorksProps> = ({ theme = "dark", onQuoteClick }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const t = translations[lang].howItWorks;
  const { ref, inView } = useInView<HTMLElement>(0.15);

  const bg       = isDark ? "#080808" : "#f4f0e8";
  const surface  = isDark ? "#0e0e0e" : "#ffffff";
  const text     = isDark ? "#f0ede8" : "#0d0d0d";
  const muted    = isDark ? "rgba(240,237,232,0.55)" : "rgba(13,13,13,0.55)";
  const border   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  return (
    <section
      ref={ref}
      style={{
        background: bg,
        padding: "clamp(56px,7vw,96px) clamp(16px,5vw,64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LightRays color="#CC0000" intensity={isDark ? 0.5 : 0.25} speed={0.9} origin="center-top" blur={70} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(135deg,${isDark ? "rgba(204,0,0,0.025)" : "rgba(204,0,0,0.02)"} 0,${isDark ? "rgba(204,0,0,0.025)" : "rgba(204,0,0,0.02)"} 1px,transparent 1px,transparent 28px)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>
            ● {t.badge}
          </div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", color: text, textTransform: "uppercase", margin: "0 0 16px", letterSpacing: 1, lineHeight: 1.05 }}>
            {t.title} <span style={{ color: "#CC0000" }}>{t.titleHighlight}</span>
          </h2>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: muted, margin: "0 auto", maxWidth: 640, lineHeight: 1.6 }}>
            {t.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {t.steps.map((step, i) => {
            const Icon = ICONS[i];
            const isLast = i === t.steps.length - 1;
            return (
              <div
                key={step.title}
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: 12,
                  padding: "28px 24px",
                  position: "relative",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(24px)",
                  transition: `opacity 0.5s ease ${0.1 + i * 0.12}s, transform 0.5s ease ${0.1 + i * 0.12}s, border-color 0.2s, box-shadow 0.2s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(204,0,0,0.45)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.18)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontFamily: "'Oswald',sans-serif",
                    fontWeight: 700,
                    fontSize: 56,
                    color: isDark ? "rgba(204,0,0,0.18)" : "rgba(204,0,0,0.14)",
                    lineHeight: 1,
                    position: "absolute",
                    top: 12,
                    right: 18,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "rgba(204,0,0,0.1)",
                    border: "1px solid rgba(204,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={22} weight="duotone" color="#CC0000" />
                </div>

                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 17, color: text, textTransform: "uppercase", margin: "0 0 8px", letterSpacing: 0.5 }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: muted, margin: 0, lineHeight: 1.55 }}>
                  {step.desc}
                </p>

                {!isLast && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: -12,
                      transform: "translateY(-50%)",
                      width: 24,
                      height: 2,
                      background: "linear-gradient(90deg, rgba(204,0,0,0.5), transparent)",
                      display: "none",
                    }}
                    className="hiw-connector"
                  />
                )}
              </div>
            );
          })}
        </div>

        {onQuoteClick && (
          <div
            style={{
              textAlign: "center",
              marginTop: 40,
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(16px)",
              transition: "opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s",
            }}
          >
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
              {lang === "ru" ? "Получить ставку" : "Start with a Quote"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
