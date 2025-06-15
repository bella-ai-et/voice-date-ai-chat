
-- 1. User Profiles table (linked to Supabase auth users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security: Only allow users to access/update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. AI Characters table
CREATE TABLE public.ai_characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  personality TEXT NOT NULL,
  avatar_url TEXT,
  avatar_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anyone can view AI characters. Authenticated users can insert/update (for expansion/admin usage)
ALTER TABLE public.ai_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view AI characters"
  ON public.ai_characters FOR SELECT
  USING (true);
CREATE POLICY "Authenticated can insert AI characters"
  ON public.ai_characters FOR INSERT
  TO authenticated
  WITH CHECK (true);
CREATE POLICY "Authenticated can update AI characters"
  ON public.ai_characters FOR UPDATE
  TO authenticated
  USING (true);

-- 3. Chat Messages table: stores the conversation snippets
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ai_character_id uuid REFERENCES public.ai_characters(id),
  from_role TEXT CHECK (from_role IN ('user', 'ai')),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security: Users can only see and add their own chat messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own chat messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

