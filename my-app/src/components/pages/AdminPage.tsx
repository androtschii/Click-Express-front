import React, { useEffect, useState } from "react";
import {
  fetchProducts, fetchProductStats,
  updateProductPrice, updateProductImage,
  updateProductStock, toggleProductActive, deleteProduct, createProduct,
  fetchVehicles, createVehicle, updateVehicle,
  toggleVehicleAvailability, deleteVehicle,
  fetchDrivers, createDriver, updateDriver, patchDriverStatus, deleteDriver,
  fetchLeads, updateLeadStatus, deleteLead,
  fetchJobApplications, updateJobApplicationStatus, deleteJobApplication,
  fetchAdminStats,
} from "../../api/client.js";
import { useLanguage } from "../../context/LanguageContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  isActive: boolean;
}

interface Stats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  totalValue: number;
  categories: number;
}

interface Vehicle {
  id: number;
  model: string;
  type: string;
  year: number;
  plate?: string;
  available: boolean;
}

interface Driver {
  id: number;
  fullName: string;
  phone: string;
  cdlNumber: string;
  status: string;
  vehicleId?: number | null;
  vehicleModel?: string | null;
  createdAt: string;
}

interface Lead {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  origin: string;
  destination: string;
  equipment: string;
  weight?: number;
  pickupDate?: string;
  message: string;
  status: string;
  createdAt: string;
}

interface JobApplication {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  status: string;
  createdAt: string;
}

type Tab = "loads" | "fleet" | "drivers" | "leads" | "stats";

interface AdminStats {
  totalOrders: number;
  orders30d: number;
  activeOrders: number;
  totalRevenue: number;
  revenue30d: number;
  totalUsers: number;
  newUsers30d: number;
  totalLeads: number;
  conversionRate: number;
  statusBreakdown: Array<{ status: string; count: number }>;
  topRoutes: Array<{ route: string; count: number }>;
  leadBreakdown: Array<{ status: string; count: number }>;
}

