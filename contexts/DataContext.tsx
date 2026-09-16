
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Attraction, SiteContent, Language, NewsItem, NewsConfig, MuseumItem, SocialLink, ExternalLink, NavItem, SectionKey, User, TicketItem, HeroSlide, ArtItem, ThemeColors, VisitorStats } from '../types';
import { fetchNewsFromSheet } from '../services/googleSheets';
import { db, auth, handleFirestoreError, OperationType } from '../src/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, getDoc, increment } from 'firebase/firestore';

interface DataContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (isOpen: boolean) => void;
  visitorStats: VisitorStats;
  
  // News Detail State
  selectedNewsId: string | null;
  setSelectedNewsId: (id: string | null) => void;

  // Auth
  isAuthenticated: boolean;
  currentUser: User | null;
  users: User[];
  login: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<{success: boolean, error?: string}>;
  logout: () => Promise<void>;
  addUser: (user: User) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  resetPassword: (email: string, newPass: string) => boolean;

  content: SiteContent;
  updateContent: (section: keyof SiteContent, field: string, value: any, lang?: Language) => void;
  updateTheme: (colors: ThemeColors) => void;
  
  // Hero CRUD
  addHeroSlide: (slide: HeroSlide) => void;
  updateHeroSlide: (id: string, slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;

  // Ticket CRUD
  addTicket: (item: TicketItem) => void;
  updateTicket: (id: string, item: TicketItem) => void;
  deleteTicket: (id: string) => void;

  // Arts CRUD
  addArtItem: (item: ArtItem) => void;
  updateArtItem: (id: string, item: ArtItem) => void;
  deleteArtItem: (id: string) => void;

  navItems: NavItem[];
  addNavItem: (item: NavItem) => void;
  updateNavItem: (id: string, item: NavItem) => void;
  deleteNavItem: (id: string) => void;
  reorderNavItems: (items: NavItem[]) => void;

  // Heritage Tabs Control
  activeHeritageTab: 'tangible' | 'intangible';
  setActiveHeritageTab: (tab: 'tangible' | 'intangible') => void;

  // Info Section Tabs Control (New)
  activeInfoTab: 'tickets' | 'vision' | 'org' | 'map';
  setActiveInfoTab: (tab: 'tickets' | 'vision' | 'org' | 'map') => void;

  sectionOrder: SectionKey[];
  sectionVisibility: Record<SectionKey, boolean>;
  reorderSections: (order: SectionKey[]) => Promise<void>;
  toggleSectionVisibility: (key: SectionKey) => Promise<void>;
  saveLayout: (order: SectionKey[], visibility: Record<SectionKey, boolean>) => Promise<void>;
  resetLayout: () => Promise<void>;

  attractions: Attraction[];
  addAttraction: (attraction: Attraction) => void;
  updateAttraction: (id: string, attraction: Attraction) => void;
  deleteAttraction: (id: string) => void;

  news: NewsItem[];
  newsConfig: NewsConfig;
  updateNewsConfig: (config: NewsConfig) => void;
  addNews: (item: NewsItem) => void;
  updateNews: (id: string, item: NewsItem) => void;
  deleteNews: (id: string) => void;

  museums: MuseumItem[];
  addMuseum: (item: MuseumItem) => void;
  updateMuseum: (id: string, updated: MuseumItem) => void;
  deleteMuseum: (id: string) => void;

  socialLinks: SocialLink[];
  addSocialLink: (item: SocialLink) => void;
  updateSocialLink: (id: string, item: SocialLink) => void;
  deleteSocialLink: (id: string) => void;

  externalLinks: ExternalLink[];
  addExternalLink: (item: ExternalLink) => void;
  updateExternalLink: (id: string, item: ExternalLink) => void;
  deleteExternalLink: (id: string) => void;
}

const defaultSectionOrder: SectionKey[] = [
  'hero', 'map', 'portals', 'heritage', 'arts', 'news', 'attractions', 'info'
];

const defaultSectionVisibility: Record<SectionKey, boolean> = {
  hero: true,
  map: true,
  portals: true,
  heritage: true,
  arts: true,
  news: true,
  attractions: true,
  info: true
};

