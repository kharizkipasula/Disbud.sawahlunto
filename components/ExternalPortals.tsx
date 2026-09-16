import React from 'react';
import { useData } from '../contexts/DataContext';
import { ExternalLink as LinkIcon, ArrowRight } from 'lucide-react';

const ExternalPortals: React.FC = () => {
  const { externalLinks, language } = useData();

  if (externalLinks.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {externalLinks.map((link) => (
            <a 
              key={link.id} 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer" 
              className="flex-1 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row max-w-2xl"
            >
              <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                <img 
                  src={link.imageUrl} 
                  alt={link.title[language]} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                   <h3 className="font-serif font-bold text-xl text-heritage-dark group-hover:text-heritage-gold transition-colors">
                     {link.title[language]}
                   </h3>
                   <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-heritage-gold" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {link.description[language]}
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-heritage-gold group-hover:gap-3 transition-all">
                  {link.buttonText[language]}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-heritage-gold/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-heritage-gold/10"></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExternalPortals;