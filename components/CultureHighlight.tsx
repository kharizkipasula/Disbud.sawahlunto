import React from 'react';
import { Camera } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const CultureHighlight: React.FC = () => {
  const { content, language } = useData();
  return (
    <section id="culture" className="py-24 bg-heritage-dark text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
         <img src="https://picsum.photos/800/800" alt="Pattern" className="w-full h-full object-cover grayscale" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <span className="text-heritage-gold uppercase tracking-widest font-sans text-sm font-bold block mb-3">
              {content.culture.sectionTitle[language]}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">{content.culture.title[language]}</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {content.culture.description[language]}
            </p>
            <button className="flex items-center gap-3 text-white border border-white/20 px-6 py-3 hover:bg-heritage-gold hover:border-heritage-gold transition-all">
              <Camera className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm font-bold">
                {language === 'en' ? 'View Gallery' : 'Lihat Galeri'}
              </span>
            </button>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-heritage-gold"></div>
            <img 
              src="https://picsum.photos/600/400?random=10" 
              alt="Songket Weaver" 
              className="w-full rounded-sm shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-heritage-gold"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CultureHighlight;