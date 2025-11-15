import React, { useState } from "react";
import SearchInput from "../components/SearchInput"; // ÇOK ÖNEMLİ: default import

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
    alert("Aranan kelime: " + searchQuery);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Home Page</h1>

      <div className="flex gap-2">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default HomePage;
