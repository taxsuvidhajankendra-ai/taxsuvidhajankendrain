import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut, RefreshCw, Phone, MessageCircle, CheckCircle2,
  Users, Clock, FileText, Filter, Send, X, Download,
  CreditCard, ChevronLeft, BarChart3, Eye
} from "lucide-react";

interface Submission {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string;
  city: string;
  service: string;
  description: string | null;
  document_paths: string[] | null;
  booking_date: string | null;
  status: string;
  created_at: string;
  payment_link: string | null;
  assigned_to: string | null;
}

interface ChatMessage {
  id: string;
  submission_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
};

const TalkWithCustomer = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [paymentLinkInput, setPaymentLinkInput] = useState("");
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [userRole, setUserRole] = useState<string>("admin");
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime subscription for chat messages
  useEffect(() => {
    if (!selectedSubmission) return;
    const channel = supabase
      .channel(`booking-messages-${selectedSubmission.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "booking_messages",
        filter: `submission_id=eq.${selectedSubmission.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedSubmission?.id]);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/admin"); return; }
    setUserId(user.id);
    setUserEmail(user.email || "");

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      toast.error("Access denied.");
      navigate("/admin");
      return;
    }

    // Determine highest role
    const roleList = roles.map((r) => r.role);
    if (roleList.includes("owner")) setUserRole("owner");
    else if (roleList.includes("admin")) setUserRole("admin");
    else if (roleList.includes("worker")) setUserRole("worker");

    loadSubmissions();
  };

  const loadSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load bookings");
    } else {
      setSubmissions((data as Submission[]) || []);
    }
    setLoading(false);
  };

  const loadMessages = async (submissionId: string) => {
    const { data } = await supabase
      .from("booking_messages")
      .select("*")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: true });
    setMessages((data as ChatMessage[]) || []);
  };

  const openWorkspace = (submission: Submission) => {
    setSelectedSubmission(submission);
    setPaymentLinkInput(submission.payment_link || "");
    setShowPaymentInput(false);
    loadMessages(submission.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSubmission) return;
    setSendingMsg(true);
    const { error } = await supabase.from("booking_messages").insert({
      submission_id: selectedSubmission.id,
      sender_id: userId,
      sender_name: userEmail.split("@")[0] || "Admin",
      message: newMessage.trim(),
    });
    if (error) toast.error("Failed to send message");
    else setNewMessage("");
    setSendingMsg(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("submissions").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Status → ${newStatus}`);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    if (selectedSubmission?.id === id) setSelectedSubmission((prev) => prev ? { ...prev, status: newStatus } : null);
  };

  const savePaymentLink = async () => {
    if (!selectedSubmission) return;
    const { error } = await supabase.from("submissions").update({ payment_link: paymentLinkInput.trim() || null }).eq("id", selectedSubmission.id);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Payment link saved");
    setSelectedSubmission((prev) => prev ? { ...prev, payment_link: paymentLinkInput.trim() || null } : null);
    setSubmissions((prev) => prev.map((s) => s.id === selectedSubmission.id ? { ...s, payment_link: paymentLinkInput.trim() || null } : s));
    setShowPaymentInput(false);
  };

  const sendPaymentViaWhatsApp = (phone: string, name: string, link: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const message = encodeURIComponent(`Hello ${name}, your payment link from Tax Suvidha Jan Kendra:\n${link}\nPlease complete the payment. Thank you!`);
    window.open(`https://wa.me/${phoneWithCountry}?text=${message}`, "_blank");
  };

  const handleCall = (phone: string) => window.open(`tel:${phone}`, "_self");

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const msg = encodeURIComponent(`Hello ${name}, this is Tax Suvidha Jan Kendra. Thank you for your booking. How can we assist you?`);
    window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, "_blank");
  };

  const getDocumentUrl = (path: string) => {
    const { data } = supabase.storage.from("documents").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/admin"); };

  const filtered = statusFilter === "All" ? submissions : submissions.filter((s) => s.status === statusFilter);
  const counts = {
    All: submissions.length,
    New: submissions.filter((s) => s.status === "New").length,
    "In Progress": submissions.filter((s) => s.status === "In Progress").length,
    Completed: submissions.filter((s) => s.status === "Completed").length,
  };

  // ==================== WORKSPACE VIEW ====================
  if (selectedSubmission) {
    const s = selectedSubmission;
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="bg-card border-b border-border px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedSubmission(null)} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Bookings
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[s.status] || "bg-muted text-foreground"}`}>
                {s.status}
              </span>
              <button onClick={handleLogout} className="p-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left: Customer Info + Actions */}
          <div className="space-y-4">
            {/* Customer Card */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-lg font-bold text-foreground mb-1">{s.full_name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{s.city}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{s.mobile_number}</span></div>
                <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{s.email}</span></div>
                <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{s.service}</span></div>
                {s.booking_date && (
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{new Date(s.booking_date).toLocaleDateString("en-IN")}</span></div>
                )}
              </div>
              {s.description && (
                <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">{s.description}</div>
              )}
            </div>

            {/* Communication Buttons */}
            <div className="bg-card rounded-xl border border-border p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground mb-2">Communication</h3>
              <button onClick={() => handleCall(s.mobile_number)} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Phone className="h-4 w-4" /> Call Customer
              </button>
              <button onClick={() => handleWhatsApp(s.mobile_number, s.full_name)} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <MessageCircle className="h-4 w-4" /> WhatsApp Customer
              </button>
            </div>

            {/* Status Update */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Status</h3>
              <div className="flex gap-1.5">
                {["New", "In Progress", "Completed"].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateStatus(s.id, st)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      s.status === st ? statusColors[st] + " ring-2 ring-offset-1 ring-secondary/30" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Link */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment
              </h3>
              {s.payment_link && !showPaymentInput ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground break-all bg-muted/50 p-2 rounded-md">{s.payment_link}</p>
                  <div className="flex gap-1.5">
                    <button onClick={() => sendPaymentViaWhatsApp(s.mobile_number, s.full_name, s.payment_link!)} className="flex-1 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                      Send via WhatsApp
                    </button>
                    <button onClick={() => setShowPaymentInput(true)} className="px-3 py-2 rounded-lg border border-input text-xs font-medium hover:bg-muted transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    value={paymentLinkInput}
                    onChange={(e) => setPaymentLinkInput(e.target.value)}
                    placeholder="Paste UPI link or payment URL..."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <div className="flex gap-1.5">
                    <button onClick={savePaymentLink} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                      Save Link
                    </button>
                    {showPaymentInput && (
                      <button onClick={() => setShowPaymentInput(false)} className="px-3 py-2 rounded-lg border border-input text-xs hover:bg-muted transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Documents */}
            {s.document_paths && s.document_paths.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Documents ({s.document_paths.length})
                </h3>
                <div className="space-y-1.5">
                  {s.document_paths.map((path, i) => {
                    const fileName = path.split("_").slice(1).join("_") || path;
                    return (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                        <span className="text-muted-foreground truncate flex-1">{fileName}</span>
                        <div className="flex gap-1">
                          <a href={getDocumentUrl(path)} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-muted transition-colors" title="View">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          </a>
                          <a href={getDocumentUrl(path)} download className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Download">
                            <Download className="h-3.5 w-3.5 text-muted-foreground" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Team Chat */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col h-[calc(100vh-8rem)]">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-secondary" /> Team Notes & Chat
              </h3>
              <p className="text-xs text-muted-foreground">Internal discussion about this booking</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>No messages yet. Start the conversation.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        <p className={`text-xs font-medium mb-0.5 ${isMe ? "opacity-70" : "text-muted-foreground"}`}>{msg.sender_name}</p>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? "opacity-50" : "text-muted-foreground"}`}>
                          {new Date(msg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <button
                  onClick={sendMessage}
                  disabled={sendingMsg || !newMessage.trim()}
                  className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LIST VIEW ====================
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Talk With Customer
            </h1>
            <p className="text-sm text-muted-foreground">
              {submissions.length} bookings · Role: <span className="font-medium capitalize text-foreground">{userRole}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadSubmissions} className="p-2 rounded-lg border border-input hover:bg-muted transition-colors" title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button onClick={() => navigate("/admin/dashboard")} className="px-3 py-2 rounded-lg border border-input text-sm font-medium hover:bg-muted transition-colors">
              Dashboard
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:opacity-90 transition-opacity">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["All", "New", "In Progress", "Completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-4 rounded-xl border text-left transition-all ${
                statusFilter === status
                  ? "border-secondary bg-secondary/5 ring-2 ring-secondary/20"
                  : "border-border bg-card hover:border-secondary/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {status === "All" && <Filter className="h-4 w-4 text-muted-foreground" />}
                {status === "New" && <FileText className="h-4 w-4 text-blue-500" />}
                {status === "In Progress" && <Clock className="h-4 w-4 text-yellow-500" />}
                {status === "Completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                <span className="text-xs font-medium text-muted-foreground uppercase">{status}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{counts[status]}</p>
            </button>
          ))}
        </div>

        {/* Customer Cards */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-secondary/30 transition-all cursor-pointer group"
                onClick={() => openWorkspace(s)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">{s.full_name}</h3>
                    <p className="text-xs text-muted-foreground">{s.city} · {new Date(s.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[s.status] || "bg-muted text-foreground"}`}>
                    {s.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{s.mobile_number}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><BarChart3 className="h-3.5 w-3.5" />
                    <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">{s.service}</span>
                  </div>
                  {s.document_paths && s.document_paths.length > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground"><FileText className="h-3.5 w-3.5" />{s.document_paths.length} document(s)</div>
                  )}
                </div>

                <div className="flex gap-1.5 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleCall(s.mobile_number)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </button>
                  <button onClick={() => handleWhatsApp(s.mobile_number, s.full_name)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-accent/50 text-accent-foreground text-xs font-medium hover:bg-accent/70 transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </button>
                  {s.status !== "Completed" && (
                    <button onClick={() => updateStatus(s.id, "Completed")} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-accent/50 text-accent-foreground text-xs font-medium hover:bg-accent/70 transition-colors">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TalkWithCustomer;
