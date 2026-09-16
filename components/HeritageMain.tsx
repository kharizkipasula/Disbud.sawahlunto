import React from 'react';
import { useData } from '../contexts/DataContext';
import { Camera, Box, Sparkles, ExternalLink } from 'lucide-react';

const HeritageMain: React.FC = () => {
  const { content, language, activeHeritageTab, setActiveHeritageTab } = useData();

  return (
    <section id="heritage" className="py-24 bg-heritage-stone text-heritage-dark relative scroll-mt-20 min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Header & Tabs */}
        <div className="flex flex-col items-center mb-16">
            <span className="text-heritage-gold uppercase tracking-widest font-sans text-sm font-bold mb-4 animate-fade-in-up">
                {language === 'en' ? 'Our Heritage' : 'Warisan Kita'}
            </span>
            
            <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-2 animate-fade-in-up delay-100">
                <button 
                    onClick={() => setActiveHeritageTab('tangible')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeHeritageTab === 'tangible' 
                        ? 'bg-heritage-dark text-white shadow-lg transform scale-105' 
                        : 'bg-transparent text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    <Box className="w-4 h-4" />
                    {language === 'en' ? 'Tangible Heritage' : 'Warisan Benda'}
                </button>
                <button 
                    onClick={() => setActiveHeritageTab('intangible')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeHeritageTab === 'intangible' 
                        ? 'bg-heritage-gold text-white shadow-lg transform scale-105' 
                        : 'bg-transparent text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    <Sparkles className="w-4 h-4" />
                    {language === 'en' ? 'Intangible Heritage' : 'Warisan Tak Benda'}
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="relative">
            {/* TANGIBLE (HISTORY/MINES) */}
            {activeHeritageTab === 'tangible' && (
                <div className="flex flex-col md:flex-row items-center gap-16 animate-fade-in">
                    {/* Image Grid */}
                    <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                        <img 
                        src={content.history.imageUrl} 
                        alt="Old Mining Tunnel" 
                        className="w-full h-80 object-cover rounded-sm mt-12 shadow-xl"
                        />
                        <img 
                        src="https://picsum.photos/400/500?random=102" 
                        alt="Colonial Architecture" 
                        className="w-full h-64 object-cover rounded-sm shadow-xl"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center gap-4 mb-6">
                        <div className="h-px w-12 bg-heritage-dark"></div>
                        <span className="text-heritage-dark uppercase tracking-widest font-sans text-sm font-bold">
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
                        {language === 'en' ? 'Explore' : 'Telusuri'}
                        </a>
                    </div>
                    {/* Decorative Background Text */}
                    <span className="absolute -bottom-20 right-0 font-display text-[12rem] text-gray-200/50 pointer-events-none select-none hidden lg:block opacity-30">
                        1868
                    </span>
                </div>
            )}

            {/* INTANGIBLE (CULTURE/SONGKET) */}
            {activeHeritageTab === 'intangible' && (
                <div className="flex flex-col lg:flex-row items-center gap-16 animate-fade-in bg-heritage-dark text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <img src="https://picsum.photos/800/800?grayscale" alt="Pattern" className="w-full h-full object-cover grayscale" />
                    </div>

                    <div className="w-full lg:w-1/2 relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px w-12 bg-heritage-gold"></div>
                            <span className="text-heritage-gold uppercase tracking-widest font-sans text-sm font-bold">
                                {content.culture.sectionTitle[language]}
                            </span>
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">{content.culture.title[language]}</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                            {content.culture.description[language]}
                        </p>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-3 text-white border border-white/20 px-6 py-3 hover:bg-heritage-gold hover:border-heritage-gold transition-all">
                                <Camera className="w-5 h-5" />
                                <span className="uppercase tracking-widest text-sm font-bold">
                                    {language === 'en' ? 'Explore' : 'Telusuri'}
                                </span>
                            </button>
                             {content.culture.linkUrl && content.culture.linkUrl !== '#' && (
                                <a 
                                    href={content.culture.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-heritage-gold text-white px-6 py-3 hover:bg-white hover:text-heritage-dark transition-all"
                                >
                                    <span className="uppercase tracking-widest text-sm font-bold">
                                        {language === 'en' ? 'Visit Website' : 'Kunjungi Website'}
                                    </span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                    
                    <div className="w-full lg:w-1/2 relative z-10">
                        <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-heritage-gold"></div>
                        <img 
                        src={content.culture.imageUrl} 
                        alt="Songket Weaver" 
                        className="w-full rounded-sm shadow-2xl"
                        />
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-heritage-gold"></div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default HeritageMain;