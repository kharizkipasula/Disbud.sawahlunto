import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Kembali ke Atas"
      title="Kembali ke Atas"
      className="fixed bottom-20 right-6 z-40 p-3 rounded-full bg-slate-900/90 text-amber-400 hover:bg-amber-500 hover:text-slate-950 shadow-xl border border-amber-400/30 transition-all duration-300 transform hover:scale-110 active:scale-95 animate-fade-in flex items-center justify-center backdrop-blur-md"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
