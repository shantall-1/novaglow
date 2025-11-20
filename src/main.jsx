import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Contextos
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { ComentariosProvider } from "./context/ComentariosContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/novaglow">   {/* 👈 ESTA LINEA ES LA CLAVE */}
      <AuthProvider>
        <CarritoProvider>
          <FavoriteProvider>
            <ComentariosProvider>
              <App />
            </ComentariosProvider>
          </FavoriteProvider>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
