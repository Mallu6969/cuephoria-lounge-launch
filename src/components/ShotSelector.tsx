import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShotType {
  id: string;
  title: string;
  description: string;
}

const shotTypes: ShotType[] = [
  {
    id: 'break',
    title: 'Break Shot',
    description: 'High power opening strike to scatter the table and control the tempo.',
  },
  {
    id: 'bank',
    title: 'Bank Shot',
    description: 'Precision geometry to convert indirect angles into guaranteed points.',
  },
  {
    id: 'spin',
    title: 'Spin Control',
    description: 'Advanced cue control for position play and next-shot dominance.',
  },
];

interface ChalkParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

const ShotSelector = () => {
  const [activeShot, setActiveShot] = useState<ShotType | null>(null);
  const [chalkParticles, setChalkParticles] = useState<ChalkParticle[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const spawnChalkParticles = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newParticles: ChalkParticle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
      rotation: Math.random() * 360,
      delay: i * 0.05,
    }));

    setChalkParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setChalkParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 2000);
  };

  const handleCardClick = (shot: ShotType, index: number) => {
    setActiveShot(shot);
    spawnChalkParticles(index);
  };

  return (
    <div className="w-full px-4 md:px-8 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: 3-card grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {shotTypes.map((shot, index) => (
              <motion.div
                key={shot.id}
                ref={(el) => (cardRefs.current[index] = el)}
                onClick={() => handleCardClick(shot, index)}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative cursor-pointer rounded-2xl p-6 md:p-8
                  bg-[#0B0F14]/80 backdrop-blur-xl
                  border transition-all duration-300
                  ${activeShot?.id === shot.id
                    ? 'border-[#E6C15A] border-2 shadow-[0_0_30px_rgba(230,193,90,0.5)]'
                    : 'border-[#E6C15A]/30 border hover:border-[#E6C15A]/60'
                  }
                `}
              >
                {/* Energy Aura for active card */}
                {activeShot?.id === shot.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-2xl bg-gradient-radial from-[#E6C15A]/20 to-transparent pointer-events-none"
                  />
                )}

                <h3 className="text-xl md:text-2xl font-heading font-black text-[#E6C15A] mb-2 tracking-tight">
                  {shot.title}
                </h3>
                <div className="h-1 w-12 bg-gradient-to-r from-[#E6C15A] to-[#3FD0C9] mb-4" />
              </motion.div>
            ))}
          </div>

          {/* Right: Description panel */}
          <div className="lg:col-span-1">
            <motion.div
              className="h-full rounded-2xl p-6 md:p-8 bg-[#0B0F14]/80 backdrop-blur-xl border border-[#1E3A5F]/50"
            >
              <AnimatePresence mode="wait">
                {activeShot ? (
                  <motion.div
                    key={activeShot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <h2 className="text-2xl md:text-3xl font-heading font-black text-[#E6C15A] mb-4 tracking-tight">
                      {activeShot.title}
                    </h2>
                    <p className="text-[#F5F7FA]/80 text-base md:text-lg leading-relaxed">
                      {activeShot.description}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[#F5F7FA]/50 text-center py-8"
                  >
                    <p className="text-sm md:text-base">Select a shot type to learn more</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Chalk Particles */}
      <AnimatePresence>
        {chalkParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0, x: particle.x, y: particle.y }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0.8],
              y: particle.y - 100,
              x: particle.x + (Math.random() - 0.5) * 50,
              rotate: particle.rotation + 180,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 2,
              delay: particle.delay,
              ease: 'easeOut',
            }}
            className="fixed pointer-events-none text-2xl z-50"
            style={{ left: `${particle.x}px`, top: `${particle.y}px` }}
          >
            {Math.random() > 0.5 ? '⚪' : '✨'}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ShotSelector;

