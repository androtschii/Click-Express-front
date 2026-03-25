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
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background:cardBg, border:`1px solid ${hov?"#CC0000":cardBorder}`, borderRadius:8, overflow:"hidden", transform:hov?"translateY(-5px)":"none", boxShadow:hov?"0 24px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(204,0,0,0.2)":"0 2px 12px rgba(0,0,0,0.2)", transition:"all 0.25s ease" }}>

      {/* ── Фото с блюром ── */}
      <div onClick={() => onDetails && onDetails(load)} style={{ position:"relative", height:300, overflow:"hidden", cursor: onDetails ? "pointer" : "default" }}>
        <img src={load.image} alt={load.route} style={{
          width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 72%",
          filter: isDark ? "brightness(0.55)" : "brightness(0.72)",
          transition:"filter 0.4s ease, transform 0.4s ease",
        }} />
        <div style={{ position:"absolute", inset:0, background: isDark
          ? "linear-gradient(160deg,rgba(0,0,0,0.25) 0%,rgba(0,0,0,0.65) 60%,rgba(0,0,0,0.92) 100%)"
          : "linear-gradient(160deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.42) 55%,rgba(0,0,0,0.72) 100%)"
        }} />

        {/* Тег */}
        {load.tag && (
          <div style={{ position:"absolute", top:0, left:0, background:load.tag==="Military Load"?"#1a3a6b":"#CC0000", color:"#fff", padding:"5px 14px", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:9, letterSpacing:2, textTransform:"uppercase", borderBottomRightRadius:6 }}>
            {load.tag==="Best Load of the Week"?"★ ":"✈ "}{load.tag}
          </div>
        )}

        {/* Кнопка деталей */}
        {onDetails && (
          <div style={{ position:"absolute", top:10, right:52, background:"rgba(0,0,0,0.55)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:20, padding:"4px 12px", fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:10, color:"rgba(255,255,255,0.8)", letterSpacing:1, backdropFilter:"blur(4px)" }}>
            {t.viewDetails}
          </div>
        )}

        <HeartIcon saved={saved} onClick={handleSaveClick} />

        {/* Цена + маршрут поверх фото */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:8 }}>
            <div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:34, color:"#fff", lineHeight:1, textShadow:"0 2px 12px rgba(0,0,0,0.9)" }}>
                ${load.price.toLocaleString()}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4, flexWrap:"wrap" }}>
                <div style={{ background:"#CC0000", color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:9, letterSpacing:2.5, textTransform:"uppercase", padding:"3px 10px", borderRadius:2 }}>{load.type}</div>
                <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"rgba(255,255,255,0.6)" }}>{load.miles.toLocaleString()} mi · ${ratePerMile}/mi</span>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:"rgba(255,255,255,0.45)", letterSpacing:1, textTransform:"uppercase" }}>ETA</div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:14, color:"rgba(255,255,255,0.75)" }}>{driveH}h {driveM}m</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Тело карточки ── */}
      <div style={{ padding:"14px 16px 16px" }}>

        {/* Маршрут */}
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:8 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", border:"2px solid #CC0000", flexShrink:0 }} />
          <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:textPrimary, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{load.route}</span>
          <span style={{ color:"#CC0000", fontSize:10, flexShrink:0 }}>→</span>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#CC0000", flexShrink:0 }} />
          <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:textPrimary, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"right" }}>{load.dest}</span>
        </div>

        <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:textSecondary, letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>{load.cargo}</div>

        {/* Мини-статы */}
        <div style={{ display:"flex", borderRadius:5, overflow:"hidden", border:`1px solid ${dividerColor}`, marginBottom:14 }}>
          {[
            { label:"RATE/MI", value:`$${ratePerMile}`, color:"#00b450" },
            { label:"DISTANCE", value:`${load.miles.toLocaleString()} mi`, color:textPhone },
            { label:"DRIVE TIME", value:`${driveH}h ${driveM}m`, color:textPhone },
          ].map((s, i) => (
            <div key={i} style={{ flex:1, padding:"7px 4px", textAlign:"center", borderRight: i < 2 ? `1px solid ${dividerColor}` : "none", background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:7.5, color:textMuted, letterSpacing:1.2, textTransform:"uppercase", marginBottom:2 }}>{s.label}</div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:13, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Диспетчер + кнопка */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div>
            <div style={{ fontSize:8.5, color:textMuted, fontFamily:"'Barlow',sans-serif", letterSpacing:1.5, textTransform:"uppercase" }}>{t.dispatch}</div>
            <div style={{ fontSize:13, color:textPhone, fontFamily:"'Barlow',sans-serif", fontWeight:600 }}>+1 786-202-6599</div>
          </div>
          <button
            onClick={handleBook}
            onMouseEnter={() => setBookHov(true)}
            onMouseLeave={() => setBookHov(false)}
            style={{
              background: booked ? (bookHov ? "rgba(180,0,0,0.15)" : "rgba(0,180,80,0.1)") : bookHov ? "#aa0000" : "#CC0000",
              color: booked ? (bookHov ? "#CC0000" : "#00b450") : "#fff",
              border: booked ? `1px solid ${bookHov ? "rgba(204,0,0,0.4)" : "rgba(0,180,80,0.3)"}` : "none",
              borderRadius:4, padding:"10px 22px",
              fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:13,
              letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer",
              transform: bookHov ? "translateY(-1px)" : "none",
              boxShadow: !booked ? "0 4px 16px rgba(204,0,0,0.35)" : "none",
              transition:"all 0.15s",
            }}
          >
            {booked ? (bookHov ? t.cancel : t.requested) : t.bookLoad}
          </button>
        </div>
      </div>
    </div>
  );
};