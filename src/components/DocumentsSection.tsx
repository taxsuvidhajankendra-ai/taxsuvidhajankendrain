import { motion } from "framer-motion";
import { FileText, CreditCard, Fingerprint, Building2, Receipt } from "lucide-react";

const documents = [
  { icon: Fingerprint, label: "Aadhaar Card" },
  { icon: CreditCard, label: "PAN Card" },
  { icon: Building2, label: "Bank Statement" },
  { icon: Receipt, label: "Salary Slip" },
  { icon: FileText, label: "Business Documents (if required)" },
];

const DocumentsSection = () => (
  <section className="py-20 bg-background" id="documents">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-3">
          Documents
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Documents Required
        </h2>
        <p className="text-muted-foreground">Service ke liye ye documents taiyaar rakhein</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 bg-card rounded-xl border border-border shadow-card p-4"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <doc.icon className="h-5 w-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-foreground">{doc.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DocumentsSection;
