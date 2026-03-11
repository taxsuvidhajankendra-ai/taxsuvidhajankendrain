import { motion } from "framer-motion";
import { FileText, BarChart3, Calculator, Receipt, CreditCard, Fingerprint, Building2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: FileText,
    title: "GST Registration",
    titleHi: "जीएसटी पंजीकरण",
    description: "Quick and hassle-free GST registration for your business with expert guidance.",
    color: "bg-saffron-light text-secondary",
  },
  {
    icon: BarChart3,
    title: "GST Return Filing",
    titleHi: "जीएसटी रिटर्न फाइलिंग",
    description: "Timely and accurate GST return filing — GSTR-1, GSTR-3B, Annual returns.",
    color: "bg-india-green-light text-accent",
  },
  {
    icon: Calculator,
    title: "Income Tax Return (ITR)",
    titleHi: "आयकर रिटर्न",
    description: "Expert ITR filing for salaried, self-employed & businesses. Maximize refunds.",
    color: "bg-navy-light text-primary",
  },
  {
    icon: Receipt,
    title: "TDS Filing",
    titleHi: "टीडीएस फाइलिंग",
    description: "Complete TDS return filing and compliance management for employers and businesses.",
    color: "bg-saffron-light text-secondary",
  },
  {
    icon: CreditCard,
    title: "PAN Card Services",
    titleHi: "पैन कार्ड सेवाएँ",
    description: "New PAN card application, corrections, reprint and linking with Aadhaar.",
    color: "bg-india-green-light text-accent",
  },
  {
    icon: Fingerprint,
    title: "Aadhaar Services",
    titleHi: "आधार सेवाएँ",
    description: "Aadhaar enrollment, update, correction and Aadhaar-PAN linking services.",
    color: "bg-navy-light text-primary",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-background chakra-bg" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-3">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            What We Offer
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Professional tax & government services at your doorstep. Trusted, fast & affordable.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="group bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${service.color}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{service.title}</h3>
                <p className="text-sm font-hindi text-muted-foreground mb-2">{service.titleHi}</p>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
