import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard(){
 const {user}=useAuth(); const [data,setData]=useState({summary:{},pledges:[]});
 useEffect(()=>{Promise.all([api.get('/ramnaam/me'),api.get('/pledges/me')]).then(([a,b])=>setData({summary:a.data,pledges:b.data.pledges||[]})).catch(()=>{});},[]);
 const s=data.summary;
 return <main className="dashboard-page section-shell"><div className="page-heading"><span className="section-kicker">🙏 मेरी साधना</span><h1>{user?.fullName}, आपकी आध्यात्मिक प्रगति</h1></div><div className="dashboard-cards">{[['आज',s.todayCount||0],['कुल',s.totalCount||0],['वर्तमान स्ट्रीक',`${s.currentStreak||0} दिन`],['सबसे लंबी स्ट्रीक',`${s.longestStreak||0} दिन`]].map(x=><article className="metric" key={x[0]}><span>{x[0]}</span><strong>{typeof x[1]==='number'?x[1].toLocaleString('en-IN'):x[1]}</strong></article>)}</div><section className="panel"><div className="panel-title">मेरे संकल्प</div>{data.pledges.length?data.pledges.map(p=><div className="pledge-list-row" key={p.id}><div><strong>{p.title}</strong><span>Sankalp ID: {p.sankalp_id}</span></div><b>{Number(p.progress_count||0).toLocaleString('en-IN')} / {Number(p.target_count).toLocaleString('en-IN')}</b></div>):<p>अभी कोई सक्रिय संकल्प नहीं है। होम पेज से संकल्प लें।</p>}</section></main>
}
