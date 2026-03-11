import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "ITR kaun file kare?",
    a: "Jis vyakti ki income taxable limit se upar hai use ITR file karna chahiye.",
  },
  {
    q: "GST registration kab zaroori hota hai?",
    a: "Jab business turnover government limit se zyada ho jata hai.",
  },
  {
    q: "ITR ke liye kya documents chahiye?",
    a: "PAN card, Aadhaar card aur bank details.",
  },
];

const FAQSection = () => (
  <section className="py-20 bg-muted/30" id="faq">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-3">
          FAQ
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">Aam sawalon ke jawab</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card rounded-xl border border-border shadow-card px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;
