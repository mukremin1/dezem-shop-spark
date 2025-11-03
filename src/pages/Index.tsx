import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useSearchParams } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  
  const [productName, setProductName] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ["products", categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          product_images(image_url, alt_text),
          categories(slug)
        `)
        .eq("is_active", true);

      // Kategori filtresi varsa uygula
      if (categoryFilter) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categoryFilter)
          .maybeSingle();

        if (category) {
          query = query.eq("category_id", category.id);
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productPrice || !productImageUrl) {
      toast({
        title: "Hata",
        description: "Ürün adı, resim URL ve fiyat zorunludur.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = productName
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Ürün ekle
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productName,
          slug,
          price: parseFloat(productPrice),
          category_id: productCategory || null,
          stock_quantity: 100,
          is_active: true,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Resim ekle
      const { error: imageError } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          image_url: productImageUrl,
          position: 0,
        });

      if (imageError) throw imageError;

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla eklendi.",
      });

      // Formu temizle
      setProductName("");
      setProductImageUrl("");
      setProductPrice("");
      setProductCategory("");
      
      // Ürünleri yenile
      refetch();
    } catch (error) {
      console.error('Quick add error:', error);
      toast({
        title: "Hata",
        description: "Ürün eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full">
          <Header />
          <main className="flex-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
              <div className="container">
                <div className="flex items-center gap-4 mb-8">
                  <SidebarTrigger />
                  <h1 className="text-4xl md:text-6xl font-bold">
                    En İyi Ürünler,
                    <br />
                    <span className="text-primary">En İyi Fiyatlar</span>
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Fiziksel ve dijital ürünleriniz için güvenilir alışveriş platformu
                </p>
              </div>
            </section>

            {/* Quick Add Product (Admin Only) */}
            {isAdmin && (
              <section className="py-8 bg-muted/30">
                <div className="container">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Hızlı Ürün Ekle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleQuickAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quick-name">Ürün Adı *</Label>
                          <Input
                            id="quick-name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Ürün adı"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="quick-image">Resim URL *</Label>
                          <Input
                            id="quick-image"
                            value={productImageUrl}
                            onChange={(e) => setProductImageUrl(e.target.value)}
                            placeholder="https://..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quick-price">Fiyat *</Label>
                          <Input
                            id="quick-price"
                            type="number"
                            step="0.01"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            placeholder="0.00"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quick-category">Kategori</Label>
                          <Select value={productCategory} onValueChange={setProductCategory}>
                            <SelectTrigger id="quick-category">
                              <SelectValue placeholder="Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end">
                          <Button type="submit" disabled={isSubmitting} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Ekleniyor..." : "Ekle"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}

            {/* Featured Products */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">
              {categoryFilter ? `Kategori: ${categoryFilter}` : "Öne Çıkan Ürünler"}
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    comparePrice={product.compare_price ? Number(product.compare_price) : undefined}
                    imageUrl={product.product_images?.[0]?.image_url}
                    slug={product.slug}
                    isDigital={product.is_digital}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Henüz ürün bulunmamaktadır.
                </p>
              </div>
            )}
          </div>
          </section>
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
