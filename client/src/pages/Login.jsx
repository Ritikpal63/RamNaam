import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setMessage(language === 'hi' ? (error.response?.data?.message || t('auth.loginFailed')) : t('auth.loginFailed'));
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="section-kicker">{t('auth.welcome')}</span>
        <h1>{t('auth.loginTitle')}</h1>
        <label>{t('auth.email')}<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>{t('auth.password')}<input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <button className="btn primary full">{t('auth.loginButton')}</button>
        {message && <p className="form-message">{message}</p>}
        <p>{t('auth.newAccount')} <Link to="/register">{t('common.register')}</Link></p>
      </form>
    </div>
  );
}
