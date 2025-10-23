import React, { useEffect, useState } from "react";
import { CheckCircle, LogOut, LockKeyhole, Heart } from "lucide-react";

const icons = {
  success: <CheckCircle className="w-10 h-10 text-green-500" />,
  logout: <LogOut className="w-10 h-10 text-rose-500" />,
  login: <LockKeyhole className="w-10 h-10 text-pink-500" />,
  love: <Heart className="w-10 h-10 text-pink-400 animate-pulse" />,
};

const AnimatedModal = ({
  show,
  message,
  subtext,
  type = "login", // "success", "logout", "login", "love"
  duration = 1000,
  onClose,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show) return;

    setProgress(0);
    const interval = 30;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onClose?.(), 300);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-linear-to-br from-pink-50 via-white to-pink-100 shadow-2xl rounded-3xl p-6 text-center w-80 border border-pink-200 animate-bounceIn">
        <div className="flex justify-center mb-3">{icons[type]}</div>

        <p className="text-pink-600 font-extrabold text-lg mb-2">{message}</p>

        {subtext && <p className="text-gray-600 text-sm mb-5">{subtext}</p>}

        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-pink-400 transition-all duration-100 linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedModal;
