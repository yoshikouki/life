"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

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
  const loopCount = loop
    ? Number.POSITIVE_INFINITY
    : Math.ceil(typingDuration / cursorDuration) % 2 === 0
      ? Math.ceil(typingDuration / cursorDuration) + 3
      : Math.ceil(typingDuration / cursorDuration) + 2;

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
          whileInView={{ visibility: "visible", width: "auto" }}
          transition={{
            delay: delayStart + index * typingSpeed,
            duration: 0,
            ...repeatOption,
          }}
          viewport={{ once: !repeat }}
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={`${char}-${index}`}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
        }}
        transition={{
          duration: cursorDuration,
          ease: "anticipate",
          repeat: loopCount,
          repeatType: "mirror",
        }}
        viewport={{ once: true }}
        style={{
          width: "0.1rem",
        }}
        className={cn("ml-[2px] h-full bg-border", cursorClassName)}
      />
    </div>
  );
};
