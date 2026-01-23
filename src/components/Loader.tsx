import { motion } from 'framer-motion';

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({ isLoading }: LoaderProps) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-[#0B0F14] flex items-center justify-center"
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-3xl font-heading font-black tracking-wider text-[#E6C15A]">
          LOADING TABLE...
        </h2>
      </motion.div>
    </motion.div>
  );
};

export default Loader;