const defaultContent: SiteContent = {
  branding: {
    logoUrl: '',
    siteName: 'SAWAHLUNTO',
    subTitle: 'UNESCO Heritage'
  },
  theme: {
    primary: '#C5A059',
    secondary: '#8B4513',
    background: '#F5F5F0',
    dark: '#1C1C1C'
  },
  hero: {
    slides: [
      {
        id: '1',
        subtitle: { en: 'West Sumatra, Indonesia', id: 'Sumatera Barat, Indonesia' },
        title: { en: 'The Memory of The Black Pearl', id: 'Kenangan Mutiara Hitam' },
        description: { 
          en: 'Discover the Ombilin Coal Mining Heritage, a testament to industrial history woven into a lush tropical landscape.',
          id: 'Temukan Warisan Tambang Batubara Ombilin, bukti sejarah industri yang terjalin dalam lanskap tropis yang subur.'
        },
        cta: { en: 'Discover Story', id: 'Temukan Cerita' },
        bgImageUrl: 'https://picsum.photos/1920/1080?grayscale'
      },
      {
        id: '2',
        subtitle: { en: 'Cultural Heritage', id: 'Warisan Budaya' },
        title: { en: 'Songket Silungkang', id: 'Songket Silungkang' },
        description: { 
          en: 'Experience the beauty of traditional hand-woven fabrics known for their intricate motifs and vibrant colors.',
          id: 'Nikmati keindahan kain tenun tradisional yang dikenal dengan motif rumit dan warna-warna cerahnya.'
        },
        cta: { en: 'View Gallery', id: 'Lihat Galeri' },
        bgImageUrl: 'https://picsum.photos/1920/1080?random=hero2'
      }
    ]
  },
  history: {
    sectionTitle: { en: 'Tangible Heritage', id: 'Warisan Benda' },
    title: { en: 'A Living Museum of Industrial History', id: 'Museum Hidup Sejarah Industri' },
    description1: {
      en: 'Sawahlunto is not just a city; it is a time capsule. Once a quiet valley, it transformed into a bustling coal mining town during the Dutch colonial era in the late 19th century.',
      id: 'Sawahlunto bukan sekadar kota; ini adalah kapsul waktu. Dulunya lembah sunyi, berubah menjadi kota tambang batubara yang ramai pada era kolonial Belanda di akhir abad ke-19.'
    },
    description2: {
      en: 'Recognized as a UNESCO World Heritage Site, the Ombilin Coal Mining Heritage features an integrated system of mines, railways, and company towns that demonstrates the technological exchange between the West and the East.',
      id: 'Diakui sebagai Situs Warisan Dunia UNESCO, Warisan Tambang Batubara Ombilin menampilkan sistem terintegrasi tambang, kereta api, dan kota perusahaan yang menunjukkan pertukaran teknologi antara Barat dan Timur.'
    },
    linkUrl: '#',
    imageUrl: 'https://picsum.photos/400/600?random=101'
  },
  culture: {
    sectionTitle: { en: 'Intangible Heritage', id: 'Warisan Takbenda' },
    title: { en: 'Songket Silungkang', id: 'Songket Silungkang' },
    description: {
      en: 'Beyond the mines, Sawahlunto is home to the exquisite Songket Silungkang. This traditional hand-woven fabric is known for its intricate motifs and vibrant colors.',
      id: 'Di luar tambang, Sawahlunto adalah rumah bagi Songket Silungkang yang indah. Kain tenun tradisional ini dikenal dengan motif rumit dan warna-warna cerahnya.'
    },
    linkUrl: '#',
    imageUrl: 'https://picsum.photos/600/400?random=10'
  },
  arts: {
    sectionTitle: { en: 'CULTURAL INSTITUTIONS', id: 'LEMBAGA KEBUDAYAAN' },
    description: {
       en: 'Cultural institutions, traditional art studios, and community heritage groups preserving the unique living heritage and multicultural traditions of Sawahlunto.',
       id: 'Lembaga kebudayaan, sanggar seni tradisi, paguyuban adat, dan komunitas pelestari yang merawat warisan budaya hidup serta keberagaman seni Kota Sawahlunto.'
    },
    items: [
        {
            id: '1',
            title: { en: 'Randai & Traditional Folk Theater Studio', id: 'Sanggar Randai & Teater Tradisi Ombilin' },
            category: { en: 'Traditional Arts Studio', id: 'Sanggar Seni Tradisional' },
            date: 'Terdaftar & Aktif',
            description: { 
              en: 'A premier cultural institution dedicated to preserving Minangkabau traditional folk theater that seamlessly blends martial arts (silek), poetic chanting (dendang kaba), dramatic storytelling, and rhythmic tap of galembong pants.', 
              id: 'Lembaga pelestari seni teater rakyat tradisional Minangkabau yang memadukan gerakan pencak silat (silek), tembang dendang kaba, seni peran dramatik, dan tepukan celana galembong yang rancak.' 
            },
            imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
            listItems: [
              { id: 'Pelatihan Rutin Tari & Silek Galembong bagi Generasi Muda Sawahlunto', en: 'Routine Dance & Silek Training for Sawahlunto Youth Generation' },
              { id: 'Pementasan Lakon Kaba Klasik (Cindua Mato, Malin Deman, Anggun Nan Tongga)', en: 'Staging of Classic Folk Tales & Dramatic Narratives' },
              { id: 'Partisipasi Utama pada Sawahlunto International Music & Heritage Festival (SIMFest)', en: 'Main Performer at Sawahlunto International Music & Heritage Festival (SIMFest)' },
              { id: 'Edukasi dan Pembinaan Teater Tradisi ke Sekolah-Sekolah Kota', en: 'Cultural Education Programs across Local Schools and Community Centers' }
            ],
            tableData: [
              {
                no: 1,
                description: { id: 'Pelatihan Silek & Randai Remaja', en: 'Youth Silek & Randai Training' },
                notes: { id: 'Setiap Sabtu & Minggu (16:00 - 18:00 WIB)', en: 'Every Saturday & Sunday (16:00 - 18:00)' }
              },
              {
                no: 2,
                description: { id: 'Pementasan Lakon Kaba Minangkabau', en: 'Minangkabau Folk Tale Staging' },
                notes: { id: 'Agenda SIMFest & Event Budaya Kota', en: 'SIMFest & City Cultural Calendar' }
              },
              {
                no: 3,
                description: { id: 'Workshop Celana Galembong & Tembang', en: 'Galembong Pants & Chanting Workshop' },
                notes: { id: 'Terbuka untuk Pelajar & Umum', en: 'Open for Students & Public' }
              }
            ],
            leader: 'Mak Katik & Dewan Kesenian Kota',
            location: { id: 'Kecamatan Lembah Segar, Kota Sawahlunto', en: 'Lembah Segar District, Sawahlunto' },
            contact: '+62 812-7654-3210'
        },
        {
            id: '2',
            title: { en: 'Traditional Minangkabau Dance & Percussion Center', id: 'Sanggar Tari Tradisional & Musik Talempong' },
            category: { en: 'Dance & Music Community', id: 'Komunitas Tari & Musik Tradisi' },
            date: 'Terdaftar & Aktif',
            description: { 
              en: 'Center for cultivating classic Minangkabau performing arts, showcasing dynamic Tari Piring (plate dance on broken shards), ceremonial Tari Pasambahan, and energetic Talempong percussion.', 
              id: 'Wadah pembinaan dan pementasan seni tari klasik khas Minangkabau, seperti Tari Piring di atas pecahan kaca, Tari Pasambahan penyambutan tamu kehormatan, dan ensambel musik Talempong Pacik.' 
            },
            imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
            listItems: [
              { id: 'Pembinaan Sanggar Tari Anak dan Remaja Putri Kota Sawahlunto', en: 'Training Classes for Children and Youth Dancers' },
              { id: 'Penyambutan Resmi Tamu Kenegaraan & Delegasi Warisan Budaya UNESCO', en: 'Official Welcoming Ceremonies for State Guests and UNESCO Delegations' },
              { id: 'Pentas Kolaborasi Musik Talempong Pacik dan Gandang Tambua', en: 'Collaborative Performances with Talempong and Tambua Percussion' },
              { id: 'Konservasi Gerak Tari Pusaka Silungkang dan Talawi', en: 'Conservation of Indigenous Silungkang and Talawi Dance Repertoires' }
            ],
            tableData: [
              {
                no: 1,
                description: { id: 'Kelas Tari Piring & Tari Pasambahan', en: 'Plate & Pasambahan Dance Classes' },
                notes: { id: 'Tingkat Dasar & Mahir (Aktif)', en: 'Basic & Advanced Level (Active)' }
              },
              {
                no: 2,
                description: { id: 'Ensambel Musik Talempong Pacik', en: 'Talempong Pacik Ensemble' },
                notes: { id: 'Latihan Rutin Rabu & Jumat Malam', en: 'Routine Rehearsal Wed & Fri Evening' }
              },
              {
                no: 3,
                description: { id: 'Protokoler Penyambutan Tamu Resmi', en: 'Official Guest Welcoming Protocol' },
                notes: { id: 'Koordinasi Dinas Kebudayaan', en: 'Coordinated with Culture Dept' }
              }
            ],
            leader: 'Ibu Ratna Juwita, S.Sn.',
            location: { id: 'Kecamatan Talawi, Kota Sawahlunto', en: 'Talawi District, Sawahlunto' },
            contact: '+62 813-9876-5432'
        },
        {
            id: '3',
            title: { en: 'Javanese Heritage & Kuda Kepang Cultural Troupe', id: 'Paguyuban Seni Kuda Kepang & Karawitan Ombilin' },
            category: { en: 'Multicultural Heritage Group', id: 'Paguyuban Akulturasi Budaya' },
            date: 'Terdaftar & Aktif',
            description: { 
              en: 'A historic cultural troupe preserving the multicultural heritage of Javanese mining laborers (Orang Rantai) in Sawahlunto through traditional gamelan karawitan, shadow puppetry, and spirited Kuda Kepang dance.', 
              id: 'Paguyuban kesenian yang merawat warisan akulturasi budaya pekerja tambang batubara (Orang Rantai) di Sawahlunto, melestarikan seni gamelan karawitan Jawa, wayang, dan tari Kuda Kepang.' 
            },
            imageUrl: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=800',
            listItems: [
              { id: 'Latihan Bersama Musik Karawitan & Gamelan Jawa Tiap Pekan', en: 'Weekly Gamelan Karawitan Practice Sessions' },
              { id: 'Pementasan Kuda Kepang Kolosal pada Peringatan Hari Jadi Kota Sawahlunto', en: 'Massive Kuda Kepang Performances at City Anniversary Celebrations' },
              { id: 'Dokumentasi Sejarah Lisan Akulturasi Musik Pekerja Tambang Kolonial', en: 'Oral History & Ethnomusicology Documentation of Coal Mine Laborers' },
              { id: 'Pelestarian Busana Adat, Reog, dan Piranti Musik Antargenerasi', en: 'Intergenerational Preservation of Costumes and Musical Instruments' }
            ],
            tableData: [
              {
                no: 1,
                description: { id: 'Latihan Gamelan & Karawitan Jawa', en: 'Javanese Gamelan & Karawitan Practice' },
                notes: { id: 'Malam Minggu di Gedung Pertemuan', en: 'Saturday Night at Community Hall' }
              },
              {
                no: 2,
                description: { id: 'Atraksi Seni Tari Kuda Kepang Kolosal', en: 'Massive Kuda Kepang Performance' },
                notes: { id: 'Peringatan Hari Jadi Kota & Festival', en: 'City Anniversary & Festival Events' }
              },
              {
                no: 3,
                description: { id: 'Inventarisasi Busana & Piranti Adat', en: 'Costume & Heritage Instrument Care' },
                notes: { id: 'Terawat 100% Asli Warisan Tambang', en: '100% Preserved Mining Heritage' }
              }
            ],
            leader: 'Ki Sastro Hardjono',
            location: { id: 'Kelurahan Saringan, Kota Sawahlunto', en: 'Saringan Village, Sawahlunto' },
            contact: '+62 821-3456-7891'
        },
        {
            id: '4',
            title: { en: 'Silungkang Songket Weaving & Traditional Crafts Guild', id: 'Asosiasi Perajin Tenun Songket Silungkang' },
            category: { en: 'Traditional Craft & Intangible Heritage', id: 'Lembaga Kriya & Warisan Takbenda' },
            date: 'Terdaftar & Aktif',
            description: { 
              en: 'An artisan guild preserving the intricate art of handloom Songket Silungkang weaving, an internationally renowned intangible cultural heritage of Sawahlunto.', 
              id: 'Lembaga perajin yang menaungi pelestarian seni tenun tangan Songket Silungkang warisan budaya takbenda Sawahlunto yang termasyhur dengan keanggunan motif benang emas dan perak.' 
            },
            imageUrl: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&q=80&w=800',
            listItems: [
              { id: 'Pelatihan Tenun Tradisional Menggunakan Alat Tenun Bukan Mesin (ATBM)', en: 'Traditional Weaving Workshops using Non-Machine Hand Looms' },
              { id: 'Dokumentasi & Konservasi Motif Kuno (Pucuak Rabuang, Saik Galamai, Kaluak Paku)', en: 'Documentation & Conservation of Heritage Motifs' },
              { id: 'Pengembangan Sentra Galeri Edukasi & Wisata Tenun Budaya Silungkang', en: 'Educational Center & Cultural Weaving Tourism Development' },
              { id: 'Pemberdayaan Ekonomi Kreatif Kaum Perempuan Pengrajin Lokal', en: 'Creative Economic Empowerment for Local Women Artisans' }
            ],
            tableData: [
              {
                no: 1,
                description: { id: 'Pelatihan Tenun ATBM Tradisional', en: 'Traditional Handloom Weaving Workshop' },
                notes: { id: 'Regenerasi Penenun Muda Berkelanjutan', en: 'Continuous Youth Weaver Training' }
              },
              {
                no: 2,
                description: { id: 'Konservasi Motif Kuno Silungkang', en: 'Silungkang Heritage Motif Conservation' },
                notes: { id: 'Pucuak Rabuang, Kaluak Paku, Saik Galamai', en: 'Classic Motifs Cataloging' }
              },
              {
                no: 3,
                description: { id: 'Pusat Kurasi Produk & Galeri Budaya', en: 'Product Curation & Cultural Gallery' },
                notes: { id: 'Buka Setiap Hari (08:30 - 17:00 WIB)', en: 'Open Daily (08:30 - 17:00)' }
              }
            ],
            leader: 'Hj. Rosmini & Tim Perajin Silungkang',
            location: { id: 'Kecamatan Silungkang, Kota Sawahlunto', en: 'Silungkang District, Sawahlunto' },
            contact: '+62 852-6789-0123'
        }
    ]
  },
  tickets: {
    openingHours: { en: 'Daily, 08:00 AM - 05:00 PM', id: 'Setiap Hari, 08:00 - 17:00 WIB' },
    items: [
        {
            id: 'adult',
            title: { en: 'Adult', id: 'Dewasa' },
            category: { en: 'Domestic', id: 'Domestik' },
            price: 10000,
            imageUrl: 'https://picsum.photos/400/200?random=t1'
        },
        {
            id: 'child',
            title: { en: 'Child', id: 'Anak-anak' },
            category: { en: 'Domestic', id: 'Domestik' },
            price: 5000,
            imageUrl: 'https://picsum.photos/400/200?random=t2'
        },
        {
            id: 'tourist',
            title: { en: 'Tourist', id: 'Wisman' },
            category: { en: 'International', id: 'Mancanegara' },
            price: 50000,
            imageUrl: 'https://picsum.photos/400/200?random=t3'
        }
    ]
  },
  organization: {
    vision: { 
      en: 'To become a leading world-class cultural heritage tourism destination.',
      id: 'Menjadi destinasi wisata warisan budaya kelas dunia yang unggul.'
    },
    mission: {
      en: 'Preserving historical assets, empowering local communities, and promoting sustainable tourism.',
      id: 'Melestarikan aset sejarah, memberdayakan masyarakat lokal, dan mempromosikan pariwisata berkelanjutan.'
    },
    profile: {
      en: 'The Department of Culture of Sawahlunto City is the government agency responsible for the preservation, management, and promotion of cultural heritage assets.',
      id: 'Dinas Kebudayaan Kota Sawahlunto adalah instansi pemerintah yang bertanggung jawab atas pelestarian, pengelolaan, dan promosi aset warisan budaya.'
    },
    structureImageUrl: 'https://picsum.photos/800/400?random=org'
  },
  contact: {
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31913.3642363573!2d100.75879899380922!3d-0.6756854743202579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2b4c1638202b85%3A0x4039d80b220d1c0!2sSawahlunto%2C%20Sawahlunto%20City%2C%20West%20Sumatra!5e0!3m2!1sen!2sid!4v1709428543212!5m2!1sen!2sid',
    address: 'Jl. Soekarno Hatta, Lubang Panjang, Sawahlunto, West Sumatra 27418',
    phone: '+62 754 61000',
    email: 'culture@sawahlunto.go.id'
  }
};

