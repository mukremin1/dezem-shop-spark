-- Single Vendor Migration
-- This migration creates the sellers table, inserts a default seller,
-- adds seller_id to products, and deprecates multi-vendor tables if they exist.
-- This migration is idempotent and safe to run multiple times.

-- Create sellers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on sellers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'sellers'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policy for sellers to be viewable by everyone
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

-- Function to generate a default logo as a data URL (simple SVG placeholder)
CREATE OR REPLACE FUNCTION generate_default_logo()
RETURNS TEXT AS $$
BEGIN
  -- Generate a simple SVG logo as a data URL
  RETURN 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzQyODVGNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5EPC90ZXh0Pjwvc3ZnPg==';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get single seller ID from environment or default to 'dezemu'
DO $$
DECLARE
  v_seller_id TEXT;
  v_seller_name TEXT := 'Dezemu';
  v_logo_url TEXT;
  v_env_logo_url TEXT;
BEGIN
  -- Try to get seller ID from app setting, default to 'dezemu'
  BEGIN
    v_seller_id := COALESCE(current_setting('app.single_seller_id', true), 'dezemu');
  EXCEPTION
    WHEN OTHERS THEN
      v_seller_id := 'dezemu';
  END;

  -- Try to get logo URL from app setting
  BEGIN
    v_env_logo_url := current_setting('app.default_seller_logo_url', true);
  EXCEPTION
    WHEN OTHERS THEN
      v_env_logo_url := NULL;
  END;

  -- Use environment logo URL or generate default
  v_logo_url := COALESCE(v_env_logo_url, generate_default_logo());

  -- Insert or update the default seller
  INSERT INTO public.sellers (id, name, logo_url, created_at)
  VALUES (v_seller_id, v_seller_name, v_logo_url, now())
  ON CONFLICT (id) 
  DO UPDATE SET 
    name = EXCLUDED.name,
    logo_url = COALESCE(public.sellers.logo_url, EXCLUDED.logo_url);
END $$;

-- Add seller_id column to products table if it doesn't exist
DO $$
DECLARE
  v_seller_id TEXT;
  v_column_exists BOOLEAN;
  v_products_exists BOOLEAN;
BEGIN
  -- Check if products table exists
  SELECT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'products'
  ) INTO v_products_exists;

  IF v_products_exists THEN
    -- Check if seller_id column already exists
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'seller_id'
    ) INTO v_column_exists;

    IF NOT v_column_exists THEN
      -- Get the seller ID
      BEGIN
        v_seller_id := COALESCE(current_setting('app.single_seller_id', true), 'dezemu');
      EXCEPTION
        WHEN OTHERS THEN
          v_seller_id := 'dezemu';
      END;

      -- Add the column with default value
      EXECUTE format('ALTER TABLE public.products ADD COLUMN seller_id TEXT DEFAULT %L', v_seller_id);
      
      -- Try to set NOT NULL constraint
      -- First, update any NULL values to the default seller_id
      EXECUTE format('UPDATE public.products SET seller_id = %L WHERE seller_id IS NULL', v_seller_id);
      
      -- Then try to add NOT NULL constraint
      BEGIN
        ALTER TABLE public.products ALTER COLUMN seller_id SET NOT NULL;
      EXCEPTION
        WHEN OTHERS THEN
          -- If setting NOT NULL fails, add a comment explaining why
          COMMENT ON COLUMN public.products.seller_id IS 'Seller ID - nullable due to migration safety, should ideally be NOT NULL';
      END;

      -- Add foreign key constraint to sellers table
      BEGIN
        ALTER TABLE public.products ADD CONSTRAINT fk_products_seller 
        FOREIGN KEY (seller_id) REFERENCES public.sellers(id);
      EXCEPTION
        WHEN duplicate_object THEN
          -- Constraint already exists, skip
          NULL;
      END;

      -- Create index on seller_id for better query performance
      BEGIN
        CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
      EXCEPTION
        WHEN duplicate_table THEN
          -- Index already exists, skip
          NULL;
      END;
    END IF;
  END IF;
END $$;

-- Rename multi-vendor tables to deprecated_ if they exist
-- This preserves existing data while marking tables as deprecated

-- Rename seller_applications table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'seller_applications'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'deprecated_seller_applications'
  ) THEN
    ALTER TABLE public.seller_applications RENAME TO deprecated_seller_applications;
  END IF;
END $$;

-- Rename seller_profiles table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'seller_profiles'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'deprecated_seller_profiles'
  ) THEN
    ALTER TABLE public.seller_profiles RENAME TO deprecated_seller_profiles;
  END IF;
END $$;

-- Rename seller_reviews table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'seller_reviews'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'deprecated_seller_reviews'
  ) THEN
    ALTER TABLE public.seller_reviews RENAME TO deprecated_seller_reviews;
  END IF;
END $$;

-- Rename seller_roles table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'seller_roles'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'deprecated_seller_roles'
  ) THEN
    ALTER TABLE public.seller_roles RENAME TO deprecated_seller_roles;
  END IF;
END $$;

-- Rename product_sellers table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'product_sellers'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'deprecated_product_sellers'
  ) THEN
    ALTER TABLE public.product_sellers RENAME TO deprecated_product_sellers;
  END IF;
END $$;

-- Rename seller_meta table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'seller_meta'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'deprecated_seller_meta'
  ) THEN
    ALTER TABLE public.seller_meta RENAME TO deprecated_seller_meta;
  END IF;
END $$;

-- Add comment to migration
COMMENT ON TABLE public.sellers IS 'Single vendor sellers table - contains the default Dezemu seller';
