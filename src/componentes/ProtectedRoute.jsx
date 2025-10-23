import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute: protege solo acciones que requieren sesión
 */
const ProtectedRoute = ({ children }) => {
  const session = localStorage.getItem("novaglow_session");
  const location = useLocation();

  if (!session) {
    // Si no hay sesión, guardar la ruta actual para volver después
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;