import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface FleetPageProps {
  theme?: "dark" | "light";
  onBack?: () => void;
}

// ── Truck Photo ─────────────────────────────────────────────────────────────

function TruckImage({ id, isDark, animKey }: { id: string; isDark: boolean; animKey: number }) {
  const [loaded, setLoaded] = useState(false);
  const imageMap: Record<string, string> = {
    cascadia: "/images/Cascadia.png",
    kenworth: "/images/Kenworth.png",
  };
  const src = imageMap[id] || "";
  useEffect(() => { setLoaded(false); }, [animKey]);

  // Visible contrast backgrounds for both themes
  const darkBg  = "linear-gradient(160deg,#1c0a0a 0%,#140606 40%,#0e0404 100%)";
  const lightBg = "linear-gradient(160deg,#f5ecec 0%,#ede0e0 50%,#e8d8d8 100%)";

  return (
    <div style={{
      position: "relative", width: "100%", overflow: "hidden",
      background: isDark ? darkBg : lightBg,
      minHeight: 240,
    }}>
      {/* Diagonal stripe texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(135deg,rgba(204,0,0,${isDark?"0.04":"0.05"}) 0,rgba(204,0,0,${isDark?"0.04":"0.05"}) 1px,transparent 1px,transparent 22px)`, pointerEvents: "none" }} />
      {/* Radial glow from truck center */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 55% 55%,${isDark?"rgba(80,10,10,0.7)":"rgba(204,100,100,0.12)"} 0%,transparent 65%)`, pointerEvents: "none" }} />
      {/* Ground shadow */}
      <div style={{ position: "absolute", bottom: 6, left: "8%", right: "8%", height: 24, background: `radial-gradient(ellipse,${isDark?"rgba(0,0,0,0.8)":"rgba(0,0,0,0.22)"} 0%,transparent 70%)`, pointerEvents: "none" }} />
      {/* Road stripe */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,#CC0000 25%,#CC0000 75%,transparent)" }} />

      {!loaded && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, border: `3px solid rgba(204,0,0,0.25)`, borderTop: "3px solid #CC0000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      )}
      <img
        key={animKey}
        src={src}
        alt={id}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          display: "block",
          objectFit: "contain",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.35s",
          animation: loaded ? "truckRollIn 0.75s cubic-bezier(0.22,1,0.36,1) both" : "none",
          position: "relative", zIndex: 1,
          padding: "16px 4px 28px",
          filter: isDark
            ? "drop-shadow(0 10px 32px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(204,0,0,0.25)) brightness(1.1) contrast(1.05)"
            : "drop-shadow(0 8px 20px rgba(0,0,0,0.3)) drop-shadow(0 0 12px rgba(180,60,60,0.2))",
        }}
      />
    </div>
  );
}

// ── Trailer Image ───────────────────────────────────────────────────────────

function TrailerImage({ id, isDark }: { id: string; isDark: boolean }) {
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageMap: Record<string, string> = {
    flatbed:   "/images/flatbed.png",
    stepdeck:  "/images/stepdeck.png",
    conestoga: "/images/conestoga.png",
    lowboy:    "/images/lowboy.png",
  };
  const labelMap: Record<string, string> = {
    flatbed: "53' FLATBED", stepdeck: "48' STEP DECK",
    conestoga: "53' CONESTOGA", lowboy: "LOWBOY / RGN",
  };
  const imagePath = imageMap[id] ?? "";
  const showFallback = !imagePath || failed;

  const darkBg  = "radial-gradient(ellipse at 55% 60%, #3d0000 0%, #220000 35%, #110000 65%, #080000 100%)";
  const lightBg = "linear-gradient(160deg,#f8f3f3 0%,#f0e8e8 50%,#ece2e2 100%)";

  // Dark: always glowing, even brighter on hover
  const darkFilter = hovered
    ? "brightness(2.6) contrast(1.2) drop-shadow(0 0 36px rgba(255,60,60,0.9)) drop-shadow(0 0 16px rgba(255,120,120,0.6)) saturate(1.4)"
    : "brightness(1.85) contrast(1.12) drop-shadow(0 0 24px rgba(204,0,0,0.6)) drop-shadow(0 0 10px rgba(180,40,40,0.4)) saturate(1.15)";

  const lightFilter = hovered
    ? "drop-shadow(0 0 20px rgba(204,0,0,0.45)) drop-shadow(0 6px 16px rgba(0,0,0,0.25)) brightness(1.05)"
    : "drop-shadow(0 6px 18px rgba(0,0,0,0.28)) drop-shadow(0 0 10px rgba(180,60,60,0.15))";

  if (showFallback) {
    return (
      <div style={{ width: "100%", height: 220, display: "flex", alignItems: "center", justifyContent: "center",
        background: isDark ? darkBg : lightBg }}>
        <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, letterSpacing: 2, color: "#CC0000", textTransform: "uppercase", opacity: 0.7 }}>
          {labelMap[id] || id} — Photo coming soon
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ position: "relative", width: "100%", overflow: "hidden", background: isDark ? darkBg : lightBg, cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Texture stripes */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(135deg,rgba(204,0,0,${isDark?"0.06":"0.04"}) 0,rgba(204,0,0,${isDark?"0.06":"0.04"}) 1px,transparent 1px,transparent 22px)`, pointerEvents: "none" }} />
      {/* Red center glow — always visible in dark, brighter on hover */}
      <div style={{ position: "absolute", inset: 0, background: isDark
        ? `radial-gradient(ellipse at 52% 58%, rgba(220,0,0,${hovered?"0.65":"0.42"}) 0%, rgba(150,0,0,${hovered?"0.35":"0.22"}) 35%, rgba(80,0,0,${hovered?"0.18":"0.1"}) 60%, transparent 80%)`
        : `radial-gradient(ellipse at 50% 55%,rgba(204,0,0,${hovered?"0.1":"0.05"}) 0%,transparent 60%)`,
        transition: "background 0.35s ease", pointerEvents: "none" }} />
      {/* Extra outer red ring */}
      {isDark && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(180,0,0,${hovered?"0.18":"0.1"}) 70%, transparent 90%)`, pointerEvents: "none", transition: "background 0.35s ease" }} />}
      {/* Hover scan-line sweep */}
      {isDark && hovered && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(204,0,0,0.06) 0%,transparent 40%,rgba(204,0,0,0.04) 100%)", pointerEvents: "none", animation: "heroGlow 1.2s ease-in-out infinite" }} />
      )}

      <img
        src={imagePath}
        alt={labelMap[id] || id}
        onError={() => setFailed(true)}
        style={{
          width: "100%", maxWidth: "100%", display: "block", objectFit: "contain",
          padding: "24px 20px 32px",
          position: "relative", zIndex: 1,
          transition: "transform 0.4s ease, filter 0.35s ease",
          filter: isDark ? darkFilter : lightFilter,
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      />
      {/* Bottom accent line — glows on hover */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,#CC0000 25%,#CC0000 75%,transparent)", boxShadow: hovered ? "0 0 18px 4px rgba(204,0,0,0.7)" : "none", transition: "box-shadow 0.35s ease" }} />
      {/* Hover label */}
      {hovered && (
        <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", fontFamily: "'Barlow',sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: 3, color: "#CC0000", textTransform: "uppercase", opacity: 0.85, whiteSpace: "nowrap", animation: "specIn 0.2s ease both" }}>
          {labelMap[id] || id}
        </div>
      )}
    </div>
  );
}

// ── Animated Counter ────────────────────────────────────────────────────────

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start = 0;
    const step = to / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Data ────────────────────────────────────────────────────────────────────

const TRUCKS = [
  {
    id: "cascadia",
    nameEn: "Freightliner Cascadia",
    nameRu: "Freightliner Cascadia",
    year: "2022–2026",
    badge: "FLAGSHIP",
    specs: [
      { labelEn: "MODEL",        labelRu: "МОДЕЛЬ",     value: "Cascadia Evolution" },
      { labelEn: "ENGINE",       labelRu: "ДВИГАТЕЛЬ",  value: "Detroit DD15 — 505 HP" },
      { labelEn: "TRANSMISSION", labelRu: "КПП",        value: "12-Speed Auto (DT12)" },
      { labelEn: "SLEEPER",      labelRu: "КАБИНА",     value: `72" Full-Size Condo` },
      { labelEn: "INVERTER",     labelRu: "ИНВЕРТОР",   value: "3000W" },
      { labelEn: "APU",          labelRu: "APU",        value: "ParkSmart" },
    ],
  },
  {
    id: "kenworth",
    nameEn: "Kenworth T680",
    nameRu: "Kenworth T680",
    year: "2021–2025",
    badge: "PREMIUM",
    specs: [
      { labelEn: "MODEL",        labelRu: "МОДЕЛЬ",     value: "T680 Next Gen" },
      { labelEn: "ENGINE",       labelRu: "ДВИГАТЕЛЬ",  value: "PACCAR MX-13 — 455 HP" },
      { labelEn: "TRANSMISSION", labelRu: "КПП",        value: "12-Speed Auto" },
      { labelEn: "SLEEPER",      labelRu: "КАБИНА",     value: `76" Mid-Roof Condo` },
      { labelEn: "INVERTER",     labelRu: "ИНВЕРТОР",   value: "2000W" },
      { labelEn: "APU",          labelRu: "APU",        value: "Dynasys D3" },
    ],
  },
];

