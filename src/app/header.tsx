"use client";

import { Typing } from "@/components/animattion/typing";
import { easeInOut, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

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
  const color = useTransform(
    scrollY,
    [400, 700],
    ["hsl(12 6.5% 35.1%)", "hsl(24 5.4% 63.9%)"],
    {
      ease: easeInOut,
    },
  );

  return (
    <>
      <header className="pointer-events-none fixed top-0 z-50 flex w-full touch-none justify-center">
        <div className="relative flex h-svh min-h-20 w-full max-w-sm justify-end">
          {/* Logo */}
          <motion.div
            style={{
              position: "absolute",
              top,
              translateY,
              left,
              translateX,
            }}
            className="pointer-events-auto flex h-14 touch-auto items-center px-4 text-base"
          >
            <Typing cursorClassName="h-4 ml-[2px]" loop>
              yoshikouki
            </Typing>
          </motion.div>

          {/* Nav */}
          <motion.nav
            style={{ color }}
            className="pointer-events-auto flex h-14 touch-auto items-stretch text-base"
          >
            <Link href="/canvas" className="flex items-center px-4">
              Canvas
            </Link>
          </motion.nav>
        </div>
      </header>
      <div className="flex h-svh min-h-20 w-full items-end justify-center">
        <div className="relative h-12 w-[1px] rounded-full bg-border opacity-30">
          <motion.div
            animate={{ y: [0, 30, 50], height: [4, 20, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="absolute w-[1px] rounded-full bg-foreground"
          />
        </div>
      </div>
    </>
  );
};
