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
import { MusicProvider } from "./context/MusicContext"; // <--- IMPORTAR ESTO

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <MusicProvider> {/* <--- AGREGAR AQUÍ */}
          <CarritoProvider>
            <FavoriteProvider>
              <ComentariosProvider>
                <App />
              </ComentariosProvider>
            </FavoriteProvider>
          </CarritoProvider>
        </MusicProvider> {/* <--- CIERRE */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);