const TRAILERS = [
  {
    id: "flatbed", nameEn: "53' Flatbed", nameRu: "Платформа 53'",
    specs: [
      { labelEn: "MODEL",    labelRu: "МОДЕЛЬ",    value: "Reitnouer MaxMiser" },
      { labelEn: "YEAR",     labelRu: "ГОД",       value: "2020–2024" },
      { labelEn: "LENGTH",   labelRu: "ДЛИНА",     value: "53'" },
      { labelEn: "WIDTH",    labelRu: "ШИРИНА",    value: `102"` },
      { labelEn: "CAPACITY", labelRu: "ГРУЗОП.",   value: "48,000 lbs" },
      { labelEn: "MATERIAL", labelRu: "МАТЕРИАЛ",  value: "Aluminum" },
    ],
    descEn: "Standard 53-foot aluminum flatbed. Handles full truckload, oversized, and heavy freight. Tarps, chains and binders available on request.",
    descRu: "Стандартная алюминиевая платформа 53 фута. Полные грузы, негабаритные и тяжёлые перевозки.",
  },
  {
    id: "stepdeck", nameEn: "48' Step Deck", nameRu: "Степ-дек 48'",
    specs: [
      { labelEn: "UPPER DECK", labelRu: "ВЕРХ. ДЕКА",  value: "11'" },
      { labelEn: "LOWER DECK", labelRu: "НИЖ. ДЕКА",   value: "37'" },
      { labelEn: "DECK HEIGHT",labelRu: "ВЫСОТА",       value: `11'6"` },
      { labelEn: "WIDTH",      labelRu: "ШИРИНА",       value: `102"` },
      { labelEn: "CAPACITY",   labelRu: "ГРУЗОП.",      value: "46,000 lbs" },
      { labelEn: "AXLES",      labelRu: "ОСИ",          value: "2 + Tag" },
    ],
    descEn: "Two-level trailer for taller cargo exceeding standard flatbed height limits. Perfect for construction equipment.",
    descRu: "Двухуровневый прицеп для грузов выше стандартной платформы. Идеален для строительной техники.",
  },
  {
    id: "conestoga", nameEn: "53' Conestoga", nameRu: "Конестога 53'",
    specs: [
      { labelEn: "MODEL",    labelRu: "МОДЕЛЬ",    value: "Reitnouer Conestoga" },
      { labelEn: "LENGTH",   labelRu: "ДЛИНА",     value: "53'" },
      { labelEn: "WIDTH",    labelRu: "ШИРИНА",    value: `103"` },
      { labelEn: "HEIGHT",   labelRu: "ВЫСОТА",    value: `103" interior` },
      { labelEn: "CAPACITY", labelRu: "ГРУЗОП.",   value: "48,000 lbs" },
      { labelEn: "TARPING",  labelRu: "ТАРПИНГ",   value: "Sliding roll-tarp" },
    ],
    descEn: "Fully retractable sliding tarp system — weather protection with flatbed access. No manual tarping.",
    descRu: "Скользящий брезент с полным ретрактом — защита как у вэна, доступ как у платформы.",
  },
  {
    id: "lowboy", nameEn: "Lowboy / RGN", nameRu: "Лоуборд / RGN",
    specs: [
      { labelEn: "TYPE",     labelRu: "ТИП",       value: "Removable Gooseneck" },
      { labelEn: "LENGTH",   labelRu: "ДЛИНА",      value: "48'–53'" },
      { labelEn: "DECK HT",  labelRu: "ДЕКА",       value: `18"–24"` },
      { labelEn: "CAPACITY", labelRu: "ГРУЗОП.",    value: "40,000–80,000 lbs" },
      { labelEn: "PERMITS",  labelRu: "РАЗРЕШ.",    value: "Oversized / Superload" },
      { labelEn: "AXLES",    labelRu: "ОСИ",        value: "3–5 (removable)" },
    ],
    descEn: "Removable gooseneck for the heaviest loads. Direct drive-on loading for tracked vehicles, cranes, and industrial machinery.",
    descRu: "Съёмная шея для самых тяжёлых грузов. Загрузка наездом для гусеничной техники и кранов.",
  },
];

