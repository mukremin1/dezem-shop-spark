import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Label,
  Input,
  Textarea,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components/ui"; // Gerekirse projedeki gerçek import yoluna göre düzeltin

function makeSlug(name: string) {
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

export default function AdminCreateProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isDigital, setIsDigital] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("categories").select("id, name").order("name");
      if (data) setCategories(data);
    })();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    if (!name || !price) {
      toast({ title: "Hata", description: "sim ve fiyat gerekli.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    try {
      const slug = makeSlug(name);
      const insertPayload: any = {
        name,
        slug,
        price: parseFloat(price),
        compare_price: comparePrice ? parseFloat(comparePrice) : null,
        stock_quantity: parseInt(stock || "0"),
        category_id: categoryId || null,
        description: description || null,
        short_description: shortDescription || null,
        is_active: isActive,
        is_digital: isDigital,
        is_featured: isFeatured,
      };

      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert(insertPayload)
        .select("id")
        .single();

      if (productError) throw productError;

      const productId = productData.id;

      if (imageUrl) {
        const { error: imgError } = await supabase.from("product_images").insert({
          product_id: productId,
          image_url: imageUrl,
          position: 0,
        });
        if (imgError) throw imgError;
      }

      toast({ title: "Başarılı", description: "Ürün eklendi." });
      qc.invalidateQueries({ queryKey: ["products"] });
      navigate(`/product/${slug}`);
    } catch (err: any) {
      console.error("Ürün ekleme hatası:", err);
      toast({ title: "Hata", description: err.message || "Ürün eklenirken bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">Yeni Ürün Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Ürün Adı *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="short-desc">Kısa Açıklama</Label>
              <Input id="short-desc" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="desc">Açıklama</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Fiyat *</Label>
                <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="compare">Karşılaştırma Fiyatı</Label>
                <Input id="compare" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} placeholder="0.00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Stok</Label>
                <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select value={categoryId ?? ""} onValueChange={(v) => setCategoryId(v || null)}>
                  <SelectTrigger id="category"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="image">Resim URL</Label>
              <Input id="image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className="flex gap-4 items-center">
              <div>
                <Label>Ürün Aktif</Label>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <div>
                <Label>Dijital</Label>
                <Switch checked={isDigital} onCheckedChange={setIsDigital} />
              </div>
              <div>
                <Label>Öne Çıkar</Label>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Ekleniyor..." : "Ürün Ekle"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
