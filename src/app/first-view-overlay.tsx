"use client";

import { type AnimationProps, type MotionStyle, motion } from "framer-motion";
import { useState } from "react";

export const FirstViewOverlay = ({
  children,
  style,
  ...props
}: AnimationProps & {
  children: React.ReactNode;
  style?: MotionStyle;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;

  return (
    <motion.div
      style={style}
      onAnimationComplete={() => setIsVisible(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
