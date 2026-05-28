-- Add missing UPDATE/DELETE policies for contact_messages and feedback

-- ============================================================
-- contact_messages
-- ============================================================

-- Allow admin/assistant only to update contact messages (mark as read, etc.)
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

-- Allow admin/assistant only to delete contact messages
DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;
CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

-- ============================================================
-- feedback
-- ============================================================

-- Allow admin/assistant only to update feedback
DROP POLICY IF EXISTS "Authenticated users can update feedback" ON feedback;
CREATE POLICY "Admins can update feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );

-- Allow admin/assistant only to delete feedback
DROP POLICY IF EXISTS "Authenticated users can delete feedback" ON feedback;
CREATE POLICY "Admins can delete feedback"
  ON feedback FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'assistant'))
  );
