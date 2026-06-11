import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  style?: CSSProperties;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  y = 20,
  style,
  className,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "opacity, transform", ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  style?: CSSProperties;
}

export function Stagger({ children, staggerDelay = 0.08, style }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
      }}
      style={{ willChange: "opacity, transform", ...style }}
    >
      {children}
    </motion.div>
  );
}
