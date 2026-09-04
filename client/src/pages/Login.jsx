import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault(); setMsg('');
    try { const u = await login(form); nav(u.role === 'admin' ? '/admin' : '/dashboard'); }
    catch (e) { setMsg(e.response?.data?.message || 'लॉगिन नहीं हो पाया।'); }
  };
  return <div className="auth-page"><form className="auth-card" onSubmit={submit}><span className="section-kicker">🙏 स्वागत है</span><h1>साधक लॉगिन</h1><label>ईमेल<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>पासवर्ड<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label><button className="btn primary full">लॉगिन करें</button>{msg&&<p className="form-message">{msg}</p>}<p>नया खाता? <Link to="/register">पंजीकरण करें</Link></p></form></div>;
}
