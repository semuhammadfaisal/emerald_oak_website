-- =============================================
-- OFFICE INVENTORY TABLE
-- =============================================
-- Run this SQL in Supabase SQL Editor to add Office Inventory

CREATE TABLE office_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('plot', 'house')),
  plot_number VARCHAR(100) NOT NULL,
  block VARCHAR(50) NOT NULL,
  society VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  size VARCHAR(50) NOT NULL,
  purchase_price VARCHAR(100) NOT NULL,
  selling_price VARCHAR(100) NOT NULL,
  owner_name VARCHAR(255),
  owner_contact VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  sold_date DATE,
  sold_to VARCHAR(255),
  sold_contact VARCHAR(50),
  profit_loss VARCHAR(100),
  notes TEXT,
  documents TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_inventory_status ON office_inventory(status);
CREATE INDEX idx_inventory_type ON office_inventory(property_type);
CREATE INDEX idx_inventory_society ON office_inventory(society);
CREATE INDEX idx_inventory_created_at ON office_inventory(created_at DESC);

-- Add updated_at trigger
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON office_inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE office_inventory ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can access inventory
CREATE POLICY "Authenticated users can do everything on inventory"
  ON office_inventory FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- SAMPLE DATA (OPTIONAL)
-- =============================================
INSERT INTO office_inventory (
  property_type, plot_number, block, society, location, size, 
  purchase_price, selling_price, owner_name, owner_contact, status
) VALUES (
  'plot',
  '123',
  'F',
  'Multi Garden B-17',
  'Islamabad',
  '5 Marla',
  '50 Lac',
  '60 Lac',
  'John Doe',
  '0300-1234567',
  'available'
);
