import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Contextos
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import { FavoriteProvider } from "./context/FavoriteContext";  // 🔥 FALTABA ESTA IMPORTACIÓN
import { ComentariosProvider } from "./context/ComentariosContext"; // 🔥 TAMBIÉN FALTABA ESTA

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/novaglow">
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
