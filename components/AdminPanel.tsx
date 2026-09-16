
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  X, Plus, Trash2, Edit2, Globe, Palette, Users, FileText, Music, Instagram, 
  Phone, Ticket, MapPin, Navigation, Layout, User as UserIcon, Key, 
  AlertTriangle, Save, PlusCircle, ArrowUp, ArrowDown, Link as LinkIcon, 
  Image as ImageIcon, CheckCircle, Info, Landmark, Calendar, Clock, Camera,
  GripVertical, Eye, EyeOff, Monitor, ChevronLeft, ChevronRight, RefreshCw,
  GripHorizontal, Maximize, ZoomIn, ZoomOut, Lock, Settings, Target, Hash,
  Images, LogOut, ArrowLeft, ArrowRight, Layers, Map as MapIcon, MousePointerClick
} from 'lucide-react';

// Import public components for preview
import Hero from './Hero';
import HeritageMain from './HeritageMain';
import ArtsSection from './ArtsSection';
import Attractions from './Attractions';
import NewsSection from './NewsSection';
import InfoSection from './InfoSection';
import Footer from './Footer';
import MuseumMap from './MuseumMap';
import ExternalPortals from './ExternalPortals';

const t = {
  adminPortal: { en: 'Admin Portal', id: 'Portal Admin' },
  cmsName: { en: 'Sawahlunto Heritage CMS', id: 'CMS Warisan Sawahlunto' },
  save: { en: 'Save Changes', id: 'Simpan Perubahan' },
  saved: { en: 'Saved Successfully', id: 'Berhasil Disimpan' },
  cancel: { en: 'Cancel', id: 'Batal' },
  logout: { en: 'Logout', id: 'Keluar' },
};

