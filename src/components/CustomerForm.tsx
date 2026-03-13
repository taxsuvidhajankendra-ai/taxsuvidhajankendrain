import { useState, useRef } from "react";
import { Send, Upload, CheckCircle, X, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];

const serviceOptions: { label: string; value: ServiceType }[] = [
  { label: "GST Registration / Filing", value: "GST" },
  { label: "Income Tax Return (ITR)", value: "ITR" },
  { label: "PAN Card Services", value: "PAN" },
  { label: "TDS Filing", value: "TDS" },
  { label: "Others", value: "Others" },
];

const CustomerForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    service: "" as ServiceType | "",
    description: "",
    bookingDate: "",
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 5);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    const paths: string[] = [];
    for (const file of files) {
      const filePath = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error } = await supabase.storage.from("documents").upload(filePath, file);
      if (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}`);
      } else {
        paths.push(filePath);
      }
    }
    return paths;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      toast.error("Please agree to the data storage consent.");
      return;
    }
    if (!formData.service) {
      toast.error("Please select a service.");
      return;
    }

    setSubmitting(true);

    try {
      const documentPaths = files.length > 0 ? await uploadFiles() : [];

      const submissionData = {
        full_name: formData.fullName.trim(),
        mobile_number: formData.mobile.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        service: formData.service as ServiceType,
        description: formData.description.trim() || null,
        document_paths: documentPaths.length > 0 ? documentPaths : null,
        booking_date: formData.bookingDate || null,
        consent: true,
      };

      const { error: dbError } = await supabase.from("submissions").insert(submissionData);
      if (dbError) throw dbError;

      // Sync to Google Sheets (fire and forget)
      supabase.functions.invoke("sync-to-sheets", {
        body: submissionData,
      }).catch((err) => console.error("Sheets sync error:", err));

      setSubmitted(true);
      toast.success("Your booking has been submitted! We'll contact you soon.");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 bg-background" id="book">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center bg-card rounded-2xl border border-border shadow-card p-10">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Booking Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you, {formData.fullName}. We'll contact you at {formData.mobile} shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFiles([]);
                setFormData({ fullName: "", mobile: "", email: "", city: "", service: "", description: "", bookingDate: "", consent: false });
              }}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Submit Another Booking
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Get tomorrow's date as min for booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <section className="py-20 bg-background" id="book">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-3">
            Book Now
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Book a Service
          </h2>
          <p className="text-muted-foreground">Fill the form below and we'll get back to you within 24 hours</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                maxLength={15}
                pattern="[0-9]{10,15}"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                maxLength={255}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Your city"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Select Service *</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="">Choose a service...</option>
                {serviceOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  name="bookingDate"
                  type="date"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  min={minDate}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              placeholder="Briefly describe your requirement..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Upload Documents</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-input bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload PDF, JPG, PNG (max 5 files)</span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileChange}
              />
            </div>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-muted/40 px-3 py-1.5 rounded-md">
                    <span className="text-muted-foreground truncate">{f.name}</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-destructive hover:opacity-70">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData((prev) => ({ ...prev, consent: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-input accent-secondary"
            />
            <span className="text-sm text-muted-foreground">
              I agree to store my data for service delivery purpose. Your data is safe and will not be shared.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-saffron-gradient text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
            {submitting ? "Submitting..." : "Book Service"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CustomerForm;
