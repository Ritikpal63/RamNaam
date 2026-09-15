import { useLanguage } from '../context/LanguageContext';

export default function SadhanaEvents() {
  const { t } = useLanguage();
  const events = [
    ['25', t('events.groupWriting'), t('events.morning')],
    ['25', t('events.sundarkand'), t('events.afternoon')],
    ['26', t('events.hanumanChalisa'), t('events.evening')]
  ];

  return (
    <section id="sadhana" className="section-shell content-row">
      <article className="panel illustrated-card">
        <div>
          <span className="section-kicker">{t('sadhana.kicker')}</span>
          <h2>{t('sadhana.title')}</h2>
          <ul>
            <li>{t('sadhana.ramNaam')}</li>
            <li>{t('sadhana.hanumanChalisa')}</li>
            <li>{t('sadhana.mantra')}</li>
            <li>{t('sadhana.sundarkand')}</li>
            <li>{t('sadhana.bhajan')}</li>
          </ul>
        </div>
        <div className="symbol-circle">🚩</div>
      </article>

      <article id="events" className="panel event-card">
        <div className="panel-title">{t('events.today')}</div>
        {events.map((event) => (
          <div className="event-row" key={event[1]}>
            <b>{event[0]}<small>{t('events.sep')}</small></b>
            <span><strong>{event[1]}</strong><small>{event[2]} • {t('events.online')}</small></span>
          </div>
        ))}
      </article>
    </section>
  );
}
