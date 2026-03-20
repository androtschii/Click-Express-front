import React, { useState, useContext } from "react";
import { ThemeContext } from "../theme";
import type { Load } from "../types/index";

interface LoadCardProps {
  load: Load;
  onBook?: (load?: Load) => void;
  onCancelBook?: (load?: Load) => void;
  onSave?: (saved: boolean, load?: Load) => void;
}

const HeartIcon = ({ saved, onClick }: { saved: boolean; onClick: () => void }) => {
  const [burst, setBurst] = useState(false);
  const handleClick = () => {
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

export const LoadCard: React.FC<LoadCardProps> = ({ load, onBook, onCancelBook, onSave }) => {
  const context = useContext(ThemeContext) as { theme?: 'dark' | 'light' };
  const theme = context.theme || 'dark';
  const isDark = theme === 'dark';

  const [booked, setBooked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hov, setHov] = useState(false);
  const [bookHov, setBookHov] = useState(false);

  const handleBook = () => {
    if (!booked) {
      setBooked(true);
      onBook && onBook(load);
    } else {
      setBooked(false);
      onCancelBook && onCancelBook(load);
    }
  };

  const handleSaveClick = () => {
    setSaved(s => { const next = !s; onSave && onSave(next, load); return next; });
  };

  const textPrimary   = isDark ? "rgba(255,255,255,0.85)" : "#1a1a1a";
  const textSecondary = isDark ? "rgba(255,255,255,0.3)"  : "rgba(0,0,0,0.45)";
  const textMuted     = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)";
  const textPhone     = isDark ? "rgba(255,255,255,0.6)"  : "rgba(0,0,0,0.6)";
  const dividerColor  = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const cardBg        = isDark ? "#0f0f0f" : "#fff";
  const cardBorder    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)";

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background:cardBg, border:`1px solid ${hov?"#CC0000":cardBorder}`, borderRadius:6, overflow:"hidden", transform:hov?"translateY(-5px)":"none", boxShadow:hov?"0 24px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(204,0,0,0.2)":"none", transition:"all 0.25s ease" }}>
      <div style={{ position:"relative", height:190, overflow:"hidden" }}>
        <img src={load.image} alt={load.route} style={{ width:"100%", height:"100%", objectFit:"cover", transform:hov?"scale(1.06)":"scale(1)", filter:"brightness(0.68)", transition:"transform 0.4s ease" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.85))" }} />
        {load.tag && (
          <div style={{ position:"absolute", top:0, left:0, background:load.tag==="Military Load"?"#1a3a6b":"#CC0000", color:"#fff", padding:"5px 14px", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:9, letterSpacing:2, textTransform:"uppercase", borderBottomRightRadius:6 }}>
            {load.tag==="Best Load of the Week"?"★ ":"✈ "}{load.tag}
          </div>
        )}
        <div style={{ position:"absolute", bottom:14, left:14 }}>
          <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:32, color:"#fff", lineHeight:1, textShadow:"0 2px 8px rgba(0,0,0,0.8)" }}>
            ${load.price.toLocaleString()}
            <span style={{ fontSize:14, color:"rgba(255,255,255,0.6)", marginLeft:6 }}>/ {load.miles.toLocaleString()} Miles</span>
          </div>
          <div style={{ display:"inline-block", background:"#CC0000", color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:9, letterSpacing:2.5, textTransform:"uppercase", padding:"3px 10px", borderRadius:2, marginTop:5 }}>{load.type}</div>
        </div>
        <HeartIcon saved={saved} onClick={handleSaveClick} />
      </div>

      <div style={{ padding:"16px 18px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", border:"2px solid #CC0000", flexShrink:0 }} />
          <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, color:textPrimary }}>{load.route}</span>
          <div style={{ flex:1, height:1, background:"rgba(204,0,0,0.35)", position:"relative" }}>
            <span style={{ position:"absolute", left:"50%", top:-5, transform:"translateX(-50%)", fontSize:8, color:"#CC0000" }}>→</span>
          </div>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#CC0000", flexShrink:0 }} />
          <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, color:textPrimary }}>{load.dest}</span>
        </div>
        <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:textSecondary, letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>{load.cargo}</div>
        <div style={{ height:1, background:dividerColor, margin:"0 0 14px" }} />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div>
            <div style={{ fontSize:9, color:textMuted, fontFamily:"'Barlow',sans-serif", letterSpacing:1.5, textTransform:"uppercase" }}>Dispatch</div>
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
            {booked ? (bookHov ? "✕ CANCEL" : "✓ REQUESTED") : "BOOK LOAD"}
          </button>
        </div>
      </div>
    </div>
  );
};