# Dezemu - Single-Vendor E-Commerce Platform

Dezemu is a modern, single-vendor e-commerce platform built with React, TypeScript, and Supabase.

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

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## 🗄️ Database Setup

### Running the Migration

The single-vendor migration must be run before deploying the application:

1. **Access Supabase Dashboard**
   - Navigate to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to SQL Editor

2. **Run Migration**
   - Open `supabase/migrations/0001_single_vendor.sql`
   - Copy the entire contents
   - Paste into SQL Editor and execute

3. **Verify Migration**
   ```sql
   -- Check sellers table
   SELECT * FROM public.sellers;
   
   -- Verify seller_id column on products
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'products' AND column_name = 'seller_id';
   ```

For detailed migration instructions, see [supabase/README.md](supabase/README.md).

## 🔧 Configuration

### Environment Variables

Required environment variables (see `.env.example`):

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Single Vendor Configuration
NEXT_PUBLIC_SUPABASE_SINGLE_SELLER_ID=dezemu
SUPABASE_SINGLE_SELLER_ID=dezemu
DEFAULT_SELLER_NAME=Dezemu
DEFAULT_SELLER_LOGO_URL=https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff

# Theme
NEXT_PUBLIC_PRIMARY_COLOR=#ff6a00

# Contact
NEXT_PUBLIC_SUPPORT_EMAIL=destek@dezemu.com
NEXT_PUBLIC_SUPPORT_WHATSAPP=+905395263293
```

### Deployment

#### Vercel Deployment

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your GitHub repository

2. **Set Environment Variables**
   - Add all variables from `.env.example`
   - **Important**: Add production Supabase credentials

3. **Deploy**
   - Vercel will automatically deploy on push to main

#### DNS Configuration

1. **Add Custom Domain**
   - In Vercel dashboard, go to Project Settings → Domains
   - Add `dezemu.com`

2. **Update DNS Records**
   - Add CNAME record: `dezemu.com` → `cname.vercel-dns.com`
   - Or use A record pointing to Vercel's IP

3. **Verify**
   - Wait for DNS propagation (up to 48 hours)
   - Visit https://dezemu.com

## 📦 Project Structure

```
dezem-shop-spark/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   └── integrations/    # Supabase integration
├── supabase/
│   ├── migrations/      # Database migrations
│   └── README.md        # Migration documentation
├── public/              # Static assets
└── .github/
    └── workflows/       # CI/CD workflows
```

## 🎨 Theme Customization

The primary brand color is set to `#ff6a00` (orange). To customize:

1. Update `tailwind.config.ts`
2. Update `src/index.css` (CSS variables)
3. Update environment variable `NEXT_PUBLIC_PRIMARY_COLOR`

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Deployment Checklist

Before deploying to production:

- [ ] Run database migration in Supabase
- [ ] Set all environment variables in Vercel
- [ ] Configure custom domain (dezemu.com)
- [ ] Update DNS records
- [ ] Test payment integration (if applicable)
- [ ] Verify email notifications work
- [ ] Test WhatsApp contact link
- [ ] Run `npm run build` locally to verify no errors
- [ ] Enable Vercel analytics (optional)

### Required Secrets

Set these in Vercel Environment Variables (never commit to repo):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations only)

Set these in GitHub Secrets (for CI/CD):

- `VERCEL_TOKEN` (optional, for automated deployments)
- `SUPABASE_SERVICE_ROLE_KEY` (optional, for running migrations in CI)

## 🛡️ Security Notes

⚠️ **Important Security Practices**:

1. **Never commit secrets** to the repository
2. **Service role key** should only be used server-side
3. Use **Row Level Security (RLS)** in Supabase for data protection
4. Keep dependencies updated: `npm audit` and `npm update`

## 📞 Contact & Support

- **Email**: destek@dezemu.com
- **WhatsApp**: +90 539 526 32 93
- **Website**: https://dezemu.com

## 🤝 Contributing

This is a single-vendor store. For feature requests or bug reports, contact the development team.

## 📄 License

Proprietary - All rights reserved by Dezemu

---

**Last Updated**: 2025-11-17  
**Version**: 1.0.0
