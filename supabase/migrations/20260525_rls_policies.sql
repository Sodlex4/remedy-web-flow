-- Enable Row Level Security on pickup_requests
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a pickup request (customers don't need accounts)
CREATE POLICY "Anyone can insert pickup requests"
  ON pickup_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated admins can view pickup requests
CREATE POLICY "Admins can view all pickup requests"
  ON pickup_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admins can update pickup requests
CREATE POLICY "Admins can update pickup requests"
  ON pickup_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated admins can delete pickup requests
CREATE POLICY "Admins can delete pickup requests"
  ON pickup_requests
  FOR DELETE
  TO authenticated
  USING (true);
