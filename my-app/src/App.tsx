import React, { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLoads } from "./hooks/useLoads";
import { useSavedLoads, useMyOrders, useSaveLoad, useUnsaveLoad, useCancelOrder } from "./hooks/useAuth";
import { useCart, useAddToCart, useRemoveFromCart } from "./hooks/useCart";
import { ConfirmDialogProvider } from "./components/ui/ConfirmDialog";
import { ThemeProvider, useTheme } from "./theme";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { useSessionCtx } from "./context/SessionContext";
import { translations } from "./i18n/translations";
import { Header } from "./components/layout/Header";
import { Hero } from "./components/sections/Hero";
import { Ticker } from "./components/layout/Ticker";
import { TrustStrip } from "./components/sections/TrustStrip";
import { ComplianceBar } from "./components/sections/ComplianceBar";
import { HowItWorks } from "./components/sections/HowItWorks";
import { HaulTypes } from "./components/sections/HaulTypes";
import { AboutSection } from "./components/sections/AboutSection";
import { Footer } from "./components/layout/Footer";
import { QuoteModal } from "./components/Modals/QuoteModal";
import { AuthModal } from "./components/Modals/AuthModal";
import { CompareModal } from "./components/Modals/CompareModal";
import { CartPanel, type CartItemDto } from "./components/Modals/CartPanel";
import { LoadListView } from "./components/loads/LoadList";
import { ChatBot } from "./components/ui/ChatBot";
import { BackToTop } from "./components/ui/BackToTop";
import { PhoneIcon } from "./components/ui/PhoneIcon";
import type { Load } from "./types/index";
import { filterLoads } from "./services/loadService.ts";
import { X, Heart, ClipboardText } from "@phosphor-icons/react";
import { CookieConsent } from "./components/ui/CookieConsent";
import { MobileCallBar } from "./components/ui/MobileCallBar";
import { WhyUs } from "./components/sections/WhyUs";
import { ReviewsStrip } from "./components/sections/ReviewsStrip";
import { ContactSection } from "./components/sections/ContactSection";
import { API_BASE } from "./config";

