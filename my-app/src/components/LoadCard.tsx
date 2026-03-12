import React, { useState, useContext } from "react";
import { ThemeContext } from "../theme";
import type { Load } from "../types/index";

interface LoadCardProps {
  load: Load;
  onBook?: () => void;
  onSave?: (saved: boolean) => void;
}

export const LoadCard: React.FC<LoadCardProps> = ({ load, onBook, onSave }) => {
  const context = useContext(ThemeContext) as { theme?: 'dark' | 'light'; toggleTheme?: () => void };
  const theme = context.theme || 'dark';
  const [booked, setBooked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hov, setHov] = useState(false);
  const [bookHov, setBookHov] = useState(false);

  const handleBook = () => {
    if (!booked) {
      setBooked(true);
      onBook && onBook();
    }
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: theme === 'dark' ? "#0f0f0f" : "#fff",
        border: `1px solid ${hov ? "#CC0000" : theme === 'dark' ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 6,
        overflow: "hidden",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov
          ? "0 24px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(204,0,0,0.2)"
          : "none",
        transition: "all 0.25s ease",
      }}
    >
      <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
        <img
          src={load.image}
          alt={load.route}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hov ? "scale(1.06)" : "scale(1)",
            filter: "brightness(0.68)",
            transition: "transform 0.4s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.85))",
          }}
        />

        {load.tag && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background: load.tag === "Military Load" ? "#1a3a6b" : "#CC0000",
              color: "#fff",
              padding: "5px 14px",
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 800,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              borderBottomRightRadius: 6,
            }}
          >
            {load.tag === "Best Load of the Week" ? "★ " : "✈ "}
            {load.tag}
          </div>
        )}

        <div style={{ position: "absolute", bottom: 14, left: 14 }}>
          <div
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 700,
              fontSize: 32,
              color: "#fff",
              lineHeight: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            ${load.price.toLocaleString()}
            <span
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                marginLeft: 6,
              }}
            >
              / {load.miles.toLocaleString()} Miles
            </span>
          </div>
          <div
            style={{
              display: "inline-block",
              background: "#CC0000",
              color: "#fff",
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 800,
              fontSize: 9,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: 2,
              marginTop: 5,
            }}
          >
            {load.type}
          </div>
        </div>

        <button
          onClick={() => {
            setSaved(s => {
              const next = !s;
              onSave && onSave(next);
              return next;
            });
          }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.55)",
            border: "none",
            borderRadius: "50%",
            width: 34,
            height: 34,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: saved ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.2s",
          }}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "2px solid #CC0000",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {load.route}
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(204,0,0,0.35)",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: -5,
                transform: "translateX(-50%)",
                fontSize: 8,
                color: "#CC0000",
              }}
            >
              →
            </span>
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#CC0000",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {load.dest}
          </span>
        </div>

        <div
          style={{
            fontFamily: "'Barlow',sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {load.cargo}
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 14px" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.25)",
                fontFamily: "'Barlow',sans-serif",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Dispatch
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Barlow',sans-serif",
                fontWeight: 600,
              }}
            >
              +1 786-202-6599
            </div>
          </div>

          <button
            onClick={handleBook}
            onMouseEnter={() => setBookHov(true)}
            onMouseLeave={() => setBookHov(false)}
            disabled={booked}
            style={{
              background: booked ? "rgba(0,180,80,0.1)" : bookHov ? "#aa0000" : "#CC0000",
              color: booked ? "#00b450" : "#fff",
              border: booked ? "1px solid rgba(0,180,80,0.3)" : "none",
              borderRadius: 4,
              padding: "10px 22px",
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              cursor: booked ? "default" : "pointer",
              transform: !booked && bookHov ? "translateY(-1px)" : "none",
              boxShadow: !booked ? "0 4px 16px rgba(204,0,0,0.35)" : "none",
              transition: "all 0.15s",
            }}
          >
            {booked ? "✓ REQUESTED" : "BOOK LOAD"}
          </button>
        </div>
      </div>
    </div>
  );
};

