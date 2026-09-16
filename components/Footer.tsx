import React from 'react';
import { 
  Facebook, Instagram, Twitter, MapPin, Mail, Phone, Youtube, 
  Globe as WebIcon, ExternalLink, Users, Eye, Activity, Sparkles 
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { TikTokIcon } from './Navbar';

const getSocialIcon = (platform: string) => {
  const p = (platform || '').toLowerCase();
  if (p === 'facebook') return Facebook;
  if (p === 'instagram') return Instagram;
  if (p === 'twitter' || p === 'x') return Twitter;
  if (p === 'youtube') return Youtube;
  if (p === 'tiktok') return TikTokIcon;
  if (p === 'website') return WebIcon;
  if (p === 'email') return Mail;
  if (p === 'phone') return Phone;
  return WebIcon;
};

const getSocialHover = (platform: string) => {
  const p = (platform || '').toLowerCase();
  switch (p) {
    case 'instagram': return 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent';
    case 'facebook': return 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]';
    case 'twitter':
    case 'x': return 'hover:bg-black hover:text-white hover:border-black';
    case 'youtube': return 'hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]';
    case 'tiktok': return 'hover:bg-black hover:text-white hover:border-black';
    case 'email': return 'hover:bg-emerald-600 hover:text-white hover:border-emerald-600';
    default: return 'hover:bg-amber-600 hover:text-white hover:border-amber-600';
  }
};

