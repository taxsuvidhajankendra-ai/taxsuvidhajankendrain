import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Download, RefreshCw, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Submission = Tables<"submissions">;

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin");
      return;
    }

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
      toast.error("Failed to load submissions");
      console.error(error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const exportCSV = () => {
    if (!submissions.length) return;
    const headers = ["Date", "Full Name", "Mobile", "Email", "City", "Service", "Description", "Documents"];
    const rows = submissions.map(s => [
      new Date(s.created_at).toLocaleString(),
      s.full_name,
      s.mobile_number,
      s.email,
      s.city,
      s.service,
      s.description || "",
      (s.document_paths || []).join("; "),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">{submissions.length} submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadSubmissions} className="p-2 rounded-lg border border-input hover:bg-muted transition-colors" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link to="/admin/talk-with-customer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            <Users className="h-4 w-4" /> Talk With Customer
          </Link>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No submissions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-card rounded-xl border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Mobile</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">City</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Service</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Description</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Docs</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{s.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.mobile_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.city}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">{s.service}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{s.description || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{(s.document_paths || []).length > 0 ? `${s.document_paths!.length} file(s)` : "—"}</td>
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

export default AdminDashboard;
