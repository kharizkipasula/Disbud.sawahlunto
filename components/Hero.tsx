import React, { useState, useEffect } from 'react';
import { ArrowDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Hero: React.FC = () => {
  const { content, language } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = content.hero.slides || [];

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
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

  if (slides.length === 0) return null;

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-heritage-dark">
      {/* Slides */}
      {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
             <div className="absolute inset-0">
                <img
                src={slide.bgImageUrl}
                alt="Sawahlunto Landscape"
                className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-heritage-dark" />
            </div>

            <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-center text-center pt-20">
                <span className={`text-heritage-gold font-sans text-sm md:text-base tracking-[0.3em] uppercase mb-4 transform transition-all duration-700 delay-100 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    {slide.subtitle[language]}
                </span>
                <h1 className={`font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-6 leading-tight transform transition-all duration-700 delay-200 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    {slide.title[language]}
                </h1>
                <p className={`max-w-2xl text-gray-300 font-sans text-lg md:text-xl leading-relaxed mb-10 transform transition-all duration-700 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    {slide.description[language]}
                </p>
                
                <div className={`flex gap-4 transform transition-all duration-700 delay-500 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <a
                    href="#heritage"
                    onClick={handleCtaClick}
                    className="px-8 py-3 bg-heritage-gold text-white font-sans font-bold uppercase tracking-widest hover:bg-yellow-600 transition-colors cursor-pointer"
                >
                    {slide.cta[language]}
                </a>
                </div>
            </div>
          </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
            <button 
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-heritage-gold w-8' : 'bg-white/30 hover:bg-white'}`}
                    />
                ))}
            </div>
        </>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50 z-20">
        <ArrowDown className="w-8 h-8" />
      </div>
    </section>
  );
};

export default Hero;