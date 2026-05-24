import React, { useState } from "react";
import { ArrowLeft, TruckTrailer, CheckCircle, Star, ClipboardText, Phone, Envelope, IdentificationCard, MapPin } from "@phosphor-icons/react";
import { API_BASE } from "../../config";

interface Props {
  theme: string;
  onBack: () => void;
}

const POSITIONS = ["OTR Driver (CDL-A)", "Team Driver", "Local/Regional Driver", "Flatbed Specialist", "Reefer Driver", "Hazmat Certified Driver"];

const PERKS = [
  { icon: "💵", title: "Top Pay", desc: "Competitive CPM rates + bonuses" },
  { icon: "🗓️", title: "Home Time", desc: "Flexible home time options" },
  { icon: "🚛", title: "New Equipment", desc: "2022–2025 model year trucks" },
  { icon: "⚕️", title: "Benefits", desc: "Health, dental & vision coverage" },
  { icon: "📍", title: "Fuel Card", desc: "Comdata fuel card accepted nationwide" },
  { icon: "📞", title: "24/7 Dispatch", desc: "Always-on dispatcher support" },
];

const FAQS = [
  { q: "What CDL class is required?", a: "CDL-A is required for all OTR positions. CDL-B may qualify for local routes." },
  { q: "Is experience required?", a: "We hire experienced drivers. Minimum 6 months verifiable OTR experience preferred." },
  { q: "What lanes do you run?", a: "Primarily Southeast, Midwest, and national OTR lanes. We match lanes to your home state." },
  { q: "How soon can I start?", a: "After MVR/background check approval, typically within 5–10 business days." },
];

