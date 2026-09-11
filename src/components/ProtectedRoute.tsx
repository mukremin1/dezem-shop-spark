import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useUser();
  if (loading) return <div>Yükleniyor...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
