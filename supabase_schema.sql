-- Create properties table for DHAMME Jigjiga Real Estate
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access to property listings
CREATE POLICY "Allow public read properties" ON properties FOR SELECT USING (true);

-- Allow authenticated/public insert for posting properties
CREATE POLICY "Allow public insert properties" ON properties FOR INSERT WITH CHECK (true);
