import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { PhoneIcon } from "./PhoneIcon";

interface MobileCallBarProps {
  phone?: string;
}

export const MobileCallBar: React.FC<MobileCallBarProps> = ({ phone = "+17862026599" }) => {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkMobile = () => setVisible(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const label = lang === "ru" ? "Позвонить диспетчеру" : "Call Dispatcher";
  const formatted = lang === "ru" ? "+1 786-202-6599" : "+1 786-202-6599";

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      padding: "10px 16px 10px",
      background: "rgba(10,10,10,0.97)",
      borderTop: "1px solid rgba(204,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      gap: 12,
      transform: scrolled ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.35s ease",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
    }}>
      <a
        href={`tel:${phone}`}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "#CC0000",
          borderRadius: 6,
          padding: "13px 0",
          textDecoration: "none",
          boxShadow: "0 4px 18px rgba(204,0,0,0.45)",
        }}
      >
        <PhoneIcon size={18} color="#fff" />
        <span style={{
          fontFamily: "'Barlow',sans-serif",
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: "#fff",
        }}>
          {label}
        </span>
      </a>
      <a
        href={`tel:${phone}`}
        style={{
          fontFamily: "'Barlow',sans-serif",
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
          textDecoration: "none",
          letterSpacing: 0.5,
          flexShrink: 0,
          lineHeight: 1.4,
          textAlign: "center",
        }}
      >
        {formatted}
      </a>
    </div>
  );
};
