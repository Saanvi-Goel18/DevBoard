import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const PageWrapper = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
