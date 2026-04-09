import React, { useState, useContext } from "react";
import { ThemeContext } from "../../theme";
import { useLanguage } from "../../context/LanguageContext";
import type { QuoteFormData } from "../../types/index";

interface QuoteModalProps {
  onClose?: () => void;
  theme?: 'dark' | 'light';
}

const CARGO_TYPES_EN = ["Flatbed", "Stepdeck", "Oversized", "Military", "Construction Equipment", "Steel / Metal", "Pipes", "Machinery", "Other"];
const CARGO_TYPES_RU = ["Открытая платформа", "Ступенчатый прицеп", "Негабаритный груз", "Военный груз", "Строительная техника", "Сталь / Металл", "Трубы", "Оборудование", "Другое"];
const LOAD_TYPES_EN = ["Full Truckload (FTL)", "Partial Load (LTL)"];
const LOAD_TYPES_RU = ["Полная загрузка (FTL)", "Частичная загрузка (LTL)"];

export const QuoteModal: React.FC<QuoteModalProps> = ({ onClose, theme: themeProp }) => {
  const context = useContext(ThemeContext) as { theme?: 'dark' | 'light' };
  const theme = themeProp || context.theme || 'dark';
  const isDark = theme === 'dark';
  const { lang } = useLanguage();
  const isRu = lang === "ru";
  const CARGO_TYPES = isRu ? CARGO_TYPES_RU : CARGO_TYPES_EN;
  const LOAD_TYPES = isRu ? LOAD_TYPES_RU : LOAD_TYPES_EN;

  const [form, setForm] = useState<QuoteFormData & { weight: string; date: string; loadType: string; cargoType: string }>({
    name: "", phone: "", from: "", to: "", cargo: "",
    weight: "", date: "", loadType: "", cargoType: "",
  });
  const [sent, setSent] = useState(false);
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

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.from || !form.to) {
      setError(isRu ? "Пожалуйста, заполните все обязательные поля" : "Please fill in all required fields");
      return;
    }
    setError("");
    setSent(true);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 6, color: isDark ? "#fff" : "#1a1a1a",
    fontSize: 14, fontFamily: "'Barlow',sans-serif",
    outline: "none", boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontFamily: "'Barlow',sans-serif", fontWeight: 700 as const,
    fontSize: 10, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
    letterSpacing: 2, textTransform: "uppercase" as const,
    display: "block", marginBottom: 6,
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: isDark ? "#0f0f0f" : "#fff", border: "1px solid rgba(204,0,0,0.4)", borderRadius: 12, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>

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
            <button onClick={onClose} style={{ background: "#CC0000", color: "#fff", border: "none", borderRadius: 6, padding: "12px 32px", fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>{isRu ? "ЗАКРЫТЬ" : "CLOSE"}</button>
          </div>
        ) : (
          <div style={{ padding: "36px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>{isRu ? "Бесплатная консультация" : "Free Consultation"}</div>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase" }}>{isRu ? "ЗАПРОС ЦЕНЫ" : "GET A QUOTE"}</h3>
              </div>
              <button onClick={onClose} style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: "50%", width: 36, height: 36, color: "#CC0000", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ background: isDark ? "rgba(204,0,0,0.06)" : "rgba(204,0,0,0.04)", border: "1px solid rgba(204,0,0,0.2)", borderRadius: 8, padding: "16px", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>🗺️ {isRu ? "Маршрут" : "Route"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
                <div>
                  <label style={labelStyle}>{isRu ? "Откуда *" : "From *"}</label>
                  <input value={form.from} onChange={e => set("from", e.target.value)} placeholder={isRu ? "Лос-Анджелес, CA" : "Los Angeles, CA"} style={inputStyle} onFocus={e => e.target.style.borderColor = "#CC0000"} onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                </div>
                <div style={{ color: "#CC0000", fontSize: 20, fontWeight: 700, paddingTop: 20 }}>→</div>
                <div>
                  <label style={labelStyle}>{isRu ? "Куда *" : "To *"}</label>
                  <input value={form.to} onChange={e => set("to", e.target.value)} placeholder={isRu ? "Чикаго, IL" : "Chicago, IL"} style={inputStyle} onFocus={e => e.target.style.borderColor = "#CC0000"} onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                </div>
              </div>
            </div>

            {estimate && (
              <div style={{ background: "rgba(0,180,80,0.08)", border: "1px solid rgba(0,180,80,0.25)", borderRadius: 8, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-around" }}>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>{isRu ? "Тип груза" : "Cargo Type"}</label>
                <select value={form.cargoType} onChange={e => set("cargoType", e.target.value)} style={{ ...inputStyle, cursor: "pointer", background: isDark ? "#1a1a1a" : "#fff" }}>
                  <option value="">{isRu ? "Выберите тип..." : "Select type..."}</option>
                  {CARGO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{isRu ? "Тип загрузки" : "Load Type"}</label>
                <select value={form.loadType} onChange={e => set("loadType", e.target.value)} style={{ ...inputStyle, cursor: "pointer", background: isDark ? "#1a1a1a" : "#fff" }}>
                  <option value="">{isRu ? "Выбрать..." : "Select..."}</option>
                  {LOAD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>{isRu ? "Вес (фунты)" : "Weight (lbs)"}</label>
                <input value={form.weight} onChange={e => set("weight", e.target.value)} placeholder="40,000" type="number" style={inputStyle} onFocus={e => e.target.style.borderColor = "#CC0000"} onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
              </div>
              <div>
                <label style={labelStyle}>{isRu ? "Дата отгрузки" : "Pickup Date"}</label>
                <input value={form.date} onChange={e => set("date", e.target.value)} type="date" style={inputStyle} onFocus={e => e.target.style.borderColor = "#CC0000"} onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>{isRu ? "Описание груза" : "Cargo Description"}</label>
              <input value={form.cargo} onChange={e => set("cargo", e.target.value)} placeholder={isRu ? "Стальные трубы, запчасти..." : "Steel pipes, machinery parts..."} style={inputStyle} onFocus={e => e.target.style.borderColor = "#CC0000"} onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
            </div>

            <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, borderRadius: 8, padding: "16px", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>👤 {isRu ? "Контактные данные" : "Contact Info"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>{isRu ? "Ваше имя *" : "Your Name *"}</label>
                  <input value={form.name} onChange={e => set("name", e.target.value)} placeholder={isRu ? "Иван Иванов" : "John Smith"} style={inputStyle} onFocus={e => e.target.style.borderColor = "#CC0000"} onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                </div>
                <div>
                  <label style={labelStyle}>{isRu ? "Телефон *" : "Phone *"}</label>
                  <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" type="tel" style={inputStyle} onFocus={e => e.target.style.borderColor = "#CC0000"} onBlur={e => e.target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                </div>
              </div>
            </div>

            {error && <div style={{ color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}

            <button onClick={handleSubmit} className="btn-split-primary" style={{ width: "100%", background: "#CC0000", color: "#fff", border: "none", borderRadius: 6, padding: "15px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", boxShadow: "0 6px 24px rgba(204,0,0,0.5)" }}>
              {isRu ? "ОТПРАВИТЬ ЗАЯВКУ →" : "SEND REQUEST →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};