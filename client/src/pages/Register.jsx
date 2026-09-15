import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Register() {
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', city: '', state: '', country: t('auth.india'), password: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    setForm((current) => {
      if (current.country === 'भारत' || current.country === 'India') return { ...current, country: t('auth.india') };
      return current;
    });
  }, [language, t]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (error) {
      setMessage(language === 'hi' ? (error.response?.data?.message || t('auth.registerFailed')) : t('auth.registerFailed'));
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card wide" onSubmit={submit}>
        <span className="section-kicker">{t('auth.join')}</span>
        <h1>{t('auth.registerTitle')}</h1>
        <div className="form-grid">
          <label>{t('auth.fullName')}<input name="fullName" required value={form.fullName} onChange={change} /></label>
          <label>{t('auth.mobile')}<input name="mobile" required value={form.mobile} onChange={change} /></label>
          <label>{t('auth.email')}<input name="email" type="email" required value={form.email} onChange={change} /></label>
          <label>{t('auth.city')}<input name="city" value={form.city} onChange={change} /></label>
          <label>{t('auth.state')}<input name="state" value={form.state} onChange={change} /></label>
          <label>{t('auth.country')}<input name="country" value={form.country} onChange={change} /></label>
        </div>
        <label>{t('auth.password')}<input name="password" type="password" minLength="6" required value={form.password} onChange={change} /></label>
        <button className="btn primary full">{t('common.register')}</button>
        {message && <p className="form-message">{message}</p>}
        <p>{t('auth.existing')} <Link to="/login">{t('common.login')}</Link></p>
      </form>
    </div>
  );
}
