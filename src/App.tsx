import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import { SearchPage } from "@/pages/SearchPage";
import HomePage from "@/pages/HomePage";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

// import.meta.env.BASE_URL Vite tarafından sağlanır
const rawBase = (import.meta as any).env?.BASE_URL ?? "/";
const basename = rawBase === "/" ? "/" : rawBase.replace(/\/$/, ""); // son slash'i kaldır

export const App = () => {
  console.log("DEBUG BASE_URL =", (import.meta as any).env?.BASE_URL);
  console.log("DEBUG basename =", basename);
  console.log("DEBUG window.location.pathname =", window.location.pathname);

  return (
    <Router basename={basename}>
      {/* Header bileşeniniz searchQuery/setSearchQuery bekliyorsa aşağıdaki props'ı kullanın */}
      <Header searchQuery="" setSearchQuery={() => {}} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
