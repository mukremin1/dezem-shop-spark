-- Single Vendor Mode Migration
-- This migration sets up the database for single-vendor mode with Dezemu as the default seller
-- All operations are idempotent and safe to run multiple times

-- ============================================================================
-- 1. Create sellers table if not exists
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on sellers table
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view sellers (public information)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sellers' 
    AND policyname = 'Sellers are viewable by everyone'
  ) THEN
    CREATE POLICY "Sellers are viewable by everyone"
      ON public.sellers FOR SELECT
      USING (true);
  END IF;
END $$;

-- Only admins can insert/update sellers
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sellers' 
    AND policyname = 'Admins can manage sellers'
  ) THEN
    CREATE POLICY "Admins can manage sellers"
      ON public.sellers FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM user_roles 
          WHERE user_id = auth.uid() AND role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_roles 
          WHERE user_id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================================
-- 2. Upsert Dezemu default seller
-- ============================================================================
-- Default seller logo as SVG data URL (orange Dezemu branding)
INSERT INTO public.sellers (id, name, logo_url, created_at, updated_at)
VALUES (
  'dezemu',
  'Dezemu',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGNjYwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNzIiIGZpbGw9IndoaXRlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+RDwvdGV4dD48L3N2Zz4=',
  now(),
  now()
)
ON CONFLICT (id) 
DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = now();

-- ============================================================================
-- 3. Add seller_id column to products table if it doesn't exist
-- ============================================================================
DO $$ 
BEGIN
  -- Check if seller_id column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'seller_id'
  ) THEN
    -- Add seller_id column with default value
    ALTER TABLE public.products 
    ADD COLUMN seller_id TEXT DEFAULT 'dezemu' REFERENCES public.sellers(id);
    
    -- Add comment explaining the default behavior
    COMMENT ON COLUMN public.products.seller_id IS 'Seller ID - defaults to dezemu for single-vendor mode. Application level will use environment variable SUPABASE_SINGLE_SELLER_ID or default to dezemu.';
  END IF;
END $$;

-- Update existing products to have dezemu as seller_id if NULL
UPDATE public.products 
SET seller_id = 'dezemu' 
WHERE seller_id IS NULL;

-- ============================================================================
-- 4. Rename multi-vendor tables to deprecated (if they exist)
-- ============================================================================
-- Check and rename seller_applications table
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'seller_applications'
  ) THEN
    ALTER TABLE IF EXISTS public.seller_applications 
    RENAME TO deprecated_seller_applications;
    
    COMMENT ON TABLE public.deprecated_seller_applications IS 'DEPRECATED: This table was part of multi-vendor functionality and is no longer used in single-vendor mode.';
  END IF;
END $$;

-- Check and rename seller_profiles table
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'seller_profiles'
  ) THEN
    ALTER TABLE IF EXISTS public.seller_profiles 
    RENAME TO deprecated_seller_profiles;
    
    COMMENT ON TABLE public.deprecated_seller_profiles IS 'DEPRECATED: This table was part of multi-vendor functionality and is no longer used in single-vendor mode.';
  END IF;
END $$;

-- Check and rename seller_reviews table
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'seller_reviews'
  ) THEN
    ALTER TABLE IF EXISTS public.seller_reviews 
    RENAME TO deprecated_seller_reviews;
    
    COMMENT ON TABLE public.deprecated_seller_reviews IS 'DEPRECATED: This table was part of multi-vendor functionality and is no longer used in single-vendor mode.';
  END IF;
END $$;

-- Check and rename product_sellers junction table
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'product_sellers'
  ) THEN
    ALTER TABLE IF EXISTS public.product_sellers 
    RENAME TO deprecated_product_sellers;
    
    COMMENT ON TABLE public.deprecated_product_sellers IS 'DEPRECATED: This table was part of multi-vendor functionality and is no longer used in single-vendor mode.';
  END IF;
END $$;

-- ============================================================================
-- 5. Create index on seller_id for better query performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_seller_id 
ON public.products(seller_id);

-- ============================================================================
-- Migration completed successfully
-- ============================================================================
-- This migration has:
-- 1. Created the sellers table with RLS policies
-- 2. Inserted/updated the default Dezemu seller
-- 3. Added seller_id column to products with default 'dezemu'
-- 4. Renamed any existing multi-vendor tables to deprecated_*
-- 5. Created appropriate indexes for performance
