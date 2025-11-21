import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import { SearchPage } from "@/pages/SearchPage";
import HomePage from "@/pages/HomePage";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export const App = () => {
  return (
    <Router>
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
