import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = "var(--radius-sm)", style }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)",
        backgroundSize: "200% 100%",
        animation: "ce-shimmer 1.4s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <Skeleton height={180} borderRadius="var(--radius-md)" />
      <Skeleton height={20} width="70%" />
      <Skeleton height={14} width="45%" />
      <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
        <Skeleton height={14} width={60} borderRadius="var(--radius-full)" />
        <Skeleton height={14} width={80} borderRadius="var(--radius-full)" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-4) 0",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <Skeleton width={40} height={40} borderRadius="var(--radius-md)" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Skeleton height={14} width="60%" />
        <Skeleton height={12} width="40%" />
      </div>
      <Skeleton height={24} width={72} borderRadius="var(--radius-full)" style={{ flexShrink: 0 }} />
    </div>
  );
}
