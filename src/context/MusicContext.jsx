import React, { createContext, useContext, useState } from "react";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [activeSong, setActiveSong] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]); // ✅ ESTO ES LO QUE FALTA
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Modificamos la función para aceptar la canción Y la lista
  const playSong = (song, playlist = []) => {
    setActiveSong(song);
    // Si nos pasan lista, la guardamos. Si no, creamos una lista de 1 sola canción.
    // Esto asegura que 'currentPlaylist' nunca esté vacío si hay música sonando.
    setCurrentPlaylist(playlist && playlist.length > 0 ? playlist : [song]);
    setIsPlayerOpen(true);
  };

  const closePlayer = () => {
    setIsPlayerOpen(false);
    setActiveSong(null);
    setCurrentPlaylist([]); // Limpiamos la lista al cerrar
  };

  return (
    <MusicContext.Provider value={{ activeSong, currentPlaylist, isPlayerOpen, playSong, closePlayer }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);