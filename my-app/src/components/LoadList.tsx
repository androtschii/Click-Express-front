import React from "react";
import type { Load } from "../types/index";
import { LoadCard } from "./LoadCard";
import { SearchBar } from "./SearchBar";
import { FilterButtons } from "./FilterButtons";

interface LoadListProps {
  loads: Load[];
  loading: boolean;
  error: string | null;
  search: string;
  filter: string;
  theme?: 'dark' | 'light';
  cardBg?: string;
  onSearchChange: (v: string) => void;
  onFilterChange: (v: string) => void;
  onBook: () => void;
  onSave?: (saved: boolean) => void;
}

export const LoadListView: React.FC<LoadListProps> = ({
  loads,
  loading,
  error,
  search,
  filter,
  onSearchChange,
  onFilterChange,
  onBook,
  onSave,
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
        <p
          style={{
            color: "#CC0000",
            fontFamily: "'Barlow',sans-serif",
          }}
        >
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
    <div>
      <div
        style={{
          background: "#0d0d0d",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 6,
          padding: "16px 20px",
          display: "flex",
          gap: 14,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <SearchBar value={search} onChange={onSearchChange} />
        <FilterButtons active={filter} onChange={onFilterChange} />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap" }}>
        <div
          style={{
            background: "rgba(204,0,0,0.08)",
            border: "1px solid rgba(204,0,0,0.22)",
            borderRadius: 4,
            padding: "7px 16px",
            fontFamily: "'Barlow',sans-serif",
            fontWeight: 600,
            fontSize: 12,
            color: "#CC0000",
            letterSpacing: 1,
          }}
        >
          📋 {loads.length} Load{loads.length !== 1 ? "s" : ""} Available
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 20 }}
      >
        {loads.map(l => (
          <LoadCard key={l.id} load={l} onBook={onBook} onSave={onSave} />
        ))}
      </div>
    </div>
  );
};
