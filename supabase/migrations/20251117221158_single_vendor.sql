-- Single Vendor Migration
-- This migration formalizes the repository as a single-vendor e-commerce platform
-- by creating a sellers table with one default seller and linking all products to it.

-- Create sellers table
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'TR',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for sellers table
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Sellers are viewable by everyone
CREATE POLICY "Sellers are viewable by everyone"
  ON public.sellers FOR SELECT
  USING (is_active = true);

-- Only admins can manage sellers
CREATE POLICY "Admins can insert sellers"
  ON public.sellers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update sellers"
  ON public.sellers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete sellers"
  ON public.sellers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updating timestamps
CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default seller
-- This uses a fixed UUID that can be referenced in environment variables
INSERT INTO public.sellers (id, name, slug, description, logo_url, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'Dezem Shop',
  'dezem-shop',
  'Your trusted online shopping destination',
  '',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Add seller_id column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE public.products 
    ADD COLUMN seller_id UUID REFERENCES public.sellers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Set default seller_id for all existing products
UPDATE public.products 
SET seller_id = '00000000-0000-0000-0000-000000000001'::UUID
WHERE seller_id IS NULL;

-- Set default value for seller_id on products table
ALTER TABLE public.products 
ALTER COLUMN seller_id SET DEFAULT '00000000-0000-0000-0000-000000000001'::UUID;

-- Create index on products.seller_id for better query performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);

-- Add comment to document the single-vendor approach
COMMENT ON TABLE public.sellers IS 'Sellers table - configured for single-vendor mode. Default seller ID: 00000000-0000-0000-0000-000000000001';
COMMENT ON COLUMN public.products.seller_id IS 'Reference to seller - defaults to the single default seller in single-vendor mode';
