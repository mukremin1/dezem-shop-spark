# Supabase Database Migrations

This directory contains SQL migration files for the Dezemu store database.

## Running Migrations

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor tab
3. Open the migration file content from `migrations/0001_single_vendor.sql`
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click "Run" to execute the migration

### Option 2: Using psql Command Line

If you have direct database access via psql:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" \
  -f supabase/migrations/0001_single_vendor.sql
```

Replace `[YOUR-PASSWORD]` and `[YOUR-PROJECT-REF]` with your actual Supabase credentials.

### Option 3: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref [YOUR-PROJECT-REF]

# Push migrations
supabase db push
```

## Migration: 0001_single_vendor.sql

**Purpose**: Converts the database from multi-vendor to single-vendor (Dezemu) store.

**Changes**:
- Creates `sellers` table with default "dezemu" seller
- Adds `seller_id` column to `products` table (defaults to 'dezemu')
- Renames multi-vendor tables to `deprecated_*` (non-destructive)
- All changes are idempotent (safe to run multiple times)

**Affected Tables**:
- ✅ `sellers` (created)
- ✅ `products` (modified - adds seller_id)
- 🔄 `seller_applications` → `deprecated_seller_applications`
- 🔄 `seller_profiles` → `deprecated_seller_profiles`
- 🔄 `seller_reviews` → `deprecated_seller_reviews`
- 🔄 `product_sellers` → `deprecated_product_sellers`
- 🔄 `seller_meta` → `deprecated_seller_meta`
- 🔄 `seller_roles` → `deprecated_seller_roles`

## Environment Variables

The migration uses these optional environment variables:

- `app.settings.single_seller_id` - Override default seller ID (default: 'dezemu')
- `app.settings.default_seller_logo_url` - Override default logo URL

To set these before running the migration:

```sql
SET app.settings.single_seller_id = 'dezemu';
SET app.settings.default_seller_logo_url = 'https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff';
```

## Rollback Instructions

If you need to rollback the migration, see the detailed rollback instructions in the migration file itself (`0001_single_vendor.sql`).

**Quick rollback**:

```sql
-- Remove seller_id from products
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS fk_products_seller;
DROP INDEX IF EXISTS idx_products_seller_id;
ALTER TABLE public.products DROP COLUMN IF EXISTS seller_id;

-- Rename deprecated tables back (if they exist)
ALTER TABLE public.deprecated_seller_applications RENAME TO seller_applications;
ALTER TABLE public.deprecated_seller_profiles RENAME TO seller_profiles;
ALTER TABLE public.deprecated_seller_reviews RENAME TO seller_reviews;
ALTER TABLE public.deprecated_product_sellers RENAME TO product_sellers;
ALTER TABLE public.deprecated_seller_meta RENAME TO seller_meta;
ALTER TABLE public.deprecated_seller_roles RENAME TO seller_roles;

-- Drop sellers table
DROP TABLE IF EXISTS public.sellers;
```

## Verification

After running the migration, verify it was successful:

```sql
-- Check sellers table
SELECT * FROM public.sellers;

-- Check products have seller_id
SELECT id, name, seller_id FROM public.products LIMIT 5;

-- Verify deprecated tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'deprecated_%';
```

## Support

For issues or questions:
- Email: destek@dezemu.com
- WhatsApp: +90 539 526 3293
