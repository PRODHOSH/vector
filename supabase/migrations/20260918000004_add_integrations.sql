-- Create user_integrations table
CREATE TABLE public.user_integrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own integrations."
  ON public.user_integrations
  FOR ALL
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER set_integrations_updated_at
  BEFORE UPDATE ON public.user_integrations
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Alter tasks table
ALTER TABLE public.tasks 
ADD COLUMN external_source text,
ADD COLUMN external_id text;

-- Add index to prevent duplicate external tasks
CREATE UNIQUE INDEX tasks_external_source_id_idx ON public.tasks (external_source, external_id) WHERE external_source IS NOT NULL AND external_id IS NOT NULL;
