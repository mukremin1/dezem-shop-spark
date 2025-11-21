import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import { SearchPage } from "@/pages/SearchPage";
import HomePage from "@/pages/HomePage";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

// Vite build sırasında BASE_URL, vite.config.ts'deki 'base' ile aynı olacaktır.
// Local geliştirmede genelde "/" olur.
const basename = (import.meta as any).env?.BASE_URL ?? "/";

export const App = () => {
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
      </Routes>
    </Router>
  );
};

export default App;
