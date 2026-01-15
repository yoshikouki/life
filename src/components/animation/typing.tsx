"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const Typing = ({
  children,
  typingSpeed = 0.1,
  delayStart = 0,
  cursorDuration = 0.5,
  loop = false,
  className = "",
  cursorClassName = "",
  repeat = false,
}: {
  children: string;
  typingSpeed?: number;
  delayStart?: number;
  cursorDuration?: number;
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
  repeat?: boolean;
}) => {
  const chars = children.split("");
  const typingDuration = delayStart + chars.length * typingSpeed;
  const calculateLoopCount = () => {
    if (loop) {
      return Number.POSITIVE_INFINITY;
    }
    const baseCycles = Math.ceil(typingDuration / cursorDuration);
    const isEven = baseCycles % 2 === 0;
    return isEven ? baseCycles + 3 : baseCycles + 2;
  };
  const loopCount = calculateLoopCount();

  const repeatOption = repeat
    ? {
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
      }
    : {};

  return (
    <div className={cn("flex h-full items-center", className)}>
      {chars.map((char, index) => (
        <motion.span
          initial={{ visibility: "hidden", width: 0 }}
          // biome-ignore lint/suspicious/noArrayIndexKey: Index is needed for character position
          key={`${char}-${index}`}
          transition={{
            delay: delayStart + index * typingSpeed,
            duration: 0,
            ...repeatOption,
          }}
          viewport={{ once: !repeat }}
          whileInView={{ visibility: "visible", width: "auto" }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className={cn("ml-[2px] h-full bg-border", cursorClassName)}
        initial={{ opacity: 0 }}
        style={{
          width: "0.1rem",
        }}
        transition={{
          duration: cursorDuration,
          ease: "anticipate",
          repeat: loopCount,
          repeatType: "mirror",
        }}
        viewport={{ once: true }}
        whileInView={{
          opacity: 1,
        }}
      />
    </div>
  );
};
