import React, { useState, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useInView } from "../../hooks/useInView";
import { ArrowRight, Calculator, MapPin } from "@phosphor-icons/react";

interface RateCalculatorProps {
  theme?: "dark" | "light";
  onQuoteClick?: () => void;
}

// Approximate center coordinates per state (lat, lng)
const STATE_COORDS: Record<string, [number, number]> = {
  AL: [32.8, -86.8], AR: [34.8, -92.2], AZ: [34.3, -111.1], CA: [36.8, -119.4],
  CO: [39.0, -105.5], CT: [41.6, -72.7], DE: [39.0, -75.5], FL: [27.8, -81.6],
  GA: [32.2, -83.4], IA: [41.9, -93.4], ID: [44.1, -114.7], IL: [40.0, -89.2],
  IN: [40.3, -86.1], KS: [38.7, -98.4], KY: [37.5, -85.3], LA: [30.5, -91.8],
  MA: [42.3, -71.8], MD: [39.1, -76.8], ME: [45.4, -69.0], MI: [44.3, -85.4],
  MN: [46.4, -93.1], MO: [38.5, -92.5], MS: [32.7, -89.7], MT: [46.9, -110.4],
  NC: [35.6, -79.8], ND: [47.5, -100.5], NE: [41.5, -99.9], NH: [43.7, -71.6],
  NJ: [40.1, -74.5], NM: [34.4, -106.1], NV: [38.5, -117.1], NY: [42.2, -74.9],
  OH: [40.4, -82.8], OK: [35.6, -96.9], OR: [43.9, -120.6], PA: [40.6, -77.2],
  RI: [41.7, -71.5], SC: [33.9, -81.0], SD: [44.4, -100.2], TN: [35.9, -86.4],
  TX: [31.5, -99.3], UT: [39.3, -111.1], VA: [37.5, -78.9], VT: [44.1, -72.7],
  WA: [47.4, -120.5], WI: [44.3, -89.6], WV: [38.6, -80.6], WY: [43.0, -107.6],
};

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AR: "Arkansas", AZ: "Arizona", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida",
  GA: "Georgia", IA: "Iowa", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  MA: "Massachusetts", MD: "Maryland", ME: "Maine", MI: "Michigan",
  MN: "Minnesota", MO: "Missouri", MS: "Mississippi", MT: "Montana",
  NC: "North Carolina", ND: "North Dakota", NE: "Nebraska", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NV: "Nevada", NY: "New York",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VA: "Virginia", VT: "Vermont",
  WA: "Washington", WI: "Wisconsin", WV: "West Virginia", WY: "Wyoming",
};

// $/mile base rate by equipment type
const RATE_BY_EQUIP: Record<string, { min: number; max: number }> = {
  "Dry Van":  { min: 2.20, max: 2.90 },
  "Flatbed":  { min: 2.60, max: 3.40 },
  "Reefer":   { min: 2.70, max: 3.60 },
  "Stepdeck": { min: 2.80, max: 3.70 },
  "RGN":      { min: 3.20, max: 4.50 },
};

