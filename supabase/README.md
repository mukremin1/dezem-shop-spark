# Supabase Migrations Guide

This directory contains database migrations for the Dezemu shop.

## Overview

The migrations in this folder convert the multi-vendor e-commerce platform to a single-vendor store named "Dezemu".

## Prerequisites

- Supabase CLI installed: `npm install -g supabase`
- Access to the Supabase project
- Environment variables configured (see `.env.example`)

## Migration Files

### 0001_single_vendor.sql

This migration:
- Creates a `sellers` table to store the default seller information
- Inserts/updates the default seller "Dezemu" with branding (logo, colors)
- Adds `seller_id` column to `products` table with default value 'dezemu'
- Renames multi-vendor tables to `deprecated_*` prefix for safe rollback
- Preserves all existing data

**Multi-vendor tables renamed:**
- `seller_applications` → `deprecated_seller_applications`
- `seller_profiles` → `deprecated_seller_profiles`
- `seller_reviews` → `deprecated_seller_reviews`
- `product_sellers` → `deprecated_product_sellers`
- `seller_meta` → `deprecated_seller_meta`
- `seller_roles` → `deprecated_seller_roles`

## Running Migrations

### Local Development

1. **Link to your Supabase project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. **Run migrations:**
   ```bash
   supabase db push
   ```

3. **Verify migration:**
   ```bash
   supabase db diff
   ```

### Production

1. **Set environment variables in Supabase dashboard:**
   - Go to Project Settings → Database → Configuration
   - Add custom config (if supported) or use defaults

2. **Run migration via Supabase CLI:**
   ```bash
   supabase db push --db-url "postgresql://postgres:[password]@[host]:5432/postgres"
   ```

3. **Alternative: Run via Supabase Studio:**
   - Open SQL Editor in Supabase Studio
   - Copy and paste the migration file contents
   - Execute the SQL

## Environment Variables

The migration supports the following optional environment variables (defaults shown):

- `app.single_seller_id` (default: 'dezemu')
- `app.default_seller_name` (default: 'Dezemu')
- `app.default_seller_logo_url` (default: generated avatar URL)

To set these before running migration:
```sql
-- In Supabase SQL editor, run before migration:
SET app.single_seller_id = 'dezemu';
SET app.default_seller_name = 'Dezemu';
SET app.default_seller_logo_url = 'https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff';
```

## Rollback Instructions

If you need to rollback the single-vendor changes:

1. **Restore multi-vendor tables:**
   ```sql
   ALTER TABLE public.deprecated_seller_applications RENAME TO seller_applications;
   ALTER TABLE public.deprecated_seller_profiles RENAME TO seller_profiles;
   ALTER TABLE public.deprecated_seller_reviews RENAME TO seller_reviews;
   ALTER TABLE public.deprecated_product_sellers RENAME TO product_sellers;
   ALTER TABLE public.deprecated_seller_meta RENAME TO seller_meta;
   ALTER TABLE public.deprecated_seller_roles RENAME TO seller_roles;
   ```

2. **Remove seller_id column (optional - will lose data):**
   ```sql
   ALTER TABLE public.products DROP COLUMN seller_id;
   ```

3. **Remove sellers table (optional):**
   ```sql
   DROP TABLE public.sellers;
   ```

**Warning:** Rolling back will remove any data added after the migration. Always backup your database before rollback.

## Verification Steps

After running the migration, verify:

1. **Sellers table created:**
   ```sql
   SELECT * FROM public.sellers;
   ```
   Should return the "Dezemu" seller row.

2. **Products have seller_id:**
   ```sql
   SELECT id, name, seller_id FROM public.products LIMIT 5;
   ```
   All products should have `seller_id = 'dezemu'`.

3. **Multi-vendor tables renamed:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'deprecated_%';
   ```
   Should list all renamed tables.

## Troubleshooting

**Issue:** Migration fails with "table already exists"
- **Solution:** The migration is idempotent. Check if tables already exist and manually adjust.

**Issue:** Can't set environment variables in Supabase
- **Solution:** The migration uses defaults that work. Custom values are optional.

**Issue:** Products not showing seller_id
- **Solution:** Check if column was added: `\d products` in psql or check table schema in Studio.

## Support

For issues or questions:
- Email: destek@dezemu.com
- WhatsApp: +905395263293
