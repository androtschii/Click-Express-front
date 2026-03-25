import React, { useState, useEffect, useRef } from "react";
import type { Load } from "../../types/index";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface LoadDetailPageProps {
  load: Load;
  theme?: "dark" | "light";
  isBooked?: boolean;
  onClose: () => void;
  onBook: (load: Load) => void;
  onCancelBook: (load: Load) => void;
}

function driveTime(miles: number) {
  const h = Math.floor(miles / 55);
  const m = Math.round(((miles / 55) - h) * 60);
  return `${h}h ${m}m`;
}

function ppm(price: number, miles: number) {
  return (price / miles).toFixed(2);
}

function mapUrl(from: string, to: string) {
  return `https://maps.google.com/maps?saddr=${encodeURIComponent(from)}&daddr=${encodeURIComponent(to)}&output=embed&t=k`;
}

function cargoDesc(cargo: string, type: string, cargoDescMap: Record<string, string>) {
  return cargoDescMap[cargo] || `${type} ${cargoDescMap["default"]}`;
}

function truckEmoji(cargo: string) {
  if (cargo.includes("Military")) return "🪖";
  if (cargo.includes("Partial")) return "📦";
  if (cargo.includes("Pipe") || cargo.includes("Steel Beam")) return "⚙️";
  if (cargo.includes("Machinery") || cargo.includes("Equipment")) return "🏗️";
  return "🚛";
}

