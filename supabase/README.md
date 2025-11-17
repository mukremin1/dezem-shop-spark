# Supabase Database Migrations

This directory contains SQL migration files for the Dezemu shop database.

## Running Migrations

### Using Supabase SQL Editor (Production)

1. Go to your Supabase project dashboard at https://app.supabase.com
2. Navigate to the **SQL Editor** section
3. Open the migration file you want to run (e.g., `0001_single_vendor.sql`)
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

**Important:** Always review the SQL before executing in production.

### Migration Files

#### `0001_single_vendor.sql` - Single Vendor Conversion

This migration converts the multi-vendor shop to a single-vendor store (Dezemu).

**What it does:**
- Creates `sellers` table if it doesn't exist
- Inserts/updates the default Dezemu seller record
- Adds `seller_id` column to `products` table (defaults to 'dezemu')
- Renames old multi-vendor tables with `deprecated_` prefix:
  - `seller_applications` → `deprecated_seller_applications`
  - `seller_profiles` → `deprecated_seller_profiles`
  - `seller_reviews` → `deprecated_seller_reviews`
  - `product_sellers` → `deprecated_product_sellers`
  - `seller_meta` → `deprecated_seller_meta`
  - `seller_roles` → `deprecated_seller_roles`

**Idempotent:** Safe to run multiple times - will not duplicate data or fail if already applied.

**Before running:**
- Backup your database
- Review the migration SQL
- Test on a staging environment if available

**Environment variables (optional):**
You can set these in your Supabase dashboard under Project Settings > Database > Connection string:
```sql
-- Set seller ID (default: 'dezemu')
ALTER DATABASE postgres SET app.single_seller_id = 'dezemu';

-- Set logo URL (default: generated avatar)
ALTER DATABASE postgres SET app.default_seller_logo_url = 'https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff';
```

## Rollback Instructions

To rollback the `0001_single_vendor.sql` migration:

```sql
-- Remove seller_id column from products
ALTER TABLE public.products DROP COLUMN IF EXISTS seller_id;

-- Drop sellers table
DROP TABLE IF EXISTS public.sellers;

-- Restore renamed tables (if they were renamed)
ALTER TABLE IF EXISTS public.deprecated_seller_applications RENAME TO seller_applications;
ALTER TABLE IF EXISTS public.deprecated_seller_profiles RENAME TO seller_profiles;
ALTER TABLE IF EXISTS public.deprecated_seller_reviews RENAME TO seller_reviews;
ALTER TABLE IF EXISTS public.deprecated_product_sellers RENAME TO product_sellers;
ALTER TABLE IF EXISTS public.deprecated_seller_meta RENAME TO seller_meta;
ALTER TABLE IF EXISTS public.deprecated_seller_roles RENAME TO seller_roles;
```

**Warning:** Rollback will delete the sellers table and all its data. Only perform if absolutely necessary.

## Verification

After running the migration, verify it was successful:

```sql
-- Check if sellers table exists and has Dezemu seller
SELECT * FROM public.sellers;

-- Check if products table has seller_id column
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'seller_id';

-- Check if old tables were renamed
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'deprecated_%';
```

## Support

For issues or questions about migrations, contact:
- Email: destek@dezemu.com
- WhatsApp: +90 539 526 32 93
