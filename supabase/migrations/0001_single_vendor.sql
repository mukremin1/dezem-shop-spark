-- 0001_single_vendor.sql
-- Create sellers table if not exists
CREATE TABLE IF NOT EXISTS public.sellers (
  id text PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- Upsert default seller
INSERT INTO public.sellers (id, name, logo_url)
VALUES (
  COALESCE(current_setting('app.single_seller_id', true)::text, 'dezemu'),
  'Dezemu',
  'https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, logo_url = EXCLUDED.logo_url;

-- Add seller_id to products if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE public.products ADD COLUMN seller_id text DEFAULT 'dezemu';
    COMMENT ON COLUMN public.products.seller_id IS 'Default seller id for single-vendor mode (enforce at application level if desired)';
  END IF;
END$$;

-- Rename known multi-vendor tables to deprecated_ prefix if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'seller_applications') THEN
    EXECUTE 'ALTER TABLE public.seller_applications RENAME TO deprecated_seller_applications';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'seller_profiles') THEN
    EXECUTE 'ALTER TABLE public.seller_profiles RENAME TO deprecated_seller_profiles';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'seller_reviews') THEN
    EXECUTE 'ALTER TABLE public.seller_reviews RENAME TO deprecated_seller_reviews';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_sellers') THEN
    EXECUTE 'ALTER TABLE public.product_sellers RENAME TO deprecated_product_sellers';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'seller_meta') THEN
    EXECUTE 'ALTER TABLE public.seller_meta RENAME TO deprecated_seller_meta';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'seller_roles') THEN
    EXECUTE 'ALTER TABLE public.seller_roles RENAME TO deprecated_seller_roles';
  END IF;
END$$;

-- ROLLBACK NOTES: Manual rollback: rename deprecated_ tables back to original names and drop sellers table/column only after verifying data backups.
