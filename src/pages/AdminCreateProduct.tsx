import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface FormData {
  name: string;
  price: string;
  compare_price: string;
  stock_quantity: string;
  category_id: string;
  description: string;
  short_description: string;
  is_active: boolean;
  is_digital: boolean;
  is_featured: boolean;
  image_url: string;
}

const AdminCreateProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    compare_price: "",
    stock_quantity: "0",
    category_id: "",
    description: "",
    short_description: "",
    is_active: true,
    is_digital: false,
    is_featured: false,
    image_url: "",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof FormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Hata",
        description: "Ürün adı zorunludur.",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast({
        title: "Hata",
        description: "Geçerli bir fiyat girin.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const slug = generateSlug(formData.name);

      const productData = {
        name: formData.name.trim(),
        slug,
        price,
        compare_price: formData.compare_price
          ? parseFloat(formData.compare_price)
          : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: formData.category_id || null,
        description: formData.description.trim() || null,
        short_description: formData.short_description.trim() || null,
        is_active: formData.is_active,
        is_digital: formData.is_digital,
        is_featured: formData.is_featured,
      };

      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (productError) throw productError;

      // Insert image if provided
      if (formData.image_url.trim() && product) {
        const { error: imageError } = await supabase
          .from("product_images")
          .insert([
            {
              product_id: product.id,
              image_url: formData.image_url.trim(),
              position: 0,
            },
          ]);

        if (imageError) {
          console.error("Image insert error:", imageError);
          // Don't throw, product was already created
        }
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla oluşturuldu.",
      });

      navigate(`/product/${slug}`);
    } catch (error: unknown) {
      console.error("Product creation error:", error);
      const message =
        error instanceof Error ? error.message : "Ürün oluşturulurken hata oluştu.";
      toast({
        title: "Hata",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Ürün Oluştur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ürün adı"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (₺) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compare_price">Karşılaştırma Fiyatı (₺)</Label>
                <Input
                  id="compare_price"
                  name="compare_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.compare_price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stok Miktarı</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Kategori seçin" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Kısa Açıklama</Label>
              <Input
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                placeholder="Kısa açıklama"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ürün açıklaması"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Görsel URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Aktif</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("is_active", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_digital">Dijital Ürün</Label>
                <Switch
                  id="is_digital"
                  checked={formData.is_digital}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("is_digital", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Öne Çıkan</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("is_featured", checked)
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Kaydediliyor..." : "Ürünü Oluştur"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCreateProduct;
