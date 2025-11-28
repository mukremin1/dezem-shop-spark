import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  userId: string;
  onCreated: (p: any) => void;
};

export default function ProductForm({ userId, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    // bucket: 'product-images' (ensure exists in Supabase Storage)
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabase.storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
    return urlData?.publicUrl ?? null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Ürün başlığı gerekli.");
      return;
    }

    setLoading(true);
    try {
      let image_url: string | null = null;
      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      const payload = {
        user_id: userId,
        title: title.trim(),
        description: description || null,
        price: price ? parseFloat(price) : null,
        stock: stock ? parseInt(stock, 10) : null,
        category: category || null,
        image_url,
      };

      const { data, error } = await supabase.from("products").insert(payload).select().single();
      if (error) throw error;

      onCreated(data);
      // reset
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setImageFile(null);
    } catch (err: any) {
      console.error("Ürün ekleme hatası:", err);
      setError(err.message || "Ürün eklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white mb-6">
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" className="border rounded px-3 py-2" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategori" className="border rounded px-3 py-2" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Açıklama" className="border rounded px-3 py-2 md:col-span-2" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Fiyat (ör. 99.90)" className="border rounded px-3 py-2" />
        <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stok (adet)" className="border rounded px-3 py-2" />
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Resim (opsiyonel)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
        </div>
      </div>

      <div className="mt-3">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded">
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
