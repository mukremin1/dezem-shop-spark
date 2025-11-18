# Dezemu - Single-Vendor E-Commerce Platform

> Dezemu is a modern single-vendor e-commerce platform built with React, TypeScript, Vite, and Supabase.

## 🌟 Project Info

**Live URL**: https://dezemu.com  
**Lovable Project**: https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560

## 🏪 Single-Vendor Mode

This project has been configured as a **single-vendor platform** for Dezemu. All products are managed by a single seller with the following branding:

- **Brand**: Dezemu
- **Primary Color**: #ff6a00 (Orange)
- **Support Email**: destek@dezemu.com
- **WhatsApp**: +90 539 526 32 93

### Key Changes
- All products automatically assigned to `seller_id: dezemu`
- Multi-vendor features disabled
- Unified branding and color scheme
- Direct customer support channels

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account for database

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd dezem-shop-spark

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

### Required (Supabase)
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable/anon key
- `VITE_SUPABASE_URL` - Your Supabase project URL

### Single-Vendor Configuration
- `NEXT_PUBLIC_SUPABASE_SINGLE_SELLER_ID=dezemu` - Default seller ID
- `SUPABASE_SINGLE_SELLER_ID=dezemu` - Backend seller ID
- `DEFAULT_SELLER_NAME=Dezemu` - Platform name
- `DEFAULT_SELLER_LOGO_URL` - Logo URL (uses avatar generator as fallback)
- `NEXT_PUBLIC_PRIMARY_COLOR=#ff6a00` - Brand primary color
- `NEXT_PUBLIC_SUPPORT_EMAIL=destek@dezemu.com` - Support email
- `NEXT_PUBLIC_SUPPORT_WHATSAPP=+905395263293` - WhatsApp number

## 🗄️ Database Setup

### Running Migrations

⚠️ **Always backup your database before running migrations!**

#### Method 1: Supabase SQL Editor (Recommended)
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to SQL Editor
3. Open `supabase/migrations/0001_single_vendor.sql`
4. Copy contents and paste into SQL Editor
5. Review carefully and click "Run"

#### Method 2: Supabase CLI
```sh
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

See `supabase/README.md` for detailed migration instructions and rollback procedures.

## 🏗️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run linter (if configured)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn-ui
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel / GitHub Pages

## 📦 Deployment Checklist

Before deploying to production, complete these steps:

### 1. Database Migration
- [ ] Backup production database
- [ ] Run `supabase/migrations/0001_single_vendor.sql` in SQL Editor
- [ ] Verify sellers table created
- [ ] Verify products.seller_id column added
- [ ] Verify deprecated tables renamed

### 2. Environment Variables (Production)
Configure these in your hosting provider (Vercel/Netlify):
- [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_SINGLE_SELLER_ID=dezemu`
- [ ] `NEXT_PUBLIC_PRIMARY_COLOR=#ff6a00`
- [ ] `NEXT_PUBLIC_SUPPORT_EMAIL=destek@dezemu.com`
- [ ] `NEXT_PUBLIC_SUPPORT_WHATSAPP=+905395263293`

⚠️ **Never commit production secrets to git!**

### 3. DNS Configuration
- [ ] Point `dezemu.com` to your hosting provider
- [ ] Verify CNAME file exists in repo root
- [ ] Configure SSL certificate
- [ ] Test domain resolution

### 4. Build & Deploy
```sh
# Build the project
npm run build

# Test the build locally
npm run preview

# Deploy (hosting-specific command)
npm run deploy  # or vercel deploy, netlify deploy, etc.
```

### 5. Post-Deployment Testing
- [ ] Homepage loads correctly
- [ ] Product search works
- [ ] Shopping cart functions
- [ ] Checkout process works
- [ ] Order placement succeeds
- [ ] Contact links (WhatsApp, Email) work
- [ ] Admin panel accessible
- [ ] Product upload features work

## 🧪 Testing Checklist

### Manual Testing
- [ ] Browse products
- [ ] Search functionality
- [ ] Add to cart
- [ ] Cart management
- [ ] Checkout flow
- [ ] Order history
- [ ] Contact support (WhatsApp/Email)

### Admin Testing
- [ ] Login to admin panel
- [ ] Upload single product
- [ ] Upload via Excel
- [ ] Upload via XML
- [ ] Verify seller_id set to 'dezemu'

## 🔄 Rollback Procedure

If you need to rollback the single-vendor migration:

1. **Restore tables** (see `supabase/README.md`):
   ```sql
   ALTER TABLE deprecated_seller_applications RENAME TO seller_applications;
   -- Repeat for other deprecated tables
   ```

2. **Remove seller_id column** (⚠️ data loss):
   ```sql
   ALTER TABLE products DROP COLUMN seller_id;
   ```

3. **Revert code changes**:
   ```sh
   git revert <commit-hash>
   # or
   git checkout main
   ```

4. **Redeploy** previous version

## 📞 Contact & Support

- **Email**: destek@dezemu.com
- **WhatsApp**: +90 539 526 32 93
- **Website**: https://dezemu.com

## 🔐 Security Notes

- Never commit `.env` files
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (admin access)
- Use environment variables for all secrets
- Review migration SQL before running in production
- Always backup database before migrations

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. For authorized contributors:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## ✨ How to Edit

**Use Lovable**: Visit [Lovable Project](https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560) and start prompting. Changes are automatically committed to this repo.

**Local Development**: Clone, install dependencies, and push changes - they'll be reflected in Lovable.

