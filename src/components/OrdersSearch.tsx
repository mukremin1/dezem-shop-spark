import React, { useEffect, useState } from "react";
// Projede supabase client nerede tanımlıysa onu kullanın:
import { supabase } from "../lib/supabaseClient";

type Order = {
  id: string;
  order_no?: string;
  customer_name?: string;
  status?: string;
  created_at?: string;
  // ihtiyaca göre alan ekleyin
};

export default function OrdersSearch({ userId }: { userId?: string }) {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const debounce = setTimeout(async () => {
      if (!mounted) return;
      if (!userId) {
        setOrders([]);
        return;
      }

      const q = query.trim();
      if (q.length === 0) {
        // isterseniz boş sorguda tüm siparişleri çekebilirsiniz; burası tercihe bağlı
        setOrders([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Supabase sorgusunu kendi tablo/alan isimlerinize göre uyarlayın
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .or(`order_no.ilike.%${q}%,customer_name.ilike.%${q}%`)
          .order("created_at", { ascending: false })
          .limit(200);

        if (error) throw error;
        setOrders(data ?? []);
      } catch (err: any) {
        console.error("Orders fetch error:", err);
        setError(err.message || "Siparişler alınamadı");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(debounce);
    };
  }, [query, userId]);

  return (
    <div className="orders-search">
      <input
        type="search"
        placeholder="Sipariş numarası veya müşteri ara"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input"
      />

      {loading && <div className
