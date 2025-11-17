# Dezem Shop - Single-Vendor E-Commerce MVP

A modern e-commerce platform built with React, Vite, TypeScript, and Supabase.

## Project info

**URL**: https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560

## Features

- ✅ Product catalog with categories
- ✅ Product detail pages with image gallery
- ✅ Shopping cart functionality
- ✅ Checkout process
- ✅ Admin quick-add products
- ✅ User authentication with Supabase
- ✅ Responsive design with Tailwind CSS
- ✅ Row-Level Security (RLS) for data protection

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn-ui components
- **State Management**: Zustand, TanStack Query
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Getting Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Navigate to Project Settings > API
4. Copy the `Project URL` (VITE_SUPABASE_URL)
5. Copy the `anon public` key (VITE_SUPABASE_PUBLISHABLE_KEY)

## Installation and Setup

### 1. Clone the repository

```sh
git clone https://github.com/mukremin1/dezem-shop-spark.git
cd dezem-shop-spark
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env` file with your Supabase credentials (see Environment Variables section above).

### 4. Run database migrations

The Supabase migrations are located in the `supabase/migrations` directory. You have two options:

**Option A: Using Supabase CLI (Recommended)**

```sh
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Push migrations to Supabase
supabase db push
```

**Option B: Manual SQL execution**

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Execute the SQL files from `supabase/migrations` in order

### 5. Seed the database

Run the seed script to add sample products:

```sh
npm run seed
```

Or manually run the SQL seed file:
1. Go to Supabase SQL Editor
2. Run the contents of `supabase/seed.sql`

### 6. Start the development server

```sh
npm run dev
```

The app will be available at `http://localhost:5173`

## Database Schema

### Tables

- **categories**: Product categories
- **products**: Product catalog
- **product_images**: Product image gallery
- **product_variants**: Product variants (size, color, etc.)
- **orders**: Customer orders
- **order_items**: Order line items
- **profiles**: User profiles
- **user_roles**: User role management

### Row Level Security (RLS)

The database uses Supabase RLS policies to secure data:
- Products and categories are publicly readable
- Only authenticated admins can create/update products
- Users can only view their own orders
- Anyone can create orders (for guest checkout)

## Admin Features

### Admin Access

Admin functionality is protected using Supabase user roles. To make a user an admin:

1. Go to Supabase dashboard
2. Navigate to Authentication > Users
3. Find the user
4. Go to SQL Editor and run:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

### Admin Quick-Add

Admins can quickly add products via the homepage form or bulk upload via Excel.

## Project Structure

```
├── src/
│   ├── components/         # Reusable React components
│   │   ├── ui/            # shadcn-ui components
│   │   ├── Header.tsx     # Site header with navigation
│   │   ├── Footer.tsx     # Site footer
│   │   ├── ProductCard.tsx        # Product card component
│   │   ├── ProductGallery.tsx     # Image gallery component
│   │   └── AdminRoute.tsx         # Protected admin routes
│   ├── pages/             # Page components
│   │   ├── Index.tsx              # Home/product listing page
│   │   ├── ProductDetail.tsx      # Product detail page
│   │   ├── Cart.tsx              # Shopping cart
│   │   ├── Checkout.tsx          # Checkout process
│   │   ├── Auth.tsx              # Authentication page
│   │   └── AdminUpload.tsx       # Admin product upload
│   ├── hooks/             # Custom React hooks
│   │   ├── useCart.tsx    # Shopping cart state management
│   │   ├── useAdmin.tsx   # Admin role checking
│   │   └── useAuth.tsx    # Authentication helpers
│   ├── integrations/      # Third-party integrations
│   │   └── supabase/      # Supabase client and types
│   ├── App.tsx            # Main app component with routing
│   └── main.tsx           # App entry point
├── supabase/
│   ├── migrations/        # Database migrations
│   └── seed.sql          # Sample data seed file
├── scripts/
│   └── seed.js           # JavaScript seed script
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run seed` - Seed database with sample products
- `npm run deploy` - Deploy to GitHub Pages

## Building for Production

```sh
npm run build
```

The build output will be in the `dist` directory.

## Deployment

### GitHub Pages

```sh
npm run deploy
```

### Other Platforms

The built files in `dist/` can be deployed to any static hosting service:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Test locally with `npm run dev`
4. Build to verify: `npm run build`
5. Commit and push
6. Create a pull request

## Contributing

This project was built with Lovable. You can edit it via:
- [Lovable Project](https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560)
- Your preferred IDE (push changes to sync with Lovable)

## Troubleshooting

### Build Errors

If you encounter build errors after installing dependencies:

```sh
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Issues

Verify your `.env` file contains the correct Supabase credentials:

```sh
# Test connection
npm run dev
# Check browser console for Supabase errors
```

### RLS Policy Errors

If you can't insert/update data, check RLS policies in Supabase dashboard under Authentication & API > Policies.

## License

This project is private and all rights are reserved.

## Support

For issues or questions:
- Email: destek@dezemu.com
- Phone: +90 539 526 32 93
