import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass rounded-full px-4 md:px-6 py-3 flex items-center justify-between gap-4 md:gap-8 w-[90%] md:min-w-[600px] md:max-w-[800px]">
        {/* Logo */}
        <a href="#" className="font-heading text-lg font-black tracking-tight">
          <span className="text-[#F5F7FA]">Eight</span>
          <span className="text-[#E6C15A]">Ball</span>
        </a>

        {/* Right side CTA */}
        <Button
          size="sm"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative overflow-hidden
            bg-gradient-to-r from-[#E6C15A] to-[#E6C15A]/80
            text-[#0B0F14] font-heading font-black text-sm tracking-wider
            hover:from-[#E6C15A] hover:to-[#E6C15A]
            transition-all duration-300
            ${isHovered ? 'gold-glow' : ''}
          `}
        >
          Play Now
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
