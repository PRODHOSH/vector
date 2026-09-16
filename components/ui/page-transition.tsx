"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Shared animation variants
export const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/** Wraps a page section in a fade-up entrance animation */
export function PageTransition({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered grid container */
export function StaggerGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Individual animated card inside StaggerGrid */
export function AnimatedCard({ children, className = "", ...props }: React.ComponentProps<typeof motion.div> & { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={cardVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}
