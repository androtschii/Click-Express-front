import React, { useState, useEffect } from "react";
import { X, ShoppingCart, CheckCircle } from "@phosphor-icons/react";
import type { Session } from "../../services/authService";
import type { Load } from "../../types/index";

export interface CartItemDto {
  id: number;
  productId: number;
  quantity: number;
  productName: string;
  price: number;
  total: number;
}

interface CartPanelProps {
  session: Session;
  theme: string;
  loads: Load[];
  cartItems: CartItemDto[];
  apiBase: string;
  onClose: () => void;
  onRemoveItem: (itemId: number) => void;
  onCheckoutSuccess: () => void;
}

export function CartPanel({
  session,
  theme,
  loads,
  cartItems,
  apiBase,
  onClose,
  onRemoveItem,
  onCheckoutSuccess,
}: CartPanelProps) {
  const isDark = theme === "dark";
  const bord = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  const [step, setStep] = useState<"cart" | "confirm" | "processing" | "success">("cart");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const total = cartItems.reduce((sum, i) => sum + i.total, 0);

  const getLoad = (productId: number) => loads.find(l => l.id === productId);

  const checkout = async () => {
    setStep("processing");
    setError(null);
    try {
      const res = await fetch(`${apiBase}/order/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { message?: string };
        setError(err.message || "Checkout failed");
        setStep("confirm");
        return;
      }
      setStep("success");
      setTimeout(() => {
        onClose();
        onCheckoutSuccess();
      }, 1800);
    } catch {
      setError("Network error. Please try again.");
      setStep("confirm");
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={step === "processing" || step === "success" ? undefined : onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "min(500px, 100vw)",
          background: isDark ? "#0a0a0a" : "#fff",
          borderLeft: "2px solid #CC0000",
          display: "flex", flexDirection: "column",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${bord}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              CART
            </div>
            <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase" }}>
              MY CART <span style={{ color: "#CC0000" }}>({cartItems.length})</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={step === "processing"}
            style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: "50%", width: 40, height: 40, color: "#CC0000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Success state */}
        {step === "success" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
            <div style={{ marginBottom: 20, animation: "checkIn 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
              <style>{`@keyframes checkIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}`}</style>
              <CheckCircle size={72} weight="duotone" color="#00b450" />
            </div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 28, color: isDark ? "#fff" : "#1a1a1a", textTransform: "uppercase", marginBottom: 8 }}>
              ORDER PLACED!
            </h2>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
              Redirecting to your orders...
            </p>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", padding: "16px 20px" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ marginBottom: 14 }}><ShoppingCart size={56} weight="duotone" color="#CC0000" /></div>
                  <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", fontSize: 15 }}>
                    Your cart is empty
                  </p>
                  <p style={{ fontFamily: "'Barlow',sans-serif", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.28)", fontSize: 12, marginTop: 6 }}>
                    Browse loads and click "Add to Cart"
                  </p>
                </div>
              ) : (
                cartItems.map(item => {
                  const load = getLoad(item.productId);
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${bord}`,
                        borderRadius: 12,
                        overflow: "hidden",
                        marginBottom: 14,
                        opacity: step === "processing" ? 0.6 : 1,
                        transition: "opacity 0.2s",
                      }}
                    >
                      {load?.image && (
                        <div style={{ position: "relative", height: 120 }}>
                          <img
                            src={load.image}
                            alt={load.route}
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 72%", filter: isDark ? "brightness(0.55)" : "brightness(0.7)" }}
                          />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.75))" }} />
                          <div style={{ position: "absolute", bottom: 8, left: 12 }}>
                            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", lineHeight: 1 }}>
                              ${item.total.toLocaleString()}
                            </div>
                            {load && (
                              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                                {load.miles.toLocaleString()} mi
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div style={{ padding: "10px 14px 12px" }}>
                        <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: isDark ? "rgba(255,255,255,0.9)" : "#1a1a1a", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.productName}
                        </div>
                        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", marginBottom: 10 }}>
                          Qty: {item.quantity} · ${item.price.toLocaleString()}/unit
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          disabled={step === "processing"}
                          style={{ padding: "6px 14px", background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.35)", borderRadius: 6, color: "#ff4d6d", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1, cursor: "pointer", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#ff4d6d"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,77,109,0.1)"; e.currentTarget.style.color = "#ff4d6d"; }}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer: total + checkout */}
            {cartItems.length > 0 && (
              <div style={{ padding: "16px 24px 24px", borderTop: `1px solid ${bord}` }}>
                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>
                    Total
                  </span>
                  <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 28, color: "#CC0000" }}>
                    ${total.toLocaleString()}
                  </span>
                </div>

                {error && (
                  <div style={{ marginBottom: 12, padding: "10px 14px", background: "rgba(255,77,109,0.12)", border: "1px solid rgba(255,77,109,0.35)", borderRadius: 8, fontFamily: "'Barlow',sans-serif", fontSize: 12, color: "#ff4d6d" }}>
                    {error}
                  </div>
                )}

                {step === "cart" && (
                  <button
                    onClick={() => setStep("confirm")}
                    style={{
                      width: "100%", padding: "14px",
                      background: "linear-gradient(135deg, #CC0000, #ff3333)",
                      border: "none", borderRadius: 10,
                      color: "#fff", fontFamily: "'Oswald',sans-serif",
                      fontWeight: 700, fontSize: 16, letterSpacing: 2,
                      textTransform: "uppercase", cursor: "pointer",
                      boxShadow: "0 6px 24px rgba(204,0,0,0.4)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(204,0,0,0.55)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(204,0,0,0.4)"; }}
                  >
                    CHECKOUT
                  </button>
                )}

                {step === "confirm" && (
                  <div>
                    <div style={{ marginBottom: 12, padding: "12px 14px", background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${bord}`, borderRadius: 8 }}>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, color: isDark ? "rgba(255,255,255,0.7)" : "#1a1a1a", marginBottom: 4 }}>
                        Confirm order for {cartItems.length} load{cartItems.length > 1 ? "s" : ""}?
                      </div>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 11, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)" }}>
                        Total: ${total.toLocaleString()} · A dispatcher will contact you within 24h
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => setStep("cart")}
                        style={{ flex: 1, padding: "12px", background: "transparent", border: `1px solid ${bord}`, borderRadius: 8, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, cursor: "pointer", textTransform: "uppercase", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#CC0000"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = bord; e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"; }}
                      >
                        BACK
                      </button>
                      <button
                        onClick={checkout}
                        style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #CC0000, #ff3333)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 2, cursor: "pointer", textTransform: "uppercase", boxShadow: "0 4px 16px rgba(204,0,0,0.4)", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(204,0,0,0.6)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(204,0,0,0.4)"; }}
                      >
                        CONFIRM ORDER
                      </button>
                    </div>
                  </div>
                )}

                {step === "processing" && (
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <div style={{ display: "inline-block", width: 32, height: 32, border: "3px solid rgba(204,0,0,0.2)", borderTopColor: "#CC0000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginTop: 10 }}>
                      Processing your order...
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
