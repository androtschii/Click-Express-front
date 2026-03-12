import React, { useState, useContext } from "react";
import { ThemeContext } from "../theme";
import type { QuoteFormData } from "../types/index";

interface QuoteModalProps {
  onClose?: () => void;
  theme?: 'dark' | 'light';
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ onClose, theme: themeProp }) => {
  const [form, setForm] = useState<QuoteFormData>({
    name: "",
    phone: "",
    from: "",
    to: "",
    cargo: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (field: keyof QuoteFormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = () => {
    const { name, phone, from, to } = form;
    if (name && phone && from && to) setSent(true);
  };

  // Use any type to avoid theme context type issues - the app uses dark theme by default
  const context = useContext(ThemeContext) as { theme?: 'dark' | 'light'; toggleTheme?: () => void };
  const theme = themeProp || context.theme || 'dark';
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: theme === 'dark' ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: theme === 'dark' ? "#0f0f0f" : "#fff",
          border: "1px solid rgba(204,0,0,0.4)",
          borderRadius: 10,
          padding: "40px",
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(204,0,0,0.15)",
        }}
      >
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h3
              style={{
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 700,
                fontSize: 28,
                color: "#fff",
                marginBottom: 12,
              }}
            >
              REQUEST SENT!
            </h3>
            <p
              style={{
                fontFamily: "'Barlow',sans-serif",
                color: "rgba(255,255,255,0.5)",
                marginBottom: 28,
              }}
            >
              Our dispatch team will contact you shortly at {form.phone}
            </p>
            <button
              onClick={onClose}
              style={{
                background: "#CC0000",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "12px 32px",
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              CLOSE
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Barlow',sans-serif",
                    fontWeight: 700,
                    fontSize: 10,
                    color: "#CC0000",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Free Consultation
                </div>
                <h3
                  style={{
                    fontFamily: "'Oswald',sans-serif",
                    fontWeight: 700,
                    fontSize: 26,
                    color: "#fff",
                    textTransform: "uppercase",
                  }}
                >
                  GET A QUOTE
                </h3>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {(() => {
              const fields: Array<[string, string, (v: string) => void, string, string]> = [
                ["Your Name *", form.name, v => handleChange("name", v), "text", "John Smith"],
                ["Phone Number *", form.phone, v => handleChange("phone", v), "tel", "+1 (555) 000-0000"],
                ["From (City, State) *", form.from, v => handleChange("from", v), "text", "Los Angeles, CA"],
                ["To (City, State) *", form.to, v => handleChange("to", v), "text", "Chicago, IL"],
                ["Cargo Description", form.cargo, v => handleChange("cargo", v), "text", "Steel pipes, 40,000 lbs"],
              ];
              return fields.map(([label, val, setter, type, ph]) => (
                <div key={label} style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      fontFamily: "'Barlow',sans-serif",
                      fontWeight: 700,
                      fontSize: 10,
                      color: theme === 'dark' ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    value={val}
                    onChange={e => setter(e.target.value)}
                    placeholder={ph}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      background: theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 4,
                      color: theme === 'dark' ? "#fff" : "#000",
                      fontSize: 14,
                      fontFamily: "'Barlow',sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#CC0000")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              ));
            })()}

            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                background: "#CC0000",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "14px",
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                marginTop: 8,
                boxShadow: "0 6px 24px rgba(204,0,0,0.5)",
              }}
            >
              SEND REQUEST →
            </button>
          </>
        )}
      </div>
    </div>
  );
};

