import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { MessageCircle, Mail, ShoppingCart } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // ignore error but still try to redirect/refresh
      // console.warn("Logout error", err);
    }
    // navigate to home and reload to ensure client state is cleared
    navigate("/");
    setTimeout(() => window.location.reload(), 120);
  }

  return (
    <header className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-2xl font-bold" style={{ color: "var(--color-primary, #ff6a00)" }}>
          Dezemu
        </Link>
      </div>

      {/* Mobilde tam genişlik, desktop'ta normal */}
      <div className="flex flex-col w-full md:flex-row md:items-center md:w-auto gap-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full md:w-64"
        />

        <nav className="flex gap-4 text-sm md:text-base items-center">
          <Link to="/" className="hover:text-blue-600">
            Anasayfa
          </Link>

          {/* Siparişlerim linki herkes görebilir; istek olursa görünürlüğünü user ile kontrol ederiz */}
          <Link to="/orders" className="hover:text-blue-600">
            Siparişlerim
          </Link>

          {/* WhatsApp / Email ikonları */}
          <a
            href="https://wa.me/905395263293?text=Merhaba%20Dezemu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-600 flex items-center gap-1"
            title="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <a
            href="mailto:destek@dezemu.com"
            className="hover:text-blue-600 flex items-center gap-1"
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </a>

          {/* Auth controls */}
          {loading ? (
            <span className="text-gray-500 ml-2">Yükleniyor...</span>
          ) : user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-blue-600">
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 border rounded text-sm hover:bg-gray-100"
                aria-label="Çıkış yap"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Kayıt Ol
              </Link>
              <Link to="/login" className="ml-2 text-sm hover:text-blue-600">
                Giriş Yap
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Sepet ikonu: mobilde üst sağ köşede absolute, desktop'ta normal flow içinde sağa hizalanmış */}
      <Link
        to="/cart"
        aria-label="Sepetim"
        title="Sepetim"
        className="absolute right-4 top-4 md:static md:ml-4 hover:text-blue-600 flex items-center"
      >
        <ShoppingCart className="h-5 w-5" />
      </Link>
    </header>
  );
};

export default Header;