const Footer: React.FC = () => {
  const { content, socialLinks, language, visitorStats } = useData();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="relative font-sans overflow-hidden bg-[#DCE4BD] text-slate-800 pt-8 pb-10 border-t border-slate-300/80">
      
      {/* FLOATING CIRCULAR SOCIAL MEDIA BADGES (Matching screenshot reference) */}
      <div className="pb-8 flex justify-center items-center">
        <div className="flex items-center gap-3 sm:gap-4.5">
          {socialLinks.map((link) => {
            const Icon = getSocialIcon(link.platform);
            const hoverStyle = getSocialHover(link.platform);
            return (
              <a
                key={link.id}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white text-slate-900 border border-slate-200/90 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-115 hover:shadow-xl ${hoverStyle}`}
                title={link.platform}
                aria-label={link.platform}
              >
                <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-slate-400/30">
          
          {/* KOLOM 1: TENTANG KAMI & LOGO (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {content.branding.logoUrl ? (
                <img 
                  src={content.branding.logoUrl} 
                  alt="Logo" 
                  className="w-12 h-12 object-contain drop-shadow-sm" 
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900 leading-tight">
                  {content.branding.siteName || 'DINAS KEBUDAYAAN'}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  {content.branding.subTitle || 'Kota Sawahlunto'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                {language === 'en' ? 'About Us' : 'Tentang Kami'}
              </h4>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
                {language === 'en' 
                  ? 'The Cultural Service of Sawahlunto City is responsible for managing, preserving, and promoting the Ombilin Coal Mining Heritage (WTBOS UNESCO World Heritage) and the rich tangible and intangible cultural heritage of Sawahlunto.'
                  : 'Dinas Kebudayaan Kota Sawahlunto mempunyai tugas menyelenggarakan urusan pemerintahan di bidang kebudayaan, pelestarian Warisan Tambang Batubara Ombilin Sawahlunto (WTBOS) sebagai Warisan Dunia UNESCO, museum, cagar budaya, dan kesenian daerah.'}
              </p>
            </div>
          </div>

          {/* KOLOM 2: TAUTAN MENU & UNIT KERJA (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">
              {language === 'en' ? 'Navigation & Portals' : 'Navigasi & Layanan'}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-slate-700">
              <a href="#hero" onClick={(e) => handleScrollTo(e, 'hero')} className="hover:text-slate-950 hover:underline transition-colors">
                {language === 'en' ? 'Home' : 'Beranda'}
              </a>
              <a href="#heritage" onClick={(e) => handleScrollTo(e, 'heritage')} className="hover:text-slate-950 hover:underline transition-colors">
                {language === 'en' ? 'Heritage' : 'Cagar Budaya'}
              </a>
              <a href="#destinations" onClick={(e) => handleScrollTo(e, 'destinations')} className="hover:text-slate-950 hover:underline transition-colors">
                {language === 'en' ? 'Museums' : 'Museum Kota'}
              </a>
              <a href="#arts" onClick={(e) => handleScrollTo(e, 'arts')} className="hover:text-slate-950 hover:underline transition-colors">
                {language === 'en' ? 'Culture' : 'Kesenian'}
              </a>
              <a href="#news" onClick={(e) => handleScrollTo(e, 'news')} className="hover:text-slate-950 hover:underline transition-colors">
                {language === 'en' ? 'News' : 'Warta Terkini'}
              </a>
              <a href="#portals" onClick={(e) => handleScrollTo(e, 'portals')} className="hover:text-slate-950 hover:underline transition-colors">
                {language === 'en' ? 'Portals' : 'Unit Kerja'}
              </a>
              <a href="#map" onClick={(e) => handleScrollTo(e, 'map')} className="hover:text-slate-950 hover:underline transition-colors">
                {language === 'en' ? 'Interactive Map' : 'Peta Budaya'}
              </a>
              <a href="#info" onClick={(e) => handleScrollTo(e, 'info')} className="hover:text-slate-950 hover:underline transition-colors">
                {language === 'en' ? 'Tickets & Info' : 'Tiket & Jam Buka'}
              </a>
            </div>
          </div>

          {/* KOLOM 3: ALAMAT KANTOR & GOOGLE MAPS (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
              {language === 'en' ? 'Office Address' : 'Alamat Kantor'}
            </h4>
            
            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-900 mt-0.5 shrink-0" />
                <span className="leading-snug">{content.contact.address || 'Kawasan Kota Tua Sawahlunto, Sumatera Barat'}</span>
              </div>
              {content.contact.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-900 shrink-0" />
                  <span>{content.contact.phone}</span>
                </div>
              )}
              {content.contact.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-900 shrink-0" />
                  <span>{content.contact.email}</span>
                </div>
              )}
            </div>

            {/* Google Map Card with Button */}
            <div className="mt-3 bg-white/90 border border-slate-300 rounded-xl p-3 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Google Maps</p>
                  <p className="text-[11px] text-slate-600">Sawahlunto Heritage Area</p>
                </div>
              </div>
              <a
                href={content.contact.mapEmbedUrl || 'https://maps.google.com/?q=Sawahlunto'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
              >
                <span>Buka di Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* STATISTIK PENGUNJUNG RIIL (VISITOR COUNTER WIDGET) */}
        <div className="pt-6 pb-2">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-300/80 shadow-sm max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                    {language === 'en' ? 'Visitor Statistics' : 'Statistik Kunjungan'}
                  </h5>
                  <p className="text-[11px] text-slate-600">
                    {language === 'en' ? 'Real-time portal analytics' : 'Data kunjungan situs resmi'}
                  </p>
                </div>
              </div>

              {/* 3 Metric Badges */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                
                {/* 1. Online */}
                <div className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-center min-w-[85px]">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Online</span>
                  </div>
                  <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-900">
                    {visitorStats.online}
                  </span>
                </div>

                {/* 2. Hari Ini */}
                <div className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-blue-50 border border-blue-200/80 text-center min-w-[95px]">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Eye className="w-3 h-3 text-blue-700" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Hari Ini</span>
                  </div>
                  <span className="text-sm sm:text-base font-extrabold font-mono text-blue-900">
                    {visitorStats.today.toLocaleString()}
                  </span>
                </div>

                {/* 3. Total */}
                <div className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-center min-w-[105px]">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Users className="w-3 h-3 text-amber-700" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Total</span>
                  </div>
                  <span className="text-sm sm:text-base font-extrabold font-mono text-amber-950">
                    {visitorStats.total.toLocaleString()}
                  </span>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* COPYRIGHT BOTTOM BAR */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-700 gap-2">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} <strong>{content.branding.siteName}</strong>. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
            <span>Warisan Dunia UNESCO WTBOS</span>
            <span>•</span>
            <span>Kota Sawahlunto</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;