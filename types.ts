
export type Language = 'en' | 'id';

export interface LocalizedText {
  en: string;
  id: string;
}

export interface Branding {
  logoUrl: string;
  siteName: string;
  subTitle: string;
}

export interface ThemeColors {
  primary: string; 
  secondary: string; 
  background: string; 
  dark: string; 
}

export interface SocialLink {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'Twitter' | 'Youtube' | 'TikTok' | 'Website' | 'Email' | 'Phone';
  url: string;
}

export interface ExternalLink {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  url: string;
  imageUrl: string;
  buttonText: LocalizedText;
}

export interface NewsItem {
  id: string;
  title: LocalizedText;
  date: string;
  summary: LocalizedText;
  content: LocalizedText;
  imageUrl: string;
  imageUrls?: string[];
}

export interface NewsConfig {
  source: 'local' | 'google_sheet';
  sheetUrl: string;
}

export interface TicketPrice {
  id: string;
  category: LocalizedText;
  price: number;
}

export interface MuseumItem {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  embedQuery: string;
  streetViewUrl?: string;
  ticketPrices: TicketPrice[];
  contactName?: string;
  contactPhone?: string;
  vision?: LocalizedText;
  mission?: LocalizedText;
}

export interface TicketItem {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  price: number;
  imageUrl: string;
}

export interface TicketInfo {
  openingHours: LocalizedText;
  items: TicketItem[];
}

export interface OrganizationInfo {
  vision: LocalizedText;
  mission: LocalizedText;
  profile: LocalizedText;
  structureImageUrl: string;
}

export interface ContactInfo {
  mapEmbedUrl: string;
  address: string;
  phone: string;
  email: string;
}

export interface Attraction {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
  category: 'History' | 'Nature' | 'Culture';
}

export interface HeroSlide {
  id: string;
  subtitle: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  cta: LocalizedText;
  bgImageUrl: string;
}

export interface ArtItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
}

export interface SiteContent {
  branding: Branding;
  theme: ThemeColors;
  hero: {
    slides: HeroSlide[];
  };
  history: {
    sectionTitle: LocalizedText;
    title: LocalizedText;
    description1: LocalizedText;
    description2: LocalizedText;
    linkUrl: string;
    imageUrl: string;
  };
  culture: {
    sectionTitle: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    linkUrl: string;
    imageUrl: string;
  };
  arts: {
    sectionTitle: LocalizedText;
    description: LocalizedText;
    items: ArtItem[];
  };
  tickets: TicketInfo;
  organization: OrganizationInfo;
  contact: ContactInfo;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  imageUrl?: string;
}

export interface NavItem {
  id: string;
  label: LocalizedText;
  href: string;
}

export type SectionKey = 'hero' | 'map' | 'portals' | 'heritage' | 'arts' | 'news' | 'attractions' | 'info';

export type UserRole = 'super_admin' | 'editor';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
}
