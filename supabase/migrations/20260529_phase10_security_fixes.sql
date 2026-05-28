-- ============================================================
-- Phase 10: Security fixes — restrict permissive policies
-- ============================================================

-- ============================================================
-- 1. Restrict contact_messages UPDATE/DELETE to admin/assistant
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can delete contact messages" ON contact_messages;

CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

-- ============================================================
-- 2. Restrict feedback UPDATE/DELETE to admin/assistant
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can update feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON feedback;

CREATE POLICY "Admins can update feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

DROP POLICY IF EXISTS "Authenticated users can delete feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can delete feedback" ON feedback;

CREATE POLICY "Admins can delete feedback"
  ON feedback FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

-- ============================================================
-- 3. Add assistant role to pickup_requests policies
-- ============================================================

DROP POLICY IF EXISTS "Peddlers can view own pickup requests" ON pickup_requests;
DROP POLICY IF EXISTS "Peddlers can update own pickup requests" ON pickup_requests;
DROP POLICY IF EXISTS "Peddlers can delete own pickup requests" ON pickup_requests;

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
