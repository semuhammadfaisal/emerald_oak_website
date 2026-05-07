-- Add image_urls column to office_inventory table
-- Run this in Supabase SQL Editor

ALTER TABLE office_inventory ADD COLUMN IF NOT EXISTS image_urls TEXT;
