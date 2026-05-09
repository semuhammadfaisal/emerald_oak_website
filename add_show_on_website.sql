-- Add show_on_website column to properties table
-- Run this in Supabase SQL Editor

ALTER TABLE properties ADD COLUMN IF NOT EXISTS show_on_website BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_properties_show_on_website ON properties(show_on_website);

-- Update RLS policy to allow public to view properties marked for website
DROP POLICY IF EXISTS "Public can view available properties" ON properties;

CREATE POLICY "Public can view website properties"
  ON properties FOR SELECT
  USING (show_on_website = true AND status = 'available');
