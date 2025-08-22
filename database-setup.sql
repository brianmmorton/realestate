-- Real Estate App Database Setup
-- Copy and paste this into your Supabase SQL Editor

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  address TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_feet DECIMAL(10,2),
  image_url TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all properties" 
  ON properties FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own properties" 
  ON properties FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own properties" 
  ON properties FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own properties" 
  ON properties FOR DELETE 
  USING (auth.uid() = owner_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS properties_owner_id_idx ON properties(owner_id);
CREATE INDEX IF NOT EXISTS properties_price_idx ON properties(price);
CREATE INDEX IF NOT EXISTS properties_created_at_idx ON properties(created_at);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Insert some sample data (uncomment if you want sample properties)
/*
INSERT INTO properties (title, description, price, address, bedrooms, bathrooms, square_feet, image_url)
VALUES 
  ('Beautiful Family Home', 'A spacious 3-bedroom house perfect for families', 450000.00, '123 Oak Street, Springfield', 3, 2, 1800.00, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994'),
  ('Modern Downtown Condo', 'Luxury condo in the heart of the city', 320000.00, '456 City Center Ave, Metro City', 2, 2, 1200.00, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'),
  ('Cozy Starter Home', 'Perfect first home with great potential', 275000.00, '789 Maple Drive, Suburbia', 2, 1, 950.00, 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83');
*/ 