import React from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import { singleVendorConfig } from "@/lib/singleVendor";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-3">
        {singleVendorConfig.sellerLogoUrl && (
          <img 
            src={singleVendorConfig.sellerLogoUrl} 
            alt={singleVendorConfig.sellerName}
            className="h-8 w-8 object-contain"
          />
        )}
        <div className="text-2xl font-bold">{singleVendorConfig.sellerName}</div>
      </div>

      {/* Mobilde tam genişlik, desktop'ta normal */}
      <div className="flex flex-col w-full md:flex-row md:items-center md:w-auto gap-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full md:w-64"
        />

        <nav className="flex gap-4 text-sm md:text-base">
          <Link to="/" className="hover:text-blue-600">Anasayfa</Link>
          <Link to="/orders" className="hover:text-blue-600">Siparişlerim</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
