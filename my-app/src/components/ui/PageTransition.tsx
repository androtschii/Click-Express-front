import { motion } from "framer-motion";
import type { ReactNode } from "react";

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
};

interface PageTransitionProps {
  children: ReactNode;
  id?: string;
}

export function PageTransition({ children, id }: PageTransitionProps) {
  return (
    <motion.div
      key={id}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}
