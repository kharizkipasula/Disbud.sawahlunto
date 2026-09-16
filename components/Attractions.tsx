import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Compass, 
  Building2
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Attraction } from '../types';
import { formatGoogleDriveUrl } from '../src/utils/imageHelper';

// Fallback curated image galleries for famous Sawahlunto museums if not yet populated
const MUSEUM_FALLBACK_GALLERIES: Record<string, string[]> = {
  'goedang-ransoem': [
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1590059390046-562a1296b1d4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
  ],
  'mbah-soero': [
    'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800',
  ],
  'museum-kereta-api': [
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
  ],
  'kereta-api': [
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
  ],
  'galeri-kebudayaan': [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=800',
  ],
};

const getGalleryImages = (item: Attraction): string[] => {
  let list: string[] = [];
  if (item.images && item.images.length > 0) {
    list = item.images.filter(Boolean);
  } else if (item.imageUrl) {
    list = [item.imageUrl];
  } else if (item.id && MUSEUM_FALLBACK_GALLERIES[item.id]) {
    list = MUSEUM_FALLBACK_GALLERIES[item.id];
  }

  // Format through Google Drive URL converter & filter valid strings
  const formatted = list.map(u => formatGoogleDriveUrl(u).trim()).filter(Boolean);
  if (formatted.length > 0) {
    return formatted;
  }

  if (item.id && MUSEUM_FALLBACK_GALLERIES[item.id]) {
    return MUSEUM_FALLBACK_GALLERIES[item.id];
  }
  return ['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800'];
};

interface MuseumCardProps {
  attraction: Attraction;
  language: 'id' | 'en';
  onSelect: (attraction: Attraction) => void;
}

