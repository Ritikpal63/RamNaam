import { useEffect, useState } from 'react';
import api from '../api/client';
import AboutPurpose from '../components/AboutPurpose';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import MediaSection from '../components/MediaSection';
import PledgeSection from '../components/PledgeSection';
import RamNaamWriter from '../components/RamNaamWriter';
import SadhanaEvents from '../components/SadhanaEvents';
import SevaSection from '../components/SevaSection';
import StatsStrip from '../components/StatsStrip';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const [stats, setStats] = useState({});
  const { t } = useLanguage();

  useEffect(() => {
    api.get('/public/stats').then((response) => setStats(response.data)).catch(() => {});
  }, []);

  return (
    <main>
      <Hero />
      <StatsStrip stats={stats} />
      <AboutPurpose />
      <RamNaamWriter />
      <PledgeSection />
      <SadhanaEvents />
      <SevaSection />
      <MediaSection />

      <section className="section-shell final-cta">
        <span>{t('home.message')}</span>
        <h2>{t('home.quote')}</h2>
        <p>{t('home.quoteSub')}</p>
        <div>
          <a className="btn primary" href="#write">{t('hero.start')}</a>
          <a className="btn secondary" href="#pledge">{t('home.takePledge')}</a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
