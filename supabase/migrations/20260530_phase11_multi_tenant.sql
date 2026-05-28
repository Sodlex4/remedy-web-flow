-- ============================================================
-- Phase 11: Multi-Tenant Extraction — sellers table
-- ============================================================

-- 1. Create sellers table (the business entity)
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL DEFAULT '',
  whatsapp_number TEXT DEFAULT '',
  county TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  delivery_radius_km INTEGER DEFAULT 20,
  is_online BOOLEAN DEFAULT true,
  delivery_fee_per_km NUMERIC(10,2) DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Anyone can read sellers
CREATE POLICY "Anyone can view sellers"
  ON sellers FOR SELECT
  USING (true);

-- Sellers can update their own record
CREATE POLICY "Sellers can update own record"
  ON sellers FOR UPDATE
  TO authenticated
  USING (id IN (SELECT seller_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (id IN (SELECT seller_id FROM profiles WHERE id = auth.uid()));

-- 2. Migrate existing seller data from profiles to sellers
INSERT INTO sellers (id, business_name, whatsapp_number, county, bio, avatar_url, settings, latitude, longitude, delivery_radius_km, is_online)
SELECT
  id,
  business_name,
  whatsapp_number,
  county,
  bio,
  avatar_url,
  COALESCE(settings, '{}'::jsonb),
  latitude,
  longitude,
  COALESCE(delivery_radius_km, 20),
  COALESCE(is_online, true)
FROM profiles
WHERE business_name IS NOT NULL AND business_name != '';

-- 3. Add seller_id to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL;

-- Set seller_id for existing seller-owners (their seller record has the same UUID)
UPDATE profiles
SET seller_id = id
WHERE id IN (SELECT id FROM sellers);

-- 4. Rename peddler_id to seller_id on data tables
ALTER TABLE pickup_requests RENAME COLUMN peddler_id TO seller_id;
ALTER TABLE strains RENAME COLUMN peddler_id TO seller_id;
ALTER TABLE contact_messages RENAME COLUMN peddler_id TO seller_id;
ALTER TABLE feedback RENAME COLUMN peddler_id TO seller_id;

-- Update FK constraints to point to sellers
ALTER TABLE pickup_requests
  DROP CONSTRAINT IF EXISTS pickup_requests_peddler_id_fkey,
  ADD CONSTRAINT pickup_requests_seller_id_fkey
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE;

ALTER TABLE strains
  DROP CONSTRAINT IF EXISTS strains_peddler_id_fkey,
  ADD CONSTRAINT strains_seller_id_fkey
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE;

ALTER TABLE contact_messages
  DROP CONSTRAINT IF EXISTS contact_messages_peddler_id_fkey,
  ADD CONSTRAINT contact_messages_seller_id_fkey
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE;

ALTER TABLE feedback
  DROP CONSTRAINT IF EXISTS feedback_peddler_id_fkey,
  ADD CONSTRAINT feedback_seller_id_fkey
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE SET NULL;

-- 5. Drop business columns from profiles (now on sellers)
ALTER TABLE profiles
  DROP COLUMN IF EXISTS business_name,
  DROP COLUMN IF EXISTS whatsapp_number,
  DROP COLUMN IF EXISTS county,
  DROP COLUMN IF EXISTS bio,
  DROP COLUMN IF EXISTS avatar_url,
  DROP COLUMN IF EXISTS settings,
  DROP COLUMN IF EXISTS latitude,
  DROP COLUMN IF EXISTS longitude,
  DROP COLUMN IF EXISTS delivery_radius_km,
  DROP COLUMN IF EXISTS is_online;

-- 6. Index for geo queries on sellers
CREATE INDEX IF NOT EXISTS idx_sellers_location
  ON sellers (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 7. Haversine-based nearby seller function
CREATE OR REPLACE FUNCTION find_nearby_sellers(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION
)
RETURNS TABLE(
  id UUID,
  business_name TEXT,
  county TEXT,
  whatsapp_number TEXT,
  bio TEXT,
  avatar_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  delivery_radius_km INTEGER,
  is_online BOOLEAN,
  distance_km DOUBLE PRECISION,
  rating NUMERIC,
  delivery_fee_per_km NUMERIC
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.business_name,
    s.county,
    s.whatsapp_number,
    s.bio,
    s.avatar_url,
    s.latitude,
    s.longitude,
    s.delivery_radius_km,
    s.is_online,
    (6371 * acos(
      cos(radians(user_lat)) * cos(radians(s.latitude)) *
      cos(radians(s.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(s.latitude))
    ))::DOUBLE PRECISION AS distance_km,
    COALESCE(
      (SELECT AVG(f.rating)::NUMERIC(3,2)
       FROM feedback f
       WHERE f.seller_id = s.id
      ),
      0
    )::NUMERIC(3,2) AS rating,
    s.delivery_fee_per_km
  FROM sellers s
  WHERE s.business_name IS NOT NULL
    AND s.business_name != ''
    AND s.latitude IS NOT NULL
    AND s.longitude IS NOT NULL
    AND s.is_online = true
    AND (
      (6371 * acos(
        cos(radians(user_lat)) * cos(radians(s.latitude)) *
        cos(radians(s.longitude) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(s.latitude))
      )) <= s.delivery_radius_km
    )
  ORDER BY distance_km ASC;
END;
$$;

-- 8. Function to find sellers by county (fallback)
CREATE OR REPLACE FUNCTION find_sellers_by_county(
  p_county TEXT
)
RETURNS TABLE(
  id UUID,
  business_name TEXT,
  county TEXT,
  whatsapp_number TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_online BOOLEAN,
  rating NUMERIC
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.business_name,
    s.county,
    s.whatsapp_number,
    s.bio,
    s.avatar_url,
    s.is_online,
    COALESCE(
      (SELECT AVG(f.rating)::NUMERIC(3,2)
       FROM feedback f
       WHERE f.seller_id = s.id
      ),
      0
    )::NUMERIC(3,2) AS rating
  FROM sellers s
  WHERE s.business_name IS NOT NULL
    AND s.business_name != ''
    AND s.county ILIKE p_county
  ORDER BY s.is_online DESC, s.business_name ASC;
END;
$$;

-- 9. Drop old phase11 artifacts if they exist
DROP INDEX IF EXISTS idx_profiles_location;

-- 10. Update RLS for pickup_requests — multi-tenant scoped
DROP POLICY IF EXISTS "Anyone can insert pickup requests" ON pickup_requests;
DROP POLICY IF EXISTS "Peddlers can view own pickup requests" ON pickup_requests;
DROP POLICY IF EXISTS "Peddlers can update own pickup requests" ON pickup_requests;
DROP POLICY IF EXISTS "Peddlers can delete own pickup requests" ON pickup_requests;

CREATE POLICY "Anyone can insert pickup requests"
  ON pickup_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view their seller's pickup requests"
  ON pickup_requests FOR SELECT
  TO authenticated
  USING (
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Staff can update their seller's pickup requests"
  ON pickup_requests FOR UPDATE
  TO authenticated
  USING (
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Staff can delete their seller's pickup requests"
  ON pickup_requests FOR DELETE
  TO authenticated
  USING (
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  );

-- 11. Update RLS for strains — multi-tenant scoped
DROP POLICY IF EXISTS "Anyone can view strains" ON strains;
DROP POLICY IF EXISTS "Peddlers can insert own strains" ON strains;
DROP POLICY IF EXISTS "Peddlers can update own strains" ON strains;
DROP POLICY IF EXISTS "Peddlers can delete own strains" ON strains;

CREATE POLICY "Anyone can view strains"
  ON strains FOR SELECT
  USING (true);

CREATE POLICY "Staff can insert strains for their seller"
  ON strains FOR INSERT
  TO authenticated
  WITH CHECK (
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Staff can update strains for their seller"
  ON strains FOR UPDATE
  TO authenticated
  USING (
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Staff can delete strains for their seller"
  ON strains FOR DELETE
  TO authenticated
  USING (
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  );

-- 12. Update RLS for contact_messages — multi-tenant scoped
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can read contact messages" ON contact_messages;

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can read their seller's contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  );

-- 13. Update RLS for feedback
DROP POLICY IF EXISTS "Anyone can insert feedback" ON feedback;
DROP POLICY IF EXISTS "Authenticated users can read feedback" ON feedback;

CREATE POLICY "Anyone can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can read their seller's feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  );

-- 14. Update profiles RLS — allow reading own profile and teammates
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    seller_id IN (SELECT seller_id FROM profiles WHERE id = auth.uid())
  );

-- 15. Auto-register seller when a new auth user signs up with role='seller_admin'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role TEXT;
  v_business_name TEXT;
  v_seller_id UUID;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'viewer');
  v_business_name := COALESCE(NEW.raw_user_meta_data->>'business_name', '');

  IF v_role = 'seller_admin' AND v_business_name != '' THEN
    INSERT INTO public.sellers (id, business_name)
    VALUES (NEW.id, v_business_name)
    RETURNING id INTO v_seller_id;

    INSERT INTO public.profiles (id, name, role, seller_id)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), 'admin', v_seller_id);
  ELSE
    INSERT INTO public.profiles (id, name, role)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), v_role);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
