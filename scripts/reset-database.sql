-- =====================================================
-- RESET DATABASE FOR ANONYMOUS AUTH
-- Run this in Supabase SQL Editor to migrate to anonymous auth
-- =====================================================

-- Step 1: Drop old triggers and functions
DROP TRIGGER IF EXISTS on_poll_vote_added ON public.poll_votes;
DROP TRIGGER IF EXISTS on_comment_added ON public.comments;
DROP TRIGGER IF EXISTS on_reaction_added ON public.user_reactions;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.increment_poll_votes();
DROP FUNCTION IF EXISTS public.increment_comment_count();
DROP FUNCTION IF EXISTS public.increment_reaction();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Drop old tables
DROP TABLE IF EXISTS public.user_reactions CASCADE;
DROP TABLE IF EXISTS public.poll_votes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.daily_polls CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.anonymous_sessions CASCADE;

-- Step 3: Now run the new schema from supabase/schema.sql
-- Copy and paste the entire contents of that file here, or run it separately
