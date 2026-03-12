import React, { useState } from 'react';
import type { Load } from '../../types/index';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", flex: "1 1 280px" }}>
      <span
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 15,
          opacity: 0.4,
          pointerEvents: "none",
        }}
      >
        🔍
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by city or state..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 14px 12px 42px",
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${focused ? "#CC0000" : "rgba(255,255,255,0.12)"}`,
          borderRadius: 4,
          color: "#fff",
          fontSize: 14,
          fontFamily: "'Barlow',sans-serif",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
      />
    </div>
  );
};

interface FilterBtnProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterBtn: React.FC<FilterBtnProps> = ({ label, active, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 20px",
        borderRadius: 4,
        border: active ? "none" : `1px solid ${hov ? "#CC0000" : "rgba(255,255,255,0.1)"}`,
        background: active
          ? "#CC0000"
          : hov
            ? "rgba(204,0,0,0.1)"
            : "rgba(255,255,255,0.04)",
        color: active ? "#fff" : hov ? "#fff" : "rgba(255,255,255,0.5)",
        fontFamily: "'Barlow',sans-serif",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        cursor: "pointer",
        boxShadow: active ? "0 4px 14px rgba(204,0,0,0.4)" : "none",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
};

interface FilterButtonsProps {
  active: string;
  onChange: (filter: string) => void;
  filters: string[];
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  active,
  onChange,
  filters,
}) => {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {filters.map((f) => (
        <FilterBtn
          key={f}
          label={f}
          active={active === f}
          onClick={() => onChange(f)}
        />
      ))}
    </div>
  );
};

interface LoadCardProps {
  load: Load;
  onBook: () => void;
}

export const LoadCard: React.FC<LoadCardProps> = ({ load, onBook }) => {
  const [booked, setBooked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hov, setHov] = useState(false);
  const [bookHov, setBookHov] = useState(false);

  const handleBook = () => {
    if (!booked) {
      setBooked(true);
      onBook();
    }
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#0f0f0f",
        border: `1px solid ${hov ? "#CC0000" : "rgba(255,255,255,0.07)"}`,
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
            background:
              "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.85))",
          }}
        />

        {load.tag && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background:
                load.tag === "Military Load" ? "#1a3a6b" : "#CC0000",
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
            {load.tag === "Best Load of the Week" ? "⭐ " : "🎖️ "}{load.tag}
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
          onClick={() => setSaved((s) => !s)}
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
          {saved ? "❤️" : "🤍"}
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
              ▶
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

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            margin: "0 0 14px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
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
              background: booked
                ? "rgba(0,180,80,0.1)"
                : bookHov
                  ? "#aa0000"
                  : "#CC0000",
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
              boxShadow: !booked
                ? "0 4px 16px rgba(204,0,0,0.35)"
                : "none",
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

interface LoadListProps {
  loads: Load[];
  loading: boolean;
  error: string | null;
  onBook: () => void;
}

export const LoadList: React.FC<LoadListProps> = ({
  loads,
  loading,
  error,
  onBook,
}) => {
  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "90px 0" }}>
        <div
          style={{
            width: 46,
            height: 46,
            margin: "0 auto 18px",
            border: "3px solid rgba(204,0,0,0.15)",
            borderTop: "3px solid #CC0000",
            borderRadius: "50%",
            animation: "spin 0.75s linear infinite",
          }}
        />
        <p
          style={{
            fontFamily: "'Barlow',sans-serif",
            color: "rgba(255,255,255,0.35)",
            fontSize: 14,
          }}
        >
          Loading available loads...
        </p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          border: "1px solid rgba(204,0,0,0.2)",
          borderRadius: 6,
        }}
      >
        <p style={{ color: "#CC0000", fontFamily: "'Barlow',sans-serif" }}>
          ⚠️ {error}
        </p>
      </div>
    );
  if (!loads.length)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px",
          border: "1px dashed rgba(255,255,255,0.08)",
          borderRadius: 6,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 14 }}>🚛</div>
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            fontFamily: "'Barlow',sans-serif",
            fontSize: 16,
          }}
        >
          No loads match your search.
        </p>
      </div>
    );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
        gap: 20,
      }}
    >
      {loads.map((l) => (
        <LoadCard key={l.id} load={l} onBook={onBook} />
      ))}
    </div>
  );
};
