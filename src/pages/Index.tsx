import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import DocumentsSection from "@/components/DocumentsSection";
import FAQSection from "@/components/FAQSection";
import DigitalServicesSection from "@/components/DigitalServicesSection";
import TaxCalculator from "@/components/TaxCalculator";
import CustomerForm from "@/components/CustomerForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <DocumentsSection />
        <FAQSection />
        <DigitalServicesSection />
        <TaxCalculator />
        <CustomerForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
