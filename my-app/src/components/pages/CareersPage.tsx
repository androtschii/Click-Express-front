import React, { useState } from "react";
import { PhoneIcon } from "../ui/PhoneIcon";

interface CareersPageProps {
  theme?: "dark" | "light";
  onBack?: () => void;
}

const JOBS = [
  {
    id: 1,
    title: "Freight Dispatcher",
    type: "Full-Time",
    location: "Remote / Hallandale Beach, FL",
    salary: "$55,000 – $85,000 / year",
    badge: "🔥 Hot",
    badgeColor: "#CC0000",
    desc: "Coordinate loads between brokers and drivers. Negotiate rates, build relationships, and ensure on-time delivery across 48 states.",
    requirements: ["English B2+", "Negotiation skills", "Stress tolerance", "PC proficiency"],
  },
  {
    id: 2,
    title: "CDL-A Flatbed Driver",
    type: "Full-Time",
    location: "OTR · All 48 States",
    salary: "$0.55 – $0.75 / mile",
    badge: "★ Best Pay",
    badgeColor: "#f59e0b",
    desc: "Drive flatbed loads across the continental US. Specialized freight including oversized, steel, and heavy machinery.",
    requirements: ["CDL-A license", "1+ year OTR experience", "Clean MVR", "Flatbed experience preferred"],
  },
  {
    id: 3,
    title: "Owner Operator",
    type: "Independent Contractor",
    location: "OTR · All 48 States",
    salary: "$8,000 – $20,000 / month gross",
    badge: "💰 High Gross",
    badgeColor: "#10b981",
    desc: "Partner with Click Express as an owner-operator. We provide consistent freight, fuel discounts, and dedicated dispatcher support.",
    requirements: ["Own truck & trailer", "CDL-A", "Own authority or lease on", "2+ years experience"],
  },
  {
    id: 4,
    title: "Sales Manager",
    type: "Full-Time",
    location: "Remote",
    salary: "$60,000 – $100,000 + bonus",
    badge: "📈 Growth",
    badgeColor: "#8b5cf6",
    desc: "Build and manage broker relationships. Develop new business, oversee a team of dispatchers, and drive company revenue.",
    requirements: ["Sales experience 2+ yr", "Freight/logistics background", "Leadership skills", "English fluent"],
  },
];

const PERKS = [
  { icon: "💰", title: "Competitive Pay", desc: "Above-market salaries + performance bonuses" },
  { icon: "🌍", title: "100% Remote", desc: "Dispatcher roles are fully remote worldwide" },
  { icon: "📈", title: "Career Growth", desc: "Clear path from dispatcher to team lead" },
  { icon: "🕒", title: "Flexible Hours", desc: "We work around your schedule" },
  { icon: "🤝", title: "Team Support", desc: "Mentorship from experienced dispatchers" },
  { icon: "⭐", title: "4.9 Rating", desc: "Top-rated carrier on CarrierSource" },
];

