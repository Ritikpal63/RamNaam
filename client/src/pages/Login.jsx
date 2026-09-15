import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'लॉगिन नहीं हो पाया।');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="section-kicker">🙏 स्वागत है</span>
        <h1>साधक लॉगिन</h1>
        <label>
          ईमेल
          <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label>
          पासवर्ड
          <input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        <button className="btn primary full">लॉगिन करें</button>
        {message && <p className="form-message">{message}</p>}
        <p>नया खाता? <Link to="/register">पंजीकरण करें</Link></p>
      </form>
    </div>
  );
}
