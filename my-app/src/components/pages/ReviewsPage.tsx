import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface ReviewsPageProps {
  theme?: "dark" | "light";
  onBack?: () => void;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

interface ReviewItem {
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
  stars: number;
  isUser?: boolean;
  likes: number;
  dislikes: number;
  comments: Comment[];
}

const AVATAR_COLORS = [
  "linear-gradient(135deg,#CC0000,#880000)",
  "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  "linear-gradient(135deg,#22c55e,#15803d)",
  "linear-gradient(135deg,#f97316,#c2410c)",
  "linear-gradient(135deg,#a855f7,#7e22ce)",
  "linear-gradient(135deg,#eab308,#a16207)",
  "linear-gradient(135deg,#06b6d4,#0e7490)",
  "linear-gradient(135deg,#ec4899,#9d174d)",
];

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 1, stars: 5,
    nameEn: "Marcus T.", nameRu: "Маркус Т.",
    roleEn: "Owner-Operator", roleRu: "Независимый перевозчик",
    commentEn: "Click Express set me up with 3 back-to-back loads in Florida. Dispatcher was available at 2am when I had a breakdown. This is the real deal — not just another dispatch company. Best decision I've made for my trucking business.",
    commentRu: "Click Express обеспечил меня 3 загрузками подряд во Флориде. Диспетчер был доступен в 2 ночи когда сломался. Это серьёзная компания. Лучшее решение для моего бизнеса.",
    initial: "M", avatarColor: AVATAR_COLORS[0],
    date: "Mar 20, 2025", stateEn: "Florida, USA", stateRu: "Флорида, США",
    likes: 24, dislikes: 1, comments: [],
  },
  {
    id: 2, stars: 5,
    nameEn: "Dmitri K.", nameRu: "Дмитрий К.",
    roleEn: "CDL-A Driver", roleRu: "Водитель CDL-A",
    commentEn: "We've been working with Click Express for 8 months. Loads are always great, rates are fair, dispatcher is always in touch. Highly recommend to all owner-operators!",
    commentRu: "Работаем с Click Express уже 8 месяцев. Лоты всегда хорошие, ставки честные, диспетчер всегда на связи. Рекомендую всем owner-операторам!",
    initial: "Д", avatarColor: AVATAR_COLORS[1],
    date: "Mar 14, 2025", stateEn: "Texas, USA", stateRu: "Техас, США",
    likes: 18, dislikes: 0, comments: [],
  },
  {
    id: 3, stars: 5,
    nameEn: "James W.", nameRu: "Джеймс У.",
    roleEn: "Fleet Owner", roleRu: "Владелец автопарка",
    commentEn: "Switched from 2 other dispatch companies. Night and day difference. Click Express actually hustles for their drivers. My entire fleet runs with them now.",
    commentRu: "Перешёл от 2 других диспетчерских. Небо и земля. Click Express реально работает за своих водителей. Теперь весь мой автопарк работает с ними.",
    initial: "J", avatarColor: AVATAR_COLORS[2],
    date: "Mar 10, 2025", stateEn: "Georgia, USA", stateRu: "Джорджия, США",
    likes: 31, dislikes: 2, comments: [],
  },
  {
    id: 4, stars: 5,
    nameEn: "Artem S.", nameRu: "Артём С.",
    roleEn: "Independent Trucker", roleRu: "Независимый дальнобойщик",
    commentEn: "Fantastic service. Got a military load with $9.44/mi on my first week. I've doubled my weekly income since joining Click Express.",
    commentRu: "Фантастический сервис. Получил военный груз за $9.44/ми на первой же неделе. Мой доход удвоился с Click Express.",
    initial: "А", avatarColor: AVATAR_COLORS[3],
    date: "Feb 28, 2025", stateEn: "California, USA", stateRu: "Калифорния, США",
    likes: 22, dislikes: 1, comments: [],
  },
  {
    id: 5, stars: 5,
    nameEn: "Roberto M.", nameRu: "Роберто М.",
    roleEn: "Flatbed Specialist", roleRu: "Специалист по платформам",
    commentEn: "5 stars isn't enough. These guys found me a $19,499 multi-stop military run. Their network is incredible and the support is 24/7. Zero downtime, always loaded.",
    commentRu: "5 звёзд недостаточно. Ребята нашли мне маршрут за $19,499. Их сеть невероятна, поддержка 24/7. Ноль простоев, всегда загружен.",
    initial: "R", avatarColor: AVATAR_COLORS[4],
    date: "Feb 20, 2025", stateEn: "Nevada, USA", stateRu: "Невада, США",
    likes: 29, dislikes: 0, comments: [],
  },
  {
    id: 6, stars: 5,
    nameEn: "Olena P.", nameRu: "Олена П.",
    roleEn: "Owner-Operator", roleRu: "Независимый перевозчик",
    commentEn: "I was skeptical at first but Click Express proved me wrong. They handled all paperwork, found premium loads, and their dispatcher speaks Russian. Truly a top-tier service.",
    commentRu: "Сначала была скептически настроена, но Click Express доказал обратное. Взяли на себя всё оформление, нашли премиальные грузы. Сервис высшего уровня.",
    initial: "О", avatarColor: AVATAR_COLORS[5],
    date: "Feb 15, 2025", stateEn: "Colorado, USA", stateRu: "Колорадо, США",
    likes: 16, dislikes: 1, comments: [],
  },
  {
    id: 7, stars: 5,
    nameEn: "Kevin L.", nameRu: "Кевин Л.",
    roleEn: "Long-Haul Driver", roleRu: "Дальнобойщик",
    commentEn: "Consistent loads, great communication, and they actually care about the drivers. I've run coast-to-coast routes with $3.73/mi average. Highly recommend.",
    commentRu: "Стабильные грузы, отличная связь, и они реально заботятся о водителях. Ездил по маршрутам побережье-побережье со средней ставкой $3.73/ми. Рекомендую.",
    initial: "K", avatarColor: AVATAR_COLORS[6],
    date: "Feb 8, 2025", stateEn: "Washington, USA", stateRu: "Вашингтон, США",
    likes: 20, dislikes: 0, comments: [],
  },
  {
    id: 8, stars: 5,
    nameEn: "Sergei V.", nameRu: "Сергей В.",
    roleEn: "CDL-A, Oversized Loads", roleRu: "CDL-A, Негабаритные грузы",
    commentEn: "Click Express specializes in oversized and military freight — exactly what I needed. Got permits handled in hours, not days. The $4.72/mi flatbed load they booked was one of the best of my career.",
    commentRu: "Click Express специализируется на негабаритных и военных грузах — именно то, что мне нужно. Разрешения оформили за часы, не дни.",
    initial: "С", avatarColor: AVATAR_COLORS[0],
    date: "Jan 30, 2025", stateEn: "Pennsylvania, USA", stateRu: "Пенсильвания, США",
    likes: 27, dislikes: 2, comments: [],
  },
];