export const CareersPage: React.FC<CareersPageProps> = ({ theme = "dark", onBack }) => {
  const isDark = theme === "dark";
  const bg = isDark ? "#080808" : "#f5f5f5";
  const card = isDark ? "#0f0f0f" : "#fff";
  const text = isDark ? "#fff" : "#1a1a1a";
  const sub = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.6)";
  const bord = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";

  const [applied, setApplied] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleApply = (jobId: number) => {
    if (applied === jobId) {
      setApplied(null);
    } else {
      setApplied(jobId);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const handleSend = () => {
    if (name && email) { setSent(true); }
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text }}>
      <style>{`
        @keyframes careersIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mapPulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ position: "relative", height: 420, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <img
          src="/images/hero-bg.jpg"
          alt="careers"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.25)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(204,0,0,0.4) 0%,rgba(0,0,0,0.8) 100%)" }} />

        {/* Back button */}
        <button onClick={onBack} style={{ position: "absolute", top: 90, left: 32, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 24, padding: "8px 18px", color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(204,0,0,0.4)"; e.currentTarget.style.borderColor = "#CC0000"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}>
          ← Back
        </button>

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5vw,64px)", animation: "careersIn 0.6s ease" }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>— Join Our Team</div>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(40px,6vw,72px)", color: "#fff", textTransform: "uppercase", lineHeight: 1, marginBottom: 16 }}>
            BUILD YOUR<br /><span style={{ color: "#CC0000" }}>CAREER</span> WITH US
          </h1>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 520, lineHeight: 1.7, marginBottom: 28 }}>
            Click Express Inc is a growing freight company with 4.9★ rating. We're hiring dispatchers, drivers, and operators across the US.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#jobs" style={{ background: "#CC0000", color: "#fff", border: "none", borderRadius: 4, padding: "13px 28px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", textDecoration: "none", boxShadow: "0 6px 24px rgba(204,0,0,0.5)" }}>
              View Open Positions
            </a>
            <a href="https://www.carriersource.io/carriers/click-express-inc" target="_blank" rel="noreferrer"
              style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, padding: "13px 28px", fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", textDecoration: "none" }}>
              ★ 4.9 on CarrierSource
            </a>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ background: "#CC0000", padding: "18px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
          {[["4.9★", "CarrierSource Rating"], ["11+", "Reviews"], ["48", "States Covered"], ["2019", "Founded"], ["24/7", "Dispatcher Support"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: "#fff" }}>{n}</div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.75)", letterSpacing: 1.5, textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Operating Area Map ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "64px clamp(20px,5vw,64px) 0" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>— Where We Operate</div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,42px)", color: text, textTransform: "uppercase" }}>
            PRIMARY <span style={{ color: "#CC0000" }}>OPERATING AREA</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "start" }}>
          {/* Map embed */}
          <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${bord}`, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", background: card }}>
            <iframe
              src="https://maps.google.com/maps?q=Florida,USA&z=4&output=embed&t=m"
              width="100%"
              height="360"
              style={{ border: "none", display: "block" }}
              title="Operating Area"
            />
          </div>
          {/* Legend */}
          <div style={{ minWidth: 220, background: card, border: `1px solid ${bord}`, borderRadius: 14, padding: "24px 20px" }}>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 15, color: text, textTransform: "uppercase", marginBottom: 16 }}>Coverage</div>
            {[
              { dot: "#CC0000", label: "Primary Zone", desc: "Midwest · East Coast · South" },
              { dot: "#f59e0b", label: "Secondary Zone", desc: "West Coast · Mountain States" },
              { dot: "#10b981", label: "HQ", desc: "Hallandale Beach, FL 33009" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: r.dot, flexShrink: 0, marginTop: 3 }} />
                <div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: text }}>{r.label}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: sub, marginTop: 2 }}>{r.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(204,0,0,0.08)", border: "1px solid rgba(204,0,0,0.25)", borderRadius: 8 }}>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: sub, marginBottom: 4 }}>Carrier Profile</div>
              <a href="https://www.carriersource.io/carriers/click-express-inc" target="_blank" rel="noreferrer"
                style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: "#CC0000", textDecoration: "none" }}>
                carriersource.io →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "64px clamp(20px,5vw,64px) 0" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>— Why Join Us</div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,42px)", color: text, textTransform: "uppercase" }}>
            WHAT WE <span style={{ color: "#CC0000" }}>OFFER</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {PERKS.map(p => (
            <div key={p.title} style={{ background: card, border: `1px solid ${bord}`, borderRadius: 12, padding: "24px 22px", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = bord; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 17, color: text, marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: sub, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Open Positions ── */}
      <section id="jobs" style={{ maxWidth: 1200, margin: "0 auto", padding: "64px clamp(20px,5vw,64px) 0" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>— Now Hiring</div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,42px)", color: text, textTransform: "uppercase" }}>
            OPEN <span style={{ color: "#CC0000" }}>POSITIONS</span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {JOBS.map(job => (
            <div key={job.id} style={{ background: card, border: `1px solid ${bord}`, borderRadius: 14, padding: "24px 28px", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = bord; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: text, textTransform: "uppercase" }}>{job.title}</h3>
                    <span style={{ background: job.badgeColor, color: "#fff", borderRadius: 12, padding: "3px 10px", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1 }}>{job.badge}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: sub }}>📍 {job.location}</span>
                    <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: sub }}>⏱ {job.type}</span>
                    <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: "#CC0000" }}>💵 {job.salary}</span>
                  </div>
                  <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: sub, lineHeight: 1.7, marginBottom: 12, maxWidth: 600 }}>{job.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {job.requirements.map(r => (
                      <span key={r} style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: `1px solid ${bord}`, borderRadius: 20, padding: "4px 12px", fontFamily: "'Barlow',sans-serif", fontSize: 11, color: sub, letterSpacing: 0.5 }}>✓ {r}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleApply(job.id)} style={{ flexShrink: 0, background: applied === job.id ? "rgba(0,180,80,0.15)" : "#CC0000", color: applied === job.id ? "#00b450" : "#fff", border: applied === job.id ? "1px solid rgba(0,180,80,0.4)" : "none", borderRadius: 6, padding: "12px 28px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", boxShadow: applied === job.id ? "none" : "0 4px 16px rgba(204,0,0,0.35)", minWidth: 140 }}
                  onMouseEnter={e => {
                    if (applied === job.id) {
                      e.currentTarget.style.background = "rgba(204,0,0,0.12)";
                      e.currentTarget.style.color = "#ff4d4d";
                      e.currentTarget.style.borderColor = "rgba(204,0,0,0.4)";
                      e.currentTarget.textContent = "✕ Cancel";
                    } else {
                      e.currentTarget.style.background = "#aa0000";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (applied === job.id) {
                      e.currentTarget.style.background = "rgba(0,180,80,0.15)";
                      e.currentTarget.style.color = "#00b450";
                      e.currentTarget.style.borderColor = "rgba(0,180,80,0.4)";
                      e.currentTarget.textContent = "✓ Selected";
                    } else {
                      e.currentTarget.style.background = "#CC0000";
                      e.currentTarget.style.transform = "none";
                    }
                  }}>
                  {applied === job.id ? "✓ Selected" : "Apply Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Apply Form ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "64px clamp(20px,5vw,64px) 80px" }}>
        <div style={{ background: card, border: `1px solid ${bord}`, borderRadius: 20, padding: "44px clamp(24px,5vw,64px)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 28, color: text, textTransform: "uppercase", marginBottom: 10 }}>Application Sent!</h3>
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, color: sub }}>Our HR team will contact you within 24 hours.</p>
              <a href="tel:+17862026599" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, background: "#CC0000", color: "#fff", borderRadius: 6, padding: "12px 28px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>
                <PhoneIcon size={16} color="#fff" /> Call Us Now
              </a>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
              <div>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>— Apply Today</div>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,3.5vw,38px)", color: text, textTransform: "uppercase", lineHeight: 1.1, marginBottom: 16 }}>
                  READY TO <span style={{ color: "#CC0000" }}>JOIN?</span>
                </h2>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: sub, lineHeight: 1.8, marginBottom: 24 }}>
                  Fill out the form and our hiring team will reach out within 24 hours. You can also contact us directly:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <a href="tel:+17862026599" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#CC0000" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(204,0,0,0.12)", border: "1px solid rgba(204,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PhoneIcon size={16} color="#CC0000" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: sub, letterSpacing: 1.5, textTransform: "uppercase" }}>Call / WhatsApp</div>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 15 }}>+1 786-202-6599</div>
                    </div>
                  </a>
                  <a href="https://www.linkedin.com/company/clickexpressinc" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(10,102,194,0.12)", border: "1px solid rgba(10,102,194,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="18" height="18" viewBox="0 0 256 256" fill="#0A66C2"><path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: sub, letterSpacing: 1.5, textTransform: "uppercase" }}>LinkedIn</div>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: "#0A66C2" }}>Click Express Inc →</div>
                    </div>
                  </a>
                </div>
              </div>
              <div>
                {applied && (
                  <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(204,0,0,0.08)", border: "1px solid rgba(204,0,0,0.25)", borderRadius: 8, fontFamily: "'Barlow',sans-serif", fontSize: 12, color: "#CC0000" }}>
                    Applying for: <strong>{JOBS.find(j => j.id === applied)?.title}</strong>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { val: name, set: setName, ph: "Full Name", type: "text" },
                    { val: email, set: setEmail, ph: "Email Address", type: "email" },
                  ].map(f => (
                    <input key={f.ph} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} type={f.type}
                      style={{ padding: "12px 16px", background: isDark ? "rgba(255,255,255,0.05)" : "#f8f8f8", border: `1px solid ${bord}`, borderRadius: 8, color: text, fontSize: 14, fontFamily: "'Barlow',sans-serif", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = "#CC0000"}
                      onBlur={e => e.target.style.borderColor = bord}
                    />
                  ))}
                  <select value={applied ?? ""} onChange={e => setApplied(Number(e.target.value))}
                    style={{ padding: "12px 16px", background: isDark ? "#1a1a1a" : "#f8f8f8", border: `1px solid ${bord}`, borderRadius: 8, color: text, fontSize: 14, fontFamily: "'Barlow',sans-serif", outline: "none" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#CC0000"}
                    onBlur={e => e.currentTarget.style.borderColor = bord}>
                    <option value="" style={{ background: isDark ? "#1a1a1a" : "#fff", color: isDark ? "#fff" : "#1a1a1a" }}>Select Position</option>
                    {JOBS.map(j => <option key={j.id} value={j.id} style={{ background: isDark ? "#1a1a1a" : "#fff", color: isDark ? "#fff" : "#1a1a1a" }}>{j.title}</option>)}
                  </select>
                  <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Tell us about yourself (optional)" rows={3}
                    style={{ padding: "12px 16px", background: isDark ? "rgba(255,255,255,0.05)" : "#f8f8f8", border: `1px solid ${bord}`, borderRadius: 8, color: text, fontSize: 14, fontFamily: "'Barlow',sans-serif", outline: "none", resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = "#CC0000"}
                    onBlur={e => e.target.style.borderColor = bord}
                  />
                  <button onClick={handleSend} style={{ padding: "13px", background: "linear-gradient(135deg,#CC0000,#ff4d4d)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", boxShadow: "0 6px 20px rgba(204,0,0,0.4)", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                    Send Application
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
