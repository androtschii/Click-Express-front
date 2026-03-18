import type { Load, QuoteFormData } from "../types/index";

// ── УРОВЕНЬ БИЗНЕС-ЛОГИКИ (Business Logic Layer) ──────────────────────────
// Этот слой содержит всю логику обработки данных.
// Компоненты не знают КАК фильтруются данные — они просто вызывают сервис.

// ── 1. ФИЛЬТРАЦИЯ МАРШРУТОВ ───────────────────────────────────────────────
export const filterLoads = (
  loads: Load[],
  search: string,
  filter: string
): Load[] => {
  return loads.filter(l => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      l.route.toLowerCase().includes(q) ||
      l.dest.toLowerCase().includes(q) ||
      l.cargo.toLowerCase().includes(q);
    const matchFilter =
      filter === "All Loads" ||
      l.type === filter ||
      l.tag === filter;
    return matchSearch && matchFilter;
  });
};

// ── 2. РАСЧЁТ ЦЕНЫ ЗА МИЛЮ ───────────────────────────────────────────────
export const getPricePerMile = (load: Load): string => {
  if (load.miles === 0) return "0.00";
  return (load.price / load.miles).toFixed(2);
};

// ── 3. СОРТИРОВКА ─────────────────────────────────────────────────────────
export const sortByPrice = (loads: Load[], asc = true): Load[] => {
  return [...loads].sort((a, b) =>
    asc ? a.price - b.price : b.price - a.price
  );
};

export const sortByMiles = (loads: Load[], asc = true): Load[] => {
  return [...loads].sort((a, b) =>
    asc ? a.miles - b.miles : b.miles - a.miles
  );
};

// ── 4. ПОЛУЧИТЬ МАРШРУТЫ ПО ТИПУ ─────────────────────────────────────────
export const getLoadsByType = (loads: Load[], type: string): Load[] => {
  if (type === "All Loads") return loads;
  return loads.filter(l => l.type === type || l.tag === type);
};

// ── 5. СТАТИСТИКА ─────────────────────────────────────────────────────────
export const getStats = (loads: Load[]) => {
  if (loads.length === 0) return { total: 0, avgPrice: 0, avgMiles: 0, maxPrice: 0, minPrice: 0 };

  const prices = loads.map(l => l.price);
  const miles = loads.map(l => l.miles);

  return {
    total: loads.length,
    avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / loads.length),
    avgMiles: Math.round(miles.reduce((a, b) => a + b, 0) / loads.length),
    maxPrice: Math.max(...prices),
    minPrice: Math.min(...prices),
  };
};

// ── 6. ВАЛИДАЦИЯ ФОРМЫ ЗАЯВКИ ─────────────────────────────────────────────
export const validateQuoteForm = (
  data: QuoteFormData
): { valid: boolean; error?: string } => {
  if (!data.name.trim())
    return { valid: false, error: "Name is required" };
  if (!data.phone.trim())
    return { valid: false, error: "Phone is required" };
  if (data.phone.replace(/\D/g, "").length < 10)
    return { valid: false, error: "Enter a valid phone number (10+ digits)" };
  if (!data.from.trim())
    return { valid: false, error: "Origin city is required" };
  if (!data.to.trim())
    return { valid: false, error: "Destination city is required" };
  if (data.from.toLowerCase() === data.to.toLowerCase())
    return { valid: false, error: "Origin and destination cannot be the same" };
  return { valid: true };
};

// ── 7. ФОРМАТИРОВАНИЕ ─────────────────────────────────────────────────────
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString("en-US")}`;
};

export const formatMiles = (miles: number): string => {
  return `${miles.toLocaleString("en-US")} mi`;
};

// ── 8. ИМИТАЦИЯ ЗАГРУЗКИ ДАННЫХ (Data Access Layer) ──────────────────────
export const fetchLoads = async (data: Load[]): Promise<Load[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.length === 0) {
        reject(new Error("No loads available"));
      } else {
        resolve(data);
      }
    }, 800);
  });
};