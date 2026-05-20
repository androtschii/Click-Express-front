import React, { useState } from "react";
import type { Load } from "../../types/index";
import { LoadCard } from "./LoadCard";
import { LoadSkeleton } from "./LoadSkeleton";
import { SearchBar } from "./SearchBar";
import { FilterButtons } from "./FilterButtons";
import { LoadMapView } from "./LoadMapView";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

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
  onBook: (load?: Load) => void;
  onCancelBook?: (load?: Load) => void;
  onSave?: (saved: boolean, load?: Load) => void;
  onDetails?: (load: Load) => void;
  bookedIds?: number[];
  savedIds?: number[];
  onFleetClick?: () => void;
  isAdmin?: boolean;
  compareIds?: number[];
  onCompare?: (load: Load) => void;
}

export const LoadListView: React.FC<LoadListProps> = ({
  loads, loading, error, search, filter,
theme = 'dark', onSearchChange, onFilterChange, onBook, onCancelBook, onSave, onDetails, bookedIds = [], savedIds = [], onFleetClick, isAdmin = false, compareIds = [], onCompare,
}) => {
  const isDark = theme === 'dark';
  const { lang } = useLanguage();
  const t = translations[lang];
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const searchBg    = isDark ? "#0d0d0d"                : "#ffffff";
  const searchBorder= isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.14)";
  const searchShadow= isDark ? "none"                   : "0 2px 16px rgba(0,0,0,0.07)";
  const emptyBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
  const emptyText   = isDark ? "rgba(255,255,255,0.3)"  : "rgba(0,0,0,0.6)";
  const loadingText = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.55)";

  if (loading) return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 20 }}>
      {Array.from({ length: 6 }).map((_, i) => <LoadSkeleton key={i} theme={theme} />)}
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "60px 20px", border: "1px solid rgba(204,0,0,0.2)", borderRadius: 6 }}>
      <p style={{ color: "#CC0000", fontFamily: "'Barlow',sans-serif" }}>⚠️ {error}</p>
    </div>
  );

  return (
    <div>
      <div style={{ background: searchBg, border: `1px solid ${searchBorder}`, borderRadius: 8, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 18, boxShadow: searchShadow }}>
        <SearchBar value={search} onChange={onSearchChange} theme={theme} />
        <FilterButtons active={filter} onChange={onFilterChange} theme={theme} />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ background: "rgba(204,0,0,0.08)", border: "1px solid rgba(204,0,0,0.22)", borderRadius: 4, padding: "7px 16px", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, color: "#CC0000", letterSpacing: 1 }}>
          📋 {loads.length} {loads.length !== 1 ? t.loadList.loads : t.loadList.load} — {t.loadList.available}
        </div>
        {onFleetClick && (
          <div onClick={onFleetClick} style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.14)"}`, borderRadius: 4, padding: "7px 16px", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", letterSpacing: 1, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#CC0000"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.14)"; e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"; }}>
            🚛 {lang === "ru" ? "НАШ ФЛОТ →" : "OUR FLEET →"}
          </div>
        )}
        {/* View toggle */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 0, border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.14)"}`, borderRadius: 4, overflow: "hidden" }}>
          {(["grid", "map"] as const).map(mode => {
            const active = viewMode === mode;
            return (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: "6px 14px",
                border: "none",
                background: active ? "#CC0000" : "transparent",
                color: active ? "#fff" : isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
                fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: 1,
                cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                {mode === "grid" ? "⊞" : "📍"} {mode === "grid" ? (lang === "ru" ? "Карточки" : "Grid") : (lang === "ru" ? "Карта" : "Map")}
              </button>
            );
          })}
        </div>
      </div>

      {viewMode === "map" ? (
        <LoadMapView loads={loads} theme={theme} onDetails={onDetails} />
      ) : loads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", border: `1px dashed ${emptyBorder}`, borderRadius: 6 }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🚛</div>
          <p style={{ color: emptyText, fontFamily: "'Barlow',sans-serif", fontSize: 16 }}>{t.loadList.noMatch}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 20 }}>
          {loads.map(l => (
            <LoadCard key={l.id} load={l} onBook={onBook} onCancelBook={onCancelBook} onSave={onSave} onDetails={onDetails} onCompare={onCompare} isBooked={bookedIds.includes(l.id)} isSaved={savedIds.includes(l.id)} isAdmin={isAdmin} isCompared={compareIds.includes(l.id)} compareDisabled={compareIds.length >= 3} />
          ))}
        </div>
      )}
    </div>
  );
};