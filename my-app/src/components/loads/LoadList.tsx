import React, { useState, useMemo, useEffect } from "react";
import type { Load } from "../../types/index";
import { LoadCard } from "./LoadCard";
import { LoadSkeleton } from "./LoadSkeleton";
import { SkeletonCard } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { SearchBar } from "./SearchBar";
import { FilterButtons } from "./FilterButtons";
import { LoadMapView } from "./LoadMapView";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";
import { SlidersHorizontal, X } from "@phosphor-icons/react";

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
  const [sortBy, setSortBy] = useState<"none" | "price_asc" | "price_desc" | "miles_asc" | "miles_desc" | "rate_asc" | "rate_desc">("none");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [equipFilter, setEquipFilter] = useState<string>("All");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [milesMin, setMilesMin] = useState("");
  const [milesMax, setMilesMax] = useState("");

  const searchBg    = isDark ? "#0d0d0d"                : "#ffffff";
  const searchBorder= isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.14)";
  const searchShadow= isDark ? "none"                   : "0 2px 16px rgba(0,0,0,0.07)";
  const emptyBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
  const emptyText   = isDark ? "rgba(255,255,255,0.3)"  : "rgba(0,0,0,0.6)";
  const subColor    = isDark ? "rgba(255,255,255,0.4)"  : "rgba(0,0,0,0.45)";
  const inputBg     = isDark ? "#080808"                : "#f5f5f5";
  const inputBd     = isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.13)";

  // Extract unique equipment types from cargo field (first segment before " / ")
  const equipTypes = useMemo(() => {
    const types = new Set(loads.map(l => l.cargo.split("/")[0].trim()));
    return ["All", ...Array.from(types).sort()];
  }, [loads]);

  // Count active advanced filters
  const advancedActiveCount = [
    equipFilter !== "All",
    priceMin !== "",
    priceMax !== "",
    milesMin !== "",
    milesMax !== "",
  ].filter(Boolean).length;

  const resetAdvanced = () => {
    setEquipFilter("All");
    setPriceMin(""); setPriceMax("");
    setMilesMin(""); setMilesMax("");
  };

  const filtered = useMemo(() => {
    return loads.filter(l => {
      if (equipFilter !== "All" && !l.cargo.startsWith(equipFilter)) return false;
      if (priceMin !== "" && l.price < Number(priceMin)) return false;
      if (priceMax !== "" && l.price > Number(priceMax)) return false;
      if (milesMin !== "" && l.miles < Number(milesMin)) return false;
      if (milesMax !== "" && l.miles > Number(milesMax)) return false;
      return true;
    });
  }, [loads, equipFilter, priceMin, priceMax, milesMin, milesMax]);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc")  return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "miles_asc")  return a.miles - b.miles;
    if (sortBy === "miles_desc") return b.miles - a.miles;
    if (sortBy === "rate_asc")   return (a.price / a.miles) - (b.price / b.miles);
    if (sortBy === "rate_desc")  return (b.price / b.miles) - (a.price / a.miles);
    return 0;
  });

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, filter, sortBy, equipFilter, priceMin, priceMax, milesMin, milesMax]);

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

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px", background: inputBg, border: `1px solid ${inputBd}`,
    borderRadius: 5, outline: "none", fontFamily: "'Barlow',sans-serif",
    fontSize: 12, color: isDark ? "#fff" : "#1a1a1a", width: "100%", boxSizing: "border-box",
  };

  return (
    <div>
      {/* Main search + filter bar */}
      <div style={{ background: searchBg, border: `1px solid ${searchBorder}`, borderRadius: 8, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 6, boxShadow: searchShadow }}>
        <SearchBar value={search} onChange={onSearchChange} theme={theme} />
        <FilterButtons active={filter} onChange={onFilterChange} theme={theme} />
        <button
          onClick={() => setShowAdvanced(v => !v)}
          style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 7,
            padding: "8px 16px", borderRadius: 5, cursor: "pointer",
            border: `1px solid ${showAdvanced || advancedActiveCount > 0 ? "#CC0000" : inputBd}`,
            background: showAdvanced || advancedActiveCount > 0 ? "rgba(204,0,0,0.1)" : "transparent",
            fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12,
            letterSpacing: 1, color: showAdvanced || advancedActiveCount > 0 ? "#CC0000" : subColor,
            transition: "all 0.15s",
          }}
        >
          <SlidersHorizontal size={14} weight="bold" />
          {lang === "ru" ? "Фильтры" : "Filters"}
          {advancedActiveCount > 0 && (
            <span style={{
              background: "#CC0000", color: "#fff", borderRadius: "50%",
              width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 800,
            }}>{advancedActiveCount}</span>
          )}
        </button>
      </div>

      {/* Advanced filter panel */}
      {showAdvanced && (
        <div style={{
          background: searchBg, border: `1px solid ${searchBorder}`,
          borderRadius: 8, padding: "18px 20px", marginBottom: 10,
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "#CC0000", letterSpacing: 2, textTransform: "uppercase" }}>
              {lang === "ru" ? "Расширенные фильтры" : "Advanced Filters"}
            </span>
            {advancedActiveCount > 0 && (
              <button onClick={resetAdvanced} style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11,
                color: "#CC0000", letterSpacing: 1, padding: 0,
              }}>
                <X size={12} weight="bold" />
                {lang === "ru" ? "Сбросить" : "Clear all"}
              </button>
            )}
          </div>

          {/* Equipment type */}
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: subColor, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
              {lang === "ru" ? "Тип техники" : "Equipment Type"}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {equipTypes.map(eq => {
                const active = equipFilter === eq;
                return (
                  <button key={eq} onClick={() => setEquipFilter(eq)} style={{
                    padding: "6px 14px", borderRadius: 4, cursor: "pointer",
                    border: `1px solid ${active ? "#CC0000" : inputBd}`,
                    background: active ? "rgba(204,0,0,0.12)" : "transparent",
                    color: active ? "#CC0000" : subColor,
                    fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11,
                    letterSpacing: 0.8, textTransform: "uppercase", transition: "all 0.15s",
                  }}>
                    {eq}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price and miles range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: subColor, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                {lang === "ru" ? "Цена ($)" : "Price ($)"}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" placeholder={lang === "ru" ? "от" : "Min"} value={priceMin} onChange={e => setPriceMin(e.target.value)} style={inputStyle} />
                <span style={{ color: subColor, fontSize: 12 }}>—</span>
                <input type="number" placeholder={lang === "ru" ? "до" : "Max"} value={priceMax} onChange={e => setPriceMax(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: subColor, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                {lang === "ru" ? "Расстояние (миль)" : "Distance (miles)"}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" placeholder={lang === "ru" ? "от" : "Min"} value={milesMin} onChange={e => setMilesMin(e.target.value)} style={inputStyle} />
                <span style={{ color: subColor, fontSize: 12 }}>—</span>
                <input type="number" placeholder={lang === "ru" ? "до" : "Max"} value={milesMax} onChange={e => setMilesMax(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 18 }}>

      <div style={{ display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ background: "rgba(204,0,0,0.08)", border: "1px solid rgba(204,0,0,0.22)", borderRadius: 4, padding: "7px 16px", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, color: "#CC0000", letterSpacing: 1 }}>
          📋 {sorted.length}{sorted.length !== loads.length ? `/${loads.length}` : ""} {sorted.length !== 1 ? t.loadList.loads : t.loadList.load} — {t.loadList.available}
        </div>
        {onFleetClick && (
          <div onClick={onFleetClick} style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.14)"}`, borderRadius: 4, padding: "7px 16px", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", letterSpacing: 1, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#CC0000"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.14)"; e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"; }}>
            🚛 {lang === "ru" ? "НАШ ФЛОТ →" : "OUR FLEET →"}
          </div>
        )}
        {/* Sort buttons */}
        <div style={{ display: "flex", gap: 0, border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.14)"}`, borderRadius: 4, overflow: "hidden" }}>
          {([
            { key: "none",       label: lang === "ru" ? "По умолч." : "Default" },
            { key: "price_asc",  label: lang === "ru" ? "Цена ↑" : "Price ↑" },
            { key: "price_desc", label: lang === "ru" ? "Цена ↓" : "Price ↓" },
            { key: "miles_asc",  label: lang === "ru" ? "Мили ↑" : "Miles ↑" },
            { key: "miles_desc", label: lang === "ru" ? "Мили ↓" : "Miles ↓" },
            { key: "rate_asc",   label: lang === "ru" ? "$/mi ↑" : "$/mi ↑" },
            { key: "rate_desc",  label: lang === "ru" ? "$/mi ↓" : "$/mi ↓" },
          ] as { key: typeof sortBy; label: string }[]).map(opt => {
            const active = sortBy === opt.key;
            return (
              <button key={opt.key} onClick={() => setSortBy(opt.key)} style={{
                padding: "6px 11px", border: "none",
                background: active ? "#CC0000" : "transparent",
                color: active ? "#fff" : isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
                fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 0.5,
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
              }}>
                {opt.label}
              </button>
            );
          })}
        </div>

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

      </div>

      {viewMode === "map" ? (
        <LoadMapView loads={sorted} theme={theme} onDetails={onDetails} />
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", border: `1px dashed ${emptyBorder}`, borderRadius: 6 }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🚛</div>
          <p style={{ color: emptyText, fontFamily: "'Barlow',sans-serif", fontSize: 16 }}>{t.loadList.noMatch}</p>
          {advancedActiveCount > 0 && (
            <button onClick={resetAdvanced} style={{ marginTop: 12, padding: "8px 20px", background: "#CC0000", border: "none", borderRadius: 4, color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              {lang === "ru" ? "Сбросить фильтры" : "Clear Filters"}
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 20 }}>
            {sorted.slice(0, visibleCount).map(l => (
              <LoadCard key={l.id} load={l} onBook={onBook} onCancelBook={onCancelBook} onSave={onSave} onDetails={onDetails} onCompare={onCompare} isBooked={bookedIds.includes(l.id)} isSaved={savedIds.includes(l.id)} isAdmin={isAdmin} isCompared={compareIds.includes(l.id)} compareDisabled={compareIds.length >= 3} />
            ))}
          </div>

          {visibleCount < sorted.length ? (
            <div style={{ textAlign: "center", marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: subColor, letterSpacing: 1 }}>
                {lang === "ru"
                  ? `Показано ${Math.min(visibleCount, sorted.length)} из ${sorted.length}`
                  : `Showing ${Math.min(visibleCount, sorted.length)} of ${sorted.length}`}
              </div>
              <button
                onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                style={{
                  padding: "12px 40px",
                  background: "transparent",
                  border: "1px solid rgba(204,0,0,0.45)",
                  borderRadius: 6,
                  color: "#CC0000",
                  fontFamily: "'Oswald',sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(204,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#CC0000";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(204,0,0,0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(204,0,0,0.45)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {lang === "ru"
                  ? `Загрузить ещё (${sorted.length - visibleCount})`
                  : `Load More (${sorted.length - visibleCount})`}
              </button>
            </div>
          ) : sorted.length > PAGE_SIZE ? (
            <div style={{ textAlign: "center", marginTop: 28, fontFamily: "'Barlow',sans-serif", fontSize: 12, color: subColor, letterSpacing: 1 }}>
              ✓ {lang === "ru" ? `Все ${sorted.length} грузов загружены` : `All ${sorted.length} loads shown`}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};