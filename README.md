# Dezemu Shop - Single Vendor E-commerce

A modern e-commerce platform built with React, TypeScript, and Supabase, configured for single-vendor operation.

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

### Setup Steps

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Step 5: Run database migrations (see supabase/README.md)
# Apply 0001_single_vendor.sql in Supabase SQL Editor

# Step 6: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Testing Single-Vendor Mode

After setup, verify the single-vendor configuration:

1. **Check default seller**: Open Supabase dashboard and verify the sellers table has a default entry
2. **Product operations**: Products should automatically be associated with the default seller
3. **No seller selection**: The UI should not show seller selection dropdowns or registration pages
4. **Header branding**: The header should display your default seller name from environment variables

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

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
- Supabase (Backend & Database)

## Single-Vendor Mode

This application is configured to operate as a single-vendor e-commerce platform. All products are associated with a default seller, and multi-vendor features are disabled.

### Environment Configuration

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Single Vendor Configuration
SUPABASE_SINGLE_SELLER_ID=default_seller
DEFAULT_SELLER_NAME=Dezemu Shop
DEFAULT_SELLER_LOGO_URL=https://your-cdn.com/logo.png
```

### Database Migration

Before running the application, you need to apply the single-vendor migration:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration file: `supabase/migrations/0001_single_vendor.sql`

See `supabase/README.md` for detailed migration instructions.

### What the Migration Does

- Creates a `sellers` table with Row Level Security
- Inserts a default seller for your shop
- Adds `seller_id` column to products table
- Preserves any legacy multi-vendor tables by renaming them with `deprecated_` prefix
- Sets up helper functions for accessing the default seller

## Local Development

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account and project

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a9f847fd-78b9-4990-a3ff-7088fbbcc560) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
