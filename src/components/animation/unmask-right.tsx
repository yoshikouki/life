import * as motion from "framer-motion/client";

export const UnmaskRight = ({
  children,
  repeat = false,
}: {
  children: React.ReactNode;
  repeat?: boolean;
}) => {
  const repeatOption = repeat
    ? {
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
      }
    : {};
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
        }}
        transition={{
          duration: 0,
          delay: 0.1,
          ease: "easeInOut",
          ...repeatOption,
        }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-foreground text-background"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{
          clipPath: [
            "inset(0 100% 0 0)",
            "inset(0 0 0 0)",
            "inset(0 0 0 0)",
            "inset(0 0 0 100%)",
          ],
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          ...repeatOption,
        }}
        viewport={{ once: true }}
      />
    </div>
  );
};
