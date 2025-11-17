-- Seed file for example products
-- This creates sample categories and products for the e-commerce MVP

-- Create sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Elektronik', 'elektronik', 'Elektronik ürünler ve aksesuarlar'),
  ('Giyim', 'giyim', 'Giyim ve moda ürünleri'),
  ('Ev & Yaşam', 'ev-yasam', 'Ev dekorasyonu ve yaşam ürünleri')
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs (we'll use these in the next section)
DO $$
DECLARE
  elektronik_id UUID;
  giyim_id UUID;
  ev_yasam_id UUID;
  product1_id UUID;
  product2_id UUID;
  product3_id UUID;
  product4_id UUID;
  product5_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO elektronik_id FROM public.categories WHERE slug = 'elektronik' LIMIT 1;
  SELECT id INTO giyim_id FROM public.categories WHERE slug = 'giyim' LIMIT 1;
  SELECT id INTO ev_yasam_id FROM public.categories WHERE slug = 'ev-yasam' LIMIT 1;

  -- Insert products
  INSERT INTO public.products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured)
  VALUES
    (
      'Kablosuz Bluetooth Kulaklık',
      'kablosuz-bluetooth-kulaklik',
      'Yüksek kaliteli ses ve gürültü önleme özellikli kablosuz kulaklık. 30 saate kadar pil ömrü, hızlı şarj desteği ve ergonomik tasarım.',
      'Premium ses kalitesi ve konforlu kullanım',
      299.99,
      399.99,
      'WH-1000XM5',
      50,
      elektronik_id,
      true,
      true
    )
  RETURNING id INTO product1_id;

  INSERT INTO public.products (name, slug, description, short_description, price, sku, stock_quantity, category_id, is_active, is_featured)
  VALUES
    (
      'Pamuklu Basic T-Shirt',
      'pamuklu-basic-t-shirt',
      '%100 pamuklu, rahat kesim basic t-shirt. Günlük kullanım için ideal. Farklı renk seçenekleri mevcut.',
      'Konforlu günlük kullanım',
      79.90,
      'TS-BASIC-001',
      200,
      giyim_id,
      true,
      false
    )
  RETURNING id INTO product2_id;

  INSERT INTO public.products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active, is_featured)
  VALUES
    (
      'Akıllı Saat Pro',
      'akilli-saat-pro',
      'Tam dokunmatik ekran, kalp atış hızı takibi, uyku analizi ve 100+ spor modu. Su geçirmez tasarım ve 7 gün pil ömrü.',
      'Sağlık ve fitness takibi',
      1299.00,
      1599.00,
      'SW-PRO-2024',
      35,
      elektronik_id,
      true,
      true
    )
  RETURNING id INTO product3_id;

  INSERT INTO public.products (name, slug, description, short_description, price, sku, stock_quantity, category_id, is_active, is_digital)
  VALUES
    (
      'E-Kitap: Web Geliştirme Rehberi',
      'e-kitap-web-gelistirme-rehberi',
      'Modern web geliştirme teknikleri ve best practices. React, TypeScript, Node.js ve daha fazlası. 500+ sayfa kapsamlı içerik.',
      'Dijital kitap - anında teslim',
      49.90,
      'EBOOK-WEB-001',
      9999,
      elektronik_id,
      true,
      true
    )
  RETURNING id INTO product4_id;

  INSERT INTO public.products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, is_active)
  VALUES
    (
      'Dekoratif Duvar Saati',
      'dekoratif-duvar-saati',
      'Modern ve minimalist tasarımlı duvar saati. Sessiz mekanizma, kolay asılabilir. 30cm çap, ahşap çerçeve.',
      'Şık ve modern tasarım',
      189.00,
      249.00,
      'CLOCK-WALL-001',
      75,
      ev_yasam_id,
      true
    )
  RETURNING id INTO product5_id;

  -- Insert product images
  INSERT INTO public.product_images (product_id, image_url, alt_text, position) VALUES
    (product1_id, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Kablosuz Bluetooth Kulaklık', 0),
    (product1_id, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', 'Kulaklık detay', 1),
    
    (product2_id, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'Pamuklu Basic T-Shirt', 0),
    (product2_id, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'T-Shirt detay', 1),
    
    (product3_id, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'Akıllı Saat Pro', 0),
    (product3_id, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800', 'Akıllı saat ekran', 1),
    (product3_id, 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800', 'Akıllı saat kullanım', 2),
    
    (product4_id, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', 'E-Kitap kapağı', 0),
    
    (product5_id, 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800', 'Dekoratif Duvar Saati', 0),
    (product5_id, 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800', 'Duvar saati detay', 1);

END $$;
