import React, { useCallback, useEffect, useRef, useState } from "react";

const DURATION = 3000;
const EXIT_MS  = 300;

const CSS = `
@keyframes ntf-in  { from{opacity:0;transform:translateX(110%)} to{opacity:1;transform:translateX(0)} }
@keyframes ntf-out { from{opacity:1;transform:translateX(0)}     to{opacity:0;transform:translateX(110%)} }
@keyframes ntf-bar { from{width:100%} to{width:0%} }
`;

export interface NotifItem {
  id: number;
  text: string;
}

interface NotifProps {
  item: NotifItem;
  index: number;
  onClose: (id: number) => void;
}

export const Notification: React.FC<NotifProps> = ({ item, index, onClose }) => {
  const [exiting, setExiting] = useState(false);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onCloseRef.current(item.id), EXIT_MS);
  }, [item.id]);

  useEffect(() => {
    const t = setTimeout(dismiss, DURATION);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{CSS}</style>
      <div
        style={{
          position: "fixed",
          bottom: 24 + index * 74,
          right: 24,
          minWidth: 260,
          maxWidth: 360,
          background: "rgba(12,12,12,0.96)",
          color: "#fff",
          borderRadius: 8,
          boxShadow: "0 8px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)",
          fontFamily: "'Barlow',sans-serif",
          fontSize: 14,
          zIndex: 5000,
          overflow: "hidden",
          animation: exiting
            ? `ntf-out ${EXIT_MS}ms ease forwards`
            : "ntf-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards",
          transition: "bottom 0.28s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Red left accent */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
          background: "#CC0000", borderRadius: "8px 0 0 8px",
        }} />

        {/* Content row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "13px 12px 12px 18px" }}>
          <span style={{ flex: 1, lineHeight: 1.45 }}>{item.text}</span>
          <button
            onClick={dismiss}
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.35)", cursor: "pointer",
              padding: "0 2px", fontSize: 14, lineHeight: 1,
              flexShrink: 0, marginTop: 1, transition: "color 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; }}
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.07)" }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg,#CC0000,#ff4444)",
            animation: `ntf-bar ${DURATION}ms linear forwards`,
            animationPlayState: exiting ? "paused" : "running",
          }} />
        </div>
      </div>
    </>
  );
};
