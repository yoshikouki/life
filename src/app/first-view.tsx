import * as motion from "framer-motion/client";

export const FirstView = () => {
  return (
    <motion.div
      initial={{
        height: "100svh",
        backgroundColor: "hsla(20, 14.3%, 4.1%, 1)",
      }}
      animate={{ height: "100%", backgroundColor: "hsla(20, 14.3%, 4.1%, 0)" }}
      transition={{
        delay: 2,
        duration: 0.3,
        ease: "easeInOut",
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        width: "100vw",
      }}
    >
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "auto" }}
        transition={{
          delay: 2,
          duration: 0.3,
          ease: "easeInOut",
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div layout className="flex items-center">
          {"yoshikouki".split("").map((char, index) => (
            <motion.div
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
            </motion.div>
          ))}
          <motion.div
            animate={{
              opacity: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            }}
            transition={{
              duration: 4,
              ease: "anticipate",
              repeatType: "mirror",
            }}
            style={{
              marginLeft: "0.1rem",
              opacity: 0,
              width: 1,
              height: "1rem",
              backgroundColor: "hsl(12 6.5% 55.1%)",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
