import { GraduationCap, HeartHandshake, Stethoscope, Trees, Wheat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SevaSection() {
  const { t } = useLanguage();
  const services = [
    [Wheat, t('seva.food')],
    [GraduationCap, t('seva.education')],
    [Stethoscope, t('seva.medical')],
    [Trees, t('seva.trees')],
    [HeartHandshake, t('seva.other')]
  ];

  return (
    <section id="seva" className="section-shell panel seva">
      <div className="section-heading">
        <span className="section-kicker">{t('seva.kicker')}</span>
        <h2>{t('seva.title')}</h2>
        <p>{t('seva.description')}</p>
      </div>
      <div className="seva-grid">
        {services.map(([Icon, label]) => <div key={label}><Icon size={30} /><strong>{label}</strong></div>)}
      </div>
      <a className="btn primary" href="#contact">{t('seva.contribute')}</a>
    </section>
  );
}
