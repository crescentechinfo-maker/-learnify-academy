-- =====================================================
-- Learnify AI Academy — Supabase Database Schema
-- Safe to run multiple times (fresh DB or existing DB)
-- Supabase Dashboard → SQL Editor → New Query → Run
-- =====================================================

-- =====================================================
-- 1. TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  thumbnail TEXT NOT NULL DEFAULT '',
  instructor TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons TEXT[] DEFAULT '{}',
  percentage INTEGER DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  certificate_code TEXT NOT NULL UNIQUE,
  ai_message TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Add ai_message column to existing certificates table (safe if already exists)
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS ai_message TEXT;

-- =====================================================
-- 2. FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-create profile on signup (bypasses RLS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE WHEN NEW.email = 'admin81@gmail.com' THEN 'admin' ELSE 'student' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop trigger if exists then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: check if current user is admin (SECURITY DEFINER avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- =====================================================
-- 3. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons      ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies (safe re-run)
DROP POLICY IF EXISTS "Users can view their own profile"        ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile"      ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile"      ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"            ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles"          ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles"              ON profiles;

DROP POLICY IF EXISTS "Anyone can view courses"                 ON courses;
DROP POLICY IF EXISTS "Admins can insert courses"               ON courses;
DROP POLICY IF EXISTS "Admins can update courses"               ON courses;
DROP POLICY IF EXISTS "Admins can delete courses"               ON courses;

DROP POLICY IF EXISTS "Anyone can view lessons"                 ON lessons;
DROP POLICY IF EXISTS "Admins can manage lessons"               ON lessons;

DROP POLICY IF EXISTS "Students can view their own progress"    ON progress;
DROP POLICY IF EXISTS "Students can insert their own progress"  ON progress;
DROP POLICY IF EXISTS "Students can update their own progress"  ON progress;
DROP POLICY IF EXISTS "Admins can view all progress"            ON progress;

DROP POLICY IF EXISTS "Students can view their own certificates"   ON certificates;
DROP POLICY IF EXISTS "Students can insert their own certificates" ON certificates;
DROP POLICY IF EXISTS "Students can update their own certificates" ON certificates;
DROP POLICY IF EXISTS "Admins can view all certificates"           ON certificates;

-- PROFILES
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE USING (is_admin());

-- COURSES (public read, admin write)
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT TO public USING (true);

CREATE POLICY "Admins can insert courses"
  ON courses FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update courses"
  ON courses FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete courses"
  ON courses FOR DELETE USING (is_admin());

-- LESSONS (public read, admin write)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage lessons"
  ON lessons FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PROGRESS
CREATE POLICY "Students can view their own progress"
  ON progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own progress"
  ON progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own progress"
  ON progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON progress FOR SELECT USING (is_admin());

-- CERTIFICATES
CREATE POLICY "Students can view their own certificates"
  ON certificates FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own certificates"
  ON certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own certificates"
  ON certificates FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all certificates"
  ON certificates FOR SELECT USING (is_admin());

-- =====================================================
-- DONE — No seed data. Admin adds courses via portal.
-- =====================================================

-- To manually set an account as admin after registering:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin81@gmail.com';
