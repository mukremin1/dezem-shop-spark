import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleCategories = [
  { name: 'Elektronik', slug: 'elektronik', description: 'Elektronik ürünler ve aksesuarlar' },
  { name: 'Giyim', slug: 'giyim', description: 'Giyim ve moda ürünleri' },
  { name: 'Ev & Yaşam', slug: 'ev-yasam', description: 'Ev dekorasyonu ve yaşam ürünleri' },
];

const sampleProducts = [
  {
    name: 'Kablosuz Bluetooth Kulaklık',
    slug: 'kablosuz-bluetooth-kulaklik',
    description: 'Yüksek kaliteli ses ve gürültü önleme özellikli kablosuz kulaklık. 30 saate kadar pil ömrü, hızlı şarj desteği ve ergonomik tasarım.',
    short_description: 'Premium ses kalitesi ve konforlu kullanım',
    price: 299.99,
    compare_price: 399.99,
    sku: 'WH-1000XM5',
    stock_quantity: 50,
    category_slug: 'elektronik',
    is_active: true,
    is_featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: 'Kablosuz Bluetooth Kulaklık', position: 0 },
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', alt: 'Kulaklık detay', position: 1 },
    ],
  },
  {
    name: 'Pamuklu Basic T-Shirt',
    slug: 'pamuklu-basic-t-shirt',
    description: '%100 pamuklu, rahat kesim basic t-shirt. Günlük kullanım için ideal. Farklı renk seçenekleri mevcut.',
    short_description: 'Konforlu günlük kullanım',
    price: 79.90,
    sku: 'TS-BASIC-001',
    stock_quantity: 200,
    category_slug: 'giyim',
    is_active: true,
    is_featured: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', alt: 'Pamuklu Basic T-Shirt', position: 0 },
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', alt: 'T-Shirt detay', position: 1 },
    ],
  },
  {
    name: 'Akıllı Saat Pro',
    slug: 'akilli-saat-pro',
    description: 'Tam dokunmatik ekran, kalp atış hızı takibi, uyku analizi ve 100+ spor modu. Su geçirmez tasarım ve 7 gün pil ömrü.',
    short_description: 'Sağlık ve fitness takibi',
    price: 1299.00,
    compare_price: 1599.00,
    sku: 'SW-PRO-2024',
    stock_quantity: 35,
    category_slug: 'elektronik',
    is_active: true,
    is_featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', alt: 'Akıllı Saat Pro', position: 0 },
      { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800', alt: 'Akıllı saat ekran', position: 1 },
      { url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800', alt: 'Akıllı saat kullanım', position: 2 },
    ],
  },
  {
    name: 'E-Kitap: Web Geliştirme Rehberi',
    slug: 'e-kitap-web-gelistirme-rehberi',
    description: 'Modern web geliştirme teknikleri ve best practices. React, TypeScript, Node.js ve daha fazlası. 500+ sayfa kapsamlı içerik.',
    short_description: 'Dijital kitap - anında teslim',
    price: 49.90,
    sku: 'EBOOK-WEB-001',
    stock_quantity: 9999,
    category_slug: 'elektronik',
    is_active: true,
    is_digital: true,
    is_featured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', alt: 'E-Kitap kapağı', position: 0 },
    ],
  },
  {
    name: 'Dekoratif Duvar Saati',
    slug: 'dekoratif-duvar-saati',
    description: 'Modern ve minimalist tasarımlı duvar saati. Sessiz mekanizma, kolay asılabilir. 30cm çap, ahşap çerçeve.',
    short_description: 'Şık ve modern tasarım',
    price: 189.00,
    compare_price: 249.00,
    sku: 'CLOCK-WALL-001',
    stock_quantity: 75,
    category_slug: 'ev-yasam',
    is_active: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800', alt: 'Dekoratif Duvar Saati', position: 0 },
      { url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800', alt: 'Duvar saati detay', position: 1 },
    ],
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Insert categories
    console.log('📦 Inserting categories...');
    const categoryMap = new Map();

    for (const category of sampleCategories) {
      const { data, error } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'slug' })
        .select()
        .single();

      if (error && error.code !== '23505') {
        console.error(`Error inserting category ${category.name}:`, error);
      } else {
        const existingCategory = data || (await supabase
          .from('categories')
          .select()
          .eq('slug', category.slug)
          .single()).data;

        if (existingCategory) {
          categoryMap.set(category.slug, existingCategory.id);
          console.log(`  ✓ ${category.name}`);
        }
      }
    }

    // 2. Insert products with images
    console.log('\n📦 Inserting products...');
    for (const product of sampleProducts) {
      const { category_slug, images, ...productData } = product;
      const category_id = categoryMap.get(category_slug);

      // Check if product exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .maybeSingle();

      if (existing) {
        console.log(`  ⊘ ${product.name} (already exists)`);
        continue;
      }

      // Insert product
      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert({ ...productData, category_id })
        .select()
        .single();

      if (productError) {
        console.error(`  ✗ Error inserting ${product.name}:`, productError);
        continue;
      }

      console.log(`  ✓ ${product.name}`);

      // Insert product images
      if (images && images.length > 0) {
        const imageInserts = images.map(img => ({
          product_id: insertedProduct.id,
          image_url: img.url,
          alt_text: img.alt,
          position: img.position,
        }));

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imageError) {
          console.error(`    ✗ Error inserting images for ${product.name}:`, imageError);
        } else {
          console.log(`    ✓ Inserted ${images.length} images`);
        }
      }
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - ${sampleCategories.length} categories`);
    console.log(`   - ${sampleProducts.length} products`);
    console.log(`   - ${sampleProducts.reduce((sum, p) => sum + (p.images?.length || 0), 0)} product images`);

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
