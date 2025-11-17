-- ============================================
-- Migration: Single Vendor Store (Dezemu)
-- Description: Convert multi-vendor to single vendor store
-- Date: 2025-11-17
-- ============================================

-- This migration is idempotent and can be run multiple times safely

-- ============================================
-- 1. Create sellers table
-- ============================================
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. Upsert default Dezemu seller
-- ============================================
-- Insert or update the default seller record
INSERT INTO public.sellers (id, name, logo_url)
VALUES (
  COALESCE(
    NULLIF(current_setting('app.single_seller_id', true), ''),
    'dezemu'
  ),
  'Dezemu',
  'https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  logo_url = EXCLUDED.logo_url;

-- ============================================
-- 3. Add seller_id column to products table
-- ============================================
-- Add seller_id column if it doesn't exist
-- Default to 'dezemu' for all products
-- Note: NOT NULL constraint is not enforced to avoid breaking existing data
-- Application should enforce this at the app level
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'products'
    AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE public.products
    ADD COLUMN seller_id TEXT DEFAULT 'dezemu';
    
    -- Add comment explaining enforcement strategy
    COMMENT ON COLUMN public.products.seller_id IS 
      'Seller ID for the product. Default is dezemu. NOT NULL enforcement recommended at application level to avoid breaking existing data.';
  END IF;
END $$;

-- ============================================
-- 4. Deprecate multi-vendor tables
-- ============================================
-- Rename multi-vendor tables by prefixing with deprecated_
-- Only rename if tables exist to avoid errors

-- Rename seller_applications if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_applications'
  ) THEN
    ALTER TABLE public.seller_applications RENAME TO deprecated_seller_applications;
  END IF;
END $$;

-- Rename seller_profiles if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_profiles'
  ) THEN
    ALTER TABLE public.seller_profiles RENAME TO deprecated_seller_profiles;
  END IF;
END $$;

-- Rename seller_reviews if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_reviews'
  ) THEN
    ALTER TABLE public.seller_reviews RENAME TO deprecated_seller_reviews;
  END IF;
END $$;

-- Rename product_sellers if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'product_sellers'
  ) THEN
    ALTER TABLE public.product_sellers RENAME TO deprecated_product_sellers;
  END IF;
END $$;

-- Rename seller_meta if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_meta'
  ) THEN
    ALTER TABLE public.seller_meta RENAME TO deprecated_seller_meta;
  END IF;
END $$;

-- Rename seller_roles if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_roles'
  ) THEN
    ALTER TABLE public.seller_roles RENAME TO deprecated_seller_roles;
  END IF;
END $$;

-- ============================================
-- ROLLBACK NOTES
-- ============================================
-- To rollback this migration, run the following SQL:
/*

-- 1. Remove seller_id column from products
ALTER TABLE public.products DROP COLUMN IF EXISTS seller_id;

-- 2. Restore multi-vendor tables
ALTER TABLE IF EXISTS public.deprecated_seller_applications RENAME TO seller_applications;
ALTER TABLE IF EXISTS public.deprecated_seller_profiles RENAME TO seller_profiles;
ALTER TABLE IF EXISTS public.deprecated_seller_reviews RENAME TO seller_reviews;
ALTER TABLE IF EXISTS public.deprecated_product_sellers RENAME TO product_sellers;
ALTER TABLE IF EXISTS public.deprecated_seller_meta RENAME TO seller_meta;
ALTER TABLE IF EXISTS public.deprecated_seller_roles RENAME TO seller_roles;

-- 3. Drop sellers table
DROP TABLE IF EXISTS public.sellers;

*/

-- ============================================
-- End of migration
-- ============================================