// ── Main Component ──────────────────────────────────────────────────────────

export const FleetPage: React.FC<FleetPageProps> = ({ theme = "dark", onBack }) => {
  const { lang } = useLanguage();
  const isDark = theme === "dark";

  const [activeTruck,   setActiveTruck]   = useState("cascadia");
  const [activeTrailer, setActiveTrailer] = useState("flatbed");
  const [truckKey,      setTruckKey]      = useState(0);
  const [trailerKey,    setTrailerKey]    = useState(0);

  const bg        = isDark ? "#080808" : "#f4f2ef";
  const surface   = isDark ? "#0e0e0e" : "#ffffff";
  const text      = isDark ? "#f0ede8" : "#0d0d0d";
  const muted     = isDark ? "rgba(240,237,232,0.45)" : "rgba(13,13,13,0.48)";
  const divider   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const cardBorder= isDark ? "rgba(204,0,0,0.28)" : "rgba(204,0,0,0.22)";
  const cardShadow= isDark
    ? "0 0 0 1px rgba(204,0,0,0.15), 0 24px 60px rgba(0,0,0,0.8)"
    : "0 4px 6px rgba(204,0,0,0.06), 0 12px 40px rgba(0,0,0,0.14)";

  const truck   = TRUCKS.find(t => t.id === activeTruck) || TRUCKS[0];
  const trailer = TRAILERS.find(t => t.id === activeTrailer) || TRAILERS[0];

  const handleTruck   = (id: string) => { if (id !== activeTruck)   { setActiveTruck(id);   setTruckKey(k => k + 1); } };
  const handleTrailer = (id: string) => { if (id !== activeTrailer) { setActiveTrailer(id); setTrailerKey(k => k + 1); } };

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text }}>
      <style>{`
        @keyframes truckRollIn {
          0%  { opacity:0; transform:translateX(-90px) scaleX(0.94); }
          65% { opacity:1; transform:translateX(7px) scaleX(1.01); }
          100%{ opacity:1; transform:translateX(0) scaleX(1); }
        }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes specIn    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lineGrow  { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes roadAnim  { from{background-position:0 0} to{background-position:200px 0} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.12)} }
        @keyframes slideNum  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fl-row:hover .fl-name { color:#CC0000 !important; }
        .fl-row:hover { background:rgba(204,0,0,0.04) !important; }
        .fl-row { transition:background 0.15s; cursor:pointer; }
        .thumb-btn:hover { border-color:#CC0000 !important; transform:translateY(-2px) !important; box-shadow:0 8px 24px rgba(204,0,0,0.22) !important; }
        .thumb-btn { transition:all 0.2s !important; }
      `}</style>

      <div style={{ animation: "fadeUp 0.45s ease both" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: 440,
          background: isDark
            ? "linear-gradient(110deg,#0d0000 0%,#150000 35%,#0a0000 65%,#060606 100%)"
            : "linear-gradient(110deg,#ffffff 0%,#fdf4f4 40%,#f8ecec 70%,#f4e8e8 100%)",
        }}>
          {/* Dark theme: dimmed photo background */}
          {isDark && (
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/real1.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", filter: "brightness(0.18) saturate(0.5)", mixBlendMode: "luminosity" }} />
          )}
          {/* Overlay gradient */}
          <div style={{ position: "absolute", inset: 0, background: isDark
            ? "linear-gradient(100deg,rgba(8,0,0,0.95) 0%,rgba(12,0,0,0.8) 45%,rgba(0,0,0,0.2) 100%)"
            : "linear-gradient(100deg,rgba(255,255,255,0.98) 0%,rgba(250,240,240,0.92) 45%,rgba(240,220,220,0.4) 100%)"
          }} />
          {/* Dot grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle,${isDark?"rgba(255,255,255,0.022)":"rgba(180,0,0,0.06)"} 1px,transparent 1px)`, backgroundSize: "26px 26px", pointerEvents: "none" }} />
          {/* Diagonal stripes */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(135deg,${isDark?"rgba(204,0,0,0.03)":"rgba(204,0,0,0.04)"} 0,${isDark?"rgba(204,0,0,0.03)":"rgba(204,0,0,0.04)"} 1px,transparent 1px,transparent 28px)`, pointerEvents: "none" }} />
          {/* Road dashes bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundImage: "repeating-linear-gradient(90deg,#CC0000 0,#CC0000 36px,transparent 36px,transparent 72px)", animation: "roadAnim 1.1s linear infinite", opacity: isDark ? 0.9 : 0.7 }} />
          {/* Red corner */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "90px 90px 0 0", borderColor: "#CC0000 transparent transparent transparent", opacity: isDark ? 0.5 : 0.7 }} />
          {/* Top red line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#CC0000 0%,#880000 50%,transparent 100%)" }} />

          {/* Truck image — right side, fully visible */}
          <div style={{ position: "absolute", right: "0%", bottom: 0, width: "clamp(300px,50%,700px)", zIndex: 1, pointerEvents: "none" }}>
            <img src="/images/Cascadia.png" alt="truck" style={{
              width: "100%", height: "100%", display: "block",
              objectFit: "contain", objectPosition: "bottom center",
              maxHeight: 420,
              filter: isDark
                ? "drop-shadow(0 0 50px rgba(204,0,0,0.4)) drop-shadow(-12px 0 40px rgba(0,0,0,0.98)) brightness(1.07)"
                : "drop-shadow(0 0 28px rgba(180,60,60,0.22)) drop-shadow(-6px 0 18px rgba(0,0,0,0.18))",
              animation: "truckRollIn 0.9s cubic-bezier(0.22,1,0.36,1) both",
            }} />
          </div>

          {/* Back button */}
          <button onClick={onBack} style={{ position: "absolute", top: 24, left: "clamp(20px,5vw,80px)", background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", border: `1px solid ${isDark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.15)"}`, backdropFilter: "blur(8px)", borderRadius: 20, padding: "7px 18px", color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s", zIndex: 3 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#CC0000"; e.currentTarget.style.color="#CC0000"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=isDark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.15)"; e.currentTarget.style.color=isDark?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.55)"; }}>
            ← {lang === "ru" ? "НАЗАД" : "BACK"}
          </button>

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2, padding: "80px clamp(20px,5vw,80px) 52px", minHeight: 440, display: "flex", flexDirection: "column", justifyContent: "flex-end", maxWidth: "55%" }}>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 5, textTransform: "uppercase", marginBottom: 14 }}>
              {lang === "ru" ? "ОФИЦИАЛЬНЫЙ АВТОПАРК" : "OFFICIAL COMPANY FLEET"}
            </div>
            <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 900, fontSize: "clamp(44px,8vw,100px)", color: isDark ? "#fff" : "#0d0d0d", textTransform: "uppercase", lineHeight: 0.88, letterSpacing: -2, margin: "0 0 20px" }}>
              <span style={{ color: "#CC0000" }}>CLICK</span> EXPRESS<br />
              <span style={{ color: "#CC0000" }}>{lang === "ru" ? "ФЛОТ" : "FLEET"}</span>
            </h1>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.45)", maxWidth: 380, lineHeight: 1.7, margin: "0 0 32px" }}>
              {lang === "ru"
                ? "Современные грузовики и специализированное оборудование по всей Северной Америке."
                : "Modern trucks and specialized equipment for any freight across North America."}
            </p>
            {/* Stats row */}
            <div style={{ display: "flex", gap: 0, border: `1px solid ${isDark?"rgba(204,0,0,0.28)":"rgba(204,0,0,0.2)"}`, background: isDark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", width: "fit-content" }}>
              {[
                { num: 2,  suffix: "+", en: "TRUCKS",        ru: "ГРУЗОВИКИ" },
                { num: 4,  suffix: "",  en: "TRAILERS",      ru: "ПРИЦЕПЫ" },
                { num: 48, suffix: "K", en: "LBS MAX",       ru: "ФУНТ MAX" },
                { num: 6,  suffix: "+", en: "YEARS",         ru: "ЛЕТ" },
              ].map((s, i, arr) => (
                <div key={s.en} style={{ padding: "16px 22px", borderRight: i < arr.length - 1 ? `1px solid ${isDark?"rgba(204,0,0,0.22)":"rgba(204,0,0,0.15)"}` : "none", textAlign: "center", animation: `slideNum 0.5s ${i * 0.08}s ease both`, animationFillMode: "both" }}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 900, fontSize: "clamp(20px,3vw,34px)", color: "#CC0000", lineHeight: 1 }}>
                    <Counter to={s.num} suffix={s.suffix} />
                  </div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 8, color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4, whiteSpace: "nowrap" }}>
                    {lang === "ru" ? s.ru : s.en}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ TRUCKS ════════════════════════════════════════════════════════ */}
        <section style={{ padding: "64px clamp(20px,5vw,80px) 80px", background: bg }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
            <div style={{ width: 4, height: 52, background: "linear-gradient(180deg,#CC0000,#880000)", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 }}>
                {lang === "ru" ? "АВТОПАРК" : "POWER UNITS"}
              </div>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(36px,6vw,68px)", textTransform: "uppercase", lineHeight: 0.88, letterSpacing: -1.5, color: text, margin: 0 }}>
                {lang === "ru" ? "ГРУЗОВИКИ" : "TRUCKS"}
              </h2>
            </div>
          </div>

          {/* Thumb switcher */}
          <div style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
            {TRUCKS.map(tr => {
              const isA = activeTruck === tr.id;
              return (
                <button key={tr.id} className="thumb-btn" onClick={() => handleTruck(tr.id)} style={{
                  cursor: "pointer",
                  border: `2px solid ${isA ? "#CC0000" : divider}`,
                  borderRadius: 8, padding: "12px 22px",
                  display: "flex", alignItems: "center", gap: 12,
                  background: isA ? (isDark ? "rgba(204,0,0,0.1)" : "rgba(204,0,0,0.07)") : surface,
                  boxShadow: isA
                    ? (isDark ? "0 4px 20px rgba(204,0,0,0.25)" : "0 4px 16px rgba(204,0,0,0.15)")
                    : "none",
                  fontFamily: "inherit",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isA ? "#CC0000" : muted, animation: isA ? "pulse 1.5s ease-in-out infinite" : "none", flexShrink: 0 }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, color: isA ? "#CC0000" : text, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {tr.nameEn.split(" ").slice(-1)[0]}
                    </div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: muted, letterSpacing: 1.5, textTransform: "uppercase" }}>{tr.year}</div>
                  </div>
                  {isA && <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: 2, background: "#CC0000", color: "#fff", padding: "3px 8px", borderRadius: 3, textTransform: "uppercase" }}>{tr.badge}</span>}
                </button>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(260px,44%) 1fr", gap: "clamp(28px,5vw,72px)", alignItems: "start" }}>
            {/* LEFT: accordion */}
            <div>
              {TRUCKS.map(tr => {
                const isA = activeTruck === tr.id;
                return (
                  <div key={tr.id}>
                    <div className="fl-row" onClick={() => handleTruck(tr.id)}
                      style={{ borderTop: `1px solid ${divider}`, padding: "20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {isA && <div style={{ width: 3, height: 22, background: "#CC0000", flexShrink: 0, animation: "specIn 0.25s ease both" }} />}
                        <span className="fl-name" style={{ fontFamily: "'Oswald',sans-serif", fontWeight: isA ? 700 : 500, fontSize: "clamp(14px,2vw,21px)", textTransform: "uppercase", letterSpacing: 0.5, color: isA ? "#CC0000" : text, transition: "color 0.18s" }}>
                          {lang === "ru" ? tr.nameRu : tr.nameEn}
                        </span>
                      </div>
                      <span style={{ color: isA ? "#CC0000" : muted, fontSize: 18, transform: isA ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.25s", display: "inline-block" }}>↓</span>
                    </div>
                    {isA && (
                      <div style={{ padding: "0 10px 28px", animation: "specIn 0.3s ease both" }}>
                        <div style={{ height: 2, background: "linear-gradient(90deg,#CC0000,transparent)", transformOrigin: "left", animation: "lineGrow 0.4s ease both", marginBottom: 18 }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: `1px solid ${divider}` }}>
                          {tr.specs.map((s, i) => (
                            <div key={i} style={{
                              padding: "14px",
                              borderBottom: `1px solid ${divider}`,
                              borderRight: i % 2 === 0 ? `1px solid ${divider}` : "none",
                              background: i % 4 < 2 ? "transparent" : (isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)"),
                              animation: `specIn 0.3s ${i * 0.04}s ease both`, animationFillMode: "both",
                            }}>
                              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 8, color: muted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 5 }}>
                                {lang === "ru" ? s.labelRu : s.labelEn}
                              </div>
                              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 14, color: text }}>
                                {s.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
                          {["DOT Certified", "GPS Tracked", "ELD Compliant", "FMCSA Licensed"].map(tag => (
                            <span key={tag} style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#CC0000", border: "1px solid rgba(204,0,0,0.3)", padding: "4px 10px", borderRadius: 20, background: "rgba(204,0,0,0.06)" }}>✓ {tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${divider}` }} />
            </div>

            {/* RIGHT: photo */}
            <div style={{ position: "sticky", top: 84 }}>
              <div key={truckKey}>
                <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: "clamp(18px,2.8vw,32px)", color: "#CC0000", textTransform: "uppercase", letterSpacing: -0.5 }}>
                    {lang === "ru" ? truck.nameRu : truck.nameEn}
                  </span>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: muted, letterSpacing: 2, textTransform: "uppercase", border: `1px solid ${divider}`, padding: "4px 12px", background: surface }}>
                    {truck.year}
                  </span>
                </div>

                <div style={{ border: `1px solid ${cardBorder}`, overflow: "hidden", boxShadow: cardShadow, position: "relative" }}>
                  <div style={{ height: 3, background: "linear-gradient(90deg,#CC0000 0%,#880000 60%,transparent 100%)" }} />
                  <div style={{ position: "absolute", top: 14, right: 14, zIndex: 2, background: "#CC0000", color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", padding: "4px 12px" }}>
                    {truck.badge}
                  </div>
                  <TruckImage id={activeTruck} isDark={isDark} animKey={truckKey} />
                  <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: isDark ? "#0a0000" : "#1a0000", borderTop: "1px solid rgba(204,0,0,0.25)" }}>
                    <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.38)", letterSpacing: 1.5, textTransform: "uppercase" }}>
                      {lang === "ru" ? "В ПАРКЕ С" : "IN FLEET SINCE"} {truck.year.split("–")[0]}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px rgba(34,197,94,0.9)", animation: "pulse 1.5s ease-in-out infinite" }} />
                      <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "#22c55e", letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>
                        {lang === "ru" ? "АКТИВЕН" : "ACTIVE"}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ height: 3, background: `repeating-linear-gradient(90deg,${isDark?"rgba(204,0,0,0.14)":"rgba(204,0,0,0.12)"} 0,${isDark?"rgba(204,0,0,0.14)":"rgba(204,0,0,0.12)"} 3px,transparent 3px,transparent 9px)` }} />
              </div>
            </div>
          </div>
        </section>

        {/* ══ RED STRIP ════════════════════════════════════════════════════ */}
        <div style={{ background: "linear-gradient(135deg,#AA0000 0%,#CC0000 40%,#990000 100%)", padding: "24px clamp(20px,5vw,80px)", display: "flex", alignItems: "center", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,rgba(0,0,0,0.07) 0,rgba(0,0,0,0.07) 1px,transparent 1px,transparent 16px)", pointerEvents: "none" }} />
          {[
            { en: "HEAVY HAUL SPECIALISTS", ru: "ТЯЖЁЛЫЕ ГРУЗЫ" },
            { en: "OTR & REGIONAL LANES",   ru: "OTR И РЕГИОНЫ" },
            { en: "48 STATES COVERAGE",     ru: "48 ШТАТОВ" },
            { en: "OWNER OPERATORS",        ru: "ВЛАДЕЛЬЦЫ ТРАКОВ" },
          ].map((item, i) => (
            <React.Fragment key={i}>
              <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(11px,1.4vw,15px)", color: "#fff", textTransform: "uppercase", letterSpacing: 1.5, whiteSpace: "nowrap", position: "relative" }}>
                {lang === "ru" ? item.ru : item.en}
              </span>
              {i < 3 && <span style={{ color: "rgba(255,255,255,0.25)", margin: "0 clamp(14px,2vw,36px)", fontSize: 16, flexShrink: 0 }}>·</span>}
            </React.Fragment>
          ))}
        </div>

        {/* ══ TRAILERS ═════════════════════════════════════════════════════ */}
        <section style={{ padding: "64px clamp(20px,5vw,80px) 90px", background: isDark ? "#060202" : "#fdf6f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
            <div style={{ width: 4, height: 52, background: "linear-gradient(180deg,#CC0000,#880000)", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 }}>
                {lang === "ru" ? "ОБОРУДОВАНИЕ" : "EQUIPMENT"}
              </div>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(36px,6vw,68px)", textTransform: "uppercase", lineHeight: 0.88, letterSpacing: -1.5, color: text, margin: 0 }}>
                {lang === "ru" ? "ПРИЦЕПЫ" : "TRAILERS"}
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(260px,44%) 1fr", gap: "clamp(28px,5vw,72px)", alignItems: "start" }}>
            {/* LEFT: accordion */}
            <div>
              {TRAILERS.map(tr => {
                const isA = activeTrailer === tr.id;
                return (
                  <div key={tr.id}>
                    <div className="fl-row" onClick={() => handleTrailer(tr.id)}
                      style={{ borderTop: `1px solid ${divider}`, padding: "20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {isA && <div style={{ width: 3, height: 22, background: "#CC0000", flexShrink: 0, animation: "specIn 0.25s ease both" }} />}
                        <span className="fl-name" style={{ fontFamily: "'Oswald',sans-serif", fontWeight: isA ? 700 : 500, fontSize: "clamp(14px,2vw,21px)", textTransform: "uppercase", letterSpacing: 0.5, color: isA ? "#CC0000" : text, transition: "color 0.18s" }}>
                          {lang === "ru" ? tr.nameRu : tr.nameEn}
                        </span>
                      </div>
                      <span style={{ color: isA ? "#CC0000" : muted, fontSize: 18, transform: isA ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.25s", display: "inline-block" }}>↓</span>
                    </div>
                    {isA && (
                      <div style={{ padding: "0 10px 28px", animation: "specIn 0.3s ease both" }}>
                        <div style={{ height: 2, background: "linear-gradient(90deg,#CC0000,transparent)", transformOrigin: "left", animation: "lineGrow 0.4s ease both", marginBottom: 18 }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
                          {tr.specs.map((s, i) => (
                            <div key={i} style={{ border: `1px solid ${divider}`, padding: "10px 12px", background: surface, animation: `specIn 0.3s ${i * 0.04}s ease both`, animationFillMode: "both" }}>
                              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 8, color: muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                                {lang === "ru" ? s.labelRu : s.labelEn}
                              </div>
                              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, color: text }}>
                                {s.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: muted, lineHeight: 1.8, margin: 0 }}>
                          {lang === "ru" ? tr.descRu : tr.descEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${divider}` }} />
            </div>

            {/* RIGHT: trailer photo */}
            <div style={{ position: "sticky", top: 84 }}>
              <div key={`t-${trailerKey}`} style={{ animation: "truckRollIn 0.6s cubic-bezier(0.22,1,0.36,1) both" }}>
                <div style={{ marginBottom: 14, display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: "clamp(18px,2.8vw,32px)", color: "#CC0000", textTransform: "uppercase", letterSpacing: -0.5 }}>
                    {lang === "ru" ? trailer.nameRu : trailer.nameEn}
                  </span>
                </div>
                <div style={{ border: `1px solid ${cardBorder}`, overflow: "hidden", boxShadow: cardShadow }}>
                  <div style={{ height: 3, background: "linear-gradient(90deg,#CC0000 0%,#880000 60%,transparent 100%)" }} />
                  <TrailerImage id={activeTrailer} isDark={isDark} />
                  {/* 3 quick specs row */}
                  <div style={{ display: "flex", background: isDark ? "#0c0101" : "#fff", borderTop: `1px solid ${divider}` }}>
                    {trailer.specs.slice(0, 3).map((s, i) => (
                      <div key={i} style={{ flex: 1, padding: "10px 14px", borderRight: i < 2 ? `1px solid ${divider}` : "none" }}>
                        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 8, color: muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>
                          {lang === "ru" ? s.labelRu : s.labelEn}
                        </div>
                        <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, color: text }}>
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ══════════════════════════════════════════════════════════ */}
        <div style={{ background: "linear-gradient(135deg,#AA0000 0%,#CC0000 50%,#880000 100%)", padding: "52px clamp(20px,5vw,80px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,rgba(0,0,0,0.06) 0,rgba(0,0,0,0.06) 1px,transparent 1px,transparent 20px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: -60, top: -60, width: 320, height: 320, borderRadius: "50%", border: "70px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
              {lang === "ru" ? "ГОТОВ РАБОТАТЬ С НАМИ?" : "READY TO HAUL WITH US?"}
            </div>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 900, fontSize: "clamp(24px,4.5vw,54px)", color: "#fff", textTransform: "uppercase", lineHeight: 0.9, letterSpacing: -1 }}>
              {lang === "ru" ? "СВЯЖИСЬ С\nДИСПЕТЧЕРОМ" : "CONTACT OUR\nDISPATCHER"}
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="tel:+17862026599" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: "#CC0000", padding: "16px 34px", fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", transition: "all 0.15s", boxShadow: "0 6px 28px rgba(0,0,0,0.28)" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,0.38)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 28px rgba(0,0,0,0.28)"; }}>
              +1 786-202-6599
            </a>
            <a href="mailto:dispatch@clickexpressinc.com" style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 26px", fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(255,255,255,0.28)", transition: "background 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}>
              {lang === "ru" ? "НАПИСАТЬ" : "EMAIL US"}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
