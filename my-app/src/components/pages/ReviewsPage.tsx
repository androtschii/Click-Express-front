import React from "react";
import { useLanguage } from "../../context/LanguageContext";

interface ReviewsPageProps {
  theme?: "dark" | "light";
  onBack?: () => void;
}

interface Review {
  id: number;
  nameEn: string;
  nameRu: string;
  roleEn: string;
  roleRu: string;
  commentEn: string;
  commentRu: string;
  initial: string;
  avatarColor: string;
  date: string;
  stateEn: string;
  stateRu: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    nameEn: "Marcus T.", nameRu: "Маркус Т.",
    roleEn: "Owner-Operator", roleRu: "Независимый перевозчик",
    commentEn: "Click Express set me up with 3 back-to-back loads in Florida. Dispatcher was available at 2am when I had a breakdown. This is the real deal — not just another dispatch company. Best decision I've made for my trucking business.",
    commentRu: "Click Express обеспечил меня 3 загрузками подряд во Флориде. Диспетчер был доступен в 2 ночи когда сломался. Это серьёзная компания — не очередной диспетчерский сервис. Лучшее решение для моего бизнеса.",
    initial: "M", avatarColor: "linear-gradient(135deg,#CC0000,#880000)",
    date: "Mar 20, 2025", stateEn: "Florida, USA", stateRu: "Флорида, США",
  },
  {
    id: 2,
    nameEn: "Dmitri K.", nameRu: "Дмитрий К.",
    roleEn: "CDL-A Driver", roleRu: "Водитель CDL-A",
    commentEn: "We've been working with Click Express for 8 months. Loads are always great, rates are fair, dispatcher is always in touch. Highly recommend to all owner-operators! Never had issues with payment or communication.",
    commentRu: "Работаем с Click Express уже 8 месяцев. Лоты всегда хорошие, ставки честные, диспетчер всегда на связи. Рекомендую всем owner-операторам! Никогда не было проблем с оплатой или связью.",
    initial: "Д", avatarColor: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    date: "Mar 14, 2025", stateEn: "Texas, USA", stateRu: "Техас, США",
  },
  {
    id: 3,
    nameEn: "James W.", nameRu: "Джеймс У.",
    roleEn: "Fleet Owner", roleRu: "Владелец автопарка",
    commentEn: "Switched from 2 other dispatch companies. Night and day difference. Click Express actually hustles for their drivers — negotiates rates, fights for good loads, answers every call. My entire fleet runs with them now.",
    commentRu: "Перешёл от 2 других диспетчерских. Небо и земля. Click Express реально работает за своих водителей — ведёт переговоры, борется за хорошие лоты, отвечает на каждый звонок. Теперь весь мой автопарк работает с ними.",
    initial: "J", avatarColor: "linear-gradient(135deg,#22c55e,#15803d)",
    date: "Mar 10, 2025", stateEn: "Georgia, USA", stateRu: "Джорджия, США",
  },
  {
    id: 4,
    nameEn: "Artem S.", nameRu: "Артём С.",
    roleEn: "Independent Trucker", roleRu: "Независимый дальнобойщик",
    commentEn: "Fantastic service. Got a military load with $9.44/mi on my first week. The team is professional, fast, and always finds top-paying freight. I've doubled my weekly income since joining Click Express.",
    commentRu: "Фантастический сервис. Получил военный груз за $9.44/ми на первой же неделе. Команда профессиональная, быстрая, всегда находит высокооплачиваемые грузы. Мой еженедельный доход удвоился с Click Express.",
    initial: "А", avatarColor: "linear-gradient(135deg,#f97316,#c2410c)",
    date: "Feb 28, 2025", stateEn: "California, USA", stateRu: "Калифорния, США",
  },
  {
    id: 5,
    nameEn: "Roberto M.", nameRu: "Роберто М.",
    roleEn: "Flatbed Specialist", roleRu: "Специалист по платформам",
    commentEn: "5 stars isn't enough. These guys found me a $19,499 multi-stop military run — I've never seen rates like that before. Their network is incredible and the support is 24/7. Zero downtime, always loaded.",
    commentRu: "5 звёзд недостаточно. Ребята нашли мне маршрут за $19,499 — никогда не видел таких ставок раньше. Их сеть невероятна, поддержка 24/7. Ноль простоев, всегда загружен.",
    initial: "R", avatarColor: "linear-gradient(135deg,#a855f7,#7e22ce)",
    date: "Feb 20, 2025", stateEn: "Nevada, USA", stateRu: "Невада, США",
  },
  {
    id: 6,
    nameEn: "Olena P.", nameRu: "Олена П.",
    roleEn: "Owner-Operator", roleRu: "Независимый перевозчик",
    commentEn: "I was skeptical at first but Click Express proved me wrong. They handled all paperwork, found premium loads, and their dispatcher speaks Russian which made communication seamless. Truly a top-tier service.",
    commentRu: "Сначала была скептически настроена, но Click Express доказал обратное. Взяли на себя всё оформление, нашли премиальные грузы, а диспетчер говорит по-русски — общение стало простым. Сервис высшего уровня.",
    initial: "О", avatarColor: "linear-gradient(135deg,#eab308,#a16207)",
    date: "Feb 15, 2025", stateEn: "Colorado, USA", stateRu: "Колорадо, США",
  },
  {
    id: 7,
    nameEn: "Kevin L.", nameRu: "Кевин Л.",
    roleEn: "Long-Haul Driver", roleRu: "Дальнобойщик",
    commentEn: "Consistent loads, great communication, and they actually care about the drivers. I've run coast-to-coast routes with $3.73/mi average. The team negotiates hard so I don't have to. Highly recommend.",
    commentRu: "Стабильные грузы, отличная связь, и они реально заботятся о водителях. Ездил по маршрутам побережье-побережье со средней ставкой $3.73/ми. Команда жёстко ведёт переговоры. Настоятельно рекомендую.",
    initial: "K", avatarColor: "linear-gradient(135deg,#06b6d4,#0e7490)",
    date: "Feb 8, 2025", stateEn: "Washington, USA", stateRu: "Вашингтон, США",
  },
  {
    id: 8,
    nameEn: "Sergei V.", nameRu: "Сергей В.",
    roleEn: "CDL-A, Oversized Loads", roleRu: "CDL-A, Негабаритные грузы",
    commentEn: "Click Express specializes in oversized and military freight — exactly what I needed. Got permits handled in hours, not days. The $4.72/mi flatbed load they booked was one of the best of my career.",
    commentRu: "Click Express специализируется на негабаритных и военных грузах — именно то, что мне нужно. Разрешения оформили за часы, не дни. Лот на платформу за $4.72/ми, который они нашли — один из лучших за мою карьеру.",
    initial: "С", avatarColor: "linear-gradient(135deg,#CC0000,#7f1d1d)",
    date: "Jan 30, 2025", stateEn: "Pennsylvania, USA", stateRu: "Пенсильвания, США",
  },
];

