import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', city: '', state: '', country: 'भारत', password: ''
  });
  const [message, setMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'पंजीकरण नहीं हो पाया।');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card wide" onSubmit={submit}>
        <span className="section-kicker">🌺 अभियान से जुड़ें</span>
        <h1>साधक पंजीकरण</h1>
        <div className="form-grid">
          <label>पूरा नाम<input name="fullName" required value={form.fullName} onChange={change} /></label>
          <label>मोबाइल<input name="mobile" required value={form.mobile} onChange={change} /></label>
          <label>ईमेल<input name="email" type="email" required value={form.email} onChange={change} /></label>
          <label>शहर<input name="city" value={form.city} onChange={change} /></label>
          <label>राज्य<input name="state" value={form.state} onChange={change} /></label>
          <label>देश<input name="country" value={form.country} onChange={change} /></label>
        </div>
        <label>पासवर्ड<input name="password" type="password" minLength="6" required value={form.password} onChange={change} /></label>
        <button className="btn primary full">पंजीकरण करें</button>
        {message && <p className="form-message">{message}</p>}
        <p>पहले से खाता है? <Link to="/login">लॉगिन करें</Link></p>
      </form>
    </div>
  );
}
