import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { API_BASE } from "../../config";
import { useInView } from "../../hooks/useInView";

const GRADIENTS = [
  "linear-gradient(135deg,#CC0000,#ff4d4d)",
  "linear-gradient(135deg,#1a1a2e,#CC0000)",
  "linear-gradient(135deg,#0d0d0d,#CC0000)",
];

interface ReviewsStripProps {
  theme?: "dark" | "light";
  onAllReviews?: () => void;
}

interface ReviewDTO {
  id: number;
  username: string;
  rating: number;
  text: string;
  createdAt: string;
  role?: string;
  location?: string;
}

const FALLBACK = [
  { username: "Marcus T.", rating: 5, text: "Best dispatcher I've worked with. Always smooth loads, great communication. Highly recommend Click Express to any driver." },
  { username: "Roberto M.", rating: 5, text: "Professional team, fast bookings and solid rates. They always find the best loads for my route." },
  { username: "Dmitri K.", rating: 5, text: "Switched from another company and never looked back. Great loads, honest communication, fast payment." },
];

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export const ReviewsStrip: React.FC<ReviewsStripProps> = ({ theme = "dark", onAllReviews }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const [hovered, setHovered] = useState<number | null>(null);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const { ref, inView } = useInView<HTMLElement>(0.1);

  useEffect(() => {
    fetch(`${API_BASE}/review?onlyApproved=true`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: ReviewDTO[]) => {
        const top = data
          .sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        if (top.length > 0) setReviews(top);
        else setReviews(FALLBACK as ReviewDTO[]);
      })
      .catch(() => setReviews(FALLBACK as ReviewDTO[]));
  }, []);

  const bg = isDark ? "#080808" : "#f5f5f5";
  const cardBg = isDark ? "#0f0f0f" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
  const quoteColor = isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)";

  return (
    <section ref={ref} style={{ background: bg, padding: "72px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16,
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 20, height: 2, background: "#CC0000", display: "inline-block" }} />
              {lang === "ru" ? "Отзывы клиентов" : "Driver Reviews"}
            </div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,46px)", color: textColor, textTransform: "uppercase", lineHeight: 1 }}>
              {lang === "ru" ? "ЧТО ГОВОРЯТ " : "WHAT DRIVERS "}<span style={{ color: "#CC0000" }}>{lang === "ru" ? "ВОДИТЕЛИ" : "SAY"}</span>
            </h2>
          </div>
          {onAllReviews && (
            <button onClick={onAllReviews} style={{
              padding: "10px 24px", border: "1px solid rgba(204,0,0,0.4)", borderRadius: 4,
              background: "transparent", color: "#CC0000",
              fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1.5,
              textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#CC0000"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#CC0000"; }}>
              {lang === "ru" ? "Все отзывы →" : "All reviews →"}
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {reviews.map((r, i) => (
            <div key={r.id ?? i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: cardBg, border: `1px solid ${hovered === i ? "#CC0000" : cardBorder}`,
                borderRadius: 8, padding: "24px 22px",
                transitionProperty: "border-color, transform, box-shadow, opacity",
                transitionDuration: "0.2s, 0.2s, 0.2s, 0.5s",
                transitionDelay: `0s, 0s, 0s, ${i * 120 + 200}ms`,
                transform: hovered === i ? "translateY(-5px)" : "none",
                boxShadow: hovered === i ? "0 16px 40px rgba(0,0,0,0.4)" : "none",
                opacity: inView ? 1 : 0,
              }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {Array.from({ length: r.rating }).map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#CC0000"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, lineHeight: 1.7, color: quoteColor, marginBottom: 20, fontStyle: "italic" }}>
                "{r.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: GRADIENTS[i % GRADIENTS.length], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 12, color: "#fff" }}>{getInitials(r.username)}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: textColor }}>{r.username}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: subColor, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {r.role && r.location ? `${r.role} · ${r.location}` : r.role || r.location || new Date(r.createdAt).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
