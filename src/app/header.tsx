"use client";

import { easeInOut, motion, useScroll, useTransform } from "framer-motion";

export const Header = () => {
  const { scrollY } = useScroll();
  const top = useTransform(scrollY, [0, 400], ["50%", "0%"], {
    ease: easeInOut,
  });
  const translateY = useTransform(scrollY, [0, 400], ["-50%", "0%"], {
    ease: easeInOut,
  });
  const left = useTransform(scrollY, [400, 700], ["50%", "0%"], {
    ease: easeInOut,
  });
  const translateX = useTransform(scrollY, [400, 700], ["-50%", "0%"], {
    ease: easeInOut,
  });

  return (
    <>
      <header className="pointer-events-none fixed top-0 z-50 flex w-full touch-none justify-center px-4 py-4">
        <div className="relative h-svh max-h-[1024px] min-h-20 w-full w-full max-w-sm">
          <motion.div
            style={{
              position: "absolute",
              top,
              translateY,
              left,
              translateX,
            }}
            className="pointer-events-auto flex origin-center touch-auto items-center"
          >
            {"yoshikouki".split("").map((char, index) => (
              <motion.span
                initial={{ visibility: "hidden", width: 0 }}
                animate={{ visibility: "visible", width: "auto" }}
                transition={{
                  delay: 1 + index * 0.1,
                  duration: 0,
                }}
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={`${char}-${index}`}
              >
                {char}
              </motion.span>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.5,
                ease: "anticipate",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
              }}
              style={{
                marginLeft: "0.1rem",
                width: 1,
                height: "1rem",
              }}
              className="bg-border"
            />
          </motion.div>
        </div>
      </header>
      <div className="h-svh max-h-[1024px] min-h-20 w-full" />
    </>
  );
};
