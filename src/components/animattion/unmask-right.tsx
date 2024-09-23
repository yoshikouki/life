import * as motion from "framer-motion/client";

export const UnmaskRight = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
        }}
        transition={{ duration: 0, delay: 0.1, ease: "easeInOut" }}
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
        transition={{ duration: 0.3, ease: "easeInOut" }}
        viewport={{ once: true }}
      />
    </div>
  );
};
