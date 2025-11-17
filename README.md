# Dezemu - Single Vendor E-Commerce Platform

## Project Info

**URL**: https://dezemu.com  
**Platform**: Vite + React + TypeScript + Tailwind CSS + Supabase

This is a single-vendor e-commerce platform for **Dezemu**, featuring a Trendyol-inspired design with orange (#ff6a00) branding.

## Contact Information

- **Email**: destek@dezemu.com
- **WhatsApp**: +905395263293

## Features

- Single-vendor product management
- Admin product upload (manual, Excel, XML import)
- Category management
- Product search and filtering
- Shopping cart and checkout
- Order management
- Mobile-responsive design
- Trendyol-inspired theme

## Local Development

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account and project

### Setup Steps

```sh
# Step 1: Clone the repository
git clone https://github.com/mukremin1/dezem-shop-spark.git

# Step 2: Navigate to the project directory
cd dezem-shop-spark

# Step 3: Install dependencies
npm install

# Step 4: Copy .env.example to .env and configure
cp .env.example .env
# Edit .env with your Supabase credentials

# Step 5: Run database migrations
# See supabase/README.md for detailed migration instructions

# Step 6: Start the development server
npm run dev
```

### Environment Variables

Required environment variables (see `.env.example`):

- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_SINGLE_SELLER_ID` - Seller ID (default: 'dezemu')
- `VITE_DEFAULT_SELLER_LOGO_URL` - Logo URL for Dezemu
- `VITE_SUPPORT_EMAIL` - Support email address
- `VITE_SUPPORT_WHATSAPP` - WhatsApp contact number

## Database Migrations

This project uses Supabase for the database. Migration files are in `supabase/migrations/`.

### Running Migrations

1. Install Supabase CLI: `npm install -g supabase`
2. Link to your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

See `supabase/README.md` for detailed instructions.

## Single-Vendor Architecture

This platform has been converted from multi-vendor to single-vendor mode:

- **Default Seller**: Dezemu (ID: 'dezemu')
- All products are automatically assigned to Dezemu
- Multi-vendor tables have been renamed to `deprecated_*` for safe rollback
- Seller selection is hidden from the UI

## Deployment

### Deploy to Production

**Pre-deployment Checklist:**

- [ ] Set all environment variables in hosting platform (Vercel/Netlify)
- [ ] Run database migrations on production Supabase instance
- [ ] Verify CNAME file contains `dezemu.com`
- [ ] Configure custom domain DNS records
- [ ] Test admin upload functionality
- [ ] Verify product listings display correctly
- [ ] Test checkout flow
- [ ] Confirm contact information displays correctly

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy from `main` branch
4. Set custom domain to `dezemu.com`

### DNS Configuration

Point your domain to the hosting platform:

**For Vercel:**
- A record: `76.76.21.21`
- CNAME record: `cname.vercel-dns.com`

**For GitHub Pages:**
- A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- CNAME record: `mukremin1.github.io`

## Build & Deploy

```sh
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn-ui components
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Project Structure

```
dezem-shop-spark/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── lib/            # Utility functions
│   ├── hooks/          # Custom React hooks
│   └── integrations/   # Supabase client setup
├── supabase/
│   ├── migrations/     # Database migration files
│   └── README.md       # Migration instructions
├── public/             # Static assets
└── .env.example        # Environment variables template
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For technical support or questions:
- Email: destek@dezemu.com
- WhatsApp: +905395263293

## License

Private project - All rights reserved
