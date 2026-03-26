import React, { useState, useEffect, useRef } from "react";
import type { Session } from "../../services/authService";
import { getUserById, updateUser } from "../../services/authService";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";
import type { Load } from "../../types/index";

interface ProfilePageProps {
  session: Session;
  theme?: "dark" | "light";
  savedLoads?: Load[];
  bookedLoads?: Load[];
  onBack?: () => void;
  onBrowseLoads?: () => void;
  onLogout?: () => void;
  onSessionUpdate?: (name: string) => void;
  onDetails?: (load: Load) => void;
  onSaveRemove?: (load: Load) => void;
  onOrderCancel?: (load: Load) => void;
}

type Tab = "overview" | "orders" | "saved" | "payment" | "settings";

export const ProfilePage: React.FC<ProfilePageProps> = ({
  session, theme = "dark",
  savedLoads = [], bookedLoads = [],
  onBack, onBrowseLoads, onLogout, onSessionUpdate,
  onDetails, onSaveRemove, onOrderCancel,
}) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const t = translations[lang].profile;

  const bg      = isDark ? "#080808" : "#f0f0f0";
  const card    = isDark ? "#0d0d0d" : "#ffffff";
  const card2   = isDark ? "#111" : "#fafafa";
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const text    = isDark ? "#fff" : "#1a1a1a";
  const muted   = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const inputBd = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)";

  const fullUser = getUserById(session.userId);
  const isGoogle = fullUser?.provider === "google";
  const createdAt = fullUser?.createdAt
    ? new Date(fullUser.createdAt).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const [tab, setTab] = useState<Tab>("overview");
  const [displayName, setDisplayName] = useState(session.name);
  const [nameVal, setNameVal]         = useState(session.name);
  const [editName, setEditName]       = useState(false);
  const [editPass, setEditPass]       = useState(false);
  const [curPass, setCurPass]         = useState("");
  const [newPass, setNewPass]         = useState("");
  const [avatar, setAvatar]           = useState<string | null>(session.avatar || null);
  const [balance, setBalance]         = useState(0);
  const [toast, setToast]             = useState<{ msg: string; ok: boolean } | null>(null);
  const [payAmount, setPayAmount]     = useState("");
  const [payCard, setPayCard]         = useState("");
  const [payName, setPayName]         = useState("");
  const [payExpiry, setPayExpiry]     = useState("");
  const [payCvv, setPayCvv]           = useState("");
  const [payDone, setPayDone]         = useState(false);
  const [payLoad, setPayLoad]         = useState<Load | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (toast) { const id = setTimeout(() => setToast(null), 3200); return () => clearTimeout(id); }
  }, [toast]);

  const notify = (msg: string, ok = true) => setToast({ msg, ok });

  const handleSaveName = () => {
    if (!nameVal.trim()) return;
    const res = updateUser(session.userId, { name: nameVal.trim() });
    if (res.ok) { setDisplayName(nameVal.trim()); onSessionUpdate?.(nameVal.trim()); setEditName(false); notify(t.nameSaved); }
  };

  const handleSavePass = () => {
    const res = updateUser(session.userId, { currentPassword: curPass, newPassword: newPass });
    if (!res.ok) { notify(res.error === "wrong_password" ? t.wrongPassword : t.passwordShort, false); }
    else { setCurPass(""); setNewPass(""); setEditPass(false); notify(t.passwordSaved); }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setAvatar(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  const handlePay = () => {
    if (!payAmount || !payCard || !payName || !payExpiry || !payCvv) { notify(lang === "ru" ? "Заполните все поля" : "Fill in all fields", false); return; }
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) { notify(lang === "ru" ? "Неверная сумма" : "Invalid amount", false); return; }
    setBalance(b => b + amount);
    setPayDone(true);
    setPayAmount(""); setPayCard(""); setPayName(""); setPayExpiry(""); setPayCvv("");
    notify(lang === "ru" ? `✓ Предоплата $${amount.toFixed(2)} зачислена` : `✓ Prepayment $${amount.toFixed(2)} added`);
    setTimeout(() => setPayDone(false), 4000);
  };

  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: lang === "ru" ? "Обзор" : "Overview" },
    { id: "orders",   label: lang === "ru" ? "Мои заказы" : "My Orders", count: bookedLoads.length },
    { id: "saved",    label: lang === "ru" ? "Избранное" : "Saved", count: savedLoads.length },
    { id: "payment",  label: lang === "ru" ? "Оплата" : "Payment" },
    { id: "settings", label: lang === "ru" ? "Настройки" : "Settings" },
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", background: bg }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        .prof-input:focus { border-color:#CC0000 !important; outline:none; box-shadow:0 0 0 2px rgba(204,0,0,0.15); }
        .prof-tab:hover { color:#CC0000 !important; }
        .prof-card-hover:hover { border-color:#CC0000 !important; transform:translateY(-2px); }
      `}</style>

      {/* ── Hero banner ── */}
      <div style={{ background: isDark ? "linear-gradient(135deg,#0a0000 0%,#1a0000 40%,#0d0d0d 100%)" : "linear-gradient(135deg,#fff 0%,#fff5f5 60%,#ffe8e8 100%)", borderBottom: "1px solid rgba(204,0,0,0.2)", padding: "48px clamp(20px,5vw,64px) 0", position:"relative", overflow:"hidden" }}>
        {/* Truck silhouette background */}
        <div style={{ position:"absolute", right:0, bottom:0, top:0, width:"55%", pointerEvents:"none", zIndex:0 }}>
          <img src="/images/real2.jpg" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 60%", filter: isDark ? "brightness(0.12) saturate(0.4)" : "brightness(0.08) saturate(0)", opacity: isDark ? 1 : 0.35 }} />
          <div style={{ position:"absolute", inset:0, background: isDark ? "linear-gradient(to right,#0a0000 0%,transparent 55%)" : "linear-gradient(to right,#fff 0%,transparent 55%)" }} />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", position:"relative", zIndex:1 }}>

          {/* Back */}
          <button onClick={onBack} style={{ background:"transparent", border:"none", color: muted, fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:12, letterSpacing:1, cursor:"pointer", marginBottom:28, padding:0, display:"flex", alignItems:"center", gap:6, transition:"color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#CC0000"; }}
            onMouseLeave={e => { e.currentTarget.style.color = muted; }}>
            {t.back}
          </button>

          {/* Avatar + info row */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:28, flexWrap:"wrap", paddingBottom:32 }}>

            {/* Avatar */}
            <div style={{ position:"relative", flexShrink:0 }}>
              <div style={{ width:96, height:96, borderRadius:"50%", border:"3px solid #CC0000", overflow:"hidden", boxShadow:"0 0 32px rgba(204,0,0,0.35)", cursor:"pointer", position:"relative" }} onClick={() => fileRef.current?.click()}>
                {avatar ? (
                  <img src={avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                ) : (
                  <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#CC0000,#ff4d4d)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:32, color:"#fff" }}>
                    {initials}
                  </div>
                )}
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0)", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s", borderRadius:"50%" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.5)"; (e.currentTarget as HTMLElement).innerHTML = '<span style="color:#fff;font-size:11px;font-family:Barlow;font-weight:700;letter-spacing:1">📷</span>'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0)"; (e.currentTarget as HTMLElement).innerHTML = ""; }} />
              </div>
              <div style={{ position:"absolute", bottom:2, right:2, width:24, height:24, borderRadius:"50%", background:"#CC0000", border:"2px solid "+bg, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:11 }} onClick={() => fileRef.current?.click()}>
                ✏️
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarChange} />
            </div>

            {/* Name / email */}
            <div style={{ flex:1, minWidth:200, paddingBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <h1 style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:"clamp(22px,3vw,34px)", color:text, margin:0, lineHeight:1 }}>{displayName}</h1>
                <div style={{ display:"inline-flex", alignItems:"center", gap:5, background: isGoogle ? "rgba(66,133,244,0.12)" : "rgba(204,0,0,0.1)", border:`1px solid ${isGoogle?"rgba(66,133,244,0.3)":"rgba(204,0,0,0.25)"}`, borderRadius:20, padding:"3px 10px" }}>
                  <span style={{ fontSize:10 }}>{isGoogle?"🌐":"🔒"}</span>
                  <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color: isGoogle?"#4285F4":"#CC0000" }}>{isGoogle ? t.google : t.local}</span>
                </div>
              </div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:muted, marginTop:5 }}>{session.email}</div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginTop:3 }}>
                {lang==="ru"?"С нами с":"Member since"} {createdAt} · ID #{session.userId.slice(0,8).toUpperCase()}
              </div>
            </div>

            {/* Balance card */}
            <div style={{ background: isDark?"rgba(204,0,0,0.08)":"rgba(204,0,0,0.06)", border:"1px solid rgba(204,0,0,0.25)", borderRadius:12, padding:"16px 24px", textAlign:"center", minWidth:140, marginBottom:4 }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:"#CC0000", letterSpacing:2.5, textTransform:"uppercase", marginBottom:4 }}>💳 {lang==="ru"?"Баланс":"Balance"}</div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:28, color:text, lineHeight:1 }}>${balance.toFixed(2)}</div>
              <button onClick={() => setTab("payment")} style={{ marginTop:8, padding:"4px 12px", background:"#CC0000", border:"none", borderRadius:4, color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
                + {lang==="ru"?"Пополнить":"Add Funds"}
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display:"flex", gap:0, borderTop:`1px solid ${border}`, marginBottom: -1 }}>
            {[
              { n: savedLoads.length, label: lang==="ru"?"Сохранено":"Saved Loads", icon:"❤️" },
              { n: bookedLoads.length, label: lang==="ru"?"Заказов":"Orders", icon:"📦" },
              { n: `$${balance.toFixed(0)}`, label: lang==="ru"?"Баланс":"Balance", icon:"💰" },
              { n: "24/7", label: lang==="ru"?"Поддержка":"Support", icon:"🛡" },
            ].map((s, i) => (
              <div key={i} style={{ flex:1, padding:"12px 0", textAlign:"center", borderRight: i < 3 ? `1px solid ${border}` : "none" }}>
                <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:20, color:"#CC0000" }}>{s.n}</div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>{s.icon} {s.label}</div>
              </div>
            ))}
          </div>

          {/* Tab nav */}
          <div style={{ display:"flex", gap:0, marginTop:16 }}>
            {TABS.map(tb => (
              <button key={tb.id} className="prof-tab" onClick={() => setTab(tb.id)}
                style={{ background:"transparent", border:"none", borderBottom: tab===tb.id ? "2px solid #CC0000" : "2px solid transparent", padding:"10px 20px", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1, textTransform:"uppercase", color: tab===tb.id ? "#CC0000" : muted, cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:6 }}>
                {tb.label}
                {tb.count !== undefined && tb.count > 0 && (
                  <span style={{ background:"#CC0000", color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:9, fontWeight:900, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>{tb.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px clamp(20px,5vw,64px)", animation:"fadeUp 0.35s ease" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
            {/* Recent order */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:22, gridColumn:"span 2" }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:14 }}>📦 {lang==="ru"?"Последние заказы":"Recent Orders"}</div>
              {bookedLoads.length === 0 ? (
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:muted, textAlign:"center", padding:"24px 0" }}>{lang==="ru"?"Заказов пока нет":"No orders yet"}</div>
              ) : bookedLoads.slice(0,3).map(l => (
                <div key={l.id} onClick={() => onDetails?.(l)} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom:`1px solid ${border}`, cursor:"pointer", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.paddingLeft = "6px"; }}
                  onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0"; }}>
                  <img src={l.image} alt="" style={{ width:52, height:44, borderRadius:6, objectFit:"cover", objectPosition:"center 72%", flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{l.route} → {l.dest}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted }}>{l.cargo} · {l.miles.toLocaleString()} mi</div>
                  </div>
                  <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:16, color:"#CC0000", flexShrink:0 }}>${l.price.toLocaleString()}</div>
                </div>
              ))}
              {bookedLoads.length > 3 && (
                <button onClick={() => setTab("orders")} style={{ marginTop:12, background:"transparent", border:"none", color:"#CC0000", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:11, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>
                  {lang==="ru"?"Все заказы →":"All Orders →"}
                </button>
              )}
            </div>

            {/* Saved preview */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:14 }}>❤️ {lang==="ru"?"Избранное":"Saved"}</div>
              {savedLoads.length === 0 ? (
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:muted, textAlign:"center", padding:"24px 0" }}>{lang==="ru"?"Нет сохранённых":"Nothing saved"}</div>
              ) : savedLoads.slice(0,3).map(l => (
                <div key={l.id} onClick={() => onDetails?.(l)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${border}`, cursor:"pointer" }}>
                  <img src={l.image} alt="" style={{ width:42, height:36, borderRadius:5, objectFit:"cover", objectPosition:"center 72%", flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:11, color:text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{l.route} → {l.dest}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted }}>${l.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
              {savedLoads.length > 0 && (
                <button onClick={() => setTab("saved")} style={{ marginTop:10, background:"transparent", border:"none", color:"#CC0000", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:11, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>
                  {lang==="ru"?"Смотреть все →":"View All →"}
                </button>
              )}
            </div>

            {/* Balance / quick pay */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:14 }}>💳 {lang==="ru"?"Баланс":"Balance"}</div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:36, color:text, marginBottom:6 }}>${balance.toFixed(2)}</div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginBottom:16 }}>{lang==="ru"?"Доступно для предоплаты":"Available for prepayment"}</div>
              <button onClick={() => setTab("payment")} style={{ width:"100%", padding:"10px", background:"#CC0000", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
                💳 {lang==="ru"?"Внести предоплату":"Pay Prepayment"}
              </button>
            </div>
          </div>
        )}

        {/* MY ORDERS */}
        {tab === "orders" && (
          <div>
            <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:22, color:text, textTransform:"uppercase", marginBottom:20 }}>
              {lang==="ru"?"МОИ ЗАКАЗЫ":"MY ORDERS"} <span style={{ color:"#CC0000" }}>({bookedLoads.length})</span>
            </div>
            {bookedLoads.length === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <div style={{ fontSize:56, marginBottom:14 }}>📦</div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:15, color:muted, marginBottom:24 }}>{lang==="ru"?"Заказов пока нет":"No orders yet"}</div>
                <button onClick={onBrowseLoads ?? onBack} style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"14px 32px", background:"linear-gradient(135deg,#CC0000,#ff3333)", border:"none", borderRadius:10, color:"#fff", fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:15, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", boxShadow:"0 6px 24px rgba(204,0,0,0.4)", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 32px rgba(204,0,0,0.55)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 24px rgba(204,0,0,0.4)"; }}>
                  <span style={{ fontSize:20, lineHeight:1 }}>+</span>
                  {lang==="ru"?"Найти груз":"Find a Load"}
                </button>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
                {bookedLoads.map((l, idx) => {
                  const rpm = (l.price / l.miles).toFixed(2);
                  const h = Math.floor(l.miles / 55);
                  const m = Math.round(((l.miles / 55) - h) * 60);
                  return (
                    <div key={`${l.id}-${idx}`} className="prof-card-hover" style={{ background:card, border:`1px solid ${border}`, borderRadius:12, overflow:"hidden", transition:"all 0.2s" }}>
                      <div onClick={() => onDetails?.(l)} style={{ position:"relative", height:160, cursor:"pointer" }}>
                        <img src={l.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 72%", filter: isDark?"brightness(0.6)":"brightness(0.72)" }} />
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.85))" }} />
                        <div style={{ position:"absolute", top:10, right:10, background:"rgba(0,180,80,0.15)", border:"1px solid rgba(0,180,80,0.4)", borderRadius:20, padding:"3px 10px", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:9, color:"#00b450", letterSpacing:1, textTransform:"uppercase" }}>
                          ✓ {lang==="ru"?"Активен":"Active"}
                        </div>
                        <div style={{ position:"absolute", bottom:12, left:14 }}>
                          <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:22, color:"#fff" }}>${l.price.toLocaleString()}</div>
                          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"rgba(255,255,255,0.6)" }}>{l.miles.toLocaleString()} mi · ${rpm}/mi · {h}h {m}m</div>
                        </div>
                      </div>
                      <div style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                          <div style={{ width:6, height:6, borderRadius:"50%", border:"2px solid #CC0000", flexShrink:0 }} />
                          <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.route}</span>
                          <span style={{ color:"#CC0000", fontSize:10 }}>→</span>
                          <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"right" }}>{l.dest}</span>
                        </div>
                        <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted, textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>{l.cargo}</div>
                        <div style={{ display:"flex", gap:8 }}>
                          <button onClick={() => onDetails?.(l)} style={{ flex:1, padding:"7px 0", background:"#CC0000", border:"none", borderRadius:5, color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>
                            {lang==="ru"?"Подробнее":"Details"}
                          </button>
                          <button onClick={() => { onOrderCancel?.(l); notify(lang==="ru"?"Заявка отменена":"Request cancelled"); }}
                            style={{ padding:"7px 12px", background:"rgba(204,0,0,0.08)", border:"1px solid rgba(204,0,0,0.25)", borderRadius:5, color:"#CC0000", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, cursor:"pointer", transition:"all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background="#CC0000"; e.currentTarget.style.color="#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background="rgba(204,0,0,0.08)"; e.currentTarget.style.color="#CC0000"; }}>
                            ✕ {lang==="ru"?"Отменить":"Cancel"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SAVED */}
        {tab === "saved" && (
          <div>
            <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:22, color:text, textTransform:"uppercase", marginBottom:20 }}>
              {lang==="ru"?"ИЗБРАННОЕ":"SAVED LOADS"} <span style={{ color:"#CC0000" }}>({savedLoads.length})</span>
            </div>
            {savedLoads.length === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <div style={{ fontSize:56, marginBottom:14 }}>❤️</div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:15, color:muted, marginBottom:24 }}>{lang==="ru"?"Нет сохранённых грузов":"No saved loads"}</div>
                <button onClick={onBrowseLoads ?? onBack} style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"14px 32px", background:"linear-gradient(135deg,#CC0000,#ff3333)", border:"none", borderRadius:10, color:"#fff", fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:15, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", boxShadow:"0 6px 24px rgba(204,0,0,0.4)", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 32px rgba(204,0,0,0.55)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 24px rgba(204,0,0,0.4)"; }}>
                  <span style={{ fontSize:20, lineHeight:1 }}>+</span>
                  {lang==="ru"?"Просмотреть грузы":"Browse Loads"}
                </button>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
                {savedLoads.map((l, idx) => {
                  const rpm = (l.price / l.miles).toFixed(2);
                  return (
                    <div key={`${l.id}-${idx}`} className="prof-card-hover" style={{ background:card, border:`1px solid ${border}`, borderRadius:12, overflow:"hidden", transition:"all 0.2s" }}>
                      <div onClick={() => onDetails?.(l)} style={{ position:"relative", height:160, cursor:"pointer" }}>
                        <img src={l.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 72%", filter: isDark?"brightness(0.6)":"brightness(0.72)" }} />
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.8))" }} />
                        <div style={{ position:"absolute", bottom:12, left:14 }}>
                          <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:22, color:"#fff" }}>${l.price.toLocaleString()}</div>
                          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"rgba(255,255,255,0.6)" }}>{l.miles.toLocaleString()} mi · ${rpm}/mi</div>
                        </div>
                      </div>
                      <div style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                          <div style={{ width:6, height:6, borderRadius:"50%", border:"2px solid #CC0000", flexShrink:0 }} />
                          <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.route}</span>
                          <span style={{ color:"#CC0000", fontSize:10 }}>→</span>
                          <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"right" }}>{l.dest}</span>
                        </div>
                        <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted, textTransform:"uppercase", letterSpacing:0.8, marginBottom:10 }}>{l.cargo}</div>
                        <div style={{ display:"flex", gap:8 }}>
                          <button onClick={() => onDetails?.(l)} style={{ flex:1, padding:"7px 0", background:"#CC0000", border:"none", borderRadius:5, color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>
                            {lang==="ru"?"Подробнее":"Details"}
                          </button>
                          <button onClick={() => { onSaveRemove?.(l); notify(lang==="ru"?"Удалено из избранного":"Removed from saved"); }}
                            style={{ padding:"7px 12px", background:"rgba(255,77,109,0.1)", border:"1px solid rgba(255,77,109,0.3)", borderRadius:5, color:"#ff4d6d", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, cursor:"pointer" }}>
                            ♥ {lang==="ru"?"Убрать":"Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PAYMENT */}
        {tab === "payment" && (
          <div style={{ maxWidth:560 }}>
            <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:22, color:text, textTransform:"uppercase", marginBottom:6 }}>
              {lang==="ru"?"ПРЕДОПЛАТА":"PREPAYMENT"}
            </div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:muted, marginBottom:24 }}>
              {lang==="ru"?"Внесите предоплату для бронирования груза. Средства будут зачислены на ваш баланс.":"Submit a prepayment to book a load. Funds are added to your account balance."}
            </div>

            {/* Current balance */}
            <div style={{ background:isDark?"rgba(204,0,0,0.08)":"rgba(204,0,0,0.05)", border:"1px solid rgba(204,0,0,0.2)", borderRadius:10, padding:"16px 20px", marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:"#CC0000", letterSpacing:2.5, textTransform:"uppercase", marginBottom:4 }}>{lang==="ru"?"Текущий баланс":"Current Balance"}</div>
                <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:28, color:text }}>${balance.toFixed(2)}</div>
              </div>
              {bookedLoads.length > 0 && (
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>{lang==="ru"?"Активных заказов":"Active Orders"}</div>
                  <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:24, color:"#00b450" }}>{bookedLoads.length}</div>
                </div>
              )}
            </div>

            {/* Select load for prepay */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:24, marginBottom:16 }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:14 }}>
                📦 {lang==="ru"?"Выбрать груз (необязательно)":"Select Load (optional)"}
              </div>
              <select value={payLoad?.id ?? ""} onChange={e => setPayLoad(bookedLoads.find(l => l.id === Number(e.target.value)) || null)}
                style={{ width:"100%", padding:"11px 14px", background: isDark?"#1a1a1a":"#fff", border:`1px solid ${inputBd}`, borderRadius:8, color:text, fontSize:13, fontFamily:"'Barlow',sans-serif", outline:"none" }}>
                <option value="" style={{ background: isDark?"#1a1a1a":"#fff", color:text }}>{lang==="ru"?"Общий платёж / выберите груз":"General payment / select load"}</option>
                {bookedLoads.map(l => (
                  <option key={l.id} value={l.id} style={{ background: isDark?"#1a1a1a":"#fff", color:text }}>{l.route} → {l.dest} · ${l.price.toLocaleString()}</option>
                ))}
              </select>
            </div>

            {/* Payment form */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:24 }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:18 }}>
                💳 {lang==="ru"?"Данные карты":"Card Details"}
              </div>
              {payDone ? (
                <div style={{ textAlign:"center", padding:"32px 0", animation:"slideDown 0.4s ease" }}>
                  <div style={{ fontSize:52, marginBottom:12 }}>✅</div>
                  <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:22, color:text, marginBottom:6 }}>{lang==="ru"?"Оплата прошла!":"Payment Successful!"}</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:muted }}>{lang==="ru"?"Средства зачислены на ваш баланс":"Funds added to your balance"}</div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {/* Amount */}
                  <div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginBottom:6, letterSpacing:0.5 }}>{lang==="ru"?"Сумма ($)":"Amount ($)"}</div>
                    <input className="prof-input" type="number" min="1" placeholder={payLoad ? `${(payLoad.price * 0.1).toFixed(0)}` : "500"} value={payAmount} onChange={e => setPayAmount(e.target.value)}
                      style={{ width:"100%", padding:"11px 14px", background:inputBg, border:`1px solid ${inputBd}`, borderRadius:8, color:text, fontSize:14, fontFamily:"'Barlow',sans-serif", transition:"all 0.2s" }} />
                    {payLoad && <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"#CC0000", marginTop:4 }}>10% = ${(payLoad.price * 0.1).toFixed(0)} · 25% = ${(payLoad.price * 0.25).toFixed(0)}</div>}
                  </div>
                  {/* Card number */}
                  <div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginBottom:6, letterSpacing:0.5 }}>{lang==="ru"?"Номер карты":"Card Number"}</div>
                    <input className="prof-input" placeholder="1234 5678 9012 3456" value={payCard} maxLength={19}
                      onChange={e => setPayCard(e.target.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim())}
                      style={{ width:"100%", padding:"11px 14px", background:inputBg, border:`1px solid ${inputBd}`, borderRadius:8, color:text, fontSize:14, fontFamily:"'Barlow',sans-serif", transition:"all 0.2s", letterSpacing:2 }} />
                  </div>
                  {/* Name */}
                  <div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginBottom:6, letterSpacing:0.5 }}>{lang==="ru"?"Имя на карте":"Cardholder Name"}</div>
                    <input className="prof-input" placeholder="JOHN SMITH" value={payName} onChange={e => setPayName(e.target.value.toUpperCase())}
                      style={{ width:"100%", padding:"11px 14px", background:inputBg, border:`1px solid ${inputBd}`, borderRadius:8, color:text, fontSize:14, fontFamily:"'Barlow',sans-serif", transition:"all 0.2s", letterSpacing:1 }} />
                  </div>
                  {/* Expiry + CVV */}
                  <div style={{ display:"flex", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginBottom:6 }}>{lang==="ru"?"Срок действия":"Expiry"}</div>
                      <input className="prof-input" placeholder="MM/YY" value={payExpiry} maxLength={5}
                        onChange={e => { let v = e.target.value.replace(/\D/g,""); if (v.length>=3) v = v.slice(0,2)+"/"+v.slice(2); setPayExpiry(v); }}
                        style={{ width:"100%", padding:"11px 14px", background:inputBg, border:`1px solid ${inputBd}`, borderRadius:8, color:text, fontSize:14, fontFamily:"'Barlow',sans-serif", transition:"all 0.2s" }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginBottom:6 }}>CVV</div>
                      <input className="prof-input" placeholder="•••" type="password" maxLength={4} value={payCvv} onChange={e => setPayCvv(e.target.value.replace(/\D/g,""))}
                        style={{ width:"100%", padding:"11px 14px", background:inputBg, border:`1px solid ${inputBd}`, borderRadius:8, color:text, fontSize:14, fontFamily:"'Barlow',sans-serif", transition:"all 0.2s" }} />
                    </div>
                  </div>
                  <button onClick={handlePay} style={{ padding:"13px 0", background:"linear-gradient(135deg,#CC0000,#ff3333)", border:"none", borderRadius:8, color:"#fff", fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:15, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", boxShadow:"0 6px 20px rgba(204,0,0,0.4)", marginTop:4, transition:"all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(204,0,0,0.55)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 20px rgba(204,0,0,0.4)"; }}>
                    💳 {lang==="ru"?"ОПЛАТИТЬ ПРЕДОПЛАТУ":"PAY PREPAYMENT"}
                  </button>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted, textAlign:"center" }}>
                    🔒 {lang==="ru"?"Защищено SSL · Данные не сохраняются":"SSL secured · Card data not stored"}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div style={{ maxWidth:520, display:"flex", flexDirection:"column", gap:16 }}>
            {/* Edit name */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: editName?16:0 }}>
                <div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>👤 {lang==="ru"?"ИМЯ":"NAME"}</div>
                  {!editName && <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:15, color:text }}>{displayName}</div>}
                </div>
                {!editName && (
                  <button onClick={() => setEditName(true)} style={{ background:"transparent", border:`1px solid ${border}`, borderRadius:6, padding:"7px 16px", color:muted, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:11, letterSpacing:1, textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="#CC0000"; e.currentTarget.style.color="#CC0000"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=border; e.currentTarget.style.color=muted; }}>
                    {t.editName}
                  </button>
                )}
              </div>
              {editName && (
                <div style={{ animation:"slideDown 0.2s ease" }}>
                  <input className="prof-input" value={nameVal} onChange={e => setNameVal(e.target.value)} onKeyDown={e => e.key==="Enter" && handleSaveName()}
                    style={{ width:"100%", padding:"10px 14px", background:inputBg, border:`1px solid ${inputBd}`, borderRadius:6, color:text, fontFamily:"'Barlow',sans-serif", fontSize:14, marginBottom:12, transition:"all 0.2s" }} />
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={handleSaveName} style={{ flex:1, padding:"9px 0", background:"#CC0000", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>{t.save}</button>
                    <button onClick={() => { setEditName(false); setNameVal(displayName); }} style={{ padding:"9px 16px", background:"transparent", border:`1px solid ${border}`, borderRadius:6, color:muted, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>{t.cancel}</button>
                  </div>
                </div>
              )}
            </div>

            {/* Change password */}
            {!isGoogle && (
              <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: editPass?16:0 }}>
                  <div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>🔑 {lang==="ru"?"ПАРОЛЬ":"PASSWORD"}</div>
                    {!editPass && <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:15, color:text }}>••••••••</div>}
                  </div>
                  {!editPass && (
                    <button onClick={() => setEditPass(true)} style={{ background:"transparent", border:`1px solid ${border}`, borderRadius:6, padding:"7px 16px", color:muted, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:11, letterSpacing:1, textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor="#CC0000"; e.currentTarget.style.color="#CC0000"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=border; e.currentTarget.style.color=muted; }}>
                      {t.changePassword}
                    </button>
                  )}
                </div>
                {editPass && (
                  <div style={{ animation:"slideDown 0.2s ease" }}>
                    <input type="password" className="prof-input" value={curPass} onChange={e => setCurPass(e.target.value)} placeholder={t.currentPassword}
                      style={{ width:"100%", padding:"10px 14px", background:inputBg, border:`1px solid ${inputBd}`, borderRadius:6, color:text, fontFamily:"'Barlow',sans-serif", fontSize:14, marginBottom:10, transition:"all 0.2s" }} />
                    <input type="password" className="prof-input" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder={t.newPassword} onKeyDown={e => e.key==="Enter" && handleSavePass()}
                      style={{ width:"100%", padding:"10px 14px", background:inputBg, border:`1px solid ${inputBd}`, borderRadius:6, color:text, fontFamily:"'Barlow',sans-serif", fontSize:14, marginBottom:12, transition:"all 0.2s" }} />
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={handleSavePass} style={{ flex:1, padding:"9px 0", background:"#CC0000", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>{t.save}</button>
                      <button onClick={() => { setEditPass(false); setCurPass(""); setNewPass(""); }} style={{ padding:"9px 16px", background:"transparent", border:`1px solid ${border}`, borderRadius:6, color:muted, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>{t.cancel}</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account info */}
            <div style={{ background:isDark?"rgba(204,0,0,0.06)":"rgba(204,0,0,0.04)", border:"1px solid rgba(204,0,0,0.2)", borderRadius:12, padding:20 }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:12 }}>ℹ️ {lang==="ru"?"ИНФОРМАЦИЯ":"ACCOUNT INFO"}</div>
              {[
                { key: t.accountType, val: isGoogle ? t.google : t.local },
                { key: "User ID", val: `#${session.userId.slice(0,8).toUpperCase()}` },
                { key: lang==="ru"?"Дата регистрации":"Member since", val: createdAt },
              ].map(row => (
                <div key={row.key} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${border}` }}>
                  <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:muted }}>{row.key}</span>
                  <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:12, color:text }}>{row.val}</span>
                </div>
              ))}
            </div>

            {/* Sign out */}
            <button onClick={onLogout} style={{ padding:"12px 0", background:"transparent", border:"1px solid rgba(204,0,0,0.3)", borderRadius:8, color:"#ff6b6b", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(204,0,0,0.1)"; e.currentTarget.style.borderColor="#CC0000"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(204,0,0,0.3)"; }}>
              🚪 {t.signOut}
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, background: toast.ok ? (isDark?"#111":"#fff") : "#1a0000", border:`1px solid ${toast.ok?"#CC0000":"#ff4444"}`, borderRadius:10, padding:"13px 22px", fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:13, color: toast.ok ? (isDark?"#fff":"#1a1a1a") : "#ff6b6b", boxShadow:"0 8px 32px rgba(0,0,0,0.5)", animation:"slideDown 0.3s ease" }}>
          {toast.ok ? "✓ " : "⚠ "}{toast.msg}
        </div>
      )}
    </div>
  );
};
