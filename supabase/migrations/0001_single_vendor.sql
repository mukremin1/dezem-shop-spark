-- Migration: Convert to Single Vendor Store (Dezemu)
-- Description: Non-destructive migration to support single-vendor mode
-- Created: 2025-11-17
-- Rollback: See rollback notes at end of file

-- =============================================================================
-- 1. CREATE SELLERS TABLE (IF NOT EXISTS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.sellers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.sellers IS 'Single vendor sellers table. In single-vendor mode, only one seller (Dezemu) exists.';
COMMENT ON COLUMN public.sellers.id IS 'Seller identifier. Default is "dezemu" for single-vendor mode.';
COMMENT ON COLUMN public.sellers.name IS 'Seller display name (e.g., "Dezemu")';
COMMENT ON COLUMN public.sellers.logo_url IS 'URL to seller logo image';

-- =============================================================================
-- 2. UPSERT DEFAULT SELLER (DEZEMU)
-- =============================================================================
-- Use app.single_seller_id setting if available, otherwise fallback to 'dezemu'
INSERT INTO public.sellers (id, name, logo_url, created_at)
VALUES (
    COALESCE(current_setting('app.single_seller_id', true)::text, 'dezemu'),
    'Dezemu',
    'https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff',
    NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
    name = EXCLUDED.name,
    logo_url = EXCLUDED.logo_url;

COMMENT ON TABLE public.sellers IS 'Single vendor mode: Only Dezemu seller exists. Upsert ensures idempotency.';

-- =============================================================================
-- 3. ADD SELLER_ID COLUMN TO PRODUCTS TABLE (IF NOT EXISTS)
-- =============================================================================
-- Check if column exists before adding
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
        
        -- Add comment recommending app-level enforcement
        COMMENT ON COLUMN public.products.seller_id IS 
            'Seller ID for this product. Default: dezemu. NOT NULL constraint not added to allow gradual migration. Enforce at application level.';
    END IF;
END $$;

-- =============================================================================
-- 4. RENAME MULTI-VENDOR TABLES TO DEPRECATED_ PREFIX
-- =============================================================================
-- Only rename if tables exist to avoid errors

-- Rename seller_applications
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'seller_applications'
    ) THEN
        ALTER TABLE public.seller_applications RENAME TO deprecated_seller_applications;
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
    END IF;
END $$;

-- =============================================================================
-- ROLLBACK NOTES
-- =============================================================================
-- To rollback this migration, run the following SQL commands:
--
-- 1. Remove seller_id column from products (if added):
--    ALTER TABLE public.products DROP COLUMN IF EXISTS seller_id;
--
-- 2. Restore renamed tables (if they were renamed):
--    ALTER TABLE deprecated_seller_applications RENAME TO seller_applications;
--    ALTER TABLE deprecated_seller_profiles RENAME TO seller_profiles;
--    ALTER TABLE deprecated_seller_reviews RENAME TO seller_reviews;
--    ALTER TABLE deprecated_product_sellers RENAME TO product_sellers;
--    ALTER TABLE deprecated_seller_meta RENAME TO seller_meta;
--    ALTER TABLE deprecated_seller_roles RENAME TO seller_roles;
--
-- 3. Drop sellers table (if created):
--    DROP TABLE IF EXISTS public.sellers;
--
-- WARNING: Always backup your database before performing rollback operations!
-- =============================================================================
