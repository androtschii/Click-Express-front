import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { ShieldCheck, Certificate, FirstAidKit, Buildings, ArrowSquareOut } from "@phosphor-icons/react";

interface ComplianceBarProps {
  theme?: "dark" | "light";
}

const COMPANY = {
  usdot: "4127334",
  mc: "1567488",
  scac: "CXRS",
  cargoInsurance: "$100,000",
  liabilityInsurance: "$1,000,000",
  founded: "2019",
  hq: "Hallandale Beach, FL",
  saferUrl: "https://safer.fmcsa.dot.gov/CompanyProfile.aspx",
};

export const ComplianceBar: React.FC<ComplianceBarProps> = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const ru = lang === "ru";

  const surface = isDark ? "#0d0d0d" : "#ffffff";
  const text = isDark ? "#f0ede8" : "#0d0d0d";
  const muted = isDark ? "rgba(240,237,232,0.5)" : "rgba(13,13,13,0.55)";
  const divider = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const items = [
    {
      icon: Certificate,
      label: ru ? "USDOT №" : "USDOT #",
      value: COMPANY.usdot,
      sub: ru ? "Активен · FMCSA" : "Active · FMCSA",
    },
    {
      icon: ShieldCheck,
      label: ru ? "MC №" : "MC #",
      value: COMPANY.mc,
      sub: ru ? "Лицензированный перевозчик" : "Licensed Carrier",
    },
    {
      icon: FirstAidKit,
      label: ru ? "Страхование" : "Insurance",
      value: `${COMPANY.cargoInsurance} / ${COMPANY.liabilityInsurance}`,
      sub: ru ? "Cargo / Liability" : "Cargo / Liability",
    },
    {
      icon: Buildings,
      label: ru ? "Основана" : "Founded",
      value: COMPANY.founded,
      sub: COMPANY.hq,
    },
  ];

  return (
    <section
      style={{
        background: surface,
        borderTop: `1px solid ${divider}`,
        borderBottom: `1px solid ${divider}`,
        padding: "clamp(28px,4vw,48px) clamp(16px,5vw,64px)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>
              ● {ru ? "ДОКУМЕНТЫ И ЛИЦЕНЗИИ" : "COMPLIANCE & LICENSING"}
            </div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(20px,3vw,28px)", color: text, textTransform: "uppercase", margin: 0, letterSpacing: 1 }}>
              {ru ? "ПЕРЕВОЗЧИК, " : "A CARRIER YOU CAN "}
              <span style={{ color: "#CC0000" }}>{ru ? "КОТОРОМУ ДОВЕРЯЮТ" : "VERIFY"}</span>
            </h2>
          </div>
          <a
            href={COMPANY.saferUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              border: "1px solid rgba(204,0,0,0.4)",
              borderRadius: 6,
              color: "#CC0000",
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(204,0,0,0.08)";
              e.currentTarget.style.borderColor = "#CC0000";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(204,0,0,0.4)";
            }}
          >
            {ru ? "Проверить на FMCSA SAFER" : "Verify on FMCSA SAFER"}
            <ArrowSquareOut size={14} weight="bold" />
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
            background: divider,
            border: `1px solid ${divider}`,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {items.map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              style={{
                background: surface,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={16} weight="duotone" color="#CC0000" />
                <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: muted, letterSpacing: 2, textTransform: "uppercase" }}>
                  {label}
                </span>
              </div>
              <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: text, letterSpacing: 0.5, fontVariantNumeric: "tabular-nums" }}>
                {value}
              </span>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: muted }}>
                {sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