function Stars() {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: "#eab308", fontSize: 16 }}>★</span>
      ))}
    </span>
  );
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ theme = "dark", onBack }) => {
  const { lang } = useLanguage();
  const isDark = theme === "dark";

  const bg          = isDark ? "#080808" : "#f5f5f5";
  const cardBg      = isDark ? "#0f0f0f" : "#ffffff";
  const cardBorder  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const textPrimary = isDark ? "#ffffff" : "#1a1a1a";
  const textMuted   = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";
  const textSubtle  = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textPrimary }}>
      <style>{`
        @keyframes revSlideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes revPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .rev-card:hover { transform:translateY(-5px) !important; border-color:rgba(234,179,8,0.5) !important; box-shadow:0 18px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(234,179,8,0.2) !important; }
        .rev-card { transition: all 0.22s ease !important; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        position: "relative",
        background: isDark
          ? "linear-gradient(160deg,#0a0000 0%,#110000 40%,#0d0d0d 100%)"
          : "linear-gradient(160deg,#fff 0%,#fffbf0 40%,#f5f5f5 100%)",
        padding: "90px clamp(20px,5vw,64px) 56px",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg,${isDark?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.02)"} 0px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,${isDark?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.02)"} 0px,transparent 1px,transparent 60px)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#eab308" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,#eab308 30%,#fde047 60%,#eab308 80%,transparent)" }} />

        <div style={{ maxWidth: 900, animation: "revSlideUp 0.6s ease both" }}>
          <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 1, cursor: "pointer", padding: "0 0 20px", transition: "color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#eab308"; }}
            onMouseLeave={e => { e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"; }}>
            ← {lang === "ru" ? "Назад" : "Back"}
          </button>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.35)", borderRadius: 20, padding: "5px 14px", marginBottom: 24, animation: "revSlideUp 0.5s ease 0.1s both" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#eab308", animation: "revPulse 1.4s ease infinite", display: "inline-block" }} />
            <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 10, color: "#eab308", letterSpacing: 3, textTransform: "uppercase" }}>
              {lang === "ru" ? "Отзывы клиентов" : "Client Reviews"}
            </span>
          </div>

          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(42px,7vw,88px)", textTransform: "uppercase", lineHeight: 0.9, margin: "0 0 16px", color: textPrimary }}>
            {lang === "ru" ? (
              <><span style={{ color: "#eab308" }}>CLICK EXPRESS</span><br />ОТЗЫВЫ</>
            ) : (
              <><span style={{ color: "#eab308" }}>CLICK EXPRESS</span><br />REVIEWS</>
            )}
          </h1>

          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 16, color: textMuted, maxWidth: 520, lineHeight: 1.75, margin: 0 }}>
            {lang === "ru"
              ? "Реальные отзывы водителей и owner-операторов, которые доверяют Click Express."
              : "Real reviews from drivers and owner-operators who trust Click Express."}
          </p>

          {/* Stars row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
            <span style={{ display: "inline-flex", gap: 3 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#eab308", fontSize: 28 }}>★</span>)}
            </span>
            <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 28, color: textPrimary }}>5.0</span>
            <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: textSubtle }}>
              {lang === "ru" ? `${REVIEWS.length} отзывов` : `${REVIEWS.length} reviews`}
            </span>
          </div>
        </div>

        <div style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", fontSize: 160, opacity: isDark ? 0.04 : 0.05, userSelect: "none", pointerEvents: "none" }}>★</div>
      </div>

      {/* ── GRID ── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "52px clamp(20px,4vw,56px) 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 24 }}>
          {REVIEWS.map((review, idx) => (
            <div key={review.id} className="rev-card" style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: 14,
              padding: "28px 28px 24px",
              animation: `revSlideUp 0.4s ease ${idx * 0.05}s both`,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Top gold accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#eab308,#fde04780,transparent)" }} />

              {/* Quote decoration */}
              <div style={{ position: "absolute", right: 20, top: 16, fontSize: 80, color: isDark ? "rgba(234,179,8,0.06)" : "rgba(234,179,8,0.1)", fontFamily: "Georgia,serif", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>"</div>

              {/* Stars */}
              <div style={{ marginBottom: 16 }}>
                <Stars />
              </div>

              {/* Comment */}
              <p style={{
                fontFamily: "'Barlow',sans-serif",
                fontSize: 14,
                color: textMuted,
                lineHeight: 1.75,
                marginBottom: 24,
                fontStyle: "italic",
              }}>
                "{lang === "ru" ? review.commentRu : review.commentEn}"
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, paddingTop: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: review.avatarColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff",
                  flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                }}>
                  {review.initial}
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 14, color: textPrimary }}>
                    {lang === "ru" ? review.nameRu : review.nameEn}
                  </div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: "#eab308", fontWeight: 600, letterSpacing: 0.5 }}>
                    {lang === "ru" ? review.roleRu : review.roleEn}
                  </div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: textSubtle, marginTop: 2 }}>
                    {lang === "ru" ? review.stateRu : review.stateEn} · {review.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 60, background: "linear-gradient(135deg,#eab308,#a16207)", borderRadius: 14, padding: "44px 48px", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: "3%", top: "50%", transform: "translateY(-50%)", fontSize: 100, opacity: 0.08, pointerEvents: "none" }}>★</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "rgba(0,0,0,0.6)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
              {lang === "ru" ? "ПРИСОЕДИНЯЙСЯ К НАМ" : "JOIN THE TEAM"}
            </div>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(24px,4vw,40px)", color: "#000", textTransform: "uppercase", lineHeight: 1, marginBottom: 14 }}>
              {lang === "ru" ? "СТАНЬ ЧАСТЬЮ CLICK EXPRESS" : "BECOME PART OF CLICK EXPRESS"}
            </h3>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "rgba(0,0,0,0.65)", marginBottom: 28 }}>
              {lang === "ru" ? "Свяжись с нами — работаем 24/7 для твоего успеха" : "Contact us — we work 24/7 for your success"}
            </p>
            <a href="tel:+17862026599" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#000", color: "#eab308", borderRadius: 6, padding: "14px 32px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", boxShadow: "0 6px 24px rgba(0,0,0,0.4)", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; }}>
              📞 +1 786-202-6599
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
