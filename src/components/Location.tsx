import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

const hours = [
  { day: 'Monday - Thursday', time: '4 PM - 12 AM' },
  { day: 'Friday', time: '4 PM - 2 AM' },
  { day: 'Saturday', time: '2 PM - 2 AM' },
  { day: 'Sunday', time: '2 PM - 11 PM' },
];

const Location = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Find Us</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Located in the heart of downtown. Come visit and experience the difference.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] rounded-xl overflow-hidden border border-border"
          >
            <div className="absolute inset-0 bg-card flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Interactive Map</p>
                <p className="text-sm text-muted-foreground/60">123 Downtown Street</p>
              </div>
            </div>
            {/* Neon corner accents */}
            <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-primary to-transparent" />
            <div className="absolute top-0 left-0 w-1 h-20 bg-gradient-to-b from-primary to-transparent" />
            <div className="absolute bottom-0 right-0 w-20 h-1 bg-gradient-to-l from-secondary to-transparent" />
            <div className="absolute bottom-0 right-0 w-1 h-20 bg-gradient-to-t from-secondary to-transparent" />
          </motion.div>
          
          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Hours Card */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {hours.map((item) => (
                  <div key={item.day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.day}</span>
                    <span className="text-foreground font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact Card */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Contact & Address</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">123 Downtown Street, City Center, ST 12345</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">hello@cuephoria.com</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
