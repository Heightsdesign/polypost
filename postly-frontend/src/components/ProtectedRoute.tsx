import { Navigate } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("postly_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
