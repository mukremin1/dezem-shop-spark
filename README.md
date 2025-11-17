# Dezemu - Single Vendor E-Commerce Platform

Dezemu is a modern, single-vendor e-commerce platform built with React, TypeScript, and Supabase.

## 🎨 Features

- **Single Vendor Store**: Dezemu-branded store with Trendyol-inspired theme (#ff6a00)
- **Product Management**: Admin panel for easy product uploads via Excel, XML, or manual entry
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Supabase Backend**: Secure authentication and database management
- **Fast Performance**: Built with Vite for optimal build speeds

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm installed
- Supabase account and project

### Installation

```sh
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

## 📦 Database Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/0001_single_vendor.sql`
4. Verify the Dezemu seller was created: `SELECT * FROM sellers WHERE id = 'dezemu';`

See [supabase/README.md](./supabase/README.md) for detailed migration instructions.

## 🌐 Deployment

### Ready to Publish Checklist

Before deploying to https://dezemu.com:

- [ ] Run migration `0001_single_vendor.sql` in production Supabase
- [ ] Set production environment variables (see `.env.example`)
- [ ] Configure DNS: Point `dezemu.com` to your hosting provider
- [ ] Update Supabase project URL restrictions
- [ ] Enable SSL/HTTPS on hosting provider
- [ ] Test product creation and seller_id assignment
- [ ] Verify WhatsApp and email links work correctly

### Environment Variables

Required environment variables for production:

```
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_SINGLE_SELLER_ID=dezemu
VITE_DEFAULT_SELLER_LOGO_URL=https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff
```

### Build for Production

```sh
npm run build
```

The `dist` folder will contain production-ready files.

### Deploy to GitHub Pages

```sh
npm run deploy
```

## 📞 Contact & Support

- **Email**: destek@dezemu.com
- **WhatsApp**: +90 539 526 32 93
- **Website**: https://dezemu.com

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn-ui components
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form, Zod validation

## 📄 License

This project is proprietary software for Dezemu.

## 🤝 Contributing

This is a private repository. For feature requests or bug reports, please contact the development team.

---

Made with ❤️ for Dezemu
