# Supabase Migrations

This directory contains database migrations for the Dezemu single-vendor e-commerce platform.

## Running Migrations

### Method 1: Supabase SQL Editor (Recommended for Production)

1. Log in to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `migrations/0001_single_vendor.sql`
4. Paste into the SQL Editor
5. Review the SQL carefully
6. Click "Run" to execute the migration

### Method 2: Supabase CLI (Development)

If you have Supabase CLI installed:

```bash
supabase db push
```

## Migration Details

### 0001_single_vendor.sql

This migration:
- Creates a `sellers` table with the default Dezemu seller
- Adds `seller_id` column to `products` table (if not exists)
- Renames deprecated multi-vendor tables to `deprecated_*` prefix
- Is idempotent (safe to run multiple times)

## Rollback Instructions

⚠️ **IMPORTANT**: Always backup your database before performing a rollback!

To rollback this migration manually:

1. Rename deprecated tables back:
   ```sql
   ALTER TABLE deprecated_seller_applications RENAME TO seller_applications;
   ALTER TABLE deprecated_seller_profiles RENAME TO seller_profiles;
   -- etc. for other tables
   ```

2. Remove seller_id column (⚠️ data loss):
   ```sql
   ALTER TABLE products DROP COLUMN seller_id;
   ```

3. Drop sellers table:
   ```sql
   DROP TABLE sellers;
   ```

## Security Notes

⚠️ **Never commit production secrets to this repository**

- `SUPABASE_SERVICE_ROLE_KEY` should never be in source control
- Use GitHub Secrets for CI/CD automation
- Use Supabase Dashboard or CLI with proper authentication for migrations
- The service role key has admin access - protect it carefully

## Automated Migration (CI/CD)

Automated migrations via GitHub Actions are possible but **NOT RECOMMENDED** for production due to:
- Risk of accidental data loss
- No manual review step
- Service role key security concerns

If you still want to automate (development only):
1. Add `SUPABASE_SERVICE_ROLE_KEY` to GitHub Secrets
2. Uncomment the migration step in `.github/workflows/ci.yml`
3. Review logs carefully after each run

## Testing Migrations

Always test migrations in a staging/development environment before production:

1. Create a staging Supabase project
2. Copy production data (if needed)
3. Run migration in staging
4. Verify all functionality works
5. Only then run in production
