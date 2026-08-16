import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Check if the VIP token exists in the browser's local storage
  const token = localStorage.getItem("token");

  // If there is no token, kick them back to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If they have a token, let them through to the child routes (the dashboard)
  return <Outlet />;
}