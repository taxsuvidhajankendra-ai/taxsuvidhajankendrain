import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/91XXXXXXXXXX?text=Hello%2C%20I%20need%20help%20with%20tax%20services"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-[hsl(142,70%,45%)] text-white font-semibold shadow-lg hover:scale-105 transition-transform"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="h-5 w-5" />
    <span className="hidden sm:inline text-sm">WhatsApp</span>
  </a>
);

export default WhatsAppButton;
