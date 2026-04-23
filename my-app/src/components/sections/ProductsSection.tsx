import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  updateProductPrice,
  updateProductImage,
  toggleProductActive,
} from "../../api/client.js";

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

interface ProductsSectionProps {
  theme: "dark" | "light";
  isAdmin: boolean;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ theme, isAdmin }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPrice, setEditPrice] = useState<{ id: number; value: string } | null>(null);
  const [editImage, setEditImage] = useState<{ id: number; value: string } | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const isDark = theme === "dark";
  const bg = isDark ? "#0d0d0d" : "#f8f8f8";
  const card = isDark ? "#111" : "#fff";
  const text = isDark ? "#fff" : "#1a1a1a";
  const sub = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";

  const notify = (t: string, ok = true) => {
    setMsg({ text: t, ok });
    setTimeout(() => setMsg(null), 2500);
  };

  useEffect(() => {
    fetchProducts()
      .then((data: Product[]) => setProducts(data.filter((p: Product) => p.isActive || isAdmin)))
      .catch(() => notify("Ошибка загрузки услуг", false))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handlePrice = async (id: number) => {
    if (!editPrice) return;
    try {
      const val = parseFloat(editPrice.value);
      if (isNaN(val) || val <= 0) { notify("Некорректная цена", false); return; }
      await updateProductPrice(id, val);
      setProducts(ps => ps.map(p => p.id === id ? { ...p, price: val } : p));
      setEditPrice(null);
      notify("Цена обновлена ✓");
    } catch { notify("Ошибка обновления цены", false); }
  };

  const handleImage = async (id: number) => {
    if (!editImage) return;
    try {
      await updateProductImage(id, editImage.value);
      setProducts(ps => ps.map(p => p.id === id ? { ...p, imageUrl: editImage.value } : p));
      setEditImage(null);
      notify("Фото обновлено ✓");
    } catch { notify("Ошибка обновления фото", false); }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await toggleProductActive(id);
      setProducts(ps => ps.map(p => p.id === id ? { ...p, isActive: res.isActive } : p));
      notify(res.message);
    } catch { notify("Ошибка", false); }
  };

  const inputStyle: React.CSSProperties = {
    background: isDark ? "#1a1a1a" : "#f0f0f0",
    border: "1px solid #CC0000",
    borderRadius: 4, color: text,
    padding: "4px 8px", fontSize: 12,
    fontFamily: "'Barlow',sans-serif",
    width: "100%", outline: "none",
  };

  const smallBtn = (color: string): React.CSSProperties => ({
    padding: "3px 10px", borderRadius: 4, border: "none",
    cursor: "pointer", fontSize: 11, fontWeight: 700,
    fontFamily: "'Barlow',sans-serif",
    background: color, color: "#fff",
  });

  if (loading) return (
    <div style={{ textAlign: "center", padding: 60, color: sub }}>
      <div style={{ width: 36, height: 36, margin: "0 auto 12px", border: "3px solid rgba(204,0,0,0.2)", borderTop: "3px solid #CC0000", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Загрузка услуг...
    </div>
  );

  return (
    <section style={{ background: bg, padding: "60px 20px" }}>

 {/* Toast */}
      {msg && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999,
          background: msg.ok ? "#16a34a" : "#CC0000",
          color: "#fff", padding: "10px 20px", borderRadius: 8,
          fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 14,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)", transition: "all 0.3s",
        }}>{msg.text}</div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

 {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, marginBottom: 10 }}>
            Наши услуги
          </div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 36, fontWeight: 700, color: text, margin: 0 }}>
            УСЛУГИ <span style={{ color: "#CC0000" }}>ДОСТАВКИ</span>
          </h2>
          {isAdmin && (
            <div style={{ marginTop: 10, fontSize: 12, color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 600, background: "rgba(204,0,0,0.08)", display: "inline-block", padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(204,0,0,0.2)" }}>
              ⚙️ Режим администратора — вы можете редактировать карточки
            </div>
          )}
        </div>

 {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {products.map(p => (
            <div key={p.id} style={{
              background: card,
              border: `1px solid ${!p.isActive ? "rgba(204,0,0,0.3)" : border}`,
              borderRadius: 14,
              overflow: "hidden",
              opacity: p.isActive ? 1 : 0.6,
              boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.08)",
              transition: "transform 0.2s, box-shadow 0.2s",
              position: "relative",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = isDark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.08)"; }}
            >
 {/* Inactive badge */}
              {!p.isActive && (
                <div style={{ position: "absolute", top: 12, left: 12, background: "#CC0000", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, fontFamily: "'Barlow',sans-serif", letterSpacing: 1, zIndex: 2 }}>
                  НЕАКТИВЕН
                </div>
              )}

 {/* Image */}
              <div style={{ position: "relative", height: 180, overflow: "hidden", background: isDark ? "#1a1a1a" : "#f0f0f0" }}>
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
 onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/400x180?text=ClickExpress"; }}
                />
 {/* Admin: edit image button */}
                {isAdmin && (
                  <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 3 }}>
                    {editImage?.id === p.id ? (
                      <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,0.85)", padding: 6, borderRadius: 6 }}>
                        <input
                          style={{ ...inputStyle, width: 180 }}
                          placeholder="URL фото..."
                          value={editImage.value}
                          onChange={e => setEditImage({ id: p.id, value: e.target.value })}
                          onKeyDown={e => e.key === "Enter" && handleImage(p.id)}
                        />
                        <button style={smallBtn("#CC0000")} onClick={() => handleImage(p.id)}>✓</button>
                        <button style={smallBtn("#555")} onClick={() => setEditImage(null)}>✕</button>
                      </div>
                    ) : (
                      <button
                        style={{ ...smallBtn("rgba(0,0,0,0.7)"), border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}
                        onClick={() => setEditImage({ id: p.id, value: p.imageUrl })}
                      >📷 Фото</button>
                    )}
                  </div>
                )}
              </div>

 {/* Content */}
              <div style={{ padding: "20px 20px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{p.category}</span>
                  <span style={{ fontSize: 11, color: p.stock > 0 ? "#16a34a" : "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 600 }}>
                    {p.stock > 0 ? `✓ Доступно` : "✗ Нет мест"}
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: text, margin: "0 0 8px" }}>{p.name}</h3>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: sub, margin: "0 0 16px", lineHeight: 1.5 }}>{p.description}</p>

 {/* Price */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {isAdmin && editPrice?.id === p.id ? (
                    <div style={{ display: "flex", gap: 4, flex: 1, marginRight: 8 }}>
                      <input
                        style={inputStyle}
                        type="number"
                        value={editPrice.value}
                        onChange={e => setEditPrice({ id: p.id, value: e.target.value })}
                        onKeyDown={e => e.key === "Enter" && handlePrice(p.id)}
                      />
                      <button style={smallBtn("#CC0000")} onClick={() => handlePrice(p.id)}>✓</button>
                      <button style={smallBtn("#555")} onClick={() => setEditPrice(null)}>✕</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, color: "#CC0000" }}>
                        {p.price.toLocaleString()} ₽
                      </span>
                      {isAdmin && (
                        <button
                          style={{ background: "none", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 4, cursor: "pointer", padding: "2px 8px", fontSize: 12, color: "#CC0000" }}
                          onClick={() => setEditPrice({ id: p.id, value: String(p.price) })}
                        >✏️</button>
                      )}
                    </div>
                  )}

 {/* Admin toggle button */}
                  {isAdmin ? (
                    <button
                      style={smallBtn(p.isActive ? "#555" : "#16a34a")}
                      onClick={() => handleToggle(p.id)}
                    >{p.isActive ? "Деактивировать" : "Активировать"}</button>
                  ) : (
                    <button style={{
                      background: "#CC0000", color: "#fff", border: "none",
                      borderRadius: 6, padding: "8px 18px",
                      fontFamily: "'Barlow',sans-serif", fontWeight: 700,
                      fontSize: 12, letterSpacing: 1, cursor: "pointer",
                    }}>Заказать</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
