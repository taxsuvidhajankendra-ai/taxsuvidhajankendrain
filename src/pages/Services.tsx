import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, BarChart3, Calculator, Receipt, CreditCard, Fingerprint, CheckCircle, Building2, MessageSquare, Palette, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const allServices = [
  {
    icon: FileText, title: "GST Registration", titleHi: "जीएसटी पंजीकरण",
    description: "Get your business registered under GST with our expert assistance. We handle the entire process from documentation to approval.",
    features: ["GSTIN Number", "Expert Documentation", "Quick Processing", "Government Fees Included"],
    price: "₹1,500",
  },
  {
    icon: BarChart3, title: "GST Return Filing", titleHi: "जीएसटी रिटर्न फाइलिंग",
    description: "Timely and accurate filing of GSTR-1, GSTR-3B, GSTR-9 and annual returns for your business.",
    features: ["Monthly/Quarterly Filing", "GSTR-1 & GSTR-3B", "Annual Return", "Compliance Review"],
    price: "₹800/mo",
  },
  {
    icon: Calculator, title: "Income Tax Return (ITR)", titleHi: "आयकर रिटर्न",
    description: "Professional ITR filing for individuals, salaried employees, freelancers and businesses.",
    features: ["All ITR Forms", "Tax Planning", "Refund Maximization", "Expert Review"],
    price: "₹500",
  },
  {
    icon: Receipt, title: "TDS Filing", titleHi: "टीडीएस फाइलिंग",
    description: "Complete TDS return filing including TDS on salary, rent, professional fees and contractor payments.",
    features: ["TDS Returns", "Form 16/16A", "Challan Management", "Compliance"],
    price: "₹1,000",
  },
  {
    icon: CreditCard, title: "PAN Card Services", titleHi: "पैन कार्ड सेवाएँ",
    description: "New PAN card application, corrections, reprints and PAN-Aadhaar linking services.",
    features: ["New PAN", "Corrections", "Reprint", "Aadhaar Linking"],
    price: "₹200",
  },
  {
    icon: Fingerprint, title: "Aadhaar Services", titleHi: "आधार सेवाएँ",
    description: "Aadhaar enrollment, update, correction and various Aadhaar-related government services.",
    features: ["Enrollment", "Update/Correction", "Download", "Linking Services"],
    price: "₹100",
  },
  {
    icon: Building2, title: "Business Registration", titleHi: "व्यापार पंजीकरण",
    description: "Complete business registration services including company incorporation, MSME registration and trade license.",
    features: ["Company Registration", "MSME Registration", "Trade License", "Compliance Setup"],
    price: "₹2,000",
  },
  {
    icon: MessageSquare, title: "Tax Consultation", titleHi: "कर परामर्श",
    description: "Expert tax consultation for individuals and businesses. Get personalized advice on tax planning and compliance.",
    features: ["Tax Planning", "Expert Advice", "Compliance Review", "Personalized Solutions"],
    price: "₹500",
  },
  {
    icon: Palette, title: "Logo Design", titleHi: "लोगो डिज़ाइन",
    description: "Professional logo design for your business. Modern, unique designs that represent your brand identity.",
    features: ["Custom Design", "Multiple Concepts", "Source Files", "Unlimited Revisions"],
    price: "₹1,500",
  },
  {
    icon: Globe, title: "Website Design", titleHi: "वेबसाइट डिज़ाइन",
    description: "Business website design to establish your online presence and help customers find you easily.",
    features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Mobile Friendly"],
    price: "₹5,000",
  },
];
const Services = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <section className="bg-hero-gradient text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Services</h1>
          <p className="text-lg opacity-80">Complete tax & government services under one roof</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 space-y-8 max-w-4xl">
          {allServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border shadow-card p-6 md:p-8 flex flex-col md:flex-row gap-6"
            >
              <div className="shrink-0 flex items-start">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <service.icon className="h-7 w-7 text-secondary" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                  <span className="text-sm font-hindi text-muted-foreground">{service.titleHi}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">Starting at {service.price}</span>
                  <Link to="/contact" className="px-5 py-2 rounded-lg bg-saffron-gradient text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Services;
