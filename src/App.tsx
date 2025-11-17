import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import Index from "@/pages/Index";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import { SearchPage } from "@/pages/SearchPage";
import Auth from "@/pages/Auth";
import OrdersPage from "@/pages/OrdersPage";
import AdminUpload from "@/pages/AdminUpload";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Shipping from "@/pages/Shipping";
import NotFound from "@/pages/NotFound";
import { AdminRoute } from "@/components/AdminRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/dezem-shop-spark">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route
            path="/admin/upload"
            element={
              <AdminRoute>
                <AdminUpload />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
