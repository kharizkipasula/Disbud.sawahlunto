
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { LocalizedText, SectionKey } from '../types';
import {
  X, Plus, Trash2, Edit2, Globe, Palette, Users, FileText, Music, Instagram,
  Phone, Ticket, MapPin, Navigation, Layout, User as UserIcon, Key,
  AlertTriangle, Save, PlusCircle, ArrowUp, ArrowDown, Link as LinkIcon,
  Image as ImageIcon, CheckCircle, Info, Landmark, Calendar, Clock, Camera,
  GripVertical, Eye, EyeOff, Monitor, ChevronLeft, ChevronRight, RefreshCw,
  GripHorizontal, Maximize, ZoomIn, ZoomOut, Lock, Settings, Target, Hash,
  Images, LogOut, ArrowLeft, ArrowRight, Layers, Map as MapIcon, MousePointerClick,
  ListOrdered, ArrowUpToLine, ArrowDownToLine, RotateCcw, Sparkles, Building2, CheckCircle2,
  Table
} from 'lucide-react';
import { formatGoogleDriveUrl, isGoogleDriveUrl } from '../src/utils/imageHelper';

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

const SECTION_METADATA: Record<SectionKey, { name: LocalizedText; desc: LocalizedText; icon: any; category: string }> = {
  hero: {
    name: { id: 'Hero Slider', en: 'Hero Slider' },
    desc: { id: 'Banner utama dan pembuka visual interaktif di bagian teratas beranda', en: 'Main interactive banner and visual showcase at the top of the homepage' },
    icon: Layers,
    category: 'Utama'
  },
  map: {
    name: { id: 'Peta & Lokasi Museum', en: 'Museums & Interactive Map' },
    desc: { id: 'Peta interaktif titik museum bersejarah, Street View 360°, dan navigasi lokasi', en: 'Interactive museum map, 360° Street View, and location navigation' },
    icon: MapIcon,
    category: 'Eksplorasi'
  },
  portals: {
    name: { id: 'Portal Layanan Luar', en: 'External Portals' },
    desc: { id: 'Tautan cepat ke Tur Virtual 360, Reservasi E-Tiket, dan portal luar lainnya', en: 'Direct links to Virtual Tour 360, E-Tickets, and external partner portals' },
    icon: MousePointerClick,
    category: 'Layanan'
  },
  heritage: {
    name: { id: 'Warisan Kita (UNESCO)', en: 'Our Heritage' },
    desc: { id: 'Dokumentasi Warisan Benda (Tambang Ombilin) & Warisan Tak Benda (Songket)', en: 'Tangible (Ombilin Coal Mining) & Intangible (Songket) UNESCO World Heritage' },
    icon: FileText,
    category: 'Edukasi'
  },
  arts: {
    name: { id: 'Lembaga Kebudayaan', en: 'Cultural Institutions' },
    desc: { id: 'Daftar sanggar seni tradisi, paguyuban adat, dan komunitas budaya dengan format berita & isian list program', en: 'Cultural institutions, studios, and heritage guilds with news articles and list features' },
    icon: Building2,
    category: 'Budaya'
  },
  news: {
    name: { id: 'Berita & Pengumuman', en: 'News & Announcements' },
    desc: { id: 'Warta kebudayaan, publikasi festival kota, dan agenda agenda terkini', en: 'Cultural news, city festival announcements, and latest updates' },
    icon: Instagram,
    category: 'Informasi'
  },
  attractions: {
    name: { id: 'Destinasi Wisata', en: 'Destinations & Attractions' },
    desc: { id: 'Katalog daya tarik objek wisata sejarah, alam, dan budaya Sawahlunto', en: 'Historical, natural, and cultural tourist attractions catalogue' },
    icon: MapPin,
    category: 'Pariwisata'
  },
  info: {
    name: { id: 'Tiket & Operasional', en: 'Tickets & Operations' },
    desc: { id: 'Tarif tiket masuk, jam buka operasional, profil instansi dinas & visi misi', en: 'Admission ticket prices, operating hours, and agency profile info' },
    icon: Ticket,
    category: 'Operasional'
  }
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
    externalLinks, addExternalLink, updateExternalLink, deleteExternalLink,
    sectionOrder, sectionVisibility, reorderSections, toggleSectionVisibility, saveLayout, resetLayout
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

  const getLoc = (text: any, lang: 'id' | 'en' = 'id'): string => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[lang] ?? text.id ?? text.en ?? '';
  };

  const setLoc = (text: any, val: string, lang: 'id' | 'en' = 'id'): LocalizedText => {
    const base = (typeof text === 'object' && text !== null)
      ? text
      : { en: typeof text === 'string' ? text : '', id: typeof text === 'string' ? text : '' };
    return {
      en: base.en ?? '',
      id: base.id ?? '',
      [lang]: val
    };
  };

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

  const FormActions = ({ id, onCancel, onSave }: { id: string, onCancel?: () => void, onSave?: () => Promise<void> | void }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      setIsSaving(true);
      try {
        if (onSave) {
          await onSave();
        }
      } catch (err) {
        console.error('Save error:', err);
      } finally {
        setIsSaving(false);
        triggerSaveFeedback(id);
      }
    };

    return (
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4 -mx-6 -mb-6 mt-6 flex items-center justify-end gap-3 z-10 rounded-b-2xl">
        <button type="button" onClick={onCancel || handleCancel} className="px-4 py-2 rounded-lg font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">{t.cancel[language]}</button>
        <button type="button" onClick={handleSave} disabled={isSaving} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${saveStatus[id] ? 'bg-emerald-600 text-white cursor-default' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
          {saveStatus[id] ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saveStatus[id] ? t.saved[language] : (isSaving ? 'Menyimpan...' : t.save[language])}
        </button>
      </div>
    );
  };

  const sidebarLinks = [
    { id: 'general', label: 'Identitas', icon: Globe },
    { id: 'layout', label: 'Tata Letak Beranda', icon: ListOrdered },
    { id: 'hero', label: 'Hero Slider', icon: Layers },
    { id: 'heritage', label: 'Warisan', icon: FileText },
    { id: 'map', label: 'Museum & Tiket', icon: MapIcon },
    { id: 'portals', label: 'Portal Luar', icon: MousePointerClick },
    { id: 'arts', label: 'Lembaga Kebudayaan', icon: Building2 },
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

              {/* TATA LETAK BERANDA (LAYOUT ORDER & VISIBILITY) */}
              {activeSection === 'layout' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/60 pb-8 gap-4">
                    <SectionHeader icon={ListOrdered} title="Tata Letak Beranda" subtitle="Urutan Posisi & Visibilitas Seksi Halaman Utama" />
                    <button
                      type="button"
                      onClick={async () => {
                        await resetLayout();
                        triggerSaveFeedback('layout-reset');
                      }}
                      className="btn-add text-slate-700 hover:text-slate-900 shrink-0"
                    >
                      <RotateCcw className="w-4 h-4 text-heritage-gold" />
                      {saveStatus['layout-reset'] ? 'Urutan Direset!' : 'Kembalikan ke Standar'}
                    </button>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-sm text-amber-950">
                      <p className="font-bold text-amber-900">Pengaturan Fleksibel Halaman Depan</p>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Gunakan tombol panah <strong>Naik (↑)</strong> dan <strong>Turun (↓)</strong> untuk memindahkan posisi seksi (misal: memindahkan <em>Warisan Kita</em> ke bawah <em>Berita</em>). Anda juga dapat menggunakan tombol <strong>Mata</strong> untuk menampilkan atau menyembunyikan seksi dari publik. Perubahan langsung tercermin pada Live Preview di sebelah kanan.
                      </p>
                    </div>
                  </div>

                  {/* Section List */}
                  <div className="space-y-3">
                    {sectionOrder.map((secKey, index) => {
                      const meta = SECTION_METADATA[secKey] || {
                        name: { id: secKey, en: secKey },
                        desc: { id: '', en: '' },
                        icon: Layers,
                        category: 'Seksi'
                      };
                      const IconComponent = meta.icon;
                      const isVisible = sectionVisibility[secKey] !== false;
                      const isFirst = index === 0;
                      const isLast = index === sectionOrder.length - 1;

                      const handleMoveUp = async () => {
                        if (isFirst) return;
                        const newOrder = [...sectionOrder];
                        const temp = newOrder[index - 1];
                        newOrder[index - 1] = newOrder[index];
                        newOrder[index] = temp;
                        await reorderSections(newOrder);
                      };

                      const handleMoveDown = async () => {
                        if (isLast) return;
                        const newOrder = [...sectionOrder];
                        const temp = newOrder[index + 1];
                        newOrder[index + 1] = newOrder[index];
                        newOrder[index] = temp;
                        await reorderSections(newOrder);
                      };

                      const handleMoveToTop = async () => {
                        if (isFirst) return;
                        const item = sectionOrder[index];
                        const newOrder = [item, ...sectionOrder.filter((_, i) => i !== index)];
                        await reorderSections(newOrder);
                      };

                      return (
                        <div
                          key={secKey}
                          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 gap-4 ${
                            isVisible
                              ? 'bg-white border-slate-200/90 shadow-sm hover:border-heritage-gold/50 hover:shadow-md'
                              : 'bg-slate-50/80 border-slate-200 opacity-60'
                          }`}
                        >
                          {/* Left: Position & Section Info */}
                          <div className="flex items-center gap-4 flex-1">
                            {/* Position Number Badge */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
                              isVisible
                                ? 'bg-slate-900 text-heritage-gold border-slate-800'
                                : 'bg-slate-200 text-slate-500 border-slate-300'
                            }`}>
                              #{index + 1}
                            </div>

                            {/* Section Icon */}
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                              isVisible
                                ? 'bg-amber-50 border-amber-200/80 text-heritage-gold'
                                : 'bg-slate-100 border-slate-200 text-slate-400'
                            }`}>
                              <IconComponent className="w-5 h-5" />
                            </div>

                            {/* Text Info */}
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`font-bold text-base tracking-tight ${isVisible ? 'text-slate-900' : 'text-slate-500 line-through'}`}>
                                  {meta.name[language] || meta.name.id}
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                  {meta.category}
                                </span>
                                {isVisible ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Aktif
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                    Disembunyikan
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {meta.desc[language] || meta.desc.id}
                              </p>
                            </div>
                          </div>

                          {/* Right: Controls (Move Up, Move Down, Move Top, Visibility Toggle) */}
                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
                            {/* Move to Top */}
                            <button
                              type="button"
                              onClick={handleMoveToTop}
                              disabled={isFirst}
                              title="Pindah ke Paling Atas"
                              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                                isFirst
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs'
                              }`}
                            >
                              <ArrowUpToLine className="w-4 h-4" />
                            </button>

                            {/* Move Up */}
                            <button
                              type="button"
                              onClick={handleMoveUp}
                              disabled={isFirst}
                              title="Geser Naik (Ke Atas)"
                              className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                                isFirst
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'bg-white text-slate-800 shadow-xs hover:bg-slate-900 hover:text-white'
                              }`}
                            >
                              <ArrowUp className="w-4 h-4" />
                              <span className="hidden md:inline">Naik</span>
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              onClick={handleMoveDown}
                              disabled={isLast}
                              title="Geser Turun (Ke Bawah)"
                              className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                                isLast
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'bg-white text-slate-800 shadow-xs hover:bg-slate-900 hover:text-white'
                              }`}
                            >
                              <ArrowDown className="w-4 h-4" />
                              <span className="hidden md:inline">Turun</span>
                            </button>

                            <div className="w-[1px] h-5 bg-slate-200 mx-1"></div>

                            {/* Visibility Toggle */}
                            <button
                              type="button"
                              onClick={() => toggleSectionVisibility(secKey)}
                              title={isVisible ? 'Sembunyikan Seksi dari Beranda' : 'Tampilkan Seksi di Beranda'}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                isVisible
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              <span className="hidden lg:inline">{isVisible ? 'Tampil' : 'Sembunyi'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Save Layout Action Bar */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      Perubahan tata letak tersimpan otomatis dan dapat langsung dicek di halaman utama.
                    </div>
                    <FormActions
                      id="layout-save"
                      onSave={async () => {
                        await saveLayout(sectionOrder, sectionVisibility);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* HERO SLIDER */}
              {activeSection === 'hero' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="flex justify-between items-end border-b border-slate-200/60 pb-10">
                      <SectionHeader icon={Layers} title="Hero Slider" subtitle="Halaman Depan" />
                      <button onClick={() => addHeroSlide({ id: Date.now().toString(), subtitle: {en:'New Slide', id:'Slide Baru'}, title: {en:'Title', id:'Judul'}, description: {en:'',id:''}, cta: {en:'Explore', id:'Jelajahi'}, bgImageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&q=80&w=1920' })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Slide</button>
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
                                   <input type="text" value={getLoc(slide.title, 'id')} onChange={(e) => updateHeroSlide(slide.id, {...slide, title: setLoc(slide.title, e.target.value, 'id')})} className="input-field font-bold" />
                                </div>
                                <div className="space-y-2">
                                   <label className="input-label">Description (ID)</label>
                                   <textarea value={getLoc(slide.description, 'id')} onChange={(e) => updateHeroSlide(slide.id, {...slide, description: setLoc(slide.description, e.target.value, 'id')})} className="input-field min-h-[80px]" />
                                </div>
                             </div>
                          </div>
                          <FormActions id={`hero-${slide.id}`} onSave={() => updateHeroSlide(slide.id, slide)} />
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
                              <input type="text" value={getLoc(content.history.title, 'id')} onChange={(e) => updateContent('history', 'title', e.target.value, 'id')} className="input-field" />
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
                           <textarea value={getLoc(content.history.description1, 'id')} onChange={(e) => updateContent('history', 'description1', e.target.value, 'id')} className="input-field min-h-[100px]" />
                        </div>
                        <div className="space-y-2">
                           <label className="input-label">Deskripsi Paragraf 2 (ID)</label>
                           <textarea value={getLoc(content.history.description2, 'id')} onChange={(e) => updateContent('history', 'description2', e.target.value, 'id')} className="input-field min-h-[100px]" />
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
                              <input type="text" value={getLoc(content.culture.title, 'id')} onChange={(e) => updateContent('culture', 'title', e.target.value, 'id')} className="input-field" />
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
                           <textarea value={getLoc(content.culture.description, 'id')} onChange={(e) => updateContent('culture', 'description', e.target.value, 'id')} className="input-field min-h-[100px]" />
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
                                   <input type="text" value={getLoc(m.name, 'id')} onChange={(e) => updateMuseum(m.id, {...m, name: setLoc(m.name, e.target.value, 'id')})} className="input-field font-bold text-lg" />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                      <label className="input-label">Google Maps Query</label>
                                      <input type="text" value={m.embedQuery || ''} onChange={(e) => updateMuseum(m.id, {...m, embedQuery: e.target.value})} className="input-field font-mono text-xs" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="input-label">Street View URL (Embed)</label>
                                      <input type="text" value={m.streetViewUrl || ''} onChange={(e) => updateMuseum(m.id, {...m, streetViewUrl: e.target.value})} className="input-field font-mono text-xs" />
                                   </div>
                                </div>
                                <div className="space-y-2">
                                   <label className="input-label">Deskripsi Singkat (ID)</label>
                                   <textarea value={getLoc(m.description, 'id')} onChange={(e) => updateMuseum(m.id, {...m, description: setLoc(m.description, e.target.value, 'id')})} className="input-field h-20" />
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
                                   <textarea value={getLoc(m.vision, 'id')} onChange={(e) => updateMuseum(m.id, {...m, vision: setLoc(m.vision, e.target.value, 'id')})} className="input-field h-20 italic font-serif" placeholder="Visi museum..." />
                                </div>
                                <div className="space-y-2">
                                   <label className="input-label">Misi Museum (ID)</label>
                                   <textarea value={getLoc(m.mission, 'id')} onChange={(e) => updateMuseum(m.id, {...m, mission: setLoc(m.mission, e.target.value, 'id')})} className="input-field h-24" placeholder="Misi museum..." />
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
                                               <input type="text" value={getLoc(tp.category, 'id')} onChange={(e) => {
                                                  const newPrices = (m.ticketPrices || []).map(p => p.id === tp.id ? {...p, category: setLoc(p.category, e.target.value, 'id')} : p);
                                                  updateMuseum(m.id, {...m, ticketPrices: newPrices});
                                               }} className="input-field py-2 text-sm" placeholder="Contoh: Dewasa (>12 tahun)" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                               <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Harga (Rp)</label>
                                               <input type="number" value={tp.price} onChange={(e) => {
                                                  const newPrices = (m.ticketPrices || []).map(p => p.id === tp.id ? {...p, price: parseInt(e.target.value) || 0} : p);
                                                  updateMuseum(m.id, {...m, ticketPrices: newPrices});
                                               }} className="input-field py-2 text-sm" />
                                            </div>
                                            <button onClick={() => {
                                               const newPrices = (m.ticketPrices || []).filter(p => p.id !== tp.id);
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
                             <FormActions id={`map-${m.id}`} onSave={() => updateMuseum(m.id, m)} />
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
                      <button onClick={() => addExternalLink({ id: Date.now().toString(), title: {en:'New Link', id:'Link Baru'}, description: {en:'',id:''}, url: '#', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600', buttonText: {en:'Visit', id:'Kunjungi'} })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Portal</button>
                   </div>
                   <div className="grid gap-8">
                      {externalLinks.map(link => (
                         <div key={link.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all relative">
                            <button onClick={() => deleteExternalLink(link.id)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 z-10"><Trash2 className="w-4 h-4" /></button>
                            <div className="w-full md:w-48 space-y-3">
                               <div className="h-32 rounded-2xl overflow-hidden border-2 border-slate-100"><img src={link.imageUrl} className="w-full h-full object-cover" alt="" /></div>
                               <input type="text" value={link.imageUrl || ''} onChange={(e) => updateExternalLink(link.id, {...link, imageUrl: e.target.value})} className="input-field text-[10px]" placeholder="Image URL" />
                            </div>
                            <div className="flex-1 space-y-4">
                               <div className="space-y-2">
                                  <label className="input-label">Judul (ID)</label>
                                  <input type="text" value={getLoc(link.title, 'id')} onChange={(e) => updateExternalLink(link.id, {...link, title: setLoc(link.title, e.target.value, 'id')})} className="input-field font-bold" />
                                </div>
                               <div className="space-y-2">
                                  <label className="input-label">Deskripsi (ID)</label>
                                  <textarea value={getLoc(link.description, 'id')} onChange={(e) => updateExternalLink(link.id, {...link, description: setLoc(link.description, e.target.value, 'id')})} className="input-field h-20" />
                               </div>
                               <div className="flex gap-4">
                                  <div className="flex-1 space-y-2">
                                     <label className="input-label">Target URL</label>
                                     <input type="text" value={link.url || ''} onChange={(e) => updateExternalLink(link.id, {...link, url: e.target.value})} className="input-field font-mono text-xs" placeholder="https://..." />
                                  </div>
                                  <div className="w-1/3 space-y-2">
                                     <label className="input-label">Label Tombol (ID)</label>
                                     <input type="text" value={getLoc(link.buttonText, 'id')} onChange={(e) => updateExternalLink(link.id, {...link, buttonText: setLoc(link.buttonText, e.target.value, 'id')})} className="input-field" />
                                  </div>
                               </div>
                               <FormActions id={`portal-${link.id}`} onSave={() => updateExternalLink(link.id, link)} />
                            </div>
                         </div>
                      ))}
                   </div>
                 </div>
              )}

              {/* LEMBAGA KEBUDAYAAN (ARTS & CULTURAL INSTITUTIONS) */}
              {activeSection === 'arts' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/60 pb-8 gap-4">
                      <SectionHeader icon={Building2} title="Lembaga Kebudayaan" subtitle="Sanggar Seni, Komunitas Adat & Format Berita" />
                      <button
                        onClick={() => addArtItem({
                          id: Date.now().toString(),
                          title: { en: 'New Cultural Institution', id: 'Lembaga Kebudayaan Baru' },
                          category: { en: 'Traditional Arts Studio', id: 'Sanggar Seni Tradisional' },
                          date: 'Terdaftar & Aktif',
                          description: { en: '', id: '' },
                          imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
                          listItems: [
                            { id: 'Program Pelatihan Seni Tradisi Rutin', en: 'Routine Traditional Arts Training Program' },
                            { id: 'Pementasan Budaya & Festival Kota', en: 'Cultural Performances & City Festivals' }
                          ],
                          tableData: [
                            {
                              no: 1,
                              description: { id: 'Pelatihan rutin tari & musik tradisi', en: 'Routine training for traditional dance & music' },
                              notes: { id: 'Setiap Sabtu & Minggu', en: 'Every Saturday & Sunday' }
                            },
                            {
                              no: 2,
                              description: { id: 'Partisipasi Festival Budaya Sawahlunto', en: 'Sawahlunto Cultural Festival Participation' },
                              notes: { id: 'Agenda Tahunan Kota', en: 'Annual City Event' }
                            }
                          ],
                          leader: '',
                          location: { id: 'Kota Sawahlunto', en: 'Sawahlunto City' },
                          contact: ''
                        })}
                        className="btn-add shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Tambah Lembaga
                      </button>
                   </div>

                   <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-heritage-gold shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 leading-relaxed">
                        <strong>Tips Tampilan Berita & Gambar Google Drive:</strong> Anda dapat menempelkan tautan langsung Google Drive (misal: <code>https://drive.google.com/file/d/.../view</code>). Sistem secara otomatis mengonversinya menjadi gambar berkecepatan tinggi. Setiap lembaga dilengkapi dengan format berita, deskripsi, dan isian daftar program kerja.
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-8">
                      {content.arts.items.map(art => {
                        const directImg = formatGoogleDriveUrl(art.imageUrl);
                        return (
                          <div key={art.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative space-y-6">
                             <div className="absolute top-6 right-6 z-10">
                                <button onClick={() => deleteArtItem(art.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Hapus Lembaga">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                             </div>

                             <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-full md:w-56 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border-2 border-slate-100 bg-slate-900 relative group">
                                   <img 
                                     src={directImg || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400"} 
                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                     alt="" 
                                     onError={(e) => {
                                       e.target.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400";
                                     }}
                                   />
                                   <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white truncate text-center">
                                     {art.imageUrl?.includes("drive.google.com") ? "✓ Google Drive" : "Preview Gambar"}
                                   </div>
                                </div>

                                <div className="flex-1 space-y-4 w-full pr-8">
                                   <div>
                                       <label className="input-label mb-1">Nama Lembaga / Judul Berita (ID)</label>
                                       <input 
                                         type="text" 
                                         value={getLoc(art.title, "id")} 
                                         onChange={(e) => updateArtItem(art.id, {...art, title: setLoc(art.title, e.target.value, "id")})} 
                                         className="input-field font-serif font-bold text-lg text-slate-900" 
                                         placeholder="Contoh: Sanggar Randai Ombilin..." 
                                       />
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div className="space-y-1.5">
                                       <label className="input-label">Kategori Lembaga (ID)</label>
                                       <input 
                                         type="text" 
                                         value={getLoc(art.category, "id") || ""} 
                                         onChange={(e) => updateArtItem(art.id, {...art, category: setLoc(art.category || {en:"", id:""}, e.target.value, "id")})} 
                                         className="input-field text-xs" 
                                         placeholder="Contoh: Sanggar Seni Tradisional" 
                                       />
                                     </div>
                                     <div className="space-y-1.5">
                                       <label className="input-label">Status / Tahun</label>
                                       <input 
                                         type="text" 
                                         value={art.date || ""} 
                                         onChange={(e) => updateArtItem(art.id, {...art, date: e.target.value})} 
                                         className="input-field text-xs" 
                                         placeholder="Contoh: Terdaftar & Aktif" 
                                       />
                                     </div>
                                   </div>

                                   <div className="space-y-1.5">
                                       <label className="input-label">URL Gambar (Mendukung Link Google Drive)</label>
                                       <input 
                                         type="text" 
                                         value={art.imageUrl || ""} 
                                         onChange={(e) => updateArtItem(art.id, {...art, imageUrl: e.target.value})} 
                                         className="input-field font-mono text-xs text-blue-600" 
                                         placeholder="https://drive.google.com/file/d/... atau https://..." 
                                       />
                                   </div>
                                </div>
                             </div>

                             <div className="space-y-2">
                                 <label className="input-label">Deskripsi Lengkap / Isi Berita (ID)</label>
                                 <textarea 
                                   value={getLoc(art.description, "id")} 
                                   onChange={(e) => updateArtItem(art.id, {...art, description: setLoc(art.description, e.target.value, "id")})} 
                                   className="input-field text-sm min-h-[110px]" 
                                   placeholder="Uraikan latar belakang, sejarah, filosofi gerak/kesenian, dan peran lembaga ini..." 
                                 />
                             </div>

                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                   <CheckCircle2 className="w-4 h-4 text-heritage-gold" />
                                   <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Isian List (Daftar Program Kerja / Poin Unggulan)</label>
                                 </div>
                                 <button
                                   type="button"
                                   onClick={() => {
                                     const currentList = art.listItems || [];
                                     const updatedList = [...currentList, { id: "Program Baru", en: "New Program" }];
                                     updateArtItem(art.id, { ...art, listItems: updatedList });
                                   }}
                                   className="px-2.5 py-1 bg-white hover:bg-heritage-gold hover:text-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 transition-colors flex items-center gap-1 shadow-2xs"
                                 >
                                   <Plus className="w-3.5 h-3.5" /> Tambah Poin
                                 </button>
                                </div>

                                {(!art.listItems || art.listItems.length === 0) ? (
                                  <p className="text-xs text-slate-400 italic">Belum ada poin isian list. Klik tombol di atas untuk menambahkan poin.</p>
                                ) : (
                                  <div className="space-y-2">
                                    {art.listItems.map((itemObj, idx) => (
                                      <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                                        <span className="text-xs font-mono font-bold text-heritage-gold w-5 text-center">{idx + 1}.</span>
                                        <input 
                                          type="text" 
                                          value={getLoc(itemObj, "id")} 
                                          onChange={(e) => {
                                            const currentList = [...(art.listItems || [])];
                                            currentList[idx] = setLoc(currentList[idx] || { id: "", en: "" }, e.target.value, "id");
                                            updateArtItem(art.id, { ...art, listItems: currentList });
                                          }}
                                          className="flex-1 bg-transparent text-xs text-slate-800 focus:outline-none" 
                                          placeholder="Tuliskan program / keunggulan..." 
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const currentList = (art.listItems || []).filter((_, i) => i !== idx);
                                            updateArtItem(art.id, { ...art, listItems: currentList });
                                          }}
                                          className="text-slate-400 hover:text-red-500 p-1"
                                          title="Hapus poin"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                             </div>

                             {/* TABEL 3 KOLOM: NO, DESKRIPSI, KETERANGAN */}
                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                   <Table className="w-4 h-4 text-heritage-gold" />
                                   <div>
                                     <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                                       Tabel Rincian Lembaga (3 Kolom)
                                     </label>
                                     <span className="text-[10px] text-slate-400">Kolom: No, Deskripsi, Keterangan</span>
                                   </div>
                                 </div>
                                 <button
                                   type="button"
                                   onClick={() => {
                                     const currentTable = art.tableData || [];
                                     const nextNo = currentTable.length + 1;
                                     const updatedTable = [
                                       ...currentTable,
                                       {
                                         no: nextNo,
                                         description: { id: "Deskripsi kegiatan / pertunjukan", en: "Activity / performance description" },
                                         notes: { id: "Keterangan / Jadwal / Lokasi", en: "Notes / Schedule / Location" }
                                       }
                                     ];
                                     updateArtItem(art.id, { ...art, tableData: updatedTable });
                                   }}
                                   className="px-2.5 py-1 bg-white hover:bg-heritage-gold hover:text-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 transition-colors flex items-center gap-1 shadow-2xs"
                                 >
                                   <Plus className="w-3.5 h-3.5" /> Tambah Baris
                                 </button>
                               </div>

                               {(!art.tableData || art.tableData.length === 0) ? (
                                 <div className="bg-white rounded-lg p-3 border border-dashed border-slate-200 text-center">
                                   <p className="text-xs text-slate-400 italic">Belum ada baris tabel 3 kolom. Klik tombol "+ Tambah Baris" di atas.</p>
                                 </div>
                               ) : (
                                 <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
                                   <table className="w-full text-left border-collapse text-xs">
                                     <thead>
                                       <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                                         <th className="py-2 px-2.5 text-center w-14">No</th>
                                         <th className="py-2 px-3">Deskripsi (ID)</th>
                                         <th className="py-2 px-3">Keterangan (ID)</th>
                                         <th className="py-2 px-2 text-center w-10">Aksi</th>
                                       </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-100">
                                       {art.tableData.map((row, rIdx) => (
                                         <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                                           <td className="py-2 px-2 text-center align-top">
                                             <input
                                               type="text"
                                               value={row.no ?? (rIdx + 1)}
                                               onChange={(e) => {
                                                 const currentTable = [...(art.tableData || [])];
                                                 currentTable[rIdx] = { ...currentTable[rIdx], no: e.target.value };
                                                 updateArtItem(art.id, { ...art, tableData: currentTable });
                                               }}
                                               className="w-10 text-center font-mono font-bold text-heritage-gold bg-slate-50 border border-slate-200 rounded py-1 text-xs focus:outline-none focus:border-heritage-gold"
                                             />
                                           </td>
                                           <td className="py-2 px-3 align-top">
                                             <input
                                               type="text"
                                               value={getLoc(row.description, "id")}
                                               onChange={(e) => {
                                                 const currentTable = [...(art.tableData || [])];
                                                 currentTable[rIdx] = {
                                                   ...currentTable[rIdx],
                                                   description: setLoc(currentTable[rIdx]?.description || { id: "", en: "" }, e.target.value, "id")
                                                 };
                                                 updateArtItem(art.id, { ...art, tableData: currentTable });
                                               }}
                                               className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-heritage-gold focus:bg-white"
                                               placeholder="Deskripsi rincian kegiatan..."
                                             />
                                           </td>
                                           <td className="py-2 px-3 align-top">
                                             <input
                                               type="text"
                                               value={getLoc(row.notes, "id")}
                                               onChange={(e) => {
                                                 const currentTable = [...(art.tableData || [])];
                                                 currentTable[rIdx] = {
                                                   ...currentTable[rIdx],
                                                   notes: setLoc(currentTable[rIdx]?.notes || { id: "", en: "" }, e.target.value, "id")
                                                 };
                                                 updateArtItem(art.id, { ...art, tableData: currentTable });
                                               }}
                                               className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-heritage-gold focus:bg-white"
                                               placeholder="Keterangan / jadwal / catatan..."
                                             />
                                           </td>
                                           <td className="py-2 px-2 text-center align-top">
                                             <button
                                               type="button"
                                               onClick={() => {
                                                 const currentTable = (art.tableData || []).filter((_, i) => i !== rIdx);
                                                 updateArtItem(art.id, { ...art, tableData: currentTable });
                                               }}
                                               className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                               title="Hapus baris tabel"
                                             >
                                               <Trash2 className="w-3.5 h-3.5" />
                                             </button>
                                           </td>
                                         </tr>
                                       ))}
                                     </tbody>
                                   </table>
                                 </div>
                               )}
                             </div>

                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                               <div className="space-y-1">
                                 <label className="input-label">Ketua / Pembina</label>
                                 <input 
                                   type="text" 
                                   value={art.leader || ""} 
                                   onChange={(e) => updateArtItem(art.id, {...art, leader: e.target.value})} 
                                   className="input-field text-xs" 
                                   placeholder="Nama Ketua..." 
                                 />
                               </div>
                               <div className="space-y-1">
                                 <label className="input-label">Lokasi / Wilayah (ID)</label>
                                 <input 
                                   type="text" 
                                   value={getLoc(art.location, "id") || ""} 
                                   onChange={(e) => updateArtItem(art.id, {...art, location: setLoc(art.location || {en:"", id:""}, e.target.value, "id")})} 
                                   className="input-field text-xs" 
                                   placeholder="Kecamatan / Desa..." 
                                 />
                               </div>
                               <div className="space-y-1">
                                 <label className="input-label">No. Kontak / WA</label>
                                 <input 
                                   type="text" 
                                   value={art.contact || ""} 
                                   onChange={(e) => updateArtItem(art.id, {...art, contact: e.target.value})} 
                                   className="input-field text-xs" 
                                   placeholder="+62 812..." 
                                 />
                               </div>
                             </div>

                             <FormActions id={`art-${art.id}`} onSave={() => updateArtItem(art.id, art)} />
                          </div>
                        );
                      })}
                   </div>
                </div>
              )}

              {/* NEWS */}
              {activeSection === 'news' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="flex justify-between items-end border-b border-slate-200/60 pb-10">
                      <SectionHeader icon={Instagram} title="Media & Artikel" subtitle="Distribusi Konten" />
                      <button onClick={() => addNews({ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], title: {en:'New Article', id:'Berita Baru'}, summary: {en:'',id:''}, content: {en:'',id:''}, imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400', imageUrls: [] })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Artikel</button>
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
                                    <input type="text" value={getLoc(item.title, 'id')} onChange={(e) => updateNews(item.id, {...item, title: setLoc(item.title, e.target.value, 'id')})} className="input-field font-serif font-bold text-xl !bg-transparent !border-0 !p-0 focus:ring-0 shadow-none" placeholder="Tulis judul disini..." />
                                 </div>
                                 <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="input-label">Tanggal</label>
                                       <div className="relative">
                                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                                          <input type="date" value={item.date || ''} onChange={(e) => updateNews(item.id, {...item, date: e.target.value})} className="input-field pl-11 py-3 text-xs" />
                                       </div>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="input-label">URL Gambar</label>
                                       <input type="text" value={item.imageUrl || ''} onChange={(e) => updateNews(item.id, {...item, imageUrl: e.target.value})} className="input-field font-mono text-[10px]" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-6 pt-8 border-t border-slate-50">
                              <div className="space-y-2">
                                 <label className="input-label">Ringkasan</label>
                                 <textarea value={getLoc(item.summary, 'id')} onChange={(e) => updateNews(item.id, {...item, summary: setLoc(item.summary, e.target.value, 'id')})} className="input-field text-sm min-h-[80px]" />
                              </div>
                              <div className="space-y-2">
                                 <label className="input-label">Konten Lengkap</label>
                                 <textarea value={getLoc(item.content, 'id')} onChange={(e) => updateNews(item.id, {...item, content: setLoc(item.content, e.target.value, 'id')})} className="input-field text-sm min-h-[150px]" />
                              </div>
                           </div>
                           <FormActions id={`news-${item.id}`} onSave={() => updateNews(item.id, item)} />
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* DESTINATIONS (Attractions) */}
              {activeSection === 'destinations' && (
                 <div className="space-y-10 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-8">
                       <SectionHeader 
                         icon={MapPin} 
                         title="Museum & Destinasi Wisata" 
                         subtitle="Kelola data museum, koleksi foto berganti (slideshow), jam operasional, dan lokasi" 
                       />
                       <button 
                         onClick={() => addAttraction({ 
                           id: `dest-${Date.now()}`, 
                           title: { en: 'New Museum Spot', id: 'Museum / Destinasi Baru' }, 
                           description: { en: '', id: '' }, 
                           imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800', 
                           images: ['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800'],
                           category: 'History',
                           location: { id: 'Kota Sawahlunto', en: 'Sawahlunto City' },
                           operatingHours: { id: '08.00 - 16.00 WIB', en: '08:00 AM - 04:00 PM' }
                         })} 
                         className="btn-add self-start sm:self-auto"
                       >
                         <Plus className="w-4 h-4" /> Tambah Destinasi
                       </button>
                    </div>

                    {/* Information / Instruction Banner */}
                    <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs font-bold">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="text-xs sm:text-sm space-y-1">
                        <h4 className="font-bold text-amber-900">Petunjuk Pengelolaan Foto Slideshow Museum</h4>
                        <p className="text-amber-800/90 leading-relaxed">
                          Anda dapat menambahkan beberapa foto pada setiap museum. Foto-foto tersebut akan otomatis 
                          tampil berganti-ganti (slideshow) secara modern di beranda. Klik tombol <strong>+ Tambah Baris Foto Baru</strong> untuk 
                          menambah kotak isian foto baru. Tautan <strong>Google Drive</strong> didukung secara otomatis!
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                       {attractions.map((att, attIdx) => {
                          const imageList = (att.images && att.images.length > 0)
                            ? att.images
                            : (att.imageUrl ? [att.imageUrl] : ['']);

                          const handleUpdateImageAt = (index: number, newUrl: string) => {
                            const updatedList = [...imageList];
                            updatedList[index] = newUrl;
                            const firstValid = updatedList.find(u => u.trim() !== '') || newUrl;
                            updateAttraction(att.id, {
                              ...att,
                              imageUrl: firstValid,
                              images: updatedList
                            });
                          };

                          const handleAddImageRow = () => {
                            const updatedList = [...imageList, ''];
                            updateAttraction(att.id, {
                              ...att,
                              images: updatedList
                            });
                          };

                          const handleRemoveImageAt = (index: number) => {
                            let updatedList = imageList.filter((_, i) => i !== index);
                            if (updatedList.length === 0) updatedList = [''];
                            const firstValid = updatedList.find(u => u.trim() !== '') || '';
                            updateAttraction(att.id, {
                              ...att,
                              imageUrl: firstValid,
                              images: updatedList
                            });
                          };

                          return (
                            <div key={att.id} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 hover:shadow-xl transition-all relative flex flex-col justify-between space-y-6">
                              {/* Top Bar Header */}
                              <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                                    #{attIdx + 1}
                                  </div>
                                  <div>
                                    <h3 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
                                      {getLoc(att.title, 'id') || 'Destinasi Tanpa Nama'}
                                    </h3>
                                    <span className="text-[10px] font-mono text-slate-400">ID: {att.id}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => {
                                    if (window.confirm(`Hapus destinasi "${getLoc(att.title, 'id')}"?`)) {
                                      deleteAttraction(att.id);
                                    }
                                  }} 
                                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                  title="Hapus Destinasi"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="space-y-6">
                                {/* FOTO SLIDESHOW / GALERI TEXTBOXES */}
                                <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <ImageIcon className="w-4 h-4 text-amber-600" />
                                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        Foto Museum (Tampil Berganti)
                                      </label>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                      {imageList.filter(u => u.trim() !== '').length} Foto
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-slate-500 leading-normal">
                                    Setiap kotak di bawah adalah satu foto. Masukkan tautan web gambar atau tautan berbagi <strong>Google Drive</strong>.
                                  </p>

                                  {/* List of Image Textboxes */}
                                  <div className="space-y-3">
                                    {imageList.map((url, imgIdx) => {
                                      const formatted = formatGoogleDriveUrl(url);
                                      const isDrive = isGoogleDriveUrl(url);

                                      return (
                                        <div 
                                          key={imgIdx} 
                                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
                                        >
                                          {/* Index & Thumbnail Box */}
                                          <div className="flex items-center gap-2 shrink-0">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 relative shrink-0">
                                              {formatted ? (
                                                <img 
                                                  src={formatted} 
                                                  alt="Thumb" 
                                                  referrerPolicy="no-referrer"
                                                  onError={(e) => {
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800';
                                                  }}
                                                  className="w-full h-full object-cover" 
                                                />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                                                  No Img
                                                </div>
                                              )}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-600 font-mono w-16 sm:w-20">
                                              {imgIdx === 0 ? 'Foto 1 (Utama)' : `Foto ${imgIdx + 1}`}
                                            </span>
                                          </div>

                                          {/* Input Textbox */}
                                          <div className="flex-1 min-w-0 space-y-1">
                                            <input 
                                              type="text" 
                                              value={url} 
                                              onChange={(e) => handleUpdateImageAt(imgIdx, e.target.value)}
                                              placeholder="Tempel tautan foto (https://... atau link Google Drive)"
                                              className="input-field text-xs font-mono py-1.5 px-3 h-9 w-full"
                                            />
                                            {isDrive && (
                                              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                <span>Google Drive Terdeteksi & Dikonversi</span>
                                              </div>
                                            )}
                                          </div>

                                          {/* Remove Image Row Button */}
                                          {imageList.length > 1 && (
                                            <button 
                                              type="button" 
                                              onClick={() => handleRemoveImageAt(imgIdx)}
                                              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors self-end sm:self-center"
                                              title="Hapus baris foto ini"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Add Image Button */}
                                  <button 
                                    type="button" 
                                    onClick={handleAddImageRow}
                                    className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100/60 text-amber-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <Plus className="w-4 h-4 text-amber-700" />
                                    <span>+ Tambah Baris Foto Baru (Kotak Gambar)</span>
                                  </button>
                                </div>

                                {/* DATA INFORMASI DESTINASI */}
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 space-y-1.5">
                                      <label className="input-label">Nama Museum / Destinasi (ID)</label>
                                      <input 
                                        type="text" 
                                        value={getLoc(att.title, 'id')} 
                                        onChange={(e) => updateAttraction(att.id, {...att, title: setLoc(att.title, e.target.value, 'id')})} 
                                        className="input-field font-bold text-sm" 
                                        placeholder="Contoh: Museum Goedang Ransoem"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="input-label">Kategori</label>
                                      <select 
                                        value={att.category} 
                                        onChange={(e) => updateAttraction(att.id, {...att, category: e.target.value as any})} 
                                        className="input-field text-sm"
                                      >
                                        <option value="History">Sejarah (History)</option>
                                        <option value="Culture">Budaya (Culture)</option>
                                        <option value="Nature">Alam (Nature)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="input-label">Lokasi Singkat</label>
                                      <input 
                                        type="text" 
                                        value={att.location ? getLoc(att.location, 'id') : ''} 
                                        onChange={(e) => updateAttraction(att.id, {...att, location: setLoc(att.location || {id:'', en:''}, e.target.value, 'id')})} 
                                        className="input-field text-xs" 
                                        placeholder="Contoh: Kelurahan Air Dingin, Lembah Segar"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="input-label">Jam Operasional</label>
                                      <input 
                                        type="text" 
                                        value={att.operatingHours ? getLoc(att.operatingHours, 'id') : ''} 
                                        onChange={(e) => updateAttraction(att.id, {...att, operatingHours: setLoc(att.operatingHours || {id:'', en:''}, e.target.value, 'id')})} 
                                        className="input-field text-xs" 
                                        placeholder="Contoh: 08.00 - 16.00 WIB"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="input-label">Deskripsi Lengkap (ID)</label>
                                    <textarea 
                                      value={getLoc(att.description, 'id')} 
                                      onChange={(e) => updateAttraction(att.id, {...att, description: setLoc(att.description, e.target.value, 'id')})} 
                                      className="input-field h-24 text-xs leading-relaxed" 
                                      placeholder="Tuliskan sejarah, latar belakang, dan keunikan museum..."
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Form Actions Footer */}
                              <div className="pt-2 border-t border-slate-100">
                                <FormActions id={`att-${att.id}`} onSave={() => updateAttraction(att.id, att)} />
                              </div>
                            </div>
                          );
                       })}
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
                          <input type="text" value={getLoc(content.tickets.openingHours, 'id')} onChange={(e) => updateContent('tickets', 'openingHours', e.target.value, 'id')} className="input-field text-lg" />
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
                    <FormActions id="theme" onSave={() => updateTheme(content.theme)} />
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
                            <textarea value={getLoc(content.organization.vision, 'id')} onChange={(e) => updateContent('organization', 'vision', e.target.value, 'id')} className="input-field italic font-serif text-xl py-8 bg-[#FBFBFC] border-slate-100 focus:bg-white leading-relaxed text-center" />
                         </div>
                         <div className="h-[1px] bg-slate-100 w-1/2 mx-auto"></div>
                         <div className="space-y-4">
                            <label className="input-label">Misi & Tujuan</label>
                            <textarea value={getLoc(content.organization.mission, 'id')} onChange={(e) => updateContent('organization', 'mission', e.target.value, 'id')} className="input-field min-h-[160px] leading-relaxed p-6" />
                         </div>
                         <div className="h-[1px] bg-slate-100 w-full"></div>
                         <div className="space-y-4">
                            <label className="input-label">Struktur Eksekutif (URL Gambar)</label>
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                               <input type="text" value={content.organization.structureImageUrl || ''} onChange={(e) => updateContent('organization', 'structureImageUrl', e.target.value)} className="input-field flex-1" placeholder="https://..." />
                               <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                  {content.organization.structureImageUrl ? <img src={content.organization.structureImageUrl} className="max-w-full max-h-full object-contain p-2" /> : <Users className="w-6 h-6 text-slate-400" />}
                                </div>
                            </div>
                         </div>
                         <div className="space-y-4">
                             <label className="input-label">Profil Dinas Lengkap (Untuk Modal)</label>
                             <textarea value={getLoc(content.organization.profile, 'id')} onChange={(e) => updateContent('organization', 'profile', e.target.value, 'id')} className="input-field min-h-[120px]" />
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
                                <input type="text" value={content.contact.address || ''} onChange={(e) => updateContent('contact', 'address', e.target.value)} className="input-field" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="input-label">Telepon</label>
                                    <input type="text" value={content.contact.phone || ''} onChange={(e) => updateContent('contact', 'phone', e.target.value)} className="input-field" />
                                </div>
                                <div className="space-y-2">
                                    <label className="input-label">Email</label>
                                    <input type="text" value={content.contact.email || ''} onChange={(e) => updateContent('contact', 'email', e.target.value)} className="input-field" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="input-label">Google Maps Embed URL</label>
                                <input type="text" value={content.contact.mapEmbedUrl || ''} onChange={(e) => updateContent('contact', 'mapEmbedUrl', e.target.value)} className="input-field font-mono text-xs" />
                            </div>
                        </div>
                        <FormActions id="contact-info-save" />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-6 mb-6">
                         <h4 className="font-serif text-lg font-bold">Tautan Sosial Media</h4>
                         <button onClick={() => addSocialLink({ id: Date.now().toString(), platform: 'Instagram', url: '#' })} className="btn-add"><Plus className="w-4 h-4" /> Tambah Akun</button>
                      </div>

                      <div className="grid gap-4">
                          {socialLinks.map(social => (
                              <div key={social.id} className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                                  <div className="w-1/3">
                                      <select value={social.platform} onChange={(e) => updateSocialLink(social.id, {...social, platform: e.target.value as any})} className="input-field py-2 text-sm bg-white">
                                          <option value="Instagram">Instagram</option>
                                          <option value="Facebook">Facebook</option>
                                          <option value="Twitter">Twitter</option>
                                          <option value="Youtube">Youtube</option>
                                          <option value="TikTok">TikTok</option>
                                          <option value="Website">Website</option>
                                      </select>
                                  </div>
                                  <div className="flex-1">
                                      <input type="text" value={social.url || ''} onChange={(e) => updateSocialLink(social.id, {...social, url: e.target.value})} className="input-field py-2 text-sm font-mono bg-white" placeholder="Profile URL..." />
                                  </div>
                                  <button onClick={() => deleteSocialLink(social.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                              </div>
                          ))}
                      </div>
                      <FormActions id="social-links-save" />
                    </div>
                 </div>
              )}

              {/* Fallback Section */}
              {!['general', 'layout', 'theme', 'navigation', 'heritage', 'news', 'tickets', 'contact', 'arts', 'destinations', 'organization', 'hero', 'map', 'portals', 'users'].includes(activeSection) && (
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
                              {sectionOrder
                                .filter(key => sectionVisibility[key] !== false)
                                .map(key => {
                                  switch (key) {
                                    case 'hero': return <Hero key="hero" />;
                                    case 'map': return <MuseumMap key="map" />;
                                    case 'portals': return <ExternalPortals key="portals" />;
                                    case 'heritage': return <HeritageMain key="heritage" />;
                                    case 'arts': return <ArtsSection key="arts" />;
                                    case 'news': return <NewsSection key="news" />;
                                    case 'attractions': return <Attractions key="attractions" />;
                                    case 'info': return <InfoSection key="info" />;
                                    default: return null;
                                  }
                                })}
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
