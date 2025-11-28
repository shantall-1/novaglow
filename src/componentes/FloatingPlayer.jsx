import { motion, AnimatePresence } from "framer-motion";
import { X, Disc, GripVertical } from "lucide-react";
import { useMusic } from "../context/MusicContext";

const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function FloatingPlayer() {
  // ✅ Traemos activeSong Y currentPlaylist
  const { activeSong, currentPlaylist, isPlayerOpen, closePlayer } = useMusic();

  if (!activeSong || !isPlayerOpen) return null;

  const videoId = getYouTubeID(activeSong.url);


const playlistIds = (currentPlaylist && currentPlaylist.length > 0)
    ? currentPlaylist
        .map(song => getYouTubeID(song.url))
        .filter(id => id !== null)
        .join(',')
    : videoId;
  return (
    <AnimatePresence>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 300, top: -500, bottom: 0 }}
        initial={{ opacity: 0, x: -100, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, x: -100 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed bottom-6 left-6 z-[9999] bg-black/90 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl w-80 flex flex-col gap-3"
      >
        {/* Header */}
        <div className="flex justify-between items-start cursor-move">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-tr from-rose-500 to-purple-600 rounded-full flex items-center justify-center animate-spin-slow shadow-lg shadow-rose-500/30">
                        <Disc size={20} className="text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Now Playing</span>
                    <span className="text-white font-bold text-sm truncate w-40">{activeSong.nombre}</span>
                </div>
            </div>
            
            <div className="flex gap-2">
                <div className="cursor-grab active:cursor-grabbing p-1">
                     <GripVertical size={16} className="text-gray-600" />
                </div>
                <button onClick={closePlayer} className="text-gray-400 hover:text-white transition-colors bg-white/10 p-1 rounded-full">
                    <X size={14} />
                </button>
            </div>
        </div>
        
        {/* YouTube Embed */}
        <div className="rounded-2xl overflow-hidden shadow-inner bg-gray-900 aspect-video border border-white/10 relative group">
            <iframe 
                key={videoId} 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}&playsinline=1&playlist=${playlistIds}`}
                title="Music Player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            ></iframe>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}