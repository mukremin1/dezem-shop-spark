import React, { useState } from "react";
import { Header } from "@components/Header";
import { HomePage } from "@pages/HomePage";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      <HomePage />
    </div>
  );
};

export default App;
