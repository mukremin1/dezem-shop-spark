# Supabase Database Migrations

This directory contains database migration files for the Dezem Shop e-commerce platform.

## Single-Vendor Mode

This application is configured as a **single-vendor e-commerce platform**. This means:

- There is only one seller/store owner managing all products
- All products belong to the default seller
- No seller registration or multi-vendor marketplace features

### Default Seller Configuration

The migration `20251117221158_single_vendor.sql` creates:

1. **sellers table** - Stores seller information
2. **Default seller record** with fixed UUID: `00000000-0000-0000-0000-000000000001`
3. **seller_id column** on products table, linked to the default seller

### Environment Variables

Configure the following environment variables in your `.env` file:

```bash
# Single Vendor Configuration
VITE_SUPABASE_SINGLE_SELLER_ID=00000000-0000-0000-0000-000000000001
VITE_DEFAULT_SELLER_NAME=Dezem Shop
VITE_DEFAULT_SELLER_LOGO_URL=
```

## Running Migrations

### Local Development with Supabase CLI

If you have the Supabase CLI installed:

```bash
# Start local Supabase
supabase start

# Run migrations
supabase db push

# Or apply specific migration
supabase migration up
```

### Production Supabase

#### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `20251117221158_single_vendor.sql`
4. Run the SQL script
5. Verify the sellers table and default seller record were created

#### Option 2: Supabase CLI (Production)

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Customizing Your Store Information

After running the migration, you can customize the default seller information:

1. Open `supabase/migrations/update_seller_info.sql`
2. Modify the values (store name, logo, contact info, etc.)
3. Run this update script in your Supabase SQL Editor

Or directly in SQL Editor:

```sql
UPDATE public.sellers
SET 
  name = 'Your Store Name',
  description = 'Your amazing store description',
  logo_url = 'https://your-domain.com/logo.png',
  email = 'contact@yourstore.com',
  phone = '+90 XXX XXX XX XX'
WHERE id = '00000000-0000-0000-0000-000000000001';
```

### Verifying Migration

After running the migration, verify:

```sql
-- Check sellers table exists and has default seller
SELECT * FROM public.sellers;

-- Check products have seller_id
SELECT id, name, seller_id FROM public.products LIMIT 5;

-- Verify RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'sellers';
```

## Migration Safety

The single-vendor migration is designed to be:

- **Idempotent**: Can be run multiple times safely
- **Non-destructive**: Does not drop existing tables or data
- **Backward compatible**: Existing products continue to work
- **Reversible**: Can be rolled back if needed

### Rollback (if needed)

If you need to rollback the single-vendor migration:

```sql
-- Remove seller_id from products
ALTER TABLE public.products DROP COLUMN IF EXISTS seller_id;

-- Drop sellers table and related objects
DROP TABLE IF EXISTS public.sellers CASCADE;
```

## Schema Overview

### sellers Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, default seller uses fixed UUID |
| name | TEXT | Seller/store name |
| slug | TEXT | URL-friendly identifier |
| description | TEXT | Store description |
| logo_url | TEXT | Store logo URL |
| email | TEXT | Contact email |
| phone | TEXT | Contact phone |
| website | TEXT | Store website |
| address | TEXT | Physical address |
| city | TEXT | City |
| postal_code | TEXT | Postal code |
| country | TEXT | Country (default: 'TR') |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### Products Changes

- Added `seller_id` column (UUID, references sellers.id)
- Default value set to the default seller UUID
- Indexed for performance

## Multi-Vendor Considerations

This repository was designed from the start as a single-vendor platform. There are no deprecated multi-vendor tables or features to remove. If you need to convert to a multi-vendor marketplace in the future:

1. Remove the DEFAULT constraint on products.seller_id
2. Create seller registration and authentication flows
3. Add seller dashboards and product management UIs
4. Implement seller-specific RLS policies

## Support

For issues with migrations or database setup:
1. Check Supabase project logs
2. Verify RLS policies are correct
3. Ensure your Supabase project has the required extensions enabled
4. Review the migration SQL for any conflicts with existing schema
