CREATE TABLE public.tier2_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  quiz_answers jsonb,
  joined_at timestamptz DEFAULT now()
);

ALTER TABLE public.tier2_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.tier2_waitlist
  FOR INSERT TO anon WITH CHECK (true);