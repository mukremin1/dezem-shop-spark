import React from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import { MessageCircle, Mail } from "lucide-react";
import generateAvatarDataUrl from "@/lib/generateAvatar";

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const logoUrl = import.meta.env.VITE_DEFAULT_SELLER_LOGO_URL || 
    "https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff";
  
  return (
    <header className="flex flex-col gap-3 p-4 bg-white shadow border-b border-border">
      {/* Top bar with logo and contact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={logoUrl} 
            alt="Dezemu" 
            className="w-10 h-10 rounded-lg"
            onError={(e) => {
              e.currentTarget.src = generateAvatarDataUrl('Dezemu');
            }}
          />
          <div className="text-2xl font-bold text-primary">Dezemu</div>
        </div>
        
        {/* Contact info */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <a 
            href="https://wa.me/905395263293?text=Merhaba%20Dezemu" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
          <a 
            href="mailto:destek@dezemu.com"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>destek@dezemu.com</span>
          </a>
        </div>
      </div>

      {/* Search and navigation */}
      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-between gap-3">
        {searchQuery !== undefined && setSearchQuery && (
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full md:w-64"
          />
        )}

        <nav className="flex gap-4 text-sm md:text-base">
          <Link to="/" className="hover:text-primary transition-colors">Anasayfa</Link>
          <Link to="/orders" className="hover:text-primary transition-colors">Siparişlerim</Link>
        </nav>
      </div>
    </header>
  );
};

export { Header };
export default Header;
