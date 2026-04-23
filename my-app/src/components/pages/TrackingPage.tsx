import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { Load } from "../../types/index";

interface TrackingPageProps {
  load: Load;
  theme?: "dark" | "light";
  onBack?: () => void;
 bookedAt?: string; // ISO date string
}

// Status steps 
type StepKey = "pending" | "confirmed" | "assigned" | "pickup" | "transit" | "delivered";

interface Step {
  key: StepKey;
  icon: string;
  labelEn: string;
  labelRu: string;
  descEn: string;
  descRu: string;
}

const STEPS: Step[] = [
  { key: "pending",   icon: "📋", labelEn: "Order Received",    labelRu: "Заявка получена",      descEn: "Your booking request is being reviewed", descRu: "Ваша заявка принята и рассматривается" },
  { key: "confirmed", icon: "✅", labelEn: "Confirmed",          labelRu: "Подтверждено",          descEn: "Dispatcher confirmed your load",          descRu: "Диспетчер подтвердил ваш груз" },
  { key: "assigned",  icon: "🚛", labelEn: "Driver Assigned",    labelRu: "Водитель назначен",     descEn: "A driver has been assigned to your load", descRu: "Водитель назначен на ваш груз" },
  { key: "pickup",    icon: "📦", labelEn: "Picked Up",          labelRu: "Груз забран",           descEn: "Load picked up from origin",              descRu: "Груз забран из точки отправления" },
  { key: "transit",   icon: "🛣️", labelEn: "In Transit",         labelRu: "В пути",                descEn: "Your load is on the way to destination",  descRu: "Ваш груз следует к месту назначения" },
  { key: "delivered", icon: "🎉", labelEn: "Delivered",          labelRu: "Доставлено",            descEn: "Load successfully delivered!",            descRu: "Груз успешно доставлен!" },
];

// Deterministic "current step" from load ID so same load always shows same state
function getMockStep(load: Load): number {
 // Spread across steps 1-5 (not all delivered, not all pending)
  const hash = (load.id * 31 + load.miles) % 5;
 return hash + 1; // 1..5 (0=pending is boring, 5=in transit is most common)
}

function getMockDates(load: Load, currentStep: number): string[] {
  const base = new Date();
  base.setDate(base.getDate() - currentStep * 2);
  return STEPS.map((_, i) => {
    if (i > currentStep) return "";
    const d = new Date(base);
    d.setDate(base.getDate() + i * 2 - (i === 0 ? 0 : 0));
    d.setHours(8 + (load.id % 12), (load.miles % 60));
    return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  });
}

function getETA(load: Load, currentStep: number): string {
  const hoursTotal = load.miles / 55;
  const daysTotal = Math.ceil(hoursTotal / 10);
  const remaining = Math.max(0, daysTotal - currentStep + 1);
  const eta = new Date();
  eta.setDate(eta.getDate() + remaining);
  return eta.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
}

