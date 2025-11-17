# Dezemu - Single Vendor E-Commerce Platform

Dezemu is a modern, single-vendor e-commerce platform built with React, TypeScript, Vite, and Supabase.

## 🏪 About Dezemu

Dezemu is a streamlined single-vendor store focused on providing the best products at the best prices. Built with cutting-edge technology for a fast, secure, and reliable shopping experience.

**Contact Information:**
- 📧 Email: destek@dezemu.com
- 📱 WhatsApp: +90 539 526 3293
- 🌐 Website: https://dezemu.com

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/mukremin1/dezem-shop-spark.git
cd dezem-shop-spark

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

## 📦 Project Structure

```
dezem-shop-spark/
├── .github/workflows/    # CI/CD workflows
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities (avatar generation, etc.)
│   └── integrations/    # Supabase integration
├── supabase/
│   ├── migrations/      # Database migrations
│   └── README.md        # Migration documentation
└── public/              # Static assets
```

## 🗄️ Database Setup

### Running Migrations

The database migration converts the schema to single-vendor mode. See `supabase/README.md` for detailed instructions.

**Quick migration via Supabase SQL Editor:**

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy content from `supabase/migrations/0001_single_vendor.sql`
4. Run the migration

**What the migration does:**
- Creates `sellers` table with default "dezemu" seller
- Adds `seller_id` column to products (defaults to 'dezemu')
- Renames multi-vendor tables to `deprecated_*` (non-destructive)

## 🎨 Theme & Branding

Dezemu uses Trendyol-inspired primary color scheme:
- Primary Color: `#ff6a00` (Trendyol Orange)
- Configured in `tailwind.config.ts`

## 🔧 Environment Variables

Required variables (see `.env.example`):

```bash
# Supabase
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Single Vendor
NEXT_PUBLIC_SUPABASE_SINGLE_SELLER_ID=dezemu
DEFAULT_SELLER_NAME=Dezemu

# Contact
NEXT_PUBLIC_SUPPORT_EMAIL=destek@dezemu.com
NEXT_PUBLIC_SUPPORT_WHATSAPP=+905395263293
```

## 🚢 Deployment

### Deploy to Vercel

1. Fork/clone this repository
2. Import project to Vercel
3. Add environment variables from `.env.example`
4. Deploy!

### Custom Domain (dezemu.com)

1. Add custom domain in Vercel project settings
2. Update DNS records:
   - Add CNAME record pointing to your Vercel deployment
   - Verify in Vercel dashboard

The `CNAME` file in the root already contains `dezemu.com` for GitHub Pages compatibility.

## 📋 Publish Checklist

Before going live:

- [ ] Run database migration (`supabase/migrations/0001_single_vendor.sql`)
- [ ] Verify environment variables in production
- [ ] Test product upload (manual, Excel, XML)
- [ ] Verify seller_id is set on all products
- [ ] Test checkout flow
- [ ] Configure Vercel deployment (if using)
- [ ] Set up custom domain DNS
- [ ] Update contact information if needed
- [ ] Test on mobile devices
- [ ] Enable SSL/HTTPS
- [ ] Set up monitoring/analytics

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npx tsc --noEmit` - Type check

### Admin Features

Admins can:
- Upload products manually via form
- Bulk upload via Excel
- Auto-upload from XML feed
- Edit/manage products

Admin access is controlled via the `useAdmin` hook.

## 🔐 Required Secrets (for CI/CD)

Add these secrets in GitHub repository settings:

**Required:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project ID

**Optional (for migrations):**
- `SUPABASE_DB_URL` - PostgreSQL connection string for migrations

**Optional (for Vercel deployment):**
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## 🤝 Support

For technical support or questions:
- Email: destek@dezemu.com
- WhatsApp: +90 539 526 3293

## 📄 License

Proprietary - All rights reserved to Dezemu

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
