import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PoolBalls3D from './PoolBalls3D';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroProps {
  onModelLoaded?: () => void;
}

const Hero = ({ onModelLoaded }: HeroProps) => {
  const isMobile = useIsMobile();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Handle model loaded callback
  const handleModelLoaded = () => {
    setModelLoaded(true);
    if (onModelLoaded) {
      onModelLoaded();
    }
  };

  // Generate chalk particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* 3D Canvas - Fixed behind UI */}
      <PoolBalls3D onLoaded={handleModelLoaded} />

      {/* Background Text: EIGHTBALL */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1
          className="font-heading font-black text-[#E6C15A] select-none"
          style={{
            fontSize: isMobile ? '12vw' : '18vw',
            fontWeight: 1000,
            opacity: 0.15,
            letterSpacing: '-0.02em',
            transform: isMobile ? 'translateY(-8vh)' : 'translateY(-5vh)',
          }}
        >
          EIGHTBALL
        </h1>
      </div>

      {/* Vignette */}
      <div className="vignette z-[1]" />

      {/* Chalk Particle Overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              y: `${particle.y - 20}%`,
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 8,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute text-white/20 text-2xl"
          >
            ⚪
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
