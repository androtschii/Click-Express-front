import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useInView } from "../../hooks/useInView";
import { HandshakeIcon, ClockCounterClockwise, CurrencyDollar, FileText } from "@phosphor-icons/react";

interface WhyUsProps {
  theme?: "dark" | "light";
  onQuoteClick?: () => void;
}

export const WhyUs: React.FC<WhyUsProps> = ({ theme = "dark", onQuoteClick }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const [hovered, setHovered] = useState<number | null>(null);
  const { ref, inView } = useInView<HTMLElement>(0.12);

  const bg = isDark ? "#0a0a0a" : "#f4f0e8";
  const cardBg = isDark ? "#0f0f0f" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)";

  const CARDS = [
    {
      Icon: HandshakeIcon,
      title: lang === "ru" ? "Без принудительной диспетчеризации" : "No Forced Dispatch",
      text: lang === "ru"
        ? "Вы сами выбираете грузы. Мы предлагаем — вы решаете. Никакого давления, никаких штрафов за отказ."
        : "You choose every load. We offer, you decide. No pressure, no penalties for turning down a run.",
    },
    {
      Icon: ClockCounterClockwise,
      title: lang === "ru" ? "Ответ за минуты" : "Response in Minutes",
      text: lang === "ru"
        ? "Диспетчер на связи 24/7. Вопрос или груз — отвечаем быстро, без ожидания на линии."
        : "Dispatcher on call 24/7. A load question or issue — we respond fast, no hold music.",
    },
    {
      Icon: CurrencyDollar,
      title: lang === "ru" ? "Лучшие ставки на рынке" : "Top Market Rates",
      text: lang === "ru"
        ? "Переговоры по ставкам, поиск высокооплачиваемых маршрутов и топливные надбавки — всё на нашей стороне."
        : "Rate negotiation, high-paying lane sourcing and fuel surcharges — we fight to maximize your $/mile.",
    },
    {
      Icon: FileText,
      title: lang === "ru" ? "Все документы под контролем" : "Full Paperwork Coverage",
      text: lang === "ru"
        ? "Разрешения, сопровождение, BOL — оформляем все документы, вы фокусируетесь только на дороге."
        : "Permits, pilot cars, BOL — we handle all paperwork so you stay focused on the road.",
    },
  ];

  return (
    <section ref={ref} style={{ background: bg, padding: "72px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          marginBottom: 48,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20,
        }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 20, height: 2, background: "#CC0000", display: "inline-block" }} />
              {lang === "ru" ? "Наши преимущества" : "Why Choose Us"}
            </div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,46px)", color: textColor, textTransform: "uppercase", lineHeight: 1 }}>
              {lang === "ru" ? "РАБОТАЙТЕ " : "HAUL SMARTER, "}<span style={{ color: "#CC0000" }}>{lang === "ru" ? "УМНЕЕ С НАМИ" : "NOT HARDER"}</span>
            </h2>
          </div>
          {onQuoteClick && (
            <button
              onClick={onQuoteClick}
              style={{
                padding: "12px 28px", background: "#CC0000", border: "none", borderRadius: 4,
                color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 12,
                letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer",
                boxShadow: "0 4px 20px rgba(204,0,0,0.4)", flexShrink: 0,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#aa0000"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#CC0000"; }}
            >
              {lang === "ru" ? "Получить оценку →" : "Get a Free Quote →"}
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
          {CARDS.map(({ Icon, title, text }, i) => {
            const isHov = hovered === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: cardBg,
                  border: `1px solid ${isHov ? "#CC0000" : border}`,
                  borderRadius: 8,
                  padding: "28px 24px",
                  transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                  transform: isHov ? "translateY(-4px)" : "none",
                  boxShadow: isHov ? "0 12px 36px rgba(0,0,0,0.35)" : "none",
                  opacity: inView ? 1 : 0,
                  transitionProperty: "border-color, transform, box-shadow, opacity",
                  transitionDuration: `0.2s, 0.2s, 0.2s, 0.5s`,
                  transitionDelay: `0s, 0s, 0s, ${i * 100 + 200}ms`,
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: isHov ? "rgba(204,0,0,0.15)" : "rgba(204,0,0,0.08)",
                  border: `1px solid ${isHov ? "rgba(204,0,0,0.4)" : "rgba(204,0,0,0.15)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20, transition: "background 0.2s, border-color 0.2s",
                }}>
                  <Icon size={22} weight="duotone" color="#CC0000" />
                </div>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 18, color: textColor, textTransform: "uppercase", marginBottom: 10, letterSpacing: 0.5 }}>
                  {title}
                </h3>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13.5, color: subColor, lineHeight: 1.7, margin: 0 }}>
                  {text}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