// Mini map progress bar 
function RouteProgress({ load, progress, isDark, lang }: { load: Load; progress: number; isDark: boolean; lang: string }) {
  const dotCount = 8;
  return (
    <div style={{ position: "relative", padding: "32px 0 16px" }}>
 {/* City labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: "#CC0000", letterSpacing: 1.5, textTransform: "uppercase" }}>{lang === "ru" ? "ОТКУДА" : "FROM"}</div>
          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16, color: isDark ? "#fff" : "#1a1a1a" }}>{load.route}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, color: "#CC0000", letterSpacing: 1.5, textTransform: "uppercase" }}>{lang === "ru" ? "КУДА" : "TO"}</div>
          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16, color: isDark ? "#fff" : "#1a1a1a" }}>{load.dest}</div>
        </div>
      </div>

 {/* Track line */}
      <div style={{ position: "relative", height: 6, borderRadius: 99, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", overflow: "visible" }}>
 {/* Filled progress */}
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#CC0000,#ff4444)", borderRadius: 99, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />

 {/* Dots */}
        {Array.from({ length: dotCount }).map((_, i) => {
          const pct = (i / (dotCount - 1)) * 100;
          const filled = pct <= progress;
          return (
            <div key={i} style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: filled ? 8 : 6, height: filled ? 8 : 6, borderRadius: "50%", background: filled ? "#CC0000" : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"), border: filled ? "2px solid #ff6666" : "none", transition: "all 0.6s", zIndex: 2 }} />
          );
        })}

 {/* Truck icon at current position */}
        {progress > 0 && progress < 100 && (
          <div style={{ position: "absolute", top: "50%", left: `${progress}%`, transform: "translate(-50%,-50%)", fontSize: 20, zIndex: 3, filter: "drop-shadow(0 2px 6px rgba(204,0,0,0.6))", transition: "left 1.2s cubic-bezier(0.4,0,0.2,1)" }}>
            🚛
          </div>
        )}
        {progress >= 100 && (
          <div style={{ position: "absolute", top: "50%", right: -4, transform: "translateY(-50%)", fontSize: 18, zIndex: 3 }}>🎉</div>
        )}
      </div>

 {/* Miles info */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>
          {Math.round(load.miles * progress / 100).toLocaleString()} {lang === "ru" ? "миль пройдено" : "mi traveled"}
        </div>
        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>
          {load.miles.toLocaleString()} {lang === "ru" ? "миль всего" : "mi total"}
        </div>
      </div>
    </div>
  );
}

// Main component 
export const TrackingPage: React.FC<TrackingPageProps> = ({ load, theme = "dark", onBack }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const currentStep = getMockStep(load);
  const dates = getMockDates(load, currentStep);
  const eta = getETA(load, currentStep);
  const progress = Math.round((currentStep / (STEPS.length - 1)) * 100);

  const bg     = isDark ? "#080808" : "#f5f5f5";
  const card   = isDark ? "#0d0d0d" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const text   = isDark ? "#ffffff" : "#1a1a1a";
  const muted  = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)";

  const currentStepData = STEPS[currentStep];
  const isDelivered = currentStep === STEPS.length - 1;

 // Animate progress bar on mount
  const [animProgress, setAnimProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimProgress(progress), 200);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", background: bg, padding: "clamp(24px,4vw,56px) clamp(16px,4vw,40px)" }}>
      <style>{`
        @keyframes trackFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.92)} }
        .track-step-active { animation: pulse 2s infinite; }
      `}</style>

      <div style={{ maxWidth: 780, margin: "0 auto", animation: "trackFadeUp 0.4s ease" }}>

 {/* Back */}
        <button onClick={onBack}
          style={{ background:"transparent", border:"none", color:muted, fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:13, letterSpacing:1, cursor:"pointer", marginBottom:32, padding:0, display:"flex", alignItems:"center", gap:6, transition:"color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color="#CC0000"}
          onMouseLeave={e => e.currentTarget.style.color=muted}>
          ← {lang === "ru" ? "Назад" : "Back"}
        </button>

 {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:4, textTransform:"uppercase", marginBottom:6 }}>
            ● {lang === "ru" ? "ОТСЛЕЖИВАНИЕ ГРУЗА" : "LOAD TRACKING"}
          </div>
          <h1 style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:"clamp(26px,4vw,40px)", color:text, textTransform:"uppercase", lineHeight:1, margin:0 }}>
            {lang === "ru" ? "ТРЕКИНГ " : "TRACKING "}<span style={{ color:"#CC0000" }}>#{String(load.id).padStart(4,"0")}</span>
          </h1>
        </div>

 {/* Current status banner */}
        <div style={{ background: isDelivered ? "rgba(0,180,80,0.08)" : "rgba(204,0,0,0.07)", border:`1px solid ${isDelivered ? "rgba(0,180,80,0.3)" : "rgba(204,0,0,0.25)"}`, borderRadius:12, padding:"18px 22px", marginBottom:24, display:"flex", alignItems:"center", gap:16 }}>
          <div className={currentStep < STEPS.length - 1 ? "track-step-active" : ""} style={{ fontSize:36 }}>{currentStepData.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:20, color: isDelivered ? "#00b450" : "#CC0000" }}>
              {lang === "ru" ? currentStepData.labelRu : currentStepData.labelEn}
            </div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:muted, marginTop:3 }}>
              {lang === "ru" ? currentStepData.descRu : currentStepData.descEn}
            </div>
          </div>
          {!isDelivered && (
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>{lang === "ru" ? "ПРИБЫТИЕ" : "ETA"}</div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:15, color:text }}>{eta}</div>
            </div>
          )}
        </div>

 {/* Route progress map */}
        <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"20px 24px", marginBottom:20 }}>
          <RouteProgress load={load} progress={animProgress} isDark={isDark} lang={lang} />
        </div>

 {/* Load info strip */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:24 }}>
          {[
            { icon:"💰", label: lang==="ru"?"Стоимость":"Price",    val:`$${load.price.toLocaleString()}` },
            { icon:"📍", label: lang==="ru"?"Расстояние":"Distance", val:`${load.miles.toLocaleString()} mi` },
            { icon:"⚡", label: lang==="ru"?"Ставка":"Rate",        val:`$${(load.price/load.miles).toFixed(2)}/mi` },
            { icon:"📦", label: lang==="ru"?"Груз":"Cargo",         val:load.cargo.split("/")[0].trim() },
          ].map(s => (
            <div key={s.label} style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:16, color:"#CC0000" }}>{s.val}</div>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:muted, letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

 {/* Timeline */}
        <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"24px", marginBottom:20 }}>
          <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:20 }}>
            {lang === "ru" ? "📅 ИСТОРИЯ СТАТУСОВ" : "📅 STATUS TIMELINE"}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {STEPS.map((step, i) => {
              const isDone    = i < currentStep;
              const isActive  = i === currentStep;
              const isPending = i > currentStep;
              const isLast    = i === STEPS.length - 1;

              return (
                <div key={step.key} style={{ display:"flex", gap:16, position:"relative" }}>
 {/* Line */}
                  {!isLast && (
                    <div style={{ position:"absolute", left:19, top:44, bottom:0, width:2, background: isDone ? "#CC0000" : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"), zIndex:0 }} />
                  )}

 {/* Circle */}
                  <div style={{ flexShrink:0, width:40, height:40, borderRadius:"50%", zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
                    background: isDone ? "#CC0000" : isActive ? "rgba(204,0,0,0.12)" : (isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)"),
                    border: isDone ? "none" : isActive ? "2px solid #CC0000" : `2px solid ${border}`,
                    boxShadow: isActive ? "0 0 16px rgba(204,0,0,0.4)" : "none",
                    transition:"all 0.3s",
                  }}>
                    {isDone ? (
                      <svg width="16" height="16" viewBox="0 0 256 256" fill="#fff">
                        <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/>
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"/>
                      </svg>
                    ) : (
                      <span style={{ filter: isPending ? "grayscale(1) opacity(0.4)" : "none" }}>{step.icon}</span>
                    )}
                  </div>

 {/* Content */}
                  <div style={{ flex:1, paddingBottom:28 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                      <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:14,
                        color: isDone ? text : isActive ? "#CC0000" : muted }}>
                        {lang === "ru" ? step.labelRu : step.labelEn}
                      </div>
                      {isActive && (
                        <div style={{ background:"rgba(204,0,0,0.1)", border:"1px solid rgba(204,0,0,0.3)", borderRadius:20, padding:"2px 10px", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:9, color:"#CC0000", letterSpacing:1.5, textTransform:"uppercase" }}>
                          {lang === "ru" ? "ТЕКУЩИЙ" : "CURRENT"}
                        </div>
                      )}
                      {isDone && (
                        <div style={{ background:"rgba(0,180,80,0.08)", border:"1px solid rgba(0,180,80,0.25)", borderRadius:20, padding:"2px 10px", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:9, color:"#00b450", letterSpacing:1.5, textTransform:"uppercase" }}>
                          ✓ {lang === "ru" ? "ВЫПОЛНЕНО" : "DONE"}
                        </div>
                      )}
                    </div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:muted, marginTop:3 }}>
                      {lang === "ru" ? step.descRu : step.descEn}
                    </div>
                    {dates[i] && (
                      <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#CC0000", marginTop:4, opacity:0.85 }}>
                        🕐 {dates[i]}
                      </div>
                    )}
                    {isPending && (
                      <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginTop:4, opacity:0.5 }}>
                        — {lang === "ru" ? "Ожидание" : "Pending"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

 {/* Dispatcher contact */}
        <div style={{ background: isDark?"rgba(204,0,0,0.06)":"rgba(204,0,0,0.04)", border:"1px solid rgba(204,0,0,0.2)", borderRadius:12, padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, color:"#CC0000", letterSpacing:2.5, textTransform:"uppercase", marginBottom:4 }}>
              📞 {lang === "ru" ? "ВОПРОСЫ ПО ГРУЗУ?" : "QUESTIONS ABOUT YOUR LOAD?"}
            </div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, color:muted }}>
              {lang === "ru" ? "Диспетчеры на связи 24/7" : "Our dispatchers are available 24/7"}
            </div>
          </div>
          <a href="tel:+17862026599"
            style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"12px 22px", background:"#CC0000", border:"none", borderRadius:8, color:"#fff", fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:14, letterSpacing:1.5, textTransform:"uppercase", textDecoration:"none", boxShadow:"0 4px 16px rgba(204,0,0,0.4)", transition:"all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(204,0,0,0.55)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(204,0,0,0.4)"; }}>
            📱 +1 786-202-6599
          </a>
        </div>

      </div>
    </div>
  );
};
