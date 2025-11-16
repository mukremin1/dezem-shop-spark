import React from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow w-full">
      <div className="text-2xl font-bold">Dezemu</div>

      <div className="flex flex-col md:flex-row items-center gap-4 mt-3 md:mt-0 w-full md:w-auto">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full md:w-64"
        />

        <nav className="flex gap-4">
          <Link to="/" className="hover:text-blue-600">Anasayfa</Link>
          <Link to="/orders" className="hover:text-blue-600">Siparişlerim</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
