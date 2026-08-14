-- DHAMME Real Estate Jigjiga Master Supabase SQL Schema V2
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/lbmsdvnqtabwwspeobch/sql

-- 1. Create or Upgrade Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price_etb NUMERIC NOT NULL,
  mode TEXT NOT NULL DEFAULT 'kiro', -- 'kiro' or 'iib'
  category TEXT NOT NULL DEFAULT 'Family House',
  city TEXT NOT NULL DEFAULT 'Jigjiga',
  kebele TEXT NOT NULL DEFAULT 'Kebele 06',
  beds INT DEFAULT 3,
  baths INT DEFAULT 2,
  area_sqm INT DEFAULT 180,
  water TEXT DEFAULT 'Yes',
  electricity TEXT DEFAULT '24h',
  pool TEXT DEFAULT 'No',
  is_featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  agent_name TEXT DEFAULT 'Landlord',
  agent_phone TEXT DEFAULT '+251 91 000 0000',
  agent_avatar TEXT,
  owner_email TEXT,
  owner_id TEXT,
  views_count INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing properties table columns if missing
ALTER TABLE properties ADD COLUMN IF NOT EXISTS owner_email TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS owner_id TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 1;

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT 'DHAMME User',
  role TEXT DEFAULT 'user', -- 'user', 'landlord', 'agent', 'admin'
  is_verified BOOLEAN DEFAULT true,
  joined_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  property_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_email, property_id)
);

-- 4. Create Property Inquiries & Messages Table
CREATE TABLE IF NOT EXISTS property_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id TEXT,
  property_title TEXT,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_email TEXT,
  agent_email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'read', 'contacted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security (RLS) & Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access to properties
DROP POLICY IF EXISTS "Allow public read properties" ON properties;
CREATE POLICY "Allow public read properties" ON properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert properties" ON properties;
CREATE POLICY "Allow public insert properties" ON properties FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update properties" ON properties;
CREATE POLICY "Allow public update properties" ON properties FOR UPDATE USING (true);

-- Allow public read & write access to user_profiles
DROP POLICY IF EXISTS "Allow public read user_profiles" ON user_profiles;
CREATE POLICY "Allow public read user_profiles" ON user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert user_profiles" ON user_profiles;
CREATE POLICY "Allow public insert user_profiles" ON user_profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update user_profiles" ON user_profiles;
CREATE POLICY "Allow public update user_profiles" ON user_profiles FOR UPDATE USING (true);

-- Allow public read & write access to favorites
DROP POLICY IF EXISTS "Allow public read favorites" ON favorites;
CREATE POLICY "Allow public read favorites" ON favorites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert favorites" ON favorites;
CREATE POLICY "Allow public insert favorites" ON favorites FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete favorites" ON favorites;
CREATE POLICY "Allow public delete favorites" ON favorites FOR DELETE USING (true);

-- Allow public read & write access to property_inquiries
DROP POLICY IF EXISTS "Allow public read property_inquiries" ON property_inquiries;
CREATE POLICY "Allow public read property_inquiries" ON property_inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert property_inquiries" ON property_inquiries;
CREATE POLICY "Allow public insert property_inquiries" ON property_inquiries FOR INSERT WITH CHECK (true);
