# PR: Convert to Single-Vendor Store (Dezemu)

## 📋 Overview

This PR converts the multi-vendor e-commerce platform to a **single-vendor store** named **"Dezemu"** with a Trendyol-inspired orange theme (#ff6a00). All changes are non-destructive and preserve existing data for potential rollback.

## 🎯 Objectives Completed

### ✅ Database & Migration
- [x] Created idempotent migration file `supabase/migrations/0001_single_vendor.sql`
  - Creates `sellers` table with default Dezemu seller (id: 'dezemu')
  - Adds `seller_id` column to products table with default value 'dezemu'
  - Renames multi-vendor tables to `deprecated_*` prefix (preserves data)
  - Includes comprehensive rollback instructions in SQL comments

### ✅ Documentation
- [x] Created `supabase/README.md` with:
  - Migration instructions (local & production)
  - Rollback procedures
  - Verification steps
  - Troubleshooting guide
- [x] Updated main `README.md` with:
  - Single-vendor architecture notes
  - Deployment checklist
  - DNS configuration instructions
  - Contact information
  - Technology stack details

### ✅ Configuration
- [x] Created `.env.example` with all required environment variables
- [x] Updated `.env` with single-vendor configuration:
  - `VITE_SUPABASE_SINGLE_SELLER_ID=dezemu`
  - Contact info (email & WhatsApp)
  - Seller branding (name, logo URL)
- [x] Updated `tailwind.config.ts`:
  - Primary color changed to #ff6a00 (Trendyol orange)
  - Ring color updated to match
  - Maintains existing color scheme for other elements

### ✅ Frontend Changes
- [x] **Header Component** (`src/components/Header.tsx`):
  - Added Dezemu logo with fallback
  - Display "Dezemu" branding
  - Added contact info block (email & WhatsApp with icons)
  - Enhanced styling with primary color accents
  - Mobile-responsive layout

- [x] **Product Inserts** - Added `seller_id` to ALL product creation points:
  - `src/pages/AdminUpload.tsx`:
    - Manual product add form ✓
    - Excel file upload (row-by-row) ✓
    - Auto upload from file ✓
    - XML import ✓
  - `src/pages/Index.tsx`:
    - Quick product add form ✓
    - Batch Excel upload ✓

- [x] **Metadata** (`index.html`):
  - Updated title to "Dezemu - Kaliteli Alışverişin Adresi"
  - Updated descriptions and keywords
  - Added canonical URL (dezemu.com)
  - Updated Open Graph tags
  - Updated Twitter Card tags
  - Added theme-color meta tag (#ff6a00)
  - Updated noscript fallback with contact info

### ✅ Utilities
- [x] Created `src/lib/generateAvatar.ts`:
  - `generateAvatar()` - Creates inline SVG data URL
  - `generateAvatarUrl()` - Uses ui-avatars.com service
  - Used as fallback for seller logos

### ✅ Infrastructure
- [x] CNAME file already contains `dezemu.com`
- [x] Fixed `package.json` dependency issue (@tailwindcss/typography)
- [x] Installed required dependencies:
  - lucide-react (for icons)
  - @supabase/supabase-js
  - @tanstack/react-query
  - react-hook-form, @hookform/resolvers, zod
  - xlsx

## 🔒 Security

- **CodeQL Scan**: ✅ Passed (0 vulnerabilities)
- **Build Status**: ✅ Successful
- **TypeScript**: ✅ No type errors

## 📦 Migration Instructions

### Before Deployment

1. **Backup your database** (Supabase dashboard → Database → Backups)

2. **Set environment variables** in your hosting platform:
   ```bash
   VITE_SUPABASE_SINGLE_SELLER_ID=dezemu
   VITE_DEFAULT_SELLER_NAME=Dezemu
   VITE_DEFAULT_SELLER_LOGO_URL=https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff&size=100&bold=true
   VITE_SUPPORT_EMAIL=destek@dezemu.com
   VITE_SUPPORT_WHATSAPP=+905395263293
   ```

3. **Run database migration**:
   ```bash
   # Option 1: Using Supabase CLI
   supabase db push
   
   # Option 2: Via Supabase Studio
   # Copy contents of supabase/migrations/0001_single_vendor.sql
   # Paste in SQL Editor and execute
   ```

4. **Verify migration**:
   ```sql
   -- Check sellers table
   SELECT * FROM public.sellers;
   
   -- Check products have seller_id
   SELECT id, name, seller_id FROM public.products LIMIT 5;
   
   -- Check deprecated tables
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name LIKE 'deprecated_%';
   ```

## ✅ Testing Checklist

### Local Development
- [ ] Run `npm install`
- [ ] Set environment variables in `.env`
- [ ] Run database migration
- [ ] Start dev server: `npm run dev`
- [ ] Test Header displays Dezemu logo and contact info
- [ ] Test product uploads (manual, Excel, XML) include seller_id
- [ ] Test quick product add from Index page
- [ ] Verify products appear correctly
- [ ] Test responsive layout on mobile

### Production
- [ ] Set all environment variables
- [ ] Run database migration on production Supabase
- [ ] Deploy application
- [ ] Configure DNS to point to dezemu.com
- [ ] Verify SSL certificate
- [ ] Test product uploads
- [ ] Test checkout flow
- [ ] Verify contact links (email & WhatsApp)
- [ ] Test mobile responsiveness

## 🔄 Rollback Instructions

If you need to rollback:

```sql
-- 1. Restore multi-vendor tables
ALTER TABLE public.deprecated_seller_applications RENAME TO seller_applications;
ALTER TABLE public.deprecated_seller_profiles RENAME TO seller_profiles;
ALTER TABLE public.deprecated_seller_reviews RENAME TO seller_reviews;
ALTER TABLE public.deprecated_product_sellers RENAME TO product_sellers;
ALTER TABLE public.deprecated_seller_meta RENAME TO seller_meta;
ALTER TABLE public.deprecated_seller_roles RENAME TO seller_roles;

-- 2. Remove seller_id column (optional - will lose data)
-- ALTER TABLE public.products DROP COLUMN seller_id;

-- 3. Remove sellers table (optional)
-- DROP TABLE public.sellers;
```

**Warning**: Always backup before rollback!

## 🌐 DNS Configuration for dezemu.com

### For Vercel:
- A record: `76.76.21.21`
- CNAME: `cname.vercel-dns.com`

### For GitHub Pages:
- A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- CNAME: `mukremin1.github.io`

## 📝 Notes

- **Non-destructive**: All multi-vendor tables renamed to `deprecated_*`, not dropped
- **Idempotent**: Migration can be run multiple times safely
- **Fallback defaults**: Code uses 'dezemu' as fallback if env vars not set
- **App-level enforcement**: seller_id column allows NULL but app enforces value
- **Contact info**: Displayed in header on all pages
- **Theme color**: Consistent #ff6a00 (Trendyol orange) throughout

## 📞 Support

- **Email**: destek@dezemu.com
- **WhatsApp**: +905395263293

## 🔗 Related Files

- Migration: `supabase/migrations/0001_single_vendor.sql`
- Migration docs: `supabase/README.md`
- Main docs: `README.md`
- Config: `.env.example`
- Theme: `tailwind.config.ts`
- Header: `src/components/Header.tsx`
- Admin upload: `src/pages/AdminUpload.tsx`
- Index page: `src/pages/Index.tsx`
- Avatar util: `src/lib/generateAvatar.ts`

---

**Ready to merge** ✅
