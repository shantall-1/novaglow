import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const session = localStorage.getItem("novaglow_session");
  const location = useLocation();

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: "💅 Inicia sesión para continuar con tu compra",
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
