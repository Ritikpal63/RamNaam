import { useEffect, useState } from 'react';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function AdminDashboard() {
  const [overview, setOverview] = useState({});
  const { t, locale } = useLanguage();

  useEffect(() => {
    api.get('/admin/overview').then((response) => setOverview(response.data)).catch(() => {});
  }, []);

  const modules = [
    t('admin.userManagement'), t('admin.verification'), t('admin.pledgeManagement'), t('admin.events'),
    t('admin.sadhanaCms'), t('admin.gallery'), t('admin.news'), t('admin.certificates'), t('admin.volunteer'), t('admin.audit')
  ];

  return (
    <main className="dashboard-page section-shell">
      <div className="page-heading">
        <span className="section-kicker">{t('admin.panel')}</span>
        <h1>{t('admin.title')}</h1>
      </div>

      <div className="dashboard-cards">
        {[
          [t('admin.totalUsers'), overview.totalUsers || 0],
          [t('admin.totalRam'), overview.totalRamNames || 0],
          [t('admin.todayRam'), overview.todayRamNames || 0],
          [t('admin.activePledges'), overview.activePledges || 0],
          [t('admin.upcomingEvents'), overview.upcomingEvents || 0],
          [t('admin.pendingExperiences'), overview.pendingExperiences || 0]
        ].map(([label, value]) => (
          <article className="metric" key={label}>
            <span>{label}</span>
            <strong>{Number(value).toLocaleString(locale)}</strong>
          </article>
        ))}
      </div>

      <section className="panel">
        <div className="panel-title">{t('admin.modules')}</div>
        <div className="admin-module-grid">{modules.map((module) => <div key={module}>{module}</div>)}</div>
      </section>
    </main>
  );
}
