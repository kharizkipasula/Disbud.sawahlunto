import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Hero: React.FC = () => {
  const { content, language } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const slides = content.hero.slides || [];

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('heritage');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (slides.length === 0) return null;

  return (
    <section 
      id="hero" 
      className="relative min-h-[92vh] sm:min-h-screen w-full overflow-hidden bg-heritage-dark select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.bgImageUrl}
              alt="Sawahlunto Heritage"
              className="w-full h-full object-cover scale-105 transition-transform duration-[7000ms] ease-out"
            />
            {/* Multi-layer gradient for optimal contrast on both mobile & desktop */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-slate-950/95" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/70" />
          </div>

          <div className="relative h-full container mx-auto px-4 sm:px-6 flex flex-col justify-center items-center text-center pt-24 sm:pt-20 pb-28 sm:pb-24">
            <span className={`text-amber-400 font-sans text-xs sm:text-sm md:text-base font-semibold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2.5 sm:mb-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-amber-400/30 transform transition-all duration-700 delay-100 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {slide.subtitle[language]}
            </span>
            <h1 className={`font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold mb-3 sm:mb-6 leading-[1.15] max-w-5xl drop-shadow-lg transform transition-all duration-700 delay-200 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {slide.title[language]}
            </h1>
            <p className={`max-w-2xl text-slate-200 font-sans text-xs sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-9 line-clamp-3 sm:line-clamp-none px-2 drop-shadow transform transition-all duration-700 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {slide.description[language]}
            </p>
            
            <div className={`flex items-center gap-3.5 transform transition-all duration-700 delay-500 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <a
                href="#heritage"
                onClick={handleCtaClick}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>{slide.cta[language]}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows (Desktop & Tablet) */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white bg-black/30 hover:bg-black/60 backdrop-blur-sm p-2.5 sm:p-3 rounded-full border border-white/20 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white bg-black/30 hover:bg-black/60 backdrop-blur-sm p-2.5 sm:p-3 rounded-full border border-white/20 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator (Swipe-friendly) */}
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-amber-400 w-7' : 'bg-white/40 hover:bg-white w-2'}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll Down Indicator */}
      <a 
        href="#heritage"
        onClick={handleCtaClick}
        aria-label="Scroll to content"
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/50 hover:text-amber-400 transition-colors z-20 flex flex-col items-center gap-1 group"
      >
        <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
      </a>
    </section>
  );
};

export default Hero;