const LoadDetailPage = lazy(() => import("./components/loads/LoadDetailPage").then(m => ({ default: m.LoadDetailPage })));
const CareersPage    = lazy(() => import("./components/pages/CareersPage").then(m => ({ default: m.CareersPage })));
const ProfilePage    = lazy(() => import("./components/pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const OrdersPage     = lazy(() => import("./components/pages/OrdersPage").then(m => ({ default: m.OrdersPage })));
const TrackingPage   = lazy(() => import("./components/pages/TrackingPage").then(m => ({ default: m.TrackingPage })));
const NewsPage       = lazy(() => import("./components/pages/NewsPage").then(m => ({ default: m.NewsPage })));
const ReviewsPage    = lazy(() => import("./components/pages/ReviewsPage").then(m => ({ default: m.ReviewsPage })));
const FleetPage      = lazy(() => import("./components/pages/FleetPage").then(m => ({ default: m.FleetPage })));
const AdminPage      = lazy(() => import("./components/pages/AdminPage").then(m => ({ default: m.AdminPage })));
const NotFoundPage   = lazy(() => import("./components/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const FaqPage        = lazy(() => import("./components/pages/FaqPage").then(m => ({ default: m.FaqPage })));
const PrivacyPage    = lazy(() => import("./components/pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const PricingSection = lazy(() => import("./components/sections/PricingSection").then(m => ({ default: m.PricingSection })));
const RateCalculator = lazy(() => import("./components/sections/RateCalculator").then(m => ({ default: m.RateCalculator })));
const CoverageMap    = lazy(() => import("./components/sections/CoverageMap").then(m => ({ default: m.CoverageMap })));
const DriverSignupPage = lazy(() => import("./components/pages/DriverSignupPage").then(m => ({ default: m.DriverSignupPage })));

const PageLoader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
    <div style={{ width: 36, height: 36, border: "3px solid rgba(204,0,0,0.2)", borderTopColor: "#CC0000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function WeeklyHeartBtn({ saved, onClick }: { saved: boolean; onClick: () => void }) {
  const [burst, setBurst] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!saved) { setBurst(true); setTimeout(() => setBurst(false), 600); }
    onClick();
  };
  return (
    <button onClick={handleClick} style={{ position:"absolute", top:10, right:10, zIndex:3, width:38, height:38, borderRadius:"50%", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", background: saved ? "linear-gradient(135deg, #ff4d6d, #CC0000)" : "rgba(0,0,0,0.55)", boxShadow: saved ? "0 0 16px rgba(204,0,0,0.7), 0 0 32px rgba(204,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.4)", transition:"all 0.3s ease", animation: burst ? "heartBeat 0.6s ease" : "none", overflow:"visible" }}>
      {burst && <div style={{ position:"absolute", left:"50%", top:"50%", width:38, height:38, borderRadius:"50%", border:"2px solid #ff4d6d", animation:"burstRing 0.5s ease-out forwards", pointerEvents:"none", transform:"translate(-50%,-50%)" }} />}
      {burst && [0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        return <div key={i} style={{ position:"absolute", left:"50%", top:"50%", width:5, height:5, borderRadius:"50%", background: i%2===0 ? "#ff4d6d" : "#FFB300", animation:"particle 0.5s ease-out forwards", "--tx":`${Math.cos(rad)*18}px`, "--ty":`${Math.sin(rad)*18}px`, pointerEvents:"none" } as React.CSSProperties} />;
      })}
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ transition:"all 0.3s", filter: saved ? "drop-shadow(0 0 4px rgba(255,100,100,0.8))" : "none" }}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={saved ? "#fff" : "none"} stroke={saved ? "#fff" : "rgba(255,255,255,0.9)"} strokeWidth={saved ? "0" : "2"} style={{ transition:"all 0.3s" }} />
      </svg>
    </button>
  );
}

function FavoritesPanel({ loads, theme, onClose, onDetails, onRemove }: { loads: Load[]; theme: string; onClose: () => void; onDetails?: (l: Load) => void; onRemove?: (l: Load) => void }) {
  const isDark = theme === "dark";
  const bord = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const { lang } = useLanguage();
  const t = translations[lang].favorites;
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ position:"absolute", right:0, top:0, bottom:0, width:"min(480px,100vw)", background:isDark?"#0a0a0a":"#fff", borderLeft:"2px solid #CC0000", display:"flex", flexDirection:"column", boxShadow:"-20px 0 60px rgba(0,0,0,0.6)" }}>
        <div style={{ padding:"24px 24px 16px", borderBottom:`1px solid ${bord}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>{t.saved}</div>
            <h3 style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:24, color:isDark?"#fff":"#1a1a1a", textTransform:"uppercase" }}>{t.title} <span style={{ color:"#CC0000" }}>({loads.length})</span></h3>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:"50%", width:38, height:38, color:isDark?"rgba(255,255,255,0.5)":"#666", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={18} weight="bold" /></button>
        </div>
        <div style={{ flex:1, overflowY:"auto", overscrollBehavior:"contain", padding:"16px 20px" }}>
          {loads.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ marginBottom:14 }}><Heart size={56} weight="duotone" color="#CC0000" /></div>
              <p style={{ fontFamily:"'Barlow',sans-serif", color:isDark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.4)", fontSize:15 }}>{t.empty}</p>
            </div>
          ) : loads.map(l => (
            <div key={l.id} onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }}
              style={{ background:isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)", border:`1px solid ${bord}`, borderRadius:12, overflow:"hidden", cursor:"pointer", transition:"all 0.2s", marginBottom:14 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#CC0000"; (e.currentTarget as HTMLElement).style.transform="translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=bord; (e.currentTarget as HTMLElement).style.transform="none"; }}
            >
              <div style={{ position:"relative", height:160 }}>
                <img src={l.image} alt={l.route} style={{ width:"100%", height:"100%", objectFit:"cover", filter:isDark?"brightness(0.62)":"brightness(0.75)" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.8))" }} />
                <div style={{ position:"absolute", bottom:10, left:12 }}>
                  <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:22, color:"#fff" }}>${l.price.toLocaleString()}</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"rgba(255,255,255,0.55)" }}>{l.miles.toLocaleString()} mi</div>
                </div>
              </div>
              <div style={{ padding:"10px 14px 12px" }}>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, color:isDark?"rgba(255,255,255,0.9)":"#1a1a1a", marginBottom:8 }}>{l.route} → {l.dest}</div>
                <div style={{ display:"flex", gap:8 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }} style={{ flex:1, padding:"7px", background:"rgba(204,0,0,0.1)", border:"1px solid rgba(204,0,0,0.3)", borderRadius:6, color:"#CC0000", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>{t.viewDetails}</button>
                  <button onClick={() => onRemove && onRemove(l)} style={{ padding:"7px 14px", background:"rgba(255,77,109,0.12)", border:"1px solid rgba(255,77,109,0.4)", borderRadius:6, color:"#ff4d6d", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, cursor:"pointer" }}>{t.unlike}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loads.length > 0 && (
          <div style={{ padding:"14px 24px", borderTop:`1px solid ${bord}`, display:"flex", alignItems:"center", gap:8 }}>
            <PhoneIcon size={14} color="#CC0000" />
            <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:isDark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.4)" }}>{t.toBook} </span>
            <a href="tel:+17862026599" style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, color:"#CC0000", textDecoration:"none" }}>+1 786-202-6599</a>
          </div>
        )}
      </div>
    </div>
  );
}

function RequestsPanel({ loads, theme, onClose, onDetails, onCancel, onBrowseLoads }: { loads: Load[]; theme: string; onClose: () => void; onDetails?: (l: Load) => void; onCancel?: (l: Load) => void; onBrowseLoads?: () => void }) {
  const isDark = theme === "dark";
  const bord = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const { lang } = useLanguage();
  const t = translations[lang].requests;
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ position:"absolute", right:0, top:0, bottom:0, width:"min(480px,100vw)", background:isDark?"#0a0a0a":"#fff", borderLeft:"2px solid #CC0000", display:"flex", flexDirection:"column", boxShadow:"-20px 0 60px rgba(0,0,0,0.6)" }}>
        <div style={{ padding:"24px 24px 16px", borderBottom:`1px solid ${bord}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"#CC0000", letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>{t.booked}</div>
            <h3 style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:26, color:isDark?"#fff":"#1a1a1a", textTransform:"uppercase" }}>{t.title} <span style={{ color:"#CC0000" }}>({loads.length})</span></h3>
          </div>
          <button onClick={onClose} style={{ background:"rgba(204,0,0,0.1)", border:"1px solid rgba(204,0,0,0.3)", borderRadius:"50%", width:40, height:40, color:"#CC0000", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={18} weight="bold" /></button>
        </div>
        <div style={{ flex:1, overflowY:"auto", overscrollBehavior:"contain", padding:"16px 20px" }}>
          {loads.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ marginBottom:14 }}><ClipboardText size={56} weight="duotone" color="#CC0000" /></div>
              <p style={{ fontFamily:"'Barlow',sans-serif", color:isDark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.4)", fontSize:15 }}>{t.empty}</p>
              <p style={{ fontFamily:"'Barlow',sans-serif", color:isDark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.25)", fontSize:12, marginTop:6, marginBottom:28 }}>{t.emptyHint}</p>
              <button onClick={() => { onClose(); setTimeout(() => onBrowseLoads?.(), 80); }} style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"13px 28px", background:"linear-gradient(135deg,#CC0000,#ff3333)", border:"none", borderRadius:10, color:"#fff", fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:14, letterSpacing:2, textTransform:"uppercase", cursor:"pointer" }}>
                <span style={{ fontSize:18 }}>+</span>
                {lang === "ru" ? "Найти груз" : "Find a Load"}
              </button>
            </div>
          ) : loads.map((l, idx) => (
            <div key={`${l.id}-${idx}`} onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }}
              style={{ background:isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)", border:"1px solid rgba(0,180,80,0.3)", borderRadius:12, overflow:"hidden", cursor:"pointer", transition:"all 0.2s", marginBottom:14 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#CC0000"; (e.currentTarget as HTMLElement).style.transform="translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(0,180,80,0.3)"; (e.currentTarget as HTMLElement).style.transform="none"; }}
            >
              <div style={{ position:"relative", height:160 }}>
                <img src={l.image} alt={l.route} style={{ width:"100%", height:"100%", objectFit:"cover", filter:isDark?"brightness(0.62)":"brightness(0.75)" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.8))" }} />
                <div style={{ position:"absolute", top:10, right:10, background:"rgba(0,180,80,0.9)", color:"#fff", borderRadius:20, padding:"5px 12px", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:9, letterSpacing:1 }}>✓ REQUESTED</div>
                <div style={{ position:"absolute", bottom:10, left:12 }}>
                  <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:22, color:"#fff" }}>${l.price.toLocaleString()}</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"rgba(255,255,255,0.55)" }}>{l.miles.toLocaleString()} mi</div>
                </div>
              </div>
              <div style={{ padding:"10px 14px 12px" }}>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, color:isDark?"rgba(255,255,255,0.9)":"#1a1a1a", marginBottom:8 }}>{l.route} → {l.dest}</div>
                <div style={{ display:"flex", gap:8 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { onClose(); setTimeout(() => onDetails && onDetails(l), 120); }} style={{ flex:1, padding:"7px", background:"rgba(204,0,0,0.1)", border:"1px solid rgba(204,0,0,0.3)", borderRadius:6, color:"#CC0000", fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:10, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>{t.viewDetails}</button>
                  <button onClick={() => onCancel && onCancel(l)} style={{ padding:"7px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${bord}`, borderRadius:6, color:isDark?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)", fontFamily:"'Barlow',sans-serif", fontSize:10, cursor:"pointer" }}>{t.cancel}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:"16px 20px", borderTop:`1px solid ${bord}`, textAlign:"center" }}>
          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:isDark?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.4)" }}>{t.dispatcher}</div>
          <a href="tel:+17862026599" style={{ display:"flex", alignItems:"center", gap:6, marginTop:6, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:14, color:"#CC0000", textDecoration:"none" }}><PhoneIcon size={14} color="#CC0000" />+1 786-202-6599</a>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { lang } = useLanguage();
  const { session, setSession, handleLogout } = useSessionCtx();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const [weeklyIdx, setWeeklyIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Loads");
  const [showCart, setShowCart] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [isMobileView, setIsMobileView] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);

  const catalogRef = useRef<HTMLDivElement>(null);
  const aboutRef   = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => ref.current?.scrollIntoView({ behavior: "smooth" } as ScrollIntoViewOptions);

  useEffect(() => {
    const fn = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const { data: loads = [], isLoading: loading, error: loadsError } = useLoads();
  const error = loadsError?.message ?? null;
  const { data: savedLoadIds = [] } = useSavedLoads(session?.token);
  const { data: rawOrders = [] } = useMyOrders(session?.token);
  const { data: cartItems = [] } = useCart(session?.token);

  const saveLoadMut   = useSaveLoad(session?.token);
  const unsaveLoadMut = useUnsaveLoad(session?.token);
  const cancelOrderMut = useCancelOrder(session?.token);
  const addToCartMut  = useAddToCart(session?.token);
  const removeFromCartMut = useRemoveFromCart(session?.token);

  const savedLoads = useMemo(
    () => loads.filter(l => savedLoadIds.some(s => s.productId === l.id)),
    [loads, savedLoadIds]
  );

  const { bookedLoads, orderIdMap } = useMemo(() => {
    const active = rawOrders.filter(o => o.status !== "Cancelled");
    const map = new Map<number, number>();
    const booked = active.map(o => {
      const load = loads.find(l => l.id === o.productId);
      if (load) map.set(load.id, o.id);
      return load ?? null;
    }).filter((l): l is Load => l !== null);
    return { bookedLoads: booked, orderIdMap: map };
  }, [rawOrders, loads]);

  const filtered = filterLoads(loads, search, filter);

  const handleSave = (load: Load, saved: boolean) => {
    toast.success(saved
      ? (lang === "ru" ? "Сохранено в избранное" : "Saved to favorites")
      : (lang === "ru" ? "Удалено из избранного" : "Removed from favorites"));
    if (!session) return;
    if (saved) saveLoadMut.mutate(load.id);
    else unsaveLoadMut.mutate(load.id);
  };

  const handleCancelBook = (load?: Load) => {
    if (load && session) {
      const cartItem = cartItems.find(i => i.productId === load.id);
      if (cartItem) removeFromCartMut.mutate(cartItem.id);
      else { const orderId = orderIdMap.get(load.id); if (orderId) cancelOrderMut.mutate(orderId); }
    }
    toast.info(lang === "ru" ? "Заявка отменена" : "Request cancelled");
  };

  const handleBook = (load?: Load) => {
    if (!load) return;
    if (!session) { setShowAuth(true); return; }
    addToCartMut.mutate(load.id);
    toast.success(lang === "ru" ? "Добавлено в корзину" : "Added to cart");
  };

  const handleRemoveFromCart = (itemId: number) => removeFromCartMut.mutate(itemId);

  const handleCheckoutSuccess = () => {
    qc.invalidateQueries({ queryKey: ["cart", session?.token] });
    qc.invalidateQueries({ queryKey: ["my-orders", session?.token] });
    toast.success(lang === "ru" ? "Заказ оформлен!" : "Order placed!");
    navigate("/orders");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompare = (load: Load) => {
    setCompareIds(prev => {
      if (prev.includes(load.id)) return prev.filter(id => id !== load.id);
      if (prev.length >= 3) return prev;
      return [...prev, load.id];
    });
  };

  const bgColor  = theme === "dark" ? "#080808" : "#f5f5f5";
  const textColor = theme === "dark" ? "#fff" : "#1a1a1a";
  const cardBg   = theme === "dark" ? "#0d0d0d" : "#ffffff";

  const goAndScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    navigate("/");
    setTimeout(() => scrollTo(ref), 120);
  };

  return (
    <div style={{ background: bgColor, minHeight: "100vh", color: textColor, transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${bgColor};color:${textColor};transition:background 0.3s,color 0.3s;}
        ::selection{background:#CC0000;color:#fff;}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:${theme==="dark"?"#0a0a0a":"#e0e0e0"};}
        ::-webkit-scrollbar-thumb{background:#CC0000;border-radius:3px;}
        input::placeholder{color:${theme==="dark"?"rgba(255,255,255,0.25)":"rgba(0,0,0,0.3)"};}
      `}</style>

      <Header
        cartCount={cartItems.length}
        savedCount={savedLoads.length}
        theme={theme}
        onThemeToggle={toggleTheme}
        onCatalogClick={() => goAndScroll(catalogRef)}
        onAboutClick={() => goAndScroll(aboutRef)}
        onContactClick={() => goAndScroll(contactRef)}
        onQuoteClick={() => setShowQuote(true)}
        onSavedClick={() => setShowFavorites(true)}
        onRequestsClick={() => setShowCart(true)}
        onLoginClick={() => setShowAuth(true)}
      />

      <div style={{ paddingTop: 70 }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={
              <>
                <Hero onViewLoads={() => scrollTo(catalogRef)} onQuoteClick={() => setShowQuote(true)} onCareersClick={() => navigate("/careers")} />
                <Ticker />
                <TrustStrip theme={theme} />
                <ComplianceBar theme={theme} />
                <HowItWorks theme={theme} onQuoteClick={() => setShowQuote(true)} />

                <section ref={catalogRef} style={{ maxWidth:1240, margin:"0 auto", padding:"56px clamp(20px,4vw,56px) 80px" }}>
                  <style>{`
                    @keyframes catalogSlideIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
                    @keyframes weeklyGlow{0%,100%{box-shadow:0 0 20px rgba(204,0,0,0.25)}50%{box-shadow:0 0 40px rgba(204,0,0,0.55)}}
                    @keyframes heartBeat{0%{transform:scale(1)}25%{transform:scale(1.4)}50%{transform:scale(1.1)}75%{transform:scale(1.25)}100%{transform:scale(1)}}
                    @keyframes burstRing{0%{transform:translate(-50%,-50%) scale(0.3);opacity:1}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
                    @keyframes particle{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
                  `}</style>
                  <div style={{ marginBottom:36, animation:"catalogSlideIn 0.5s ease both" }}>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:11, color:"#CC0000", letterSpacing:4, textTransform:"uppercase", marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:20, height:2, background:"#CC0000", display:"inline-block" }} />
                      {lang === "ru" ? "Доступно сейчас" : "Available Now"}
                    </div>
                    <h2 style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:"clamp(34px,5.5vw,56px)", color:textColor, textTransform:"uppercase", lineHeight:1 }}>
                      {lang === "ru" ? "ЛУЧШИЕ " : "THE BEST "}<span style={{ color:"#CC0000" }}>{lang === "ru" ? "ГРУЗЫ" : "LOADS"}</span>
                    </h2>
                  </div>

                  <LoadListView
                    loads={filtered} loading={loading} error={error}
                    search={search} filter={filter} theme={theme} cardBg={cardBg}
                    onSearchChange={setSearch} onFilterChange={setFilter}
                    onBook={(load?: Load) => handleBook(load)}
                    onCancelBook={(load?: Load) => handleCancelBook(load)}
                    onSave={(saved: boolean, load?: Load) => { if (load) handleSave(load, saved); }}
                    onDetails={(load: Load) => { navigate(`/loads/${load.id}`, { state: { load } }); window.scrollTo({ top:0, behavior:"smooth" }); }}
                    onFleetClick={() => navigate("/fleet")}
                    bookedIds={cartItems.map(i => i.productId)}
                    savedIds={savedLoads.map(l => l.id)}
                    isAdmin={session?.role === "Admin"}
                    compareIds={compareIds}
                    onCompare={handleCompare}
                  />
                </section>

                <WhyUs theme={theme} onQuoteClick={() => setShowQuote(true)} />
                <HaulTypes theme={theme} onQuoteClick={() => setShowQuote(true)} />
                <CoverageMap theme={theme} />
                <ReviewsStrip theme={theme} onAllReviews={() => navigate("/reviews")} />
                <div ref={aboutRef}><AboutSection onContactClick={() => scrollTo(contactRef)} theme={theme} /></div>
                <RateCalculator theme={theme} onQuoteClick={() => setShowQuote(true)} />
                <PricingSection theme={theme} onQuoteClick={() => setShowQuote(true)} />
                <ContactSection theme={theme} />
                <div ref={contactRef}>
                  <Footer
                    theme={theme}
                    onCatalogClick={() => scrollTo(catalogRef)}
                    onAboutClick={() => scrollTo(aboutRef)}
                    onQuoteClick={() => setShowQuote(true)}
                    onContactClick={() => scrollTo(contactRef)}
                    onCareersClick={() => navigate("/careers")}
                    onFleetClick={() => navigate("/fleet")}
                    onFaqClick={() => navigate("/faq")}
                    onPrivacyClick={() => navigate("/privacy")}
                    onPricingClick={() => navigate("/pricing")}
                    onDriverSignupClick={() => navigate("/driver-signup")}
                  />
                </div>
              </>
            } />

            <Route path="/loads/:id" element={
              <LoadDetailRouteInner
                cartItems={cartItems} loads={loads} orderIdMap={orderIdMap}
                addToCartMut={addToCartMut} removeFromCartMut={removeFromCartMut} cancelOrderMut={cancelOrderMut}
                lang={lang}
              />
            } />

            <Route path="/careers" element={<CareersPage theme={theme} session={session} onBack={() => navigate(-1)} />} />
            <Route path="/news"    element={<NewsPage theme={theme} session={session} onBack={() => navigate(-1)} onViewLoads={() => navigate("/")} onLoadDetail={(l) => navigate(`/loads/${l.id}`, { state: { load: l } })} />} />
            <Route path="/reviews" element={<ReviewsPage theme={theme} session={session} onBack={() => navigate(-1)} />} />
            <Route path="/fleet"   element={<FleetPage theme={theme} onBack={() => navigate(-1)} />} />
            <Route path="/faq"     element={<FaqPage theme={theme} onBack={() => navigate(-1)} />} />
            <Route path="/privacy" element={<PrivacyPage theme={theme} onBack={() => navigate(-1)} />} />
            <Route path="/pricing" element={<PricingSection theme={theme} standalone onBack={() => navigate(-1)} onQuoteClick={() => setShowQuote(true)} />} />
            <Route path="/driver-signup" element={<DriverSignupPage theme={theme} onBack={() => navigate(-1)} />} />

            <Route path="/profile" element={session
              ? <ProfilePage session={session} theme={theme} savedLoads={savedLoads} bookedLoads={bookedLoads} onBack={() => navigate(-1)} onBrowseLoads={() => navigate("/")} onLogout={handleLogout} onSessionUpdate={(name) => setSession(s => s ? { ...s, name } : s)} onDetails={(l) => navigate(`/loads/${l.id}`, { state: { load: l } })} onSaveRemove={(l) => handleSave(l, false)} onOrderCancel={(l) => handleCancelBook(l)} onTrack={(l) => { const orderId = orderIdMap.get(l.id); navigate(`/track/${orderId ?? 0}`, { state: { load: l } }); }} />
              : <Navigate to="/" replace />
            } />

            <Route path="/orders" element={session
              ? <OrdersPage orders={bookedLoads} theme={theme} onBack={() => navigate(-1)} onBrowseLoads={() => navigate("/")} onCancel={(l) => handleCancelBook(l)} onDetails={(l) => navigate(`/loads/${l.id}`, { state: { load: l } })} onTrack={(l) => { const orderId = orderIdMap.get(l.id); navigate(`/track/${orderId ?? 0}`, { state: { load: l } }); }} />
              : <Navigate to="/" replace />
            } />

            <Route path="/admin" element={session?.role === "Admin"
              ? <AdminPage theme={theme} onBack={() => navigate(-1)} />
              : <Navigate to="/" replace />
            } />

            <Route path="/track/:orderId" element={
              <TrackingRouteInner loads={loads} orderIdMap={orderIdMap} theme={theme} session={session} />
            } />

            <Route path="*" element={<NotFoundPage theme={theme} onBack={() => navigate(-1)} />} />
          </Routes>
        </Suspense>
      </div>

      {showFavorites && (
        <FavoritesPanel
          loads={savedLoads} theme={theme}
          onClose={() => setShowFavorites(false)}
          onDetails={(l) => { setShowFavorites(false); navigate(`/loads/${l.id}`, { state: { load: l } }); window.scrollTo({ top:0 }); }}
          onRemove={(l) => handleSave(l, false)}
        />
      )}
      {showRequests && (
        <RequestsPanel
          loads={bookedLoads} theme={theme}
          onClose={() => setShowRequests(false)}
          onDetails={(l) => { setShowRequests(false); navigate(`/loads/${l.id}`, { state: { load: l } }); window.scrollTo({ top:0 }); }}
          onCancel={(l) => handleCancelBook(l)}
          onBrowseLoads={() => { setShowRequests(false); navigate("/"); }}
        />
      )}
      {showCart && session && (
        <CartPanel
          session={session} theme={theme} loads={loads} cartItems={cartItems} apiBase={API_BASE}
          onClose={() => setShowCart(false)}
          onRemoveItem={handleRemoveFromCart}
          onCheckoutSuccess={handleCheckoutSuccess}
        />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} theme={theme} onSuccess={(s) => { setSession(s); setShowAuth(false); }} />}
      {showQuote && <QuoteModal onClose={() => setShowQuote(false)} theme={theme} />}

      {compareIds.length > 0 && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:1800, display:"flex", alignItems:"center", gap:12, background:theme==="dark"?"#111":"#fff", border:"1px solid rgba(204,0,0,0.45)", borderTop:"3px solid #CC0000", padding:"12px 20px", boxShadow:"0 8px 40px rgba(0,0,0,0.6)" }}>
          <style>{`@keyframes compareBarIn{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
          <div style={{ fontFamily:"'Anton',sans-serif", fontSize:10, letterSpacing:2, color:"#CC0000", textTransform:"uppercase", whiteSpace:"nowrap" }}>⊞ {compareIds.length}/3 {lang==="ru"?"ВЫБРАНО":"SELECTED"}</div>
          <div style={{ width:1, height:20, background:"rgba(204,0,0,0.25)" }} />
          {loads.filter(l => compareIds.includes(l.id)).map(l => (
            <div key={l.id} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(204,0,0,0.08)", border:"1px solid rgba(204,0,0,0.2)", padding:"4px 10px" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:11, color:textColor, whiteSpace:"nowrap" }}>{l.route.split(",")[0]}</span>
              <button onClick={() => setCompareIds(p => p.filter(id => id !== l.id))} style={{ background:"none", border:"none", color:"rgba(204,0,0,0.7)", cursor:"pointer", padding:0, fontSize:12 }}>✕</button>
            </div>
          ))}
          <button onClick={() => setShowCompare(true)} disabled={compareIds.length < 2} style={{ padding:"8px 18px", background:compareIds.length>=2?"#CC0000":"rgba(204,0,0,0.2)", border:"none", color:"#fff", fontFamily:"'Anton',sans-serif", fontSize:11, letterSpacing:2, textTransform:"uppercase", cursor:compareIds.length>=2?"pointer":"not-allowed" }}>
            {lang==="ru"?"СРАВНИТЬ →":"COMPARE →"}
          </button>
          <button onClick={() => setCompareIds([])} style={{ padding:"8px 12px", background:"transparent", border:"1px solid rgba(204,0,0,0.25)", color:textColor, fontFamily:"'Anton',sans-serif", fontSize:10, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>
            {lang==="ru"?"ОЧИСТИТЬ":"CLEAR"}
          </button>
        </div>
      )}

      {showCompare && compareIds.length >= 2 && (
        <CompareModal
          loads={loads.filter(l => compareIds.includes(l.id))} theme={theme}
          onClose={() => setShowCompare(false)}
          onBook={(l) => handleBook(l)}
          onDetails={(l) => { setShowCompare(false); navigate(`/loads/${l.id}`, { state: { load: l } }); window.scrollTo({ top:0 }); }}
          onRemove={(id) => { setCompareIds(p => { const next = p.filter(i => i !== id); if (next.length < 2) setShowCompare(false); return next; }); }}
          bookedIds={cartItems.map(i => i.productId)}
        />
      )}

      <div style={{ position:"fixed", bottom:28, left:28, zIndex:1500 }}>
        <style>{`@keyframes applyPulse{0%,100%{box-shadow:0 0 0 0 rgba(204,0,0,0.5),0 8px 28px rgba(204,0,0,0.4)}50%{box-shadow:0 0 0 10px rgba(204,0,0,0),0 8px 28px rgba(204,0,0,0.4)}}`}</style>
        <button
          onClick={() => navigate("/careers")}
          style={{ display:"flex", alignItems:"center", gap:10, background:"linear-gradient(135deg,#CC0000,#ff3333)", color:"#fff", border:"none", borderRadius:40, padding:"12px 22px 12px 16px", fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:13, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", animation:"applyPulse 2.5s ease infinite", whiteSpace:"nowrap" }}
          onMouseEnter={e => { e.currentTarget.style.animation="none"; e.currentTarget.style.transform="translateY(-3px) scale(1.04)"; }}
          onMouseLeave={e => { e.currentTarget.style.animation="applyPulse 2.5s ease infinite"; e.currentTarget.style.transform="none"; }}
        >
          <svg width="18" height="18" viewBox="0 0 256 256" fill="white"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM112,168H72a8,8,0,0,1,0-16h40a8,8,0,0,1,0,16Zm72-40H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Zm0-40H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Z"/></svg>
          {lang === "ru" ? "ВАКАНСИИ" : "APPLY NOW"}
        </button>
      </div>

      <ChatBot theme={theme} />
      <BackToTop />
      <MobileCallBar />
      <CookieConsent theme={theme} />
    </div>
  );
}

function LoadDetailRouteInner({ cartItems, loads, orderIdMap, addToCartMut, removeFromCartMut, cancelOrderMut, lang }: {
  cartItems: CartItemDto[]; loads: Load[]; orderIdMap: Map<number, number>;
  addToCartMut: ReturnType<typeof useAddToCart>; removeFromCartMut: ReturnType<typeof useRemoveFromCart>; cancelOrderMut: ReturnType<typeof useCancelOrder>;
  lang: string;
}) {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const load = (state as { load?: Load })?.load ?? loads.find(l => l.id === Number(id));
  if (!load) return <Navigate to="/" replace />;
  return (
    <Suspense fallback={<div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"70vh" }}><div style={{ width:36, height:36, border:"3px solid rgba(204,0,0,0.2)", borderTopColor:"#CC0000", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}>
      <LoadDetailPage
        load={load}
        isBooked={cartItems.some(i => i.productId === load.id)}
        onClose={() => navigate(-1)}
        onBook={(l) => { addToCartMut.mutate(l.id); toast.success(lang === "ru" ? "Добавлено в корзину" : "Added to cart"); }}
        onCancelBook={(l) => {
          const ci = cartItems.find(i => i.productId === l.id);
          if (ci) removeFromCartMut.mutate(ci.id);
          else { const oid = orderIdMap.get(l.id); if (oid) cancelOrderMut.mutate(oid); }
        }}
      />
    </Suspense>
  );
}

function TrackingRouteInner({ loads, orderIdMap, theme, session }: { loads: Load[]; orderIdMap: Map<number, number>; theme: string; session: ReturnType<typeof useSessionCtx>["session"]; }) {
  const { orderId } = useParams<{ orderId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const load = (state as { load?: Load })?.load ?? loads.find(l => orderIdMap.get(l.id) === Number(orderId));
  if (!load) return <Navigate to="/" replace />;
  return (
    <Suspense fallback={<div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"70vh" }}><div style={{ width:36, height:36, border:"3px solid rgba(204,0,0,0.2)", borderTopColor:"#CC0000", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} /></div>}>
      <TrackingPage load={load} theme={theme} orderId={Number(orderId)} session={session} apiBase={API_BASE} onBack={() => navigate(-1)} />
    </Suspense>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ConfirmDialogProvider>
          <AppContent />
          <Toaster
            position="bottom-right"
            toastOptions={{ style: { background:"#0d0d0d", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", fontFamily:"'Barlow',sans-serif" } }}
            richColors
          />
        </ConfirmDialogProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
