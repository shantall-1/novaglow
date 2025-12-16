import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, Disc, GripVertical, SkipForward, Minus } from "lucide-react";
import { useMusic } from "../context/MusicContext";

const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function FloatingPlayer() {
  const { activeSong, currentPlaylist, isPlayerOpen, playSong, closePlayer } = useMusic();
  const [isMinimized, setIsMinimized] = useState(false);
  const dragControls = useDragControls();

  // Referencias para lógica de clic vs arrastre
  const startPos = useRef({ x: 0, y: 0 });

  const playlistRef = useRef(currentPlaylist);
  const activeSongRef = useRef(activeSong);

  useEffect(() => {
    playlistRef.current = currentPlaylist;
    activeSongRef.current = activeSong;
  }, [currentPlaylist, activeSong]);

  const handleNextSong = () => {
    const playlist = playlistRef.current;
    const song = activeSongRef.current;
    if (!playlist || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.id === song.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    playSong(nextSong, playlist);
  };

  useEffect(() => {
    if (!isPlayerOpen || !activeSong) return;
    let playerInstance = null;
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      setTimeout(() => {
        playerInstance = new window.YT.Player('yt-player-frame', {
          events: {
            'onReady': (event) => event.target.playVideo(),
            'onStateChange': (event) => {
              if (event.data === 0) handleNextSong();
            }
          }
        });
      }, 100);
    }
    return () => { playerInstance = null; };
  }, [activeSong, isPlayerOpen]);

  if (!activeSong || !isPlayerOpen) return null;

  const videoId = getYouTubeID(activeSong.url);

  return (
    <motion.div
        drag
        dragListener={false} 
        dragControls={dragControls}
        dragMomentum={false}
        animate={{ 
            width: isMinimized ? 60 : 320, 
            height: isMinimized ? 60 : "auto",
            borderRadius: isMinimized ? 50 : 24,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        
        // 🔥 CAMBIO CLAVE 1: overflow-visible cuando está minimizado para que se vea el tooltip
        className={`fixed bottom-6 left-6 z-9999 bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl ${isMinimized ? 'overflow-visible' : 'overflow-hidden'}`}
    >
        {/* === IFRAME FANTASMA === */}
        <div className={isMinimized ? "absolute opacity-0 pointer-events-none w-0 h-0" : "w-full h-full absolute inset-0 rounded-2xl overflow-hidden"}>
             {!isMinimized && (
                 <div className="absolute top-14left-4 right-4 h-40 rounded-2xl overflow-hidden z-0 bg-black/50" />
             )}
             <iframe 
                id="yt-player-frame" 
                style={{ 
                    position: 'absolute', 
                    top: isMinimized ? '-9999px' : '3.5rem', 
                    left: isMinimized ? '-9999px' : '1rem',
                    width: isMinimized ? '1px' : 'calc(100% - 2rem)',
                    height: isMinimized ? '1px' : '10rem',
                    borderRadius: '1rem',
                    zIndex: 20
                }}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}&playsinline=1`}
                title="Music Player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            />
        </div>

        {/* === CONTENIDO VISUAL === */}
        <AnimatePresence mode="wait">
            {isMinimized ? (
                /* === VISTA MINIMIZADA === */
                <motion.div
                    key="mini"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // Agregamos 'group' para controlar el hover del hijo
                    className="w-full h-full flex items-center justify-center cursor-pointer group relative"
                    
                    onPointerDown={(e) => {
                        startPos.current = { x: e.clientX, y: e.clientY };
                        dragControls.start(e);
                    }}
                    
                    onPointerUp={(e) => {
                        const diffX = Math.abs(e.clientX - startPos.current.x);
                        const diffY = Math.abs(e.clientY - startPos.current.y);
                        if (diffX < 5 && diffY < 5) setIsMinimized(false);
                    }}
                >
                    <div className="w-10 h-10 bg-linear-to-tr from-rose-500 to-purple-600 rounded-full flex items-center justify-center animate-spin-slow pointer-events-none relative z-10">
                        <Disc size={20} className="text-white" />
                    </div>

                    {/* 🔥 CAMBIO CLAVE 2: TOOLTIP FLOTANTE */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none whitespace-nowrap z-50 flex flex-col items-center">
                        {activeSong.nombre}
                        {/* Triángulo decorativo */}
                        <div className="w-2 h-2 bg-white rotate-45 absolute -bottom-1"></div>
                    </div>

                </motion.div>
            ) : (
                /* === VISTA COMPLETA === */
                <motion.div
                    key="full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 flex flex-col gap-3 w-80 relative z-30 pointer-events-none"
                >
                    {/* Header */}
                    <div 
                        className="flex justify-between items-start cursor-move pointer-events-auto"
                        onPointerDown={(e) => dragControls.start(e)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-linear-to-tr from-rose-500 to-purple-600 rounded-full flex items-center justify-center animate-spin-slow shadow-lg shadow-rose-500/30">
                                    <Disc size={20} className="text-white" />
                                </div>
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Now Playing</span>
                                <span className="text-white font-bold text-sm truncate w-40">{activeSong.nombre}</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => setIsMinimized(true)} 
                                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full cursor-pointer"
                            >
                                <Minus size={14} />
                            </button>
                            <button 
                                onClick={closePlayer} 
                                className="text-gray-400 hover:text-rose-500 transition-colors bg-white/5 p-1.5 rounded-full cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Espaciador */}
                    <div className="aspect-video w-full" />

                    {/* Footer */}
                    <div className="flex justify-between items-center px-2 pointer-events-auto">
                        <div 
                            className="flex items-center gap-2 cursor-move p-1"
                            onPointerDown={(e) => dragControls.start(e)}
                        >
                            <GripVertical size={16} className="text-gray-600" />
                        </div>
                        
                        <button 
                            onClick={handleNextSong} 
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                            Next <SkipForward size={12} fill="currentColor" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
}