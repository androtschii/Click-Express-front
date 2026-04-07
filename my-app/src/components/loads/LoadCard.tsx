import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../theme";
import type { Load } from "../../types/index";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface LoadCardProps {
  load: Load;
  onBook?: (load?: Load) => void;
  onCancelBook?: (load?: Load) => void;
  onSave?: (saved: boolean, load?: Load) => void;
  onDetails?: (load: Load) => void;
  isBooked?: boolean;
  isSaved?: boolean;
}

const HeartIcon = ({ saved, onClick }: { saved: boolean; onClick: () => void }) => {
  const [burst, setBurst] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!saved) { setBurst(true); setTimeout(() => setBurst(false), 600); }
    onClick();
  };
  return (
    <>
      <style>{`
        @keyframes heartBeat{0%{transform:scale(1)}25%{transform:scale(1.4)}50%{transform:scale(1.1)}75%{transform:scale(1.25)}100%{transform:scale(1)}}
        @keyframes burstRing{0%{transform:translate(-50%,-50%) scale(0.3);opacity:1}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
        @keyframes particle{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
      `}</style>
      <button onClick={handleClick} style={{ position:"absolute", top:10, right:10, width:38, height:38, borderRadius:"50%", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", background: saved ? "linear-gradient(135deg, #ff4d6d, #CC0000)" : "rgba(0,0,0,0.55)", boxShadow: saved ? "0 0 16px rgba(204,0,0,0.7), 0 0 32px rgba(204,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.4)", transition:"all 0.3s ease", animation: burst ? "heartBeat 0.6s ease" : "none", overflow:"visible" }}>
        {burst && <div style={{ position:"absolute", left:"50%", top:"50%", width:38, height:38, borderRadius:"50%", border:"2px solid #ff4d6d", animation:"burstRing 0.5s ease-out forwards", pointerEvents:"none" }} />}
        {burst && [0,45,90,135,180,225,270,315].map((deg, i) => {
          const rad = deg * Math.PI / 180;
          return <div key={i} style={{ position:"absolute", left:"50%", top:"50%", width:5, height:5, borderRadius:"50%", background: i%2===0 ? "#ff4d6d" : "#FFB300", animation:"particle 0.5s ease-out forwards", "--tx":`${Math.cos(rad)*18}px`, "--ty":`${Math.sin(rad)*18}px`, pointerEvents:"none" } as React.CSSProperties} />;
        })}
        <svg width="18" height="18" viewBox="0 0 24 24" style={{ transition:"all 0.3s", filter: saved ? "drop-shadow(0 0 4px rgba(255,100,100,0.8))" : "none" }}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={saved ? "#fff" : "none"} stroke={saved ? "#fff" : "rgba(255,255,255,0.9)"} strokeWidth={saved ? "0" : "2"} style={{ transition:"all 0.3s" }} />
        </svg>
      </button>
    </>
  );
};

export const LoadCard: React.FC<LoadCardProps> = ({ load, onBook, onCancelBook, onSave, onDetails, isBooked = false, isSaved = false }) => {
  const context = useContext(ThemeContext) as { theme?: 'dark' | 'light' };
  const theme = context.theme || 'dark';
  const isDark = theme === 'dark';
  const { lang } = useLanguage();
  const t = translations[lang].loadCard;

  const [booked, setBooked] = useState(isBooked);
  useEffect(() => { setBooked(isBooked); }, [isBooked]);
  const [saved, setSaved] = useState(isSaved);
  useEffect(() => { setSaved(isSaved); }, [isSaved]);
  const [hov, setHov] = useState(false);
  const [bookHov, setBookHov] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleBook = () => {
    if (!booked) {
      setBooked(true);
      if (onBook) onBook(load);
    } else {
      setBooked(false);
      if (onCancelBook) onCancelBook(load);
    }

  };

  const handleSaveClick = () => {
    setSaved(s => { const next = !s; if (onSave) onSave(next, load); return next; });
  };

  const textPrimary   = isDark ? "rgba(255,255,255,0.85)" : "#1a1a1a";
  const textSecondary = isDark ? "rgba(255,255,255,0.3)"  : "rgba(0,0,0,0.45)";
  const textMuted     = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)";
  const textPhone     = isDark ? "rgba(255,255,255,0.6)"  : "rgba(0,0,0,0.6)";
  const dividerColor  = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const cardBg        = isDark ? "#0f0f0f" : "#fff";
  const cardBorder    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)";

  const ratePerMile = (load.price / load.miles).toFixed(2);
  const driveH = Math.floor(load.miles / 55);
  const driveM = Math.round(((load.miles / 55) - driveH) * 60);

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:cardBg, border:`1px solid ${hov?"#CC0000":cardBorder}`, borderRadius:6, overflow:"hidden", transform:hov?"translateY(-6px)":"none", boxShadow:hov?"0 28px 56px rgba(0,0,0,0.65), 0 0 0 1px rgba(204,0,0,0.25)":"0 2px 14px rgba(0,0,0,0.22)", transition:"all 0.22s cubic-bezier(0.22,1,0.36,1)" }}>

      {/* ── Фото ── */}
      <div onClick={() => onDetails && onDetails(load)} style={{ position:"relative", height:280, overflow:"hidden", cursor: onDetails ? "pointer" : "default" }}>
        {/* Skeleton */}
        {!imgLoaded && <div style={{ position:"absolute", inset:0, background: isDark ? "#1a1a1a" : "#e8e8e8", animation:"shimmer 1.4s ease infinite" }} />}
        <img src={load.image} alt={load.route} onLoad={() => setImgLoaded(true)} style={{
          width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 72%",
          filter: isDark ? "brightness(0.52)" : "brightness(1.0) saturate(1.1) contrast(1.04)",
          transform: hov ? "scale(1.04)" : "scale(1)",
          transition:"filter 0.3s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          opacity: imgLoaded ? 1 : 0,
        }} />
        <div style={{ position:"absolute", inset:0, background: isDark
          ? "linear-gradient(170deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.58) 55%,rgba(0,0,0,0.95) 100%)"
          : "linear-gradient(170deg,rgba(0,0,0,0.0) 0%,rgba(0,0,0,0.18) 50%,rgba(0,0,0,0.72) 100%)"
        }} />

        {/* Тег */}
        {load.tag && (
          <div style={{ position:"absolute", top:0, left:0, background: load.tag==="Military Load" ? "linear-gradient(135deg,#1a3a6b,#0f2347)" : "linear-gradient(135deg,#CC0000,#990000)", color:"#fff", padding:"5px 14px", fontFamily:"'Anton',sans-serif", fontSize:9, letterSpacing:2.5, textTransform:"uppercase" }}>
            {load.tag==="Best Load of the Week" ? "★ " : "✈ "}{load.tag}
          </div>
        )}

        {/* View details pill */}
        {onDetails && (
          <div style={{ position:"absolute", top:10, right:54, background:"rgba(0,0,0,0.6)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:20, padding:"4px 12px", fontFamily:"'Anton',sans-serif", fontSize:9, color:"rgba(255,255,255,0.85)", letterSpacing:2, backdropFilter:"blur(6px)", textTransform:"uppercase", opacity: hov ? 1 : 0, transform: hov ? "translateY(0)" : "translateY(-4px)", transition:"all 0.2s ease" }}>
            {t.viewDetails}
          </div>
        )}

        <HeartIcon saved={saved} onClick={handleSaveClick} />

        {/* Цена + тип */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 16px 14px" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:8 }}>
            <div>
              <div style={{ fontFamily:"'Anton',sans-serif", fontSize:42, color:"#fff", lineHeight:0.88, textShadow:"0 2px 16px rgba(0,0,0,0.95)", letterSpacing:-1 }}>
                ${load.price.toLocaleString()}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6, flexWrap:"wrap" }}>
                <div style={{ background:"#CC0000", color:"#fff", fontFamily:"'Anton',sans-serif", fontSize:9, letterSpacing:2.5, textTransform:"uppercase", padding:"3px 10px" }}>{load.type}</div>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, color:"rgba(255,255,255,0.65)" }}>{load.miles.toLocaleString()} mi</span>
                <span style={{ fontFamily:"'Anton',sans-serif", fontSize:11, color:"#00b450", letterSpacing:1 }}>${ratePerMile}/mi</span>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)", padding:"6px 10px", borderLeft:"2px solid rgba(204,0,0,0.5)" }}>
              <div style={{ fontFamily:"'Anton',sans-serif", fontSize:8, color:"rgba(255,255,255,0.45)", letterSpacing:2, textTransform:"uppercase" }}>ETA</div>
              <div style={{ fontFamily:"'Anton',sans-serif", fontSize:16, color:"rgba(255,255,255,0.85)", letterSpacing:0.5, marginTop:1 }}>{driveH}h {driveM}m</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Тело карточки ── */}
      <div style={{ padding:"14px 16px 16px" }}>

        {/* Роут визуальный */}
        <div style={{ marginBottom:10, padding:"10px 12px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border:`1px solid ${dividerColor}`, borderRadius:4 }}>
          <div style={{ display:"flex", alignItems:"center", gap:0 }}>
            <div style={{ flexShrink:0 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", border:"2px solid #CC0000" }} />
            </div>
            <div style={{ flex:1, display:"flex", alignItems:"center", padding:"0 6px" }}>
              <div style={{ flex:1, height:1, background:`repeating-linear-gradient(90deg,#CC0000 0px,#CC0000 4px,transparent 4px,transparent 8px)`, opacity:0.5 }} />
              <span style={{ fontFamily:"'Anton',sans-serif", fontSize:10, color:"#CC0000", padding:"0 4px", letterSpacing:1 }}>→</span>
              <div style={{ flex:1, height:1, background:`repeating-linear-gradient(90deg,#CC0000 0px,#CC0000 4px,transparent 4px,transparent 8px)`, opacity:0.5 }} />
            </div>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#CC0000", flexShrink:0 }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:11, color:textPrimary, maxWidth:"45%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{load.route}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:11, color:textPrimary, maxWidth:"45%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"right" }}>{load.dest}</span>
          </div>
        </div>

        <div style={{ fontFamily:"'Anton',sans-serif", fontSize:9, color:textSecondary, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>{load.cargo}</div>

        {/* Мини-статы */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, marginBottom:14, background:dividerColor, borderRadius:4, overflow:"hidden" }}>
          {[
            { label:"RATE/MI", value:`$${ratePerMile}`, color:"#00b450" },
            { label:"DISTANCE", value:`${load.miles.toLocaleString()} mi`, color:textPhone },
            { label:"DRIVE TIME", value:`${driveH}h ${driveM}m`, color:textPhone },
          ].map((s, i) => (
            <div key={i} style={{ padding:"8px 4px", textAlign:"center", background: isDark ? "#0f0f0f" : "#fff" }}>
              <div style={{ fontFamily:"'Anton',sans-serif", fontSize:7, color:textMuted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>{s.label}</div>
              <div style={{ fontFamily:"'Anton',sans-serif", fontSize:14, color:s.color, letterSpacing:0.5 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Диспетчер + кнопка */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div>
            <div style={{ fontSize:8, color:textMuted, fontFamily:"'Barlow',sans-serif", fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" }}>{t.dispatch}</div>
            <div style={{ fontSize:13, color:textPhone, fontFamily:"'DM Sans',sans-serif", fontWeight:700, marginTop:1 }}>+1 786-202-6599</div>
          </div>
          <button
            onClick={handleBook}
            onMouseEnter={() => setBookHov(true)}
            onMouseLeave={() => setBookHov(false)}
            style={{
              background: booked ? (bookHov ? "rgba(180,0,0,0.15)" : "rgba(0,180,80,0.1)") : bookHov ? "#aa0000" : "#CC0000",
              color: booked ? (bookHov ? "#CC0000" : "#00b450") : "#fff",
              border: booked ? `1px solid ${bookHov ? "rgba(204,0,0,0.4)" : "rgba(0,180,80,0.3)"}` : "none",
              borderRadius:2, padding:"10px 22px",
              fontFamily:"'Barlow',sans-serif", fontSize:12,
              fontWeight: 800, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer",
              transform: bookHov ? "translateY(-1px)" : "none",
              boxShadow: !booked ? "0 4px 18px rgba(204,0,0,0.38)" : "none",
              transition:"all 0.15s",
            }}
          >
            {booked ? (bookHov ? t.cancel : t.requested) : t.bookLoad}
          </button>
        </div>
      </div>
      <style>{`@keyframes shimmer{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
    </div>
  );
};