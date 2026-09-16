import React from 'react';
import { useData } from '../contexts/DataContext';
import { Ticket, Target, Users, Map, Clock, Building2 } from 'lucide-react';

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
              { id: 'vision', icon: Target, label: { en: 'Museum Vision & Mission', id: 'Visi dan Misi Museum' } },
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
          <div className="w-full lg:w-3/4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
            
            {/* Tickets */}
            {activeInfoTab === 'tickets' && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                  <h3 className="font-serif text-2xl font-bold text-heritage-dark flex items-center gap-3">
                    <Ticket className="text-heritage-gold w-7 h-7" />
                    <span>{language === 'en' ? 'Entrance Tickets & Schedule' : 'Tarif Tiket Masuk & Jadwal'}</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
                    {museums.length} {language === 'en' ? 'Destinations' : 'Destinasi / Museum'}
                  </span>
                </div>
                
                {/* Hours Ticket Style - Modern Minimalist */}
                <div className="mb-6 bg-gradient-to-r from-amber-50/90 via-slate-50 to-amber-50/40 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-heritage-gold/20 text-heritage-gold flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-heritage-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-0.5">
                        {language === 'en' ? 'Operational Hours' : 'Jam Operasional'}
                      </h4>
                      <p className="text-base sm:text-lg font-bold text-heritage-dark whitespace-pre-line">
                        {content.tickets.openingHours[language]}
                      </p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{language === 'en' ? 'Open Daily' : 'Buka Setiap Hari'}</span>
                  </div>
                </div>

                {/* Modern Colorful Mini Voucher Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {museums.map((museum, mIdx) => {
                    const rawPhone = museum.contactPhone || content.contact.phone || '081234567890';
                    let cleanPhone = rawPhone.replace(/\D/g, '');
                    if (cleanPhone.startsWith('0')) {
                      cleanPhone = '62' + cleanPhone.slice(1);
                    } else if (!cleanPhone.startsWith('62')) {
                      cleanPhone = '62' + cleanPhone;
                    }
                    const museumName = museum.name[language] || museum.name.id;
                    const prefilledText = encodeURIComponent(
                      language === 'en'
                        ? `Hello, I would like to book entrance tickets for ${museumName} in Sawahlunto. Please provide booking details.`
                        : `Halo Pengelola ${museumName} / Dinas Kebudayaan Sawahlunto, saya ingin memesan tiket masuk untuk kunjungan. Mohon informasi ketersediaan tiket & reservasinya.`
                    );
                    const waUrl = `https://wa.me/${cleanPhone}?text=${prefilledText}`;

                    // Card color theme presets for visual richness
                    const colorThemes = [
                      {
                        headerBg: 'bg-gradient-to-r from-slate-900 via-stone-900 to-amber-950',
                        accent: 'text-amber-400',
                        borderHover: 'hover:border-amber-400/60',
                        badge: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
                      },
                      {
                        headerBg: 'bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900',
                        accent: 'text-emerald-400',
                        borderHover: 'hover:border-emerald-400/60',
                        badge: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
                      },
                      {
                        headerBg: 'bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900',
                        accent: 'text-blue-400',
                        borderHover: 'hover:border-blue-400/60',
                        badge: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
                      },
                      {
                        headerBg: 'bg-gradient-to-r from-stone-950 via-amber-950 to-stone-900',
                        accent: 'text-orange-400',
                        borderHover: 'hover:border-orange-400/60',
                        badge: 'bg-orange-400/10 text-orange-300 border-orange-400/20',
                      },
                    ];
                    const theme = colorThemes[mIdx % colorThemes.length];

                    return (
                      <div 
                        key={museum.id} 
                        className={`group relative flex flex-col rounded-2xl bg-white border border-slate-200/90 ${theme.borderHover} shadow-2xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                      >
                        {/* Voucher Header */}
                        <div className={`relative ${theme.headerBg} p-4 text-center text-white`}>
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badge}`}>
                              {language === 'en' ? 'Admission Ticket' : 'Tiket Masuk'}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-base tracking-wide text-white line-clamp-1">
                            {museum.name[language]}
                          </h4>
                        </div>

                        {/* Perforation Seam with Half-circle cutouts */}
                        <div className="relative bg-slate-50 py-1 flex items-center justify-between border-y border-slate-200/70">
                          {/* Left Notch */}
                          <div className="w-3.5 h-3.5 rounded-full bg-white border-r border-slate-200 -ml-2 shrink-0"></div>
                          {/* Dashed Line */}
                          <div className="flex-1 mx-2 border-b border-dashed border-slate-300"></div>
                          {/* Right Notch */}
                          <div className="w-3.5 h-3.5 rounded-full bg-white border-l border-slate-200 -mr-2 shrink-0"></div>
                        </div>

                        {/* Voucher Body */}
                        <div className="p-4 bg-slate-50/50 flex-1 flex flex-col justify-between space-y-4">
                          {/* Price list */}
                          <div className="space-y-2">
                            {museum.ticketPrices && museum.ticketPrices.length > 0 ? (
                              museum.ticketPrices.map(tp => (
                                <div 
                                  key={tp.id} 
                                  className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0 text-xs"
                                >
                                  <span className="font-medium text-slate-600">
                                    {tp.category[language] || tp.category.id}
                                  </span>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-[10px] font-bold text-slate-400">Rp</span>
                                    <span className="text-sm font-bold font-mono text-slate-900">
                                      {tp.price.toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-400 text-center italic py-2">
                                {language === 'en' ? 'Free / Register on site' : 'Info tiket / registrasi di lokasi'}
                              </p>
                            )}
                          </div>

                          {/* Narahubung / PIC */}
                          {(museum.contactName || museum.contactPhone) && (
                            <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 text-center space-y-0.5 shadow-2xs">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">
                                {language === 'en' ? 'Contact Person' : 'Narahubung'}
                              </span>
                              {museum.contactName && (
                                <div className="text-xs font-bold text-slate-800 truncate">
                                  {museum.contactName}
                                </div>
                              )}
                              {museum.contactPhone && (
                                <div className="text-[11px] font-mono font-semibold text-slate-500">
                                  {museum.contactPhone}
                                </div>
                              )}
                            </div>
                          )}

                          {/* WhatsApp Booking Button */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-2xs hover:shadow-md transition-all duration-200 mt-auto"
                            title={`Pesan via WA ${museum.name[language]}`}
                          >
                            {/* WhatsApp SVG Icon */}
                            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15-.201.3-.778.98-.954 1.18-.175.2-.351.225-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.086-.176-.3-.019-.462.132-.612.136-.135.301-.35.452-.525.15-.175.2-.3.301-.5.101-.2.05-.375-.025-.525-.075-.15-.678-1.636-.93-2.242-.244-.59-.493-.51-.678-.52-.176-.009-.377-.01-.578-.01-.201 0-.527.075-.803.375-.276.3-1.054 1.03-1.054 2.511 0 1.482 1.079 2.912 1.23 3.112.15.2 2.123 3.243 5.143 4.547.719.311 1.281.497 1.719.636.722.23 1.378.197 1.898.12.579-.087 1.782-.728 2.033-1.432.251-.704.251-1.308.176-1.432-.075-.125-.276-.2-.577-.35zM12.042 2C6.527 2 2.05 6.477 2.05 11.992c0 1.954.563 3.778 1.541 5.318L2 22l4.832-1.55c1.488.898 3.228 1.417 5.09 1.417 5.515 0 9.992-4.477 9.992-9.992S17.557 2 12.042 2zm0 18.283c-1.684 0-3.253-.51-4.562-1.385l-.328-.219-3.385 1.085 1.106-3.3-.239-.344c-.958-1.38-1.472-3.033-1.472-4.747 0-4.57 3.718-8.288 8.288-8.288 4.57 0 8.288 3.718 8.288 8.288 0 4.57-3.718 8.288-8.288 8.288z" />
                            </svg>
                            <span>{language === 'en' ? 'Pesan via WA' : 'Pesan via WA'}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
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