interface AdminPageProps {
  theme: "dark" | "light";
  onBack: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ theme, onBack }) => {
  const { lang } = useLanguage();
  const ru = lang === "ru";

  const [tab, setTab] = useState<Tab>("loads");

  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editPrice, setEditPrice] = useState<{ id: number; value: string } | null>(null);
  const [editImage, setEditImage] = useState<{ id: number; value: string } | null>(null);
  const [editStock, setEditStock] = useState<{ id: number; value: string } | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCard, setNewCard] = useState({ name: "", description: "", price: "", imageUrl: "", category: "Full Load", stock: "1" });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ model: "", type: "Truck", year: String(new Date().getFullYear()), plate: "" });
  const [editVehicle, setEditVehicle] = useState<{ id: number; model: string; type: string; year: string; plate: string } | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [newDriver, setNewDriver] = useState({ fullName: "", phone: "", cdlNumber: "", status: "Active" });
  const [editDriver, setEditDriver] = useState<{ id: number; fullName: string; phone: string; cdlNumber: string; status: string } | null>(null);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [jobApps, setJobApps] = useState<JobApplication[]>([]);
  const [jobAppsLoading, setJobAppsLoading] = useState(false);
  const [leadsSubTab, setLeadsSubTab] = useState<"quotes" | "jobs">("quotes");

  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const isDark = theme === "dark";
  const bg = isDark ? "#0a0a0a" : "#f5f5f5";
  const card = isDark ? "#111" : "#fff";
  const text = isDark ? "#fff" : "#1a1a1a";
  const sub = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";

  const notify = (t: string, ok = true) => {
    setMsg({ text: t, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const load = async () => {
    try {
      const p = await fetchProducts();
      setProducts(Array.isArray(p) ? p : []);
    } catch { notify(ru ? "Ошибка загрузки товаров" : "Products load error", false); }
    finally { setLoading(false); }
    try {
      const s = await fetchProductStats();
      setStats(s);
    } catch { /* stats are optional */ }
  };

  useEffect(() => { load(); }, []);

  const handlePrice = async (id: number) => {
    if (!editPrice) return;
    try {
      await updateProductPrice(id, parseFloat(editPrice.value));
      setProducts(ps => ps.map(p => p.id === id ? { ...p, price: parseFloat(editPrice.value) } : p));
      setEditPrice(null);
      notify(ru ? "Цена обновлена ✓" : "Price updated ✓");
    } catch { notify(ru ? "Ошибка обновления цены" : "Price update error", false); }
  };

  const handleImage = async (id: number) => {
    if (!editImage) return;
    try {
      await updateProductImage(id, editImage.value);
      setProducts(ps => ps.map(p => p.id === id ? { ...p, imageUrl: editImage.value } : p));
      setEditImage(null);
      notify(ru ? "Фото обновлено ✓" : "Photo updated ✓");
    } catch { notify(ru ? "Ошибка обновления фото" : "Photo update error", false); }
  };

  const handleStock = async (id: number) => {
    if (!editStock) return;
    try {
      await updateProductStock(id, parseInt(editStock.value));
      setProducts(ps => ps.map(p => p.id === id ? { ...p, stock: parseInt(editStock.value) } : p));
      setEditStock(null);
      notify(ru ? "Остаток обновлён ✓" : "Stock updated ✓");
    } catch { notify(ru ? "Ошибка обновления остатка" : "Stock update error", false); }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await toggleProductActive(id);
      setProducts(ps => ps.map(p => p.id === id ? { ...p, isActive: res.isActive } : p));
      notify(res.isActive ? (ru ? "Активирован" : "Activated") : (ru ? "Деактивирован" : "Deactivated"));
    } catch { notify(ru ? "Ошибка" : "Error", false); }
  };

  const handleCreate = async () => {
    if (!newCard.name.trim() || !newCard.price) return;
    try {
      const created = await createProduct({
        name: newCard.name,
        description: newCard.description,
        price: parseFloat(newCard.price),
 imageUrl: newCard.imageUrl || "https://placehold.co/400x280?text=Load",
        category: newCard.category,
        stock: parseInt(newCard.stock) || 1,
      });
      setProducts(ps => [...ps, created]);
      setNewCard({ name: "", description: "", price: "", imageUrl: "", category: "Full Load", stock: "1" });
      setShowCreateForm(false);
      notify(ru ? "Карточка создана ✓" : "Card created ✓");
      load();
    } catch { notify(ru ? "Ошибка создания" : "Create error", false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(ru ? `Удалить "${name}"?` : `Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setProducts(ps => ps.filter(p => p.id !== id));
      notify(ru ? "Удалено ✓" : "Deleted ✓");
    } catch { notify(ru ? "Ошибка удаления" : "Delete error", false); }
  };

  const loadVehicles = async () => {
    setVehiclesLoading(true);
    try {
      const data = await fetchVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch { notify(ru ? "Ошибка загрузки автопарка" : "Fleet load error", false); }
    finally { setVehiclesLoading(false); }
  };

  const loadDrivers = async () => {
    setDriversLoading(true);
    try {
      const data = await fetchDrivers();
      setDrivers(Array.isArray(data) ? data : []);
    } catch { notify(ru ? "Ошибка загрузки водителей" : "Drivers load error", false); }
    finally { setDriversLoading(false); }
  };

  const handleCreateDriver = async () => {
    if (!newDriver.fullName.trim() || !newDriver.cdlNumber.trim()) return;
    try {
      const created = await createDriver({
        fullName: newDriver.fullName.trim(),
        phone: newDriver.phone.trim(),
        cdlNumber: newDriver.cdlNumber.trim(),
        status: newDriver.status,
      });
      setDrivers(ds => [...ds, created]);
      setNewDriver({ fullName: "", phone: "", cdlNumber: "", status: "Active" });
      setShowDriverForm(false);
      notify(ru ? "Водитель добавлен ✓" : "Driver added ✓");
    } catch { notify(ru ? "Ошибка создания" : "Create error", false); }
  };

  const handleUpdateDriver = async () => {
    if (!editDriver) return;
    try {
      const updated = await updateDriver(editDriver.id, {
        fullName: editDriver.fullName.trim(),
        phone: editDriver.phone.trim(),
        cdlNumber: editDriver.cdlNumber.trim(),
        status: editDriver.status,
      });
      setDrivers(ds => ds.map(d => d.id === editDriver.id ? { ...d, ...updated } : d));
      setEditDriver(null);
      notify(ru ? "Обновлено ✓" : "Updated ✓");
    } catch { notify(ru ? "Ошибка обновления" : "Update error", false); }
  };

  const handlePatchDriverStatus = async (id: number, status: string) => {
    try {
      await patchDriverStatus(id, status);
      setDrivers(ds => ds.map(d => d.id === id ? { ...d, status } : d));
      notify(ru ? "Статус обновлён ✓" : "Status updated ✓");
    } catch { notify(ru ? "Ошибка" : "Error", false); }
  };

  const handleDeleteDriver = async (id: number, name: string) => {
    if (!confirm(ru ? `Удалить "${name}"?` : `Delete "${name}"?`)) return;
    try {
      await deleteDriver(id);
      setDrivers(ds => ds.filter(d => d.id !== id));
      notify(ru ? "Удалено ✓" : "Deleted ✓");
    } catch { notify(ru ? "Ошибка удаления" : "Delete error", false); }
  };

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch { notify(ru ? "Ошибка загрузки лидов" : "Leads load error", false); }
    finally { setLeadsLoading(false); }
  };

  const loadJobApps = async () => {
    setJobAppsLoading(true);
    try {
      const data = await fetchJobApplications();
      setJobApps(Array.isArray(data) ? data : []);
    } catch { notify(ru ? "Ошибка загрузки заявок" : "Applications load error", false); }
    finally { setJobAppsLoading(false); }
  };

  const handleLeadStatus = async (id: number, status: string) => {
    try {
      await updateLeadStatus(id, status);
      setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l));
      notify(ru ? "Статус обновлён ✓" : "Status updated ✓");
    } catch { notify(ru ? "Ошибка" : "Error", false); }
  };

  const handleDeleteLead = async (id: number) => {
    if (!confirm(ru ? "Удалить лид?" : "Delete lead?")) return;
    try {
      await deleteLead(id);
      setLeads(ls => ls.filter(l => l.id !== id));
      notify(ru ? "Удалено ✓" : "Deleted ✓");
    } catch { notify(ru ? "Ошибка удаления" : "Delete error", false); }
  };

  const handleJobAppStatus = async (id: number, status: string) => {
    try {
      await updateJobApplicationStatus(id, status);
      setJobApps(js => js.map(j => j.id === id ? { ...j, status } : j));
      notify(ru ? "Статус обновлён ✓" : "Status updated ✓");
    } catch { notify(ru ? "Ошибка" : "Error", false); }
  };

  const handleDeleteJobApp = async (id: number) => {
    if (!confirm(ru ? "Удалить заявку?" : "Delete application?")) return;
    try {
      await deleteJobApplication(id);
      setJobApps(js => js.filter(j => j.id !== id));
      notify(ru ? "Удалено ✓" : "Deleted ✓");
    } catch { notify(ru ? "Ошибка удаления" : "Delete error", false); }
  };

  useEffect(() => {
    if (tab === "fleet" && vehicles.length === 0 && !vehiclesLoading) loadVehicles();
    if (tab === "drivers" && drivers.length === 0 && !driversLoading) loadDrivers();
    if (tab === "leads") {
      if (leadsSubTab === "quotes" && leads.length === 0 && !leadsLoading) loadLeads();
      if (leadsSubTab === "jobs" && jobApps.length === 0 && !jobAppsLoading) loadJobApps();
    }
    if (tab === "stats" && !adminStats && !statsLoading) loadStats();
  }, [tab, leadsSubTab]);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const data = await fetchAdminStats() as AdminStats;
      setAdminStats(data);
    } catch { notify(ru ? "Ошибка загрузки аналитики" : "Stats load error", false); }
    finally { setStatsLoading(false); }
  };

  const handleCreateVehicle = async () => {
    if (!newVehicle.model.trim()) return;
    try {
      const created = await createVehicle({
        model: newVehicle.model.trim(),
        type: newVehicle.type,
        year: parseInt(newVehicle.year) || new Date().getFullYear(),
        plate: newVehicle.plate.trim() || undefined,
      });
      setVehicles(vs => [...vs, created]);
      setNewVehicle({ model: "", type: "Truck", year: String(new Date().getFullYear()), plate: "" });
      setShowVehicleForm(false);
      notify(ru ? "Транспорт добавлен ✓" : "Vehicle added ✓");
    } catch { notify(ru ? "Ошибка создания" : "Create error", false); }
  };

  const handleUpdateVehicle = async () => {
    if (!editVehicle) return;
    try {
      const updated = await updateVehicle(editVehicle.id, {
        model: editVehicle.model.trim(),
        type: editVehicle.type,
        year: parseInt(editVehicle.year) || new Date().getFullYear(),
        plate: editVehicle.plate.trim() || undefined,
      });
      setVehicles(vs => vs.map(v => v.id === editVehicle.id ? { ...v, ...updated } : v));
      setEditVehicle(null);
      notify(ru ? "Обновлено ✓" : "Updated ✓");
    } catch { notify(ru ? "Ошибка обновления" : "Update error", false); }
  };

  const handleToggleVehicle = async (id: number) => {
    try {
      const res = await toggleVehicleAvailability(id);
      setVehicles(vs => vs.map(v => v.id === id ? { ...v, available: res.available ?? !v.available } : v));
    } catch { notify(ru ? "Ошибка" : "Error", false); }
  };

  const handleDeleteVehicle = async (id: number, model: string) => {
    if (!confirm(ru ? `Удалить "${model}"?` : `Delete "${model}"?`)) return;
    try {
      await deleteVehicle(id);
      setVehicles(vs => vs.filter(v => v.id !== id));
      notify(ru ? "Удалено ✓" : "Deleted ✓");
    } catch { notify(ru ? "Ошибка удаления" : "Delete error", false); }
  };

  const inputStyle: React.CSSProperties = {
    background: isDark ? "#1a1a1a" : "#f0f0f0",
    border: "1px solid #CC0000", borderRadius: 4,
    color: text, padding: "4px 8px", fontSize: 13,
    fontFamily: "'Barlow',sans-serif", width: "100%",
  };

  const btn = (variant: "red" | "gray" | "green"): React.CSSProperties => ({
    padding: "5px 12px", borderRadius: 4, border: "none",
    cursor: "pointer", fontSize: 12, fontWeight: 700,
    fontFamily: "'Barlow',sans-serif",
    background: variant === "red" ? "#CC0000" : variant === "green" ? "#16a34a" : isDark ? "#2a2a2a" : "#e5e5e5",
    color: variant === "gray" ? text : "#fff",
  });

  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "90px 20px 40px", color: text }}>

      {msg && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999,
          background: msg.ok ? "#16a34a" : "#CC0000",
          color: "#fff", padding: "10px 20px", borderRadius: 8,
          fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 14,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>{msg.text}</div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, margin: 0 }}>
              <span style={{ color: "#CC0000" }}>ADMIN</span> {ru ? "ПАНЕЛЬ" : "PANEL"}
            </h1>
            <p style={{ color: sub, fontSize: 13, margin: "4px 0 0" }}>
              {ru ? "Управление услугами ClickExpress" : "ClickExpress Load Management"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {tab === "loads" && (
              <button onClick={() => setShowCreateForm(v => !v)} style={{ ...btn("green"), padding: "8px 18px", fontSize: 13 }}>
                {showCreateForm ? "✕" : (ru ? "+ Новая карточка" : "+ New Card")}
              </button>
            )}
            {tab === "fleet" && (
              <button onClick={() => setShowVehicleForm(v => !v)} style={{ ...btn("green"), padding: "8px 18px", fontSize: 13 }}>
                {showVehicleForm ? "✕" : (ru ? "+ Транспорт" : "+ Vehicle")}
              </button>
            )}
            {tab === "drivers" && (
              <button onClick={() => setShowDriverForm(v => !v)} style={{ ...btn("green"), padding: "8px 18px", fontSize: 13 }}>
                {showDriverForm ? "✕" : (ru ? "+ Водитель" : "+ Driver")}
              </button>
            )}
            {tab === "leads" && (
              <button
                onClick={() => {
                  if (leadsSubTab === "quotes") { setLeads([]); loadLeads(); }
                  else { setJobApps([]); loadJobApps(); }
                }}
                style={{ ...btn("gray"), padding: "8px 18px", fontSize: 13 }}
              >
                ↻ {ru ? "Обновить" : "Refresh"}
              </button>
            )}
            {tab === "stats" && (
              <button onClick={() => { setAdminStats(null); loadStats(); }} style={{ ...btn("gray"), padding: "8px 18px", fontSize: 13 }}>
                ↻ {ru ? "Обновить" : "Refresh"}
              </button>
            )}
            <button onClick={onBack} style={btn("gray")}>{ru ? "← Назад" : "← Back"}</button>
          </div>
        </div>

 {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: `1px solid ${border}` }}>
          {([
            { key: "loads",   label: ru ? "Грузы" : "Loads" },
            { key: "fleet",   label: ru ? "Автопарк" : "Fleet" },
            { key: "drivers", label: ru ? "Водители" : "Drivers" },
            { key: "leads",   label: ru ? "Лиды" : "Leads" },
            { key: "stats",   label: ru ? "Аналитика" : "Analytics" },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: tab === t.key ? "2px solid #CC0000" : "2px solid transparent",
                color: tab === t.key ? "#CC0000" : sub,
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 1,
                textTransform: "uppercase",
                padding: "10px 18px",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

 {/* Loads create form */}
        {tab === "loads" && showCreateForm && (
          <div style={{ background: card, border: "1px solid rgba(22,163,74,0.4)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, margin: "0 0 16px", color: "#16a34a" }}>
              {ru ? "Новая карточка груза" : "New Load Card"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { key: "name", label: ru ? "Маршрут (название)" : "Route (name)", placeholder: "Colorado Springs → Tampa" },
                { key: "description", label: ru ? "Описание" : "Description", placeholder: "Flatbed / Steel Beams" },
                { key: "price", label: ru ? "Цена ($)" : "Price ($)", placeholder: "4100", type: "number" },
                { key: "imageUrl", label: ru ? "URL фото" : "Photo URL", placeholder: "/images/real1.jpg" },
                { key: "stock", label: ru ? "Количество мест" : "Stock", placeholder: "1", type: "number" },
              ].map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{f.label}</div>
                  <input
                    style={{ ...inputStyle, outline: "none" }}
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    value={(newCard as Record<string, string>)[f.key]}
                    onChange={e => setNewCard(v => ({ ...v, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{ru ? "Категория" : "Category"}</div>
                <select
                  style={{ ...inputStyle, outline: "none" }}
                  value={newCard.category}
                  onChange={e => setNewCard(v => ({ ...v, category: e.target.value }))}
                >
                  <option value="Full Load">Full Load</option>
                  <option value="Partial">Partial</option>
                  <option value="Military Load">Military Load</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button style={{ ...btn("green"), padding: "8px 22px", fontSize: 13 }} onClick={handleCreate}>
                {ru ? "Создать" : "Create"}
              </button>
              <button style={{ ...btn("gray"), padding: "8px 22px", fontSize: 13 }} onClick={() => setShowCreateForm(false)}>
                {ru ? "Отмена" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {tab === "loads" && stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { label: ru ? "Всего услуг" : "Total Loads", value: stats.totalProducts },
              { label: ru ? "Активных" : "Active", value: stats.activeProducts },
              { label: ru ? "Нет в наличии" : "Out of Stock", value: stats.outOfStock },
              { label: ru ? "Категорий" : "Categories", value: stats.categories },
              { label: ru ? "Стоимость склада" : "Total Value", value: `$${stats.totalValue.toLocaleString()}` },
            ].map(s => (
              <div key={s.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Oswald',sans-serif", color: "#CC0000" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "loads" && (loading ? (
          <div style={{ textAlign: "center", color: sub, padding: 60 }}>{ru ? "Загрузка..." : "Loading..."}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", color: sub, padding: 80, border: `1px dashed ${border}`, borderRadius: 12 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, marginBottom: 8, color: text }}>
              {ru ? "Товаров нет" : "No loads yet"}
            </div>
            <div style={{ fontSize: 13 }}>{ru ? "Нажми «+ Новая карточка» чтобы добавить первый груз" : "Click «+ New Card» to add the first load"}</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {products.map(p => (
              <div key={p.id} style={{
                background: card, border: `1px solid ${p.isActive ? border : "rgba(204,0,0,0.3)"}`,
                borderRadius: 12, padding: 20, opacity: p.isActive ? 1 : 0.65,
              }}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

                  <img src={p.imageUrl} alt={p.name}
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: `1px solid ${border}`, flexShrink: 0 }}
 onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80?text=?"; }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16 }}>{p.name}</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: isDark ? "#1a1a1a" : "#f0f0f0", color: sub }}>{p.category}</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: p.isActive ? "rgba(22,163,74,0.15)" : "rgba(204,0,0,0.15)", color: p.isActive ? "#16a34a" : "#CC0000" }}>
                        {p.isActive ? (ru ? "Активен" : "Active") : (ru ? "Неактивен" : "Inactive")}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: sub, marginBottom: 12 }}>{p.description}</div>

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>

 {/* Price */}
                      <div style={{ minWidth: 160 }}>
                        <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const }}>{ru ? "Цена" : "Price"}</div>
                        {editPrice?.id === p.id ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input style={inputStyle} type="number" value={editPrice.value}
                              onChange={e => setEditPrice({ id: p.id, value: e.target.value })} />
                            <button style={btn("red")} onClick={() => handlePrice(p.id)}>✓</button>
                            <button style={btn("gray")} onClick={() => setEditPrice(null)}>✕</button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 15 }}>${p.price.toLocaleString()}</span>
                            <button style={btn("gray")} onClick={() => setEditPrice({ id: p.id, value: String(p.price) })}>✏️</button>
                          </div>
                        )}
                      </div>

 {/* Stock */}
                      <div style={{ minWidth: 140 }}>
                        <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const }}>{ru ? "Остаток" : "Stock"}</div>
                        {editStock?.id === p.id ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input style={inputStyle} type="number" value={editStock.value}
                              onChange={e => setEditStock({ id: p.id, value: e.target.value })} />
                            <button style={btn("red")} onClick={() => handleStock(p.id)}>✓</button>
                            <button style={btn("gray")} onClick={() => setEditStock(null)}>✕</button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: p.stock === 0 ? "#CC0000" : text }}>{p.stock}</span>
                            <button style={btn("gray")} onClick={() => setEditStock({ id: p.id, value: String(p.stock) })}>✏️</button>
                          </div>
                        )}
                      </div>

 {/* Image URL */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const }}>
                          {ru ? "URL фото" : "Photo URL"}
                        </div>
                        {editImage?.id === p.id ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input style={inputStyle} type="text" value={editImage.value}
                              onChange={e => setEditImage({ id: p.id, value: e.target.value })} />
                            <button style={btn("red")} onClick={() => handleImage(p.id)}>✓</button>
                            <button style={btn("gray")} onClick={() => setEditImage(null)}>✕</button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{p.imageUrl}</span>
                            <button style={btn("gray")} onClick={() => setEditImage({ id: p.id, value: p.imageUrl })}>✏️</button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                    <button style={btn(p.isActive ? "gray" : "green")} onClick={() => handleToggle(p.id)}>
                      {p.isActive ? (ru ? "Деактивировать" : "Deactivate") : (ru ? "Активировать" : "Activate")}
                    </button>
                    <button style={btn("red")} onClick={() => handleDelete(p.id, p.name)}>
                      {ru ? "Удалить" : "Delete"}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Stats / Analytics tab */}
        {tab === "stats" && (
          <>
            {statsLoading ? (
              <div style={{ textAlign: "center", color: sub, padding: 80 }}>
                <div style={{ display: "inline-block", width: 36, height: 36, border: "3px solid rgba(204,0,0,0.2)", borderTopColor: "#CC0000", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 16 }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14 }}>{ru ? "Загрузка аналитики..." : "Loading analytics..."}</div>
              </div>
            ) : !adminStats ? (
              <div style={{ textAlign: "center", color: sub, padding: 80, border: `1px dashed ${border}`, borderRadius: 12 }}>
                {ru ? "Нет данных" : "No data"}
              </div>
            ) : (() => {
              const s = adminStats;
              const statusColor = (st: string) => {
                const m: Record<string, string> = { "Pending": "#f59e0b", "Approved": "#3b82f6", "Confirmed": "#3b82f6", "Assigned": "#8b5cf6", "In Transit": "#7c3aed", "Delivered": "#16a34a", "Cancelled": "#CC0000" };
                return m[st] ?? "#888";
              };
              const maxOrders = Math.max(...s.statusBreakdown.map(x => x.count), 1);
              const maxRoute  = Math.max(...s.topRoutes.map(x => x.count), 1);

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                  {/* KPI row 1 — Revenue & Orders */}
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
                      💰 {ru ? "ВЫРУЧКА И ЗАКАЗЫ" : "REVENUE & ORDERS"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
                      {[
                        { label: ru ? "Общая выручка" : "Total Revenue",  value: `$${s.totalRevenue.toLocaleString()}`, accent: true },
                        { label: ru ? "Выручка 30д" : "Revenue 30d",      value: `$${s.revenue30d.toLocaleString()}` },
                        { label: ru ? "Всего заказов" : "Total Orders",    value: s.totalOrders },
                        { label: ru ? "Заказы 30д" : "Orders 30d",        value: s.orders30d },
                        { label: ru ? "Активных" : "Active Orders",        value: s.activeOrders },
                      ].map(k => (
                        <div key={k.label} style={{ background: card, border: `1px solid ${k.accent ? "rgba(204,0,0,0.3)" : border}`, borderRadius: 10, padding: "18px 20px" }}>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: 26, color: k.accent ? "#CC0000" : text, lineHeight: 1 }}>{k.value}</div>
                          <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: sub, marginTop: 6, textTransform: "uppercase", letterSpacing: 0.6 }}>{k.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KPI row 2 — Users & Leads */}
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
                      👥 {ru ? "ПОЛЬЗОВАТЕЛИ И ЛИДЫ" : "USERS & LEADS"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
                      {[
                        { label: ru ? "Всего пользователей" : "Total Users", value: s.totalUsers },
                        { label: ru ? "Новых 30д" : "New Users 30d",         value: s.newUsers30d },
                        { label: ru ? "Всего лидов" : "Total Leads",         value: s.totalLeads },
                        { label: ru ? "Конверсия" : "Conversion",            value: `${s.conversionRate}%`, accent: s.conversionRate > 0 },
                      ].map(k => (
                        <div key={k.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "18px 20px" }}>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: 26, color: k.accent ? "#16a34a" : text, lineHeight: 1 }}>{k.value}</div>
                          <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: sub, marginTop: 6, textTransform: "uppercase", letterSpacing: 0.6 }}>{k.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom row: status breakdown + top routes */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                    {/* Order Status Breakdown */}
                    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
                        📊 {ru ? "ЗАКАЗЫ ПО СТАТУСАМ" : "ORDERS BY STATUS"}
                      </div>
                      {s.statusBreakdown.length === 0 ? (
                        <div style={{ color: sub, fontSize: 13 }}>{ru ? "Нет данных" : "No data"}</div>
                      ) : s.statusBreakdown.map(item => {
                        const pct = Math.round(item.count / maxOrders * 100);
                        const color = statusColor(item.status);
                        return (
                          <div key={item.status} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                              <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: text }}>{item.status}</span>
                              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: sub }}>{item.count} ({Math.round(item.count / s.totalOrders * 100)}%)</span>
                            </div>
                            <div style={{ height: 7, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)", borderRadius: 99, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Top Routes */}
                    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
                        🏆 {ru ? "ТОП-5 МАРШРУТОВ" : "TOP 5 ROUTES"}
                      </div>
                      {s.topRoutes.length === 0 ? (
                        <div style={{ color: sub, fontSize: 13 }}>{ru ? "Нет данных" : "No data"}</div>
                      ) : s.topRoutes.map((item, i) => {
                        const pct = Math.round(item.count / maxRoute * 100);
                        return (
                          <div key={item.route} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                              <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                                <span style={{ color: "#CC0000", marginRight: 6 }}>#{i + 1}</span>{item.route}
                              </span>
                              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: sub, flexShrink: 0, marginLeft: 8 }}>{item.count}</span>
                            </div>
                            <div style={{ height: 7, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)", borderRadius: 99, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,#CC0000,#ff4444)`, borderRadius: 99, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lead breakdown */}
                  {s.leadBreakdown.length > 0 && (
                    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
                        📋 {ru ? "ЛИДЫ ПО СТАТУСАМ" : "LEADS BY STATUS"}
                      </div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {s.leadBreakdown.map(item => (
                          <div key={item.status} style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${border}`, borderRadius: 8, padding: "12px 20px", minWidth: 120, textAlign: "center" }}>
                            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 800, fontSize: 22, color: item.status === "Converted" ? "#16a34a" : item.status === "New" ? "#f59e0b" : text }}>{item.count}</div>
                            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: sub, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>{item.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}
          </>
        )}

        {/* Drivers section */}
        {tab === "drivers" && (
          <>
            {showDriverForm && (
              <div style={{ background: card, border: "1px solid rgba(22,163,74,0.4)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, margin: "0 0 16px", color: "#16a34a" }}>
                  {ru ? "Новый водитель" : "New Driver"}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { key: "fullName",  label: ru ? "Имя" : "Full Name",   placeholder: "John Smith" },
                    { key: "phone",     label: ru ? "Телефон" : "Phone",   placeholder: "+1 555 000 1234" },
                    { key: "cdlNumber", label: "CDL Number",               placeholder: "CDL-123456" },
                  ].map(f => (
                    <div key={f.key}>
                      <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{f.label}</div>
                      <input
                        style={{ ...inputStyle, outline: "none" }}
                        placeholder={f.placeholder}
                        value={(newDriver as Record<string, string>)[f.key]}
                        onChange={e => setNewDriver(v => ({ ...v, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{ru ? "Статус" : "Status"}</div>
                    <select style={{ ...inputStyle, outline: "none" }} value={newDriver.status}
                      onChange={e => setNewDriver(v => ({ ...v, status: e.target.value }))}>
                      <option value="Active">Active</option>
                      <option value="Off-duty">Off-duty</option>
                      <option value="On-leave">On-leave</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                  <button style={{ ...btn("green"), padding: "8px 22px", fontSize: 13 }} onClick={handleCreateDriver}>
                    {ru ? "Создать" : "Create"}
                  </button>
                  <button style={{ ...btn("gray"), padding: "8px 22px", fontSize: 13 }} onClick={() => setShowDriverForm(false)}>
                    {ru ? "Отмена" : "Cancel"}
                  </button>
                </div>
              </div>
            )}

            {driversLoading ? (
              <div style={{ textAlign: "center", color: sub, padding: 60 }}>{ru ? "Загрузка..." : "Loading..."}</div>
            ) : drivers.length === 0 ? (
              <div style={{ textAlign: "center", color: sub, padding: 60, border: `1px dashed ${border}`, borderRadius: 12 }}>
                {ru ? "Водители не добавлены" : "No drivers yet"}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {drivers.map(d => {
                  const isEditing = editDriver?.id === d.id;
                  const statusColor = d.status === "Active" ? "#16a34a" : d.status === "On-leave" ? "#f59e0b" : "#888";
                  return (
                    <div key={d.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
                      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: isDark ? "#1a1a1a" : "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                          🧑‍✈️
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            {isEditing ? (
                              <input style={{ ...inputStyle, maxWidth: 220 }} value={editDriver.fullName}
                                onChange={e => setEditDriver({ ...editDriver, fullName: e.target.value })} />
                            ) : (
                              <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16 }}>{d.fullName}</span>
                            )}
                            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: `${statusColor}22`, color: statusColor, fontWeight: 700 }}>
                              {d.status}
                            </span>
                            {d.vehicleModel && (
                              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: isDark ? "#1a1a1a" : "#f0f0f0", color: sub }}>
                                🚛 {d.vehicleModel}
                              </span>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
                            <div style={{ minWidth: 160 }}>
                              <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const }}>{ru ? "Телефон" : "Phone"}</div>
                              {isEditing ? (
                                <input style={inputStyle} value={editDriver.phone}
                                  onChange={e => setEditDriver({ ...editDriver, phone: e.target.value })} />
                              ) : (
                                <span style={{ fontSize: 13 }}>{d.phone || "—"}</span>
                              )}
                            </div>
                            <div style={{ minWidth: 160 }}>
                              <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const }}>CDL</div>
                              {isEditing ? (
                                <input style={inputStyle} value={editDriver.cdlNumber}
                                  onChange={e => setEditDriver({ ...editDriver, cdlNumber: e.target.value })} />
                              ) : (
                                <span style={{ fontSize: 13, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>{d.cdlNumber}</span>
                              )}
                            </div>
                            {isEditing && (
                              <div style={{ minWidth: 140 }}>
                                <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" as const }}>{ru ? "Статус" : "Status"}</div>
                                <select style={inputStyle} value={editDriver.status}
                                  onChange={e => setEditDriver({ ...editDriver, status: e.target.value })}>
                                  <option value="Active">Active</option>
                                  <option value="Off-duty">Off-duty</option>
                                  <option value="On-leave">On-leave</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                          {isEditing ? (
                            <>
                              <button style={btn("green")} onClick={handleUpdateDriver}>{ru ? "Сохранить" : "Save"}</button>
                              <button style={btn("gray")} onClick={() => setEditDriver(null)}>{ru ? "Отмена" : "Cancel"}</button>
                            </>
                          ) : (
                            <>
                              <button style={btn("gray")} onClick={() => setEditDriver({ id: d.id, fullName: d.fullName, phone: d.phone, cdlNumber: d.cdlNumber, status: d.status })}>
                                {ru ? "Изменить" : "Edit"}
                              </button>
                              <select
                                style={{ ...btn("gray"), cursor: "pointer", appearance: "none" as const, textAlign: "center" as const }}
                                value={d.status}
                                onChange={e => handlePatchDriverStatus(d.id, e.target.value)}
                              >
                                <option value="Active">Active</option>
                                <option value="Off-duty">Off-duty</option>
                                <option value="On-leave">On-leave</option>
                              </select>
                              <button style={btn("red")} onClick={() => handleDeleteDriver(d.id, d.fullName)}>
                                {ru ? "Удалить" : "Delete"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Leads section */}
        {tab === "leads" && (() => {
          const leadStatusColor = (s: string) => s === "New" ? "#f59e0b" : s === "Contacted" ? "#3b82f6" : s === "Converted" ? "#16a34a" : "#888";
          const appStatusColor  = (s: string) => s === "Pending" ? "#f59e0b" : s === "Reviewed" ? "#3b82f6" : s === "Accepted" ? "#16a34a" : s === "Rejected" ? "#CC0000" : "#888";

          return (
            <>
              {/* Sub-tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {([
                  { key: "quotes", label: ru ? "Заявки на перевозку" : "Quote Requests" },
                  { key: "jobs",   label: ru ? "Вакансии" : "Job Applications" },
                ] as { key: "quotes" | "jobs"; label: string }[]).map(st => (
                  <button
                    key={st.key}
                    onClick={() => setLeadsSubTab(st.key)}
                    style={{
                      padding: "7px 18px", borderRadius: 20, border: `1px solid ${leadsSubTab === st.key ? "#CC0000" : border}`,
                      background: leadsSubTab === st.key ? "rgba(204,0,0,0.1)" : "transparent",
                      color: leadsSubTab === st.key ? "#CC0000" : sub,
                      fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer",
                    }}
                  >
                    {st.label}
                    {leadsSubTab === st.key && (
                      <span style={{ marginLeft: 8, background: "#CC0000", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>
                        {st.key === "quotes" ? leads.length : jobApps.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Quote Requests */}
              {leadsSubTab === "quotes" && (
                leadsLoading ? (
                  <div style={{ textAlign: "center", color: sub, padding: 60 }}>{ru ? "Загрузка..." : "Loading..."}</div>
                ) : leads.length === 0 ? (
                  <div style={{ textAlign: "center", color: sub, padding: 60, border: `1px dashed ${border}`, borderRadius: 12 }}>
                    {ru ? "Нет заявок" : "No quote requests"}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {leads.map(l => (
                      <div key={l.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" as const }}>
                              <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 15 }}>{l.fullName}</span>
                              {l.company && <span style={{ fontSize: 11, color: sub }}>{l.company}</span>}
                              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: `${leadStatusColor(l.status)}22`, color: leadStatusColor(l.status), fontWeight: 700 }}>
                                {l.status}
                              </span>
                              <span style={{ fontSize: 11, color: sub, marginLeft: "auto" }}>
                                {new Date(l.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 10 }}>
                              {[
                                { label: "Email", value: l.email },
                                { label: ru ? "Телефон" : "Phone", value: l.phone || "—" },
                                { label: ru ? "Откуда" : "Origin", value: l.origin },
                                { label: ru ? "Куда" : "Destination", value: l.destination },
                                { label: ru ? "Груз" : "Equipment", value: l.equipment || "—" },
                                { label: ru ? "Вес" : "Weight", value: l.weight ? `${l.weight} lb` : "—" },
                              ].map(f => (
                                <div key={f.label}>
                                  <div style={{ fontSize: 10, color: sub, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 2 }}>{f.label}</div>
                                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.value}</div>
                                </div>
                              ))}
                            </div>

                            {l.message && (
                              <div style={{ fontSize: 12, color: sub, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: 6, padding: "8px 12px" }}>
                                {l.message}
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                            <select
                              style={{ ...btn("gray"), cursor: "pointer", appearance: "none" as const, textAlign: "center" as const, minWidth: 110 }}
                              value={l.status}
                              onChange={e => handleLeadStatus(l.id, e.target.value)}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Converted">Converted</option>
                              <option value="Closed">Closed</option>
                            </select>
                            <button style={{ ...btn("red"), minWidth: 110 }} onClick={() => handleDeleteLead(l.id)}>
                              {ru ? "Удалить" : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Job Applications */}
              {leadsSubTab === "jobs" && (
                jobAppsLoading ? (
                  <div style={{ textAlign: "center", color: sub, padding: 60 }}>{ru ? "Загрузка..." : "Loading..."}</div>
                ) : jobApps.length === 0 ? (
                  <div style={{ textAlign: "center", color: sub, padding: 60, border: `1px dashed ${border}`, borderRadius: 12 }}>
                    {ru ? "Нет откликов" : "No applications"}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {jobApps.map(j => (
                      <div key={j.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" as const }}>
                              <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 15 }}>{j.fullName}</span>
                              <span style={{ fontSize: 12, padding: "2px 10px", borderRadius: 20, background: isDark ? "#1a1a1a" : "#f0f0f0", color: sub, fontWeight: 600 }}>
                                {j.position}
                              </span>
                              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: `${appStatusColor(j.status)}22`, color: appStatusColor(j.status), fontWeight: 700 }}>
                                {j.status}
                              </span>
                              <span style={{ fontSize: 11, color: sub, marginLeft: "auto" }}>
                                {new Date(j.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div style={{ display: "flex", gap: 24, marginBottom: 10, flexWrap: "wrap" as const }}>
                              {[
                                { label: "Email", value: j.email },
                                { label: ru ? "Телефон" : "Phone", value: j.phone || "—" },
                              ].map(f => (
                                <div key={f.label}>
                                  <div style={{ fontSize: 10, color: sub, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 2 }}>{f.label}</div>
                                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.value}</div>
                                </div>
                              ))}
                            </div>

                            {j.message && (
                              <div style={{ fontSize: 12, color: sub, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: 6, padding: "8px 12px" }}>
                                {j.message}
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                            <select
                              style={{ ...btn("gray"), cursor: "pointer", appearance: "none" as const, textAlign: "center" as const, minWidth: 110 }}
                              value={j.status}
                              onChange={e => handleJobAppStatus(j.id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewed">Reviewed</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            <button style={{ ...btn("red"), minWidth: 110 }} onClick={() => handleDeleteJobApp(j.id)}>
                              {ru ? "Удалить" : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          );
        })()}

        {/* Fleet section */}
        {tab === "fleet" && (
          <>
            {showVehicleForm && (
              <div style={{ background: card, border: "1px solid rgba(22,163,74,0.4)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, margin: "0 0 16px", color: "#16a34a" }}>
                  {ru ? "Новый транспорт" : "New Vehicle"}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{ru ? "Модель" : "Model"}</div>
                    <input style={inputStyle} placeholder="Freightliner Cascadia" value={newVehicle.model}
                      onChange={e => setNewVehicle(v => ({ ...v, model: e.target.value }))} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{ru ? "Тип" : "Type"}</div>
                    <select style={inputStyle} value={newVehicle.type}
                      onChange={e => setNewVehicle(v => ({ ...v, type: e.target.value }))}>
                      <option value="Truck">Truck</option>
                      <option value="Trailer">Trailer</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{ru ? "Год" : "Year"}</div>
                    <input style={inputStyle} type="number" placeholder="2024" value={newVehicle.year}
                      onChange={e => setNewVehicle(v => ({ ...v, year: e.target.value }))} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{ru ? "Номер" : "Plate"}</div>
                    <input style={inputStyle} placeholder="ABC-1234" value={newVehicle.plate}
                      onChange={e => setNewVehicle(v => ({ ...v, plate: e.target.value }))} />
                  </div>
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                  <button style={{ ...btn("green"), padding: "8px 22px", fontSize: 13 }} onClick={handleCreateVehicle}>
                    {ru ? "Создать" : "Create"}
                  </button>
                  <button style={{ ...btn("gray"), padding: "8px 22px", fontSize: 13 }} onClick={() => setShowVehicleForm(false)}>
                    {ru ? "Отмена" : "Cancel"}
                  </button>
                </div>
              </div>
            )}

            {vehiclesLoading ? (
              <div style={{ textAlign: "center", color: sub, padding: 60 }}>{ru ? "Загрузка..." : "Loading..."}</div>
            ) : vehicles.length === 0 ? (
              <div style={{ textAlign: "center", color: sub, padding: 60, border: `1px dashed ${border}`, borderRadius: 12 }}>
                {ru ? "Транспорт не добавлен" : "No vehicles yet"}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {vehicles.map(v => {
                  const isEditing = editVehicle?.id === v.id;
                  return (
                    <div key={v.id} style={{
                      background: card,
                      border: `1px solid ${v.available ? border : "rgba(204,0,0,0.3)"}`,
                      borderRadius: 12, padding: 20, opacity: v.available ? 1 : 0.65,
                    }}>
                      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 16 }}>
                              {isEditing ? (
                                <input style={{ ...inputStyle, maxWidth: 280 }} value={editVehicle.model}
                                  onChange={e => setEditVehicle({ ...editVehicle, model: e.target.value })} />
                              ) : v.model}
                            </span>
                            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: isDark ? "#1a1a1a" : "#f0f0f0", color: sub }}>{v.type}</span>
                            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: v.available ? "rgba(22,163,74,0.15)" : "rgba(204,0,0,0.15)", color: v.available ? "#16a34a" : "#CC0000" }}>
                              {v.available ? (ru ? "Доступен" : "Available") : (ru ? "Занят" : "In use")}
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            <div style={{ minWidth: 120 }}>
                              <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" }}>{ru ? "Год" : "Year"}</div>
                              {isEditing ? (
                                <input style={inputStyle} type="number" value={editVehicle.year}
                                  onChange={e => setEditVehicle({ ...editVehicle, year: e.target.value })} />
                              ) : (
                                <span style={{ fontWeight: 700, fontSize: 15 }}>{v.year}</span>
                              )}
                            </div>
                            <div style={{ minWidth: 160 }}>
                              <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" }}>{ru ? "Тип" : "Type"}</div>
                              {isEditing ? (
                                <select style={inputStyle} value={editVehicle.type}
                                  onChange={e => setEditVehicle({ ...editVehicle, type: e.target.value })}>
                                  <option value="Truck">Truck</option>
                                  <option value="Trailer">Trailer</option>
                                  <option value="Van">Van</option>
                                </select>
                              ) : (
                                <span style={{ fontSize: 13 }}>{v.type}</span>
                              )}
                            </div>
                            <div style={{ minWidth: 160 }}>
                              <div style={{ fontSize: 11, color: sub, marginBottom: 4, textTransform: "uppercase" }}>{ru ? "Номер" : "Plate"}</div>
                              {isEditing ? (
                                <input style={inputStyle} value={editVehicle.plate}
                                  onChange={e => setEditVehicle({ ...editVehicle, plate: e.target.value })} />
                              ) : (
                                <span style={{ fontSize: 13, color: v.plate ? text : sub }}>{v.plate || "—"}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                          {isEditing ? (
                            <>
                              <button style={btn("green")} onClick={handleUpdateVehicle}>{ru ? "Сохранить" : "Save"}</button>
                              <button style={btn("gray")} onClick={() => setEditVehicle(null)}>{ru ? "Отмена" : "Cancel"}</button>
                            </>
                          ) : (
                            <>
                              <button style={btn("gray")} onClick={() => setEditVehicle({ id: v.id, model: v.model, type: v.type, year: String(v.year), plate: v.plate ?? "" })}>
                                {ru ? "Изменить" : "Edit"}
                              </button>
                              <button style={btn(v.available ? "gray" : "green")} onClick={() => handleToggleVehicle(v.id)}>
                                {v.available ? (ru ? "Занят" : "Mark in use") : (ru ? "Доступен" : "Mark available")}
                              </button>
                              <button style={btn("red")} onClick={() => handleDeleteVehicle(v.id, v.model)}>
                                {ru ? "Удалить" : "Delete"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
