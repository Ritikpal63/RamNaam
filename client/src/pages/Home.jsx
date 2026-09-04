import { useEffect, useState } from 'react';
import api from '../api';
import Hero from '../components/Hero';
import StatsStrip from '../components/StatsStrip';
import RamNaamWriter from '../components/RamNaamWriter';
import PledgeSection from '../components/PledgeSection';
import { AboutPurpose, DailySadhana, GalleryNews, Seva } from '../components/ContentSections';
import Footer from '../components/Footer';

export default function Home() {
  const [stats, setStats] = useState({});
  useEffect(() => {
    api.get('/public/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);
  return <main>
    <Hero />
    <StatsStrip stats={stats} />
    <AboutPurpose />
    <RamNaamWriter />
    <PledgeSection />
    <DailySadhana />
    <Seva />
    <GalleryNews />
    <section className="section-shell final-cta">
      <span>🌸 आज का संदेश</span>
      <h2>“राम नाम को अपने दिन का एक छोटा, लेकिन नियमित हिस्सा बनाइए।”</h2>
      <p>11 राम नाम से शुरुआत करें, 108 राम नाम का संकल्प लें या अपना बड़ा लक्ष्य निर्धारित करें।</p>
      <div><a className="btn primary" href="#write">राम नाम लिखना शुरू करें</a><a className="btn secondary" href="#pledge">संकल्प लें</a></div>
    </section>
    <Footer />
  </main>;
}
