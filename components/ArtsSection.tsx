import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  X, 
  Share2, 
  Sparkles, 
  Search, 
  Tag, 
  Layers, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Table
} from 'lucide-react';
import { ArtItem } from '../types';
import { formatGoogleDriveUrl } from '../src/utils/imageHelper';

const ArtsSection: React.FC = () => {
  const { content, language } = useData();
  const { arts } = content;

  const [selectedItem, setSelectedItem] = useState<ArtItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Helper to extract localized text
  const getLoc = (obj: any, lang: 'en' | 'id'): string => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['id'] || obj['en'] || '';
  };

  // Categories extraction
  const categories = Array.from(
    new Set(
      arts.items
        .map(item => getLoc(item.category, language))
        .filter(cat => Boolean(cat))
    )
  );

  const filteredItems = arts.items.filter(item => {
    const title = getLoc(item.title, language).toLowerCase();
    const desc = getLoc(item.description, language).toLowerCase();
    const cat = getLoc(item.category, language).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = title.includes(query) || desc.includes(query) || cat.includes(query);
    const matchesCategory = selectedCategory === 'all' || getLoc(item.category, language) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleShare = (item: ArtItem) => {
    if (navigator.share) {
      navigator.share({
        title: getLoc(item.title, language),
        text: getLoc(item.description, language),
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <section id="arts" className="py-24 bg-[#F8F9FA] scroll-mt-20 relative overflow-hidden">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-heritage-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Building2 className="w-4 h-4 text-heritage-gold" />
            <span>{language === 'en' ? 'Living Cultural Heritage' : 'Warisan Budaya Hidup'}</span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-heritage-dark mb-4 tracking-tight">
            {getLoc(arts.sectionTitle, language) || (language === 'en' ? 'CULTURAL INSTITUTIONS' : 'LEMBAGA KEBUDAYAAN')}
          </h2>
          
          <div className="w-16 h-1 bg-heritage-gold mb-6 rounded-full"></div>
          
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {getLoc(arts.description, language) || (language === 'en'
              ? 'Explore registered cultural institutions, traditional performance troupes, and heritage guilds of Sawahlunto.'
              : 'Daftar lembaga kebudayaan, sanggar seni tradisi, paguyuban adat, dan komunitas pelestari warisan budaya Sawahlunto.')}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-white p-3 rounded-2xl shadow-sm border border-slate-200/70">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-heritage-dark text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'en' ? 'All Institutions' : 'Semua Lembaga'} ({arts.items.length})
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-heritage-gold text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search institution or art...' : 'Cari lembaga atau kesenian...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-heritage-gold focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* News-Style Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">{language === 'en' ? 'No cultural institutions found.' : 'Tidak ada lembaga kebudayaan yang cocok.'}</p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-xs font-bold text-heritage-gold hover:underline"
            >
              {language === 'en' ? 'Reset Filters' : 'Reset Filter'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredItems.map((item, index) => {
              const formattedImg = formatGoogleDriveUrl(item.imageUrl) || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800';
              const itemTitle = getLoc(item.title, language);
              const itemCategory = getLoc(item.category, language) || (language === 'en' ? 'Cultural Institution' : 'Lembaga Kebudayaan');
              const itemDesc = getLoc(item.description, language);
              const itemLocation = getLoc(item.location, language);

              return (
                <article 
                  key={item.id || index}
                  onClick={() => setSelectedItem(item)}
                  className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-300/80 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                >
                  {/* Article Banner Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img 
                      src={formattedImg} 
                      alt={itemTitle} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback image if Google Drive or remote URL has permission or loading failure
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider shadow-md">
                        {itemCategory}
                      </span>
                      {item.date && (
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-200 font-mono text-[11px] flex items-center gap-1.5 shadow-md">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          {item.date}
                        </span>
                      )}
                    </div>

                    {/* Bottom overlay title info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      {itemLocation && (
                        <div className="flex items-center gap-1.5 text-amber-300 text-xs font-medium mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{itemLocation}</span>
                        </div>
                      )}
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-white leading-snug drop-shadow-sm group-hover:text-amber-200 transition-colors">
                        {itemTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Article Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    {/* Description excerpt */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {itemDesc}
                    </p>

                    {/* Card Footer / Action Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        {item.leader ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[150px]">{item.leader}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Sawahlunto Heritage</span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedItem(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-heritage-gold hover:text-amber-800 transition-colors group/btn"
                      >
                        <span>{language === 'en' ? 'Read Full Article' : 'Baca Selengkapnya'}</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ARTICLE DETAIL MODAL (Tampilan Berita Lembaga Kebudayaan) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-6 animate-fade-in">
          <div 
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative border border-slate-200 custom-scrollbar animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black text-white p-2.5 rounded-full transition-all backdrop-blur-md shadow-lg"
              title={language === 'en' ? 'Close' : 'Tutup'}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Hero Banner */}
            <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
              <img 
                src={formatGoogleDriveUrl(selectedItem.imageUrl) || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200'} 
                alt={getLoc(selectedItem.title, language)}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              {/* Badges on Modal Banner */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-heritage-gold font-bold text-xs text-white uppercase tracking-wider shadow">
                    {getLoc(selectedItem.category, language) || (language === 'en' ? 'Cultural Institution' : 'Lembaga Kebudayaan')}
                  </span>
                  {selectedItem.date && (
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-slate-100 text-xs font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      {selectedItem.date}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-2xl md:text-4xl font-bold leading-tight">
                  {getLoc(selectedItem.title, language)}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Metadata row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-200">
                {selectedItem.leader && (
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <User className="w-5 h-5 text-heritage-gold shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{language === 'en' ? 'Leader / Director' : 'Ketua / Pembina'}</p>
                      <p className="text-xs font-bold text-slate-800">{selectedItem.leader}</p>
                    </div>
                  </div>
                )}
                
                {selectedItem.location && (
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <MapPin className="w-5 h-5 text-heritage-gold shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{language === 'en' ? 'Location' : 'Wilayah / Domisili'}</p>
                      <p className="text-xs font-bold text-slate-800">{getLoc(selectedItem.location, language)}</p>
                    </div>
                  </div>
                )}

                {selectedItem.contact && (
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Phone className="w-5 h-5 text-heritage-gold shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{language === 'en' ? 'Contact' : 'Kontak Layanan'}</p>
                      <p className="text-xs font-bold text-slate-800">{selectedItem.contact}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Narrative Article Text */}
              <div className="space-y-4">
                <h4 className="font-serif text-xl font-bold text-slate-900 border-l-4 border-heritage-gold pl-3">
                  {language === 'en' ? 'Profile & Historical Overview' : 'Profil & Latar Belakang Sejarah'}
                </h4>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {getLoc(selectedItem.description, language)}
                </p>
              </div>

              {/* Tabel Data Lembaga Kebudayaan 3 Kolom (No, Deskripsi, Keterangan) */}
              {selectedItem.tableData && selectedItem.tableData.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
                  <div className="bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50/40 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Table className="w-4 h-4 text-heritage-gold" />
                      <span>{language === 'en' ? 'Program & Performance Matrix' : 'Tabel Agenda, Program Kerja & Keterangan'}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-heritage-gold bg-white px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                      {selectedItem.tableData.length} {language === 'en' ? 'Rows (3 Columns)' : 'Baris (3 Kolom)'}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
                          <th className="py-3 px-3.5 text-center w-14">No</th>
                          <th className="py-3 px-4">{language === 'en' ? 'Description' : 'Deskripsi'}</th>
                          <th className="py-3 px-4">{language === 'en' ? 'Notes / Schedule / Remarks' : 'Keterangan'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedItem.tableData.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-amber-50/30 transition-colors">
                            <td className="py-3 px-3.5 text-center font-mono font-bold text-heritage-gold align-top">
                              {row.no ?? (rIdx + 1)}
                            </td>
                            <td className="py-3 px-4 text-slate-900 font-medium leading-relaxed align-top">
                              {getLoc(row.description, language)}
                            </td>
                            <td className="py-3 px-4 text-slate-600 text-xs md:text-sm leading-relaxed align-top">
                              {getLoc(row.notes, language)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Complete List of Programs / Activities */}
              {selectedItem.listItems && selectedItem.listItems.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-6 border border-amber-200/80 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-heritage-gold" />
                    <span>{language === 'en' ? 'Core Highlights & Key Repertoire' : 'Daftar Ragam Seni & Poin Keunggulan'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {selectedItem.listItems.map((listItem, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-amber-200/50 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-heritage-gold shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-800">{getLoc(listItem, language)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleShare(selectedItem)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedId ? (language === 'en' ? 'Link Copied!' : 'Tautan Disalin!') : (language === 'en' ? 'Share Article' : 'Bagikan Artikel')}</span>
                  </button>
                  
                  {selectedItem.contact && (
                    <a
                      href={`https://wa.me/${selectedItem.contact.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{language === 'en' ? 'Contact via WhatsApp' : 'Hubungi Pengurus'}</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-2.5 rounded-xl bg-heritage-dark text-white text-xs font-bold hover:bg-black transition-colors"
                >
                  {language === 'en' ? 'Close Article' : 'Tutup Berita'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ArtsSection;
