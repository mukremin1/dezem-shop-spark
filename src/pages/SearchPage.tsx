import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const SearchPage = () => {
  const location = useLocation();
  const [results, setResults] = useState<string[]>([]);
  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (query) {
      // Örnek ürün sorgulama, burayı API ile değiştir
      setResults([`Arama sonucu: ${query}`, "Ürün 1", "Ürün 2"]);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Arama Sonuçları</h2>
      {results.length ? (
        <ul>
          {results.map((item, index) => (
            <li key={index} className="p-2 border-b">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p>Sonuç bulunamadı.</p>
      )}
    </div>
  );
};
