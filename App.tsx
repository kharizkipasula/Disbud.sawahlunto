
import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MuseumMap from './components/MuseumMap';
import ExternalPortals from './components/ExternalPortals';
import HeritageMain from './components/HeritageMain';
import ArtsSection from './components/ArtsSection';
import Attractions from './components/Attractions';
import Footer from './components/Footer';
import AiGuide from './components/AiGuide';
import HalloSawahlunto from './components/HalloSawahlunto';
import AdminPanel from './components/AdminPanel';
import NewsSection from './components/NewsSection';
import NewsDetail from './components/NewsDetail';
import InfoSection from './components/InfoSection';
import { DataProvider, useData } from './contexts/DataContext';

const ThemeManager: React.FC = () => {
  const { content } = useData();
  const theme = content.theme;

  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--color-primary', theme.primary);
      document.documentElement.style.setProperty('--color-secondary', theme.secondary);
      document.documentElement.style.setProperty('--color-background', theme.background);
      document.documentElement.style.setProperty('--color-dark', theme.dark);
    }
  }, [theme]);

  return null;
};

const AppContent: React.FC = () => {
  const { sectionOrder } = useData();

  const sectionComponents: Record<string, React.ReactNode> = {
    hero: <Hero key="hero" />,
    map: <MuseumMap key="map" />,
    portals: <ExternalPortals key="portals" />,
    heritage: <HeritageMain key="heritage" />,
    arts: <ArtsSection key="arts" />,
    news: <NewsSection key="news" />,
    attractions: <Attractions key="attractions" />,
    info: <InfoSection key="info" />
  };

  return (
    <div className="min-h-screen bg-heritage-stone font-sans">
      <ThemeManager />
      <Navbar />
      {sectionOrder.map(key => sectionComponents[key])}
      <Footer />
      <HalloSawahlunto />
      <AiGuide />
      <AdminPanel />
      <NewsDetail />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;
