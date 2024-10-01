"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const Parallax = ({
  children,
  distance,
  className,
}: { children: React.ReactNode; distance: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, distance]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};
