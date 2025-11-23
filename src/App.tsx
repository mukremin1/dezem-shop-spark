import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SearchPage } from "@/pages/SearchPage";
import HomePage from "@/pages/HomePage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

const rawBase = (import.meta as any).env?.BASE_URL ?? "/";
const basename = rawBase === "/" ? "/" : rawBase.replace(/\/$/, "");

export const App = () => {
  return (
    <Router basename={basename}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
      <Footer />
    </Router>
  );
};

export default App;
