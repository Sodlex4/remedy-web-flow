-- ============================================================
-- Phase 1: Multi-Peddler / Multi-County Schema
-- ============================================================

-- 1. Expand profiles table with peddler-specific fields
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS business_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS county TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';

-- 2. Add peddler_id and county to pickup_requests
ALTER TABLE pickup_requests
  ADD COLUMN IF NOT EXISTS peddler_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS county TEXT DEFAULT '';

-- 3. Create per-peddler strains table
CREATE TABLE IF NOT EXISTS strains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peddler_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Indica', 'Sativa', 'Hybrid', 'Edibles', 'Accessories')),
  thc TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT DEFAULT '/placeholder.svg',
  effects TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  flavor TEXT DEFAULT '',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE strains ENABLE ROW LEVEL SECURITY;

-- 4. Update RLS for pickup_requests — peddlers see only their own
DROP POLICY IF EXISTS "Admins can view all pickup requests" ON pickup_requests;
DROP POLICY IF EXISTS "Admins can update pickup requests" ON pickup_requests;
DROP POLICY IF EXISTS "Admins can delete pickup requests" ON pickup_requests;

CREATE POLICY "Peddlers can view own pickup requests"
  ON pickup_requests FOR SELECT
  TO authenticated
  USING (
    peddler_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

CREATE POLICY "Peddlers can update own pickup requests"
  ON pickup_requests FOR UPDATE
  TO authenticated
  USING (
    peddler_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  )
  WITH CHECK (
    peddler_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

CREATE POLICY "Peddlers can delete own pickup requests"
  ON pickup_requests FOR DELETE
  TO authenticated
  USING (
    peddler_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

-- 5. RLS for strains — anyone can view, only peddler/admin can manage
CREATE POLICY "Anyone can view strains"
  ON strains FOR SELECT
  USING (true);

CREATE POLICY "Peddlers can insert own strains"
  ON strains FOR INSERT
  TO authenticated
  WITH CHECK (
    peddler_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Peddlers can update own strains"
  ON strains FOR UPDATE
  TO authenticated
  USING (
    peddler_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Peddlers can delete own strains"
  ON strains FOR DELETE
  TO authenticated
  USING (
    peddler_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- 6. Update profiles RLS — allow peddlers to update own profile
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- 7. Seed default strains for existing admin (Nature's Remedy)
-- This inserts the 8 standard strains for the super admin peddler
-- Run this manually after identifying the admin UUID:
-- INSERT INTO strains (peddler_id, name, type, thc, price, effects, description, flavor)
-- SELECT id, 'Blue Dream', 'Hybrid', '18-24%', 1600, ARRAY['Euphoric','Creative','Relaxed'], 'California\'s most popular hybrid with sweet berry flavors', 'Sweet Berry'
-- FROM profiles WHERE role = 'admin' LIMIT 1;
