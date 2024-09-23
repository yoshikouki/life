import * as motion from "framer-motion/client";

export const SlideUp = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  );
};
