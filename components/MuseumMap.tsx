import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { MapPin, Navigation, View, Map as MapIcon, Rotate3D, Layers, Globe, Mountain } from 'lucide-react';

const MuseumMap: React.FC = () => {
  const { language, museums } = useData();
  const [activeMuseum, setActiveMuseum] = useState(museums[0]);
  const [viewMode, setViewMode] = useState<'map' | 'street'>('map');
  // Map Type: 'm' = map (standard), 'k' = satellite, 'h' = hybrid (satellite + labels), 'p' = terrain
  const [mapType, setMapType] = useState<'m' | 'k' | 'h' | 'p'>('m');

  useEffect(() => {
    if (museums.length > 0 && !museums.find(m => m.id === activeMuseum?.id)) {
        setActiveMuseum(museums[0]);
    }
  }, [museums, activeMuseum]);

  // Reset view mode when changing museum
  useEffect(() => {
      setViewMode('map');
  }, [activeMuseum?.id]);

  if (!museums.length) return null;

  return (
    <section id="map" className="py-16 bg-white border-b border-gray-100 relative z-20 -mt-10 rounded-t-3xl shadow-xl mx-4 md:mx-auto max-w-7xl scroll-mt-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-heritage-gold uppercase tracking-widest font-sans text-sm font-bold block mb-2">
            {language === 'en' ? 'Navigation' : 'Navigasi'}
          </span>
          <h2 className="font-serif text-3xl font-bold text-heritage-dark">
            {language === 'en' ? 'Museum Map Guide' : 'Peta Panduan Museum'}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 h-[600px] lg:h-[500px]">
          {/* List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar order-2 lg:order-1 h-full">
            {museums.map((museum) => (
              <button
                key={museum.id}
                onClick={() => setActiveMuseum(museum)}
                className={`text-left p-4 rounded-xl transition-all border-2 group ${
                  activeMuseum?.id === museum.id
                    ? 'border-heritage-gold bg-heritage-gold/5 shadow-md'
                    : 'border-transparent bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold font-serif mb-1 ${activeMuseum?.id === museum.id ? 'text-heritage-dark' : 'text-gray-600'}`}>
                    {museum.name[language]}
                  </h3>
                  {activeMuseum?.id === museum.id && <Navigation className="w-4 h-4 text-heritage-gold animate-bounce" />}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">
                  {museum.description[language]}
                </p>
                {/* Badge if 360 is available */}
                {museum.streetViewUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                        <Rotate3D className="w-3 h-3" /> 360° Tour
                    </span>
                )}
              </button>
            ))}
            
            <div className="mt-auto pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 italic">
                {language === 'en' ? 'Click a destination to update the map.' : 'Klik destinasi untuk memperbarui peta.'}
              </p>
            </div>
          </div>

          {/* Map Viewer Container */}
          <div className="w-full lg:w-2/3 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 relative bg-gray-200 order-1 lg:order-2 flex flex-col h-full">
             
             {/* Map Controls Container */}
             <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                
                {/* View Mode Toggle (Map vs Street) */}
                <div className="flex gap-1 bg-white/90 backdrop-blur p-1 rounded-lg shadow-lg border border-gray-200">
                    <button 
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors ${
                            viewMode === 'map' ? 'bg-heritage-dark text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={language === 'en' ? 'Standard Map' : 'Peta Standar'}
                    >
                        <MapIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">{language === 'en' ? 'Map' : 'Peta'}</span>
                    </button>
                    <button 
                        onClick={() => activeMuseum?.streetViewUrl && setViewMode('street')}
                        disabled={!activeMuseum?.streetViewUrl}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors ${
                            viewMode === 'street' 
                            ? 'bg-heritage-gold text-white' 
                            : activeMuseum?.streetViewUrl 
                                ? 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                : 'text-gray-300 cursor-not-allowed'
                        }`}
                        title={language === 'en' ? 'Street View 360' : 'Street View 360'}
                    >
                        <Rotate3D className="w-3 h-3" />
                        <span className="hidden sm:inline">Street View</span>
                    </button>
                </div>

                {/* Map Type Controls (Only visible in Map Mode) */}
                {viewMode === 'map' && (
                    <div className="flex flex-col bg-white/90 backdrop-blur p-1 rounded-lg shadow-lg border border-gray-200 animate-fade-in-up">
                         <span className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1 mb-1 border-b border-gray-100">
                            {language === 'en' ? 'Map Type' : 'Jenis Peta'}
                         </span>
                         <div className="flex flex-col gap-1">
                            <button 
                                onClick={() => setMapType('m')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-left transition-colors ${
                                    mapType === 'm' ? 'bg-gray-100 text-heritage-dark' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <MapIcon className="w-3 h-3" />
                                {language === 'en' ? 'Standard' : 'Standar'}
                            </button>
                            <button 
                                onClick={() => setMapType('k')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-left transition-colors ${
                                    mapType === 'k' ? 'bg-gray-100 text-heritage-dark' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Globe className="w-3 h-3" />
                                {language === 'en' ? 'Satellite' : 'Satelit'}
                            </button>
                            <button 
                                onClick={() => setMapType('h')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-left transition-colors ${
                                    mapType === 'h' ? 'bg-gray-100 text-heritage-dark' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Layers className="w-3 h-3" />
                                {language === 'en' ? 'Hybrid' : 'Hibrida'}
                            </button>
                         </div>
                    </div>
                )}
             </div>

             {/* Content */}
             <div className="flex-1 relative bg-gray-100">
                {activeMuseum && (
                    viewMode === 'map' ? (
                        <iframe
                            key={`map-${activeMuseum.id}-${mapType}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            // t parameter controls map type: m=map, k=satellite, h=hybrid, p=terrain
                            src={`https://maps.google.com/maps?q=${activeMuseum.embedQuery}&t=${mapType}&z=17&ie=UTF8&iwloc=&output=embed`}
                            className="absolute inset-0 w-full h-full animate-fade-in"
                            title={`${activeMuseum.name[language]} Map`}
                        ></iframe>
                    ) : (
                        <iframe
                            key={`street-${activeMuseum.id}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={activeMuseum.streetViewUrl}
                            className="absolute inset-0 w-full h-full animate-fade-in"
                            title={`${activeMuseum.name[language]} 360 View`}
                        ></iframe>
                    )
                )}
                
                {/* Overlay Label */}
                {activeMuseum && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold text-heritage-dark pointer-events-none animate-slide-up z-0">
                        <MapPin className="w-4 h-4 text-heritage-brick" />
                        <div>
                            <span className="block leading-none">{activeMuseum.name[language]}</span>
                            {viewMode === 'street' && <span className="text-[10px] text-blue-600 uppercase tracking-wider font-extrabold mt-0.5">360° Virtual Tour</span>}
                            {viewMode === 'map' && mapType === 'k' && <span className="text-[10px] text-green-600 uppercase tracking-wider font-extrabold mt-0.5">Satellite View</span>}
                        </div>
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MuseumMap;