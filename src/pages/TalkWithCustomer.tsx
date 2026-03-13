import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut, RefreshCw, Phone, MessageCircle, CheckCircle2,
  Users, Clock, FileText, Filter
} from "lucide-react";

interface Submission {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string;
  city: string;
  service: string;
  description: string | null;
  booking_date: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const TalkWithCustomer = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/admin"); return; }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      await supabase.auth.signOut();
      toast.error("Access denied.");
      navigate("/admin");
      return;
    }

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
      console.error(error);
    } else {
      setSubmissions((data as Submission[]) || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("submissions")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      console.error(error);
    } else {
      toast.success(`Status updated to ${newStatus}`);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const message = encodeURIComponent(
      `Hello ${name}, this is Tax Suvidha Jan Kendra. Thank you for your booking. How can we assist you?`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${message}`, "_blank");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const filtered = statusFilter === "All"
    ? submissions
    : submissions.filter((s) => s.status === statusFilter);

  const counts = {
    All: submissions.length,
    New: submissions.filter((s) => s.status === "New").length,
    "In Progress": submissions.filter((s) => s.status === "In Progress").length,
    Completed: submissions.filter((s) => s.status === "Completed").length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Talk With Customer
            </h1>
            <p className="text-sm text-muted-foreground">{submissions.length} total bookings</p>
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
        {/* Stats Cards */}
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

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-card rounded-xl border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Service</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">Message</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Booking Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{s.full_name}</p>
                      <p className="text-xs text-muted-foreground">{s.city}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.mobile_number}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                        {s.service}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate hidden lg:table-cell">
                      {s.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell whitespace-nowrap">
                      {s.booking_date ? new Date(s.booking_date).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={s.status}
                        onChange={(e) => updateStatus(s.id, e.target.value)}
                        className={`px-2 py-1 rounded-md text-xs font-semibold border-0 cursor-pointer ${statusColors[s.status] || "bg-muted text-foreground"}`}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCall(s.mobile_number)}
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          title="Call Customer"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleWhatsApp(s.mobile_number, s.full_name)}
                          className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        {s.status !== "Completed" && (
                          <button
                            onClick={() => updateStatus(s.id, "Completed")}
                            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default TalkWithCustomer;
