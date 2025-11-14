import React, { useState } from "react";
import { SearchInput } from "../components/SearchInput";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = (searchQuery || "").trim();
    if (!q) return;
    // Arama sayfasına yönlendir
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="p-4">
      <h1>Home Page</h1>

      {/* Form submit ile çalışacak şekilde düzenlendi; Enter tuşu da tetikler */}
      <form onSubmit={handleSearch} className="flex gap-2 mt-2">
        <SearchInput
          value={searchQuery}
          onChange={(e: any) => {
            // Eğer SearchInput event yerine string dönerse bu satırı güncelleyin:
            // setSearchQuery(e) şeklinde kullanın.
            const val = e?.target?.value ?? e;
            setSearchQuery(val);
          }}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default HomePage;
