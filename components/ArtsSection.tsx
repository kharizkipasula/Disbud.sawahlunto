import React from 'react';
import { useData } from '../contexts/DataContext';
import { Music, ArrowRight } from 'lucide-react';

const ArtsSection: React.FC = () => {
  const { content, language } = useData();
  const { arts } = content;

  return (
    <section id="arts" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[1px] bg-heritage-gold"></div>
                <Music className="w-5 h-5 text-heritage-gold" />
                <div className="w-10 h-[1px] bg-heritage-gold"></div>
             </div>
             
             <span className="text-heritage-gold uppercase tracking-widest font-sans text-sm font-bold mb-3 animate-fade-in-up">
                {arts.sectionTitle[language]}
             </span>
             
             <p className="text-gray-600 text-lg leading-relaxed animate-fade-in-up delay-100">
                {arts.description[language]}
             </p>
        </div>

        {/* Arts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {arts.items.map((item, index) => (
                <div 
                    key={item.id} 
                    className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-heritage-dark aspect-[4/5] md:aspect-auto md:h-96"
                    style={{ animationDelay: `${index * 150}ms` }}
                >
                    <img 
                        src={item.imageUrl} 
                        alt={item.title[language]} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="w-12 h-1 bg-heritage-gold mb-4 w-0 group-hover:w-12 transition-all duration-500"></div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">{item.title[language]}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                            {item.description[language]}
                        </p>
                        <div className="flex items-center gap-2 text-heritage-gold text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            <span>{language === 'en' ? 'Learn More' : 'Pelajari'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ArtsSection;