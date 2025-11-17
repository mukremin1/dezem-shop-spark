-- Migration: Single Vendor Mode Setup
-- Description: Creates sellers table and configures the database for single-vendor operation
-- This migration is idempotent and non-destructive

-- =====================================================
-- 1. Create sellers table if it doesn't exist
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sellers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies for sellers table
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sellers
CREATE POLICY IF NOT EXISTS "Allow public read access to sellers"
    ON public.sellers FOR SELECT
    TO public
    USING (true);

-- Allow authenticated admins to manage sellers
CREATE POLICY IF NOT EXISTS "Allow admins to manage sellers"
    ON public.sellers FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- =====================================================
-- 2. Upsert default seller
-- =====================================================
-- Note: In production, set SUPABASE_SINGLE_SELLER_ID env variable
-- Default values used here: id='default_seller', name='Dezemu Shop'
INSERT INTO public.sellers (id, name, logo_url, created_at, updated_at)
VALUES (
    'default_seller',  -- Use env var SUPABASE_SINGLE_SELLER_ID in application
    'Dezemu Shop',     -- Use env var DEFAULT_SELLER_NAME in application
    NULL,              -- Use env var DEFAULT_SELLER_LOGO_URL in application
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, sellers.name),
    logo_url = COALESCE(EXCLUDED.logo_url, sellers.logo_url),
    updated_at = NOW();

-- =====================================================
-- 3. Add seller_id to products table
-- =====================================================
-- First, check if seller_id column exists, if not add it
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
        ADD COLUMN seller_id TEXT DEFAULT 'default_seller' REFERENCES public.sellers(id);

        -- Update existing products to have the default seller_id
        UPDATE public.products SET seller_id = 'default_seller' WHERE seller_id IS NULL;

        -- Add NOT NULL constraint after ensuring all rows have a value
        ALTER TABLE public.products ALTER COLUMN seller_id SET NOT NULL;

        -- Create index for better query performance
        CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
    ELSE
        -- If column exists but might be nullable, ensure it has defaults
        -- and update any NULL values
        UPDATE public.products SET seller_id = 'default_seller' WHERE seller_id IS NULL;

        -- Try to set default if not already set
        ALTER TABLE public.products ALTER COLUMN seller_id SET DEFAULT 'default_seller';

        -- Note: We don't force NOT NULL constraint if column already exists
        -- to avoid breaking existing data. Application will handle this.
    END IF;
END $$;

-- =====================================================
-- 4. Rename deprecated multi-vendor tables (if they exist)
-- =====================================================
-- This section preserves any existing multi-vendor tables by renaming them
-- rather than dropping them, preventing data loss

-- Check and rename seller_applications table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'seller_applications'
    ) THEN
        -- Only rename if deprecated version doesn't already exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = 'deprecated_seller_applications'
        ) THEN
            ALTER TABLE public.seller_applications RENAME TO deprecated_seller_applications;
        END IF;
    END IF;
END $$;

-- Check and rename vendor_profiles table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'vendor_profiles'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = 'deprecated_vendor_profiles'
        ) THEN
            ALTER TABLE public.vendor_profiles RENAME TO deprecated_vendor_profiles;
        END IF;
    END IF;
END $$;

-- Check and rename seller_settings table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'seller_settings'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = 'deprecated_seller_settings'
        ) THEN
            ALTER TABLE public.seller_settings RENAME TO deprecated_seller_settings;
        END IF;
    END IF;
END $$;

-- =====================================================
-- 5. Create helper function to get default seller
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_default_seller_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
    SELECT id FROM public.sellers WHERE id = 'default_seller' LIMIT 1;
$$;

-- =====================================================
-- Migration complete
-- =====================================================
-- Summary:
-- - Created sellers table with RLS policies
-- - Inserted/updated default seller
-- - Added seller_id to products table (if not exists)
-- - Renamed deprecated multi-vendor tables (if they exist)
-- - Created helper function for default seller
--
-- Next steps:
-- 1. Update application code to use SUPABASE_SINGLE_SELLER_ID env variable
-- 2. Test product creation and queries with default seller_id
-- 3. Verify RLS policies work as expected