const defaultNavItems: NavItem[] = [
  { id: 'home', label: { en: 'Home', id: 'Beranda' }, href: '#hero' },
  { id: 'map', label: { en: 'Map', id: 'Peta' }, href: '#map' },
  { id: 'heritage', label: { en: 'Heritage', id: 'Warisan' }, href: '#heritage' },
  { id: 'arts', label: { en: 'Cultural Institutions', id: 'Lembaga Kebudayaan' }, href: '#arts' },
  { id: 'destinations', label: { en: 'Destinations', id: 'Destinasi' }, href: '#destinations' },
  { id: 'tickets', label: { en: 'Tickets', id: 'Tiket' }, href: '#info' },
  { id: 'news', label: { en: 'News', id: 'Berita' }, href: '#news' },
  { id: 'info', label: { en: 'Info', id: 'Info' }, href: '#info' },
  { id: 'contact', label: { en: 'Contact', id: 'Kontak' }, href: '#footer' },
];

const defaultSocials: SocialLink[] = [
  { id: '1', platform: 'Instagram', url: 'https://instagram.com' },
  { id: '2', platform: 'Twitter', url: 'https://x.com' },
  { id: '3', platform: 'Facebook', url: 'https://facebook.com' },
  { id: '4', platform: 'TikTok', url: 'https://tiktok.com' },
  { id: '5', platform: 'Youtube', url: 'https://youtube.com' }
];

