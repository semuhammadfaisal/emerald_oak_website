-- =============================================
-- EMERALD OAK DATABASE SCHEMA FOR SUPABASE
-- =============================================
-- Run this SQL in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROPERTIES TABLE
-- =============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('house', 'plot', 'apartment', 'commercial')),
  size VARCHAR(50) NOT NULL,
  price VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
  description TEXT,
  features TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'planned')),
  completion INTEGER DEFAULT 0 CHECK (completion >= 0 AND completion <= 100),
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INQUIRIES TABLE
-- =============================================
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for properties and projects (for website)
CREATE POLICY "Public can view available properties"
  ON properties FOR SELECT
  USING (status = 'available');

CREATE POLICY "Public can view completed projects"
  ON projects FOR SELECT
  USING (status = 'completed');

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can do everything on properties"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can do everything on inquiries"
  ON inquiries FOR ALL
  USING (auth.role() = 'authenticated');

-- Allow public to insert inquiries (contact form)
CREATE POLICY "Public can insert inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- =============================================
-- STORAGE BUCKET FOR IMAGES
-- =============================================
-- Run this in Supabase Dashboard > Storage
-- Create a bucket named 'property-images'
-- Set it to public for read access

-- =============================================
-- SAMPLE DATA (OPTIONAL)
-- =============================================
-- Insert sample property
INSERT INTO properties (title, location, type, size, price, status, description, features, image_url)
VALUES (
  '7 Marla Brand New Designer House',
  'Multi Garden B-17, Islamabad',
  'house',
  '30x60',
  '1.5 Crore',
  'available',
  'Brand new designer house with modern amenities',
  '3 Bedrooms, 2 Bathrooms, Parking, Modern Kitchen',
  'https://via.placeholder.com/400x300'
);

-- Insert sample project
INSERT INTO projects (title, location, status, completion, description, image_url)
VALUES (
  'Luxury Villas Project',
  'DHA Phase 2, Islamabad',
  'ongoing',
  65,
  'Premium luxury villas with state-of-the-art facilities',
  'https://via.placeholder.com/400x300'
);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify setup
-- SELECT * FROM properties;
-- SELECT * FROM projects;
-- SELECT * FROM inquiries;

-- =============================================
-- SETUP COMPLETE!
-- =============================================
