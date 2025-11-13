import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { SearchPage } from "./pages/SearchPage";

export const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        {/* Diğer sayfalar */}
      </Routes>
    </Router>
  );
};
