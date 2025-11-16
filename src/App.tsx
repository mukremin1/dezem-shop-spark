import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@pages/HomePage";
import Header from "@components/Header";
import OrdersPage from "@pages/OrdersPage";

type Order = {
  id: string;
  product: string;
  date: string;
  price: number;
};

const ORDERS_KEY = "dezemu_orders_v1";

const readOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
};

const writeOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // onPlaceOrder: HomePage'den çağrılır
  const onPlaceOrder = (product: string) => {
    const orders = readOrders();
    const newOrder: Order = {
      id: Date.now().toString(),
      product,
      date: new Date().toLocaleString(),
      price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
    };
    const next = [newOrder, ...orders];
    writeOrders(next);
    console.log("Order placed:", newOrder);
  };

  return (
    <Router>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path="/" element={<HomePage searchQuery={searchQuery} onPlaceOrder={onPlaceOrder} />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
