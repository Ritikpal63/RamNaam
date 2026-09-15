import { useEffect, useState } from 'react';
import api from '../api/client';

export default function AdminDashboard() {
  const [overview, setOverview] = useState({});

  useEffect(() => {
    api.get('/admin/overview').then((response) => setOverview(response.data)).catch(() => {});
  }, []);

  return (
    <main className="dashboard-page section-shell">
      <div className="page-heading">
        <span className="section-kicker">Admin Panel</span>
        <h1>अभियान प्रबंधन</h1>
      </div>

      <div className="dashboard-cards">
        {[
          ['कुल साधक', overview.totalUsers || 0],
          ['कुल राम नाम', overview.totalRamNames || 0],
          ['आज के राम नाम', overview.todayRamNames || 0],
          ['सक्रिय संकल्प', overview.activePledges || 0],
          ['आगामी कार्यक्रम', overview.upcomingEvents || 0],
          ['लंबित अनुभव', overview.pendingExperiences || 0]
        ].map(([label, value]) => (
          <article className="metric" key={label}>
            <span>{label}</span>
            <strong>{Number(value).toLocaleString('en-IN')}</strong>
          </article>
        ))}
      </div>

      <section className="panel">
        <div className="panel-title">Admin Modules</div>
        <div className="admin-module-grid">
          {['User Management', 'Ram Naam Verification', 'Pledge Management', 'Events', 'Daily Sadhana CMS', 'Gallery', 'News / Blog', 'Certificates', 'Volunteer / Seva', 'Audit Logs'].map((module) => <div key={module}>{module}</div>)}
        </div>
      </section>
    </main>
  );
}
