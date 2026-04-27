ALTER TABLE public.email_captures
  ADD COLUMN IF NOT EXISTS paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS followup_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_email_captures_followup
  ON public.email_captures (captured_at)
  WHERE paid = false AND followup_sent_at IS NULL;

-- Allow the app (anon) to mark a capture as paid by email (used after Stripe checkout success)
CREATE POLICY "Allow update paid status by email"
ON public.email_captures
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);