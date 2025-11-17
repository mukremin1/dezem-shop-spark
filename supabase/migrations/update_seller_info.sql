-- Update Single Seller Information
-- Run this SQL in your Supabase SQL Editor to customize your store details

-- Update the default seller with your store information
UPDATE public.sellers
SET 
  name = 'Your Store Name',
  description = 'Your store description',
  logo_url = 'https://your-domain.com/logo.png',
  email = 'contact@yourstore.com',
  phone = '+90 XXX XXX XX XX',
  website = 'https://yourstore.com',
  address = 'Your store address',
  city = 'Your city',
  postal_code = 'XXXXX',
  country = 'TR'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Verify the update
SELECT * FROM public.sellers;
