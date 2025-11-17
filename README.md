# Dezem Shop - Single-Vendor E-Commerce Platform

A modern, single-vendor e-commerce application built with React, TypeScript, and Supabase.

## 🛍️ Single-Vendor Mode

This application is designed as a **single-vendor e-commerce platform** (not a multi-vendor marketplace). This means:

- ✅ One store owner/admin manages all products
- ✅ Unified shopping experience for customers
- ✅ Simpler architecture and management
- ✅ All products belong to a single default seller
- ❌ No seller registration or multi-vendor features

## Project info

**URL**: https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (PostgreSQL database, authentication, storage)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/mukremin1/dezem-shop-spark.git
   cd dezem-shop-spark
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```sh
   cp .env.example .env
   ```
   
   Edit `.env` and add your values:
   ```bash
   VITE_SUPABASE_PROJECT_ID=your-project-id
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_SINGLE_SELLER_ID=00000000-0000-0000-0000-000000000001
   VITE_DEFAULT_SELLER_NAME=Your Store Name
   ```

4. **Run database migrations**
   
   Apply the database schema to your Supabase project:
   
   - Open your [Supabase Dashboard](https://app.supabase.com/)
   - Go to SQL Editor
   - Run each migration file from `supabase/migrations/` in order
   - Most importantly, run `20251117221158_single_vendor.sql` to set up the single-vendor configuration
   
   See [supabase/README.md](./supabase/README.md) for detailed migration instructions.

5. **Start the development server**
   ```sh
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### First-Time Admin Setup

The first user to register will automatically become an admin. To add products:

1. Register/login to your account
2. You'll see the admin product management interface on the home page
3. Use the "Quick Add Product" form or Excel bulk upload

## 📁 Project Structure

```
dezem-shop-spark/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── integrations/    # Supabase client setup
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── supabase/
│   ├── migrations/      # Database migration files
│   └── README.md        # Migration documentation
├── public/              # Static assets
└── .env.example         # Environment variables template
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (PostgreSQL database, authentication, storage)

## How can I deploy this project?

### Deploy to Lovable

Simply open [Lovable](https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560) and click on Share -> Publish.

### Deploy to GitHub Pages

```sh
npm run deploy
```

### Deploy to Other Platforms

The application can be deployed to any static hosting service:

- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

Make sure to:
1. Set up environment variables on your hosting platform
2. Run database migrations on your production Supabase project
3. Configure CORS settings in Supabase if needed

## 🔐 Security Notes

- The first registered user automatically becomes an admin
- Only admins can add, edit, or delete products
- Row Level Security (RLS) is enabled on all tables
- Never expose `VITE_SUPABASE_SERVICE_ROLE_KEY` in client code

## 📝 Single-Vendor Architecture

This application uses a simplified single-vendor architecture:

1. **sellers table** - Contains one default seller record
2. **products.seller_id** - All products reference the default seller
3. **No multi-vendor UI** - No seller registration or marketplace features
4. **Admin-only management** - Single admin manages all products

Benefits:
- Simpler codebase and maintenance
- Better performance (no complex seller filtering)
- Unified customer experience
- Easier to manage and scale for single business

For detailed information about the single-vendor setup and database schema, see [supabase/README.md](./supabase/README.md).

## 🆘 Troubleshooting

**Products not showing?**
- Ensure migrations are run on your Supabase project
- Check that products have `is_active = true`
- Verify environment variables are correct

**Can't add products?**
- Make sure you're logged in as an admin
- Check browser console for errors
- Verify Supabase RLS policies are applied

**Migration errors?**
- Migrations should be run in order by timestamp
- See [supabase/README.md](./supabase/README.md) for detailed instructions
- Some migrations may fail if run multiple times (expected if already applied)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
