
-- Create enum for services
CREATE TYPE public.service_type AS ENUM ('GST', 'ITR', 'PAN', 'TDS', 'Others');

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  service service_type NOT NULL,
  description TEXT,
  document_paths TEXT[],
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: Only admins can read submissions
CREATE POLICY "Admins can view submissions"
ON public.submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Anyone can insert submissions (public form)
CREATE POLICY "Anyone can submit"
ON public.submissions FOR INSERT
WITH CHECK (consent = true);

-- RLS: Only admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.submissions FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policy: anyone can upload documents
CREATE POLICY "Anyone can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- Storage policy: only admins can view documents
CREATE POLICY "Admins can view documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));
