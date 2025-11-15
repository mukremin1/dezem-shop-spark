import React, { useState } from "react";
import { SearchInput } from "./SearchInput";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md">
      <div className="text-2xl font-bold">Dezemu</div>
      <div className="flex items-center gap-4 mt-2 md:mt-0">
        <SearchInput value={searchQuery} onChange={handleSearch} />
        <nav className="flex gap-4">
          <a href="#home" className="hover:text-blue-500">Ana Sayfa</a>
          <a href="#orders" className="hover:text-blue-500">Siparişlerim</a>
        </nav>
      </div>
    </header>
  );
};
