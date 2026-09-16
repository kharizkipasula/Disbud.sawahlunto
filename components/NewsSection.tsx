
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight, Clock } from 'lucide-react';

const NewsSection: React.FC = () => {
  const { news, language, setSelectedNewsId } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, news.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (news.length === 0) return null;

  return (
    <section id="news" className="py-24 bg-white scroll-mt-28 relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-[2px] bg-heritage-gold"></div>
                    <span className="text-heritage-gold uppercase tracking-[0.3em] font-sans text-xs font-bold">
                        {language === 'en' ? 'News & Announcements' : 'Berita & Pengumuman'}
                    </span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-heritage-dark leading-tight">
                    {language === 'en' ? 'Latest from Sawahlunto' : 'Terbaru dari Sawahlunto'}
                </h2>
                <p className="text-gray-500 mt-4 text-sm md:text-base max-w-xl">
                    {language === 'en' 
                      ? 'Stay updated with the latest events, cultural highlights, and official updates from our heritage city.' 
                      : 'Ikuti perkembangan acara terbaru, sorotan budaya, dan pembaruan resmi dari kota warisan kami.'}
                </p>
            </div>

            {/* Navigation Buttons (Desktop) */}
            <div className="hidden md:flex gap-3">
                <button 
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className={`p-4 rounded-full border-2 transition-all ${
                        currentIndex === 0 
                        ? 'border-gray-100 text-gray-200 cursor-not-allowed' 
                        : 'border-heritage-dark text-heritage-dark hover:bg-heritage-dark hover:text-white'
                    }`}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={nextSlide}
                    disabled={currentIndex >= maxIndex}
                    className={`p-4 rounded-full border-2 transition-all ${
                        currentIndex >= maxIndex 
                        ? 'border-gray-100 text-gray-200 cursor-not-allowed' 
                        : 'border-heritage-dark text-heritage-dark hover:bg-heritage-dark hover:text-white'
                    }`}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>

        {/* Slider Container */}
        <div className="relative group">
            <div className="overflow-hidden">
                <div 
                    ref={containerRef}
                    className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ 
                        transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
                    }}
                >
                    {news.map((item) => (
                        <div 
                            key={item.id} 
                            className="px-3 shrink-0"
                            style={{ width: `${100 / itemsPerPage}%` }}
                        >
                            <div 
                                onClick={() => setSelectedNewsId(item.id)}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 group/card hover:shadow-2xl transition-all duration-500 h-full flex flex-col cursor-pointer"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden bg-gray-100">
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.title[language]} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-heritage-gold" />
                                            <span className="text-[10px] font-bold text-heritage-dark uppercase tracking-widest">
                                                {new Date(item.date).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', { 
                                                    month: 'short', day: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4 text-heritage-gold">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-[10px] uppercase font-black tracking-widest">
                                            {language === 'en' ? 'Featured Story' : 'Berita Utama'}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-serif text-xl font-bold text-heritage-dark mb-4 group-hover/card:text-heritage-gold transition-colors line-clamp-2 leading-tight">
                                        {item.title[language]}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                        {item.summary[language]}
                                    </p>
                                    
                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-heritage-dark hover:text-heritage-gold flex items-center gap-2 group/btn">
                                            {language === 'en' ? 'Read Full Article' : 'Baca Selengkapnya'}
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Navigation Arrows */}
            <div className="flex md:hidden justify-center gap-4 mt-8">
                <button 
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className="p-3 rounded-full border border-gray-200 bg-white"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={nextSlide}
                    disabled={currentIndex >= maxIndex}
                    className="p-3 rounded-full border border-gray-200 bg-white"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Progress Dots */}
        <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 rounded-full h-1.5 ${
                        currentIndex === idx ? 'w-8 bg-heritage-gold' : 'w-2 bg-gray-200'
                    }`}
                />
            ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
