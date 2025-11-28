import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import ProductForm from "@/components/ProductForm";
import { Link } from "react-router-dom";

type Product = {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  stock?: number | null;
  category?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

export default function AddProductPage() {
  const { user, loading } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!user) return;
    setFetching(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from<Product>("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data ?? []);
    } catch (err: any) {
      console.error("Ürünler alınamadı:", err);
      setError(err.message || "Ürünler alınırken hata oluştu.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const handleCreated = (p: Product) => {
    setProducts((s) => [p, ...s]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ürünü silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", user?.id);
      if (error) throw error;
      setProducts((s) => s.filter((x) => x.id !== id));
    } catch (err: any) {
      console.error("Ürün silme hatası:", err);
      alert(err.message || "Ürün silinemedi.");
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;
  if (!user) return (
    <div className="p-6">
      <p>Ürün eklemek için giriş yapmanız gerekiyor.</p>
      <Link to="/login" className="text-primary underline">Giriş Yap</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ürün Ekle</h1>
      </div>

      <ProductForm userId={user.id} onCreated={handleCreated} />

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-4">Eklediğim Ürünler</h2>

      {fetching ? (
        <div>Ürünler yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-muted-foreground">Henüz ürün eklemediniz.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <li key={p.id} className="p-4 border rounded bg-white">
              <div className="flex gap-4">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-24 h-24 object-cover rounded" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-sm">No Image</div>
                )}
                <div className="flex-1">
                  <div className="font-semibold">{p.title}</div>
                  {p.category && <div className="text-sm text-muted-foreground">{p.category}</div>}
                  {p.description && <div className="text-sm mt-1">{p.description}</div>}
                  <div className="mt-2 flex items-center gap-2">
                    {typeof p.price === "number" && <div className="font-medium">{p.price} ₺</div>}
                    {typeof p.stock === "number" && <div className="text-sm text-muted-foreground">Stok: {p.stock}</div>}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1 border rounded text-red-600 text-sm">Sil</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
