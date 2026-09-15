import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, locale } = useLanguage();
  const [data, setData] = useState({ summary: {}, pledges: [] });

  useEffect(() => {
    Promise.all([api.get('/ramnaam/me'), api.get('/pledges/me')])
      .then(([summaryResponse, pledgeResponse]) => setData({
        summary: summaryResponse.data,
        pledges: pledgeResponse.data.pledges || []
      }))
      .catch(() => {});
  }, []);

  const summary = data.summary;

  return (
    <main className="dashboard-page section-shell">
      <div className="page-heading">
        <span className="section-kicker">{t('dashboard.kicker')}</span>
        <h1>{t('dashboard.progress', { name: user?.fullName || '' })}</h1>
      </div>

      <div className="dashboard-cards">
        {[
          [t('dashboard.today'), summary.todayCount || 0],
          [t('dashboard.total'), summary.totalCount || 0],
          [t('dashboard.currentStreak'), t('dashboard.days', { count: summary.currentStreak || 0 })],
          [t('dashboard.longestStreak'), t('dashboard.days', { count: summary.longestStreak || 0 })]
        ].map(([label, value]) => (
          <article className="metric" key={label}>
            <span>{label}</span>
            <strong>{typeof value === 'number' ? value.toLocaleString(locale) : value}</strong>
          </article>
        ))}
      </div>

      <section className="panel">
        <div className="panel-title">{t('dashboard.myPledges')}</div>
        {data.pledges.length ? data.pledges.map((pledge) => (
          <div className="pledge-list-row" key={pledge.id}>
            <div><strong>{pledge.title}</strong><span>{t('dashboard.sankalpId')}: {pledge.sankalp_id}</span></div>
            <b>{Number(pledge.progress_count || 0).toLocaleString(locale)} / {Number(pledge.target_count).toLocaleString(locale)}</b>
          </div>
        )) : <p>{t('dashboard.noPledge')}</p>}
      </section>
    </main>
  );
}
