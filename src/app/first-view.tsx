import * as motion from "framer-motion/client";
import { FirstViewOverlay } from "./first-view-overlay";

export const FirstView = () => {
  return (
    <FirstViewOverlay
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        delay: 2,
        duration: 0.5,
      }}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <div className="flex items-center justify-center">
        {"yoshikouki".split("").map((char, index) => (
          <motion.span
            initial={{ visibility: "hidden", width: 0 }}
            animate={{ visibility: "visible", width: "auto" }}
            transition={{
              delay: index * 0.1,
              duration: 0,
            }}
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={`${char}-${index}`}
          >
            {char}
          </motion.span>
        ))}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "anticipate",
            repeat: 5,
            repeatType: "mirror",
          }}
          style={{
            marginLeft: "0.1rem",
            width: 1,
            height: "1rem",
            backgroundColor: "hsl(12 6.5% 55.1%)",
          }}
        />
      </div>
    </FirstViewOverlay>
  );
};
