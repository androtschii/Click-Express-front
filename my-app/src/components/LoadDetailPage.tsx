import React, { useState, useEffect, useRef } from "react";
import type { Load } from "../types/index";

interface LoadDetailPageProps {
  load: Load;
  theme?: "dark" | "light";
  isBooked?: boolean;
  onClose: () => void;
  onBook: (load: Load) => void;
  onCancelBook: (load: Load) => void;
}

function driveTime(miles: number) {
  const h = Math.floor(miles / 55);
  const m = Math.round(((miles / 55) - h) * 60);
  return `${h}h ${m}m`;
}

function ppm(price: number, miles: number) {
  return (price / miles).toFixed(2);
}

function mapUrl(from: string, to: string) {
  return `https://maps.google.com/maps?saddr=${encodeURIComponent(from)}&daddr=${encodeURIComponent(to)}&output=embed&t=k`;
}

const CARGO_DESC: Record<string, string> = {
  "Flatbed / Oversized": "Oversized freight requiring open flatbed trailer. Special permits may apply. Escort vehicles required for loads exceeding legal dimensions. Secure tie-down points must be verified prior to departure.",
  "Flatbed / Steel": "Steel coils, plates or beams loaded on a standard flatbed. Requires edge protectors and heavy-duty strapping. Tarp protection recommended to prevent surface oxidation during transport.",
  "Military Load": "Classified military equipment with mandatory escort. Driver must possess valid federal clearance. Strict route pre-approval and delivery coordination with base logistics officer required.",
  "Flatbed / Heavy Machinery": "Heavy construction or industrial machinery. Wide-load permit required. Low-clearance route planning essential. Hydraulic detachable lowboy trailer preferred for oversized height.",
  "Flatbed / Equipment": "Miscellaneous construction or agricultural equipment. Standard flatbed with ramp loading. Weight distributed across axles per DOT regulations.",
  "Flatbed / Construction": "Construction materials including lumber, rebar and prefab panels. Tarping strongly recommended. Multiple delivery stops possible along the route.",
  "Stepdeck / Partial": "Partial load on stepdeck trailer. Freight height exceeds standard flatbed allowance. Remaining deck available for co-load — contact dispatch for details.",
  "Flatbed / Pipes": "Steel pipe bundles secured with chains and binders. Headboard required. Weight concentrated at front — careful axle distribution mandatory per DOT limits.",
  "Flatbed / Heavy Equipment": "Heavy earthmoving or mining equipment. Multi-axle lowboy trailer with hydraulic ramps. Crane or fork required at both origin and destination.",
  "Flatbed / Multi-Stop": "Multi-stop delivery route with partial drops en route. Confirmed delivery windows required at each stop. Detailed manifest provided at dispatch.",
  "Flatbed / Steel Beams": "Structural steel I-beams for bridge or building construction. Length may exceed 53 ft — overhang flags and permits required. Unloading crane must be on-site.",
};

function cargoDesc(cargo: string, type: string) {
  return CARGO_DESC[cargo] || `${type} freight shipment. Standard safety and DOT compliance requirements apply. Contact dispatch for specific load details.`;
}

function truckEmoji(cargo: string) {
  if (cargo.includes("Military")) return "🪖";
  if (cargo.includes("Partial")) return "📦";
  if (cargo.includes("Pipe") || cargo.includes("Steel Beam")) return "⚙️";
  if (cargo.includes("Machinery") || cargo.includes("Equipment")) return "🏗️";
  return "🚛";
}

