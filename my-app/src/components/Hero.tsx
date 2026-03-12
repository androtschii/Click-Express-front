import React, { useState, useContext } from "react";
import { ThemeContext } from "../theme";

interface HeroBtnProps {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}

export const HeroBtn: React.FC<HeroBtnProps> = ({ children, primary, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: primary ? (hov ? "#aa0000" : "#CC0000") : "transparent",
        color: primary ? "#fff" : hov ? "#CC0000" : "#fff",
        border: primary ? "none" : `1px solid ${hov ? "#CC0000" : "rgba(255,255,0.22)"}`,
        borderRadius: 4,
        padding: "16px 36px",
        fontFamily: "'Oswald',sans-serif",
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: 2,
        textTransform: "uppercase",
        cursor: "pointer",
        boxShadow: primary ? "0 6px 28px rgba(204,0,0,0.45)" : "none",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "all 0.18s",
      }}
    >
      {children}
    </button>
  );
};

interface HeroProps {
  onViewLoads?: () => void;
  onQuoteClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewLoads, onQuoteClick }) => {
  const context = useContext(ThemeContext) as { theme?: 'dark' | 'light'; toggleTheme?: () => void };
  const theme = context.theme || 'dark';
  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        background: theme === 'light' ? '#f4f4f4' : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1800&q=90)",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          filter: theme === 'light' ? 'brightness(1.2) contrast(0.8)' : 'none',
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            theme === 'light'
              ? "linear-gradient(105deg,rgba(255,255,255,0.93) 0%,rgba(255,255,255,0.72) 55%,rgba(255,255,255,0.45) 100%)"
              : "linear-gradient(105deg,rgba(0,0,0,0.93) 0%,rgba(0,0,0,0.72) 55%,rgba(8,0,0,0.45) 100%)",
        }}
      />
      <div
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "#CC0000" }}
      />
      <div
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#CC0000" }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "120px 64px 80px",
          maxWidth: 800,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid rgba(204,0,0,0.45)",
            borderRadius: 3,
            padding: "5px 16px",
            marginBottom: 28,
            background: "rgba(204,0,0,0.08)",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#CC0000",
              animation: "pulse 1.5s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 700,
              fontSize: 10,
              color: "#CC0000",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            USA-Wide Heavy & Oversized Freight · Est. 2019
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(52px,8vw,100px)",
            color: theme === 'dark' ? "#fff" : "#000",
            lineHeight: 0.9,
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          INFRASTRUCTURE
        </h1>
        <h1
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(52px,8vw,100px)",
            color: "transparent",
            WebkitTextStroke: theme === 'dark' ? "2px rgba(255,255,255,0.2)" : "2px rgba(0,0,0,0.2)",
            lineHeight: 0.9,
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          DOESN'T MOVE
        </h1>
        <h1
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(52px,8vw,100px)",
            color: "#CC0000",
            lineHeight: 0.9,
            margin: "0 0 32px",
            textTransform: "uppercase",
          }}
        >
          WE DO.
        </h1>

        <p
          style={{
            fontFamily: "'Barlow',sans-serif",
            fontSize: 16,
            color: theme === 'dark' ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
            lineHeight: 1.8,
            maxWidth: 500,
            marginBottom: 40,
          }}
        >
          Our purpose is to empower businesses with uninterrupted performance, ensuring
          stability, reliability, and efficiency in everything they do.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <HeroBtn primary onClick={onViewLoads}>
            VIEW AVAILABLE LOADS
          </HeroBtn>
          <HeroBtn onClick={onQuoteClick}>GET A FREE QUOTE</HeroBtn>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
    </section>
  );
};

