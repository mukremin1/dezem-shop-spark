import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import { SearchPage } from "@/pages/SearchPage";
import HomePage from "@/pages/HomePage";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

const rawBase = (import.meta as any).env?.BASE_URL ?? "/";
const basename = rawBase === "/" ? "/" : rawBase.replace(/\/$/, ""); // remove trailing slash except for root

export const App = () => {
  // Debug: runtime değerlerini konsola yazdırıyoruz — build/preview/test sırasında kontrol edin
  console.log("DEBUG BASE_URL (import.meta.env.BASE_URL) =", (import.meta as any).env?.BASE_URL);
  console.log("DEBUG computed basename =", basename);
  console.log("DEBUG window.location.pathname =", window.location.pathname);

  return (
    <Router basename={basename}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback: bilinmeyen path'leri ana sayfaya yönlendir (veya kendi 404 sayfanıza) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
