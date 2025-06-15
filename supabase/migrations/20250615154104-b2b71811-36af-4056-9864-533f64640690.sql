
-- Table for conversation logs between user and AI
CREATE TABLE public.conversation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id uuid NOT NULL REFERENCES public.ai_characters(id) ON DELETE SET NULL,
  start_time timestamp with time zone NOT NULL DEFAULT now(),
  end_time timestamp with time zone,
  conversation_transcript text NOT NULL,
  ai_feedback text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS and add policies
ALTER TABLE public.conversation_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own logs
CREATE POLICY "Users can select their own conversation logs"
  ON public.conversation_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own logs
CREATE POLICY "Users can insert their own conversation logs"
  ON public.conversation_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own logs
CREATE POLICY "Users can update their own conversation logs"
  ON public.conversation_logs FOR UPDATE
  USING (auth.uid() = user_id);
