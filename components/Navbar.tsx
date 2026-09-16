
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, MapPin, Settings, Lock, Facebook, Instagram, Twitter, Youtube, 
  Globe as WebIcon, Video, Mail, Phone, ExternalLink, ChevronDown, User, 
  Building2, BookOpen, Compass, Ticket, Newspaper, Info, Sparkles
} from 'lucide-react';
import { NavItem, SocialLink } from '../types';
import { useData } from '../contexts/DataContext';

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case 'Instagram': return Instagram;
    case 'Facebook': return Facebook;
    case 'Twitter': return Twitter;
    case 'Youtube': return Youtube;
    case 'TikTok': return Video;
    case 'Website': return WebIcon;
    case 'Email': return Mail;
    case 'Phone': return Phone;
    default: return WebIcon;
  }
};

const getSocialColorClass = (platform: string) => {
  switch (platform) {
    case 'Instagram':
      return 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-sm hover:scale-110 hover:shadow-rose-500/25';
    case 'Facebook':
      return 'bg-[#1877F2] text-white shadow-sm hover:scale-110 hover:bg-[#166fe5] hover:shadow-blue-500/25';
    case 'Youtube':
      return 'bg-[#FF0000] text-white shadow-sm hover:scale-110 hover:bg-[#e60000] hover:shadow-red-500/25';
    case 'TikTok':
      return 'bg-slate-950 text-white shadow-sm hover:scale-110 border border-slate-800 hover:shadow-cyan-500/25';
    case 'Twitter':
      return 'bg-[#1DA1F2] text-white shadow-sm hover:scale-110 hover:bg-[#0c85d0] hover:shadow-sky-500/25';
    case 'Email':
      return 'bg-emerald-600 text-white shadow-sm hover:scale-110 hover:bg-emerald-700';
    case 'Phone':
      return 'bg-teal-600 text-white shadow-sm hover:scale-110 hover:bg-teal-700';
    default:
      return 'bg-amber-600 text-white shadow-sm hover:scale-110 hover:bg-amber-700';
  }
};

// Crisp SVG Circular Flags
const IndonesiaFlagIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 32 32" className={`${className} rounded-full overflow-hidden shadow-xs shrink-0 border border-slate-200/80`} aria-hidden="true">
    <rect width="32" height="16" fill="#E11D48" />
    <rect y="16" width="32" height="16" fill="#FFFFFF" />
  </svg>
);

const EnglishFlagIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 32 32" className={`${className} rounded-full overflow-hidden shadow-xs shrink-0 border border-slate-200/80`} aria-hidden="true">
    <rect width="32" height="32" fill="#012169" />
    <path d="M0,0 L32,32 M32,0 L0,32" stroke="#FFFFFF" strokeWidth="4" />
    <path d="M0,0 L32,32 M32,0 L0,32" stroke="#C8102E" strokeWidth="2" />
    <path d="M16,0 L16,32 M0,16 L32,16" stroke="#FFFFFF" strokeWidth="6" />
    <path d="M16,0 L16,32 M0,16 L32,16" stroke="#C8102E" strokeWidth="3.6" />
  </svg>
);

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dropdown States for desktop
  const [activeDropdown, setActiveDropdown] = useState<'profile' | 'heritage' | 'info' | 'lang' | null>(null);

  // Modal State for profile pages
  const [activeProfileModal, setActiveProfileModal] = useState<'vision' | 'structure' | 'profile' | null>(null);
  
  const { 
    language, 
    setLanguage, 
    setIsAdminOpen, 
    content, 
    socialLinks, 
    setActiveHeritageTab, 
    setActiveInfoTab 
  } = useData();

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (menu: 'profile' | 'heritage' | 'info' | 'lang') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string, tabAction?: () => void) => {
    e.preventDefault();
    if (tabAction) tabAction();

    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-scale-in border border-slate-100">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-2.5"
          aria-label="Tutup Modal"
        >
           <X className="w-5 h-5" />
        </button>
        <div className="p-8 sm:p-10">
           <div className="mb-6 border-b border-slate-100 pb-5">
              <span className="text-amber-600 uppercase tracking-widest text-xs font-bold block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Dinas Kebudayaan Kota Sawahlunto
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">{title}</h2>
           </div>
           <div className="text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base">
             {children}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-900/90 backdrop-blur-md shadow-lg py-2.5 border-b border-white/10' 
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          
          {/* LOGO & BRANDING */}
          <a 
            href="#hero" 
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-3 group shrink-0"
          >
            {content.branding.logoUrl ? (
              <img 
                src={content.branding.logoUrl} 
                alt="Logo" 
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base sm:text-lg tracking-wide text-white leading-tight drop-shadow-sm">
                {content.branding.siteName}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-slate-300 drop-shadow-xs">
                {content.branding.subTitle}
              </span>
            </div>
          </a>

          {/* DESKTOP CAPSULE NAVIGATION (Matching Portal Screenshot Style) */}
          <nav className="hidden lg:flex items-center bg-white text-slate-800 rounded-full px-5 py-2 shadow-md border border-slate-200/90 text-[13px] font-semibold">
            
            {/* 1. Beranda */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="px-3 py-1.5 rounded-full hover:text-amber-700 hover:bg-slate-50 transition-colors"
            >
              {language === 'en' ? 'Home' : 'Beranda'}
            </a>

            {/* 2. Profil Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('profile')}
              onMouseLeave={handleDropdownLeave}
            >
              <button 
                className="px-3 py-1.5 rounded-full hover:text-amber-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <span>{language === 'en' ? 'Profile' : 'Profil'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'profile' ? 'rotate-180 text-amber-600' : ''}`} />
              </button>

              {activeDropdown === 'profile' && (
                <div className="absolute top-full left-0 pt-2 w-56 animate-fade-in z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1 text-slate-700">
                    <button 
                      onClick={() => { setActiveProfileModal('vision'); setActiveDropdown(null); }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors flex items-center justify-between"
                    >
                      <span>{language === 'en' ? 'Vision & Mission' : 'Visi & Misi'}</span>
                      <span className="text-[10px] text-amber-600 bg-amber-100/60 px-1.5 py-0.5 rounded">Dinas</span>
                    </button>
                    <button 
                      onClick={() => { setActiveProfileModal('structure'); setActiveDropdown(null); }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      {language === 'en' ? 'Organization Structure' : 'Struktur Organisasi'}
                    </button>
                    <button 
                      onClick={() => { setActiveProfileModal('profile'); setActiveDropdown(null); }}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      {language === 'en' ? 'About Department' : 'Profil & Sejarah Dinas'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Warisan Budaya Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('heritage')}
              onMouseLeave={handleDropdownLeave}
            >
              <button 
                className="px-3 py-1.5 rounded-full hover:text-amber-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <span>{language === 'en' ? 'Heritage' : 'Warisan Budaya'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'heritage' ? 'rotate-180 text-amber-600' : ''}`} />
              </button>

              {activeDropdown === 'heritage' && (
                <div className="absolute top-full left-0 pt-2 w-64 animate-fade-in z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1 text-slate-700">
                    <button 
                      onClick={(e) => handleNavClick(e, '#heritage', () => setActiveHeritageTab('tangible'))}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      <div className="font-bold text-slate-900">{language === 'en' ? 'Tangible Heritage (WBD)' : 'Cagar Budaya Kebendaan'}</div>
                      <div className="text-[11px] text-slate-500 font-normal">Bangunan kolonial & situs tambang</div>
                    </button>
                    <button 
                      onClick={(e) => handleNavClick(e, '#heritage', () => setActiveHeritageTab('intangible'))}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      <div className="font-bold text-slate-900">{language === 'en' ? 'Intangible Heritage (WBTb)' : 'Warisan Budaya Takbenda'}</div>
                      <div className="text-[11px] text-slate-500 font-normal">Tradisi lisan, adat & seni pertunjukan</div>
                    </button>
                    <button 
                      onClick={(e) => handleNavClick(e, '#portals')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      <div className="font-bold text-slate-900">{language === 'en' ? 'UNESCO WTBOS Portal' : 'Portal Resmi UNESCO WTBOS'}</div>
                      <div className="text-[11px] text-slate-500 font-normal">Warisan Tambang Batubara Ombilin</div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Informasi & Publikasi Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('info')}
              onMouseLeave={handleDropdownLeave}
            >
              <button 
                className="px-3 py-1.5 rounded-full hover:text-amber-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <span>{language === 'en' ? 'Information' : 'Informasi'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === 'info' ? 'rotate-180 text-amber-600' : ''}`} />
              </button>

              {activeDropdown === 'info' && (
                <div className="absolute top-full left-0 pt-2 w-60 animate-fade-in z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1 text-slate-700">
                    <button 
                      onClick={(e) => handleNavClick(e, '#news')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors flex items-center gap-2"
                    >
                      <Newspaper className="w-4 h-4 text-amber-600" />
                      <span>{language === 'en' ? 'News & Agenda' : 'Berita & Agenda'}</span>
                    </button>
                    <button 
                      onClick={(e) => handleNavClick(e, '#info', () => setActiveInfoTab('tickets'))}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors flex items-center gap-2"
                    >
                      <Ticket className="w-4 h-4 text-amber-600" />
                      <span>{language === 'en' ? 'Tickets & Operating Hours' : 'Tiket & Jam Kunjungan'}</span>
                    </button>
                    <button 
                      onClick={(e) => handleNavClick(e, '#map')}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors flex items-center gap-2"
                    >
                      <Compass className="w-4 h-4 text-amber-600" />
                      <span>{language === 'en' ? 'Interactive Map' : 'Peta Interaktif Lokasi'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Separator Divider (Like in the screenshot) */}
            <div className="h-5 w-px bg-slate-300 mx-2" aria-hidden="true" />

            {/* 5. Lembaga Kebudayaan (Unit Kerja / Sanggar with Icon) */}
            <a
              href="#arts"
              onClick={(e) => handleNavClick(e, '#arts')}
              className="px-3 py-1.5 rounded-full hover:text-amber-700 hover:bg-amber-50/70 transition-colors flex items-center gap-1.5 font-bold text-slate-900"
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>{language === 'en' ? 'Institutions' : 'Lembaga Kebudayaan'}</span>
            </a>

            {/* 6. Museum (Matching Home Section) */}
            <a
              href="#attractions"
              onClick={(e) => handleNavClick(e, '#attractions')}
              className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 transition-colors flex items-center gap-1.5 font-bold"
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>{language === 'en' ? 'Museums' : 'Museum'}</span>
            </a>
          </nav>

          {/* RIGHT CONTROLS: LANGUAGE PILL + SOCIAL ICONS + LOGIN */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Language Selector Pill with Flag (Matching Screenshot Style) */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('lang')}
              onMouseLeave={handleDropdownLeave}
            >
              <button 
                onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
                className="bg-white text-slate-800 hover:text-amber-800 hover:bg-slate-50 transition-all rounded-full px-3.5 py-1.5 sm:py-2 text-xs font-bold shadow-md border border-slate-200 flex items-center gap-2"
                title={language === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
              >
                <span className="hidden sm:inline-block">
                  {language === 'en' ? 'English' : 'Indonesia'}
                </span>
                <span className="sm:hidden font-mono">
                  {language === 'en' ? 'EN' : 'ID'}
                </span>
                {language === 'en' ? (
                  <EnglishFlagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <IndonesiaFlagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Language Dropdown for instant selection */}
              {activeDropdown === 'lang' && (
                <div className="absolute top-full right-0 pt-2 w-44 animate-fade-in z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 space-y-1 text-slate-700">
                    <button 
                      onClick={() => { setLanguage('id'); setActiveDropdown(null); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        language === 'id' ? 'bg-amber-50 text-amber-950 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IndonesiaFlagIcon className="w-4 h-4" />
                        <span>Indonesia</span>
                      </div>
                      {language === 'id' && <span className="text-amber-600 text-[10px]">✓</span>}
                    </button>
                    <button 
                      onClick={() => { setLanguage('en'); setActiveDropdown(null); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        language === 'en' ? 'bg-amber-50 text-amber-950 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <EnglishFlagIcon className="w-4 h-4" />
                        <span>English</span>
                      </div>
                      {language === 'en' && <span className="text-amber-600 text-[10px]">✓</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Icons (Vibrant Modern Circular Badges) */}
            <div className="hidden xl:flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
              {socialLinks.map(link => {
                const Icon = getSocialIcon(link.platform);
                const colorClass = getSocialColorClass(link.platform);
                return (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${colorClass}`} 
                    title={link.platform}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>

            {/* Admin / Login Button */}
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-900 text-amber-400 transition-all border border-amber-400/30 shadow-md flex items-center gap-1.5 text-xs font-bold"
              title="Panel Admin Dinas"
              aria-label="Admin Login"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline-block">Admin</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="lg:hidden text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Buka Menu Navigasi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[64px] bg-slate-950/95 backdrop-blur-xl border-b border-white/10 p-5 shadow-2xl max-h-[calc(100vh-64px)] overflow-y-auto animate-fade-in space-y-6">
            
            {/* Quick Action Badges on Mobile */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="#arts"
                onClick={(e) => handleNavClick(e, '#arts')}
                className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Lembaga Budaya</span>
              </a>
              <a
                href="#attractions"
                onClick={(e) => handleNavClick(e, '#attractions')}
                className="p-3 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Museum</span>
              </a>
            </div>

            {/* Grouped Mobile Navigation Links */}
            <div className="space-y-4 text-white">
              
              {/* Home */}
              <a
                href="#hero"
                onClick={(e) => handleNavClick(e, '#hero')}
                className="block py-2 text-base font-bold border-b border-white/5 hover:text-amber-400"
              >
                {language === 'en' ? 'Home' : 'Beranda'}
              </a>

              {/* Profil Group */}
              <div className="space-y-2 border-b border-white/5 pb-3">
                <div className="text-xs uppercase tracking-wider font-bold text-amber-400/90">
                  {language === 'en' ? 'Profile' : 'Profil Organisasi'}
                </div>
                <div className="pl-3 space-y-2 text-sm text-slate-300">
                  <button 
                    onClick={() => { setActiveProfileModal('vision'); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-1 hover:text-white"
                  >
                    • {language === 'en' ? 'Vision & Mission' : 'Visi & Misi'}
                  </button>
                  <button 
                    onClick={() => { setActiveProfileModal('structure'); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-1 hover:text-white"
                  >
                    • {language === 'en' ? 'Structure' : 'Struktur Organisasi'}
                  </button>
                  <button 
                    onClick={() => { setActiveProfileModal('profile'); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-1 hover:text-white"
                  >
                    • {language === 'en' ? 'Department Profile' : 'Profil Dinas'}
                  </button>
                </div>
              </div>

              {/* Warisan Budaya Group */}
              <div className="space-y-2 border-b border-white/5 pb-3">
                <div className="text-xs uppercase tracking-wider font-bold text-amber-400/90">
                  {language === 'en' ? 'Cultural Heritage' : 'Warisan Budaya'}
                </div>
                <div className="pl-3 space-y-2 text-sm text-slate-300">
                  <button 
                    onClick={(e) => handleNavClick(e, '#heritage', () => setActiveHeritageTab('tangible'))}
                    className="block w-full text-left py-1 hover:text-white"
                  >
                    • {language === 'en' ? 'Tangible Heritage (WBD)' : 'Cagar Budaya Kebendaan (WBD)'}
                  </button>
                  <button 
                    onClick={(e) => handleNavClick(e, '#heritage', () => setActiveHeritageTab('intangible'))}
                    className="block w-full text-left py-1 hover:text-white"
                  >
                    • {language === 'en' ? 'Intangible Heritage (WBTb)' : 'Warisan Budaya Takbenda (WBTb)'}
                  </button>
                  <button 
                    onClick={(e) => handleNavClick(e, '#portals')}
                    className="block w-full text-left py-1 hover:text-white"
                  >
                    • {language === 'en' ? 'UNESCO WTBOS Portal' : 'Portal Resmi UNESCO WTBOS'}
                  </button>
                </div>
              </div>

              {/* Informasi & Berita Group */}
              <div className="space-y-2 border-b border-white/5 pb-3">
                <div className="text-xs uppercase tracking-wider font-bold text-amber-400/90">
                  {language === 'en' ? 'Information & Services' : 'Informasi & Layanan'}
                </div>
                <div className="pl-3 space-y-2 text-sm text-slate-300">
                  <button 
                    onClick={(e) => handleNavClick(e, '#news')}
                    className="block w-full text-left py-1 hover:text-white"
                  >
                    • {language === 'en' ? 'News & Announcements' : 'Berita & Agenda'}
                  </button>
                  <button 
                    onClick={(e) => handleNavClick(e, '#info', () => setActiveInfoTab('tickets'))}
                    className="block w-full text-left py-1 hover:text-white"
                  >
                    • {language === 'en' ? 'Tickets & Operating Hours' : 'Tiket & Jam Buka Museum'}
                  </button>
                  <button 
                    onClick={(e) => handleNavClick(e, '#map')}
                    className="block w-full text-left py-1 hover:text-white"
                  >
                    • {language === 'en' ? 'Interactive Map' : 'Peta Lokasi Interaktif'}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Footer: Social Media & Language */}
            <div className="pt-4 flex flex-col gap-4">
              <div className="flex items-center justify-center gap-3">
                {socialLinks.map(link => {
                  const Icon = getSocialIcon(link.platform);
                  const colorClass = getSocialColorClass(link.platform);
                  return (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${colorClass}`} 
                      title={link.platform}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setLanguage(language === 'en' ? 'id' : 'en'); setIsMobileMenuOpen(false); }}
                  className="flex-1 py-3 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  {language === 'en' ? (
                    <>
                      <span>Bahasa Indonesia</span>
                      <IndonesiaFlagIcon className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>English Language</span>
                      <EnglishFlagIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
                <button 
                  onClick={() => { setIsAdminOpen(true); setIsMobileMenuOpen(false); }}
                  className="py-3 px-4 rounded-xl bg-amber-500 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MODALS UNTUK PROFIL ORGANISASI */}
      {activeProfileModal === 'vision' && (
        <Modal title={language === 'en' ? 'Vision & Mission' : 'Visi & Misi'} onClose={() => setActiveProfileModal(null)}>
           <div className="space-y-6">
              <div className="bg-amber-50/80 p-6 rounded-2xl border-l-4 border-amber-500 text-slate-800">
                 <h4 className="font-bold text-base text-amber-900 mb-2 uppercase tracking-wider">{language === 'en' ? 'Vision' : 'Visi'}</h4>
                 <p className="italic text-base sm:text-lg">"{content.organization.vision[language]}"</p>
              </div>
              <div className="space-y-3">
                 <h4 className="font-bold text-base text-slate-900 uppercase tracking-wider">{language === 'en' ? 'Mission' : 'Misi'}</h4>
                 <p className="whitespace-pre-line text-slate-700 leading-relaxed">{content.organization.mission[language]}</p>
              </div>
           </div>
        </Modal>
      )}

      {activeProfileModal === 'structure' && (
        <Modal title={language === 'en' ? 'Organizational Structure' : 'Struktur Organisasi'} onClose={() => setActiveProfileModal(null)}>
           <div className="space-y-4">
             <img 
               src={content.organization.structureImageUrl} 
               alt="Struktur Organisasi" 
               className="w-full rounded-2xl shadow-sm border border-slate-100" 
             />
             <p className="text-xs text-slate-500 text-center">Bagan Struktur Organisasi Dinas Kebudayaan Kota Sawahlunto</p>
           </div>
        </Modal>
      )}

      {activeProfileModal === 'profile' && (
        <Modal title={language === 'en' ? 'Department Profile' : 'Profil Dinas'} onClose={() => setActiveProfileModal(null)}>
           <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700">{content.organization.profile[language]}</p>
        </Modal>
      )}
    </>
  );
};

export default Navbar;