const MuseumCard: React.FC<MuseumCardProps> = ({ attraction, language, onSelect }) => {
  const images = getGalleryImages(attraction);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play slideshow timer
  useEffect(() => {
    if (isHovered || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const titleText = attraction.title[language] || attraction.title.id;
  const descText = attraction.description[language] || attraction.description.id;
  const locText = attraction.location ? (attraction.location[language] || attraction.location.id) : 'Kota Sawahlunto';

  return (
    <div
      onClick={() => onSelect(attraction)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400/60 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
    >
      {/* Interactive Changing Image Slideshow Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 select-none">
        {/* Render Carousel Images */}
        {images.map((imgUrl, idx) => (
          <img
            key={`${imgUrl}-${idx}`}
            src={imgUrl}
            alt={`${titleText} foto ${idx + 1}`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800';
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out transform ${
              idx === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105 pointer-events-none'
            } group-hover:scale-105`}
            loading="lazy"
          />
        ))}

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

        {/* Top Badges: Category & Photo Counter */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-400/30 shadow-xs">
            {attraction.category || 'History'}
          </span>

          {images.length > 1 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-xs">
              <ImageIcon className="w-3 h-3 text-amber-400" />
              <span>{currentIndex + 1} / {images.length}</span>
            </div>
          )}
        </div>

        {/* Manual Prev / Next Navigation Arrows (Visible on card hover or touch) */}
        {images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between z-10 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handlePrev}
              type="button"
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-transform active:scale-90 hover:scale-105 shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-transform active:scale-90 hover:scale-105 shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Pagination Dots & Dynamic Indicator Bar */}
        {images.length > 1 && (
          <div className="absolute bottom-3.5 inset-x-4 flex items-center justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleDotClick(e, idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-amber-400 shadow-xs'
                    : 'w-1.5 bg-white/50 hover:bg-white/90'
                }`}
                aria-label={`Jump to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modern Card Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Location & Operating Hours Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <div className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate max-w-[190px]">{locText}</span>
            </div>
            {attraction.operatingHours && (
              <>
                <span className="text-slate-300">•</span>
                <div className="inline-flex items-center gap-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{attraction.operatingHours[language] || attraction.operatingHours.id}</span>
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-900 transition-colors line-clamp-1">
            {titleText}
          </h3>

          {/* Short Description */}
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
            {descText}
          </p>

          {/* Key Highlights Chips (if available) */}
          {attraction.highlights && attraction.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {attraction.highlights.slice(0, 2).map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-200/60"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  <span className="truncate max-w-[200px]">{h[language] || h.id}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-400 group-hover:text-amber-700 transition-colors">
            {language === 'en' ? 'Click for detail & gallery' : 'Klik untuk galeri & detail'}
          </span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-amber-500 group-hover:text-white text-slate-700 text-xs font-bold tracking-wider uppercase transition-all duration-200 group-hover:translate-x-0.5">
            <span>{language === 'en' ? 'Explore' : 'Detail'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Attractions: React.FC = () => {
  const { attractions, language, content } = useData();
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [modalActiveImageIdx, setModalActiveImageIdx] = useState(0);

  // Categories list
  const categories = ['All', 'History', 'Culture', 'Nature'];

  // Filtered attractions
  const filteredAttractions = activeCategory === 'All'
    ? attractions
    : attractions.filter(a => (a.category || 'History').toLowerCase() === activeCategory.toLowerCase());

  const handleOpenModal = (att: Attraction) => {
    setSelectedAttraction(att);
    setModalActiveImageIdx(0);
  };

  const handleCloseModal = () => {
    setSelectedAttraction(null);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    if (selectedAttraction) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedAttraction]);

  return (
    <section id="destinations" className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-amber-50/20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200/80 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/60 text-xs font-bold tracking-wider uppercase mb-3.5">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'en' ? 'Heritage & Culture Destinations' : 'Destinasi Sejarah & Budaya'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              {language === 'en' ? 'Sawahlunto City Museums' : 'Museum Kota Sawahlunto'}
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              {language === 'en' 
                ? 'Discover the rich industrial mining legacy and multicultural heritage across our historic world heritage museums.'
                : 'Jelajahi mahakarya cagar budaya tambang batubara Ombilin, dapur umum legendaris, terowongan bersejarah, dan lokomotif uap kuno.'}
            </p>
          </div>

          {/* Category Filter Pills (Swipeable on Mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap self-start md:self-end scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-amber-400 shadow-sm scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat === 'All' 
                  ? (language === 'en' ? 'All' : 'Semua')
                  : cat === 'History' 
                    ? (language === 'en' ? 'History' : 'Sejarah')
                    : cat === 'Culture'
                      ? (language === 'en' ? 'Culture' : 'Budaya')
                      : (language === 'en' ? 'Nature' : 'Alam')}
              </button>
            ))}
          </div>
        </div>

        {/* Modern Interactive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredAttractions.map((spot) => (
            <MuseumCard
              key={spot.id}
              attraction={spot}
              language={language}
              onSelect={handleOpenModal}
            />
          ))}
        </div>

        {/* Empty state if filter has no match */}
        {filteredAttractions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {language === 'en' ? 'No museums found in this category.' : 'Belum ada museum dalam kategori ini.'}
            </p>
          </div>
        )}
      </div>

      {/* Museum Detail & Gallery Lightbox Modal */}
      {selectedAttraction && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    {selectedAttraction.category || 'History'}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                    {selectedAttraction.title[language] || selectedAttraction.title.id}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Main Gallery Viewer */}
              {(() => {
                const modalGallery = getGalleryImages(selectedAttraction);
                const currentModalImg = modalGallery[modalActiveImageIdx] || modalGallery[0];

                return (
                  <div className="space-y-3">
                    <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
                      <img 
                        src={currentModalImg} 
                        alt="Preview" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800';
                        }}
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Modal Prev / Next Buttons */}
                      {modalGallery.length > 1 && (
                        <>
                          <button
                            onClick={() => setModalActiveImageIdx(prev => (prev - 1 + modalGallery.length) % modalGallery.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-lg transition-transform active:scale-90"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setModalActiveImageIdx(prev => (prev + 1) % modalGallery.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-lg transition-transform active:scale-90"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/20">
                        {modalActiveImageIdx + 1} / {modalGallery.length}
                      </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {modalGallery.length > 1 && (
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
                        {modalGallery.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setModalActiveImageIdx(i)}
                            className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                              i === modalActiveImageIdx
                                ? 'border-amber-500 scale-105 shadow-md'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img 
                              src={img} 
                              alt={`Thumb ${i + 1}`} 
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800';
                              }}
                              className="w-full h-full object-cover" 
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Description & Details */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-lg text-slate-900">
                  {language === 'en' ? 'About Destination' : 'Tentang Museum & Destinasi'}
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {selectedAttraction.description[language] || selectedAttraction.description.id}
                </p>

                {/* Highlights */}
                {selectedAttraction.highlights && selectedAttraction.highlights.length > 0 && (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <h5 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{language === 'en' ? 'Key Highlights & Artifacts' : 'Daya Tarik & Koleksi Utama'}</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                      {selectedAttraction.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h[language] || h.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedAttraction.title.id || selectedAttraction.title.en) + ' Sawahlunto')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <MapPin className="w-4 h-4 text-slate-600" />
                  <span>{language === 'en' ? 'View on Google Maps' : 'Lihat Lokasi di Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400" />
                </a>

                {/* WhatsApp Inquiries */}
                {(() => {
                  const phone = content.contact.phone || '081234567890';
                  let cleanPhone = phone.replace(/\D/g, '');
                  if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
                  else if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

                  const museumTitle = selectedAttraction.title[language] || selectedAttraction.title.id;
                  const waText = encodeURIComponent(
                    language === 'en'
                      ? `Hello, I would like to inquire about visiting ${museumTitle} in Sawahlunto.`
                      : `Halo Dinas Kebudayaan Sawahlunto, saya ingin menanyakan informasi kunjungan ke ${museumTitle}.`
                  );
                  return (
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-98"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15-.201.3-.778.98-.954 1.18-.175.2-.351.225-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.086-.176-.3-.019-.462.132-.612.136-.135.301-.35.452-.525.15-.175.2-.3.301-.5.101-.2.05-.375-.025-.525-.075-.15-.678-1.636-.93-2.242-.244-.59-.493-.51-.678-.52-.176-.009-.377-.01-.578-.01-.201 0-.527.075-.803.375-.276.3-1.054 1.03-1.054 2.511 0 1.482 1.079 2.912 1.23 3.112.15.2 2.123 3.243 5.143 4.547.719.311 1.281.497 1.719.636.722.23 1.378.197 1.898.12.579-.087 1.782-.728 2.033-1.432.251-.704.251-1.308.176-1.432-.075-.125-.276-.2-.577-.35zM12.042 2C6.527 2 2.05 6.477 2.05 11.992c0 1.954.563 3.778 1.541 5.318L2 22l4.832-1.55c1.488.898 3.228 1.417 5.09 1.417 5.515 0 9.992-4.477 9.992-9.992S17.557 2 12.042 2zm0 18.283c-1.684 0-3.253-.51-4.562-1.385l-.328-.219-3.385 1.085 1.106-3.3-.239-.344c-.958-1.38-1.472-3.033-1.472-4.747 0-4.57 3.718-8.288 8.288-8.288 4.57 0 8.288 3.718 8.288 8.288 0 4.57-3.718 8.288-8.288 8.288z" />
                      </svg>
                      <span>{language === 'en' ? 'Inquire via WA' : 'Tanya via WhatsApp'}</span>
                    </a>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Attractions;