export const LoadDetailPage: React.FC<LoadDetailPageProps> = ({
  load, theme = "dark", isBooked = false, onClose, onBook, onCancelBook,
}) => {
  const isDark = theme === "dark";
  const [entered, setEntered] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [booked, setBooked] = useState(isBooked);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
    topRef.current?.scrollIntoView({ behavior: "auto" });
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  // sync if parent changes
  useEffect(() => { setBooked(isBooked); }, [isBooked]);

  const handleBook = () => {
    if (booked) {
      setBooked(false);
      onCancelBook(load);
    } else {
      setBooked(true);
      onBook(load);
    }
  };

  const bg    = isDark ? "#080808" : "#f4f4f4";
  const card  = isDark ? "#111"    : "#fff";
  const bord  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const text  = isDark ? "#fff"    : "#111";
  const muted = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)";

  const stats = [
    { label: "Total Price",  value: `$${load.price.toLocaleString()}`, color: "#CC0000", big: true },
    { label: "Distance",     value: `${load.miles.toLocaleString()} mi`, color: text },
    { label: "Drive Time",   value: driveTime(load.miles), color: text },
    { label: "Rate / Mile",  value: `$${ppm(load.price, load.miles)}`, color: "#00b450" },
    { label: "Load Type",    value: load.type, color: text },
    { label: "Trailer",      value: load.cargo.split("/")[0].trim(), color: text },
  ];

  return (
    <div ref={topRef} style={{
      minHeight: "100vh",
      background: bg,
      opacity: entered ? 1 : 0,
      transform: entered ? "none" : "translateY(24px)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
    }}>
      <style>{`
        @keyframes detailFadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        .stat-card { transition: all 0.2s; }
        .stat-card:hover { border-color: rgba(204,0,0,0.5) !important; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .detail-scroll::-webkit-scrollbar { width: 5px; }
        .detail-scroll::-webkit-scrollbar-thumb { background: rgba(204,0,0,0.4); border-radius: 3px; }
      `}</style>

      {/* ── Top nav bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: isDark ? "rgba(8,8,8,0.95)" : "rgba(244,244,244,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${bord}`,
        padding: "0 clamp(16px,4vw,48px)",
        height: 60,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <button
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: `1px solid ${bord}`,
            borderRadius: 20, padding: "7px 16px",
            color: muted, fontFamily: "'Barlow',sans-serif",
            fontWeight: 600, fontSize: 12, letterSpacing: 1,
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#CC0000"; e.currentTarget.style.color = "#CC0000"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = bord; e.currentTarget.style.color = muted; }}
        >
          ← All Loads
        </button>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
          <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, whiteSpace:"nowrap" }}>
            Load #{load.id}
          </span>
          <span style={{ color: bord }}>·</span>
          <span style={{
            fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
          }}>
            {load.route} → {load.dest}
          </span>
        </div>

        {load.tag && (
          <div style={{
            background: load.tag === "Military Load" ? "#1a3a6b" : "#CC0000",
            color: "#fff", padding: "4px 12px", borderRadius: 20,
            fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:9,
            letterSpacing:1.5, textTransform:"uppercase", whiteSpace:"nowrap", flexShrink: 0,
          }}>
            {load.tag}
          </div>
        )}
      </div>

      {/* ── Hero banner ── */}
      <div style={{ position: "relative", height: "clamp(260px,35vw,420px)", overflow: "hidden" }}>
        <img
          src={load.image} alt={load.route}
          style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.45)" }}
        />
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 60%, rgba(8,8,8,1) 100%)",
        }} />

        <div style={{
          position:"absolute", bottom:"clamp(28px,5vw,56px)",
          left:"clamp(20px,5vw,80px)", right:"clamp(20px,5vw,80px)",
          animation:"detailFadeUp 0.5s ease 0.1s both",
        }}>
          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:2.5, textTransform:"uppercase", marginBottom:8 }}>
            {truckEmoji(load.cargo)} {load.cargo}
          </div>
          <h1 style={{
            fontFamily:"'Oswald',sans-serif", fontWeight:700,
            fontSize:"clamp(28px,5vw,54px)", color:"#fff",
            lineHeight:1.1, margin:0,
          }}>
            {load.route}
            <span style={{ color:"#CC0000", margin:"0 16px" }}>→</span>
            {load.dest}
          </h1>
          <div style={{ display:"flex", gap:12, marginTop:14, flexWrap:"wrap" }}>
            <span style={{ background:"rgba(204,0,0,0.9)", color:"#fff", fontFamily:"'Barlow',sans-serif", fontWeight:800, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", padding:"5px 14px", borderRadius:4 }}>
              {load.type}
            </span>
            <span style={{ background:"rgba(0,0,0,0.5)", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.15)", fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:11, padding:"5px 14px", borderRadius:4, backdropFilter:"blur(6px)" }}>
              {load.miles.toLocaleString()} miles · {driveTime(load.miles)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"clamp(24px,4vw,56px) clamp(16px,4vw,48px) 80px" }}>

        {/* Stats row */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",
          gap:12, marginBottom:32,
          animation:"detailFadeUp 0.5s ease 0.15s both",
        }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card" style={{
              background:card, border:`1px solid ${bord}`, borderRadius:12,
              padding:"18px 20px", cursor:"default",
            }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:s.big?26:18, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Two-column layout below */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr clamp(280px,35%,400px)", gap:24, alignItems:"start" }}>

          {/* Left column */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* Route line */}
            <div style={{ background:card, border:`1px solid ${bord}`, borderRadius:14, padding:"24px 28px", animation:"detailFadeUp 0.5s ease 0.2s both" }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:2, textTransform:"uppercase", marginBottom:18 }}>Route</div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                {/* Origin */}
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:"#CC0000", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>Origin</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <div style={{ width:12, height:12, borderRadius:"50%", border:"2.5px solid #CC0000", flexShrink:0 }} />
                    <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:16, color:text }}>{load.route}</div>
                  </div>
                </div>

                {/* Arrow + distance */}
                <div style={{ flex:2, textAlign:"center" }}>
                  <div style={{ fontSize:11, color:"#CC0000", fontFamily:"'Barlow',sans-serif", fontWeight:700, marginBottom:6 }}>
                    {load.miles.toLocaleString()} mi · {driveTime(load.miles)}
                  </div>
                  <div style={{ height:2, background:`linear-gradient(90deg, #CC0000, rgba(204,0,0,0.2), #CC0000)`, borderRadius:2, position:"relative" }}>
                    <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", fontSize:18 }}>🚛</div>
                  </div>
                </div>

                {/* Dest */}
                <div style={{ flex:1, textAlign:"right" }}>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:"#CC0000", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>Destination</div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8, marginBottom:4 }}>
                    <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:16, color:text }}>{load.dest}</div>
                    <div style={{ width:12, height:12, borderRadius:"50%", background:"#CC0000", flexShrink:0 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div style={{ background:card, border:`1px solid ${bord}`, borderRadius:14, overflow:"hidden", animation:"detailFadeUp 0.5s ease 0.25s both" }}>
              <div style={{ padding:"12px 18px", borderBottom:`1px solid ${bord}`, display:"flex", alignItems:"center", gap:8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#CC0000">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, flex:1 }}>Route Map</span>
                <a
                  href={`https://www.google.com/maps/dir/${encodeURIComponent(load.route)}/${encodeURIComponent(load.dest)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#CC0000", textDecoration:"none", fontWeight:600 }}
                >
                  Open in Maps ↗
                </a>
              </div>
              <div style={{ position:"relative", height:340, background:isDark?"#1a1a1a":"#e8e8e8" }}>
                {!mapLoaded && (
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, zIndex:1 }}>
                    <div style={{ width:32, height:32, border:"3px solid rgba(204,0,0,0.2)", borderTop:"3px solid #CC0000", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                    <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:muted }}>Loading map...</span>
                  </div>
                )}
                <iframe
                  title="route-map" width="100%" height="340"
                  style={{ border:0, display:"block" }}
                  loading="lazy"
                  onLoad={() => setMapLoaded(true)}
                  src={mapUrl(load.route, load.dest)}
                  allowFullScreen
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ background:card, border:`1px solid ${bord}`, borderRadius:14, padding:"24px 28px", animation:"detailFadeUp 0.5s ease 0.3s both" }}>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Load Description</div>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:isDark?"rgba(255,255,255,0.68)":"rgba(0,0,0,0.62)", lineHeight:1.8, margin:0 }}>
                {cargoDesc(load.cargo, load.type)}
              </p>
            </div>

            {/* Requirements grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, animation:"detailFadeUp 0.5s ease 0.35s both" }}>
              {[
                { icon:"🪪", label:"CDL Required", desc:"Class A CDL with Flatbed endorsement" },
                { icon:"📋", label:load.tag==="Military Load"?"Federal Clearance":"Permits", desc:load.tag==="Military Load"?"TWIC + federal clearance required":"Standard DOT oversize permits" },
                { icon:"⚖️", label:"Gross Weight", desc:`~${(load.miles * 0.04 + 40).toFixed(0)},000 lbs estimated` },
                { icon:"📅", label:"Availability", desc:"Ready for immediate pickup" },
              ].map(r => (
                <div key={r.label} style={{ background:card, border:`1px solid ${bord}`, borderRadius:12, padding:"16px 18px", display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ fontSize:22, lineHeight:1 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, marginBottom:4 }}>{r.label}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — sticky booking card */}
          <div style={{ position:"sticky", top:76 }}>
            <div style={{
              background:card, border:`1px solid ${bord}`, borderRadius:16,
              overflow:"hidden", animation:"detailFadeUp 0.5s ease 0.2s both",
              boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.12)",
            }}>
              {/* Price header */}
              <div style={{ background:"linear-gradient(135deg,#CC0000,#ff4d4d)", padding:"24px 24px 20px" }}>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, color:"rgba(255,255,255,0.6)", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>Total Rate</div>
                <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:40, color:"#fff", lineHeight:1 }}>
                  ${load.price.toLocaleString()}
                </div>
                <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:12, color:"rgba(255,255,255,0.65)", marginTop:6 }}>
                  ${ppm(load.price, load.miles)} per mile · {load.miles.toLocaleString()} mi
                </div>
              </div>

              {/* Details */}
              <div style={{ padding:"20px 24px" }}>
                {[
                  { l:"Route", v:`${load.route} → ${load.dest}` },
                  { l:"Cargo", v:load.cargo },
                  { l:"Type", v:load.type },
                  { l:"Drive Time", v:driveTime(load.miles) },
                ].map(row => (
                  <div key={row.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, gap:8 }}>
                    <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, whiteSpace:"nowrap" }}>{row.l}</span>
                    <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, color:text, textAlign:"right" }}>{row.v}</span>
                  </div>
                ))}

                <div style={{ height:1, background:bord, margin:"6px 0 18px" }} />

                {/* Dispatch */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Dispatch</div>
                  <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:20, color:text }}>+1 786-202-6599</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:muted, marginTop:2 }}>24 / 7 · Mon–Sun</div>
                </div>

                {/* Call button */}
                <a
                  href="tel:+17862026599"
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                    width:"100%", padding:"11px", marginBottom:10,
                    background:isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)",
                    border:`1px solid ${bord}`, borderRadius:8,
                    color:text, fontFamily:"'Oswald',sans-serif", fontWeight:600,
                    fontSize:13, letterSpacing:1.5, textTransform:"uppercase",
                    textDecoration:"none", transition:"all 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#CC0000"; (e.currentTarget as HTMLElement).style.color="#CC0000"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=bord; (e.currentTarget as HTMLElement).style.color=text; }}
                >
                  📞 Call Dispatch
                </a>

                {/* Book / Cancel button */}
                <button
                  onClick={handleBook}
                  style={{
                    width:"100%", padding:"13px",
                    background: booked
                      ? "rgba(0,180,80,0.12)"
                      : "linear-gradient(135deg,#CC0000,#ff4d4d)",
                    border: booked ? "1px solid rgba(0,180,80,0.4)" : "none",
                    borderRadius:8, cursor:"pointer",
                    color: booked ? "#00b450" : "#fff",
                    fontFamily:"'Oswald',sans-serif", fontWeight:700,
                    fontSize:14, letterSpacing:2, textTransform:"uppercase",
                    boxShadow: booked ? "none" : "0 6px 20px rgba(204,0,0,0.4)",
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e => {
                    if (!booked) { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(204,0,0,0.5)"; }
                    else { e.currentTarget.style.background="rgba(204,0,0,0.12)"; e.currentTarget.style.color="#CC0000"; e.currentTarget.style.borderColor="rgba(204,0,0,0.4)"; }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform="none";
                    e.currentTarget.style.boxShadow = booked ? "none" : "0 6px 20px rgba(204,0,0,0.4)";
                    e.currentTarget.style.background = booked ? "rgba(0,180,80,0.12)" : "linear-gradient(135deg,#CC0000,#ff4d4d)";
                    e.currentTarget.style.color = booked ? "#00b450" : "#fff";
                    e.currentTarget.style.borderColor = booked ? "rgba(0,180,80,0.4)" : "transparent";
                  }}
                >
                  {booked ? "✕ CANCEL REQUEST" : "✓ BOOK THIS LOAD"}
                </button>

                {booked && (
                  <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:"#00b450", textAlign:"center", marginTop:10 }}>
                    ✓ Request sent · Dispatch will contact you shortly
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
