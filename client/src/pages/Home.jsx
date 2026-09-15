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

export default function Home() {
  const [stats, setStats] = useState({});

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
        <span>🌸 आज का संदेश</span>
        <h2>“राम नाम को अपने दिन का एक छोटा, लेकिन नियमित हिस्सा बनाइए।”</h2>
        <p>11 राम नाम से शुरुआत करें, 108 राम नाम का संकल्प लें या अपना बड़ा लक्ष्य निर्धारित करें।</p>
        <div>
          <a className="btn primary" href="#write">राम नाम लिखना शुरू करें</a>
          <a className="btn secondary" href="#pledge">संकल्प लें</a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
