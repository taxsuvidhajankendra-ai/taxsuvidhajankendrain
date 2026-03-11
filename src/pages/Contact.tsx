import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomerForm from "@/components/CustomerForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <section className="bg-hero-gradient text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-lg opacity-80">We're here to help you with all your tax needs</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { icon: Mail, title: "Email", detail: "taxsuvidhajankendra@gmail.com" },
              { icon: Phone, title: "Phone / WhatsApp", detail: "+91 98917 69507" },
              { icon: Clock, title: "Working Hours", detail: "Mon - Sat, 9 AM - 7 PM" },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl border border-border shadow-card p-6 text-center">
                <item.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CustomerForm />
    </main>
    <Footer />
  </div>
);

export default Contact;
