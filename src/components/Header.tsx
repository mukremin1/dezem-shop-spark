import React from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import { Mail, MessageCircle } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const logoUrl = import.meta.env.VITE_DEFAULT_SELLER_LOGO_URL || 
    "https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff&size=100&bold=true";
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || "destek@dezemu.com";
  const supportWhatsapp = import.meta.env.VITE_SUPPORT_WHATSAPP || "+905395263293";
  
  return (
    <header className="flex flex-col gap-3 p-4 bg-white shadow-md border-b-2 border-primary">
      {/* Top bar with logo and contact */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <img 
            src={logoUrl} 
            alt="Dezemu Logo" 
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              // Fallback to generated avatar if image fails to load
              e.currentTarget.src = "https://ui-avatars.com/api/?name=D&background=ff6a00&color=fff&size=100&bold=true";
            }}
          />
          <div>
            <h1 className="text-2xl font-bold text-primary">Dezemu</h1>
            <p className="text-xs text-muted-foreground">Kaliteli Alışverişin Adresi</p>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="flex items-center gap-4 text-sm">
          <a 
            href={`mailto:${supportEmail}`}
            className="flex items-center gap-1 hover:text-primary transition-colors"
            title="E-posta ile iletişim"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden md:inline">{supportEmail}</span>
          </a>
          <a 
            href={`https://wa.me/${supportWhatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
            title="WhatsApp ile iletişim"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden md:inline">{supportWhatsapp}</span>
          </a>
        </div>
      </div>

      {/* Search and Navigation */}
      <div className="flex flex-col w-full md:flex-row md:items-center md:w-auto gap-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full md:w-64"
        />

        <nav className="flex gap-4 text-sm md:text-base">
          <Link to="/" className="hover:text-primary transition-colors font-medium">Anasayfa</Link>
          <Link to="/orders" className="hover:text-primary transition-colors font-medium">Siparişlerim</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
