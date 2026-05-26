import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { API_BASE } from "../../config";
import { useInView } from "../../hooks/useInView";

interface ContactSectionProps {
  theme?: "dark" | "light";
}

type Status = "idle" | "sending" | "ok" | "err";

export const ContactSection: React.FC<ContactSectionProps> = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const { ref, inView } = useInView<HTMLElement>(0.1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const bg = isDark ? "#080808" : "#f5f5f5";
  const cardBg = isDark ? "#0f0f0f" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
  const inputBg = isDark ? "#0a0a0a" : "#fafafa";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.13)";

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: inputBg, border: `1px solid ${inputBorder}`,
    borderRadius: 4, outline: "none",
    fontFamily: "'Barlow',sans-serif", fontSize: 13,
    color: textColor, boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, message, origin: "Contact Form", destination: "N/A", equipment: "N/A" }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
    } catch {
      setStatus("err");
    }
  };

  const reset = () => { setFullName(""); setEmail(""); setPhone(""); setMessage(""); setStatus("idle"); };

  const T = {
    title: lang === "ru" ? "СВЯЗАТЬСЯ С НАМИ" : "GET IN TOUCH",
    sub: lang === "ru" ? "Заполните форму — диспетчер ответит в течение часа." : "Fill out the form — our dispatcher will respond within an hour.",
    name: lang === "ru" ? "Полное имя *" : "Full Name *",
    emailL: lang === "ru" ? "Email *" : "Email *",
    phoneL: lang === "ru" ? "Телефон" : "Phone",
    msg: lang === "ru" ? "Сообщение *" : "Message *",
    send: lang === "ru" ? "Отправить" : "Send Message",
    sending: lang === "ru" ? "Отправка..." : "Sending...",
    okTitle: lang === "ru" ? "Сообщение отправлено!" : "Message sent!",
    okText: lang === "ru" ? "Диспетчер свяжется с вами в ближайшее время." : "Our dispatcher will reach out shortly.",
    another: lang === "ru" ? "Отправить ещё" : "Send another",
    errText: lang === "ru" ? "Ошибка. Попробуйте снова." : "Something went wrong. Please try again.",
  };

  return (
    <section ref={ref} style={{ background: bg, padding: "72px clamp(20px,5vw,64px)" }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto", display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 32 : 48, alignItems: "start",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(28px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>

        <div>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 20, height: 2, background: "#CC0000", display: "inline-block" }} />
            {lang === "ru" ? "Контакты" : "Contact Us"}
          </div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,46px)", color: textColor, textTransform: "uppercase", lineHeight: 1, marginBottom: 16 }}>
            {T.title}
          </h2>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: subColor, lineHeight: 1.7, marginBottom: 36 }}>{T.sub}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { icon: "📞", label: lang === "ru" ? "Телефон" : "Phone", value: "+1 786-202-6599", href: "tel:+17862026599" },
              { icon: "✉️", label: "Email", value: "clickexpress.inc@gmail.com", href: "mailto:clickexpress.inc@gmail.com" },
              { icon: "📍", label: lang === "ru" ? "Офис" : "Office", value: "Hallandale Beach, FL 33009" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
                  {item.href
                    ? <a href={item.href} style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: textColor, textDecoration: "none" }}>{item.value}</a>
                    : <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: textColor }}>{item.value}</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 8, padding: "28px 24px" }}>
          {status === "ok" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 24, color: textColor, marginBottom: 8 }}>{T.okTitle}</h3>
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: subColor, marginBottom: 24 }}>{T.okText}</p>
              <button onClick={reset} style={{ padding: "10px 24px", background: "#CC0000", border: "none", borderRadius: 4, color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, cursor: "pointer" }}>{T.another}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder={T.name} style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "#CC0000"; }}
                onBlur={e => { e.currentTarget.style.borderColor = inputBorder; }} />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={T.emailL} style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "#CC0000"; }}
                onBlur={e => { e.currentTarget.style.borderColor = inputBorder; }} />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={T.phoneL} style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "#CC0000"; }}
                onBlur={e => { e.currentTarget.style.borderColor = inputBorder; }} />
              <textarea required rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder={T.msg}
                style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
                onFocus={e => { e.currentTarget.style.borderColor = "#CC0000"; }}
                onBlur={e => { e.currentTarget.style.borderColor = inputBorder; }} />
              {status === "err" && <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: "#CC0000" }}>{T.errText}</p>}
              <button type="submit" disabled={status === "sending"} style={{
                padding: "12px", background: status === "sending" ? "rgba(204,0,0,0.5)" : "#CC0000",
                border: "none", borderRadius: 4, color: "#fff",
                fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1,
                textTransform: "uppercase", cursor: status === "sending" ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => { if (status !== "sending") e.currentTarget.style.background = "#aa0000"; }}
                onMouseLeave={e => { if (status !== "sending") e.currentTarget.style.background = "#CC0000"; }}>
                {status === "sending" ? T.sending : T.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
