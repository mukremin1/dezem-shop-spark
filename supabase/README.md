# Supabase Migrations

This directory contains database migrations for the Dezemu Shop application.

## Migrations

### 0001_single_vendor.sql

This migration converts the application to single-vendor mode by:

1. **Creating sellers table** - Stores seller information with RLS policies
2. **Inserting default seller** - Creates a default seller record for single-vendor operations
3. **Adding seller_id to products** - Links products to the default seller
4. **Preserving legacy tables** - Renames any existing multi-vendor tables with `deprecated_` prefix instead of dropping them
5. **Helper functions** - Creates utility functions for retrieving the default seller

## How to Run Migrations

### Option 1: Using Supabase Dashboard (SQL Editor)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** section
3. Open the migration file: `supabase/migrations/0001_single_vendor.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** to execute the migration

### Option 2: Using psql Command Line

If you have PostgreSQL client tools installed and access to your Supabase database:

```bash
# Get your database connection string from Supabase Dashboard > Settings > Database
# Connection string format: postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres

psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres" \
  -f supabase/migrations/0001_single_vendor.sql
```

### Option 3: Using Supabase CLI

If you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed:

```bash
# Link your project (first time only)
supabase link --project-ref [YOUR-PROJECT-ID]

# Push migrations to remote database
supabase db push

# Or run migrations manually
supabase db push --include-all
```

## Environment Variables

After running the migration, configure these environment variables in your application:

- `SUPABASE_SINGLE_SELLER_ID` - The ID of the default seller (default: `default_seller`)
- `DEFAULT_SELLER_NAME` - The name of your shop (default: `Dezemu Shop`)
- `DEFAULT_SELLER_LOGO_URL` - URL to your shop's logo (optional)

See `.env.example` for complete configuration.

## Migration Safety

This migration is designed to be:

- **Idempotent** - Can be run multiple times safely
- **Non-destructive** - Preserves existing data by renaming instead of dropping tables
- **Backward compatible** - Adds new columns with defaults, doesn't remove existing ones

## Rollback

If you need to rollback this migration:

1. The `sellers` table can be dropped (but this will break the products foreign key)
2. Deprecated tables can be renamed back to their original names
3. The `seller_id` column can remain on products (with NULL values) or be dropped

Example rollback SQL:

```sql
-- Remove seller_id from products (optional, causes data loss)
ALTER TABLE public.products DROP COLUMN IF EXISTS seller_id;

-- Restore deprecated tables (if needed)
ALTER TABLE IF EXISTS public.deprecated_seller_applications 
  RENAME TO seller_applications;

-- Drop sellers table (only if seller_id removed from products)
DROP TABLE IF EXISTS public.sellers CASCADE;
```

## Verification

After running the migration, verify it worked:

```sql
-- Check sellers table exists and has default seller
SELECT * FROM public.sellers;

-- Check products have seller_id
SELECT id, name, seller_id FROM public.products LIMIT 5;

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'sellers';
```

## Support

For issues or questions about migrations, please refer to:
- [Supabase Documentation](https://supabase.com/docs)
- Project README.md
- Create an issue in the repository
