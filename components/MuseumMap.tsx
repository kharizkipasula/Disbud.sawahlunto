import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { MapPin, Navigation, ExternalLink, Map as MapIcon, Compass } from 'lucide-react';

const MuseumMap: React.FC = () => {
  const { language, museums } = useData();
  const [activeMuseumId, setActiveMuseumId] = useState<string>(museums[0]?.id || 'goedang-ransoem');

  const activeMuseum = museums.find(m => m.id === activeMuseumId) || museums[0];

  if (!museums.length) return null;

  // Query and coordinates for the active museum
  const museumQuery = activeMuseum.embedQuery || `${activeMuseum.name.id} Sawahlunto`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(museumQuery + ' Kota Sawahlunto')}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  
  const googleMapsUrl = activeMuseum.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeMuseum.name.id + ' Sawahlunto')}`;
  const directionsUrl = activeMuseum.lat && activeMuseum.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${activeMuseum.lat},${activeMuseum.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeMuseum.name.id + ' Sawahlunto')}`;

  return (
    <section id="map" className="py-16 bg-white border-b border-gray-100 relative z-20 -mt-10 rounded-3xl shadow-xl mx-4 md:mx-auto max-w-7xl scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-heritage-gold uppercase tracking-widest font-sans text-xs sm:text-sm font-bold block mb-2">
            {language === 'en' ? 'Interactive Guide' : 'Panduan Navigasi'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-heritage-dark">
            {language === 'en' ? 'Sawahlunto Museum & Heritage Map' : 'Peta Lokasi Museum & Cagar Budaya'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mt-2">
            {language === 'en' 
              ? 'Select a museum to view its exact location, navigate via Google Maps, or get driving directions.' 
              : 'Pilih museum di bawah untuk melihat titik lokasi presisi, panduan rute, dan navigasi langsung.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
          
          {/* Left: Destination List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3 max-h-[480px] lg:max-h-[560px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar order-2 lg:order-1">
            {museums.map((museum, index) => {
              const isSelected = activeMuseum?.id === museum.id;
              return (
                <button
                  key={museum.id}
                  type="button"
                  onClick={() => setActiveMuseumId(museum.id)}
                  className={`p-4 rounded-2xl transition-all duration-200 border-2 text-left cursor-pointer group relative w-full ${
                    isSelected
                      ? 'border-heritage-gold bg-amber-50/80 shadow-md ring-1 ring-heritage-gold/30'
                      : 'border-slate-100 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Index Number Badge */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-heritage-gold text-slate-950 shadow-sm' 
                        : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-bold font-serif text-sm tracking-tight truncate ${
                          isSelected ? 'text-slate-950 font-extrabold' : 'text-slate-800'
                        }`}>
                          {museum.name[language] || museum.name.id}
                        </h3>
                        {isSelected && (
                          <Navigation className="w-4 h-4 text-heritage-gold shrink-0 animate-bounce" />
                        )}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">
                        {museum.description[language] || museum.description.id}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className={`text-[11px] flex items-center gap-1 font-medium ${
                          isSelected ? 'text-heritage-gold font-bold' : 'text-slate-500'
                        }`}>
                          <MapPin className="w-3.5 h-3.5" />
                          {language === 'en' ? 'Click to view location' : 'Klik untuk lihat peta'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="mt-auto pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                {language === 'en' 
                  ? 'Select any museum above to view its live map and location details.' 
                  : 'Pilih museum di atas untuk memperbarui tampilan peta dan rute secara instan.'}
              </p>
            </div>
          </div>

          {/* Right: Clean Map Viewer Container */}
          <div className="w-full lg:w-2/3 rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative bg-slate-100 order-1 lg:order-2 flex flex-col min-h-[420px] lg:min-h-[560px] h-[420px] lg:h-[560px]">
             
             {/* Map Render Canvas via Direct Standard Embed */}
             <div className="flex-1 relative w-full h-full bg-slate-100">
                <iframe
                  key={`map-embed-${activeMuseum.id}`}
                  title={`${activeMuseum.name[language] || activeMuseum.name.id} Map`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="eager"
                  src={embedUrl}
                  className="w-full h-full absolute inset-0"
                />
             </div>

             {/* Bottom Museum Info & Direct Navigation Action Bar */}
             {activeMuseum && (
                <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-heritage-gold flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-heritage-brick" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="font-bold text-sm text-slate-900 leading-tight">
                              {activeMuseum.name[language] || activeMuseum.name.id}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              {activeMuseum.address ? (activeMuseum.address[language] || activeMuseum.address.id) : 'Kota Sawahlunto, Sumatera Barat'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a 
                          href={directionsUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-heritage-gold text-xs font-bold transition-all shadow-sm"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Get Directions' : 'Petunjuk Arah'}</span>
                        </a>

                        <a 
                          href={googleMapsUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
                          title="Buka di Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Google Maps</span>
                        </a>
                    </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MuseumMap;
