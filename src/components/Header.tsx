import React from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import { getDezemuLogo } from "@/lib/generateAvatar";
import { Mail, MessageCircle } from "lucide-react";

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery = "", setSearchQuery }) => {
  const logoUrl = getDezemuLogo();
  const supportEmail = import.meta.env.VITE_NEXT_PUBLIC_SUPPORT_EMAIL || "destek@dezemu.com";
  const supportWhatsApp = import.meta.env.VITE_NEXT_PUBLIC_SUPPORT_WHATSAPP || "+905395263293";
  const whatsappLink = `https://wa.me/${supportWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Merhaba Dezemu')}`;

  return (
    <header className="flex flex-col gap-3 p-4 bg-white shadow-md border-b">
      {/* Top bar with logo and contact */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={logoUrl} alt="Dezemu" className="h-10 w-10 rounded-full" />
          <div className="text-2xl font-bold" style={{ color: '#ff6a00' }}>Dezemu</div>
        </Link>

        {/* Contact buttons */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
            title="WhatsApp ile iletişime geç"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <a
            href={`mailto:${supportEmail}`}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            title="E-posta gönder"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">İletişim</span>
          </a>
        </div>
      </div>

      {/* Search and navigation */}
      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-between gap-3">
        {setSearchQuery && (
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

export default Header;
export { Header };
