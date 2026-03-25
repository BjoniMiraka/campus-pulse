# Migration to Anonymous Authentication

This app now uses **session-based anonymous authentication** instead of Supabase Auth. No more email sign-ups or magic links!

## What Changed

### Before:
- Users had to sign up with university email
- Magic link authentication via email
- User accounts stored in Supabase Auth

### After:
- Instant anonymous access - no sign-up needed
- Session stored in browser localStorage
- Anonymous ID and name generated automatically
- Users can change their anonymous name anytime
- Session persists for 30 days

## Database Migration

You need to update your Supabase database schema. Follow these steps:

### 1. Backup Current Data (if you have any)

```sql
-- Run this in Supabase SQL Editor to backup existing data
SELECT * FROM posts;
SELECT * FROM comments;
```

### 2. Drop Old Tables

```sql
-- Drop old tables and their dependencies
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.user_reactions CASCADE;
DROP TABLE IF EXISTS public.poll_votes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
```

### 3. Apply New Schema

Go to Supabase Dashboard > SQL Editor and run the entire `supabase/schema.sql` file.

### 4. Disable Email Auth (Optional)

Since we're not using Supabase Auth anymore:
1. Go to Authentication > Settings in Supabase Dashboard
2. Disable "Enable email provider" (optional, but recommended to avoid confusion)

## How It Works

1. **First Visit**: User visits the app, an anonymous session is created automatically
2. **Session Storage**: Session ID and anonymous name stored in localStorage
3. **Posting**: Posts are created with the anonymous session ID and name
4. **Persistence**: Session lasts 30 days, then auto-regenerates
5. **Privacy**: No email, no password, no personal data stored

## Benefits

- Zero friction - instant access
- Maximum anonymity - no email required
- Free - no auth provider costs
- Simple - no email verification or password resets
- Safe - users can clear session anytime

## Limitations

- Users lose access if they clear browser data
- Can't sync across devices
- No account recovery mechanism
- Users can create multiple "accounts" by clearing cookies

## Future Enhancements (Optional)

- Add optional email backup for session recovery
- Add rate limiting by IP to prevent spam
- Add device fingerprinting for better tracking
