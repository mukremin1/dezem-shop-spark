-- Migration: Single Vendor Mode
-- Description: Convert the Dezemu shop to single-vendor mode by adding a sellers table
--              and associating products with a default seller.
-- This migration is idempotent and can be run multiple times safely.

-- Step 1: Create sellers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Step 2: Upsert default seller 'dezemu'
-- Use environment variable if available, otherwise default to 'dezemu'
DO $$
DECLARE
  seller_id_val TEXT;
  logo_url_val TEXT;
BEGIN
  -- Try to get seller ID from app setting or environment variable, default to 'dezemu'
  BEGIN
    seller_id_val := current_setting('app.single_seller_id', true);
    IF seller_id_val IS NULL OR seller_id_val = '' THEN
      seller_id_val := 'dezemu';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      seller_id_val := 'dezemu';
  END;

  -- Set default logo URL (simple SVG data URL with "D" letter)
  logo_url_val := 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%234F46E5"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="60" fill="white" text-anchor="middle" dominant-baseline="central"%3ED%3C/text%3E%3C/svg%3E';

  -- Insert or update the default seller
  INSERT INTO public.sellers (id, name, logo_url, created_at)
  VALUES (seller_id_val, 'Dezemu', logo_url_val, now())
  ON CONFLICT (id) 
  DO UPDATE SET 
    name = EXCLUDED.name,
    logo_url = COALESCE(sellers.logo_url, EXCLUDED.logo_url),
    created_at = COALESCE(sellers.created_at, EXCLUDED.created_at);
END $$;

-- Step 3: Add seller_id column to products table if it doesn't exist
-- Note: We don't add NOT NULL constraint to avoid breaking existing data
-- Application-level enforcement is recommended
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE public.products 
    ADD COLUMN seller_id TEXT DEFAULT 'dezemu';
    
    -- Add comment to recommend app-level enforcement
    COMMENT ON COLUMN public.products.seller_id IS 
      'Seller ID reference. Recommend app-level enforcement for data integrity. Default is ''dezemu'' for single-vendor mode.';
  END IF;
END $$;

-- Step 4: Create index on seller_id for better query performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);

-- Step 5: Rename any existing multi-vendor tables to deprecated_ prefix
-- This makes the migration non-destructive by preserving old data
DO $$
DECLARE
  table_record RECORD;
  old_table_name TEXT;
  new_table_name TEXT;
BEGIN
  -- Check for common multi-vendor table names and rename them
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name IN ('vendors', 'vendor_products', 'vendor_settings', 'marketplace_vendors')
  LOOP
    old_table_name := table_record.table_name;
    new_table_name := 'deprecated_' || old_table_name;
    
    -- Check if the deprecated table name already exists
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = new_table_name
    ) THEN
      EXECUTE format('ALTER TABLE public.%I RENAME TO %I', old_table_name, new_table_name);
      RAISE NOTICE 'Renamed table % to %', old_table_name, new_table_name;
    ELSE
      RAISE NOTICE 'Table % already exists, skipping rename of %', new_table_name, old_table_name;
    END IF;
  END LOOP;
END $$;

-- Step 6: Enable RLS on sellers table if not already enabled
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Step 7: Add policies for sellers table (everyone can view sellers)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'sellers' 
      AND policyname = 'Sellers are viewable by everyone'
  ) THEN
    CREATE POLICY "Sellers are viewable by everyone"
    ON public.sellers FOR SELECT
    USING (true);
  END IF;
END $$;

-- Add comment on sellers table
COMMENT ON TABLE public.sellers IS 'Sellers/vendors table for single-vendor or multi-vendor mode. Currently configured for single-vendor (Dezemu).';
