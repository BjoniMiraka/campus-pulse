-- =====================================================
-- COMPLETE DATABASE SETUP FOR CAMPUS PULSE
-- Copy this entire file and run it in Supabase SQL Editor
-- =====================================================

-- Clean up any existing tables (if any)
DROP TABLE IF EXISTS public.user_reactions CASCADE;
DROP TABLE IF EXISTS public.poll_votes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.daily_polls CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.anonymous_sessions CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Anonymous sessions table (no auth required)
CREATE TABLE public.anonymous_sessions (
  id TEXT PRIMARY KEY,
  anonymous_name TEXT NOT NULL,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (simplified for anonymous users)
CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('confession', 'hot-take', 'question')),
  reactions JSONB DEFAULT '{"fire": 0, "skull": 0, "laugh": 0, "eyes": 0}'::jsonb,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(author_id)
);

-- Comments table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily polls table
CREATE TABLE public.daily_polls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  votes_a INTEGER DEFAULT 0,
  votes_b INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Poll votes table
CREATE TABLE public.poll_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.daily_polls(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  option TEXT NOT NULL CHECK (option IN ('A', 'B')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- User reactions table (to track who reacted to what)
CREATE TABLE public.user_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('fire', 'skull', 'laugh', 'eyes')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Indexes for performance
CREATE INDEX posts_created_at_idx ON public.posts(created_at DESC);
CREATE INDEX comments_post_id_idx ON public.comments(post_id);
CREATE INDEX user_reactions_post_id_idx ON public.user_reactions(post_id);
CREATE INDEX poll_votes_poll_id_idx ON public.poll_votes(poll_id);

-- Enable Row Level Security
ALTER TABLE public.anonymous_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Open access for anonymous users)

-- Anonymous sessions
CREATE POLICY "Sessions are viewable by everyone"
  ON public.anonymous_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create a session"
  ON public.anonymous_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their session"
  ON public.anonymous_sessions FOR UPDATE
  USING (true);

-- Posts
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (true);

-- Comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

-- Daily polls
CREATE POLICY "Polls are viewable by everyone"
  ON public.daily_polls FOR SELECT
  USING (true);

-- Poll votes
CREATE POLICY "Poll votes are viewable by everyone"
  ON public.poll_votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can vote"
  ON public.poll_votes FOR INSERT
  WITH CHECK (true);

-- User reactions
CREATE POLICY "Reactions are viewable by everyone"
  ON public.user_reactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add reactions"
  ON public.user_reactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can remove reactions"
  ON public.user_reactions FOR DELETE
  USING (true);

-- Function to increment reaction count
CREATE OR REPLACE FUNCTION public.increment_reaction()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET reactions = jsonb_set(
    reactions,
    ARRAY[NEW.reaction_type],
    to_jsonb((reactions->>NEW.reaction_type)::int + 1)
  )
  WHERE id = NEW.post_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update reaction counts
CREATE TRIGGER on_reaction_added
  AFTER INSERT ON public.user_reactions
  FOR EACH ROW EXECUTE FUNCTION public.increment_reaction();

-- Function to increment comment count
CREATE OR REPLACE FUNCTION public.increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = comment_count + 1
  WHERE id = NEW.post_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update comment counts
CREATE TRIGGER on_comment_added
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.increment_comment_count();

-- Function to increment poll vote counts
CREATE OR REPLACE FUNCTION public.increment_poll_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.option = 'A' THEN
    UPDATE public.daily_polls
    SET votes_a = votes_a + 1
    WHERE id = NEW.poll_id;
  ELSE
    UPDATE public.daily_polls
    SET votes_b = votes_b + 1
    WHERE id = NEW.poll_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update poll vote counts
CREATE TRIGGER on_poll_vote_added
  AFTER INSERT ON public.poll_votes
  FOR EACH ROW EXECUTE FUNCTION public.increment_poll_votes();

-- Insert a sample daily poll for testing
INSERT INTO public.daily_polls (question, option_a, option_b, expires_at)
VALUES (
  'What''s worse?',
  'Group projects',
  'Finals week',
  NOW() + INTERVAL '24 hours'
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup complete! You can now use Campus Pulse.';
END $$;