export const DriverSignupPage: React.FC<Props> = ({ theme, onBack }) => {
  const isDark = theme === "dark";
  const bg = isDark ? "#0a0a0a" : "#f5f5f5";
  const card = isDark ? "#111" : "#fff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const text = isDark ? "#fff" : "#1a1a1a";
  const muted = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  const [form, setForm] = useState({ name: "", email: "", phone: "", cdlClass: "CDL-A", experience: "", position: POSITIONS[0], state: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setError("Name and phone are required."); return; }
    setLoading(true);
    setError("");
    try {
      const payload = {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        position: `${form.position} — ${form.cdlClass}`,
        message: `State: ${form.state} | Experience: ${form.experience} yrs | ${form.message}`.trim(),
      };
      const res = await fetch(`${API_BASE}/jobapplication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else setError("Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 6, boxSizing: "border-box",
    background: isDark ? "rgba(255,255,255,0.05)" : "#f8f8f8",
    border: `1px solid ${border}`, color: text,
    fontFamily: "'Barlow',sans-serif", fontSize: 14, outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px 80px" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#CC0000", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", marginBottom: 36, padding: 0 }}>
          <ArrowLeft size={16} weight="bold" /> Back
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <CheckCircle size={64} color="#22c55e" weight="duotone" />
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 32, color: text, marginTop: 20 }}>Application Received!</h2>
            <p style={{ color: muted, fontFamily: "'Barlow',sans-serif", fontSize: 16, maxWidth: 420, margin: "12px auto 0" }}>Our recruiting team will reach out within 1–2 business days. We look forward to having you on the road with us.</p>
            <button onClick={onBack} style={{ marginTop: 32, background: "#CC0000", color: "#fff", border: "none", borderRadius: 6, padding: "12px 28px", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Back to Home</button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
                <TruckTrailer size={14} color="#CC0000" />
                <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: "#CC0000", letterSpacing: 2, textTransform: "uppercase" }}>Now Hiring CDL-A Drivers</span>
              </div>
              <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 44, color: text, lineHeight: 1.1, marginBottom: 14 }}>
                Drive With <span style={{ color: "#CC0000" }}>Click Express</span>
              </h1>
              <p style={{ color: muted, fontFamily: "'Barlow',sans-serif", fontSize: 16, maxWidth: 540, margin: "0 auto" }}>
                Join our growing fleet of professional drivers. Competitive rates, great equipment, and dispatchers who actually pick up the phone.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 48 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} color="#f59e0b" weight="fill" />)}
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: muted }}>4.9/5 average driver satisfaction</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 56 }}>
              {PERKS.map(p => (
                <div key={p.title} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: text, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: muted, lineHeight: 1.4 }}>{p.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
              <div>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: text, marginBottom: 24, textTransform: "uppercase" }}>Apply Now</h2>
                {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#ef4444" }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 5 }}>Full Name *</label>
                      <div style={{ position: "relative" }}>
                        <IdentificationCard size={14} color="#CC0000" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                        <input name="name" value={form.name} onChange={handleChange} placeholder="John Smith" required style={{ ...inputStyle, paddingLeft: 32 }} onFocus={e => { e.target.style.borderColor = "#CC0000"; }} onBlur={e => { e.target.style.borderColor = border; }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 5 }}>Phone *</label>
                      <div style={{ position: "relative" }}>
                        <Phone size={14} color="#CC0000" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required style={{ ...inputStyle, paddingLeft: 32 }} onFocus={e => { e.target.style.borderColor = "#CC0000"; }} onBlur={e => { e.target.style.borderColor = border; }} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 5 }}>Email</label>
                    <div style={{ position: "relative" }}>
                      <Envelope size={14} color="#CC0000" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" style={{ ...inputStyle, paddingLeft: 32 }} onFocus={e => { e.target.style.borderColor = "#CC0000"; }} onBlur={e => { e.target.style.borderColor = border; }} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 5 }}>CDL Class</label>
                      <select name="cdlClass" value={form.cdlClass} onChange={handleChange} style={{ ...inputStyle }}>
                        <option>CDL-A</option>
                        <option>CDL-B</option>
                        <option>Non-CDL</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 5 }}>Experience (yrs)</label>
                      <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 3" style={inputStyle} onFocus={e => { e.target.style.borderColor = "#CC0000"; }} onBlur={e => { e.target.style.borderColor = border; }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 5 }}>Position</label>
                    <select name="position" value={form.position} onChange={handleChange} style={inputStyle}>
                      {POSITIONS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 5 }}>Home State</label>
                    <div style={{ position: "relative" }}>
                      <MapPin size={14} color="#CC0000" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                      <input name="state" value={form.state} onChange={handleChange} placeholder="e.g. Florida" style={{ ...inputStyle, paddingLeft: 32 }} onFocus={e => { e.target.style.borderColor = "#CC0000"; }} onBlur={e => { e.target.style.borderColor = border; }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 5 }}>Additional Notes</label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Endorsements, preferred lanes, questions..." rows={3} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => { e.target.style.borderColor = "#CC0000"; }} onBlur={e => { e.target.style.borderColor = border; }} />
                  </div>

                  <button type="submit" disabled={loading} style={{ background: loading ? "#999" : "#CC0000", color: "#fff", border: "none", borderRadius: 6, padding: "13px", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 20px rgba(204,0,0,0.4)", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <ClipboardText size={16} weight="bold" />
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </div>

              <div>
                <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "28px 24px", marginBottom: 24 }}>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 20, color: text, marginBottom: 8, textTransform: "uppercase" }}>Talk to a Recruiter</h3>
                  <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: muted, marginBottom: 20, lineHeight: 1.5 }}>Prefer to call? Our recruiting team is available Mon–Fri 8 AM – 6 PM EST.</p>
                  <a href="tel:+17862026599" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 18 }}>
                    <Phone size={20} weight="fill" />+1 786-202-6599
                  </a>
                </div>

                <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "28px 24px" }}>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 20, color: text, marginBottom: 20, textTransform: "uppercase" }}>FAQ</h3>
                  {FAQS.map((f, i) => (
                    <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${border}` : "none", paddingBottom: 14, marginBottom: 14 }}>
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ background: "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0, color: text, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13 }}>
                        {f.q}
                        <span style={{ color: "#CC0000", fontSize: 18, lineHeight: 1, flexShrink: 0, marginLeft: 8 }}>{openFaq === i ? "−" : "+"}</span>
                      </button>
                      {openFaq === i && (
                        <p style={{ marginTop: 8, fontFamily: "'Barlow',sans-serif", fontSize: 12, color: muted, lineHeight: 1.6 }}>{f.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