function StarPicker({ value, onChange, size = 28 }: { value: number; onChange: (n: number) => void; size?: number }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          style={{
            color: i <= (hovered || value) ? "#eab308" : "rgba(200,180,0,0.2)",
            fontSize: size,
            cursor: "pointer",
            transition: "color 0.12s, transform 0.1s",
            transform: i <= (hovered || value) ? "scale(1.18)" : "scale(1)",
            display: "inline-block",
          }}
        >★</span>
      ))}
    </span>
  );
}

function StarDisplay({ n, size = 15 }: { n: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? "#eab308" : "rgba(200,180,0,0.2)", fontSize: size }}>★</span>
      ))}
    </span>
  );
}

const STAR_LABELS: Record<number, { en: string; ru: string }> = {
  1: { en: "Poor", ru: "Плохо" },
  2: { en: "Fair", ru: "Слабо" },
  3: { en: "Good", ru: "Хорошо" },
  4: { en: "Very Good", ru: "Очень хорошо" },
  5: { en: "Excellent", ru: "Отлично" },
};

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ theme = "dark", onBack }) => {
  const { lang } = useLanguage();
  const isDark = theme === "dark";

  const bg          = isDark ? "#080808" : "#f5f5f5";
  const cardBg      = isDark ? "#0f0f0f" : "#ffffff";
  const cardBorder  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const textPrimary = isDark ? "#ffffff" : "#1a1a1a";
  const textMuted   = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";
  const textSubtle  = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)";
  const inputBg     = isDark ? "#1a1a1a" : "#f8f8f8";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";

  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [votes, setVotes] = useState<Record<number, "like" | "dislike" | null>>({});
  const [openComments, setOpenComments] = useState<Set<number>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [commentAuthorInputs, setCommentAuthorInputs] = useState<Record<number, string>>({});

 // New review form
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formStars, setFormStars] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const avgStars = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.stars, 0) / reviews.length) * 10) / 10
    : 0;

  const handleVote = (reviewId: number, type: "like" | "dislike") => {
    const prev = votes[reviewId];
    if (prev === type) {
      setVotes(v => ({ ...v, [reviewId]: null }));
      setReviews(rs => rs.map(r => r.id === reviewId
        ? { ...r, likes: type === "like" ? r.likes - 1 : r.likes, dislikes: type === "dislike" ? r.dislikes - 1 : r.dislikes }
        : r));
    } else {
      setVotes(v => ({ ...v, [reviewId]: type }));
      setReviews(rs => rs.map(r => {
        if (r.id !== reviewId) return r;
        let likes = r.likes;
        let dislikes = r.dislikes;
        if (prev === "like") likes--;
        if (prev === "dislike") dislikes--;
        if (type === "like") likes++;
        if (type === "dislike") dislikes++;
        return { ...r, likes, dislikes };
      }));
    }
  };

  const toggleComments = (id: number) => {
    setOpenComments(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submitComment = (reviewId: number) => {
    const text = (commentInputs[reviewId] || "").trim();
    const author = (commentAuthorInputs[reviewId] || "").trim();
    if (!text) return;
    const now = new Date();
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newComment: Comment = { id: Date.now(), author: author || (lang === "ru" ? "Аноним" : "Anonymous"), text, date };
    setReviews(rs => rs.map(r => r.id === reviewId ? { ...r, comments: [...r.comments, newComment] } : r));
    setCommentInputs(c => ({ ...c, [reviewId]: "" }));
    setCommentAuthorInputs(c => ({ ...c, [reviewId]: "" }));
  };

  const submitReview = () => {
    if (!formName.trim()) { setFormError(lang === "ru" ? "Введите имя" : "Enter your name"); return; }
    if (!formComment.trim()) { setFormError(lang === "ru" ? "Напишите отзыв" : "Write a review"); return; }
    if (formComment.trim().length < 20) { setFormError(lang === "ru" ? "Отзыв слишком короткий (мин. 20 символов)" : "Review too short (min 20 chars)"); return; }
    setFormError("");
    const initials = formName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const color = AVATAR_COLORS[reviews.length % AVATAR_COLORS.length];
    const now = new Date();
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newReview: ReviewItem = {
      id: Date.now(),
      nameEn: formName.trim(), nameRu: formName.trim(),
      roleEn: formRole.trim() || (lang === "ru" ? "Пользователь" : "User"),
      roleRu: formRole.trim() || "Пользователь",
      commentEn: formComment.trim(), commentRu: formComment.trim(),
      initial: initials || "?",
      avatarColor: color,
      date, stateEn: "", stateRu: "",
      stars: formStars,
      isUser: true,
      likes: 0, dislikes: 0, comments: [],
    };
    setReviews(rs => [newReview, ...rs]);
    setFormName(""); setFormRole(""); setFormStars(5); setFormComment("");
    setFormSubmitted(true);
    setShowForm(false);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  const inputStyle = {
    width: "100%",
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    borderRadius: 6,
    padding: "10px 14px",
    fontFamily: "'Barlow',sans-serif",
    fontSize: 14,
    color: textPrimary,
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textPrimary }}>
      <style>{`
        @keyframes revSlideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes revPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes revFadeIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        .rev-card { transition: all 0.22s ease !important; }
        .rev-card:hover { transform:translateY(-4px) !important; border-color:rgba(234,179,8,0.45) !important; box-shadow:0 14px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(234,179,8,0.15) !important; }
        .vote-btn { transition: all 0.15s !important; }
        .vote-btn:hover { transform: scale(1.08) !important; }
        .rev-input:focus { border-color: #eab308 !important; }
        .rev-textarea:focus { border-color: #eab308 !important; }
        .form-submit:hover { background: #ca9f00 !important; transform: translateY(-1px) !important; }
      `}</style>

 {/* HERO */}
      <div style={{
        position: "relative",
        minHeight: 420,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}>
 {/* Background truck photo */}
        <img
          src={isDark ? "/images/red freightliner cascadia night.PNG" : "/images/red freightliner cascadia light.png"}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "right center", filter: isDark ? "brightness(0.45)" : "none", pointerEvents: "none" }}
        />
 {/* Gradient: dark on left for text, transparent on right for truck */}
        <div style={{ position: "absolute", inset: 0, background: isDark
          ? "linear-gradient(to right, rgba(6,4,0,0.97) 0%, rgba(6,4,0,0.82) 42%, rgba(6,4,0,0.2) 68%, transparent 100%)"
          : "linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.82) 42%, rgba(255,255,255,0.1) 68%, transparent 100%)",
          pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#eab308" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,#eab308 30%,#fde047 60%,#eab308 80%,transparent)" }} />

        <div style={{ position: "relative", width: "100%", padding: "90px clamp(20px,5vw,64px) 56px" }}>

        <div style={{ maxWidth: 900, animation: "revSlideUp 0.6s ease both" }}>
          <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 1, cursor: "pointer", padding: "0 0 20px", transition: "color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#eab308"; }}
            onMouseLeave={e => { e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"; }}>
            ← {lang === "ru" ? "Назад" : "Back"}
          </button>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.35)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#eab308", animation: "revPulse 1.4s ease infinite", display: "inline-block" }} />
            <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 10, color: "#eab308", letterSpacing: 3, textTransform: "uppercase" }}>
              {lang === "ru" ? "Отзывы клиентов" : "Client Reviews"}
            </span>
          </div>

          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(42px,7vw,88px)", textTransform: "uppercase", lineHeight: 0.9, margin: "0 0 16px", color: textPrimary }}>
            {lang === "ru" ? <><span style={{ color: "#eab308" }}>CLICK EXPRESS</span><br />ОТЗЫВЫ</> : <><span style={{ color: "#eab308" }}>CLICK EXPRESS</span><br />REVIEWS</>}
          </h1>

          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 16, color: textMuted, maxWidth: 520, lineHeight: 1.75, margin: 0 }}>
            {lang === "ru" ? "Реальные отзывы водителей и owner-операторов, которые доверяют Click Express." : "Real reviews from drivers and owner-operators who trust Click Express."}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-flex", gap: 3 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(avgStars) ? "#eab308" : "rgba(200,180,0,0.25)", fontSize: 26 }}>★</span>)}
              </span>
              <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: textPrimary }}>{avgStars.toFixed(1)}</span>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: textSubtle }}>
                {lang === "ru" ? `${reviews.length} отзывов` : `${reviews.length} reviews`}
              </span>
            </div>
            <button
              onClick={() => setShowForm(f => !f)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: showForm ? "rgba(234,179,8,0.15)" : "#eab308", color: showForm ? "#eab308" : "#000", border: showForm ? "1px solid #eab308" : "none", borderRadius: 6, padding: "10px 22px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", transition: "all 0.18s" }}
            >
              {showForm ? (lang === "ru" ? "✕ ОТМЕНА" : "✕ CANCEL") : (lang === "ru" ? "+ НАПИСАТЬ ОТЗЫВ" : "+ WRITE A REVIEW")}
            </button>
          </div>

 {/* Success toast */}
          {formSubmitted && (
            <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: 8, padding: "10px 18px", animation: "revFadeIn 0.3s ease both" }}>
              <span style={{ color: "#22c55e", fontSize: 16 }}>✓</span>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: "#22c55e" }}>
                {lang === "ru" ? "Спасибо! Ваш отзыв опубликован." : "Thank you! Your review has been published."}
              </span>
            </div>
          )}
        </div>

          <div style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", fontSize: 160, opacity: isDark ? 0.04 : 0.05, userSelect: "none", pointerEvents: "none" }}>★</div>
        </div>
      </div>

 {/* WRITE REVIEW FORM */}
      {showForm && (
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px clamp(20px,4vw,56px) 0", animation: "revFadeIn 0.3s ease both" }}>
          <div style={{ background: cardBg, border: `1px solid ${isDark ? "rgba(234,179,8,0.25)" : "rgba(234,179,8,0.35)"}`, borderRadius: 14, padding: "32px 36px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#eab308,#fde04760,transparent)" }} />
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: textPrimary, textTransform: "uppercase", marginBottom: 24, letterSpacing: 1 }}>
              {lang === "ru" ? "ОСТАВИТЬ ОТЗЫВ" : "LEAVE A REVIEW"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: textSubtle, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  {lang === "ru" ? "Имя *" : "Name *"}
                </label>
                <input
                  className="rev-input"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder={lang === "ru" ? "Ваше имя" : "Your name"}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: textSubtle, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  {lang === "ru" ? "Должность / Роль" : "Role / Title"}
                </label>
                <input
                  className="rev-input"
                  value={formRole}
                  onChange={e => setFormRole(e.target.value)}
                  placeholder={lang === "ru" ? "Водитель CDL-A, Owner-Operator..." : "CDL-A Driver, Owner-Operator..."}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: textSubtle, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 10 }}>
                {lang === "ru" ? "Ваша оценка *" : "Your Rating *"}
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <StarPicker value={formStars} onChange={setFormStars} size={36} />
                {formStars > 0 && (
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: "#eab308" }}>
                    {lang === "ru" ? STAR_LABELS[formStars].ru : STAR_LABELS[formStars].en}
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: textSubtle, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                {lang === "ru" ? "Отзыв *" : "Review *"}
              </label>
              <textarea
                className="rev-textarea"
                value={formComment}
                onChange={e => setFormComment(e.target.value)}
                placeholder={lang === "ru" ? "Поделитесь вашим опытом работы с Click Express..." : "Share your experience with Click Express..."}
                rows={4}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
              <div style={{ textAlign: "right", fontFamily: "'Barlow',sans-serif", fontSize: 11, color: textSubtle, marginTop: 4 }}>
                {formComment.length} {lang === "ru" ? "симв." : "chars"} {lang === "ru" ? "(мин. 20)" : "(min. 20)"}
              </div>
            </div>

            {formError && (
              <div style={{ marginBottom: 16, fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#f87171", fontWeight: 600 }}>
                ⚠ {formError}
              </div>
            )}

            <button
              className="form-submit"
              onClick={submitReview}
              style={{ background: "#eab308", color: "#000", border: "none", borderRadius: 6, padding: "12px 32px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 4px 18px rgba(234,179,8,0.35)" }}
            >
              {lang === "ru" ? "ОПУБЛИКОВАТЬ ОТЗЫВ" : "PUBLISH REVIEW"}
            </button>
          </div>
        </div>
      )}

 {/* REVIEWS GRID */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px clamp(20px,4vw,56px) 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 24 }}>
          {reviews.map((review, idx) => {
            const userVote = votes[review.id];
            const commentsOpen = openComments.has(review.id);
            const commentText = commentInputs[review.id] || "";
            const commentAuthor = commentAuthorInputs[review.id] || "";
            return (
              <div key={review.id} className="rev-card" style={{
                background: cardBg,
                border: `1px solid ${review.isUser ? "rgba(234,179,8,0.3)" : cardBorder}`,
                borderRadius: 14,
                overflow: "hidden",
                animation: `revSlideUp 0.4s ease ${Math.min(idx, 6) * 0.05}s both`,
                position: "relative",
              }}>
 {/* Top accent */}
                <div style={{ height: 3, background: review.isUser ? "linear-gradient(90deg,#eab308,#fde047,transparent)" : `linear-gradient(90deg,#eab308,rgba(234,179,8,0.3),transparent)` }} />

                <div style={{ padding: "22px 24px 0" }}>
 {/* User badge */}
                  {review.isUser && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: 10, padding: "2px 10px", marginBottom: 10, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 9, color: "#eab308", letterSpacing: 2, textTransform: "uppercase" }}>
                      ✓ {lang === "ru" ? "Новый отзыв" : "New review"}
                    </div>
                  )}

 {/* Stars */}
                  <div style={{ marginBottom: 12 }}>
                    <StarDisplay n={review.stars} />
                  </div>

 {/* Quote decoration */}
                  <div style={{ position: "absolute", right: 20, top: 18, fontSize: 70, color: isDark ? "rgba(234,179,8,0.05)" : "rgba(234,179,8,0.08)", fontFamily: "Georgia,serif", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>"</div>

 {/* Comment */}
                  <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13.5, color: textMuted, lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>
                    "{lang === "ru" ? review.commentRu : review.commentEn}"
                  </p>

 {/* Author */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: review.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.25)" }}>
                      {review.initial}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 13.5, color: textPrimary }}>
                        {lang === "ru" ? review.nameRu : review.nameEn}
                      </div>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: "#eab308", fontWeight: 600 }}>
                        {lang === "ru" ? review.roleRu : review.roleEn}
                      </div>
                      {(review.stateEn || review.date) && (
                        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: textSubtle, marginTop: 1 }}>
                          {lang === "ru" ? review.stateRu : review.stateEn}{review.stateEn ? " · " : ""}{review.date}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

 {/* ACTIONS ROW */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
 {/* Like */}
                  <button
                    className="vote-btn"
                    onClick={() => handleVote(review.id, "like")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, background: userVote === "like" ? "rgba(34,197,94,0.15)" : "transparent", border: `1px solid ${userVote === "like" ? "rgba(34,197,94,0.5)" : inputBorder}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: userVote === "like" ? "#22c55e" : textSubtle, transition: "all 0.15s" }}
                  >
                    <span style={{ fontSize: 14 }}>👍</span> {review.likes}
                  </button>

 {/* Dislike */}
                  <button
                    className="vote-btn"
                    onClick={() => handleVote(review.id, "dislike")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, background: userVote === "dislike" ? "rgba(239,68,68,0.12)" : "transparent", border: `1px solid ${userVote === "dislike" ? "rgba(239,68,68,0.45)" : inputBorder}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: userVote === "dislike" ? "#ef4444" : textSubtle, transition: "all 0.15s" }}
                  >
                    <span style={{ fontSize: 14 }}>👎</span> {review.dislikes}
                  </button>

 {/* Comments toggle */}
                  <button
                    onClick={() => toggleComments(review.id)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, background: commentsOpen ? "rgba(59,130,246,0.12)" : "transparent", border: `1px solid ${commentsOpen ? "rgba(59,130,246,0.4)" : inputBorder}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: commentsOpen ? "#3b82f6" : textSubtle, transition: "all 0.15s", marginLeft: "auto" }}
                  >
                    <span style={{ fontSize: 13 }}>💬</span>
                    {review.comments.length > 0 ? review.comments.length : ""} {lang === "ru" ? (commentsOpen ? "Скрыть" : "Комментарии") : (commentsOpen ? "Hide" : "Comments")}
                  </button>
                </div>

 {/* COMMENTS SECTION */}
                {commentsOpen && (
                  <div style={{ padding: "0 24px 20px", animation: "revFadeIn 0.25s ease both" }}>
 {/* Existing comments */}
                    {review.comments.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        {review.comments.map(c => (
                          <div key={c.id} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: 8, padding: "10px 14px", marginBottom: 8, borderLeft: "2px solid rgba(59,130,246,0.4)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 12, color: "#3b82f6" }}>{c.author}</span>
                              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: textSubtle }}>{c.date}</span>
                            </div>
                            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: textMuted, lineHeight: 1.6, margin: 0 }}>{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

 {/* New comment form */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input
                        className="rev-input"
                        value={commentAuthor}
                        onChange={e => setCommentAuthorInputs(c => ({ ...c, [review.id]: e.target.value }))}
                        placeholder={lang === "ru" ? "Ваше имя (необязательно)" : "Your name (optional)"}
                        style={{ ...inputStyle, fontSize: 13 }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          className="rev-input"
                          value={commentText}
                          onChange={e => setCommentInputs(c => ({ ...c, [review.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === "Enter") submitComment(review.id); }}
                          placeholder={lang === "ru" ? "Написать комментарий..." : "Write a comment..."}
                          style={{ ...inputStyle, fontSize: 13, flex: 1 }}
                        />
                        <button
                          onClick={() => submitComment(review.id)}
                          disabled={!commentText.trim()}
                          style={{ background: commentText.trim() ? "#3b82f6" : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"), color: commentText.trim() ? "#fff" : textSubtle, border: "none", borderRadius: 6, padding: "0 16px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, cursor: commentText.trim() ? "pointer" : "not-allowed", transition: "all 0.15s", whiteSpace: "nowrap" }}
                        >
                          {lang === "ru" ? "ОТПРАВИТЬ" : "SEND"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
              📞 +1 786-202-6599
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
