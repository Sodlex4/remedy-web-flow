-- Add missing UPDATE/DELETE policies for contact_messages and feedback

-- ============================================================
-- contact_messages
-- ============================================================

-- Allow authenticated users to update contact messages (mark as read, etc.)
CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete contact messages
CREATE POLICY "Authenticated users can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- feedback
-- ============================================================

-- Allow authenticated users to update feedback
CREATE POLICY "Authenticated users can update feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete feedback
CREATE POLICY "Authenticated users can delete feedback"
  ON feedback FOR DELETE
  TO authenticated
  USING (true);
