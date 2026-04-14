CREATE TABLE public.email_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  quiz_answers jsonb,
  top_states jsonb,
  captured_at timestamptz DEFAULT now(),
  utm_source text,
  utm_medium text,
  utm_campaign text
);

ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.email_captures
  FOR INSERT TO anon WITH CHECK (true);