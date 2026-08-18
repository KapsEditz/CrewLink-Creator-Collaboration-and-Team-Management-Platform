import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // 1. Kick out unauthenticated users
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Enforce Role-Based Access Control (RBAC)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    toast.error("You do not have permission to view this page.");
    return <Navigate to="/dashboard" replace />; // Send them back to their safe home
  }

  return <Outlet />;
}