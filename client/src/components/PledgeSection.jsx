import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function PledgeSection() {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const cards = [
    ['11', t('pledge.days')], ['21', t('pledge.days')], ['40', t('pledge.days')],
    ['108', t('pledge.days')], ['1', t('pledge.lakh')], ['11', t('pledge.lakh')]
  ];
  const payloads = [
    { title: t('pledge.title11'), target: 1188, durationDays: 11 },
    { title: t('pledge.title21'), target: 2268, durationDays: 21 },
    { title: t('pledge.title40'), target: 4320, durationDays: 40 },
    { title: t('pledge.title108'), target: 11664, durationDays: 108 },
    { title: t('pledge.title1L'), target: 100000, durationDays: 365 },
    { title: t('pledge.title11L'), target: 1100000, durationDays: 1080 }
  ];

  const createPledge = async (index) => {
    if (!user) return setMessage(t('pledge.loginFirst'));
    try {
      const { data } = await api.post('/pledges', payloads[index]);
      setMessage(t('pledge.success', { id: data.pledge.sankalpId }));
    } catch (error) {
      setMessage(language === 'hi' ? (error.response?.data?.message || t('pledge.failed')) : t('pledge.failed'));
    }
  };

  return (
    <section id="pledge" className="section-shell pledge-section">
      <div className="pledge-intro">
        <span className="section-kicker">{t('pledge.kicker')}</span>
        <h2>{t('pledge.title')}</h2>
        <p>{t('pledge.description')}</p>
      </div>
      <div className="pledge-cards">
        {cards.map(([number, unit], index) => (
          <button className="pledge-card" onClick={() => createPledge(index)} key={`${index}-${number}-${unit}`}>
            <strong>{number}</strong>
            <span>{unit}</span>
            <small>{t('pledge.cardLabel')}</small>
            <em>{t('pledge.take')}</em>
          </button>
        ))}
      </div>
      {message && <p className="form-message centered">{message}</p>}
    </section>
  );
}
