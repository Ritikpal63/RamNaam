import { Images, MessageCircle, Music2, Newspaper } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MediaSection() {
  const { t } = useLanguage();
  return (
    <section id="gallery" className="section-shell lower-grid">
      <article className="panel media-card">
        <div className="panel-title"><Music2 size={20} /> {t('media.bhajan')}</div>
        <div className="media-placeholder"><div className="play">▶</div><span>{t('media.spiritual')}</span></div>
        <button className="btn primary full">{t('media.viewBhajan')}</button>
      </article>

      <article className="panel experience-card">
        <div className="panel-title"><MessageCircle size={20} /> {t('media.experience')}</div>
        <blockquote>{t('media.quote')}</blockquote>
        <p>{t('media.devoteeDelhi')}</p>
        <button className="btn secondary full">{t('media.viewExperiences')}</button>
      </article>

      <article className="panel gallery-card">
        <div className="panel-title"><Images size={20} /> {t('media.gallery')}</div>
        <div className="mini-gallery">{['ॐ', 'राम', '🚩', '🙏', '🪔', '🌺'].map((item, index) => <div key={index}>{item}</div>)}</div>
        <button className="btn secondary full">{t('media.viewMedia')}</button>
      </article>

      <article className="panel news-card">
        <div className="panel-title"><Newspaper size={20} /> {t('media.news')}</div>
        <div className="news-item"><b>{t('media.news1')}</b><span>{t('media.news1sub')}</span></div>
        <div className="news-item"><b>{t('media.news2')}</b><span>{t('media.news2sub')}</span></div>
        <button className="btn primary full">{t('media.viewNews')}</button>
      </article>
    </section>
  );
}
