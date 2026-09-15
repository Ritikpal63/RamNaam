import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
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
        <span className="section-kicker">🙏 मेरी साधना</span>
        <h1>{user?.fullName}, आपकी आध्यात्मिक प्रगति</h1>
      </div>

      <div className="dashboard-cards">
        {[
          ['आज', summary.todayCount || 0],
          ['कुल', summary.totalCount || 0],
          ['वर्तमान स्ट्रीक', `${summary.currentStreak || 0} दिन`],
          ['सबसे लंबी स्ट्रीक', `${summary.longestStreak || 0} दिन`]
        ].map(([label, value]) => (
          <article className="metric" key={label}>
            <span>{label}</span>
            <strong>{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</strong>
          </article>
        ))}
      </div>

      <section className="panel">
        <div className="panel-title">मेरे संकल्प</div>
        {data.pledges.length ? data.pledges.map((pledge) => (
          <div className="pledge-list-row" key={pledge.id}>
            <div><strong>{pledge.title}</strong><span>Sankalp ID: {pledge.sankalp_id}</span></div>
            <b>{Number(pledge.progress_count || 0).toLocaleString('en-IN')} / {Number(pledge.target_count).toLocaleString('en-IN')}</b>
          </div>
        )) : <p>अभी कोई सक्रिय संकल्प नहीं है। होम पेज से संकल्प लें।</p>}
      </section>
    </main>
  );
}
