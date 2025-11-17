# Supabase Database Migrations

This directory contains database migration files for the Dezemu single-vendor store.

## Running Migrations

### Method 1: Using Supabase SQL Editor (Recommended)

1. **Access Supabase Dashboard**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Navigate to SQL Editor

2. **Run the Migration**
   - Open `migrations/0001_single_vendor.sql`
   - Copy the entire contents of the file
   - Paste into the SQL Editor
   - Click "Run" to execute

3. **Verify Migration Success**
   ```sql
   -- Check if sellers table exists
   SELECT * FROM public.sellers;
   
   -- Check if seller_id column was added to products
   SELECT column_name, data_type, column_default 
   FROM information_schema.columns 
   WHERE table_name = 'products' AND column_name = 'seller_id';
   
   -- Verify deprecated tables were renamed
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'deprecated_%';
   ```

### Method 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Migration Files

### `0001_single_vendor.sql`

**Purpose**: Convert the multi-vendor shop to a single-vendor store (Dezemu).

**Changes Made**:
1. Creates `sellers` table (idempotent)
2. Inserts/updates default Dezemu seller record
3. Adds `seller_id` column to `products` table (default: 'dezemu')
4. Renames multi-vendor tables to `deprecated_*` prefix:
   - `seller_applications` → `deprecated_seller_applications`
   - `seller_profiles` → `deprecated_seller_profiles`
   - `seller_reviews` → `deprecated_seller_reviews`
   - `product_sellers` → `deprecated_product_sellers`
   - `seller_meta` → `deprecated_seller_meta`
   - `seller_roles` → `deprecated_seller_roles`

**Idempotency**: This migration is safe to run multiple times. It uses:
- `CREATE TABLE IF NOT EXISTS`
- `INSERT ... ON CONFLICT DO UPDATE`
- Existence checks before adding columns or renaming tables

## Rollback Instructions

If you need to rollback the migration, follow these steps:

### ⚠️ WARNING
**Always backup your database before performing rollback operations!**

### Rollback Steps

Run the following SQL commands in the Supabase SQL Editor:

```sql
-- 1. Remove seller_id column from products (if added)
ALTER TABLE public.products DROP COLUMN IF EXISTS seller_id;

-- 2. Restore renamed tables (if they were renamed)
ALTER TABLE deprecated_seller_applications RENAME TO seller_applications;
ALTER TABLE deprecated_seller_profiles RENAME TO seller_profiles;
ALTER TABLE deprecated_seller_reviews RENAME TO seller_reviews;
ALTER TABLE deprecated_product_sellers RENAME TO product_sellers;
ALTER TABLE deprecated_seller_meta RENAME TO seller_meta;
ALTER TABLE deprecated_seller_roles RENAME TO seller_roles;

-- 3. Drop sellers table (if created)
DROP TABLE IF EXISTS public.sellers;
```

## Safety Notes

### 🔒 Security Warnings

1. **Never commit `service_role_key` to the repository**
   - The `service_role_key` bypasses Row Level Security (RLS)
   - Only use it server-side with extreme caution
   - Store it in environment variables or secrets management

2. **Database Access**
   - Use the Supabase Dashboard for manual migrations
   - Use the `anon` or `authenticated` keys for client-side operations
   - Reserve `service_role_key` for administrative tasks only

3. **Environment Variables**
   - Store Supabase credentials in `.env` files (not committed)
   - Use Vercel/deployment platform secrets for production
   - Never hardcode credentials in source code

### Required Environment Variables

For local development, create a `.env` file (not committed):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
# Only for server-side operations (DO NOT COMMIT):
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

For production (Vercel), set these in the Vercel dashboard under Settings → Environment Variables.

## Testing Migrations

After running the migration, test the following:

- [ ] Sellers table exists and contains Dezemu record
- [ ] Products table has `seller_id` column with 'dezemu' default
- [ ] New products automatically get `seller_id = 'dezemu'`
- [ ] Old multi-vendor tables are renamed to `deprecated_*`
- [ ] Application still functions correctly
- [ ] No data loss occurred

## Support

If you encounter issues:

1. Check Supabase logs in the Dashboard
2. Verify your database connection
3. Ensure you have proper permissions
4. Review the SQL syntax in the migration file
5. Contact support at destek@dezemu.com

---

**Last Updated**: 2025-11-17  
**Migration Version**: 0001
