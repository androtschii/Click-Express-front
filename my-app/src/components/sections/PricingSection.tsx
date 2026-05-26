import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useInView } from "../../hooks/useInView";
import { CheckCircle, XCircle, Star, ArrowRight } from "@phosphor-icons/react";

interface PricingSectionProps {
  theme?: "dark" | "light";
  onQuoteClick?: () => void;
  standalone?: boolean;
  onBack?: () => void;
}

interface Plan {
  key: string;
  nameEn: string;
  nameRu: string;
  rateEn: string;
  rateRu: string;
  descEn: string;
  descRu: string;
  popular: boolean;
  ctaEn: string;
  ctaRu: string;
  features: Array<{ en: string; ru: string; included: boolean }>;
}

const PLANS: Plan[] = [
  {
    key: "standard",
    nameEn: "Standard",
    nameRu: "Стандарт",
    rateEn: "5% of gross",
    rateRu: "5% от фрахта",
    descEn: "Perfect for owner-operators getting started",
    descRu: "Для owner-operators, которые только начинают",
    popular: false,
    ctaEn: "Get Started",
    ctaRu: "Начать",
    features: [
      { en: "24/7 dispatcher on call",          ru: "Диспетчер 24/7",                    included: true },
      { en: "Load sourcing & booking",           ru: "Поиск и бронирование грузов",       included: true },
      { en: "Rate negotiation",                  ru: "Переговоры по ставкам",             included: true },
      { en: "BOL & paperwork handling",          ru: "Оформление BOL и документов",       included: true },
      { en: "Fuel surcharge tracking",           ru: "Отслеживание топливной надбавки",   included: true },
      { en: "Priority load access",              ru: "Приоритетный доступ к грузам",      included: false },
      { en: "Permit & pilot car coordination",   ru: "Координация разрешений и пилота",   included: false },
      { en: "Dedicated dispatcher",              ru: "Выделенный диспетчер",              included: false },
    ],
  },
  {
    key: "growth",
    nameEn: "Growth",
    nameRu: "Рост",
    rateEn: "7% of gross",
    rateRu: "7% от фрахта",
    descEn: "For experienced drivers who want more",
    descRu: "Для опытных водителей, которым нужно больше",
    popular: true,
    ctaEn: "Get Started",
    ctaRu: "Начать",
    features: [
      { en: "24/7 dispatcher on call",          ru: "Диспетчер 24/7",                    included: true },
      { en: "Load sourcing & booking",           ru: "Поиск и бронирование грузов",       included: true },
      { en: "Rate negotiation",                  ru: "Переговоры по ставкам",             included: true },
      { en: "BOL & paperwork handling",          ru: "Оформление BOL и документов",       included: true },
      { en: "Fuel surcharge tracking",           ru: "Отслеживание топливной надбавки",   included: true },
      { en: "Priority load access",              ru: "Приоритетный доступ к грузам",      included: true },
      { en: "Permit & pilot car coordination",   ru: "Координация разрешений и пилота",   included: true },
      { en: "Dedicated dispatcher",              ru: "Выделенный диспетчер",              included: false },
    ],
  },
  {
    key: "fleet",
    nameEn: "Fleet",
    nameRu: "Автопарк",
    rateEn: "Custom rate",
    rateRu: "Индивидуально",
    descEn: "Multiple trucks, volume discounts, full coverage",
    descRu: "Несколько грузовиков, скидки за объём",
    popular: false,
    ctaEn: "Contact Us",
    ctaRu: "Связаться",
    features: [
      { en: "24/7 dispatcher on call",          ru: "Диспетчер 24/7",                    included: true },
      { en: "Load sourcing & booking",           ru: "Поиск и бронирование грузов",       included: true },
      { en: "Rate negotiation",                  ru: "Переговоры по ставкам",             included: true },
      { en: "BOL & paperwork handling",          ru: "Оформление BOL и документов",       included: true },
      { en: "Fuel surcharge tracking",           ru: "Отслеживание топливной надбавки",   included: true },
      { en: "Priority load access",              ru: "Приоритетный доступ к грузам",      included: true },
      { en: "Permit & pilot car coordination",   ru: "Координация разрешений и пилота",   included: true },
      { en: "Dedicated dispatcher",              ru: "Выделенный диспетчер",              included: true },
    ],
  },
];

