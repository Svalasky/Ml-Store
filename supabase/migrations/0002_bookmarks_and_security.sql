-- ====================================================================
-- Migration 0002: Enhance Bookmarks Table Schema & Ensure Security RLS
-- ====================================================================

-- 1. Enhance Bookmarks Table with name, description, domain, and logo_url
ALTER TABLE public.bookmarks
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS domain TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Backfill name from title if name is NULL
UPDATE public.bookmarks
SET name = title
WHERE name IS NULL;

-- 2. Ensure Row Level Security (RLS) is enabled for bookmarks & security_settings
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Re-verify RLS policies for bookmarks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookmarks' AND policyname = 'Users can view own bookmarks'
  ) THEN
    CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
      FOR SELECT USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookmarks' AND policyname = 'Users can insert own bookmarks'
  ) THEN
    CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookmarks' AND policyname = 'Users can update own bookmarks'
  ) THEN
    CREATE POLICY "Users can update own bookmarks" ON public.bookmarks
      FOR UPDATE USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookmarks' AND policyname = 'Users can delete own bookmarks'
  ) THEN
    CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
      FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;
