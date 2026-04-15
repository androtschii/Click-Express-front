import React, { useEffect, useState } from "react";
import {
  fetchProducts, fetchProductStats,
  updateProductPrice, updateProductImage,
  updateProductStock, toggleProductActive, deleteProduct, createProduct
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

interface AdminPageProps {
  theme: "dark" | "light";
  onBack: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ theme, onBack }) => {
  const { lang } = useLanguage();
  const ru = lang === "ru";

  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editPrice, setEditPrice] = useState<{ id: number; value: string } | null>(null);
  const [editImage, setEditImage] = useState<{ id: number; value: string } | null>(null);
  const [editStock, setEditStock] = useState<{ id: number; value: string } | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCard, setNewCard] = useState({ name: "", description: "", price: "", imageUrl: "", category: "Full Load", stock: "1" });

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
      const [p, s] = await Promise.all([fetchProducts(), fetchProductStats()]);
      setProducts(p);
      setStats(s);
    } catch { notify(ru ? "Ошибка загрузки" : "Load error", false); }
    finally { setLoading(false); }
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, margin: 0 }}>
              <span style={{ color: "#CC0000" }}>ADMIN</span> {ru ? "ПАНЕЛЬ" : "PANEL"}
            </h1>
            <p style={{ color: sub, fontSize: 13, margin: "4px 0 0" }}>
              {ru ? "Управление услугами ClickExpress" : "ClickExpress Load Management"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowCreateForm(v => !v)} style={{ ...btn("green"), padding: "8px 18px", fontSize: 13 }}>
              {showCreateForm ? "✕" : (ru ? "+ Новая карточка" : "+ New Card")}
            </button>
            <button onClick={onBack} style={btn("gray")}>{ru ? "← Назад" : "← Back"}</button>
          </div>
        </div>

        {/* Форма создания */}
        {showCreateForm && (
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

        {stats && (
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

        {loading ? (
          <div style={{ textAlign: "center", color: sub, padding: 60 }}>{ru ? "Загрузка..." : "Loading..."}</div>
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
        )}
      </div>
    </div>
  );
};
