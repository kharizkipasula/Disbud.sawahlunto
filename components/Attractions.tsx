import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Attractions: React.FC = () => {
  const { attractions, language } = useData();

  return (
    <section id="destinations" className="py-24 bg-white scroll-mt-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-heritage-gold uppercase tracking-widest font-sans text-sm font-bold block mb-3">
            {language === 'en' ? 'Explore' : 'Jelajahi'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-heritage-dark">
            {language === 'en' ? 'Top Destinations' : 'Destinasi Unggulan'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {attractions.map((spot) => (
            <div key={spot.id} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 rounded-sm">
                <img 
                  src={spot.imageUrl} 
                  alt={spot.title[language]}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-heritage-dark/80 text-white text-xs px-3 py-1 uppercase tracking-wider">
                  {spot.category}
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-heritage-brick transition-colors">
                {spot.title[language]}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {spot.description[language]}
              </p>
              <div className="flex items-center gap-2 text-heritage-gold font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                <span>{language === 'en' ? 'Details' : 'Detail'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Attractions;