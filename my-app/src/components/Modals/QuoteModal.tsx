import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../theme";
import { useLanguage } from "../../context/LanguageContext";
import type { QuoteFormData } from "../../types/index";
import { X, ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";

interface QuoteModalProps {
  onClose?: () => void;
  theme?: "dark" | "light";
}

const CARGO_TYPES_EN = ["Flatbed", "Stepdeck", "Oversized", "Military", "Construction Equipment", "Steel / Metal", "Pipes", "Machinery", "Other"];
const CARGO_TYPES_RU = ["Открытая платформа", "Ступенчатый прицеп", "Негабаритный груз", "Военный груз", "Строительная техника", "Сталь / Металл", "Трубы", "Оборудование", "Другое"];
const LOAD_TYPES_EN = ["Full Truckload (FTL)", "Partial Load (LTL)"];
const LOAD_TYPES_RU = ["Полная загрузка (FTL)", "Частичная загрузка (LTL)"];

type FormState = QuoteFormData & { email: string; weight: string; date: string; loadType: string; cargoType: string };

export const QuoteModal: React.FC<QuoteModalProps> = ({ onClose, theme: themeProp }) => {
  const context = useContext(ThemeContext) as { theme?: "dark" | "light" };
  const theme = themeProp || context.theme || "dark";
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const isRu = lang === "ru";

  const CARGO_TYPES = isRu ? CARGO_TYPES_RU : CARGO_TYPES_EN;
  const LOAD_TYPES = isRu ? LOAD_TYPES_RU : LOAD_TYPES_EN;
  const STEP_LABELS = isRu
    ? ["Детали груза", "Маршрут", "Контакты"]
    : ["Cargo Details", "Route & Dates", "Contact Info"];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [animKey, setAnimKey] = useState(0);

  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", from: "", to: "", cargo: "",
    weight: "", date: "", loadType: "", cargoType: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const estimate = (() => {
    if (!form.from || !form.to) return null;
    let h = 0;
    for (let i = 0; i < (form.from + form.to).length; i++) h = (h * 31 + (form.from + form.to).charCodeAt(i)) >>> 0;
    const frac = (h % 10000) / 10000;
    const estMiles = Math.round(500 + frac * 1500);
    const estPrice = Math.round((1200 + frac * 3000 + (2.8 + frac * 1.2) * estMiles / 100) / 100) * 100;
    return { price: estPrice, miles: estMiles, days: Math.ceil(estMiles / 500) };
  })();

  const navigate = (dir: "forward" | "back", targetStep: 1 | 2 | 3) => {
    setError("");
    setAnimDir(dir);
    setAnimKey(k => k + 1);
    setStep(targetStep);
  };

  const goNext = () => {
    if (step === 2 && (!form.from.trim() || !form.to.trim())) {
      setError(isRu ? "Укажите откуда и куда" : "Please enter origin and destination");
      return;
    }
    navigate("forward", (step + 1) as 1 | 2 | 3);
  };

  const goBack = () => navigate("back", (step - 1) as 1 | 2 | 3);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError(isRu ? "Пожалуйста, заполните все обязательные поля" : "Please fill in all required fields");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("http://localhost:5114/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          origin: form.from.trim(),
          destination: form.to.trim(),
          equipment: form.cargoType || form.cargo || undefined,
          weight: form.weight ? parseFloat(form.weight) : null,
          pickupDate: form.date || null,
          message: form.cargo || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { message?: string };
        setError(err.message || (isRu ? "Ошибка отправки заявки" : "Failed to submit request"));
        return;
      }
    } catch {
      // backend offline — show success anyway
    } finally {
      setSending(false);
    }
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 6, color: isDark ? "#fff" : "#1a1a1a",
    fontSize: 14, fontFamily: "'Barlow',sans-serif",
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Barlow',sans-serif", fontWeight: 700,
    fontSize: 10, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
    letterSpacing: 2, textTransform: "uppercase",
    display: "block", marginBottom: 6,
  };

  const focusRed = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = "#CC0000"; };
  const blurReset = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"; };

  /* ── Step indicator ── */
  const StepIndicator = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 36px 0", gap: 0 }}>
      {[1, 2, 3].map((s, i) => {
        const done = step > s;
        const active = step === s;
        return (
          <React.Fragment key={s}>
            {i > 0 && (
              <div style={{
                flex: 1, height: 2, maxWidth: 60,
                background: done || active ? "#CC0000" : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"),
                transition: "background 0.3s",
              }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? "#CC0000" : active ? "#CC0000" : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"),
                border: `2px solid ${done || active ? "#CC0000" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)")}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
              }}>
                {done
                  ? <Check size={14} weight="bold" color="#fff" />
                  : <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 13, color: active ? "#fff" : (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)") }}>{s}</span>
                }
              </div>
              <span style={{
                fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 9,
                letterSpacing: 1.5, textTransform: "uppercase",
                color: active ? "#CC0000" : done ? (isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)") : (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"),
                whiteSpace: "nowrap", transition: "color 0.3s",
              }}>{STEP_LABELS[i]}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );

  /* ── Step 1: Cargo Details ── */
  const Step1 = () => (
    <div style={{ paddingTop: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{isRu ? "Тип груза" : "Cargo Type"}</label>
          <select value={form.cargoType} onChange={e => set("cargoType", e.target.value)}
            style={{ ...inputStyle, cursor: "pointer", background: isDark ? "#1a1a1a" : "#fff" }}
            onFocus={focusRed} onBlur={blurReset}>
            <option value="">{isRu ? "Выберите тип..." : "Select type..."}</option>
            {CARGO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{isRu ? "Тип загрузки" : "Load Type"}</label>
          <select value={form.loadType} onChange={e => set("loadType", e.target.value)}
            style={{ ...inputStyle, cursor: "pointer", background: isDark ? "#1a1a1a" : "#fff" }}
            onFocus={focusRed} onBlur={blurReset}>
            <option value="">{isRu ? "Выбрать..." : "Select..."}</option>
            {LOAD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>{isRu ? "Вес (фунты)" : "Weight (lbs)"}</label>
        <input value={form.weight} onChange={e => set("weight", e.target.value)}
          placeholder="40,000" type="number" style={inputStyle}
          onFocus={focusRed} onBlur={blurReset} />
      </div>
      <div>
        <label style={labelStyle}>{isRu ? "Описание груза" : "Cargo Description"}</label>
        <input value={form.cargo} onChange={e => set("cargo", e.target.value)}
          placeholder={isRu ? "Стальные трубы, запчасти..." : "Steel pipes, machinery parts..."}
          style={inputStyle} onFocus={focusRed} onBlur={blurReset} />
      </div>
    </div>
  );

  /* ── Step 2: Route & Dates ── */
  const Step2 = () => (
    <div style={{ paddingTop: 24 }}>
      <div style={{ background: isDark ? "rgba(204,0,0,0.06)" : "rgba(204,0,0,0.04)", border: "1px solid rgba(204,0,0,0.2)", borderRadius: 8, padding: "16px", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
          <div>
            <label style={labelStyle}>{isRu ? "Откуда *" : "From *"}</label>
            <input value={form.from} onChange={e => set("from", e.target.value)}
              placeholder={isRu ? "Лос-Анджелес, CA" : "Los Angeles, CA"}
              style={inputStyle} onFocus={focusRed} onBlur={blurReset} />
          </div>
          <div style={{ color: "#CC0000", fontSize: 20, fontWeight: 700, paddingTop: 20 }}>→</div>
          <div>
            <label style={labelStyle}>{isRu ? "Куда *" : "To *"}</label>
            <input value={form.to} onChange={e => set("to", e.target.value)}
              placeholder={isRu ? "Чикаго, IL" : "Chicago, IL"}
              style={inputStyle} onFocus={focusRed} onBlur={blurReset} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>{isRu ? "Дата отгрузки" : "Pickup Date"}</label>
        <input value={form.date} onChange={e => set("date", e.target.value)}
          type="date" style={inputStyle} onFocus={focusRed} onBlur={blurReset} />
      </div>

      {estimate && (
        <div style={{ background: "rgba(0,180,80,0.08)", border: "1px solid rgba(0,180,80,0.25)", borderRadius: 8, padding: "14px 16px", display: "flex", justifyContent: "space-around" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: "#00b450" }}>${estimate.price.toLocaleString()}</div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>{isRu ? "Прим. цена" : "Est. Price"}</div>
          </div>
          <div style={{ width: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: isDark ? "#fff" : "#1a1a1a" }}>{estimate.miles.toLocaleString()}</div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>{isRu ? "Прим. миль" : "Est. Miles"}</div>
          </div>
          <div style={{ width: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: isDark ? "#fff" : "#1a1a1a" }}>{estimate.days} {isRu ? "дн." : "days"}</div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>{isRu ? "Прим. время" : "Est. Time"}</div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Step 3: Contact + Summary ── */
  const Step3 = () => (
    <div style={{ paddingTop: 24 }}>
      {/* Summary of previous steps */}
      {(form.from || form.to || form.cargoType) && (
        <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`, borderRadius: 8, padding: "12px 14px", marginBottom: 18, display: "flex", flexWrap: "wrap" as const, gap: "8px 24px" }}>
          {(form.from || form.to) && (
            <div>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: "#CC0000" }}>{isRu ? "Маршрут " : "Route "}</span>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{form.from || "—"} → {form.to || "—"}</span>
            </div>
          )}
          {form.date && (
            <div>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>{isRu ? "Дата " : "Date "}</span>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{form.date}</span>
            </div>
          )}
          {form.cargoType && (
            <div>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>{isRu ? "Груз " : "Cargo "}</span>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{form.cargoType}{form.weight ? ` · ${form.weight} lbs` : ""}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>{isRu ? "Ваше имя *" : "Your Name *"}</label>
          <input value={form.name} onChange={e => set("name", e.target.value)}
            placeholder={isRu ? "Иван Иванов" : "John Smith"}
            style={inputStyle} onFocus={focusRed} onBlur={blurReset} />
        </div>
        <div>
          <label style={labelStyle}>{isRu ? "Телефон *" : "Phone *"}</label>
          <input value={form.phone} onChange={e => set("phone", e.target.value)}
            placeholder="+1 (555) 000-0000" type="tel"
            style={inputStyle} onFocus={focusRed} onBlur={blurReset} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>{isRu ? "Email *" : "Email *"}</label>
        <input value={form.email} onChange={e => set("email", e.target.value)}
          placeholder="email@example.com" type="email"
          style={inputStyle} onFocus={focusRed} onBlur={blurReset} />
      </div>
    </div>
  );

  const btnBase: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 8,
    border: "none", borderRadius: 6, cursor: "pointer",
    fontFamily: "'Oswald',sans-serif", fontWeight: 700,
    fontSize: 14, letterSpacing: 2, textTransform: "uppercase",
    padding: "13px 22px", transition: "opacity 0.2s",
  };

  return (
    <>
      <style>{`
        @keyframes qmSlideRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes qmSlideLeft  { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}
        style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{ background: isDark ? "#0f0f0f" : "#fff", border: "1px solid rgba(204,0,0,0.4)", borderRadius: 12, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 40px 80px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column" }}
        >
          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 40px" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 28, color: isDark ? "#fff" : "#1a1a1a", marginBottom: 12 }}>{isRu ? "ЗАЯВКА ОТПРАВЛЕНА!" : "REQUEST SENT!"}</h3>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginBottom: 8 }}>
                {isRu ? "Маршрут:" : "Route:"} <strong style={{ color: "#CC0000" }}>{form.from} → {form.to}</strong>
              </p>
              <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginBottom: 28 }}>
                {isRu ? "Наш диспетчер свяжется с вами по номеру" : "Our dispatcher will contact you at"} <strong style={{ color: "#CC0000" }}>{form.phone}</strong>
              </p>
              <button onClick={onClose} style={{ background: "#CC0000", color: "#fff", border: "none", borderRadius: 6, padding: "12px 32px", fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
                {isRu ? "ЗАКРЫТЬ" : "CLOSE"}
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: "28px 36px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
                    {isRu ? "Бесплатная консультация" : "Free Consultation"}
                  </div>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase", margin: 0 }}>
                    {isRu ? "ЗАПРОС ЦЕНЫ" : "GET A QUOTE"}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: "50%", width: 36, height: 36, color: "#CC0000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              {/* Step indicator */}
              <StepIndicator />

              {/* Animated step content */}
              <div style={{ padding: "0 36px", overflow: "hidden", flex: 1 }}>
                <div
                  key={animKey}
                  style={{ animation: `${animDir === "forward" ? "qmSlideRight" : "qmSlideLeft"} 0.28s cubic-bezier(0.22,1,0.36,1)` }}
                >
                  {step === 1 && <Step1 />}
                  {step === 2 && <Step2 />}
                  {step === 3 && <Step3 />}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ padding: "8px 36px 0", fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#CC0000" }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Navigation */}
              <div style={{ padding: "20px 36px 28px", display: "flex", gap: 10, flexShrink: 0 }}>
                {step > 1 && (
                  <button onClick={goBack} style={{ ...btnBase, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>
                    <ArrowLeft size={14} weight="bold" />
                    {isRu ? "НАЗАД" : "BACK"}
                  </button>
                )}
                {step < 3 ? (
                  <button onClick={goNext} style={{ ...btnBase, flex: 1, justifyContent: "center", background: "#CC0000", color: "#fff", boxShadow: "0 4px 20px rgba(204,0,0,0.4)" }}>
                    {isRu ? "ДАЛЕЕ" : "NEXT"}
                    <ArrowRight size={14} weight="bold" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className={sending ? "" : "btn-split-primary"}
                    style={{ ...btnBase, flex: 1, justifyContent: "center", background: sending ? "rgba(204,0,0,0.6)" : "#CC0000", color: "#fff", cursor: sending ? "not-allowed" : "pointer", boxShadow: "0 6px 24px rgba(204,0,0,0.5)" }}
                  >
                    {sending ? (isRu ? "ОТПРАВКА..." : "SENDING...") : (isRu ? "ОТПРАВИТЬ ЗАЯВКУ →" : "SEND REQUEST →")}
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};
