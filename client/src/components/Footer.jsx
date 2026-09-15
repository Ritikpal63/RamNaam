import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer id="contact" className="footer">
      <div className="footer-grid section-shell">
        <div>
          <h3>{t('footer.title')}</h3>
          <p>{t('footer.description')}</p>
          <strong>{t('footer.tagline')}</strong>
        </div>
        <div>
          <h4>{t('footer.quickLinks')}</h4>
          <a href="#write">{t('common.ramWriting')}</a>
          <a href="#pledge">{t('common.pledge')}</a>
          <a href="#sadhana">{t('common.dailySadhana')}</a>
          <a href="#events">{t('common.events')}</a>
        </div>
        <div>
          <h4>{t('footer.importantLinks')}</h4>
          <a href="#">{t('footer.privacy')}</a>
          <a href="#">{t('footer.terms')}</a>
          <a href="#">{t('footer.disclaimer')}</a>
          <a href="#contact">{t('footer.contactUs')}</a>
        </div>
        <div>
          <h4>{t('footer.contactUs')}</h4>
          <p>{t('footer.address')}</p>
          <p>{t('footer.phone')}</p>
          <p>{t('footer.email')}</p>
          <p>Facebook • Instagram • YouTube • WhatsApp</p>
        </div>
      </div>
      <div className="copyright">{t('footer.copyright')}</div>
    </footer>
  );
}
