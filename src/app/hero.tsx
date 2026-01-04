"use client";

import { HeaderContainer, HeaderLogo, HeaderNav } from "@/components/header";
import { easeInOut, motion, useScroll, useTransform } from "framer-motion";

export const Hero = () => {
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
      <HeaderContainer className="relative flex h-svh justify-end">
        <motion.div
          style={{
            position: "absolute",
            top,
            translateY,
            left,
            translateX,
          }}
        >
          <HeaderLogo />
        </motion.div>

        {/* Nav */}
        <motion.div style={{ color }}>
          <HeaderNav className="" />
        </motion.div>
      </HeaderContainer>

      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div className="relative h-12 w-px rounded-full bg-border opacity-30">
          <motion.div
            animate={{ y: [0, 30, 50], height: [4, 20, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="absolute w-px rounded-full bg-foreground"
          />
        </div>
      </div>
    </>
  );
};
