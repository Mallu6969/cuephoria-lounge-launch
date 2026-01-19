import { motion } from 'framer-motion';
import { Trophy, Clock, Users, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Trophy,
    title: 'Premium Tables',
    description: 'Professional-grade pool tables with perfect felt and responsive cushions for the ultimate game.',
    color: 'neon-cyan',
  },
  {
    icon: Clock,
    title: 'Late Night Hours',
    description: 'Open until 2 AM on weekends. The best games happen after midnight.',
    color: 'neon-purple',
  },
  {
    icon: Users,
    title: 'Tournaments',
    description: 'Weekly competitions with prizes. Test your skills against the best players in town.',
    color: 'neon-pink',
  },
  {
    icon: Sparkles,
    title: 'Lounge Atmosphere',
    description: 'Craft cocktails, ambient lighting, and curated music for the perfect gaming experience.',
    color: 'neon-blue',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const Features = () => {
  return (
    <section className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Why Cuephoria?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            More than just a pool hall. We've created the ultimate destination for players who demand excellence.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className={`relative z-10`}>
                <div className={`w-14 h-14 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:neon-border transition-all duration-300`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
