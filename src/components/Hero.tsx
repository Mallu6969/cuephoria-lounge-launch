import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PoolBalls3D from './PoolBalls3D';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Pool Balls Background */}
      <PoolBalls3D />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text">CUEPHORIA</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2 tracking-widest uppercase">
            Gaming Lounge
          </p>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto"
        >
          Where Champions Play. Premium pool tables, electric atmosphere, 
          and unforgettable nights await.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 neon-border font-heading tracking-wider"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book a Table
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-secondary text-secondary hover:bg-secondary/10 font-heading tracking-wider"
          >
            <MapPin className="mr-2 h-5 w-5" />
            View Location
          </Button>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
