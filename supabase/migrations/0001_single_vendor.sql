-- Migration: Single Vendor Mode (Dezemu)
-- Description: Converts the application to single-vendor mode with Dezemu as the default seller
-- This migration is idempotent and safe to run multiple times

-- Step 1: Create sellers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Step 2: Upsert default Dezemu seller
-- Use environment variable SUPABASE_SINGLE_SELLER_ID if set, otherwise default to 'dezemu'
DO $$
DECLARE
  v_seller_id TEXT;
  v_logo_url TEXT;
BEGIN
  -- Get seller ID from setting or default to 'dezemu'
  BEGIN
    v_seller_id := current_setting('app.single_seller_id', true);
    IF v_seller_id IS NULL OR v_seller_id = '' THEN
      v_seller_id := 'dezemu';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_seller_id := 'dezemu';
  END;
  
  -- Default logo: Simple SVG placeholder with Dezemu branding
  -- SVG content: 200x200 blue (#4255ff) square with white "D" text centered
  v_logo_url := 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzQyNTVmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5EPC90ZXh0Pjwvc3ZnPg==';
  
  -- Upsert the seller record
  INSERT INTO public.sellers (id, name, logo_url, created_at)
  VALUES (v_seller_id, 'Dezemu', v_logo_url, now())
  ON CONFLICT (id) 
  DO UPDATE SET 
    name = EXCLUDED.name,
    logo_url = EXCLUDED.logo_url;
END $$;

-- Step 3: Add seller_id column to products table if it doesn't exist
-- Use ALTER TABLE with IF NOT EXISTS-like logic via information_schema check
DO $$
DECLARE
  v_column_exists BOOLEAN;
  v_seller_id TEXT;
BEGIN
  -- Check if column exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'seller_id'
  ) INTO v_column_exists;
  
  -- Get default seller ID
  BEGIN
    v_seller_id := current_setting('app.single_seller_id', true);
    IF v_seller_id IS NULL OR v_seller_id = '' THEN
      v_seller_id := 'dezemu';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_seller_id := 'dezemu';
  END;
  
  -- Add column if it doesn't exist
  IF NOT v_column_exists THEN
    EXECUTE format('ALTER TABLE public.products ADD COLUMN seller_id TEXT DEFAULT %L', v_seller_id);
    
    -- Add comment recommending application-level enforcement
    COMMENT ON COLUMN public.products.seller_id IS 
      'Seller ID reference. NOT NULL constraint not enforced at database level to preserve existing data. Application should enforce non-null values for new records.';
  END IF;
END $$;

-- Step 4: Add foreign key constraint if column exists and constraint doesn't
DO $$
DECLARE
  v_column_exists BOOLEAN;
  v_constraint_exists BOOLEAN;
BEGIN
  -- Check if column exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'seller_id'
  ) INTO v_column_exists;
  
  -- Check if foreign key constraint exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND constraint_name = 'products_seller_id_fkey'
  ) INTO v_constraint_exists;
  
  -- Add foreign key constraint if column exists and constraint doesn't
  IF v_column_exists AND NOT v_constraint_exists THEN
    ALTER TABLE public.products 
    ADD CONSTRAINT products_seller_id_fkey 
    FOREIGN KEY (seller_id) 
    REFERENCES public.sellers(id);
  END IF;
END $$;

-- Step 5: Rename known multi-vendor tables to deprecated_* if they exist
DO $$
DECLARE
  v_tables TEXT[] := ARRAY[
    'seller_applications',
    'seller_profiles', 
    'seller_reviews',
    'product_sellers',
    'seller_meta',
    'seller_roles'
  ];
  v_table TEXT;
  v_table_exists BOOLEAN;
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    -- Check if table exists
    SELECT EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = v_table
    ) INTO v_table_exists;
    
    -- Rename to deprecated_* if it exists
    IF v_table_exists THEN
      EXECUTE format('ALTER TABLE public.%I RENAME TO deprecated_%I', v_table, v_table);
      RAISE NOTICE 'Renamed table % to deprecated_%', v_table, v_table;
    END IF;
  END LOOP;
END $$;

-- Step 6: Add index on seller_id for better query performance
DO $$
DECLARE
  v_column_exists BOOLEAN;
  v_index_exists BOOLEAN;
BEGIN
  -- Check if column exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'seller_id'
  ) INTO v_column_exists;
  
  -- Check if index exists
  SELECT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE schemaname = 'public' 
      AND tablename = 'products' 
      AND indexname = 'idx_products_seller_id'
  ) INTO v_index_exists;
  
  -- Create index if column exists and index doesn't
  IF v_column_exists AND NOT v_index_exists THEN
    CREATE INDEX idx_products_seller_id ON public.products(seller_id);
  END IF;
END $$;

-- Step 7: Enable RLS on sellers table if not already enabled
DO $$
BEGIN
  -- ALTER TABLE ... ENABLE ROW LEVEL SECURITY is idempotent in PostgreSQL
  -- It doesn't raise an error if RLS is already enabled
  ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
END $$;

-- Step 8: Create RLS policies for sellers table
DO $$
BEGIN
  -- Everyone can view sellers
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
