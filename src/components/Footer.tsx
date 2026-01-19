import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 border-t border-border relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div>
            <h3 className="font-heading text-2xl font-bold gradient-text mb-2">CUEPHORIA</h3>
            <p className="text-muted-foreground text-sm">Where Champions Play</p>
          </div>
          
          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-heading text-sm uppercase tracking-wider text-muted-foreground mb-4">Quick Links</h4>
            <div className="flex justify-center gap-6">
              <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">About</a>
              <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">Menu</a>
              <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">Events</a>
              <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          
          {/* Newsletter hint */}
          <div className="text-right">
            <p className="text-muted-foreground text-sm">
              Open for business
            </p>
            <p className="text-primary font-heading">Every Day</p>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border/50 text-center"
        >
          <p className="text-muted-foreground text-sm">
            © {currentYear} Cuephoria Gaming Lounge. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
