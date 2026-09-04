import { useEffect, useState } from 'react';
import api from '../api';

export default function Admin(){
 const [d,setD]=useState({}); useEffect(()=>{api.get('/admin/overview').then(r=>setD(r.data)).catch(()=>{});},[]);
 return <main className="dashboard-page section-shell"><div className="page-heading"><span className="section-kicker">Admin Panel</span><h1>अभियान प्रबंधन</h1></div><div className="dashboard-cards">{[['कुल साधक',d.totalUsers||0],['कुल राम नाम',d.totalRamNames||0],['आज के राम नाम',d.todayRamNames||0],['सक्रिय संकल्प',d.activePledges||0],['आगामी कार्यक्रम',d.upcomingEvents||0],['लंबित अनुभव',d.pendingExperiences||0]].map(x=><article className="metric" key={x[0]}><span>{x[0]}</span><strong>{Number(x[1]).toLocaleString('en-IN')}</strong></article>)}</div><section className="panel"><div className="panel-title">Admin Modules</div><div className="admin-module-grid">{['User Management','Ram Naam Verification','Pledge Management','Events','Daily Sadhana CMS','Gallery','News / Blog','Certificates','Volunteer / Seva','Audit Logs'].map(x=><div key={x}>{x}</div>)}</div></section></main>
}