const defaultMuseums: MuseumItem[] = [
  {
    id: 'mbah-soero',
    name: { en: 'Mbah Soero Tunnel', id: 'Lubang Mbah Soero' },
    description: { en: 'Historic coal mining tunnel.', id: 'Terowongan tambang batubara bersejarah.' },
    embedQuery: 'Lubang+Tambang+Mbah+Soero',
    lat: -0.677892,
    lng: 100.779421,
    address: { id: 'Jl. Abdurrahman Hakim, Tanah Lapang, Kec. Lembah Segar, Sawahlunto', en: 'Jl. Abdurrahman Hakim, Tanah Lapang, Lembah Segar, Sawahlunto' },
    googleMapsUrl: 'https://maps.google.com/?q=Lubang+Tambang+Mbah+Soero+Sawahlunto',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1614083391204!6m8!1m7!1sCAoSLEFGMVFpcE5wc1p2c2h3Z1l2S1p2c2h3Z1l2S1p2!2m2!1d-0.675!2d100.758!3f248.88!4f1.95!5f0.7820865974627469',
    contactName: 'Bapak Budi',
    contactPhone: '+62 812 3456 7890',
    vision: { en: 'To preserve the history of coal mining.', id: 'Melestarikan sejarah penambangan batubara.' },
    mission: { en: 'Educate the public about the heritage of Mbah Soero.', id: 'Mendidik masyarakat tentang warisan Mbah Soero.' },
    ticketPrices: [
      { id: '1', category: { en: 'Adult', id: 'Dewasa' }, price: 15000 },
      { id: '2', category: { en: 'Child', id: 'Anak-anak' }, price: 5000 },
      { id: '3', category: { en: 'International', id: 'Mancanegara' }, price: 50000 }
    ]
  },
  {
    id: 'goedang-ransoem',
    name: { en: 'Goedang Ransoem Museum', id: 'Museum Goedang Ransoem' },
    description: { en: 'Former public kitchen.', id: 'Bekas dapur umum.' },
    embedQuery: 'Museum+Goedang+Ransoem',
    lat: -0.681734,
    lng: 100.778789,
    address: { id: 'Jl. Abdul Rahman Hakim No. 4, Air Dingin, Lembah Segar, Sawahlunto', en: 'Jl. Abdul Rahman Hakim No. 4, Air Dingin, Lembah Segar, Sawahlunto' },
    googleMapsUrl: 'https://maps.google.com/?q=Museum+Goedang+Ransoem+Sawahlunto',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1614083391204!6m8!1m7!1sCAoSLEFGMVFpcE5wc1p2c2h3Z1l2S1p2c2h3Z1l2S1p2!2m2!1d-0.675!2d100.758!3f0!4f0!5f0.7820865974627469',
    contactName: 'Ibu Siti',
    contactPhone: '+62 813 4567 8901',
    vision: { en: 'To showcase the culinary history of the mining era.', id: 'Menampilkan sejarah kuliner era penambangan.' },
    mission: { en: 'Preserve the artifacts and stories of the public kitchen.', id: 'Melestarikan artefak dan cerita dapur umum.' },
    ticketPrices: [
      { id: '1', category: { en: 'Adult', id: 'Dewasa' }, price: 10000 },
      { id: '2', category: { en: 'Child', id: 'Anak-anak' }, price: 5000 },
      { id: '3', category: { en: 'International', id: 'Mancanegara' }, price: 50000 }
    ]
  },
  {
    id: 'kereta-api',
    name: { en: 'Railway Museum', id: 'Museum Kereta Api' },
    description: { en: 'History of coal transport.', id: 'Sejarah kereta pengangkut batubara.' },
    embedQuery: 'Museum+Kereta+Api+Sawahlunto',
    lat: -0.681121,
    lng: 100.776142,
    address: { id: 'Jl. Ahmad Yani, Pasar, Kec. Lembah Segar, Sawahlunto', en: 'Jl. Ahmad Yani, Pasar, Lembah Segar, Sawahlunto' },
    googleMapsUrl: 'https://maps.google.com/?q=Museum+Kereta+Api+Sawahlunto',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1614083391204!6m8!1m7!1sCAoSLEFGMVFpcE5wc1p2c2h3Z1l2S1p2c2h3Z1l2S1p2!2m2!1d-0.675!2d100.758!3f248.88!4f1.95!5f0.7820865974627469',
    contactName: 'Bapak Andi',
    contactPhone: '+62 811 2345 6789',
    vision: { en: 'To celebrate the railway heritage of West Sumatra.', id: 'Merayakan warisan kereta api Sumatera Barat.' },
    mission: { en: 'Maintain and exhibit historic locomotives and carriages.', id: 'Memelihara dan memamerkan lokomotif dan gerbong bersejarah.' },
    ticketPrices: [
      { id: '1', category: { en: 'Adult', id: 'Dewasa' }, price: 10000 },
      { id: '2', category: { en: 'Child', id: 'Anak-anak' }, price: 5000 },
      { id: '3', category: { en: 'International', id: 'Mancanegara' }, price: 50000 }
    ]
  },
  {
    id: 'cultural-center',
    name: { en: 'Cultural Center', id: 'Gedung Pusat Kebudayaan' },
    description: { en: 'Center for arts.', id: 'Pusat seni.' },
    embedQuery: 'Gedung+Pusat+Kebudayaan+Sawahlunto',
    lat: -0.680323,
    lng: 100.778210,
    address: { id: 'Jl. Jenderal Sudirman No. 1, Sawahlunto', en: 'Jl. Jenderal Sudirman No. 1, Sawahlunto' },
    googleMapsUrl: 'https://maps.google.com/?q=Gedung+Pusat+Kebudayaan+Sawahlunto',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1614083391204!6m8!1m7!1sCAoSLEFGMVFpcE5wc1p2c2h3Z1l2S1p2c2h3Z1l2S1p2!2m2!1d-0.675!2d100.758!3f0!4f0!5f0.7820865974627469',
    contactName: 'Ibu Ratna',
    contactPhone: '+62 815 6789 0123',
    ticketPrices: [
      { id: '1', category: { en: 'Adult', id: 'Dewasa' }, price: 10000 },
      { id: '2', category: { en: 'Child', id: 'Anak-anak' }, price: 5000 },
      { id: '3', category: { en: 'International', id: 'Mancanegara' }, price: 50000 }
    ]
  }
];

