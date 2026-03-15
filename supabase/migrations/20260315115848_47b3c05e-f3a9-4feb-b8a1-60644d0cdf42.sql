
-- Add columns to submissions
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS payment_link text;

-- Create internal messages table for team chat per booking
CREATE TABLE public.booking_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL DEFAULT 'Admin',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_messages ENABLE ROW LEVEL SECURITY;

-- RLS for booking_messages
CREATE POLICY "Staff can view booking messages"
ON public.booking_messages FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'worker')
  OR public.has_role(auth.uid(), 'owner')
);

CREATE POLICY "Staff can insert booking messages"
ON public.booking_messages FOR INSERT TO authenticated
WITH CHECK (
  (public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'worker')
  OR public.has_role(auth.uid(), 'owner'))
  AND sender_id = auth.uid()
);

-- Submissions policies for worker and owner
CREATE POLICY "Workers can view assigned submissions"
ON public.submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'worker'));

CREATE POLICY "Owners can view all submissions"
ON public.submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Workers can update assigned submissions"
ON public.submissions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'worker') AND assigned_to = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'worker') AND assigned_to = auth.uid());

CREATE POLICY "Owners can update all submissions"
ON public.submissions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- Enable realtime for booking_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_messages;
