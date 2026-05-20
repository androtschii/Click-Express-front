import React from "react";

const CSS = `
@keyframes sk-shimmer {
  0%   { background-position: -600px 0 }
  100% { background-position:  600px 0 }
}`;

interface ShimmerProps {
  w?: string | number;
  h: number;
  r?: number;
  isDark: boolean;
  style?: React.CSSProperties;
}

const S: React.FC<ShimmerProps> = ({ w = "100%", h, r = 4, isDark, style }) => (
  <div style={{
    width: w, height: h, borderRadius: r, flexShrink: 0,
    background: isDark
      ? "linear-gradient(90deg,#1c1c1c 25%,#2e2e2e 50%,#1c1c1c 75%)"
      : "linear-gradient(90deg,#e2e2e2 25%,#ececec 50%,#e2e2e2 75%)",
    backgroundSize: "600px 100%",
    animation: "sk-shimmer 1.4s infinite linear",
    ...style,
  }} />
);

// ── Card skeleton — matches LoadCard layout ─────────────────────────────────

interface LoadSkeletonProps {
  theme?: "dark" | "light";
}

export const LoadSkeleton: React.FC<LoadSkeletonProps> = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const cardBg  = isDark ? "#0f0f0f" : "#fff";
  const cardBdr = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 6, overflow: "hidden" }}>

        {/* Image block */}
        <S isDark={isDark} h={280} r={0} />

        {/* Body */}
        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Route bar */}
          <div style={{ padding: "10px 12px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: 4, display: "flex", flexDirection: "column", gap: 8 }}>
            <S isDark={isDark} h={8} w="60%" r={99} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <S isDark={isDark} h={11} w="38%" />
              <S isDark={isDark} h={11} w="38%" />
            </div>
          </div>

          {/* Cargo tag */}
          <S isDark={isDark} h={10} w="45%" />

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: divider, borderRadius: 4, overflow: "hidden" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ padding: "8px 4px", textAlign: "center", background: cardBg, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <S isDark={isDark} h={7} w="60%" />
                <S isDark={isDark} h={14} w="70%" />
              </div>
            ))}
          </div>

          {/* Bottom: dispatch + button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 2 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <S isDark={isDark} h={8} w={60} />
              <S isDark={isDark} h={13} w={110} />
            </div>
            <S isDark={isDark} h={38} w={110} r={2} />
          </div>
        </div>
      </div>
    </>
  );
};

// ── Row skeleton — matches admin list rows (Drivers / Fleet / Loads) ────────

interface AdminRowSkeletonProps {
  theme?: "dark" | "light";
  avatar?: "square" | "circle";
}

export const AdminRowSkeleton: React.FC<AdminRowSkeletonProps> = ({ theme = "dark", avatar = "square" }) => {
  const isDark = theme === "dark";
  const cardBg = isDark ? "#111" : "#fff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* Avatar / thumbnail */}
          <S isDark={isDark} h={avatar === "circle" ? 44 : 80} w={avatar === "circle" ? 44 : 80}
            r={avatar === "circle" ? 99 : 8} />

          {/* Content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Title row */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <S isDark={isDark} h={16} w={200} />
              <S isDark={isDark} h={20} w={64} r={99} />
              <S isDark={isDark} h={20} w={64} r={99} />
            </div>
            {/* Sub-line */}
            <S isDark={isDark} h={12} w="55%" />
            {/* Fields row */}
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <S isDark={isDark} h={8} w={50} />
                <S isDark={isDark} h={13} w={100} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <S isDark={isDark} h={8} w={50} />
                <S isDark={isDark} h={13} w={130} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <S isDark={isDark} h={8} w={50} />
                <S isDark={isDark} h={13} w={90} />
              </div>
            </div>
          </div>

          {/* Action buttons column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            <S isDark={isDark} h={30} w={90} r={4} />
            <S isDark={isDark} h={30} w={90} r={4} />
          </div>
        </div>
      </div>
    </>
  );
};
