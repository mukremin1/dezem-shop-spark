# Single-Vendor Mode Documentation

## Overview

The Dezemu shop has been configured to operate in single-vendor mode, where all products are sold by a single seller (Dezemu). This simplifies the architecture and focuses on a streamlined shopping experience.

## Features

### 1. Single Seller Architecture
- All products are associated with a single seller: **Dezemu**
- Default seller ID: `dezemu`
- Configurable via environment variable: `VITE_SUPABASE_SINGLE_SELLER_ID`

### 2. Database Structure

#### Sellers Table
```sql
CREATE TABLE public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### Products Table Enhancement
- Added `seller_id` column with default value `'dezemu'`
- Foreign key relationship to `sellers` table
- Automatically assigns Dezemu as the seller for all new products

### 3. Migration Strategy

The migration file `0001_single_vendor.sql` performs the following operations idempotently:

1. **Creates sellers table** if it doesn't exist
2. **Upserts Dezemu seller** with default branding
3. **Adds seller_id to products** with default value
4. **Updates existing products** to assign Dezemu as seller
5. **Renames multi-vendor tables** to deprecated (if they exist):
   - `seller_applications` → `deprecated_seller_applications`
   - `seller_profiles` → `deprecated_seller_profiles`
   - `seller_reviews` → `deprecated_seller_reviews`
   - `product_sellers` → `deprecated_product_sellers`
6. **Creates performance indexes** for optimal queries

### 4. Theme Configuration

The application uses a Trendyol-inspired orange theme:

**Primary Color**: `hsl(25, 95%, 53%)` - Vibrant orange
- Primary foreground: White
- Secondary: Light orange/cream
- Accent colors: Orange-tinted neutrals

This matches Trendyol's brand identity while maintaining uniqueness.

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_key"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"

# Single Vendor Configuration
VITE_SUPABASE_SINGLE_SELLER_ID="dezemu"
VITE_DEFAULT_SELLER_NAME="Dezemu"
VITE_DEFAULT_SELLER_LOGO_URL=""
```

### Applying Migrations

To apply the single-vendor migration:

```bash
# Using Supabase CLI
supabase db push

# Or run the migration directly in Supabase Studio
# Copy and execute the contents of supabase/migrations/0001_single_vendor.sql
```

## Product Management

### Admin Upload

The `AdminUpload.tsx` component has been enhanced to automatically assign the default seller ID to all products created through:

1. **Manual Form**: Single product creation
2. **Excel Upload**: Bulk product import
3. **Auto Upload**: Pre-configured product data
4. **XML Import**: External feed integration

The seller ID is retrieved from:
```typescript
const SINGLE_SELLER_ID = import.meta.env.VITE_SUPABASE_SINGLE_SELLER_ID || 'dezemu';
```

### Product Data Structure

When creating products, include the seller_id:

```typescript
{
  name: "Product Name",
  slug: "product-name",
  price: 99.99,
  seller_id: "dezemu", // Automatically added
  // ... other fields
}
```

## Security

### Row Level Security (RLS)

Sellers table has appropriate RLS policies:

1. **Public Read**: Anyone can view sellers (public information)
2. **Admin Write**: Only admins can create/update sellers

### Data Protection

- Existing products are never deleted or modified
- Multi-vendor tables are renamed, not dropped (data preservation)
- All operations are idempotent (safe to run multiple times)

## Maintenance

### Adding Additional Sellers (Future)

If multi-vendor support is needed later:

1. Insert new seller record:
```sql
INSERT INTO sellers (id, name, logo_url)
VALUES ('new_seller', 'Seller Name', 'https://...');
```

2. Update environment variable or modify application logic
3. Products can be reassigned to different sellers as needed

### Monitoring

Check seller assignment status:
```sql
-- Count products by seller
SELECT seller_id, COUNT(*) 
FROM products 
GROUP BY seller_id;

-- Find products without seller
SELECT * FROM products WHERE seller_id IS NULL;
```

## Troubleshooting

### Products not showing seller_id

Run the migration again - it's idempotent and will update NULL values:
```sql
UPDATE products SET seller_id = 'dezemu' WHERE seller_id IS NULL;
```

### Migration errors

The migration uses `IF NOT EXISTS` and `DO $$` blocks to prevent errors on re-runs. Check Supabase logs for specific issues.

### Theme not applying

1. Clear browser cache
2. Rebuild the application: `npm run build`
3. Check tailwind.config.ts for color definitions

## Testing

### Manual Testing Checklist

- [ ] Create a product via admin form - verify seller_id is set
- [ ] Upload products via Excel - verify seller_id is assigned
- [ ] Check existing products have seller_id
- [ ] Verify theme colors match Trendyol orange
- [ ] Test product display and purchase flow

### Database Queries

```sql
-- Verify sellers table
SELECT * FROM sellers;

-- Check products with seller
SELECT id, name, seller_id FROM products LIMIT 10;

-- Verify deprecated tables
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'deprecated_%';
```

## References

- Supabase Documentation: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Trendyol Brand Guidelines: Orange primary color theme

## Support

For issues or questions:
1. Check Supabase logs for database errors
2. Review browser console for frontend errors
3. Verify environment variables are set correctly
4. Ensure migration has been applied successfully