function haversineDistance(a: [number, number], b: [number, number]): number {
  const R = 3958.8; // miles
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// Road distance is roughly 1.22× haversine for the US
const ROAD_FACTOR = 1.22;

const STATES = Object.keys(STATE_COORDS).sort();

export const RateCalculator: React.FC<RateCalculatorProps> = ({ theme = "dark", onQuoteClick }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const { ref, inView } = useInView<HTMLElement>(0.1);

  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [equip, setEquip] = useState("Dry Van");

  const bg        = isDark ? "#0a0a0a" : "#f4f0e8";
  const cardBg    = isDark ? "#0f0f0f" : "#ffffff";
  const border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subColor  = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)";
  const inputBg   = isDark ? "#080808" : "#fafafa";
  const inputBd   = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.13)";

  const result = useMemo(() => {
    if (!origin || !dest || origin === dest) return null;
    const a = STATE_COORDS[origin];
    const b = STATE_COORDS[dest];
    if (!a || !b) return null;
    const miles = Math.round(haversineDistance(a, b) * ROAD_FACTOR);
    const { min, max } = RATE_BY_EQUIP[equip];
    return {
      miles,
      rateMin: min,
      rateMax: max,
      totalMin: Math.round(miles * min),
      totalMax: Math.round(miles * max),
      days: Math.ceil(miles / 550),
    };
  }, [origin, dest, equip]);

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    background: inputBg,
    border: `1px solid ${inputBd}`,
    borderRadius: 6,
    outline: "none",
    fontFamily: "'Barlow',sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: textColor,
    cursor: "pointer",
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23CC0000' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 36,
  };

  return (
    <section ref={ref} style={{ background: bg, padding: "72px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(28px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
          className="calc-grid"
        >
          <style>{`
            @media (max-width: 768px) { .calc-grid { grid-template-columns: 1fr !important; } }
          `}</style>

          {/* Left — header */}
          <div>
            <div style={{
              fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11,
              color: "#CC0000", letterSpacing: 4, textTransform: "uppercase",
              marginBottom: 12, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 20, height: 2, background: "#CC0000", display: "inline-block" }} />
              {lang === "ru" ? "Калькулятор ставки" : "Rate Calculator"}
            </div>
            <h2 style={{
              fontFamily: "'Oswald',sans-serif", fontWeight: 700,
              fontSize: "clamp(26px,3.5vw,44px)", color: textColor,
              textTransform: "uppercase", lineHeight: 1.05, marginBottom: 16,
            }}>
              {lang === "ru" ? "ОЦЕНИТЕ " : "ESTIMATE YOUR "}<span style={{ color: "#CC0000" }}>
                {lang === "ru" ? "СТОИМОСТЬ ГРУЗА" : "FREIGHT RATE"}
              </span>
            </h2>
            <p style={{
              fontFamily: "'Barlow',sans-serif", fontSize: 14, color: subColor,
              lineHeight: 1.7, marginBottom: 28, maxWidth: 420,
            }}>
              {lang === "ru"
                ? "Выберите штаты и тип техники — получите приблизительную ставку. Финальная цена согласовывается с диспетчером."
                : "Select states and equipment type to get an estimated freight rate. Final rate is negotiated by your dispatcher."}
            </p>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { num: "$2.20–4.50", label: lang === "ru" ? "$ за милю" : "Per mile" },
                { num: "48", label: lang === "ru" ? "штатов" : "States" },
                { num: "24/7", label: lang === "ru" ? "поддержка" : "Support" },
              ].map(({ num, label }, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 24, color: "#CC0000", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: subColor, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — calculator card */}
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 10,
            padding: "28px 24px",
            boxShadow: isDark ? "0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Calculator size={18} color="#CC0000" weight="duotone" />
              </div>
              <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16, color: textColor, textTransform: "uppercase", letterSpacing: 1 }}>
                {lang === "ru" ? "Быстрый расчёт" : "Quick Estimate"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 2, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <MapPin size={11} color="#CC0000" weight="fill" />
                  {lang === "ru" ? "Штат отправки" : "Origin State"}
                </label>
                <select value={origin} onChange={e => setOrigin(e.target.value)} style={selectStyle}>
                  <option value="">{lang === "ru" ? "— выберите —" : "— select —"}</option>
                  {STATES.map(s => (
                    <option key={s} value={s}>{s} — {STATE_NAMES[s]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 2, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <MapPin size={11} color="#CC0000" weight="fill" />
                  {lang === "ru" ? "Штат назначения" : "Destination State"}
                </label>
                <select value={dest} onChange={e => setDest(e.target.value)} style={selectStyle}>
                  <option value="">{lang === "ru" ? "— выберите —" : "— select —"}</option>
                  {STATES.map(s => (
                    <option key={s} value={s}>{s} — {STATE_NAMES[s]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, display: "block" }}>
                  {lang === "ru" ? "Тип техники" : "Equipment Type"}
                </label>
                <select value={equip} onChange={e => setEquip(e.target.value)} style={selectStyle}>
                  {Object.keys(RATE_BY_EQUIP).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result */}
            {result ? (
              <div style={{
                marginTop: 20,
                background: isDark ? "rgba(204,0,0,0.07)" : "rgba(204,0,0,0.05)",
                border: "1px solid rgba(204,0,0,0.2)",
                borderRadius: 8,
                padding: "18px 16px",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: subColor, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
                      {lang === "ru" ? "Расстояние" : "Est. Distance"}
                    </div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: textColor }}>
                      {result.miles.toLocaleString()} <span style={{ fontSize: 13, color: subColor, fontWeight: 400 }}>mi</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: subColor, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
                      {lang === "ru" ? "Ставка" : "Rate / Mile"}
                    </div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: "#CC0000" }}>
                      ${result.rateMin.toFixed(2)}–${result.rateMax.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: subColor, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
                      {lang === "ru" ? "Общая сумма" : "Est. Total"}
                    </div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: textColor }}>
                      ${result.totalMin.toLocaleString()}–${result.totalMax.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: subColor, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
                      {lang === "ru" ? "Транзит" : "Transit"}
                    </div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: textColor }}>
                      {result.days} <span style={{ fontSize: 13, color: subColor, fontWeight: 400 }}>{lang === "ru" ? "дн." : "days"}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: subColor, margin: "0 0 12px", lineHeight: 1.5 }}>
                  {lang === "ru"
                    ? "* Оценочный расчёт. Финальная ставка зависит от рынка, веса и даты загрузки."
                    : "* Estimated only. Final rate depends on market conditions, weight, and pickup date."}
                </p>
                <button
                  onClick={onQuoteClick}
                  style={{
                    width: "100%", padding: "11px 0",
                    background: "#CC0000", border: "none", borderRadius: 6,
                    color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 800,
                    fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase",
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                    transition: "background 0.15s",
                    boxShadow: "0 4px 16px rgba(204,0,0,0.35)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#aa0000"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#CC0000"; }}
                >
                  {lang === "ru" ? "Получить точную цену" : "Get Exact Quote"}
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            ) : (
              <div style={{
                marginTop: 20,
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                border: `1px dashed ${border}`,
                borderRadius: 8,
                padding: "24px 0",
                textAlign: "center",
              }}>
                <Calculator size={28} color={subColor} weight="duotone" style={{ marginBottom: 8 }} />
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: subColor, margin: 0 }}>
                  {lang === "ru" ? "Выберите штаты для расчёта" : "Select states to see the estimate"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
