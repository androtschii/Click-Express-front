import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, Trash, X } from "@phosphor-icons/react";
import { API_BASE } from "../../config";

interface NotifItem {
  id: number;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("ce_session");
    if (!raw) return null;
    return JSON.parse(raw).token ?? null;
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TYPE_COLOR: Record<string, string> = {
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
};

interface Props {
  isLight?: boolean;
}

const NotificationBell: React.FC<Props> = ({ isLight }) => {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchCount = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/notification/unread/count`, { headers: authHeaders() as HeadersInit });
      if (res.ok) {
        const data = await res.json();
        setUnread(data.count ?? 0);
      }
    } catch {
      // silent
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notification`, { headers: authHeaders() as HeadersInit });
      if (res.ok) {
        const data: NotifItem[] = await res.json();
        setItems(data);
        setUnread(data.filter(n => !n.isRead).length);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, 30000);
    return () => clearInterval(id);
  }, [fetchCount]);

  useEffect(() => {
    if (open) fetchAll();
  }, [open, fetchAll]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id: number) => {
    await fetch(`${API_BASE}/notification/${id}/read`, {
      method: "PATCH",
      headers: authHeaders() as HeadersInit,
    });
    setItems(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await fetch(`${API_BASE}/notification/read-all`, {
      method: "PATCH",
      headers: authHeaders() as HeadersInit,
    });
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const remove = async (id: number) => {
    await fetch(`${API_BASE}/notification/${id}`, {
      method: "DELETE",
      headers: authHeaders() as HeadersInit,
    });
    const removed = items.find(n => n.id === id);
    setItems(prev => prev.filter(n => n.id !== id));
    if (removed && !removed.isRead) setUnread(prev => Math.max(0, prev - 1));
  };

  const token = getToken();
  if (!token) return null;

  return (
    <div ref={panelRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Notifications"
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: open ? "rgba(204,0,0,0.15)" : "transparent",
          border: `1px solid ${open ? "#CC0000" : (isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)")}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative", transition: "all 0.15s",
          color: isLight ? "#1a1a1a" : "#fff",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#CC0000"; (e.currentTarget as HTMLElement).style.background = "rgba(204,0,0,0.1)"; }}
        onMouseLeave={e => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.borderColor = isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }
        }}
      >
        <Bell size={17} weight="bold" />
        {unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            minWidth: 16, height: 16, borderRadius: 8,
            background: "#CC0000", color: "#fff",
            fontFamily: "'Barlow',sans-serif", fontWeight: 900, fontSize: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px", boxShadow: "0 2px 6px rgba(204,0,0,0.5)",
          }}>
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          width: 320, maxHeight: 420,
          background: isLight ? "#fff" : "#0f0f0f",
          border: `1px solid ${isLight ? "rgba(204,0,0,0.18)" : "rgba(204,0,0,0.3)"}`,
          borderRadius: 10, overflow: "hidden",
          boxShadow: isLight ? "0 8px 40px rgba(0,0,0,0.15)" : "0 16px 50px rgba(0,0,0,0.8)",
          zIndex: 200, display: "flex", flexDirection: "column",
        }}>
          <div style={{
            padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}`,
          }}>
            <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: isLight ? "#1a1a1a" : "#fff" }}>
              Notifications {unread > 0 && <span style={{ color: "#CC0000" }}>({unread})</span>}
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {unread > 0 && (
                <button onClick={markAllRead} title="Mark all read" style={{ background: "transparent", border: "none", cursor: "pointer", color: "#CC0000", display: "flex", alignItems: "center", padding: 2 }}>
                  <Check size={15} weight="bold" />
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", padding: 2 }}>
                <X size={15} weight="bold" />
              </button>
            </div>
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading && (
              <div style={{ padding: 24, textAlign: "center", fontFamily: "'Barlow',sans-serif", fontSize: 12, color: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.35)" }}>
                Loading...
              </div>
            )}
            {!loading && items.length === 0 && (
              <div style={{ padding: 32, textAlign: "center" }}>
                <Bell size={28} weight="thin" color={isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"} />
                <div style={{ marginTop: 8, fontFamily: "'Barlow',sans-serif", fontSize: 12, color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.3)" }}>No notifications</div>
              </div>
            )}
            {!loading && items.map(n => (
              <div key={n.id} style={{
                padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start",
                borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"}`,
                background: n.isRead ? "transparent" : (isLight ? "rgba(204,0,0,0.04)" : "rgba(204,0,0,0.06)"),
                transition: "background 0.2s",
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 4,
                  background: n.isRead ? "transparent" : (TYPE_COLOR[n.type] ?? "#CC0000"),
                  border: n.isRead ? `1px solid ${isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)"}` : "none",
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: isLight ? "#1a1a1a" : "#fff", marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.5)", lineHeight: 1.4, wordBreak: "break-word" }}>{n.body}</div>
                  <div style={{ marginTop: 4, fontFamily: "'Barlow',sans-serif", fontSize: 10, color: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.28)" }}>{timeAgo(n.createdAt)}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                  {!n.isRead && (
                    <button onClick={() => markRead(n.id)} title="Mark read" style={{ background: "transparent", border: "none", cursor: "pointer", color: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)", padding: 2, display: "flex" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#CC0000"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"; }}>
                      <Check size={13} weight="bold" />
                    </button>
                  )}
                  <button onClick={() => remove(n.id)} title="Delete" style={{ background: "transparent", border: "none", cursor: "pointer", color: isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)", padding: 2, display: "flex" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#CC0000"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)"; }}>
                    <Trash size={13} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