const FAQS = [
  {
    en: "Is there a setup fee or contract?",
    ru: "Есть ли комиссия за подключение или контракт?",
    answerEn: "No setup fees, no contracts. You can start or stop at any time — we earn only when you earn.",
    answerRu: "Никаких взносов за подключение и никаких контрактов. Начинаете и заканчиваете когда угодно — мы зарабатываем только тогда, когда зарабатываете вы.",
  },
  {
    en: "What's included in the percentage?",
    ru: "Что входит в процент?",
    answerEn: "Everything: dispatching, negotiation, paperwork, tracking, and 24/7 support. No hidden charges.",
    answerRu: "Всё: диспетчеризация, переговоры, документы, отслеживание и поддержка 24/7. Никаких скрытых платежей.",
  },
  {
    en: "How do I switch plans?",
    ru: "Как сменить тариф?",
    answerEn: "Just call or message your dispatcher. Plan changes take effect on the next load.",
    answerRu: "Просто позвоните или напишите диспетчеру. Смена тарифа вступает в силу со следующего груза.",
  },
  {
    en: "Do you charge for rejected loads?",
    ru: "Берёте ли плату за отказ от груза?",
    answerEn: "Never. No forced dispatch — you decline any load with no penalties or fees.",
    answerRu: "Никогда. Никакой принудительной диспетчеризации — отказывайтесь от любого груза без штрафов.",
  },
];

