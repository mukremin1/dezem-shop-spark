# Supabase Migrations

This directory contains database migrations for the Dezemu e-commerce store.

## Overview

The application uses Supabase as the backend database. Migrations are SQL files that define schema changes and data transformations.

## Running Migrations

### Method 1: Supabase SQL Editor (Recommended for Production)

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of the migration file you want to run
6. Paste it into the SQL editor
7. Click **Run** to execute the migration

### Method 2: Supabase CLI (For Local Development)

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in your project (if not done already)
supabase init

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_REF

# Run pending migrations
supabase db push
```

## Migration Files

### 0001_single_vendor.sql

**Purpose:** Converts the application from multi-vendor to single vendor store (Dezemu)

**Changes:**
- Creates `sellers` table for storing seller information
- Upserts default Dezemu seller record
- Adds `seller_id` column to `products` table with default value 'dezemu'
- Renames deprecated multi-vendor tables by prefixing with `deprecated_`

**Environment Variables:**
- `app.single_seller_id` (optional): Custom seller ID, defaults to 'dezemu'
- You can set this in Supabase SQL Editor before running migration:
  ```sql
  SET app.single_seller_id = 'your-custom-id';
  ```

**Idempotency:** This migration is idempotent and can be safely run multiple times.

## Rollback Instructions

If you need to rollback the single vendor migration:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run the rollback SQL found in the comments of `0001_single_vendor.sql`
3. The rollback will:
   - Remove the `seller_id` column from products
   - Restore multi-vendor tables (remove `deprecated_` prefix)
   - Drop the `sellers` table

**⚠️ Warning:** Rolling back will delete all seller data. Make sure to backup your database before rollback!

## Production Deployment Checklist

Before deploying to production:

- [ ] Run migration `0001_single_vendor.sql` in production Supabase
- [ ] Verify `sellers` table was created
- [ ] Verify Dezemu seller record exists: `SELECT * FROM sellers WHERE id = 'dezemu';`
- [ ] Verify `products` table has `seller_id` column: `SELECT seller_id FROM products LIMIT 1;`
- [ ] Verify deprecated tables were renamed (if they existed)
- [ ] Update environment variables in your hosting platform (see .env.example)
- [ ] Point DNS for dezemu.com to your hosting provider
- [ ] Test product creation with seller_id in production

## Troubleshooting

### Migration fails with "table already exists"

The migration is idempotent. If you see this error, it means parts of the migration were already applied. This is safe to ignore.

### Products don't have seller_id

If existing products don't have seller_id set, run:

```sql
UPDATE products SET seller_id = 'dezemu' WHERE seller_id IS NULL;
```

### Need to change seller information

To update the default seller:

```sql
UPDATE sellers 
SET name = 'New Name', logo_url = 'new-logo-url' 
WHERE id = 'dezemu';
```

## Contact

For questions or issues:
- Email: destek@dezemu.com
- WhatsApp: +905395263293
