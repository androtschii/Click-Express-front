import React from 'react';
import type { Load } from '../../types/index';
import { SearchBar, FilterButtons, LoadList } from './CatalogComponents';

interface CatalogProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  loads: Load[];
  loading: boolean;
  error: string | null;
  onBook: () => void;
  filters: string[];
  filteredCount: number;
  bookCount: number;
}

export const Catalog = React.forwardRef<HTMLDivElement, CatalogProps>(
  (
    {
      search,
      onSearchChange,
      filter,
      onFilterChange,
      loads,
      loading,
      error,
      onBook,
      filters,
      filteredCount,
      bookCount,
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "72px clamp(20px,4vw,56px) 80px",
        }}
      >
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 700,
              fontSize: 10,
              color: "#CC0000",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            — Available Now
          </div>
          <h2
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 700,
              fontSize: "clamp(34px,5.5vw,56px)",
              color: "#fff",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            THE BEST <span style={{ color: "#CC0000" }}>LOADS</span>{" "}
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.18)",
              } as any}
            >
              OF THE WEEK
            </span>
          </h2>
        </div>

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
          <FilterButtons active={filter} onChange={onFilterChange} filters={filters} />
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
            📋 {filteredCount} Load{filteredCount !== 1 ? "s" : ""} Available
          </div>
          {bookCount > 0 && (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 4,
                padding: "7px 16px",
                fontFamily: "'Barlow',sans-serif",
                fontWeight: 600,
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              🛒 Requests: <strong style={{ color: "#fff" }}>{bookCount}</strong>
            </div>
          )}
        </div>

        <LoadList
          loads={loads}
          loading={loading}
          error={error}
          onBook={onBook}
        />
      </section>
    );
  }
);

Catalog.displayName = 'Catalog';
