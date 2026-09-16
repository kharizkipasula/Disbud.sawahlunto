
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Attraction, SiteContent, Language, NewsItem, NewsConfig, MuseumItem, SocialLink, ExternalLink, NavItem, SectionKey, User, TicketItem, HeroSlide, ArtItem, ThemeColors } from '../types';
import { fetchNewsFromSheet } from '../services/googleSheets';
import { db, auth, handleFirestoreError, OperationType } from '../src/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

interface DataContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (isOpen: boolean) => void;
  
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
  reorderSections: (order: SectionKey[]) => void;

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
    sectionTitle: { en: 'Arts & Performance', id: 'Seni & Pertunjukan' },
    description: {
       en: 'Sawahlunto is a melting pot of cultures, giving birth to unique arts ranging from traditional Minangkabau performances to multicultural multicultural acculturation.',
       id: 'Sawahlunto adalah kuali peleburan budaya, melahirkan kesenian unik mulai dari pertunjukan tradisional Minangkabau hingga akulturasi multikultural.'
    },
    items: [
        {
            id: '1',
            title: { en: 'Randai', id: 'Randai' },
            description: { en: 'Traditional Minangkabau folk theater combining martial arts, dance, and drama.', id: 'Teater rakyat tradisional Minangkabau yang menggabungkan silat, tari, dan drama.' },
            imageUrl: 'https://picsum.photos/400/300?random=art1'
        },
        {
            id: '2',
            title: { en: 'Kuda Kepang', id: 'Kuda Kepang' },
            description: { en: 'A traditional Javanese dance depicting a group of horsemen, reflecting the multicultural history of Sawahlunto.', id: 'Tarian tradisional Jawa yang menggambarkan sekelompok prajurit berkuda, mencerminkan sejarah multikultural Sawahlunto.' },
            imageUrl: 'https://picsum.photos/400/300?random=art2'
        },
        {
            id: '3',
            title: { en: 'Tari Piring', id: 'Tari Piring' },
            description: { en: 'The Plate Dance, a dynamic traditional dance where dancers hold plates in their hands.', id: 'Tari Piring, tarian tradisional dinamis di mana penari memegang piring di tangan mereka.' },
            imageUrl: 'https://picsum.photos/400/300?random=art3'
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
  { id: 'arts', label: { en: 'Arts', id: 'Kesenian' }, href: '#arts' },
  { id: 'destinations', label: { en: 'Destinations', id: 'Destinasi' }, href: '#destinations' },
  { id: 'tickets', label: { en: 'Tickets', id: 'Tiket' }, href: '#info' },
  { id: 'news', label: { en: 'News', id: 'Berita' }, href: '#news' },
  { id: 'info', label: { en: 'Info', id: 'Info' }, href: '#info' },
  { id: 'contact', label: { en: 'Contact', id: 'Kontak' }, href: '#footer' },
];

const defaultSocials: SocialLink[] = [
  { id: '1', platform: 'Instagram', url: 'https://instagram.com' },
  { id: '2', platform: 'Facebook', url: 'https://facebook.com' },
  { id: '3', platform: 'Twitter', url: 'https://twitter.com' },
  { id: '4', platform: 'Youtube', url: 'https://youtube.com' }
];

const defaultMuseums: MuseumItem[] = [
  {
    id: 'mbah-soero',
    name: { en: 'Mbah Soero Tunnel', id: 'Lubang Mbah Soero' },
    description: { en: 'Historic coal mining tunnel.', id: 'Terowongan tambang batubara bersejarah.' },
    embedQuery: 'Lubang+Tambang+Mbah+Soero',
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
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>([
    'hero', 'map', 'portals', 'heritage', 'arts', 'news', 'attractions', 'info'
  ]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsConfig, setNewsConfig] = useState<NewsConfig>({ source: 'local', sheetUrl: '' });
  const [museums, setMuseums] = useState<MuseumItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

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
    const settingsKeys = ['branding', 'hero', 'history', 'culture', 'organization', 'tickets', 'contact', 'theme', 'arts'] as const;
    const unsubSettings = settingsKeys.map(key => 
      onSnapshot(doc(db, 'settings', key), (docSnap) => {
        if (docSnap.exists()) {
          setContent(prev => ({ ...prev, [key]: { ...prev[key as keyof SiteContent], ...docSnap.data() } }));
        } else if (currentUser?.role === 'admin') {
          // Seed default content if not exists and user is admin
          setDoc(doc(db, 'settings', key), defaultContent[key as keyof SiteContent]).catch(e => console.error("Failed to seed settings", e));
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
            id: '1',
            title: { en: 'Lubang Mbah Soero', id: 'Lubang Mbah Soero' },
            category: 'History',
            description: { en: 'Explore the historic underground coal mining tunnel.', id: 'Jelajahi terowongan tambang batubara bersejarah.' },
            imageUrl: 'https://picsum.photos/600/400?random=1'
          },
          {
            id: '2',
            title: { en: 'Museum Goedang Ransoem', id: 'Museum Goedang Ransoem' },
            category: 'History',
            description: { en: 'The former public kitchen complex.', id: 'Kompleks dapur umum masa lampau.' },
            imageUrl: 'https://picsum.photos/600/400?random=2'
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

    return () => {
      unsubSettings.forEach(unsub => unsub());
      unsubNews();
      unsubAttractions();
      unsubMuseums();
      unsubSocials();
      unsubExternal();
      unsubNav();
      unsubArts();
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
      if (lang && typeof newData[field] === 'object') {
        newData[field] = { ...newData[field], [lang]: value };
      } else {
        newData[field] = value;
      }
      await setDoc(doc(db, 'settings', section), newData, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, `settings/${section}`); }
  };

  const updateTheme = async (colors: ThemeColors) => {
    try {
      await setDoc(doc(db, 'settings', 'theme'), colors, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/theme'); }
  };

  const addHeroSlide = async (slide: HeroSlide) => {
    try {
      const newSlides = [...content.hero.slides, slide];
      await setDoc(doc(db, 'settings', 'hero'), { slides: newSlides }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/hero'); }
  };

  const updateHeroSlide = async (id: string, updatedSlide: HeroSlide) => {
    try {
      const newSlides = content.hero.slides.map(s => s.id === id ? updatedSlide : s);
      await setDoc(doc(db, 'settings', 'hero'), { slides: newSlides }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/hero'); }
  };

  const deleteHeroSlide = async (id: string) => {
    try {
      const newSlides = content.hero.slides.filter(s => s.id !== id);
      await setDoc(doc(db, 'settings', 'hero'), { slides: newSlides }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/hero'); }
  };

  const addArtItem = async (item: ArtItem) => {
    try { await setDoc(doc(db, 'arts', item.id), item); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'arts'); }
  };

  const updateArtItem = async (id: string, updatedItem: ArtItem) => {
    try { await updateDoc(doc(db, 'arts', id), updatedItem as any); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'arts'); }
  };

  const deleteArtItem = async (id: string) => {
    try { await deleteDoc(doc(db, 'arts', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'arts'); }
  };

  const addTicket = async (item: TicketItem) => {
    try {
      const newItems = [...content.tickets.items, item];
      await setDoc(doc(db, 'settings', 'tickets'), { items: newItems }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/tickets'); }
  };

  const updateTicket = async (id: string, updatedItem: TicketItem) => {
    try {
      const newItems = content.tickets.items.map(t => t.id === id ? updatedItem : t);
      await setDoc(doc(db, 'settings', 'tickets'), { items: newItems }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/tickets'); }
  };

  const deleteTicket = async (id: string) => {
    try {
      const newItems = content.tickets.items.filter(t => t.id !== id);
      await setDoc(doc(db, 'settings', 'tickets'), { items: newItems }, { merge: true });
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'settings/tickets'); }
  };

  const addNavItem = async (item: NavItem) => {
    try { await setDoc(doc(db, 'navItems', item.id), item); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'navItems'); }
  };
  const updateNavItem = async (id: string, updated: NavItem) => {
    try { await updateDoc(doc(db, 'navItems', id), updated as any); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'navItems'); }
  };
  const deleteNavItem = async (id: string) => {
    try { await deleteDoc(doc(db, 'navItems', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'navItems'); }
  };
  const reorderNavItems = (items: NavItem[]) => setNavItems(items); // Local only for now
  const reorderSections = (order: SectionKey[]) => setSectionOrder(order);

  const addAttraction = async (attraction: Attraction) => {
    try { await setDoc(doc(db, 'attractions', attraction.id), attraction); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'attractions'); }
  };
  const updateAttraction = async (id: string, updated: Attraction) => {
    try { await updateDoc(doc(db, 'attractions', id), updated as any); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'attractions'); }
  };
  const deleteAttraction = async (id: string) => {
    try { await deleteDoc(doc(db, 'attractions', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'attractions'); }
  };

  const updateNewsConfig = (config: NewsConfig) => setNewsConfig(config);
  const addNews = async (item: NewsItem) => {
    try { await setDoc(doc(db, 'news', item.id), item); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'news'); }
  };
  const updateNews = async (id: string, updated: NewsItem) => {
    try { await updateDoc(doc(db, 'news', id), updated as any); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'news'); }
  };
  const deleteNews = async (id: string) => {
    try { await deleteDoc(doc(db, 'news', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'news'); }
  };

  const addMuseum = async (item: MuseumItem) => {
    try { await setDoc(doc(db, 'museums', item.id), item); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'museums'); }
  };
  const updateMuseum = async (id: string, updated: MuseumItem) => {
    try { await updateDoc(doc(db, 'museums', id), updated as any); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'museums'); }
  };
  const deleteMuseum = async (id: string) => {
    try { await deleteDoc(doc(db, 'museums', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'museums'); }
  };

  const addSocialLink = async (item: SocialLink) => {
    try { await setDoc(doc(db, 'socialLinks', item.id), item); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'socialLinks'); }
  };
  const updateSocialLink = async (id: string, updated: SocialLink) => {
    try { await updateDoc(doc(db, 'socialLinks', id), updated as any); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'socialLinks'); }
  };
  const deleteSocialLink = async (id: string) => {
    try { await deleteDoc(doc(db, 'socialLinks', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'socialLinks'); }
  };

  const addExternalLink = async (item: ExternalLink) => {
    try { await setDoc(doc(db, 'externalLinks', item.id), item); } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'externalLinks'); }
  };
  const updateExternalLink = async (id: string, updated: ExternalLink) => {
    try { await updateDoc(doc(db, 'externalLinks', id), updated as any); } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'externalLinks'); }
  };
  const deleteExternalLink = async (id: string) => {
    try { await deleteDoc(doc(db, 'externalLinks', id)); } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'externalLinks'); }
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
      sectionOrder, reorderSections,
      attractions, addAttraction, updateAttraction, deleteAttraction,
      news, newsConfig, updateNewsConfig, addNews, updateNews, deleteNews,
      museums, addMuseum, updateMuseum, deleteMuseum,
      socialLinks, addSocialLink, updateSocialLink, deleteSocialLink,
      externalLinks, addExternalLink, updateExternalLink, deleteExternalLink
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
