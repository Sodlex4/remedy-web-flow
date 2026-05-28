-- ============================================================
-- Phase 9: Strict RLS — role checks & privilege escalation fix
-- ============================================================

-- ============================================================
-- 1. Strains — require admin/assistant role for all DML
-- ============================================================

DROP POLICY IF EXISTS "Peddlers can insert own strains" ON strains;
DROP POLICY IF EXISTS "Peddlers can update own strains" ON strains;
DROP POLICY IF EXISTS "Peddlers can delete own strains" ON strains;

CREATE POLICY "Peddlers can insert own strains"
  ON strains FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      peddler_id = auth.uid()
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'assistant'))
    )
    OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Peddlers can update own strains"
  ON strains FOR UPDATE
  TO authenticated
  USING (
    (
      peddler_id = auth.uid()
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'assistant'))
    )
    OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  )
  WITH CHECK (
    (
      peddler_id = auth.uid()
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'assistant'))
    )
    OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Peddlers can delete own strains"
  ON strains FOR DELETE
  TO authenticated
  USING (
    (
      peddler_id = auth.uid()
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'assistant'))
    )
    OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- ============================================================
-- 2. Profiles — prevent non-admin users from changing their role
-- ============================================================

CREATE OR REPLACE FUNCTION prevent_role_escalation()
RETURNS trigger AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
      RAISE EXCEPTION 'Only admins can change roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_role_escalation ON profiles;
CREATE TRIGGER prevent_role_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_escalation();