const AdminPanel: React.FC = () => {
  const { 
    language, isAdminOpen, setIsAdminOpen, isAuthenticated, login, loginWithEmail, logout,
    content, updateContent, updateTheme, 
    users, addUser, deleteUser,
    navItems, addNavItem, updateNavItem, deleteNavItem,
    news, addNews, updateNews, deleteNews,
    attractions, addAttraction, updateAttraction, deleteAttraction,
    addArtItem, updateArtItem, deleteArtItem,
    addTicket, updateTicket, deleteTicket,
    addHeroSlide, updateHeroSlide, deleteHeroSlide,
    museums, addMuseum, updateMuseum, deleteMuseum,
    socialLinks, addSocialLink, updateSocialLink, deleteSocialLink,
    externalLinks, addExternalLink, updateExternalLink, deleteExternalLink
  } = useData();

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('general');
  const [saveStatus, setSaveStatus] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(true);
  
  const [previewWidth, setPreviewWidth] = useState(window.innerWidth * 0.6);
  const [isResizing, setIsResizing] = useState(false);
  const [manualZoom, setManualZoom] = useState(0.95);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerSaveFeedback = (id: string) => {
    setSaveStatus({ ...saveStatus, [id]: true });
    setTimeout(() => setSaveStatus(prev => ({ ...prev, [id]: false })), 2000);
  };

  const handleCancel = () => {
    setIsAdminOpen(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier || !loginPassword) {
        setLoginError('Username dan password harus diisi.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        return;
    }
    
    const result = await loginWithEmail(loginIdentifier, loginPassword);
    if (!result.success) {
        if (result.error?.includes('auth/invalid-credential')) {
             setLoginError('Username atau kata sandi salah.');
        } else if (result.error?.includes('auth/operation-not-allowed')) {
             setLoginError('Login belum diaktifkan. Silakan aktifkan di Firebase Console > Authentication.');
        } else {
             setLoginError(`Gagal login: ${result.error}`);
        }
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
      setter(value);
      if (loginError) setLoginError('');
  };

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      if (newWidth > 320 && newWidth < containerRect.width * 0.85) setPreviewWidth(newWidth);
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const getScaleFactor = () => {
    const desktopBaseWidth = 1440;
    const padding = 40; 
    const autoScale = (previewWidth - padding) / desktopBaseWidth;
    return Math.min(autoScale, 1.2) * manualZoom;
  };

  if (!isAdminOpen) return null;

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex bg-white font-sans animate-fade-in">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative">
            <button onClick={() => setIsAdminOpen(false)} className="absolute top-8 left-8 text-gray-400 hover:text-black p-2 transition-colors rounded-full hover:bg-slate-100"><ArrowLeft className="w-5 h-5" /></button>

            <div className={`max-w-md w-full mx-auto transition-transform ${isShaking ? 'animate-shake' : ''}`}>
                {/* Logo */}
                <div className="flex items-center gap-3 mb-12">
                    {content.branding.logoUrl ? (
                        <img src={content.branding.logoUrl} alt="Logo" className="h-8 object-contain" />
                    ) : (
                        <Landmark className="w-8 h-8 text-heritage-gold" />
                    )}
                    <span className="font-display font-bold text-xl tracking-wider text-black">
                        {content.branding.siteName}
                    </span>
                </div>

                {/* Headings */}
                <h2 className="text-3xl font-bold text-black mb-2">Login Admin</h2>
                <p className="text-gray-500 text-sm mb-8">Masukkan username dan password admin Anda.</p>

                {/* Error Message */}
                {loginError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-red-600 mb-1">Akses Ditolak</h4>
                            <p className="text-xs text-red-500 leading-relaxed">{loginError}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleEmailLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            value={loginIdentifier}
                            onChange={(e) => handleInputChange(setLoginIdentifier, e.target.value)}
                            placeholder="Masukkan username"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-heritage-gold focus:ring-1 focus:ring-heritage-gold outline-none transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={loginPassword}
                                onChange={(e) => handleInputChange(setLoginPassword, e.target.value)}
                                placeholder="Masukkan password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-heritage-gold focus:ring-1 focus:ring-heritage-gold outline-none transition-all text-sm pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded group-hover:border-heritage-gold transition-colors">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="absolute inset-0 bg-heritage-gold scale-0 peer-checked:scale-100 transition-transform rounded-[3px]"></div>
                                <svg className="w-3 h-3 text-white absolute scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-xs text-gray-500 group-hover:text-black transition-colors">Ingat saya</span>
                        </label>
                        <a href="#" className="text-xs text-heritage-gold hover:text-black font-medium transition-colors">Lupa password?</a>
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-heritage-gold transition-all shadow-md hover:shadow-lg text-sm mt-2">
                        Login
                    </button>
                </form>
                
                <p className="text-center text-xs text-gray-400 mt-12">
                    Gunakan username <strong className="text-black">admin</strong> (atau sesuai konfigurasi) untuk menjadi Admin. Opsi Google Login telah dinonaktifkan sesuai permintaan.
                </p>
            </div>
        </div>

        {/* Right Side - Image/Pattern */}
        <div className="hidden lg:block lg:w-1/2 bg-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
            
            <div className="absolute bottom-16 left-16 right-16">
                <div className="w-12 h-1 bg-heritage-gold mb-6"></div>
                <h3 className="text-4xl font-serif text-white font-bold mb-4 leading-tight">Melestarikan Warisan,<br/>Membangun Masa Depan.</h3>
                <p className="text-gray-400 max-w-md leading-relaxed">Sistem Manajemen Konten terpadu untuk mengelola informasi, berita, dan koleksi warisan budaya dengan mudah dan aman.</p>
            </div>
        </div>
      </div>
    );
  }

  // --- COMPONENT HELPERS ---

  const SectionHeader = ({ icon: Icon, title, subtitle }: any) => (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-3">
        <div className="bg-white border border-slate-200 p-3 rounded-2xl text-heritage-gold shadow-sm"><Icon className="w-6 h-6" /></div>
        <h3 className="text-3xl font-serif font-bold text-black tracking-tight">{title}</h3>
      </div>
      <div className="flex items-center gap-3 pl-1">
        <div className="h-[2px] w-8 bg-heritage-gold/30 rounded-full"></div>
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] leading-none">{subtitle}</p>
      </div>
    </div>
  );

  const FormActions = ({ id, onCancel }: { id: string, onCancel?: () => void }) => (
    <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4 -mx-6 -mb-6 mt-6 flex items-center justify-end gap-3 z-10 rounded-b-2xl">
      <button onClick={onCancel || handleCancel} className="px-4 py-2 rounded-lg font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">{t.cancel[language]}</button>
      <button onClick={() => triggerSaveFeedback(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${saveStatus[id] ? 'bg-emerald-600 text-white cursor-default' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>{saveStatus[id] ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}{saveStatus[id] ? t.saved[language] : t.save[language]}</button>
    </div>
  );

  const sidebarLinks = [
    { id: 'general', label: 'Identitas', icon: Globe },
    { id: 'hero', label: 'Hero Slider', icon: Layers },
    { id: 'heritage', label: 'Warisan', icon: FileText },
    { id: 'map', label: 'Museum & Tiket', icon: MapIcon },
    { id: 'portals', label: 'Portal Luar', icon: MousePointerClick },
    { id: 'arts', label: 'Kesenian', icon: Music },
    { id: 'news', label: 'Berita', icon: Instagram },
    { id: 'destinations', label: 'Destinasi', icon: MapPin },
    { id: 'tickets', label: 'Operasional', icon: Ticket },
    { id: 'theme', label: 'Tampilan', icon: Palette },
    { id: 'organization', label: 'Organisasi', icon: Users },
    { id: 'users', label: 'Daftar Admin', icon: Key },
    { id: 'contact', label: 'Kontak', icon: Phone },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#FBFBFC] font-sans overflow-hidden" ref={containerRef}>
      
      {/* Sidebar - Enterprise Dark */}
      <div className="w-56 bg-slate-950 flex flex-col h-full z-20 shadow-xl text-slate-300">
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-heritage-gold/20 text-heritage-gold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-white tracking-wide">DASHBOARD</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Management Suite</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {sidebarLinks.map((link) => (
            <button 
              key={link.id} 
              onClick={() => setActiveSection(link.id)} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSection === link.id 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <link.icon className={`w-4 h-4 ${activeSection === link.id ? 'text-heritage-gold' : 'opacity-70'}`} />
              {link.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md font-medium text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsAdminOpen(false)} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
             <h1 className="font-semibold text-lg text-slate-900 capitalize">{activeSection.replace('-', ' ')}</h1>
          </div>
          <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all border ${showPreview ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
            {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} Preview
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
            <div className="max-w-4xl mx-auto pb-20">
              
              {/* GENERAL BRANDING */}
              {activeSection === 'general' && (
                <div className="space-y-8 animate-fade-in">
                  <SectionHeader icon={Globe} title="Identitas Brand" subtitle="Aset Visual Utama" />
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="input-label">Nama Situs</label>
                        <input type="text" value={content.branding.siteName} onChange={(e) => updateContent('branding', 'siteName', e.target.value)} className="input-field" />
                      </div>
                      <div className="space-y-2">
                        <label className="input-label">Slogan Platform</label>
                        <input type="text" value={content.branding.subTitle} onChange={(e) => updateContent('branding', 'subTitle', e.target.value)} className="input-field" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-slate-100">
                        <label className="input-label">Logo Korporat (URL)</label>
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                           <input type="text" value={content.branding.logoUrl} onChange={(e) => updateContent('branding', 'logoUrl', e.target.value)} className="input-field flex-1" placeholder="https://..." />
                           <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {content.branding.logoUrl ? <img src={content.branding.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain p-2" /> : <ImageIcon className="w-6 h-6 text-slate-400" />}
                           </div>
                        </div>
                    </div>
                    <FormActions id="branding" />
                  </div>
                </div>
              )}

              {/* HERO SLIDER */}
              {activeSection === 'hero' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="flex justify-between items-end border-b border-slate-200/60 pb-10">
                      <SectionHeader icon={Layers} title="Hero Slider" subtitle="Halaman Depan" />
                      <button onClick={() => addHeroSlide({ id: Date.now().toString(), subtitle: {en:'New Slide', id:'Slide Baru'}, title: {en:'Title', id:'Judul'}, description: {en:'',id:''}, cta: {en:'Explore', id:'Jelajahi'}, bgImageUrl: 'https://picsum.photos/1920/1080' })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Slide</button>
                   </div>
                   <div className="grid gap-8">
                     {content.hero.slides.map((slide, idx) => (
                       <div key={slide.id} className="bg-white border border-slate-200 rounded-2xl p-6 relative group hover:shadow-lg transition-all">
                          <button onClick={() => deleteHeroSlide(slide.id)} className="absolute top-8 right-8 p-3 bg-white border border-slate-100 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                             <div className="space-y-4">
                               <div className="h-40 rounded-xl overflow-hidden border-4 border-slate-50 shadow-sm relative">
                                  <img src={slide.bgImageUrl} className="w-full h-full object-cover" />
                                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-[9px] rounded font-bold">Slide {idx + 1}</div>
                               </div>
                               <div className="space-y-2">
                                  <label className="input-label">Background URL</label>
                                  <input type="text" value={slide.bgImageUrl} onChange={(e) => updateHeroSlide(slide.id, {...slide, bgImageUrl: e.target.value})} className="input-field text-xs font-mono" />
                               </div>
                             </div>
                             <div className="space-y-4">
                                <div className="space-y-2">
                                   <label className="input-label">Title (ID)</label>
                                   <input type="text" value={slide.title.id} onChange={(e) => updateHeroSlide(slide.id, {...slide, title: {...slide.title, id: e.target.value}})} className="input-field font-bold" />
                                </div>
                                <div className="space-y-2">
                                   <label className="input-label">Description (ID)</label>
                                   <textarea value={slide.description.id} onChange={(e) => updateHeroSlide(slide.id, {...slide, description: {...slide.description, id: e.target.value}})} className="input-field min-h-[80px]" />
                                </div>
                             </div>
                          </div>
                          <FormActions id={`hero-${slide.id}`} />
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {/* HERITAGE */}
              {activeSection === 'heritage' && (
                <div className="space-y-12 animate-fade-in">
                  <SectionHeader icon={FileText} title="Konten Warisan" subtitle="Sejarah & Budaya" />
                  
                  {/* Tangible */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
                     <h4 className="font-serif text-xl font-bold mb-6 text-heritage-dark border-b border-slate-100 pb-4">Warisan Benda (Sejarah)</h4>
                     <div className="grid gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="input-label">Judul Seksi (ID)</label>
                              <input type="text" value={content.history.title.id} onChange={(e) => updateContent('history', 'title', e.target.value, 'id')} className="input-field" />
                           </div>
                           <div className="space-y-2">
                              <label className="input-label">Image URL</label>
                              <input type="text" value={content.history.imageUrl} onChange={(e) => updateContent('history', 'imageUrl', e.target.value)} className="input-field" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="input-label">Link Web URL</label>
                           <input type="text" value={content.history.linkUrl} onChange={(e) => updateContent('history', 'linkUrl', e.target.value)} className="input-field" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                           <label className="input-label">Deskripsi Paragraf 1 (ID)</label>
                           <textarea value={content.history.description1.id} onChange={(e) => updateContent('history', 'description1', e.target.value, 'id')} className="input-field min-h-[100px]" />
                        </div>
                        <div className="space-y-2">
                           <label className="input-label">Deskripsi Paragraf 2 (ID)</label>
                           <textarea value={content.history.description2.id} onChange={(e) => updateContent('history', 'description2', e.target.value, 'id')} className="input-field min-h-[100px]" />
                        </div>
                     </div>
                     <FormActions id="history-save" />
                  </div>

                  {/* Intangible */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                     <h4 className="font-serif text-xl font-bold mb-6 text-heritage-dark border-b border-slate-100 pb-4">Warisan Tak Benda (Budaya)</h4>
                     <div className="grid gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="input-label">Judul Seksi (ID)</label>
                              <input type="text" value={content.culture.title.id} onChange={(e) => updateContent('culture', 'title', e.target.value, 'id')} className="input-field" />
                           </div>
                           <div className="space-y-2">
                              <label className="input-label">Image URL</label>
                              <input type="text" value={content.culture.imageUrl} onChange={(e) => updateContent('culture', 'imageUrl', e.target.value)} className="input-field" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="input-label">Link Web URL</label>
                           <input type="text" value={content.culture.linkUrl} onChange={(e) => updateContent('culture', 'linkUrl', e.target.value)} className="input-field" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                           <label className="input-label">Deskripsi (ID)</label>
                           <textarea value={content.culture.description.id} onChange={(e) => updateContent('culture', 'description', e.target.value, 'id')} className="input-field min-h-[100px]" />
                        </div>
                     </div>
                     <FormActions id="culture-save" />
                  </div>
                </div>
              )}

              {/* MUSEUM MAP */}
              {activeSection === 'map' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="flex justify-between items-end border-b border-slate-200/60 pb-10">
                      <SectionHeader icon={MapIcon} title="Museum & Tiket" subtitle="Manajemen Museum & Harga Tiket" />
                      <button onClick={() => addMuseum({ id: Date.now().toString(), name: {en:'New Location', id:'Lokasi Baru'}, description: {en:'',id:''}, embedQuery: '', streetViewUrl: '', ticketPrices: [] })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Museum</button>
                   </div>
                   <div className="grid gap-6">
                      {museums.map(m => (
                         <div key={m.id} className="bg-white border border-slate-200 rounded-2xl p-6 relative hover:shadow-lg transition-all">
                             <button onClick={() => deleteMuseum(m.id)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                             <div className="space-y-6">
                                <div className="space-y-2 pr-10">
                                   <label className="input-label">Nama Museum (ID)</label>
                                   <input type="text" value={m.name.id} onChange={(e) => updateMuseum(m.id, {...m, name: {...m.name, id: e.target.value}})} className="input-field font-bold text-lg" />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                      <label className="input-label">Google Maps Query</label>
                                      <input type="text" value={m.embedQuery} onChange={(e) => updateMuseum(m.id, {...m, embedQuery: e.target.value})} className="input-field font-mono text-xs" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="input-label">Street View URL (Embed)</label>
                                      <input type="text" value={m.streetViewUrl || ''} onChange={(e) => updateMuseum(m.id, {...m, streetViewUrl: e.target.value})} className="input-field font-mono text-xs" />
                                   </div>
                                </div>
                                <div className="space-y-2">
                                   <label className="input-label">Deskripsi Singkat (ID)</label>
                                   <textarea value={m.description.id} onChange={(e) => updateMuseum(m.id, {...m, description: {...m.description, id: e.target.value}})} className="input-field h-20" />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                      <label className="input-label">Nama Kontak (Opsional)</label>
                                      <input type="text" value={m.contactName || ''} onChange={(e) => updateMuseum(m.id, {...m, contactName: e.target.value})} className="input-field text-sm" placeholder="Contoh: Bapak Budi" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="input-label">Nomor Telepon (Opsional)</label>
                                      <input type="text" value={m.contactPhone || ''} onChange={(e) => updateMuseum(m.id, {...m, contactPhone: e.target.value})} className="input-field text-sm" placeholder="Contoh: +62 812 3456 7890" />
                                   </div>
                                </div>
                                <div className="space-y-2">
                                   <label className="input-label flex items-center gap-2"><Target className="w-3 h-3 text-heritage-gold" /> Visi Museum (ID)</label>
                                   <textarea value={m.vision?.id || ''} onChange={(e) => updateMuseum(m.id, {...m, vision: {...(m.vision || {en: '', id: ''}), id: e.target.value}})} className="input-field h-20 italic font-serif" placeholder="Visi museum..." />
                                </div>
                                <div className="space-y-2">
                                   <label className="input-label">Misi Museum (ID)</label>
                                   <textarea value={m.mission?.id || ''} onChange={(e) => updateMuseum(m.id, {...m, mission: {...(m.mission || {en: '', id: ''}), id: e.target.value}})} className="input-field h-24" placeholder="Misi museum..." />
                                </div>
                                
                                {/* Ticket Prices Section */}
                                <div className="pt-6 border-t border-slate-100">
                                   <div className="flex justify-between items-center mb-4">
                                      <h5 className="font-bold text-sm text-black">Harga Tiket Berdasarkan Usia/Kategori</h5>
                                      <button onClick={() => {
                                         const newTicket = { id: Date.now().toString(), category: {en:'New Category', id:'Kategori Baru'}, price: 0 };
                                         updateMuseum(m.id, {...m, ticketPrices: [...(m.ticketPrices || []), newTicket]});
                                      }} className="text-[10px] font-bold uppercase tracking-widest text-heritage-gold hover:text-heritage-gold/80 flex items-center gap-1"><Plus className="w-3 h-3" /> Tambah Kategori</button>
                                   </div>
                                   <div className="space-y-3">
                                      {(m.ticketPrices || []).map((tp, idx) => (
                                         <div key={tp.id} className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="flex-1 space-y-1">
                                               <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Kategori Usia (ID)</label>
                                               <input type="text" value={tp.category.id} onChange={(e) => {
                                                  const newPrices = [...m.ticketPrices];
                                                  newPrices[idx].category.id = e.target.value;
                                                  updateMuseum(m.id, {...m, ticketPrices: newPrices});
                                               }} className="input-field py-2 text-sm" placeholder="Contoh: Dewasa (>12 tahun)" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                               <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Harga (Rp)</label>
                                               <input type="number" value={tp.price} onChange={(e) => {
                                                  const newPrices = [...m.ticketPrices];
                                                  newPrices[idx].price = parseInt(e.target.value) || 0;
                                                  updateMuseum(m.id, {...m, ticketPrices: newPrices});
                                               }} className="input-field py-2 text-sm" />
                                            </div>
                                            <button onClick={() => {
                                               const newPrices = m.ticketPrices.filter(p => p.id !== tp.id);
                                               updateMuseum(m.id, {...m, ticketPrices: newPrices});
                                            }} className="p-2 text-gray-400 hover:text-red-500 mt-4"><Trash2 className="w-4 h-4" /></button>
                                         </div>
                                      ))}
                                      {(!m.ticketPrices || m.ticketPrices.length === 0) && (
                                         <p className="text-xs text-gray-600 italic">Belum ada harga tiket yang ditambahkan.</p>
                                      )}
                                   </div>
                                </div>
                             </div>
                             <FormActions id={`map-${m.id}`} />
                         </div>
                      ))}
                   </div>
                </div>
              )}

              {/* EXTERNAL PORTALS */}
              {activeSection === 'portals' && (
                 <div className="space-y-12 animate-fade-in">
                   <div className="flex justify-between items-end border-b border-slate-200/60 pb-10">
                      <SectionHeader icon={MousePointerClick} title="Portal Eksternal" subtitle="Link & Referensi" />
                      <button onClick={() => addExternalLink({ id: Date.now().toString(), title: {en:'New Link', id:'Link Baru'}, description: {en:'',id:''}, url: '#', imageUrl: 'https://picsum.photos/600/300', buttonText: {en:'Visit', id:'Kunjungi'} })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Portal</button>
                   </div>
                   <div className="grid gap-8">
                      {externalLinks.map(link => (
                         <div key={link.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all relative">
                            <button onClick={() => deleteExternalLink(link.id)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 z-10"><Trash2 className="w-4 h-4" /></button>
                            <div className="w-full md:w-48 space-y-3">
                               <div className="h-32 rounded-2xl overflow-hidden border-2 border-slate-100"><img src={link.imageUrl} className="w-full h-full object-cover" /></div>
                               <input type="text" value={link.imageUrl} onChange={(e) => updateExternalLink(link.id, {...link, imageUrl: e.target.value})} className="input-field text-[10px]" placeholder="Image URL" />
                            </div>
                            <div className="flex-1 space-y-4">
                               <div className="space-y-2">
                                  <label className="input-label">Judul (ID)</label>
                                  <input type="text" value={link.title.id} onChange={(e) => updateExternalLink(link.id, {...link, title: {...link.title, id: e.target.value}})} className="input-field font-bold" />
                               </div>
                               <div className="space-y-2">
                                  <label className="input-label">Deskripsi (ID)</label>
                                  <textarea value={link.description.id} onChange={(e) => updateExternalLink(link.id, {...link, description: {...link.description, id: e.target.value}})} className="input-field h-20" />
                               </div>
                               <div className="flex gap-4">
                                  <div className="flex-1 space-y-2">
                                     <label className="input-label">Target URL</label>
                                     <input type="text" value={link.url} onChange={(e) => updateExternalLink(link.id, {...link, url: e.target.value})} className="input-field font-mono text-xs" />
                                  </div>
                                  <div className="w-1/3 space-y-2">
                                     <label className="input-label">Label Tombol (ID)</label>
                                     <input type="text" value={link.buttonText.id} onChange={(e) => updateExternalLink(link.id, {...link, buttonText: {...link.buttonText, id: e.target.value}})} className="input-field" />
                                  </div>
                               </div>
                               <FormActions id={`portal-${link.id}`} />
                            </div>
                         </div>
                      ))}
                   </div>
                 </div>
              )}

              {/* ARTS */}
              {activeSection === 'arts' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="flex justify-between items-end border-b border-slate-200/60 pb-10">
                      <SectionHeader icon={Music} title="Seni & Pertunjukan" subtitle="Aset Budaya" />
                      <button onClick={() => addArtItem({ id: Date.now().toString(), title: {en:'New Performance', id:'Seni Baru'}, description: {en:'',id:''}, imageUrl: 'https://picsum.photos/400/300' })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Aset</button>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-8">
                      {content.arts.items.map(art => (
                        <div key={art.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-lg transition-all duration-500 relative">
                           <div className="absolute top-6 right-6">
                              <button onClick={() => deleteArtItem(art.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           
                           <div className="w-full md:w-40 h-40 rounded-xl overflow-hidden shrink-0 border-4 border-[#FBFBFC] shadow-sm group">
                              <img src={art.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                           </div>
                           <div className="flex-1 space-y-6">
                              <div className="pr-10">
                                  <label className="input-label mb-2">Nama Kesenian (ID)</label>
                                  <input type="text" value={art.title.id} onChange={(e) => updateArtItem(art.id, {...art, title: {...art.title, id: e.target.value}})} className="bg-transparent font-serif font-bold text-xl text-black focus:outline-none w-full border-b border-transparent focus:border-heritage-gold/50 transition-colors pb-1" placeholder="Nama Kesenian..." />
                              </div>
                              <div className="space-y-2">
                                  <label className="input-label">Deskripsi (ID)</label>
                                  <textarea value={art.description.id} onChange={(e) => updateArtItem(art.id, {...art, description: {...art.description, id: e.target.value}})} className="input-field text-sm min-h-[100px]" placeholder="Jelaskan tentang aset ini..." />
                              </div>
                              <div className="space-y-2">
                                  <label className="input-label">URL Gambar</label>
                                  <input type="text" value={art.imageUrl} onChange={(e) => updateArtItem(art.id, {...art, imageUrl: e.target.value})} className="input-field font-mono text-xs" placeholder="https://..." />
                              </div>
                              <FormActions id={`art-${art.id}`} />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* NEWS */}
              {activeSection === 'news' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="flex justify-between items-end border-b border-slate-200/60 pb-10">
                      <SectionHeader icon={Instagram} title="Media & Artikel" subtitle="Distribusi Konten" />
                      <button onClick={() => addNews({ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], title: {en:'New Article', id:'Berita Baru'}, summary: {en:'',id:''}, content: {en:'',id:''}, imageUrl: 'https://picsum.photos/400/300', imageUrls: [] })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Artikel</button>
                   </div>
                   
                   <div className="space-y-8">
                      {news.map(item => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 hover:shadow-lg transition-all duration-500 relative group/card">
                           <div className="absolute top-8 right-8 z-10">
                             <button onClick={() => deleteNews(item.id)} className="p-3 bg-white border border-slate-100 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                           </div>

                           <div className="flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0 border-4 border-[#FBFBFC] shadow-sm">
                                 <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 space-y-6">
                                 <div className="space-y-2">
                                    <label className="input-label">Judul Artikel (ID)</label>
                                    <input type="text" value={item.title.id} onChange={(e) => updateNews(item.id, {...item, title: {...item.title, id: e.target.value}})} className="input-field font-serif font-bold text-xl !bg-transparent !border-0 !p-0 focus:ring-0 shadow-none" placeholder="Tulis judul disini..." />
                                 </div>
                                 <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="input-label">Tanggal</label>
                                       <div className="relative">
                                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                                          <input type="date" value={item.date} onChange={(e) => updateNews(item.id, {...item, date: e.target.value})} className="input-field pl-11 py-3 text-xs" />
                                       </div>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="input-label">URL Gambar</label>
                                       <input type="text" value={item.imageUrl} onChange={(e) => updateNews(item.id, {...item, imageUrl: e.target.value})} className="input-field font-mono text-[10px]" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-6 pt-8 border-t border-slate-50">
                              <div className="space-y-2">
                                 <label className="input-label">Ringkasan</label>
                                 <textarea value={item.summary.id} onChange={(e) => updateNews(item.id, {...item, summary: {...item.summary, id: e.target.value}})} className="input-field text-sm min-h-[80px]" />
                              </div>
                              <div className="space-y-2">
                                 <label className="input-label">Konten Lengkap</label>
                                 <textarea value={item.content.id} onChange={(e) => updateNews(item.id, {...item, content: {...item.content, id: e.target.value}})} className="input-field text-sm min-h-[150px]" />
                              </div>
                           </div>
                           <FormActions id={`news-${item.id}`} />
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* DESTINATIONS (Attractions) */}
              {activeSection === 'destinations' && (
                 <div className="space-y-12 animate-fade-in">
                    <div className="flex justify-between items-end border-b border-slate-200/60 pb-10">
                       <SectionHeader icon={MapPin} title="Destinasi Wisata" subtitle="Objek Unggulan" />
                       <button onClick={() => addAttraction({ id: Date.now().toString(), title: {en:'New Spot', id:'Wisata Baru'}, description: {en:'',id:''}, imageUrl: 'https://picsum.photos/600/400', category: 'History' })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Destinasi</button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       {attractions.map(att => (
                          <div key={att.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all relative">
                             <button onClick={() => deleteAttraction(att.id)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 z-10"><Trash2 className="w-4 h-4" /></button>
                             <div className="space-y-6">
                                <div className="h-48 rounded-2xl overflow-hidden border-2 border-slate-50 relative group">
                                   <img src={att.imageUrl} className="w-full h-full object-cover" />
                                   <div className="absolute inset-x-0 bottom-0 bg-white/90 p-2">
                                      <input type="text" value={att.imageUrl} onChange={(e) => updateAttraction(att.id, {...att, imageUrl: e.target.value})} className="w-full bg-transparent text-[10px] font-mono border-none focus:ring-0 p-0 text-center" placeholder="Image URL" />
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <div className="flex gap-4">
                                      <div className="flex-1 space-y-2">
                                         <label className="input-label">Nama Destinasi (ID)</label>
                                         <input type="text" value={att.title.id} onChange={(e) => updateAttraction(att.id, {...att, title: {...att.title, id: e.target.value}})} className="input-field font-bold" />
                                      </div>
                                      <div className="w-1/3 space-y-2">
                                         <label className="input-label">Kategori</label>
                                         <select value={att.category} onChange={(e) => updateAttraction(att.id, {...att, category: e.target.value as any})} className="input-field">
                                            <option value="History">Sejarah</option>
                                            <option value="Nature">Alam</option>
                                            <option value="Culture">Budaya</option>
                                         </select>
                                      </div>
                                   </div>
                                   <div className="space-y-2">
                                      <label className="input-label">Deskripsi (ID)</label>
                                      <textarea value={att.description.id} onChange={(e) => updateAttraction(att.id, {...att, description: {...att.description, id: e.target.value}})} className="input-field h-24" />
                                   </div>
                                </div>
                                <FormActions id={`att-${att.id}`} />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {/* TICKETS */}
              {activeSection === 'tickets' && (
                 <div className="space-y-12 animate-fade-in">
                    <SectionHeader icon={Ticket} title="Tiket & Operasional" subtitle="Harga & Jam Buka" />
                    
                    {/* Opening Hours */}
                     <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                       <h4 className="font-serif text-lg font-bold mb-6">Jam Operasional</h4>
                       <div className="space-y-2">
                          <label className="input-label">Teks Jam Buka (ID)</label>
                          <input type="text" value={content.tickets.openingHours.id} onChange={(e) => updateContent('tickets', 'openingHours', e.target.value, 'id')} className="input-field text-lg" />
                       </div>
                       <FormActions id="hours-save" />
                    </div>
                 </div>
              )}

              {/* THEME */}
              {activeSection === 'theme' && (
                <div className="space-y-12 animate-fade-in">
                  <SectionHeader icon={Palette} title="Estetika Sistem" subtitle="Palet Warna & UI" />
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(content.theme).map(([key, value]) => (
                          <div key={key} className="space-y-4 group">
                            <label className="input-label capitalize flex items-center gap-2 text-gray-600">{key} Color</label>
                            <div className="flex gap-4 items-center p-4 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-heritage-gold/30 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                <div className="relative shrink-0">
                                    <input type="color" value={value} onChange={(e) => updateTheme({...content.theme, [key]: e.target.value})} className="w-12 h-12 rounded-lg cursor-pointer border-none opacity-0 absolute inset-0 z-10" />
                                    <div className="w-12 h-12 rounded-lg border-2 border-white shadow-sm" style={{ backgroundColor: value }}></div>
                                </div>
                                <div className="flex-1 space-y-1">
                                   <input type="text" value={value} onChange={(e) => updateTheme({...content.theme, [key]: e.target.value})} className="w-full bg-transparent font-mono font-bold text-sm text-slate-900 focus:outline-none uppercase" />
                                   <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Hex Code</p>
                                </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <FormActions id="theme" />
                  </div>
                </div>
              )}

              {/* ORGANIZATION */}
              {activeSection === 'organization' && (
                <div className="space-y-12 animate-fade-in">
                   <SectionHeader icon={Users} title="Profil Institusi" subtitle="Visi & Tata Kelola" />
                   <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8">
                      <div className="space-y-10">
                         <div className="space-y-4">
                            <label className="input-label flex items-center gap-3"><Target className="w-4 h-4 text-heritage-gold" /> Visi Institusi</label>
                            <textarea value={content.organization.vision.id} onChange={(e) => updateContent('organization', 'vision', e.target.value, 'id')} className="input-field italic font-serif text-xl py-8 bg-[#FBFBFC] border-slate-100 focus:bg-white leading-relaxed text-center" />
                         </div>
                         <div className="h-[1px] bg-slate-100 w-1/2 mx-auto"></div>
                         <div className="space-y-4">
                            <label className="input-label">Misi & Tujuan</label>
                            <textarea value={content.organization.mission.id} onChange={(e) => updateContent('organization', 'mission', e.target.value, 'id')} className="input-field min-h-[160px] leading-relaxed p-6" />
                         </div>
                         <div className="h-[1px] bg-slate-100 w-full"></div>
                         <div className="space-y-4">
                            <label className="input-label">Struktur Eksekutif (URL Gambar)</label>
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                               <input type="text" value={content.organization.structureImageUrl} onChange={(e) => updateContent('organization', 'structureImageUrl', e.target.value)} className="input-field flex-1" placeholder="https://..." />
                               <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                  {content.organization.structureImageUrl ? <img src={content.organization.structureImageUrl} className="max-w-full max-h-full object-contain p-2" /> : <Users className="w-6 h-6 text-slate-400" />}
                               </div>
                            </div>
                         </div>
                         <div className="space-y-4">
                             <label className="input-label">Profil Dinas Lengkap (Untuk Modal)</label>
                             <textarea value={content.organization.profile.id} onChange={(e) => updateContent('organization', 'profile', e.target.value, 'id')} className="input-field min-h-[120px]" />
                         </div>
                      </div>
                      <FormActions id="org-save" />
                   </div>
                </div>
              )}

              {/* USERS */}
              {activeSection === 'users' && (
                <div className="space-y-12 animate-fade-in">
                  <SectionHeader icon={Key} title="Daftar Admin" subtitle="Manajemen Akses Pengguna" />
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8">
                    <p className="text-sm text-gray-600 mb-6">
                      Daftar pengguna yang memiliki akses ke panel admin. Pengguna baru dapat ditambahkan dengan memasukkan username dan password.
                    </p>

                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-heritage-gold/10 rounded-full flex items-center justify-center text-heritage-gold">
                              <UserIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900">{user.username}</p>
                              <p className="text-xs text-slate-500 uppercase tracking-wider">{user.role}</p>
                            </div>
                          </div>
                          {user.username !== 'admin' && (
                            <button 
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <h4 className="font-bold text-sm text-slate-900 mb-4 uppercase tracking-widest">Tambah Admin Baru</h4>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const usernameInput = form.elements.namedItem('username') as HTMLInputElement;
                        const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
                        const roleSelect = form.elements.namedItem('role') as HTMLSelectElement;
                        if (usernameInput.value && passwordInput.value) {
                          addUser({
                            id: Date.now().toString(),
                            email: '',
                            role: roleSelect.value as 'admin' | 'editor',
                            username: usernameInput.value,
                            password: passwordInput.value,
                            fullName: ''
                          });
                          form.reset();
                        }
                      }} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                          <label className="input-label">Username</label>
                          <input type="text" name="username" required className="input-field" placeholder="username" />
                        </div>
                        <div className="flex-1">
                          <label className="input-label">Password</label>
                          <input type="password" name="password" required className="input-field" placeholder="password" />
                        </div>
                        <div className="w-32">
                          <label className="input-label">Peran</label>
                          <select name="role" className="input-field bg-white">
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                          </select>
                        </div>
                        <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-heritage-gold transition-colors h-[42px] flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Tambah
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT */}
              {activeSection === 'contact' && (
                 <div className="space-y-12 animate-fade-in">
                    <SectionHeader icon={Phone} title="Kontak & Sosial" subtitle="Informasi Hubungi Kami" />
                    
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
                        <h4 className="font-serif text-lg font-bold mb-6">Informasi Dasar</h4>
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <label className="input-label">Alamat Lengkap</label>
                                <input type="text" value={content.contact.address} onChange={(e) => updateContent('contact', 'address', e.target.value)} className="input-field" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="input-label">Telepon</label>
                                    <input type="text" value={content.contact.phone} onChange={(e) => updateContent('contact', 'phone', e.target.value)} className="input-field" />
                                </div>
                                <div className="space-y-2">
                                    <label className="input-label">Email</label>
                                    <input type="text" value={content.contact.email} onChange={(e) => updateContent('contact', 'email', e.target.value)} className="input-field" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="input-label">Google Maps Embed URL</label>
                                <input type="text" value={content.contact.mapEmbedUrl} onChange={(e) => updateContent('contact', 'mapEmbedUrl', e.target.value)} className="input-field font-mono text-xs" />
                            </div>
                        </div>
                        <FormActions id="contact-info-save" />
                    </div>

                    <div className="flex justify-between items-end border-b border-slate-200/60 pb-8 mb-8">
                       <h4 className="font-serif text-lg font-bold">Tautan Sosial Media</h4>
                       <button onClick={() => addSocialLink({ id: Date.now().toString(), platform: 'Instagram', url: '#' })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Akun</button>
                    </div>

                    <div className="grid gap-4">
                        {socialLinks.map(social => (
                            <div key={social.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-1/4">
                                    <select value={social.platform} onChange={(e) => updateSocialLink(social.id, {...social, platform: e.target.value as any})} className="input-field py-2 text-sm">
                                        <option value="Instagram">Instagram</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Twitter">Twitter</option>
                                        <option value="Youtube">Youtube</option>
                                        <option value="TikTok">TikTok</option>
                                        <option value="Website">Website</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <input type="text" value={social.url} onChange={(e) => updateSocialLink(social.id, {...social, url: e.target.value})} className="input-field py-2 text-sm font-mono" placeholder="Profile URL..." />
                                </div>
                                <button onClick={() => deleteSocialLink(social.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                <FormActions id={`social-${social.id}`} />
                            </div>
                        ))}
                    </div>
                 </div>
              )}

              {/* Fallback Section */}
              {!['general', 'theme', 'navigation', 'heritage', 'news', 'tickets', 'contact', 'arts', 'destinations', 'organization', 'hero', 'map', 'portals'].includes(activeSection) && (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-slate-200 border-dashed m-4">
                   <div className="p-6 bg-slate-50 rounded-full mb-6 border border-slate-100">
                      <Hash className="w-10 h-10 text-gray-400" />
                   </div>
                   <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-gray-600">Modul Belum Tersedia</p>
                </div>
              )}
            </div>
          </div>

          {/* PREVIEW CONTAINER */}
          {showPreview && (
            <>
              <div onMouseDown={startResizing} className={`w-[1px] bg-slate-200 hover:bg-heritage-gold cursor-col-resize z-[40] transition-colors relative flex items-center justify-center ${isResizing ? 'bg-heritage-gold shadow-[0_0_15px_#C5A059]' : ''}`}>
                 <div className="absolute top-1/2 -translate-y-1/2 w-5 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center">
                    <GripVertical className="w-3 h-3 text-gray-400" />
                 </div>
              </div>

              <div style={{ width: `${previewWidth}px` }} className="bg-[#F3F4F6] flex flex-col items-center overflow-hidden relative shrink-0 border-l border-slate-200 workspace-grid">
                <div className="sticky top-0 w-full p-4 bg-white/80 backdrop-blur border-b border-slate-200 z-[50] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-2"><Monitor className="w-3 h-3" /> Live Preview</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                       <button onClick={() => setManualZoom(prev => Math.max(prev - 0.1, 0.2))} className="text-gray-600 hover:text-black transition-colors"><ZoomOut className="w-3.5 h-3.5" /></button>
                       <span className="text-[9px] font-mono font-bold text-black w-10 text-center">{Math.round(getScaleFactor() * 100)}%</span>
                       <button onClick={() => setManualZoom(prev => Math.min(prev + 0.1, 2.0))} className="text-gray-600 hover:text-black transition-colors"><ZoomIn className="w-3.5 h-3.5" /></button>
                    </div>
                </div>

                <div className="flex-1 w-full flex items-start justify-center overflow-auto custom-scrollbar p-4 pb-20">
                   <div className="relative origin-top transition-transform duration-300 ease-out shadow-2xl border-[6px] border-slate-800 rounded-[2rem] bg-slate-900" style={{ transform: `scale(${getScaleFactor()})`, width: '1440px', minHeight: '2000px', marginTop: '10px' }}>
                     <div className="bg-white overflow-hidden flex flex-col h-full rounded-[1.5rem] h-full">
                        <div className="h-10 bg-slate-100 flex items-center gap-4 px-6 shrink-0 border-b border-slate-200">
                           <div className="flex gap-1.5"><div className="w-2.5 h-2.5 bg-slate-300 rounded-full" /><div className="w-2.5 h-2.5 bg-slate-300 rounded-full" /><div className="w-2.5 h-2.5 bg-slate-300 rounded-full" /></div>
                           <div className="flex-1 bg-white mx-6 rounded-md px-3 py-1 text-[9px] font-mono text-gray-600 truncate flex items-center justify-center gap-2 shadow-sm border border-slate-200"><Lock className="w-2.5 h-2.5 text-emerald-500" /> heritage.sawahlunto.go.id</div>
                        </div>
                        <div className="flex-1 overflow-y-auto hide-scrollbar preview-content" style={{ '--color-primary': content.theme.primary, '--color-secondary': content.theme.secondary, '--color-background': content.theme.background, '--color-dark': content.theme.dark } as React.CSSProperties}>
                           <div className="pointer-events-none origin-top select-none">
                              <Hero />
                              <MuseumMap />
                              <ExternalPortals />
                              <HeritageMain />
                              <ArtsSection />
                              <NewsSection />
                              <Attractions />
                              <InfoSection />
                              <Footer />
                           </div>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        .input-label { display: block; font-size: 0.75rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
        .input-field { width: 100%; background-color: #FFFFFF !important; border: 1px solid #CBD5E1; padding: 0.625rem 0.875rem; border-radius: 0.5rem; font-size: 0.875rem; color: #0F172A; transition: all 0.2s ease; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .input-field:focus { outline: none; border-color: #C5A059; box-shadow: 0 0 0 2px rgba(197, 160, 89, 0.2); }
        .btn-add { background: #FFFFFF; color: #0F172A; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s ease; border: 1px solid #CBD5E1; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
        .btn-add:hover { border-color: #94A3B8; background-color: #F8FAFC; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        .workspace-grid { background-image: radial-gradient(#E5E7EB 1px, transparent 1px); background-size: 24px 24px; }
        .preview-content { color: var(--color-dark); background-color: var(--color-background); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