export const PricingSection: React.FC<PricingSectionProps> = ({
  theme = "dark",
  onQuoteClick,
  standalone = false,
  onBack,
}) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const { ref, inView } = useInView<HTMLElement>(0.05);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const bg        = isDark ? "#080808" : "#f5f5f5";
  const cardBg    = isDark ? "#0f0f0f" : "#ffffff";
  const popBg     = isDark ? "#110000" : "#fff5f5";
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subColor  = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)";
  const faqBg     = isDark ? "#0d0d0d" : "#ffffff";

  return (
    <section
      ref={ref}
      style={{ background: bg, padding: standalone ? "100px clamp(20px,5vw,64px) 72px" : "72px clamp(20px,5vw,64px)" }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        {standalone && onBack && (
          <button
            onClick={onBack}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12,
              letterSpacing: 1.5, textTransform: "uppercase", color: subColor,
              marginBottom: 40, padding: 0, transition: "color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#CC0000"; }}
            onMouseLeave={e => { e.currentTarget.style.color = subColor; }}
          >
            ← {lang === "ru" ? "Назад" : "Back"}
          </button>
        )}

        {/* Header */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          marginBottom: 52, textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11,
            color: "#CC0000", letterSpacing: 4, textTransform: "uppercase",
            marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ width: 20, height: 2, background: "#CC0000", display: "inline-block" }} />
            {lang === "ru" ? "Тарифы" : "Pricing"}
          </div>
          <h2 style={{
            fontFamily: "'Oswald',sans-serif", fontWeight: 700,
            fontSize: "clamp(28px,4vw,48px)", color: textColor,
            textTransform: "uppercase", lineHeight: 1, marginBottom: 14,
          }}>
            {lang === "ru" ? "ПРОЗРАЧНЫЕ " : "SIMPLE, "}<span style={{ color: "#CC0000" }}>
              {lang === "ru" ? "ТАРИФЫ" : "TRANSPARENT RATES"}
            </span>
          </h2>
          <p style={{
            fontFamily: "'Barlow',sans-serif", fontSize: 15, color: subColor,
            lineHeight: 1.7, maxWidth: 520, margin: "0 auto",
          }}>
            {lang === "ru"
              ? "Никаких скрытых комиссий, никаких контрактов. Платите только с каждого выполненного груза."
              : "No hidden fees, no long-term contracts. You pay only when you earn — a percentage of each completed load."}
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 64,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.7s ease 0.15s",
        }}>
          {PLANS.map((plan, i) => (
            <div
              key={plan.key}
              style={{
                background: plan.popular ? popBg : cardBg,
                border: `1.5px solid ${plan.popular ? "#CC0000" : border}`,
                borderRadius: 10,
                padding: "32px 28px 28px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: plan.popular ? "0 0 40px rgba(204,0,0,0.12)" : "none",
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 120 + 200}ms`,
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -13, left: "50%",
                  transform: "translateX(-50%)",
                  background: "#CC0000",
                  padding: "4px 16px",
                  borderRadius: 20,
                  fontFamily: "'Barlow',sans-serif", fontWeight: 800,
                  fontSize: 10, letterSpacing: 2, color: "#fff",
                  textTransform: "uppercase",
                  display: "flex", alignItems: "center", gap: 5,
                  whiteSpace: "nowrap",
                }}>
                  <Star size={10} weight="fill" color="#fff" />
                  {lang === "ru" ? "Популярный" : "Most Popular"}
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11,
                  color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8,
                }}>
                  {lang === "ru" ? plan.nameRu : plan.nameEn}
                </div>
                <div style={{
                  fontFamily: "'Oswald',sans-serif", fontWeight: 700,
                  fontSize: 36, color: textColor, lineHeight: 1, marginBottom: 8,
                }}>
                  {lang === "ru" ? plan.rateRu : plan.rateEn}
                </div>
                <p style={{
                  fontFamily: "'Barlow',sans-serif", fontSize: 13,
                  color: subColor, lineHeight: 1.6, margin: 0,
                }}>
                  {lang === "ru" ? plan.descRu : plan.descEn}
                </p>
              </div>

              <div style={{ flex: 1, marginBottom: 28 }}>
                {plan.features.map((f, fi) => (
                  <div key={fi} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    marginBottom: 12, opacity: f.included ? 1 : 0.38,
                  }}>
                    {f.included
                      ? <CheckCircle size={16} weight="fill" color="#CC0000" style={{ flexShrink: 0, marginTop: 1 }} />
                      : <XCircle size={16} weight="fill" color={subColor} style={{ flexShrink: 0, marginTop: 1 }} />
                    }
                    <span style={{
                      fontFamily: "'Barlow',sans-serif", fontSize: 13,
                      color: f.included ? textColor : subColor, lineHeight: 1.5,
                    }}>
                      {lang === "ru" ? f.ru : f.en}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={onQuoteClick}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  background: plan.popular ? "#CC0000" : "transparent",
                  border: `1.5px solid ${plan.popular ? "#CC0000" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)")}`,
                  borderRadius: 6,
                  color: plan.popular ? "#fff" : textColor,
                  fontFamily: "'Barlow',sans-serif", fontWeight: 800,
                  fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.18s, border-color 0.18s, color 0.18s",
                  boxShadow: plan.popular ? "0 4px 20px rgba(204,0,0,0.35)" : "none",
                }}
                onMouseEnter={e => {
                  if (!plan.popular) {
                    e.currentTarget.style.background = "#CC0000";
                    e.currentTarget.style.borderColor = "#CC0000";
                    e.currentTarget.style.color = "#fff";
                  } else {
                    e.currentTarget.style.background = "#aa0000";
                  }
                }}
                onMouseLeave={e => {
                  if (!plan.popular) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)";
                    e.currentTarget.style.color = textColor;
                  } else {
                    e.currentTarget.style.background = "#CC0000";
                  }
                }}
              >
                {lang === "ru" ? plan.ctaRu : plan.ctaEn}
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
          maxWidth: 760, margin: "0 auto",
        }}>
          <h3 style={{
            fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22,
            color: textColor, textTransform: "uppercase", marginBottom: 20, textAlign: "center",
          }}>
            {lang === "ru" ? "ЧАСТО СПРАШИВАЮТ" : "COMMON QUESTIONS"}
          </h3>

          {FAQS.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  background: faqBg,
                  border: `1px solid ${open ? "#CC0000" : border}`,
                  borderRadius: 8,
                  marginBottom: 8,
                  overflow: "hidden",
                  transition: "border-color 0.18s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  style={{
                    width: "100%", padding: "16px 20px",
                    background: "transparent", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    textAlign: "left",
                  }}
                >
                  <span style={{
                    fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14,
                    color: open ? "#CC0000" : textColor, transition: "color 0.18s",
                  }}>
                    {lang === "ru" ? faq.ru : faq.en}
                  </span>
                  <span style={{
                    fontFamily: "'Barlow',sans-serif", fontSize: 18, color: "#CC0000",
                    flexShrink: 0, transition: "transform 0.2s",
                    display: "inline-block",
                    transform: open ? "rotate(45deg)" : "none",
                  }}>+</span>
                </button>
                {open && (
                  <div style={{
                    padding: "0 20px 18px",
                    fontFamily: "'Barlow',sans-serif", fontSize: 13.5,
                    color: subColor, lineHeight: 1.7,
                  }}>
                    {lang === "ru" ? faq.answerRu : faq.answerEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
