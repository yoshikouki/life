"use client";

import { type HTMLMotionProps, motion } from "motion/react";

export const SlideUp = ({
  children,
  repeat = false,
}: {
  children: React.ReactNode;
  repeat?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">) => {
  const repeatOption = repeat
    ? {
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
      }
    : {};
  return (
    <motion.div
      initial={{ opacity: 0, y: "50%" }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ...repeatOption,
      }}
    >
      {children}
    </motion.div>
  );
};
