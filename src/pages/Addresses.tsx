import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import AddressForm from "@/components/AddressForm";
import { Link } from "react-router-dom";

type Address = {
  id: string;
  user_id: string;
  is_corporate?: boolean;
  label?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  tax_office?: string | null;
  tax_number?: string | null;
  created_at?: string;
};

export default function AddressesPage() {
  const { user, loading } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = async () => {
    if (!user) return;
    setFetching(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from<Address>("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses(data ?? []);
    } catch (err: any) {
      console.error("Adres getirilemedi:", err);
      setError(err.message || "Adresler alınırken hata oluştu.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const handleCreated = (addr: Address) => {
    setAddresses((s) => [addr, ...s]);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Adresi silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", user?.id);
      if (error) throw error;
      setAddresses((s) => s.filter((a) => a.id !== id));
    } catch (err: any) {
      console.error("Adres silme hatası:", err);
      alert(err.message || "Adres silinemedi.");
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;
  if (!user) return (
    <div className="p-6">
      <p>Adrese erişmek için giriş yapmanız gerekiyor.</p>
      <Link to="/login" className="text-primary underline">Giriş Yap</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Adreslerim</h1>
        <div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-50"
          >
            {showForm ? "İptal" : "Adres Ekle"}
          </button>
        </div>
      </div>

      {showForm && <AddressForm userId={user.id} onCreated={handleCreated} />}

      {fetching ? (
        <div>Adresler yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : addresses.length === 0 ? (
        <div className="text-muted-foreground">Henüz adres eklemediniz.</div>
      ) : (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li key={a.id} className="p-4 border rounded bg-white flex justify-between items-start">
              <div>
                <div className="font-semibold">{a.label ?? (a.is_corporate ? "Kurumsal Adres" : "Adres")}</div>
                {a.street && <div>{a.street}</div>}
                <div className="text-sm text-muted-foreground">
                  {a.city ? `${a.city}` : ""} {a.postal_code ? ` • ${a.postal_code}` : ""} {a.country ? ` • ${a.country}` : ""}
                </div>
                {a.phone && <div className="text-sm">Tel: {a.phone}</div>}
                {a.is_corporate && (a.tax_office || a.tax_number) && (
                  <div className="text-sm mt-2">
                    {a.tax_office && <div>Vergi Dairesi: {a.tax_office}</div>}
                    {a.tax_number && <div>Vergi No: {a.tax_number}</div>}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-gray-400">{new Date(a.created_at ?? "").toLocaleString()}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(a.id)} className="text-sm px-3 py-1 border rounded text-red-600">Sil</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
