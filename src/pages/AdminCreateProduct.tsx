import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
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

/**
 * Generates a URL-friendly slug from a product name using the project's slug rules.
 * Converts Turkish characters and removes special characters.
 */
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

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function AdminCreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isDigital, setIsDigital] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories for the select dropdown
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!name.trim()) {
      toast({
        title: "Hata",
        description: "Ürün adı zorunludur.",
        variant: "destructive",
      });
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast({
        title: "Hata",
        description: "Geçerli bir fiyat girin (0'dan büyük olmalı).",
        variant: "destructive",
      });
      return;
    }

    // Validate compare_price if provided
    let parsedComparePrice: number | null = null;
    if (comparePrice.trim()) {
      parsedComparePrice = parseFloat(comparePrice);
      if (isNaN(parsedComparePrice) || parsedComparePrice < 0) {
        toast({
          title: "Hata",
          description: "Geçerli bir karşılaştırma fiyatı girin.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate stock quantity
    const parsedStockQuantity = parseInt(stockQuantity);
    if (isNaN(parsedStockQuantity) || parsedStockQuantity < 0) {
      toast({
        title: "Hata",
        description: "Geçerli bir stok miktarı girin.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const slug = generateSlug(name);

      // Insert the product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          name: name.trim(),
          slug,
          price: parsedPrice,
          compare_price: parsedComparePrice,
          stock_quantity: parsedStockQuantity,
          category_id: categoryId || null,
          description: description.trim() || null,
          short_description: shortDescription.trim() || null,
          is_active: isActive,
          is_digital: isDigital,
          is_featured: isFeatured,
        })
        .select()
        .single();

      if (productError) throw productError;

      // If image URL provided, insert to product_images table
      if (imageUrl.trim() && product) {
        const { error: imageError } = await supabase
          .from("product_images")
          .insert({
            product_id: product.id,
            image_url: imageUrl.trim(),
            position: 0,
          });

        if (imageError) {
          console.warn("Error adding product image:", imageError);
          // Don't fail the whole operation for image error
        }
      }

      // Invalidate products query to refresh any product lists
      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla oluşturuldu.",
      });

      // Navigate to the product page by slug
      navigate(`/product/${slug}`);
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({
        title: "Hata",
        description: error?.message || "Ürün oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Yeni Ürün Oluştur</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ürün adını girin"
                required
              />
            </div>

            {/* Price and Compare Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (₺) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Karşılaştırma Fiyatı (₺)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stok Miktarı</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="0"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
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

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Kısa Açıklama</Label>
              <Input
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Ürün için kısa açıklama"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ürün açıklaması"
                rows={4}
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Görsel URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Aktif</Label>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isDigital">Dijital Ürün</Label>
                <Switch
                  id="isDigital"
                  checked={isDigital}
                  onCheckedChange={setIsDigital}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Öne Çıkan</Label>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Oluşturuluyor..." : "Ürün Oluştur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
