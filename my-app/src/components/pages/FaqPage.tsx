import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface FaqPageProps {
  theme?: "dark" | "light";
  onBack?: () => void;
}

const FAQ_EN = [
  { q: "How do I book a load?", a: "Browse available loads in our catalog, click 'Book Load' on any card, and confirm in your cart. Our dispatcher will contact you within 1 hour to finalize details." },
  { q: "What types of freight do you haul?", a: "We handle full truckload (FTL), partial loads (LTL), flatbed, step-deck, RGN, military cargo, and oversize/overweight shipments across all 48 contiguous US states." },
  { q: "How do I track my shipment?", a: "After booking, go to My Orders and click the tracking button on your active order. You'll see live status updates from our dispatch team." },
  { q: "What are your operating hours?", a: "Our dispatch team is available 24/7, 365 days a year. You can reach us by phone at +1 786-202-6599 or via the contact form on this site." },
  { q: "How is pricing calculated?", a: "Rates are based on mileage, cargo type, equipment required, and current market conditions. All prices shown in our catalog are final — no hidden fees." },
  { q: "Do you handle oversize loads?", a: "Yes. We have experience with oversize and overweight freight, including wide loads and military equipment. Permits and escorts are arranged by our team." },
  { q: "What documents do I need to provide?", a: "For standard loads: valid MC number, insurance certificate, and signed rate confirmation. Military loads may require additional clearance documents." },
  { q: "Can I cancel a booking?", a: "Cancellations made more than 24 hours before pickup are free of charge. Late cancellations may be subject to a fee. Contact dispatch immediately if plans change." },
  { q: "Are you FMCSA registered?", a: "Yes. Click Express Inc is fully registered with FMCSA, holds an active MC number, and maintains all required insurance and operating authority." },
  { q: "How do I apply for a driver position?", a: "Visit our Careers page and fill out the application form. Our team reviews applications weekly and will contact qualified candidates within 3–5 business days." },
];

const FAQ_RU = [
  { q: "Как забронировать груз?", a: "Просмотрите доступные грузы в каталоге, нажмите «Забронировать» на нужной карточке и подтвердите в корзине. Диспетчер свяжется с вами в течение 1 часа." },
  { q: "Какие типы грузов вы перевозите?", a: "Мы работаем с FTL, LTL, flatbed, step-deck, RGN, военными грузами и крупногабаритными перевозками по всем 48 континентальным штатам США." },
  { q: "Как отследить груз?", a: "После бронирования перейдите в раздел «Мои заказы» и нажмите кнопку отслеживания. Там отображаются актуальные статусы от диспетчерской службы." },
  { q: "Каковы часы работы?", a: "Наша диспетчерская служба работает 24/7, 365 дней в году. Телефон: +1 786-202-6599 или через контактную форму на сайте." },
  { q: "Как рассчитывается стоимость?", a: "Тарифы зависят от расстояния, типа груза, необходимого оборудования и рыночных условий. Все цены в каталоге окончательные — скрытых сборов нет." },
  { q: "Работаете ли вы с крупногабаритными грузами?", a: "Да. У нас есть опыт перевозки крупногабаритных грузов, включая широкие нагрузки и военное оборудование. Разрешения и сопровождение организует наша команда." },
  { q: "Какие документы нужны?", a: "Для стандартных грузов: действующий номер MC, страховой сертификат и подписанное подтверждение ставки. Для военных грузов могут потребоваться дополнительные документы." },
  { q: "Можно ли отменить бронирование?", a: "Отмена за 24+ часа до погрузки — бесплатно. Поздняя отмена может повлечь штраф. При изменении планов немедленно свяжитесь с диспетчером." },
  { q: "Зарегистрированы ли вы в FMCSA?", a: "Да. Click Express Inc полностью зарегистрирована в FMCSA, имеет действующий номер MC и все необходимые страховки и полномочия." },
  { q: "Как подать заявку на вакансию водителя?", a: "Перейдите на страницу «Карьера» и заполните форму заявки. Наша команда рассматривает заявки еженедельно и свяжется с подходящими кандидатами в течение 3–5 рабочих дней." },
];

export const FaqPage: React.FC<FaqPageProps> = ({ theme = "dark", onBack }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const items = lang === "ru" ? FAQ_RU : FAQ_EN;

  const bg = isDark ? "#080808" : "#f5f5f5";
  const cardBg = isDark ? "#0f0f0f" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.55)";

  return (
    <div style={{ background: bg, minHeight: "100vh", padding: "48px clamp(20px,5vw,64px) 80px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 32, padding: 0 }}>
            ← {lang === "ru" ? "Назад" : "Back"}
          </button>
        )}
        <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>FAQ</div>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(32px,5vw,52px)", color: textColor, textTransform: "uppercase", lineHeight: 1, marginBottom: 40 }}>
          {lang === "ru" ? "ЧАСТО ЗАДАВАЕМЫЕ " : "FREQUENTLY ASKED "}<span style={{ color: "#CC0000" }}>{lang === "ru" ? "ВОПРОСЫ" : "QUESTIONS"}</span>
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: cardBg, border: `1px solid ${open === i ? "rgba(204,0,0,0.4)" : border}`, borderRadius: 6, overflow: "hidden", transition: "border-color 0.2s" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width: "100%", padding: "18px 20px", background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                textAlign: "left",
              }}>
                <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: open === i ? "#CC0000" : textColor, transition: "color 0.15s" }}>{item.q}</span>
                <span style={{ fontSize: 20, color: "#CC0000", flexShrink: 0, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", lineHeight: 1 }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 20px 18px" }}>
                  <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: subColor, lineHeight: 1.75, margin: 0 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56, background: cardBg, border: "1px solid rgba(204,0,0,0.25)", borderRadius: 8, padding: "28px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 16, color: textColor, marginBottom: 8 }}>
            {lang === "ru" ? "Не нашли ответ?" : "Didn't find your answer?"}
          </p>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: subColor, marginBottom: 16 }}>
            {lang === "ru" ? "Свяжитесь с нашим диспетчером напрямую:" : "Contact our dispatcher directly:"}
          </p>
          <a href="tel:+17862026599" style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: "#CC0000", textDecoration: "none" }}>+1 786-202-6599</a>
        </div>
      </div>
    </div>
  );
};
