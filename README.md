# Dezemu - Single-Vendor E-Commerce Platform

Dezemu is a modern, single-vendor e-commerce platform built with React, TypeScript, Vite, and Supabase.

## 🏪 About Dezemu

Dezemu is a single-vendor online store offering quality products with fast delivery and secure shopping experience.

**Contact Information:**
- **WhatsApp:** +90 539 526 32 93
- **Email:** destek@dezemu.com
- **Website:** https://dezemu.com

## Project info

**URL**: https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560

## 🎨 Branding

- **Primary Color:** #ff6a00 (Dezemu Orange)
- **Store Name:** Dezemu
- **Seller ID:** dezemu

## 🚀 Quick Start

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account - [Sign up](https://supabase.com)

### Local Development

```sh
# Clone the repository
git clone https://github.com/mukremin1/dezem-shop-spark.git

# Navigate to the project directory
cd dezem-shop-spark

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your Supabase credentials

# Start the development server
npm run dev
```

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=your-project-id

# Single Vendor Configuration
NEXT_PUBLIC_SUPABASE_SINGLE_SELLER_ID=dezemu
SUPABASE_SINGLE_SELLER_ID=dezemu
DEFAULT_SELLER_NAME=Dezemu
DEFAULT_SELLER_LOGO_URL=https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff

# Theme Configuration
NEXT_PUBLIC_PRIMARY_COLOR=#ff6a00

# Contact Information
NEXT_PUBLIC_SUPPORT_EMAIL=destek@dezemu.com
NEXT_PUBLIC_SUPPORT_WHATSAPP=+905395263293
```

**⚠️ Important:** Never commit actual API keys or secrets to the repository!

## 🗄️ Database Setup

### Running the Migration

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to the **SQL Editor** section
3. Open `supabase/migrations/0001_single_vendor.sql`
4. Copy the entire SQL content and paste it into the SQL Editor
5. Click **Run** to execute the migration

The migration will:
- Create a `sellers` table
- Insert the default Dezemu seller
- Add `seller_id` column to the `products` table
- Rename old multi-vendor tables with `deprecated_` prefix

For detailed migration instructions, see [supabase/README.md](./supabase/README.md)

## 📦 Technologies Used

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui components
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form, Zod validation
- **Routing:** React Router v6

## 🏗️ Project Structure

```
dezem-shop-spark/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── integrations/   # Supabase client and types
├── supabase/
│   ├── migrations/     # Database migration files
│   └── README.md       # Migration instructions
├── public/            # Static assets
└── .env.example       # Environment variables template
```

## 🚢 Deployment

### Production Checklist

Before deploying to production, ensure you have completed:

#### Database Setup
- [ ] Run Supabase migration (`0001_single_vendor.sql`)
- [ ] Verify sellers table has Dezemu record
- [ ] Verify products table has seller_id column
- [ ] Check that deprecated tables are renamed

#### Environment Configuration
- [ ] Set all required environment variables in hosting platform
- [ ] **VITE_SUPABASE_URL** - Your Supabase project URL
- [ ] **VITE_SUPABASE_PUBLISHABLE_KEY** - Supabase anon/public key
- [ ] **VITE_SUPABASE_PROJECT_ID** - Your Supabase project ID
- [ ] **NEXT_PUBLIC_SUPABASE_SINGLE_SELLER_ID** - Set to 'dezemu'
- [ ] **DEFAULT_SELLER_NAME** - Set to 'Dezemu'
- [ ] **NEXT_PUBLIC_PRIMARY_COLOR** - Set to '#ff6a00'
- [ ] **NEXT_PUBLIC_SUPPORT_EMAIL** - Set to 'destek@dezemu.com'
- [ ] **NEXT_PUBLIC_SUPPORT_WHATSAPP** - Set to '+905395263293'

#### Security
- [ ] **Never commit** `SUPABASE_SERVICE_ROLE_KEY` to repository
- [ ] Add service role key only to hosting platform's secrets/env vars
- [ ] Enable Row Level Security (RLS) policies in Supabase
- [ ] Review and update CORS settings in Supabase

#### DNS & Domain
- [ ] Update DNS records to point to hosting platform
- [ ] Verify CNAME file contains 'dezemu.com'
- [ ] Configure SSL certificate
- [ ] Test domain resolution

#### Verification
- [ ] Test product creation with seller_id
- [ ] Verify contact info displays correctly
- [ ] Check theme colors render properly
- [ ] Test responsive design on mobile devices
- [ ] Verify all images load correctly
- [ ] Test checkout flow end-to-end

### Deployment Platforms

#### Vercel (Recommended)

```sh
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
# Project Settings > Environment Variables
```

#### GitHub Pages

```sh
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📚 Additional Documentation

- [Supabase Migration Guide](./supabase/README.md)
- [Lovable Documentation](https://docs.lovable.dev)

## 🛠️ Development Scripts

```sh
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run deploy   # Deploy to GitHub Pages
```

## 🤝 Contributing

This project is built with [Lovable](https://lovable.dev). You can:

1. **Use Lovable** - Visit the [Lovable Project](https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560) and start prompting
2. **Use your IDE** - Clone, make changes, and push (changes will reflect in Lovable)
3. **GitHub Codespaces** - Develop directly in the browser

## 📧 Support

For support or questions:
- Email: destek@dezemu.com
- WhatsApp: +90 539 526 32 93

## 📄 License

This project is private and proprietary to Dezemu.

---

**© 2025 Dezemu. All rights reserved.**
