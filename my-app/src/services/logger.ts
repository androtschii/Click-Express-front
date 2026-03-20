// ── LOGGER SERVICE (Business Logic Layer) ────────────────────────────────
// Логирует действия пользователя в console и localStorage

export type LogLevel = "info" | "warn" | "error" | "action";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  action: string;
  data?: Record<string, unknown>;
}

const LOG_KEY = "click_express_logs";
const MAX_LOGS = 100;

// ── Цвета для консоли ─────────────────────────────────────────────────────
const COLORS: Record<LogLevel, string> = {
  info:   "color: #60A5FA; font-weight: bold",
  warn:   "color: #FBBF24; font-weight: bold",
  error:  "color: #EF4444; font-weight: bold",
  action: "color: #CC0000; font-weight: bold",
};

// ── Сохранить лог в localStorage ──────────────────────────────────────────
const saveToStorage = (entry: LogEntry): void => {
  try {
    const stored = localStorage.getItem(LOG_KEY);
    const logs: LogEntry[] = stored ? JSON.parse(stored) : [];
    logs.push(entry);
    // Оставляем только последние MAX_LOGS записей
    if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  } catch {
    // localStorage недоступен — игнорируем
  }
};

// ── Основная функция логирования ──────────────────────────────────────────
const log = (level: LogLevel, action: string, data?: Record<string, unknown>): void => {
  const entry: LogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    level,
    action,
    data,
  };

  // Вывод в консоль
  const time = new Date().toLocaleTimeString("ru-RU");
  const prefix = `[ClickExpress][${level.toUpperCase()}] ${time}`;

  if (data) {
    console.groupCollapsed(`%c${prefix} → ${action}`, COLORS[level]);
    console.table(data);
    console.groupEnd();
  } else {
    console.log(`%c${prefix} → ${action}`, COLORS[level]);
  }

  saveToStorage(entry);
};

// ── Публичный API логгера ─────────────────────────────────────────────────
export const logger = {
  info:   (action: string, data?: Record<string, unknown>) => log("info",   action, data),
  warn:   (action: string, data?: Record<string, unknown>) => log("warn",   action, data),
  error:  (action: string, data?: Record<string, unknown>) => log("error",  action, data),
  action: (action: string, data?: Record<string, unknown>) => log("action", action, data),

  // ── Получить все логи из localStorage ──────────────────────────────────
  getLogs: (): LogEntry[] => {
    try {
      const stored = localStorage.getItem(LOG_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // ── Очистить логи ──────────────────────────────────────────────────────
  clear: (): void => {
    localStorage.removeItem(LOG_KEY);
    console.log("%c[ClickExpress] Logs cleared", "color: #9CA3AF");
  },

  // ── Показать все логи в консоли ────────────────────────────────────────
  dump: (): void => {
    const logs = logger.getLogs();
    console.group("%c[ClickExpress] All logs", "color: #CC0000; font-weight: bold");
    console.table(logs);
    console.groupEnd();
  },

  // ── Готовые действия ───────────────────────────────────────────────────
  pageLoad:      ()                     => log("info",   "Page loaded"),
  search:        (query: string)        => log("action", "Search", { query }),
  filter:        (filter: string)       => log("action", "Filter changed", { filter }),
  bookLoad:      (route: string, price: number) => log("action", "Load booked", { route, price }),
  saveLoad:      (route: string, saved: boolean) => log("action", saved ? "Load saved" : "Load unsaved", { route }),
  openQuote:     ()                     => log("action", "Quote modal opened"),
  submitQuote:   (from: string, to: string) => log("action", "Quote submitted", { from, to }),
  themeToggle:   (theme: string)        => log("info",   "Theme changed", { theme }),
  openFavorites: ()                     => log("action", "Favorites panel opened"),
  dataLoaded:    (count: number)        => log("info",   "Data loaded", { count }),
  dataError:     (message: string)      => log("error",  "Data load failed", { message }),
};