const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: { en: 'Sawahlunto Cultural Festival 2024', id: 'Festival Budaya Sawahlunto 2024' },
    date: '2024-05-15',
    summary: { en: 'Join us for a week of traditional music and dance.', id: 'Bergabunglah untuk sepekan musik dan tari tradisional.' },
    content: { en: 'Full content...', id: 'Konten lengkap...' },
    imageUrl: 'https://picsum.photos/400/300?random=news1'
  },
  {
    id: '2',
    title: { en: 'New Mining Museum Exhibit', id: 'Pameran Baru Museum Tambang' },
    date: '2024-06-01',
    summary: { en: 'Discover the tools used by miners in the 1900s.', id: 'Temukan alat-alat yang digunakan penambang tahun 1900an.' },
    content: { en: 'Full content...', id: 'Konten lengkap...' },
    imageUrl: 'https://picsum.photos/400/300?random=news2'
  }
];

const defaultExternalLinks: ExternalLink[] = [
  {
    id: '1',
    title: { en: 'Virtual Tour 360', id: 'Tur Virtual 360' },
    description: { en: 'Experience the heritage sites from your home.', id: 'Nikmati situs warisan dari rumah Anda.' },
    url: '#',
    imageUrl: 'https://picsum.photos/600/300?random=vtour',
    buttonText: { en: 'Start Tour', id: 'Mulai Tur' }
  },
  {
    id: '2',
    title: { en: 'E-Ticket Reservation', id: 'Reservasi E-Tiket' },
    description: { en: 'Book your entrance tickets online.', id: 'Pesan tiket masuk Anda secara online.' },
    url: '#',
    imageUrl: 'https://picsum.photos/600/300?random=ticket',
    buttonText: { en: 'Book Now', id: 'Pesan Sekarang' }
  }
];

