-- ============================================================================
-- Migration: 0001_single_vendor.sql
-- Description: Convert multi-vendor shop to single-vendor (Dezemu)
-- Author: Dezemu Team
-- Date: 2025-11-17
-- ============================================================================

-- This migration is idempotent and can be run multiple times safely

-- ============================================================================
-- 1. CREATE SELLERS TABLE
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
-- Use app setting for seller_id if available, otherwise default to 'dezemu'
DO $$
DECLARE
  v_seller_id TEXT;
  v_seller_name TEXT := 'Dezemu';
  v_logo_url TEXT := 'https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff';
BEGIN
  -- Try to get seller_id from app setting, fallback to 'dezemu'
  BEGIN
    v_seller_id := coalesce(current_setting('app.single_seller_id', true)::text, 'dezemu');
  EXCEPTION WHEN OTHERS THEN
    v_seller_id := 'dezemu';
  END;

  -- Try to get logo URL from env, fallback to generated avatar
  BEGIN
    v_logo_url := coalesce(current_setting('app.default_seller_logo_url', true)::text, v_logo_url);
  EXCEPTION WHEN OTHERS THEN
    -- Keep default value
  END;

  -- Insert or update seller record
  INSERT INTO public.sellers (id, name, logo_url, created_at)
  VALUES (v_seller_id, v_seller_name, v_logo_url, now())
  ON CONFLICT (id) 
  DO UPDATE SET 
    name = EXCLUDED.name,
    logo_url = EXCLUDED.logo_url;

  RAISE NOTICE 'Seller % upserted successfully', v_seller_id;
END $$;

-- ============================================================================
-- 3. ADD SELLER_ID TO PRODUCTS TABLE
-- ============================================================================
-- Check if seller_id column exists before adding it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'seller_id'
  ) THEN
    -- Add seller_id column with default value
    ALTER TABLE public.products 
    ADD COLUMN seller_id TEXT DEFAULT 'dezemu';
    
    RAISE NOTICE 'Added seller_id column to products table';
  ELSE
    RAISE NOTICE 'seller_id column already exists in products table';
  END IF;
END $$;

-- Add comment recommending app-level enforcement
COMMENT ON COLUMN public.products.seller_id IS 
  'Seller identifier. NOT NULL constraint not enforced at database level - enforce at application level for better flexibility.';

-- ============================================================================
-- 4. RENAME MULTI-VENDOR TABLES TO DEPRECATED
-- ============================================================================
-- Rename known multi-vendor tables if they exist

-- Rename seller_applications
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_applications'
  ) THEN
    ALTER TABLE public.seller_applications RENAME TO deprecated_seller_applications;
    RAISE NOTICE 'Renamed seller_applications to deprecated_seller_applications';
  ELSE
    RAISE NOTICE 'seller_applications table does not exist, skipping';
  END IF;
END $$;

-- Rename seller_profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_profiles'
  ) THEN
    ALTER TABLE public.seller_profiles RENAME TO deprecated_seller_profiles;
    RAISE NOTICE 'Renamed seller_profiles to deprecated_seller_profiles';
  ELSE
    RAISE NOTICE 'seller_profiles table does not exist, skipping';
  END IF;
END $$;

-- Rename seller_reviews
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_reviews'
  ) THEN
    ALTER TABLE public.seller_reviews RENAME TO deprecated_seller_reviews;
    RAISE NOTICE 'Renamed seller_reviews to deprecated_seller_reviews';
  ELSE
    RAISE NOTICE 'seller_reviews table does not exist, skipping';
  END IF;
END $$;

-- Rename product_sellers
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'product_sellers'
  ) THEN
    ALTER TABLE public.product_sellers RENAME TO deprecated_product_sellers;
    RAISE NOTICE 'Renamed product_sellers to deprecated_product_sellers';
  ELSE
    RAISE NOTICE 'product_sellers table does not exist, skipping';
  END IF;
END $$;

-- Rename seller_meta
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_meta'
  ) THEN
    ALTER TABLE public.seller_meta RENAME TO deprecated_seller_meta;
    RAISE NOTICE 'Renamed seller_meta to deprecated_seller_meta';
  ELSE
    RAISE NOTICE 'seller_meta table does not exist, skipping';
  END IF;
END $$;

-- Rename seller_roles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'seller_roles'
  ) THEN
    ALTER TABLE public.seller_roles RENAME TO deprecated_seller_roles;
    RAISE NOTICE 'Renamed seller_roles to deprecated_seller_roles';
  ELSE
    RAISE NOTICE 'seller_roles table does not exist, skipping';
  END IF;
END $$;

-- ============================================================================
-- ROLLBACK NOTES (DO NOT EXECUTE - FOR DOCUMENTATION ONLY)
-- ============================================================================
/*
To rollback this migration, execute the following SQL commands:

-- 1. Remove seller_id column from products
ALTER TABLE public.products DROP COLUMN IF EXISTS seller_id;

-- 2. Drop sellers table
DROP TABLE IF EXISTS public.sellers;

-- 3. Restore renamed tables (if they were renamed)
ALTER TABLE IF EXISTS public.deprecated_seller_applications RENAME TO seller_applications;
ALTER TABLE IF EXISTS public.deprecated_seller_profiles RENAME TO seller_profiles;
ALTER TABLE IF EXISTS public.deprecated_seller_reviews RENAME TO seller_reviews;
ALTER TABLE IF EXISTS public.deprecated_product_sellers RENAME TO product_sellers;
ALTER TABLE IF EXISTS public.deprecated_seller_meta RENAME TO seller_meta;
ALTER TABLE IF EXISTS public.deprecated_seller_roles RENAME TO seller_roles;

Note: Rollback should be performed carefully and only if necessary.
Data in the sellers table will be lost.
*/
