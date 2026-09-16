
import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { X, Calendar, Share2, Facebook, Twitter, Link as LinkIcon, Maximize2, CheckCircle } from 'lucide-react';

const NewsDetail: React.FC = () => {
  const { news, selectedNewsId, setSelectedNewsId, language } = useData();
  const [copySuccess, setCopySuccess] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const selectedNews = news.find(item => item.id === selectedNewsId);

  useEffect(() => {
    if (selectedNewsId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedNewsId]);

  if (!selectedNewsId || !selectedNews) return null;

  const shareUrl = `${window.location.origin}${window.location.pathname}#news-${selectedNews.id}`;
  const shareTitle = selectedNews.title[language];

  // Prepare images for grid (Main image + extra images)
  const images = [selectedNews.imageUrl, ...(selectedNews.imageUrls || [])].filter(img => img && img.trim() !== '');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const shareOnFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  const shareOnTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in" onClick={() => setSelectedNewsId(null)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Modal Container */}
      <div 
        className="relative bg-white w-full max-w-7xl h-full max-h-[90vh] md:h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Mobile */}
        <button 
          onClick={() => setSelectedNewsId(null)}
          className="absolute top-4 right-4 z-30 md:hidden bg-black/50 text-white p-2 rounded-full backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Media Grid */}
        <div className="w-full md:w-[55%] h-80 md:h-full bg-gray-50 relative overflow-hidden flex flex-col">
          <div className={`p-4 md:p-8 grid gap-4 h-full ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 grid-rows-2'}`}>
            {images.slice(0, 4).map((img, idx) => (
              <div 
                key={idx} 
                className={`relative rounded-2xl overflow-hidden shadow-lg border-4 border-white cursor-pointer group transition-all duration-500 h-full ${
                  images.length === 3 && idx === 0 ? 'row-span-2' : ''
                }`}
                onClick={() => setActivePhoto(img)}
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all" />
                </div>
              </div>
            ))}
            
            {/* View More Overlay if > 4 images */}
            {images.length > 4 && (
                <button 
                    onClick={() => setActivePhoto(images[4])}
                    className="absolute bottom-12 right-12 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-xs font-bold uppercase tracking-widest text-heritage-dark hover:bg-heritage-gold hover:text-white transition-all z-10"
                >
                    +{images.length - 4} More Photos
                </button>
            )}
          </div>
        </div>

        {/* Right Column: Descriptions & Interactions */}
        <div className="flex-1 flex flex-col h-full bg-white relative">
          
          {/* Header */}
          <div className="p-8 pb-4">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 text-heritage-gold">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {new Date(selectedNews.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'long' })}
                    </span>
                </div>
                <button onClick={() => setSelectedNewsId(null)} className="hidden md:block text-gray-300 hover:text-heritage-dark transition-colors">
                    <X className="w-6 h-6" />
                </button>
             </div>
             <h2 className="font-serif text-3xl md:text-4xl font-bold text-heritage-dark leading-[1.1] mb-2">
                {selectedNews.title[language]}
             </h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
             <div className="p-6 bg-heritage-stone/50 rounded-2xl border border-heritage-gold/10 mb-8 italic text-lg text-heritage-dark leading-relaxed font-serif">
                {selectedNews.summary[language]}
             </div>
             
             <div className="prose prose-lg text-gray-600 leading-[1.8] whitespace-pre-line text-lg pb-10">
                {selectedNews.content[language]}
             </div>
          </div>

          {/* Interaction Bar */}
          <div className="p-8 bg-gray-50 border-t border-gray-100 mt-auto">
             <div className="flex items-center justify-end gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {language === 'en' ? 'Share this article:' : 'Bagikan artikel ini:'}
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={shareOnFacebook} className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-all"><Facebook className="w-4 h-4" /></button>
                    <button onClick={shareOnTwitter} className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-all"><Twitter className="w-4 h-4" /></button>
                    <button 
                        onClick={copyToClipboard} 
                        className={`p-2.5 rounded-full border transition-all ${copySuccess ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400 hover:text-heritage-gold hover:border-heritage-gold'}`}
                    >
                        {copySuccess ? <CheckCircle className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                    </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {activePhoto && (
          <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setActivePhoto(null)}>
              <img src={activePhoto} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scale-in" alt="" />
              <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                  <X className="w-10 h-10" />
              </button>
          </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #C5A059; }
      `}</style>
    </div>
  );
};

export default NewsDetail;
