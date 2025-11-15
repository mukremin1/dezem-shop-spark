import React from "react";
import { Link } from "react-router-dom";
import { SearchInput } from "./SearchInput";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold">Dezemu</h1>

      <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <nav className="flex gap-4">
        <Link to="/">Anasayfa</Link>
        <Link to="/orders">Siparişlerim</Link> {/* Yeni sekme */}
      </nav>
    </header>
  );
};

export default Header;

