-- ================================================================
-- Single Vendor Migration - Dezemu Store
-- ================================================================
-- This migration converts the database from multi-vendor to single-vendor
-- All changes are idempotent and non-destructive (tables renamed, not dropped)
--
-- ROLLBACK INSTRUCTIONS:
-- To rollback, rename deprecated_* tables back to original names and
-- remove seller_id column from products table
-- ================================================================

-- 1. Create sellers table if not exists
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert default seller (idempotent - use ON CONFLICT)
INSERT INTO public.sellers (id, name, logo_url)
VALUES (
  COALESCE(current_setting('app.settings.single_seller_id', true), 'dezemu'),
  'Dezemu',
  COALESCE(
    current_setting('app.settings.default_seller_logo_url', true),
    'https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff'
  )
)
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  logo_url = EXCLUDED.logo_url;

-- 3. Add seller_id column to products table if it doesn't exist
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
    
    -- Note: NOT NULL constraint not added to avoid breaking existing data
    -- Update existing products to have the default seller
    UPDATE public.products SET seller_id = 'dezemu' WHERE seller_id IS NULL;
    
    -- Add foreign key constraint
    ALTER TABLE public.products
    ADD CONSTRAINT fk_products_seller
    FOREIGN KEY (seller_id) REFERENCES public.sellers(id);
    
    -- Create index for better performance
    CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
  END IF;
END
$$;

-- 4. Rename multi-vendor tables to deprecated_* (preserve data, non-destructive)
-- Check and rename each table if it exists

-- Rename seller_applications
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_applications'
  ) THEN
    ALTER TABLE public.seller_applications RENAME TO deprecated_seller_applications;
  END IF;
END
$$;

-- Rename seller_profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_profiles'
  ) THEN
    ALTER TABLE public.seller_profiles RENAME TO deprecated_seller_profiles;
  END IF;
END
$$;

-- Rename seller_reviews
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_reviews'
  ) THEN
    ALTER TABLE public.seller_reviews RENAME TO deprecated_seller_reviews;
  END IF;
END
$$;

-- Rename product_sellers
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'product_sellers'
  ) THEN
    ALTER TABLE public.product_sellers RENAME TO deprecated_product_sellers;
  END IF;
END
$$;

-- Rename seller_meta
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_meta'
  ) THEN
    ALTER TABLE public.seller_meta RENAME TO deprecated_seller_meta;
  END IF;
END
$$;

-- Rename seller_roles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'seller_roles'
  ) THEN
    ALTER TABLE public.seller_roles RENAME TO deprecated_seller_roles;
  END IF;
END
$$;

-- Add comments for documentation
COMMENT ON TABLE public.sellers IS 'Single vendor seller table - stores the default Dezemu seller';
COMMENT ON COLUMN public.products.seller_id IS 'References the single seller (dezemu by default)';

-- ================================================================
-- ROLLBACK NOTES:
-- ================================================================
-- To rollback this migration:
-- 
-- 1. Remove seller_id from products:
--    ALTER TABLE public.products DROP CONSTRAINT IF EXISTS fk_products_seller;
--    DROP INDEX IF EXISTS idx_products_seller_id;
--    ALTER TABLE public.products DROP COLUMN IF EXISTS seller_id;
--
-- 2. Rename deprecated tables back (if they exist):
--    ALTER TABLE public.deprecated_seller_applications RENAME TO seller_applications;
--    ALTER TABLE public.deprecated_seller_profiles RENAME TO seller_profiles;
--    ALTER TABLE public.deprecated_seller_reviews RENAME TO seller_reviews;
--    ALTER TABLE public.deprecated_product_sellers RENAME TO product_sellers;
--    ALTER TABLE public.deprecated_seller_meta RENAME TO seller_meta;
--    ALTER TABLE public.deprecated_seller_roles RENAME TO seller_roles;
--
-- 3. Drop sellers table:
--    DROP TABLE IF EXISTS public.sellers;
-- ================================================================
