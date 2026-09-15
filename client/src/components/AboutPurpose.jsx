import { BookOpen, CalendarDays, HeartHandshake, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPurpose() {
  const { t } = useLanguage();
  return (
    <section className="section-shell about-purpose">
      <span className="section-kicker">{t('about.kicker')}</span>
      <h2>{t('about.title')}</h2>
      <p>{t('about.description')}</p>
      <div className="purpose-grid">
        <span><BookOpen /> {t('about.daily')}</span>
        <span><HeartHandshake /> {t('about.seva')}</span>
        <span><CalendarDays /> {t('about.pledge')}</span>
        <span><MessageCircle /> {t('about.share')}</span>
      </div>
    </section>
  );
}
