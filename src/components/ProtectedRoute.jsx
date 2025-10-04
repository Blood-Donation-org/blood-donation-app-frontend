// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    // Not logged in, redirect to sign-in page
    return <Navigate to="/" replace />;
  }

  // Logged in, allow access
  return children;
};

export default ProtectedRoute;





