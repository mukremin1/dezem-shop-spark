import React from "react";
import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import { generateAvatarDataUrl } from "@/lib/generateAvatar";

// Environment variables with fallbacks (using Vite's import.meta.env)
const SELLER_NAME = import.meta.env.VITE_SELLER_NAME || "Dezemu";
const SELLER_LOGO_URL = import.meta.env.VITE_SELLER_LOGO_URL || "https://ui-avatars.com/api/?name=Dezemu&background=ff6a00&color=fff";
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || "destek@dezemu.com";
const SUPPORT_WHATSAPP = import.meta.env.VITE_SUPPORT_WHATSAPP || "+905395263293";

export const Header: React.FC = () => {
  // Fallback to generated avatar if logo URL fails
  const logoSrc = SELLER_LOGO_URL || generateAvatarDataUrl(SELLER_NAME);

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-white shadow sticky top-0 z-50">
      {/* Logo and Brand */}
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img 
          src={logoSrc} 
          alt={SELLER_NAME}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            // Fallback to generated avatar if image fails to load
            e.currentTarget.src = generateAvatarDataUrl(SELLER_NAME);
          }}
        />
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-primary">{SELLER_NAME}</span>
          <span className="text-xs text-muted-foreground">Online Alışveriş</span>
        </div>
      </Link>

      {/* Contact Information & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Contact Block */}
        <div className="flex items-center gap-3 text-sm">
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/[^0-9]/g, '')}?text=Merhaba%20${SELLER_NAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            aria-label="WhatsApp ile iletişim"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            aria-label="E-posta ile iletişim"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">E-posta</span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex gap-4 text-sm md:text-base">
          <Link to="/" className="hover:text-primary transition-colors">
            Anasayfa
          </Link>
          <Link to="/orders" className="hover:text-primary transition-colors">
            Siparişlerim
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
