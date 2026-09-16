
import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Globe, Settings, Lock, Facebook, Instagram, Twitter, Youtube, Globe as WebIcon, Video, Mail, Phone, ExternalLink, ChevronDown, User } from 'lucide-react';
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

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dropdown States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHeritageOpen, setIsHeritageOpen] = useState(false);

  const [activeProfileModal, setActiveProfileModal] = useState<'vision' | 'structure' | 'profile' | null>(null);
  
  const { language, setLanguage, setIsAdminOpen, content, socialLinks, externalLinks, navItems, setActiveHeritageTab, setActiveInfoTab } = useData();

  useEffect(() => {
    const handleScroll = () => {
      // Threshold sedikit diperkecil agar transisi terasa lebih responsif saat mulai scroll
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string, id?: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      
      // Special handling for Tickets to switch Info section tab
      if (id === 'tickets') {
          setActiveInfoTab('tickets');
      }

      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    }
  };

  const handleHeritageClick = (e: React.MouseEvent<HTMLElement>, tab: 'tangible' | 'intangible') => {
    setActiveHeritageTab(tab);
    handleNavClick(e, '#heritage');
  };

  const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors bg-gray-100 rounded-full p-2">
           <X className="w-5 h-5" />
        </button>
        <div className="p-8">
           <div className="mb-6 border-b border-gray-100 pb-4">
              <span className="text-heritage-gold uppercase tracking-widest text-xs font-bold block mb-1">Dinas Kebudayaan</span>
              <h2 className="font-serif text-3xl font-bold text-heritage-dark">{title}</h2>
           </div>
           <div className="text-gray-700 leading-relaxed space-y-4">
             {children}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-heritage-dark shadow-2xl py-3 border-b border-white/5' 
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group" onClick={(e) => handleNavClick(e, '#hero', 'home')}>
            {content.branding.logoUrl ? (
              <img src={content.branding.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
            ) : (
              <MapPin className={`w-6 h-6 text-heritage-gold group-hover:scale-110 transition-transform`} />
            )}
            <div className="flex flex-col">
              <span className={`font-display font-bold text-xl tracking-wider text-white`}>
                {content.branding.siteName}
              </span>
              <span className={`text-[0.6rem] uppercase tracking-[0.2em] text-gray-300`}>
                {content.branding.subTitle}
              </span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              // Special handling for Heritage Dropdown
              if (item.id === 'heritage') {
                return (
                  <div key={item.id} className="relative group" onMouseEnter={() => setIsHeritageOpen(true)} onMouseLeave={() => setIsHeritageOpen(false)}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href, item.id)}
                      className={`text-sm font-sans tracking-widest uppercase hover:text-heritage-gold transition-colors flex items-center gap-1 text-white font-medium`}
                    >
                      {item.label[language]}
                      <ChevronDown className="w-3 h-3 text-heritage-gold" />
                    </a>
                    {/* Heritage Dropdown Content */}
                    <div className={`absolute top-full left-0 w-48 pt-2 transition-all duration-300 transform origin-top ${isHeritageOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                      <div className="bg-white rounded shadow-xl overflow-hidden py-1 border border-gray-100">
                          <button onClick={(e) => handleHeritageClick(e, 'tangible')} className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-heritage-dark hover:bg-heritage-gold hover:text-white transition-colors">
                            {language === 'en' ? 'Tangible Heritage' : 'Warisan Benda'}
                          </button>
                          <button onClick={(e) => handleHeritageClick(e, 'intangible')} className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-heritage-dark hover:bg-heritage-gold hover:text-white transition-colors">
                            {language === 'en' ? 'Intangible Heritage' : 'Warisan Tak Benda'}
                          </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.id)}
                  className={`text-sm font-sans tracking-widest uppercase hover:text-heritage-gold transition-colors text-white font-medium`}
                >
                  {item.label[language]}
                </a>
              );
            })}
            
            {/* Profil Dropdown */}
            <div className="relative group" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
               <button className={`text-sm font-sans tracking-widest uppercase hover:text-heritage-gold transition-colors flex items-center gap-1 text-white font-medium`}>
                  {language === 'en' ? 'Profile' : 'Profil'}
                  <ChevronDown className="w-3 h-3 text-heritage-gold" />
               </button>
               {/* Dropdown Content */}
               <div className={`absolute top-full left-0 w-48 pt-2 transition-all duration-300 transform origin-top ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                 <div className="bg-white rounded shadow-xl overflow-hidden py-1 border border-gray-100">
                    <button onClick={() => setActiveProfileModal('vision')} className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-heritage-dark hover:bg-heritage-gold hover:text-white transition-colors">
                      {language === 'en' ? 'Vision & Mission' : 'Visi & Misi'}
                    </button>
                    <button onClick={() => setActiveProfileModal('structure')} className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-heritage-dark hover:bg-heritage-gold hover:text-white transition-colors">
                      {language === 'en' ? 'Structure' : 'Struktur'}
                    </button>
                    <button onClick={() => setActiveProfileModal('profile')} className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-heritage-dark hover:bg-heritage-gold hover:text-white transition-colors">
                      {language === 'en' ? 'Dept. Profile' : 'Profil Dinas'}
                    </button>
                 </div>
               </div>
            </div>
            
            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
              {/* Social Icons */}
              <div className={`flex items-center gap-2 mr-2 text-white/70`}>
                 {socialLinks.map(link => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a key={link.id} href={link.url} target="_blank" className="hover:text-heritage-gold transition-colors" title={link.platform}>
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                 })}
              </div>

              <button 
                onClick={toggleLanguage}
                className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-heritage-gold transition-colors text-white`}
              >
                <Globe className="w-4 h-4 text-heritage-gold" />
                {language === 'en' ? 'ID' : 'EN'}
              </button>
              <button 
                onClick={() => setIsAdminOpen(true)}
                className={`text-xs font-bold uppercase tracking-widest hover:text-heritage-gold transition-colors text-white/70`}
                title="Admin Menu"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[60px] w-full bg-heritage-dark/98 backdrop-blur-xl p-6 md:hidden flex flex-col gap-6 shadow-2xl h-[calc(100vh-60px)] overflow-y-auto animate-fade-in">
            {navItems.map((item) => {
               if (item.id === 'heritage') {
                 return (
                    <div key={item.id} className="flex flex-col border-b border-white/5 pb-4">
                       <button onClick={(e) => handleNavClick(e, item.href, item.id)} className="text-white hover:text-heritage-gold font-sans text-xl font-bold text-left mb-3">
                          {item.label[language]}
                       </button>
                       <div className="pl-4 flex flex-col gap-4 border-l-2 border-heritage-gold ml-2">
                          <button onClick={(e) => { handleHeritageClick(e, 'tangible'); setIsMobileMenuOpen(false); }} className="text-gray-400 hover:text-white text-sm text-left uppercase tracking-widest font-bold">
                             {language === 'en' ? 'Tangible Heritage' : 'Warisan Benda'}
                          </button>
                          <button onClick={(e) => { handleHeritageClick(e, 'intangible'); setIsMobileMenuOpen(false); }} className="text-gray-400 hover:text-white text-sm text-left uppercase tracking-widest font-bold">
                             {language === 'en' ? 'Intangible Heritage' : 'Warisan Tak Benda'}
                          </button>
                       </div>
                    </div>
                 );
               }
               return (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-white hover:text-heritage-gold font-sans text-xl font-bold border-b border-white/5 pb-4"
                  onClick={(e) => handleNavClick(e, item.href, item.id)}
                >
                  {item.label[language]}
                </a>
              );
            })}
            
            {/* Mobile Profile Menu */}
            <div className="py-4 border-b border-white/5">
               <p className="text-heritage-gold uppercase text-xs font-black tracking-[0.2em] mb-4">{language === 'en' ? 'Organization Profile' : 'Profil Organisasi'}</p>
               <div className="flex flex-col gap-4 pl-2">
                <button onClick={() => { setActiveProfileModal('vision'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 py-1 hover:text-white text-sm uppercase tracking-widest font-bold">{language === 'en' ? 'Vision & Mission' : 'Visi & Misi'}</button>
                <button onClick={() => { setActiveProfileModal('structure'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 py-1 hover:text-white text-sm uppercase tracking-widest font-bold">{language === 'en' ? 'Structure' : 'Struktur'}</button>
                <button onClick={() => { setActiveProfileModal('profile'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 py-1 hover:text-white text-sm uppercase tracking-widest font-bold">{language === 'en' ? 'Dept. Profile' : 'Profil Dinas'}</button>
               </div>
            </div>

            <div className="mt-auto flex flex-col gap-6">
              <div className="flex gap-6 text-white/70 justify-center">
                 {socialLinks.map(link => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a key={link.id} href={link.url} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-heritage-gold hover:text-white transition-all">
                        <Icon className="w-6 h-6" />
                      </a>
                    );
                 })}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={toggleLanguage}
                  className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-xs"
                >
                  <Globe className="w-4 h-4 text-heritage-gold" /> {language === 'en' ? 'Bahasa Indonesia' : 'English Language'}
                </button>
                 <button 
                  onClick={() => { setIsAdminOpen(true); setIsMobileMenuOpen(false); }}
                  className="bg-heritage-gold text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      {activeProfileModal === 'vision' && (
        <Modal title={language === 'en' ? 'Vision & Mission' : 'Visi & Misi'} onClose={() => setActiveProfileModal(null)}>
           <div className="space-y-6">
              <div className="bg-heritage-gold/10 p-6 rounded-lg border-l-4 border-heritage-gold">
                 <h4 className="font-bold text-lg text-heritage-dark mb-2">{language === 'en' ? 'Vision' : 'Visi'}</h4>
                 <p className="italic text-lg">"{content.organization.vision[language]}"</p>
              </div>
              <div>
                 <h4 className="font-bold text-lg text-heritage-dark mb-2">{language === 'en' ? 'Mission' : 'Misi'}</h4>
                 <p className="whitespace-pre-line">{content.organization.mission[language]}</p>
              </div>
           </div>
        </Modal>
      )}

      {activeProfileModal === 'structure' && (
        <Modal title={language === 'en' ? 'Organizational Structure' : 'Struktur Organisasi'} onClose={() => setActiveProfileModal(null)}>
           <img src={content.organization.structureImageUrl} alt="Structure" className="w-full rounded-lg shadow-sm" />
        </Modal>
      )}

      {activeProfileModal === 'profile' && (
        <Modal title={language === 'en' ? 'Department Profile' : 'Profil Dinas'} onClose={() => setActiveProfileModal(null)}>
           <p className="whitespace-pre-line text-lg leading-relaxed">{content.organization.profile[language]}</p>
        </Modal>
      )}
    </>
  );
};

export default Navbar;
