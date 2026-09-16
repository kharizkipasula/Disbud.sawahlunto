import React from 'react';
import { useData } from '../contexts/DataContext';

const HistorySection: React.FC = () => {
  const { content, language } = useData();

  return (
    <section id="heritage" className="py-24 bg-heritage-stone text-heritage-dark relative scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Image Grid */}
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <img 
              src="https://picsum.photos/400/600" 
              alt="Old Mining Tunnel" 
              className="w-full h-80 object-cover rounded-sm mt-12 shadow-xl"
            />
            <img 
              src="https://picsum.photos/400/500" 
              alt="Colonial Architecture" 
              className="w-full h-64 object-cover rounded-sm shadow-xl"
            />
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-heritage-gold"></div>
              <span className="text-heritage-gold uppercase tracking-widest font-sans text-sm font-bold">
                {content.history.sectionTitle[language]}
              </span>
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 leading-tight">
              {content.history.title[language]}
            </h2>

            <p className="font-sans text-gray-600 leading-relaxed mb-6 text-lg">
              {content.history.description1[language]}
            </p>
            <p className="font-sans text-gray-600 leading-relaxed mb-8 text-lg">
              {content.history.description2[language]}
            </p>

            <a 
              href={content.history.linkUrl || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-heritage-dark font-bold uppercase tracking-widest border-b-2 border-heritage-gold pb-1 hover:text-heritage-gold transition-colors"
            >
              {language === 'en' ? 'Read Full History' : 'Baca Sejarah Lengkap'}
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative Background Text */}
      <span className="absolute -bottom-20 right-0 font-display text-[12rem] text-gray-200/50 pointer-events-none select-none hidden lg:block">
        1868
      </span>
    </section>
  );
};

export default HistorySection;