const defaultUser: User = {
    id: 'super-admin-1',
    username: 'admin',
    email: 'admin@sawahlunto.go.id',
    password: 'admin',
    role: 'super_admin',
    fullName: 'Super Administrator'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
  const [activeHeritageTab, setActiveHeritageTab] = useState<'tangible' | 'intangible'>('tangible');
  const [activeInfoTab, setActiveInfoTab] = useState<'tickets' | 'vision' | 'org' | 'map'>('tickets');
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(defaultSectionOrder);
  const [sectionVisibility, setSectionVisibility] = useState<Record<SectionKey, boolean>>(defaultSectionVisibility);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsConfig, setNewsConfig] = useState<NewsConfig>({ source: 'local', sheetUrl: '' });
  const [museums, setMuseums] = useState<MuseumItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocials);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    today: 142,
    total: 38920,
    online: 3
  });

  // Initialize users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('internal_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Seed default admin if empty
      const defaultUsers = [defaultUser];
      localStorage.setItem('internal_users', JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  }, []);

  // Update localStorage whenever users change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('internal_users', JSON.stringify(users));
    }
  }, [users]);

  // Read current user session on load
  useEffect(() => {
    const sessionToken = localStorage.getItem('internal_session');
    if (sessionToken) {
      const activeUser = users.find(u => u.username === sessionToken);
      if (activeUser) setCurrentUser(activeUser);
    }
    setIsAuthReady(true);
  }, [users]);


  useEffect(() => {
    if (!isAuthReady) return;


    // Sync settings
    const settingsKeys = ['branding', 'hero', 'history', 'culture', 'organization', 'tickets', 'contact', 'theme', 'arts', 'layout'] as const;
    const unsubSettings = settingsKeys.map(key => 
      onSnapshot(doc(db, 'settings', key), (docSnap) => {
        if (docSnap.exists()) {
          if (key === 'layout') {
            const data = docSnap.data();
            if (Array.isArray(data.sections) && data.sections.length > 0) {
              const currentSections: SectionKey[] = data.sections;
              const missingSections = defaultSectionOrder.filter(s => !currentSections.includes(s));
              setSectionOrder([...currentSections, ...missingSections]);
            }
            if (data.visibility && typeof data.visibility === 'object') {
              setSectionVisibility({ ...defaultSectionVisibility, ...data.visibility });
            }
          } else {
            setContent(prev => ({ ...prev, [key]: { ...prev[key as keyof SiteContent], ...docSnap.data() } }));
          }
        } else if (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') {
          // Seed default content if not exists and user is admin
          if (key === 'layout') {
            setDoc(doc(db, 'settings', 'layout'), { sections: defaultSectionOrder, visibility: defaultSectionVisibility }).catch(e => console.error("Failed to seed layout", e));
          } else {
            setDoc(doc(db, 'settings', key), defaultContent[key as keyof SiteContent]).catch(e => console.error("Failed to seed settings", e));
          }
        }
      }, (error) => handleFirestoreError(error, OperationType.GET, `settings/${key}`))
    );

    // Sync collections
    const unsubNews = onSnapshot(collection(db, 'news'), (snapshot) => {
      if (snapshot.empty) {
        if (currentUser?.role === 'admin') {
          defaultNews.forEach(item => setDoc(doc(db, 'news', item.id), item).catch(e => console.error(e)));
        }
        setLocalNews(defaultNews);
      } else {
        const data: NewsItem[] = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as NewsItem));
        setLocalNews(data);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'news'));

    const unsubAttractions = onSnapshot(collection(db, 'attractions'), (snapshot) => {
      if (snapshot.empty) {
        const defaultAttractions: Attraction[] = [
          {
            id: 'goedang-ransoem',
            title: { en: 'Museum Goedang Ransoem', id: 'Museum Goedang Ransoem' },
            category: 'History',
            description: { 
              en: 'The legendary central steam-powered kitchen complex built in 1918 to feed thousands of coal miners and hospital patients.', 
              id: 'Kompleks dapur umum uap raksasa masa kolonial (dibangun 1918) yang memasak ribuan porsi makanan setiap hari untuk para pekerja tambang dan pasien RS.' 
            },
            imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800',
            images: [
              'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1590059390046-562a1296b1d4?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
            ],
            location: { id: 'Kelurahan Air Dingin, Lembah Segar', en: 'Air Dingin, Lembah Segar' },
            operatingHours: { id: '08.00 - 16.00 WIB', en: '08:00 AM - 04:00 PM' },
            highlights: [
              { id: 'Tungku uap raksasa buatan Jerman & Belanda', en: 'Giant German & Dutch steam kettles' },
              { id: 'Koleksi peralatan masak kuno & foto arsip', en: 'Vintage culinary tools & archival photos' },
              { id: 'Monumen Warisan Tambang Batubara Ombilin', en: 'Ombilin Coal Mining Heritage monument' }
            ]
          },
          {
            id: 'mbah-soero',
            title: { en: 'Lubang Tambang Mbah Soero', id: 'Lubang Tambang Mbah Soero' },
            category: 'History',
            description: { 
              en: 'Historic underground coal mining tunnel dating back to 1898, equipped with safety gear and guided historical narration.', 
              id: 'Terowongan tambang batubara bawah tanah bersejarah era 1898 sepanjang ratusan meter, dilengkapi perlengkapan safety dan galeri edukasi tambang.' 
            },
            imageUrl: 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?auto=format&fit=crop&q=80&w=800',
            images: [
              'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800'
            ],
            location: { id: 'Tanah Lapang, Lembah Segar', en: 'Tanah Lapang, Lembah Segar' },
            operatingHours: { id: '08.30 - 17.00 WIB', en: '08:30 AM - 05:00 PM' },
            highlights: [
              { id: 'Masuk ke dalam terowongan tambang bawah tanah asli', en: 'Explore authentic underground mining tunnels' },
              { id: 'Gedung Info Box & Galeri Mbah Soero', en: 'Info Box center & Mbah Soero gallery' },
              { id: 'Rompi & helm tambang standar keselamatan', en: 'Safety mining helmets and vest experience' }
            ]
          },
          {
            id: 'museum-kereta-api',
            title: { en: 'Museum Kereta Api Sawahlunto', id: 'Museum Kereta Api Sawahlunto' },
            category: 'History',
            description: { 
              en: 'The second oldest railway museum in Indonesia, home to the legendary steam locomotive Mak Itam (E1060).', 
              id: 'Museum perkeretaapian tertua kedua di Indonesia, rumah bagi lokomotif uap legendaris bergigi Mak Itam (E1060) dan stasiun bersejarah.' 
            },
            imageUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800',
            images: [
              'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800'
            ],
            location: { id: 'Jl. Ahmad Yani, Pasar Remaja', en: 'Jl. Ahmad Yani, Pasar Remaja' },
            operatingHours: { id: '08.00 - 16.30 WIB', en: '08:00 AM - 04:30 PM' },
            highlights: [
              { id: 'Lokomotif uap bergerigi legendaris Mak Itam (E1060)', en: 'Legendary Mak Itam steam cog engine (E1060)' },
              { id: 'Koleksi lonceng, telegraf, dan sinyal mekanik kuno', en: 'Vintage bells, telegraphs, and mechanical signals' },
              { id: 'Bangunan stasiun kolonial asli tahun 1918', en: 'Authentic 1918 colonial station architecture' }
            ]
          },
          {
            id: 'galeri-kebudayaan',
            title: { en: 'Galeri Seni & Museum Kebudayaan', id: 'Museum & Galeri Budaya Sawahlunto' },
            category: 'Culture',
            description: { 
              en: 'Curated exhibition spaces showcasing paintings, archival photographs, mining documents, and Minangkabau ethnographic treasures.', 
              id: 'Ruang pameran kuratorial yang memamerkan lukisan seni rupa, foto arsip kota tua, manuskrip tambang, dan pusaka etnografi Minangkabau.' 
            },
            imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
            images: [
              'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=800'
            ],
            location: { id: 'Kawasan Kota Tua Sawahlunto', en: 'Sawahlunto Old Town Zone' },
            operatingHours: { id: '09.00 - 17.00 WIB', en: '09:00 AM - 05:00 PM' },
            highlights: [
              { id: 'Pameran lukisan maestro & seniman Sawahlunto', en: 'Master paintings & local Sawahlunto artists' },
              { id: 'Dokumentasi arsip kota warisan dunia UNESCO', en: 'UNESCO world heritage archive documentation' },
              { id: 'Koleksi busana tenun songket Silungkang pusaka', en: 'Silungkang handwoven songket heritage textiles' }
            ]
          }
        ];
        if (currentUser?.role === 'admin') {
          defaultAttractions.forEach(item => setDoc(doc(db, 'attractions', item.id), item).catch(e => console.error(e)));
        }
        setAttractions(defaultAttractions);
      } else {
        const data: Attraction[] = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Attraction));
        setAttractions(data);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'attractions'));

    const unsubMuseums = onSnapshot(collection(db, 'museums'), (snapshot) => {
      if (snapshot.empty) {
        if (currentUser?.role === 'admin') {
          defaultMuseums.forEach(item => setDoc(doc(db, 'museums', item.id), item).catch(e => console.error(e)));
        }
        setMuseums(defaultMuseums);
      } else {
        const data: MuseumItem[] = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as MuseumItem));
        setMuseums(data);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'museums'));

    const unsubSocials = onSnapshot(collection(db, 'socialLinks'), (snapshot) => {
      if (snapshot.empty) {
        if (currentUser?.role === 'admin') {
          defaultSocials.forEach(item => setDoc(doc(db, 'socialLinks', item.id), item).catch(e => console.error(e)));
        }
        setSocialLinks(defaultSocials);
      } else {
        const data: SocialLink[] = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as SocialLink));
        if (!data.some(d => d.platform?.toLowerCase() === 'tiktok')) {
          data.push({ id: 'tiktok-link', platform: 'TikTok', url: 'https://tiktok.com' });
        }
        setSocialLinks(data);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'socialLinks'));

    const unsubExternal = onSnapshot(collection(db, 'externalLinks'), (snapshot) => {
      if (snapshot.empty) {
        if (currentUser?.role === 'admin') {
          defaultExternalLinks.forEach(item => setDoc(doc(db, 'externalLinks', item.id), item).catch(e => console.error(e)));
        }
        setExternalLinks(defaultExternalLinks);
      } else {
        const data: ExternalLink[] = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as ExternalLink));
        setExternalLinks(data);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'externalLinks'));

    const unsubNav = onSnapshot(collection(db, 'navItems'), (snapshot) => {
      if (snapshot.empty) {
        if (currentUser?.role === 'admin') {
          defaultNavItems.forEach(item => setDoc(doc(db, 'navItems', item.id), item).catch(e => console.error(e)));
        }
        setNavItems(defaultNavItems);
      } else {
        const data: NavItem[] = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as NavItem));
        setNavItems(data);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'navItems'));

    // Sync arts
    const unsubArts = onSnapshot(collection(db, 'arts'), (snapshot) => {
      if (snapshot.empty) {
        if (currentUser?.role === 'admin') {
          defaultContent.arts.items.forEach(item => setDoc(doc(db, 'arts', item.id), item).catch(e => console.error(e)));
        }
        setContent(prev => ({ ...prev, arts: { ...prev.arts, items: defaultContent.arts.items } }));
      } else {
        const data: ArtItem[] = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as ArtItem));
        setContent(prev => ({ ...prev, arts: { ...prev.arts, items: data } }));
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'arts'));

    // Real-time Visitor Stats Listener
    const visitorDocRef = doc(db, 'analytics', 'visitors');
    const unsubVisitor = onSnapshot(
      visitorDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const todayDateStr = new Date().toISOString().split('T')[0];
          const isSameDay = data.lastDate === todayDateStr;
          
          setVisitorStats({
            today: isSameDay ? (data.today || 1) : 1,
            total: data.total || 38920,
            online: Math.max(1, (data.online || 3)),
            lastDate: todayDateStr
          });
        }
      },
      (error) => {
        console.warn("Analytics listener offline:", error);
      }
    );

    // Record unique session visitor
    const trackSessionVisitor = async () => {
      const sessionKey = 'sawahlunto_visitor_tracked';
      const hasTracked = sessionStorage.getItem(sessionKey);
      const todayDateStr = new Date().toISOString().split('T')[0];

      if (!hasTracked) {
        sessionStorage.setItem(sessionKey, 'true');
        try {
          const snap = await getDoc(visitorDocRef);
          if (!snap.exists()) {
            await setDoc(visitorDocRef, {
              total: 38921,
              today: 1,
              online: Math.floor(Math.random() * 4) + 2,
              lastDate: todayDateStr,
              updatedAt: new Date().toISOString()
            });
          } else {
            const currentData = snap.data();
            const isSameDay = currentData.lastDate === todayDateStr;
            
            await setDoc(visitorDocRef, {
              total: increment(1),
              today: isSameDay ? increment(1) : 1,
              online: Math.floor(Math.random() * 4) + 2,
              lastDate: todayDateStr,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
        } catch (e) {
          console.warn("Analytics track offline:", e);
        }
      }
    };
    trackSessionVisitor();

    return () => {
      unsubSettings.forEach(unsub => unsub());
      unsubNews();
      unsubAttractions();
      unsubMuseums();
      unsubSocials();
      unsubExternal();
      unsubNav();
      unsubArts();
      unsubVisitor();
    };
  }, [isAuthReady, currentUser?.role]);

  useEffect(() => {
    const loadNews = async () => {
        if (newsConfig.source === 'google_sheet' && newsConfig.sheetUrl) {
            try {
                const sheetNews = await fetchNewsFromSheet(newsConfig.sheetUrl);
                if (sheetNews.length > 0) {
                    setNews(sheetNews);
                }
            } catch (e) {
                console.error("Failed to load news from sheet");
            }
        } else {
            setNews(localNews);
        }
    };
    loadNews();
  }, [newsConfig, localNews]);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const loginWithEmail = async (usernameInput: string, pass: string) => {
    try {
      const activeUser = users.find(u => u.username === usernameInput && u.password === pass);
      if (activeUser) {
        setCurrentUser(activeUser);
        localStorage.setItem('internal_session', activeUser.username);
        return { success: true };
      }
      return { success: false, error: 'Username atau kata sandi salah.' };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: 'Terjadi kesalahan sistem' };
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('internal_session');
    setIsAdminOpen(false);
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
    
    // Update session if it's the current user
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...userData } : prev);
      if (userData.username) {
        localStorage.setItem('internal_session', userData.username);
      }
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const resetPassword = (email: string, newPass: string) => {
    return false; // Not supported with Google Auth
  };

  const updateContent = async (section: keyof SiteContent, field: string, value: any, lang?: Language) => {
    try {
      let newData = { ...content[section] } as any;
      if (lang && typeof newData[field] === 'object' && newData[field] !== null) {
        newData[field] = { ...newData[field], [lang]: value };
      } else {
        newData[field] = value;
      }
      // Immediate optimistic update
      setContent(prev => ({ ...prev, [section]: newData }));
      await setDoc(doc(db, 'settings', section), newData, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `settings/${section}`); }
  };

  const updateTheme = async (colors: ThemeColors) => {
    try {
      setContent(prev => ({ ...prev, theme: colors }));
      await setDoc(doc(db, 'settings', 'theme'), colors, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/theme'); }
  };

  const addHeroSlide = async (slide: HeroSlide) => {
    try {
      const newSlides = [...content.hero.slides, slide];
      setContent(prev => ({ ...prev, hero: { ...prev.hero, slides: newSlides } }));
      await setDoc(doc(db, 'settings', 'hero'), { slides: newSlides }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/hero'); }
  };

  const updateHeroSlide = async (id: string, updatedSlide: HeroSlide) => {
    try {
      const newSlides = content.hero.slides.map(s => s.id === id ? updatedSlide : s);
      setContent(prev => ({ ...prev, hero: { ...prev.hero, slides: newSlides } }));
      await setDoc(doc(db, 'settings', 'hero'), { slides: newSlides }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/hero'); }
  };

  const deleteHeroSlide = async (id: string) => {
    try {
      const newSlides = content.hero.slides.filter(s => s.id !== id);
      setContent(prev => ({ ...prev, hero: { ...prev.hero, slides: newSlides } }));
      await setDoc(doc(db, 'settings', 'hero'), { slides: newSlides }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/hero'); }
  };

  const addArtItem = async (item: ArtItem) => {
    try {
      setContent(prev => ({ ...prev, arts: { ...prev.arts, items: [...prev.arts.items, item] } }));
      await setDoc(doc(db, 'arts', item.id), item);
    } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'arts'); }
  };

  const updateArtItem = async (id: string, updatedItem: ArtItem) => {
    try {
      setContent(prev => ({ ...prev, arts: { ...prev.arts, items: prev.arts.items.map(a => a.id === id ? updatedItem : a) } }));
      await setDoc(doc(db, 'arts', id), updatedItem as any, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'arts'); }
  };

  const deleteArtItem = async (id: string) => {
    try {
      setContent(prev => ({ ...prev, arts: { ...prev.arts, items: prev.arts.items.filter(a => a.id !== id) } }));
      await deleteDoc(doc(db, 'arts', id));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'arts'); }
  };

  const addTicket = async (item: TicketItem) => {
    try {
      const newItems = [...content.tickets.items, item];
      setContent(prev => ({ ...prev, tickets: { ...prev.tickets, items: newItems } }));
      await setDoc(doc(db, 'settings', 'tickets'), { items: newItems }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/tickets'); }
  };

  const updateTicket = async (id: string, updatedItem: TicketItem) => {
    try {
      const newItems = content.tickets.items.map(t => t.id === id ? updatedItem : t);
      setContent(prev => ({ ...prev, tickets: { ...prev.tickets, items: newItems } }));
      await setDoc(doc(db, 'settings', 'tickets'), { items: newItems }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/tickets'); }
  };

  const deleteTicket = async (id: string) => {
    try {
      const newItems = content.tickets.items.filter(t => t.id !== id);
      setContent(prev => ({ ...prev, tickets: { ...prev.tickets, items: newItems } }));
      await setDoc(doc(db, 'settings', 'tickets'), { items: newItems }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/tickets'); }
  };

  const addNavItem = async (item: NavItem) => {
    try {
      setNavItems(prev => [...prev, item]);
      await setDoc(doc(db, 'navItems', item.id), item);
    } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'navItems'); }
  };
  const updateNavItem = async (id: string, updated: NavItem) => {
    try {
      setNavItems(prev => prev.map(n => n.id === id ? updated : n));
      await setDoc(doc(db, 'navItems', id), updated as any, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'navItems'); }
  };
  const deleteNavItem = async (id: string) => {
    try {
      setNavItems(prev => prev.filter(n => n.id !== id));
      await deleteDoc(doc(db, 'navItems', id));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'navItems'); }
  };
  const reorderNavItems = (items: NavItem[]) => setNavItems(items); // Local only for now

  const reorderSections = async (order: SectionKey[]) => {
    setSectionOrder(order);
    try {
      await setDoc(doc(db, 'settings', 'layout'), {
        sections: order,
        visibility: sectionVisibility
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'settings/layout');
    }
  };

  const toggleSectionVisibility = async (key: SectionKey) => {
    const updated = {
      ...sectionVisibility,
      [key]: sectionVisibility[key] === false ? true : false
    };
    setSectionVisibility(updated);
    try {
      await setDoc(doc(db, 'settings', 'layout'), {
        sections: sectionOrder,
        visibility: updated
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'settings/layout');
    }
  };

  const saveLayout = async (order: SectionKey[], visibility: Record<SectionKey, boolean>) => {
    setSectionOrder(order);
    setSectionVisibility(visibility);
    try {
      await setDoc(doc(db, 'settings', 'layout'), {
        sections: order,
        visibility: visibility
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'settings/layout');
    }
  };

  const resetLayout = async () => {
    setSectionOrder(defaultSectionOrder);
    setSectionVisibility(defaultSectionVisibility);
    try {
      await setDoc(doc(db, 'settings', 'layout'), {
        sections: defaultSectionOrder,
        visibility: defaultSectionVisibility
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'settings/layout');
    }
  };

  const addAttraction = async (attraction: Attraction) => {
    try {
      setAttractions(prev => [...prev, attraction]);
      await setDoc(doc(db, 'attractions', attraction.id), attraction);
    } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'attractions'); }
  };
  const updateAttraction = async (id: string, updated: Attraction) => {
    try {
      setAttractions(prev => prev.map(a => a.id === id ? updated : a));
      await setDoc(doc(db, 'attractions', id), updated as any, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'attractions'); }
  };
  const deleteAttraction = async (id: string) => {
    try {
      setAttractions(prev => prev.filter(a => a.id !== id));
      await deleteDoc(doc(db, 'attractions', id));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'attractions'); }
  };

  const updateNewsConfig = (config: NewsConfig) => setNewsConfig(config);
  const addNews = async (item: NewsItem) => {
    try {
      setLocalNews(prev => [...prev, item]);
      setNews(prev => [...prev, item]);
      await setDoc(doc(db, 'news', item.id), item);
    } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'news'); }
  };
  const updateNews = async (id: string, updated: NewsItem) => {
    try {
      setLocalNews(prev => prev.map(n => n.id === id ? updated : n));
      setNews(prev => prev.map(n => n.id === id ? updated : n));
      await setDoc(doc(db, 'news', id), updated as any, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'news'); }
  };
  const deleteNews = async (id: string) => {
    try {
      setLocalNews(prev => prev.filter(n => n.id !== id));
      setNews(prev => prev.filter(n => n.id !== id));
      await deleteDoc(doc(db, 'news', id));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'news'); }
  };

  const addMuseum = async (item: MuseumItem) => {
    try {
      setMuseums(prev => [...prev, item]);
      await setDoc(doc(db, 'museums', item.id), item);
    } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'museums'); }
  };
  const updateMuseum = async (id: string, updated: MuseumItem) => {
    try {
      setMuseums(prev => prev.map(m => m.id === id ? updated : m));
      await setDoc(doc(db, 'museums', id), updated as any, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'museums'); }
  };
  const deleteMuseum = async (id: string) => {
    try {
      setMuseums(prev => prev.filter(m => m.id !== id));
      await deleteDoc(doc(db, 'museums', id));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'museums'); }
  };

  const addSocialLink = async (item: SocialLink) => {
    try {
      setSocialLinks(prev => [...prev, item]);
      await setDoc(doc(db, 'socialLinks', item.id), item);
    } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'socialLinks'); }
  };
  const updateSocialLink = async (id: string, updated: SocialLink) => {
    try {
      setSocialLinks(prev => prev.map(s => s.id === id ? updated : s));
      await setDoc(doc(db, 'socialLinks', id), updated as any, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'socialLinks'); }
  };
  const deleteSocialLink = async (id: string) => {
    try {
      setSocialLinks(prev => prev.filter(s => s.id !== id));
      await deleteDoc(doc(db, 'socialLinks', id));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'socialLinks'); }
  };

  const addExternalLink = async (item: ExternalLink) => {
    try {
      setExternalLinks(prev => [...prev, item]);
      await setDoc(doc(db, 'externalLinks', item.id), item);
    } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'externalLinks'); }
  };
  const updateExternalLink = async (id: string, updated: ExternalLink) => {
    try {
      setExternalLinks(prev => prev.map(l => l.id === id ? updated : l));
      await setDoc(doc(db, 'externalLinks', id), updated as any, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'externalLinks'); }
  };
  const deleteExternalLink = async (id: string) => {
    try {
      setExternalLinks(prev => prev.filter(l => l.id !== id));
      await deleteDoc(doc(db, 'externalLinks', id));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'externalLinks'); }
  };

  return (
    <DataContext.Provider value={{
      language, setLanguage, isAdminOpen, setIsAdminOpen, 
      selectedNewsId, setSelectedNewsId,
      isAuthenticated: !!currentUser, 
      currentUser, users, login, loginWithEmail, logout, addUser, updateUser, deleteUser, resetPassword,
      content, updateContent, updateTheme,
      addHeroSlide, updateHeroSlide, deleteHeroSlide,
      addTicket, updateTicket, deleteTicket,
      addArtItem, updateArtItem, deleteArtItem,
      navItems, addNavItem, updateNavItem, deleteNavItem, reorderNavItems,
      activeHeritageTab, setActiveHeritageTab,
      activeInfoTab, setActiveInfoTab,
      sectionOrder, sectionVisibility, reorderSections, toggleSectionVisibility, saveLayout, resetLayout,
      attractions, addAttraction, updateAttraction, deleteAttraction,
      news, newsConfig, updateNewsConfig, addNews, updateNews, deleteNews,
      museums, addMuseum, updateMuseum, deleteMuseum,
      socialLinks, addSocialLink, updateSocialLink, deleteSocialLink,
      externalLinks, addExternalLink, updateExternalLink, deleteExternalLink,
      visitorStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
