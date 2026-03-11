import { motion } from "framer-motion";
import { Palette, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DigitalServicesSection = () => (
  <section className="py-20 bg-muted/30" id="digital-services">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-3">
          Digital Services
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Logo & Website Design
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Business owners ke liye professional digital services — apna business online grow karein
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {[
          {
            icon: Palette,
            title: "Logo Design",
            desc: "Professional logo design jo aapke business ki identity banaye. Unique aur modern designs.",
          },
          {
            icon: Globe,
            title: "Website Design",
            desc: "Business website design jisse aapka business online dikhe aur customers aasani se aapko dhundh sakein.",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border shadow-card p-6 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-saffron-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Contact for Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default DigitalServicesSection;
