-- Migration: Convert to Single Vendor (Dezemu)
-- This migration converts the multi-vendor shop to a single-vendor store
-- All changes are non-destructive and preserve existing data

-- ============================================================================
-- 1. CREATE SELLERS TABLE (if not exists)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 2. UPSERT DEFAULT SELLER (Dezemu)
-- ============================================================================
-- Insert or update the default seller
-- Uses environment variable SUPABASE_SINGLE_SELLER_ID or defaults to 'dezemu'
INSERT INTO public.sellers (id, name, logo_url, created_at)
VALUES (
  COALESCE(current_setting('app.single_seller_id', true), 'dezemu'),
  COALESCE(current_setting('app.default_seller_name', true), 'Dezemu'),
  COALESCE(
    current_setting('app.default_seller_logo_url', true),
    'https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff'
  ),
  now()
)
ON CONFLICT (id) 
DO UPDATE SET 
  name = EXCLUDED.name,
  logo_url = EXCLUDED.logo_url;

-- ============================================================================
-- 3. ADD SELLER_ID COLUMN TO PRODUCTS TABLE (if not exists)
-- ============================================================================
-- Add seller_id column with default value
-- Do NOT enforce NOT NULL to allow graceful migration
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
    
    -- Add comment recommending app-level enforcement
    COMMENT ON COLUMN public.products.seller_id IS 
      'Seller ID for single-vendor mode. Defaults to "dezemu". App should enforce this field.';
  END IF;
END $$;

-- ============================================================================
-- 4. RENAME MULTI-VENDOR TABLES TO deprecated_*
-- ============================================================================
-- Safely rename multi-vendor tables if they exist
-- This preserves data for potential rollback

-- Rename seller_applications if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_applications'
  ) THEN
    ALTER TABLE public.seller_applications 
    RENAME TO deprecated_seller_applications;
  END IF;
END $$;

-- Rename seller_profiles if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_profiles'
  ) THEN
    ALTER TABLE public.seller_profiles 
    RENAME TO deprecated_seller_profiles;
  END IF;
END $$;

-- Rename seller_reviews if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_reviews'
  ) THEN
    ALTER TABLE public.seller_reviews 
    RENAME TO deprecated_seller_reviews;
  END IF;
END $$;

-- Rename product_sellers if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'product_sellers'
  ) THEN
    ALTER TABLE public.product_sellers 
    RENAME TO deprecated_product_sellers;
  END IF;
END $$;

-- Rename seller_meta if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_meta'
  ) THEN
    ALTER TABLE public.seller_meta 
    RENAME TO deprecated_seller_meta;
  END IF;
END $$;

-- Rename seller_roles if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_roles'
  ) THEN
    ALTER TABLE public.seller_roles 
    RENAME TO deprecated_seller_roles;
  END IF;
END $$;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (commented)
-- ============================================================================
/*
-- To rollback this migration:

-- 1. Restore multi-vendor tables
ALTER TABLE public.deprecated_seller_applications RENAME TO seller_applications;
ALTER TABLE public.deprecated_seller_profiles RENAME TO seller_profiles;
ALTER TABLE public.deprecated_seller_reviews RENAME TO seller_reviews;
ALTER TABLE public.deprecated_product_sellers RENAME TO product_sellers;
ALTER TABLE public.deprecated_seller_meta RENAME TO seller_meta;
ALTER TABLE public.deprecated_seller_roles RENAME TO seller_roles;

-- 2. Remove seller_id column from products (optional - will lose data)
-- ALTER TABLE public.products DROP COLUMN seller_id;

-- 3. Remove sellers table (optional)
-- DROP TABLE public.sellers;

-- Note: Before rolling back, ensure you backup any data added after migration
*/
