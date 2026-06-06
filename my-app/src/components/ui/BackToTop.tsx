import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "@phosphor-icons/react";

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          whileHover={{ scale: 1.1, y: -3, boxShadow: "0 8px 28px rgba(204,0,0,0.65)" }}
          whileTap={{ scale: 0.93 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed", bottom: 90, right: 28,
            width: 50, height: 50, borderRadius: "50%",
            border: "none", cursor: "pointer",
            background: "#CC0000",
            boxShadow: "0 4px 16px rgba(204,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1200,
          }}
        >
          <ArrowUp size={22} weight="bold" color="#fff" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
