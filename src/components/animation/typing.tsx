import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";

export const Typing = ({
  children,
  typingSpeed = 0.1,
  delayStart = 0,
  cursorDuration = 0.5,
  loop = false,
  className = "",
  cursorClassName = "",
}: {
  children: string;
  typingSpeed?: number;
  delayStart?: number;
  cursorDuration?: number;
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
}) => {
  const chars = children.split("");
  const typingDuration = delayStart + chars.length * typingSpeed;
  const loopCount = loop
    ? Number.POSITIVE_INFINITY
    : Math.ceil(typingDuration / cursorDuration) % 2 === 0
      ? Math.ceil(typingDuration / cursorDuration) + 3
      : Math.ceil(typingDuration / cursorDuration) + 2;

  return (
    <div className={cn("flex h-full items-center", className)}>
      {chars.map((char, index) => (
        <motion.span
          initial={{ visibility: "hidden", width: 0 }}
          whileInView={{ visibility: "visible", width: "auto" }}
          transition={{
            delay: delayStart + index * typingSpeed,
            duration: 0,
          }}
          viewport={{ once: true }}
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
        className={cn("ml-1 h-full bg-border", cursorClassName)}
      />
    </div>
  );
};
