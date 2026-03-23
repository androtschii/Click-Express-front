import React, { useEffect } from "react";

interface NotificationProps {
  text: string;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ text, onClose }) => {
  useEffect(() => {
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 6,
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        fontFamily: "'Barlow',sans-serif",
        fontSize: 14,
        zIndex: 5000,
      }}
    >
      {text}
    </div>
  );
};
