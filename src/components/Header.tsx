import React from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import { MessageCircle, Mail } from "lucide-react";
import { generateAvatarDataUrl } from "@/lib/generateAvatar";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const sellerName = import.meta.env.VITE_DEFAULT_SELLER_NAME || "Dezemu";
  const sellerLogo = import.meta.env.VITE_DEFAULT_SELLER_LOGO_URL || generateAvatarDataUrl(sellerName);
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || "destek@dezemu.com";
  const supportWhatsApp = import.meta.env.VITE_SUPPORT_WHATSAPP || "+905395263293";

  return (
    <header className="flex flex-col gap-3 p-4 bg-white shadow">
      {/* Top Bar with Logo and Contact */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <img 
            src={sellerLogo} 
            alt={sellerName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/90">
            {sellerName}
          </Link>
        </div>

        {/* Contact Info */}
        <div className="flex gap-4 text-sm">
          <a 
            href={`https://wa.me/${supportWhatsApp.replace(/[^0-9]/g, '')}?text=Merhaba%20Dezemu`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
            title="WhatsApp ile iletişim"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{supportWhatsApp}</span>
          </a>
          <a 
            href={`mailto:${supportEmail}`}
            className="flex items-center gap-1 hover:text-primary transition-colors"
            title="E-posta gönder"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">{supportEmail}</span>
          </a>
        </div>
      </div>

      {/* Search and Navigation */}
      <div className="flex flex-col w-full md:flex-row md:items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full md:w-64"
        />

        <nav className="flex gap-4 text-sm md:text-base">
          <Link to="/" className="hover:text-primary transition-colors">Anasayfa</Link>
          <Link to="/orders" className="hover:text-primary transition-colors">Siparişlerim</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
export { Header };
