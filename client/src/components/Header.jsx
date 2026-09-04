import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, HeartHandshake, PenLine, LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/', 'होम'],
  ['/#write', 'राम नाम लेखन'],
  ['/#pledge', 'संकल्प'],
  ['/#sadhana', 'दैनिक साधना'],
  ['/#seva', 'सेवा'],
  ['/#events', 'कार्यक्रम'],
  ['/#gallery', 'गैलरी'],
  ['/#contact', 'संपर्क']
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="topbar">
        <div>॥ श्री राम जय राम जय जय राम ॥</div>
        <div className="topbar-right">✉ info@ramnaamabhiyan.com &nbsp; ☎ +91 12345 67890</div>
      </div>
      <div className="nav-wrap">
        <Link className="brand" to="/">
          <div className="brand-mark">राम</div>
          <div>
            <strong>श्री राम नाम लेखन अभियान</strong>
            <span>बाबा नीम करौली महाराज की प्रेरणा से</span>
          </div>
        </Link>
        <button className="menu-btn" onClick={() => setOpen(v => !v)} aria-label="मेनू">
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'main-nav open' : 'main-nav'}>
          {links.map(([to, label]) =>
            to.startsWith('/#') ? (
              <a key={to} href={to.slice(1)} onClick={() => setOpen(false)}>{label}</a>
            ) : (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>
            )
          )}
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}>
                <UserRound size={19} /> मेरी साधना
              </Link>
              <button className="nav-logout" onClick={() => { logout(); setOpen(false); }}><LogOut size={18}/> लॉगआउट</button>
            </>
          ) : (
            <Link className="nav-login" to="/login" onClick={() => setOpen(false)}>लॉगिन</Link>
          )}
        </nav>
      </div>
      <div className="quick-strip">
        <span><PenLine size={18}/> राम नाम लिखें</span>
        <span><HeartHandshake size={18}/> भक्ति • साधना • सेवा</span>
      </div>
    </header>
  );
}
