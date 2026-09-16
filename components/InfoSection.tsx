import React from 'react';
import { useData } from '../contexts/DataContext';
import { Ticket, Target, Users, Map } from 'lucide-react';

const InfoSection: React.FC = () => {
  const { content, language, activeInfoTab, setActiveInfoTab, museums } = useData();

  return (
    <section id="info" className="py-20 bg-heritage-stone scroll-mt-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-heritage-dark">
            {language === 'en' ? 'Visitor Information' : 'Informasi Pengunjung'}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-1/4 flex flex-col gap-2">
            {[
              { id: 'tickets', icon: Ticket, label: { en: 'Tickets & Hours', id: 'Tiket & Jam' } },
              { id: 'vision', icon: Target, label: { en: 'Vision & Mission', id: 'Visi & Misi' } },
              { id: 'org', icon: Users, label: { en: 'Organization', id: 'Struktur Organisasi' } },
              { id: 'map', icon: Map, label: { en: 'Location Map', id: 'Peta Lokasi' } },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveInfoTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-all text-left ${
                  activeInfoTab === tab.id 
                    ? 'bg-heritage-dark text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-bold font-sans text-sm uppercase tracking-wide">
                  {tab.label[language]}
                </span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="w-full lg:w-3/4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
            
            {/* Tickets */}
            {activeInfoTab === 'tickets' && (
              <div className="animate-fade-in-up">
                <h3 className="font-serif text-2xl font-bold mb-8 text-heritage-dark flex items-center gap-3">
                  <Ticket className="text-heritage-gold w-8 h-8" />
                  {language === 'en' ? 'Entrance Tickets' : 'Tiket Masuk'}
                </h3>
                
                {/* Hours Ticket Style */}
                <div className="mb-10 transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="relative bg-heritage-stone border-2 border-dashed border-heritage-gold/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden group">
                        {/* Cutouts */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full border-r border-heritage-gold/20"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full border-l border-heritage-gold/20"></div>
                        
                        <div className="text-center md:text-left z-10">
                            <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-1">
                                {language === 'en' ? 'Operational Hours' : 'Jam Operasional'}
                            </h4>
                            <p className="text-2xl font-display font-bold text-heritage-dark group-hover:text-heritage-gold transition-colors whitespace-pre-line">
                                {content.tickets.openingHours[language]}
                            </p>
                        </div>
                        <div className="bg-heritage-gold/10 px-4 py-2 rounded-lg text-heritage-gold font-bold text-sm uppercase tracking-wider group-hover:bg-heritage-gold group-hover:text-white transition-colors">
                             {language === 'en' ? 'Open Daily' : 'Buka Setiap Hari'}
                        </div>
                    </div>
                </div>

                {/* Pricing Tickets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {museums.map((museum) => (
                        <div 
                            key={museum.id} 
                            className="group relative flex flex-col rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-white"
                        >
                            {/* Ticket Header */}
                            <div className="bg-heritage-dark p-6 text-center relative">
                                <h4 className="font-serif font-bold text-xl tracking-wider text-white">{museum.name[language]}</h4>
                                {/* Perforation visual (dots) */}
                                <div className="absolute -bottom-1 w-full left-0 flex justify-between px-2 z-10">
                                   {[...Array(12)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>)}
                                </div>
                            </div>
                            
                            {/* Ticket Body */}
                            <div className="p-6 pt-8 bg-gray-50 flex flex-col items-center justify-center relative border-x border-b border-gray-100 rounded-b-2xl flex-1">
                                {/* Side Cutouts at seam */}
                                <div className="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full"></div>
                                <div className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full"></div>

                                <div className="w-full space-y-4">
                                  {museum.ticketPrices && museum.ticketPrices.length > 0 ? (
                                    museum.ticketPrices.map(tp => (
                                      <div key={tp.id} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                        <span className="text-sm font-bold text-gray-500">{tp.category[language] || tp.category.id}</span>
                                        <div className="flex items-start gap-1">
                                            <span className="text-xs font-bold text-gray-400 mt-1">Rp</span>
                                            <span className="text-xl font-display font-bold text-heritage-dark">{tp.price.toLocaleString()}</span>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-gray-400 text-center italic">
                                      {language === 'en' ? 'No ticket info available' : 'Info tiket belum tersedia'}
                                    </p>
                                  )}
                                </div>
                                
                                {(museum.contactName || museum.contactPhone) && (
                                  <div className="w-full mt-6 pt-4 border-t border-gray-200 flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                      {language === 'en' ? 'Contact Person' : 'Narahubung'}
                                    </span>
                                    {museum.contactName && <span className="text-sm font-bold text-heritage-dark">{museum.contactName}</span>}
                                    {museum.contactPhone && <span className="text-sm text-gray-600 font-mono">{museum.contactPhone}</span>}
                                  </div>
                                )}
                                
                                <button className="mt-6 w-full py-2 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:bg-heritage-gold group-hover:text-white group-hover:border-heritage-gold transition-colors">
                                    {language === 'en' ? 'Book Now' : 'Pesan'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* Vision & Mission */}
            {activeInfoTab === 'vision' && (
              <div className="animate-fade-in-up space-y-12">
                {museums.map((museum) => (
                  <div key={museum.id} className="space-y-6">
                    <h3 className="font-serif text-2xl font-bold text-heritage-dark border-b border-gray-200 pb-2">
                      {museum.name[language]}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-serif text-xl font-bold mb-3 text-heritage-dark">{language === 'en' ? 'Vision' : 'Visi'}</h4>
                        <div className="p-6 bg-heritage-gold/10 rounded-xl border-l-4 border-heritage-gold h-full">
                          <p className="text-lg italic text-heritage-dark leading-relaxed">
                            "{museum.vision?.[language] || (language === 'en' ? 'Vision statement not available.' : 'Visi belum tersedia.')}"
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-serif text-xl font-bold mb-3 text-heritage-dark">{language === 'en' ? 'Mission' : 'Misi'}</h4>
                        <div className="p-6 bg-gray-50 rounded-xl h-full">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {museum.mission?.[language] || (language === 'en' ? 'Mission statement not available.' : 'Misi belum tersedia.')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Organization */}
            {activeInfoTab === 'org' && (
              <div className="animate-fade-in-up">
                <h3 className="font-serif text-2xl font-bold mb-6 text-heritage-dark">{language === 'en' ? 'Organizational Structure' : 'Struktur Organisasi'}</h3>
                <div className="w-full bg-gray-50 rounded-xl p-2 border border-gray-200">
                  <img 
                    src={content.organization.structureImageUrl} 
                    alt="Organization Chart" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Map */}
            {activeInfoTab === 'map' && (
              <div className="animate-fade-in-up h-full flex flex-col">
                <h3 className="font-serif text-2xl font-bold mb-6 text-heritage-dark">{language === 'en' ? 'Location' : 'Lokasi'}</h3>
                <div className="flex-1 w-full h-[400px] bg-gray-200 rounded-xl overflow-hidden relative">
                   <iframe 
                     src={content.contact.mapEmbedUrl}
                     width="100%" 
                     height="100%" 
                     style={{border:0}} 
                     allowFullScreen={true} 
                     loading="lazy" 
                     referrerPolicy="no-referrer-when-downgrade"
                     className="absolute inset-0"
                   ></iframe>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                     <Map className="w-5 h-5 text-heritage-gold shrink-0" />
                     <p className="text-gray-600">{content.contact.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;