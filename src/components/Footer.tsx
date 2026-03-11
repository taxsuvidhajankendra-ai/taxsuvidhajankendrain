import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="h-1 bg-tricolor-bar" />
      <div className="container mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Tax Suvidha Jan Kendra</h3>
            <p className="text-sm opacity-80 leading-relaxed mb-4">
              Your trusted partner for all tax & government services. Reliable, legal & transparent.
            </p>
            <p className="text-sm font-hindi opacity-70">
              भरोसेमंद, कानूनी और पारदर्शी सेवाएँ
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-70">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Services", "About", "Pricing", "Contact"].map((link) => (
                <li key={link}>
                  <Link to={link === "Home" ? "/" : `/${link.toLowerCase()}`} className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-70">Services</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>GST Registration</li>
              <li>GST Return Filing</li>
              <li>Income Tax Return</li>
              <li>TDS Filing</li>
              <li>PAN & Aadhaar</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-70">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Mail className="h-4 w-4 shrink-0" />
                taxsuvidhajankendra@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm opacity-80">
                <Phone className="h-4 w-4 shrink-0" />
                +91 98917 69507
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://www.instagram.com/taxsuvidhaofficial/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61584777467827" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-60">
          <p>© 2025 Tax Suvidha Jan Kendra. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:opacity-100">Privacy Policy</Link>
            <Link to="/terms" className="hover:opacity-100">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
