-- ====================================================================
-- Personal Dashboard: Complete Supabase Database Schema & RLS Policies
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium',
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TRANSACTIONS TABLE (Finance)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT,
  type TEXT DEFAULT 'meeting',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  time TEXT,
  read BOOLEAN DEFAULT false,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. DASHBOARD PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.dashboard_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  language TEXT DEFAULT 'id',
  currency TEXT DEFAULT 'IDR',
  timezone TEXT DEFAULT 'Asia/Jakarta',
  theme TEXT DEFAULT 'system',
  widgets JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. SECURITY SETTINGS TABLE (Application Lock)
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  password_hash TEXT,
  lock_enabled BOOLEAN DEFAULT false,
  failed_attempts INTEGER DEFAULT 0,
  lockout_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- User can only access/modify their own rows: (user_id = auth.uid())
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Tasks Policies
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own tasks" ON public.tasks
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE USING (user_id = auth.uid());

-- Notes Policies
CREATE POLICY "Users can view own notes" ON public.notes
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own notes" ON public.notes
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own notes" ON public.notes
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own notes" ON public.notes
  FOR DELETE USING (user_id = auth.uid());

-- Transactions Policies
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (user_id = auth.uid());

-- Schedules Policies
CREATE POLICY "Users can view own schedules" ON public.schedules
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own schedules" ON public.schedules
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own schedules" ON public.schedules
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own schedules" ON public.schedules
  FOR DELETE USING (user_id = auth.uid());

-- Bookmarks Policies
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own bookmarks" ON public.bookmarks
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
  FOR DELETE USING (user_id = auth.uid());

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

-- Dashboard Preferences Policies
CREATE POLICY "Users can view own preferences" ON public.dashboard_preferences
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own preferences" ON public.dashboard_preferences
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own preferences" ON public.dashboard_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Security Settings Policies
CREATE POLICY "Users can view own security settings" ON public.security_settings
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own security settings" ON public.security_settings
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own security settings" ON public.security_settings
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ====================================================================
-- AUTOMATIC USER PROVISIONING TRIGGER
-- Automatically creates row in profiles, dashboard_preferences, and security_settings
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, full_name)
  VALUES (new.id, new.id, new.email, new.raw_user_meta_data->>'full_name');

  INSERT INTO public.dashboard_preferences (user_id)
  VALUES (new.id);

  INSERT INTO public.security_settings (user_id, lock_enabled)
  VALUES (new.id, false);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
