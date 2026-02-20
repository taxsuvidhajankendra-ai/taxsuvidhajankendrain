import { useState } from "react";
import { X, Send, MessageSquare } from "lucide-react";

const LiveChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "Namaste! 🙏 How can we help you today?" },
  ]);
  const [input, setInput] = useState("");

  const quickReplies = [
    "GST Registration",
    "ITR Filing",
    "PAN/Aadhaar Help",
    "Pricing Info",
  ];

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: msg },
      { from: "bot", text: "Thanks for reaching out! Our team will get back to you shortly. You can also call or email us at taxsuvidhajankendra@gmail.com." },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-24 sm:right-44 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
        aria-label="Live Chat"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-h-[28rem] flex flex-col rounded-2xl border border-border bg-card shadow-card-hover overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Tax Suvidha Support</p>
              <p className="text-xs opacity-80">We typically reply instantly</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[10rem]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                    m.from === "user"
                      ? "bg-secondary text-secondary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border bg-background hover:bg-muted transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="border-t border-border flex items-center gap-2 p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button type="submit" className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default LiveChat;
