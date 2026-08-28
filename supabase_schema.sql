-- ==============================================================================
-- DHAMME REAL ESTATE MARKETPLACE - MASTER SUPABASE POSTGRESQL SCHEMA V3
-- ==============================================================================
-- Direct Dashboard SQL Editor Link:
-- https://supabase.com/dashboard/project/lbmsdvnqtabwwspeobch/sql
--
-- Instructions: Copy and paste this ENTIRE script into your Supabase SQL Editor and click "RUN".
-- ==============================================================================

-- 1. PROPERTIES TABLE (Houses, Villas, Apartments in Jigjiga)
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price_etb NUMERIC NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'kiro', -- 'kiro' (Rent) or 'iib' (Sale)
  category TEXT NOT NULL DEFAULT 'Family House',
  city TEXT NOT NULL DEFAULT 'Jigjiga',
  kebele TEXT NOT NULL DEFAULT 'Kebele 06',
  beds INT DEFAULT 3,
  baths INT DEFAULT 2,
  area_sqm INT DEFAULT 180,
  water TEXT DEFAULT 'Yes',
  electricity TEXT DEFAULT '24h',
  pool TEXT DEFAULT 'No',
  is_featured BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  video_thumbnail TEXT,
  video_duration INT DEFAULT 0,
  video_status TEXT DEFAULT 'active',
  description TEXT DEFAULT '',
  agent_name TEXT DEFAULT 'Landlord',
  agent_phone TEXT DEFAULT '+251 91 000 0000',
  agent_avatar TEXT,
  owner_email TEXT,
  owner_id TEXT,
  gps_coords TEXT,
  near_distance TEXT,
  lat NUMERIC DEFAULT 9.3524,
  lng NUMERIC DEFAULT 42.7961,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'sold', 'rented'
  views_count INT DEFAULT 1,
  inquiries_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing properties columns if any are missing
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS water TEXT DEFAULT 'Yes';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS electricity TEXT DEFAULT '24h';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS pool TEXT DEFAULT 'No';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT true;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_thumbnail TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_duration INT DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_status TEXT DEFAULT 'active';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS owner_email TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS owner_id TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS gps_coords TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS near_distance TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lat NUMERIC DEFAULT 9.3524;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lng NUMERIC DEFAULT 42.7961;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 1;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS inquiries_count INT DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- High Performance Search Indexes
CREATE INDEX IF NOT EXISTS idx_properties_mode_city ON public.properties(mode, city);
CREATE INDEX IF NOT EXISTS idx_properties_kebele ON public.properties(kebele);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price_etb);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);


-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT 'DHAMME User',
  role TEXT DEFAULT 'user', -- 'user', 'landlord', 'agent', 'admin'
  is_verified BOOLEAN DEFAULT true,
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  property_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_email, property_id)
);

-- 4. PROPERTY INQUIRIES & DIRECT CONTACT TABLE
CREATE TABLE IF NOT EXISTS public.property_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id TEXT,
  property_title TEXT,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_email TEXT,
  agent_email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. AUDIT ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_title TEXT,
  actor_email TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);


-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES (Public read & write access)
-- ==============================================================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Properties Policies
DROP POLICY IF EXISTS "Public select properties" ON public.properties;
CREATE POLICY "Public select properties" ON public.properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert properties" ON public.properties;
CREATE POLICY "Public insert properties" ON public.properties FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update properties" ON public.properties;
CREATE POLICY "Public update properties" ON public.properties FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete properties" ON public.properties;
CREATE POLICY "Public delete properties" ON public.properties FOR DELETE USING (true);

-- User Profiles Policies
DROP POLICY IF EXISTS "Public select user_profiles" ON public.user_profiles;
CREATE POLICY "Public select user_profiles" ON public.user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert user_profiles" ON public.user_profiles;
CREATE POLICY "Public insert user_profiles" ON public.user_profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update user_profiles" ON public.user_profiles;
CREATE POLICY "Public update user_profiles" ON public.user_profiles FOR UPDATE USING (true);

-- Favorites Policies
DROP POLICY IF EXISTS "Public select favorites" ON public.favorites;
CREATE POLICY "Public select favorites" ON public.favorites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert favorites" ON public.favorites;
CREATE POLICY "Public insert favorites" ON public.favorites FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete favorites" ON public.favorites;
CREATE POLICY "Public delete favorites" ON public.favorites FOR DELETE USING (true);

-- Inquiries Policies
DROP POLICY IF EXISTS "Public select property_inquiries" ON public.property_inquiries;
CREATE POLICY "Public select property_inquiries" ON public.property_inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert property_inquiries" ON public.property_inquiries;
CREATE POLICY "Public insert property_inquiries" ON public.property_inquiries FOR INSERT WITH CHECK (true);

-- Activity Logs Policies
DROP POLICY IF EXISTS "Public select activity_logs" ON public.activity_logs;
CREATE POLICY "Public select activity_logs" ON public.activity_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert activity_logs" ON public.activity_logs;
CREATE POLICY "Public insert activity_logs" ON public.activity_logs FOR INSERT WITH CHECK (true);
