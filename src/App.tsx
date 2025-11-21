import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import { SearchPage } from "@/pages/SearchPage";
import HomePage from "@/pages/HomePage";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import Dashboard from "@/pages/Dashboard"; // varsa

const basename = (import.meta as any).env?.BASE_URL || "/";

export const App = () => {
  return (
    <Router basename={basename}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