export const LoadDetailPage: React.FC<LoadDetailPageProps> = ({
  load, theme = "dark", isBooked = false, onClose, onBook, onCancelBook,
}) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const t = translations[lang].detail;
  const [entered, setEntered] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [booked, setBooked] = useState(isBooked);
  const topRef = useRef<HTMLDivElement>(null);
  const [msgOpen, setMsgOpen] = useState(false);
  const msgRef = useRef<HTMLDivElement>(null);
  const [msgName, setMsgName] = useState("");
  const [msgPhone, setMsgPhone] = useState("");
  const [msgDate, setMsgDate] = useState("");
  const [msgText, setMsgText] = useState("");
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
    topRef.current?.scrollIntoView({ behavior: "auto" });
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  // sync if parent changes
  useEffect(() => { setBooked(isBooked); }, [isBooked]);

  const handleBook = () => {
    if (booked) {
      setBooked(false);
      onCancelBook(load);
    } else {
      setBooked(true);
      onBook(load);
    }
  };

  const bg    = isDark ? "#080808" : "#f4f4f4";
  const card  = isDark ? "#111"    : "#fff";
  const bord  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const text  = isDark ? "#fff"    : "#111";
  const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)";

  const stats = [
    { label: t.stats.totalPrice,  value: `$${load.price.toLocaleString()}`, color: "#CC0000", big: true },
    { label: t.stats.distance,    value: `${load.miles.toLocaleString()} mi`, color: text },
    { label: t.stats.driveTime,   value: driveTime(load.miles), color: text },
    { label: t.stats.ratePerMile, value: `$${ppm(load.price, load.miles)}`, color: "#00b450" },
    { label: t.stats.loadType,    value: load.type, color: text },
    { label: t.stats.trailer,     value: load.cargo.split("/")[0].trim(), color: text },
  ];

  return (
    <div ref={topRef} style={{
      minHeight: "100vh",
      background: bg,
      opacity: entered ? 1 : 0,
      transform: entered ? "none" : "translateY(24px)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
    }}>
      <style>{`
        @keyframes detailFadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        .stat-card { transition: all 0.2s; }
        .stat-card:hover { border-color: rgba(204,0,0,0.5) !important; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .detail-scroll::-webkit-scrollbar { width: 5px; }
        .detail-scroll::-webkit-scrollbar-thumb { background: rgba(204,0,0,0.4); border-radius: 3px; }
      `}</style>

      {/* ── Top nav bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: isDark ? "rgba(8,8,8,0.4)" : "rgba(244,244,244,0.55)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${bord}`,
        padding: "0 clamp(16px,4vw,48px)",
        height: 60,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <button
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: `1px solid ${bord}`,
            borderRadius: 20, padding: "7px 16px",
            color: muted, fontFamily: "'Barlow',sans-serif",
            fontWeight: 600, fontSize: 12, letterSpacing: 1,
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#CC0000"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = bord; e.currentTarget.style.color = muted; }}
        >
          {t.allLoads}
        </button>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
          <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, whiteSpace:"nowrap" }}>
            {t.loadNo}{load.id}
          </span>
          <span style={{ color: bord }}>·</span>
          <span style={{
            fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
          }}>
            {load.route} → {load.dest}
          </span>
        </div>

        {load.tag && (
          <div style={{
            background: load.tag === "Military Load" ? "#1a3a6b" : "#CC0000",
            color: "#fff", padding: "4px 12px", borderRadius: 20,
            fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:9,
            letterSpacing:1.5, textTransform:"uppercase", whiteSpace:"nowrap", flexShrink: 0,
          }}>
            {load.tag}
          </div>
        )}
      </div>

      {/* ── Hero banner ── */}
      <div style={{ position: "relative", height: "clamp(380px,48vw,540px)", overflow: "hidden" }}>
        <img
          src={load.image} alt={load.route}
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 72%", filter:"brightness(0.52) blur(2px)", transform:"scale(1.03)" }}
        />
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 50%, rgba(8,8,8,1) 100%)",
        }} />

        <div style={{
          position:"absolute", bottom:"clamp(28px,5vw,56px)",
          left:"clamp(20px,5vw,80px)", right:"clamp(20px,5vw,80px)",
          animation:"detailFadeUp 0.5s ease 0.1s both",
        }}>
          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:2.5, textTransform:"uppercase", marginBottom:8 }}>
            {truckEmoji(load.cargo)} {load.cargo}
          </div>
          <h1 style={{
            fontFamily:"'Oswald',sans-serif", fontWeight:700,
            fontSize:"clamp(28px,5vw,54px)", color:"#fff",
            lineHeight:1.1, margin:0,
          }}>
            {load.route}
            <span style={{ color:"#CC0000", margin:"0 16px" }}>→</span>
            {load.dest}
          </h1>
          <div style={{ display:"flex", gap:12, marginTop:14, flexWrap:"wrap" }}>
            <span style={{ background:"rgba(204,0,0,0.9)", color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", padding:"5px 14px", borderRadius:4 }}>
              {load.type}
            </span>
            <span style={{ background:"rgba(0,0,0,0.5)", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.15)", fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:11, padding:"5px 14px", borderRadius:4, backdropFilter:"blur(6px)" }}>
              {load.miles.toLocaleString()} miles · {driveTime(load.miles)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"clamp(24px,4vw,56px) clamp(16px,4vw,48px) 80px" }}>

        {/* Stats row */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",
          gap:12, marginBottom:32,
          animation:"detailFadeUp 0.5s ease 0.15s both",
        }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card" style={{
              background:card, border:`1px solid ${bord}`, borderRadius:12,
              padding:"18px 20px", cursor:"default",
            }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:s.big?26:18, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Two-column layout below */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr clamp(280px,35%,400px)", gap:24, alignItems:"start" }}>

          {/* Left column */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* Route line */}
            <div style={{ background:card, border:`1px solid ${bord}`, borderRadius:14, padding:"24px 28px", animation:"detailFadeUp 0.5s ease 0.2s both" }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:2, textTransform:"uppercase", marginBottom:18 }}>{t.route}</div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                {/* Origin */}
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:"#CC0000", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>{t.origin}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <div style={{ width:12, height:12, borderRadius:"50%", border:"2.5px solid #CC0000", flexShrink:0 }} />
                    <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:16, color:text }}>{load.route}</div>
                  </div>
                </div>

                {/* Arrow + distance */}
                <div style={{ flex:2, textAlign:"center" }}>
                  <div style={{ fontSize:11, color:"#CC0000", fontFamily:"'Barlow',sans-serif", fontWeight:700, marginBottom:6 }}>
                    {load.miles.toLocaleString()} mi · {driveTime(load.miles)}
                  </div>
                  <div style={{ height:2, background:`linear-gradient(90deg, #CC0000, rgba(204,0,0,0.2), #CC0000)`, borderRadius:2, position:"relative" }}>
                    <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", fontSize:18 }}>🚛</div>
                  </div>
                </div>

                {/* Dest */}
                <div style={{ flex:1, textAlign:"right" }}>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:"#CC0000", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>{t.destination}</div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8, marginBottom:4 }}>
                    <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:16, color:text }}>{load.dest}</div>
                    <div style={{ width:12, height:12, borderRadius:"50%", background:"#CC0000", flexShrink:0 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div style={{ background:card, border:`1px solid ${bord}`, borderRadius:14, overflow:"hidden", animation:"detailFadeUp 0.5s ease 0.25s both" }}>
              <div style={{ padding:"12px 18px", borderBottom:`1px solid ${bord}`, display:"flex", alignItems:"center", gap:8 }}>
                <svg width="15" height="15" viewBox="0 0 256 256" fill="#CC0000">
                  <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"/>
                </svg>
                <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, flex:1 }}>{t.routeMap}</span>
                <a
                  href={`https://www.google.com/maps/dir/${encodeURIComponent(load.route)}/${encodeURIComponent(load.dest)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#CC0000", textDecoration:"none", fontWeight:600 }}
                >
                  {t.openInMaps}
                </a>
              </div>
              <div style={{ position:"relative", height:340, background:isDark?"#1a1a1a":"#e8e8e8" }}>
                {!mapLoaded && (
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, zIndex:1 }}>
                    <div style={{ width:32, height:32, border:"3px solid rgba(204,0,0,0.2)", borderTop:"3px solid #CC0000", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                    <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:muted }}>{t.loadingMap}</span>
                  </div>
                )}
                <iframe
                  title="route-map" width="100%" height="340"
                  style={{ border:0, display:"block" }}
                  loading="lazy"
                  onLoad={() => setMapLoaded(true)}
                  src={mapUrl(load.route, load.dest)}
                  allowFullScreen
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ background:card, border:`1px solid ${bord}`, borderRadius:14, padding:"24px 28px", animation:"detailFadeUp 0.5s ease 0.3s both" }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>{t.loadDescription}</div>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:isDark?"rgba(255,255,255,0.68)":"rgba(0,0,0,0.62)", lineHeight:1.8, margin:0 }}>
                {cargoDesc(load.cargo, load.type, t.cargoDesc as Record<string, string>)}
              </p>
            </div>

            {/* Requirements grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, animation:"detailFadeUp 0.5s ease 0.35s both" }}>
              {[
                { icon:"🪪", label:t.req.cdl, desc:t.req.cdlDesc },
                { icon:"📋", label:load.tag==="Military Load"?t.req.federal:t.req.permits, desc:load.tag==="Military Load"?t.req.federalDesc:t.req.permitsDesc },
                { icon:"⚖️", label:t.req.weight, desc:`~${(load.miles * 0.04 + 40).toFixed(0)},000 ${t.req.weightUnit}` },
                { icon:"📅", label:t.req.avail, desc:t.req.availDesc },
              ].map(r => (
                <div key={r.label} style={{ background:card, border:`1px solid ${bord}`, borderRadius:12, padding:"16px 18px", display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ fontSize:22, lineHeight:1 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, marginBottom:4 }}>{r.label}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Dispatcher */}
            <div ref={msgRef} style={{ background:card, border:`1px solid ${bord}`, borderRadius:14, overflow:"hidden", animation:"detailFadeUp 0.5s ease 0.4s both" }}>
              {/* Header toggle */}
              <div
                onClick={() => { setMsgOpen(o => !o); setMsgSent(false); }}
                style={{ padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", background: msgOpen ? "rgba(204,0,0,0.06)" : "transparent", transition:"background 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(204,0,0,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = msgOpen ? "rgba(204,0,0,0.06)" : "transparent"; }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#CC0000,#ff4d4d)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 256 256" fill="white">
                      <path d="M172,112a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h68A8,8,0,0,1,172,112Zm-8,24H96a8,8,0,0,0,0,16h68a8,8,0,0,0,0-16Zm68-12A100.11,100.11,0,0,1,132,224H48a16,16,0,0,1-16-16V124a100,100,0,0,1,200,0Zm-16,0a84,84,0,0,0-168,0v84h84A84.09,84.09,0,0,0,216,124Z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:15, color:text }}>{t.msgDispatcher}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted }}>{t.msgSubtitle}</div>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 256 256" fill={muted} style={{ transform: msgOpen ? "rotate(180deg)" : "none", transition:"transform 0.3s" }}>
                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
                </svg>
              </div>

              {/* Form body */}
              {msgOpen && (
                <div style={{ padding:"0 24px 24px", borderTop:`1px solid ${bord}` }}>
                  {msgSent ? (
                    <div style={{ textAlign:"center", padding:"32px 0", animation:"detailFadeUp 0.4s ease" }}>
                      <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#00b050,#00d060)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                        <svg width="28" height="28" viewBox="0 0 256 256" fill="#fff">
                          <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
                        </svg>
                      </div>
                      <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:18, color:text, marginBottom:6 }}>{t.msgSent}</div>
                      <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:muted }}>{t.msgSentDesc}</div>
                    </div>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:12, paddingTop:20 }}>
                      {/* Route info (read-only) */}
                      <div style={{ background: isDark?"rgba(204,0,0,0.06)":"rgba(204,0,0,0.04)", border:"1px solid rgba(204,0,0,0.2)", borderRadius:8, padding:"10px 14px" }}>
                        <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:"#CC0000", letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>{t.formRoute}</div>
                        <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, color:text }}>{load.route} → {load.dest}</div>
                      </div>

                      {/* Name + Phone row */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted, letterSpacing:1, marginBottom:5 }}>{t.formName}</div>
                          <input
                            value={msgName} onChange={e => setMsgName(e.target.value)}
                            placeholder={t.formNamePh}
                            style={{ width:"100%", padding:"10px 12px", background:isDark?"rgba(255,255,255,0.05)":"#f5f5f5", border:`1px solid ${bord}`, borderRadius:7, color:text, fontFamily:"'Barlow',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
                            onFocus={e => e.target.style.borderColor="#CC0000"}
                            onBlur={e => e.target.style.borderColor=bord}
                          />
                        </div>
                        <div>
                          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted, letterSpacing:1, marginBottom:5 }}>{t.formPhone}</div>
                          <input
                            value={msgPhone} onChange={e => setMsgPhone(e.target.value)}
                            placeholder="+1 (___) ___-____" type="tel"
                            style={{ width:"100%", padding:"10px 12px", background:isDark?"rgba(255,255,255,0.05)":"#f5f5f5", border:`1px solid ${bord}`, borderRadius:7, color:text, fontFamily:"'Barlow',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
                            onFocus={e => e.target.style.borderColor="#CC0000"}
                            onBlur={e => e.target.style.borderColor=bord}
                          />
                        </div>
                      </div>

                      {/* Pickup date */}
                      <div>
                        <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted, letterSpacing:1, marginBottom:5 }}>{t.formDate}</div>
                        <input
                          value={msgDate} onChange={e => setMsgDate(e.target.value)}
                          type="date"
                          style={{ width:"100%", padding:"10px 12px", background:isDark?"rgba(255,255,255,0.05)":"#f5f5f5", border:`1px solid ${bord}`, borderRadius:7, color:text, fontFamily:"'Barlow',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box", colorScheme:isDark?"dark":"light", transition:"border-color 0.2s" }}
                          onFocus={e => e.target.style.borderColor="#CC0000"}
                          onBlur={e => e.target.style.borderColor=bord}
                        />
                      </div>

                      {/* Message textarea */}
                      <div>
                        <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted, letterSpacing:1, marginBottom:5 }}>{t.formMsg}</div>
                        <textarea
                          value={msgText} onChange={e => setMsgText(e.target.value)}
                          placeholder={`Hi, I'm interested in the ${load.route} → ${load.dest} route. I'd like to book the ${load.cargo} load on the specified date. Please contact me with availability.`}
                          rows={4}
                          style={{ width:"100%", padding:"10px 12px", background:isDark?"rgba(255,255,255,0.05)":"#f5f5f5", border:`1px solid ${bord}`, borderRadius:7, color:text, fontFamily:"'Barlow',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical", lineHeight:1.6, transition:"border-color 0.2s" }}
                          onFocus={e => e.target.style.borderColor="#CC0000"}
                          onBlur={e => e.target.style.borderColor=bord}
                        />
                      </div>

                      {/* Send button */}
                      <button
                        onClick={() => { if (msgName || msgPhone) setMsgSent(true); }}
                        style={{ padding:"12px", background:"linear-gradient(135deg,#CC0000,#ff4d4d)", border:"none", borderRadius:8, color:"#fff", fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:14, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", boxShadow:"0 6px 20px rgba(204,0,0,0.35)", transition:"all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(204,0,0,0.5)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 20px rgba(204,0,0,0.35)"; }}
                      >
                        {t.formSend}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column — sticky booking card */}
          <div style={{ position:"sticky", top:76 }}>
            <div style={{
              background:card, border:`1px solid ${bord}`, borderRadius:16,
              overflow:"hidden", animation:"detailFadeUp 0.5s ease 0.2s both",
              boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.12)",
            }}>
              {/* Price header */}
              <div style={{ background:"linear-gradient(135deg,#CC0000,#ff4d4d)", padding:"24px 24px 20px" }}>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"rgba(255,255,255,0.6)", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>{t.totalRate}</div>
                <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:40, color:"#fff", lineHeight:1 }}>
                  ${load.price.toLocaleString()}
                </div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"rgba(255,255,255,0.65)", marginTop:6 }}>
                  ${ppm(load.price, load.miles)} {t.perMile} · {load.miles.toLocaleString()} mi
                </div>
              </div>

              {/* Details */}
              <div style={{ padding:"20px 24px" }}>
                {[
                  { l:t.route, v:`${load.route} → ${load.dest}` },
                  { l:t.cargo, v:load.cargo },
                  { l:t.type, v:load.type },
                  { l:t.stats.driveTime, v:driveTime(load.miles) },
                ].map(row => (
                  <div key={row.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, gap:8 }}>
                    <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, whiteSpace:"nowrap" }}>{row.l}</span>
                    <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, textAlign:"right" }}>{row.v}</span>
                  </div>
                ))}

                <div style={{ height:1, background:bord, margin:"6px 0 18px" }} />

                {/* Dispatch */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>{t.dispatch}</div>
                  <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:20, color:text }}>+1 786-202-6599</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginTop:2 }}>{t.dispatchHours}</div>
                </div>

                {/* Call + Message buttons row */}
                <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                  <a
                    href="tel:+17862026599"
                    style={{
                      flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                      padding:"11px",
                      background:isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)",
                      border:`1px solid ${bord}`, borderRadius:8,
                      color:text, fontFamily:"'Oswald',sans-serif", fontWeight:600,
                      fontSize:12, letterSpacing:1.5, textTransform:"uppercase",
                      textDecoration:"none", transition:"all 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#CC0000"; (e.currentTarget as HTMLElement).style.color="#CC0000"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=bord; (e.currentTarget as HTMLElement).style.color=text; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"/></svg>
                    {t.call}
                  </a>

                  {/* Animated message button */}
                  <button
                    onClick={() => {
                      setMsgOpen(true);
                      setTimeout(() => msgRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
                    }}
                    style={{
                      flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                      padding:"11px",
                      background: "linear-gradient(135deg, rgba(204,0,0,0.15), rgba(204,0,0,0.08))",
                      border:"1px solid rgba(204,0,0,0.35)", borderRadius:8,
                      color:"#CC0000", fontFamily:"'Oswald',sans-serif", fontWeight:600,
                      fontSize:12, letterSpacing:1.5, textTransform:"uppercase",
                      cursor:"pointer", transition:"all 0.2s", position:"relative", overflow:"hidden",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background="linear-gradient(135deg,#CC0000,#ff4d4d)"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#CC0000"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="linear-gradient(135deg, rgba(204,0,0,0.15), rgba(204,0,0,0.08))"; e.currentTarget.style.color="#CC0000"; e.currentTarget.style.borderColor="rgba(204,0,0,0.35)"; }}
                  >
                    <style>{`
                      @keyframes msgPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
                      @keyframes msgDot1 { 0%,80%,100%{transform:scale(0);opacity:0} 40%{transform:scale(1);opacity:1} }
                      @keyframes msgDot2 { 0%,20%,100%{transform:scale(0);opacity:0} 60%{transform:scale(1);opacity:1} }
                      @keyframes msgDot3 { 0%,40%,100%{transform:scale(0);opacity:0} 80%{transform:scale(1);opacity:1} }
                    `}</style>
                    <span style={{ display:"flex", alignItems:"center", gap:2, animation:"msgPulse 2s ease infinite" }}>
                      <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
                        <path d="M172,112a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h68A8,8,0,0,1,172,112Zm-8,24H96a8,8,0,0,0,0,16h68a8,8,0,0,0,0-16Zm68-12A100.11,100.11,0,0,1,132,224H48a16,16,0,0,1-16-16V124a100,100,0,0,1,200,0Zm-16,0a84,84,0,0,0-168,0v84h84A84.09,84.09,0,0,0,216,124Z"/>
                      </svg>
                      <span style={{ display:"flex", gap:2, marginLeft:2 }}>
                        <span style={{ width:3, height:3, borderRadius:"50%", background:"currentColor", display:"inline-block", animation:"msgDot1 1.4s ease infinite" }} />
                        <span style={{ width:3, height:3, borderRadius:"50%", background:"currentColor", display:"inline-block", animation:"msgDot2 1.4s ease infinite" }} />
                        <span style={{ width:3, height:3, borderRadius:"50%", background:"currentColor", display:"inline-block", animation:"msgDot3 1.4s ease infinite" }} />
                      </span>
                    </span>
                    {t.message}
                  </button>
                </div>

                {/* Book / Cancel button */}
                <button
                  onClick={handleBook}
                  style={{
                    width:"100%", padding:"13px",
                    background: booked
                      ? "rgba(0,180,80,0.12)"
                      : "linear-gradient(135deg,#CC0000,#ff4d4d)",
                    border: booked ? "1px solid rgba(0,180,80,0.4)" : "none",
                    borderRadius:8, cursor:"pointer",
                    color: booked ? "#00b450" : "#fff",
                    fontFamily:"'Oswald',sans-serif", fontWeight:700,
                    fontSize:14, letterSpacing:2, textTransform:"uppercase",
                    boxShadow: booked ? "none" : "0 6px 20px rgba(204,0,0,0.4)",
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e => {
                    if (!booked) { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(204,0,0,0.5)"; }
                    else { e.currentTarget.style.background="rgba(204,0,0,0.12)"; e.currentTarget.style.color="#CC0000"; e.currentTarget.style.borderColor="rgba(204,0,0,0.4)"; }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform="none";
                    e.currentTarget.style.boxShadow = booked ? "none" : "0 6px 20px rgba(204,0,0,0.4)";
                    e.currentTarget.style.background = booked ? "rgba(0,180,80,0.12)" : "linear-gradient(135deg,#CC0000,#ff4d4d)";
                    e.currentTarget.style.color = booked ? "#00b450" : "#fff";
                    e.currentTarget.style.borderColor = booked ? "rgba(0,180,80,0.4)" : "transparent";
                  }}
                >
                  {booked ? t.cancelReq : t.bookLoad}
                </button>

                {booked && (
                  <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#00b450", textAlign:"center", marginTop:10 }}>
                    {t.reqSent}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
