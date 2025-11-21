import React, { useEffect, useMemo, useState } from "react";

type Order = {
  id: string;
  product: string;
  date: string;
  price: number;
};

const ORDERS_KEY = "dezemu_orders_v1";

const readOrders = (): Order[] => {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
};

const writeOrders = (orders: Order[]) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore write errors
  }
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState<string>("");

  // initial load (client-side)
  useEffect(() => {
    setOrders(readOrders());
  }, []);

  // persist whenever orders change
  useEffect(() => {
    writeOrders(orders);
  }, [orders]);

  const removeOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const clearAll = () => {
    setOrders([]);
  };

  // filtered list based on query (searches id, product, date)
  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") return orders;
    return orders.filter(o => {
      return (
        o.id.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.date.toLowerCase().includes(q)
      );
    });
  }, [orders, query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Siparişlerim</h1>

      <div className="mb-4 flex gap-3 items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sipariş numarası, ürün veya tarih ara"
          className="border rounded px-3 py-2 w-full"
          aria-label="Sipariş ara"
        />
        <button
          onClick={() => setQuery("")}
          className="px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          title="Aramayı temizle"
        >
          Temizle
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div>
          {orders.length === 0 ? (
            <p className="text-gray-600">Henüz siparişiniz yok.</p>
          ) : (
            <p className="text-gray-600">Arama kriterinize uygun sonuç bulunamadı.</p>
          )}
        </div>
      ) : (
        <>
          <ul className="space-y-3 mb-4">
            {filteredOrders.map(o => (
              <li key={o.id} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{o.product}</div>
                  <div className="text-sm text-gray-500">{o.date} — ₺{o.price.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">ID: {o.id}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => removeOrder(o.id)}
                    className="text-red-600 hover:underline"
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <button
              onClick={clearAll}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Tümünü Temizle
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
