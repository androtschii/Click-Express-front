import { useEffect, useState } from "react";

interface Props {
  theme: string;
  onBack: () => void;
}

export function NotFoundPage({ theme, onBack }: Props) {
  const isDark = theme === "dark";
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: isDark ? "#080808" : "#f5f5f5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Barlow:wght@400;600;700;800&display=swap');

        @keyframes glitchShift {
          0%   { clip-path: inset(0 0 95% 0); transform: translate(-4px, 0); }
          20%  { clip-path: inset(30% 0 50% 0); transform: translate(4px, 0); }
          40%  { clip-path: inset(60% 0 20% 0); transform: translate(-3px, 0); }
          60%  { clip-path: inset(10% 0 75% 0); transform: translate(3px, 0); }
          80%  { clip-path: inset(50% 0 10% 0); transform: translate(-4px, 0); }
          100% { clip-path: inset(0 0 95% 0); transform: translate(0, 0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes scanLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes pulse404 {
          0%, 100% { text-shadow: 0 0 60px rgba(204,0,0,0.4), 0 0 120px rgba(204,0,0,0.15); }
          50%       { text-shadow: 0 0 80px rgba(204,0,0,0.7), 0 0 160px rgba(204,0,0,0.25); }
        }

        .not-found-404 {
          animation: pulse404 3s ease infinite;
        }

        .not-found-404-glitch::before,
        .not-found-404-glitch::after {
          content: "404";
          position: absolute;
          top: 0; left: 0; right: 0;
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: inherit;
          color: #CC0000;
        }

        .not-found-404-glitch::before {
          animation: glitchShift 0.2s steps(1) both;
          color: #ff4444;
          opacity: 0.7;
        }

        .not-found-404-glitch::after {
          animation: glitchShift 0.2s steps(1) reverse both;
          color: #ff0044;
          opacity: 0.5;
          transform: translate(3px, 0);
        }
      `}</style>

      {/* Scan line decoration */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: isDark
            ? "linear-gradient(to right, transparent, rgba(204,0,0,0.15), transparent)"
            : "linear-gradient(to right, transparent, rgba(204,0,0,0.1), transparent)",
          animation: "scanLine 6s linear infinite",
        }} />
      </div>

      {/* Grid lines */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(${isDark ? "rgba(204,0,0,0.04)" : "rgba(204,0,0,0.035)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(204,0,0,0.04)" : "rgba(204,0,0,0.035)"} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Red glow orb */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(204,0,0,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both" }}>

        {/* Eyebrow */}
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "#CC0000",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}>
          <span style={{ width: 32, height: 2, background: "#CC0000", display: "inline-block" }} />
          Error
          <span style={{ width: 32, height: 2, background: "#CC0000", display: "inline-block" }} />
        </div>

        {/* 404 */}
        <div style={{ position: "relative", lineHeight: 1, marginBottom: 28 }}>
          <div
            className={`not-found-404${glitch ? " not-found-404-glitch" : ""}`}
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(120px, 22vw, 220px)",
              color: "#CC0000",
              lineHeight: 1,
              letterSpacing: -4,
              userSelect: "none",
              position: "relative",
            }}
          >
            404
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(24px, 4vw, 42px)",
          textTransform: "uppercase",
          color: isDark ? "#fff" : "#1a1a1a",
          letterSpacing: 2,
          marginBottom: 16,
          animation: "fadeUp 0.55s 0.1s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          Page Not Found
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 15,
          color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
          maxWidth: 380,
          margin: "0 auto 40px",
          lineHeight: 1.6,
          animation: "fadeUp 0.55s 0.18s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Divider */}
        <div style={{
          width: 60,
          height: 3,
          background: "#CC0000",
          margin: "0 auto 40px",
          animation: "fadeUp 0.55s 0.24s cubic-bezier(0.22,1,0.36,1) both",
        }} />

        {/* Back button */}
        <div style={{ animation: "fadeUp 0.55s 0.3s cubic-bezier(0.22,1,0.36,1) both" }}>
          <button
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 36px",
              background: "linear-gradient(135deg, #CC0000, #ff3333)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(204,0,0,0.45)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 14px 44px rgba(204,0,0,0.6)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(204,0,0,0.45)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 256 256" fill="white">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
            </svg>
            Back to Home
          </button>
        </div>

        {/* Bottom hint */}
        <div style={{
          marginTop: 48,
          fontFamily: "'Barlow', sans-serif",
          fontSize: 11,
          color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.25)",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          animation: "fadeUp 0.55s 0.38s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          Click Express · Freight Services
        </div>
      </div>
    </div>
  );
}
