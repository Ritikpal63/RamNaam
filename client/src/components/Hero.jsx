import { Flower2, PenLine } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const [line1, line2] = t('hero.title').split('\n');
  return (
    <section className="hero section-shell">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-content">
        <div className="eyebrow"><Flower2 size={20} /> {t('hero.eyebrow')}</div>
        <h1>{line1}<br />{line2}</h1>
        <p>{t('hero.description')}</p>
        <div className="hero-actions">
          <a className="btn primary" href="#write"><PenLine size={20} /> {t('hero.start')}</a>
          <a className="btn secondary" href="#pledge">{t('hero.takePledge')}</a>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="sun-disc">श्री<br />राम</div>
        <div className="temple-shape"><span>ॐ</span></div>
      </div>
    </section>
  );
}
