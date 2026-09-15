import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HeartHandshake, Languages, LogOut, Menu, PenLine, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const links = [
    ['/', t('common.home')],
    ['/#write', t('common.ramWriting')],
    ['/#pledge', t('common.pledge')],
    ['/#sadhana', t('common.dailySadhana')],
    ['/#seva', t('common.seva')],
    ['/#events', t('common.events')],
    ['/#gallery', t('common.gallery')],
    ['/#contact', t('common.contact')]
  ];

  return (
    <header className="site-header">
      <div className="topbar">
        <div>{t('header.mantra')}</div>
        <div className="topbar-right">✉ info@ramnaamabhiyan.com   ☎ +91 12345 67890</div>
      </div>

      <div className="nav-wrap">
        <Link className="brand" to="/">
          <div className="brand-mark">राम</div>
          <div>
            <strong>{t('header.brand')}</strong>
            <span>{t('header.subtitle')}</span>
          </div>
        </Link>

        <div className="header-actions-mobile">
          <div className="language-switcher" aria-label="Language selector">
            <Languages size={17} />
            <button className={language === 'hi' ? 'active' : ''} type="button" onClick={() => setLanguage('hi')}>HI</button>
            <span>/</span>
            <button className={language === 'en' ? 'active' : ''} type="button" onClick={() => setLanguage('en')}>EN</button>
          </div>
          <button className="menu-btn" onClick={() => setOpen((v) => !v)} aria-label={t('header.menu')}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        <nav className={open ? 'main-nav open' : 'main-nav'}>
          {links.map(([url, label]) =>
            url.startsWith('/#') ? (
              <a href={url.slice(1)} onClick={() => setOpen(false)} key={url}>{label}</a>
            ) : (
              <NavLink to={url} onClick={() => setOpen(false)} key={url}>{label}</NavLink>
            )
          )}

          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}>
                <UserRound size={19} /> {t('common.mySadhana')}
              </Link>
              <button className="nav-logout" onClick={() => { logout(); setOpen(false); }}>
                <LogOut size={18} /> {t('common.logout')}
              </button>
            </>
          ) : (
            <Link className="nav-login" to="/login" onClick={() => setOpen(false)}>{t('common.login')}</Link>
          )}

          <div className="language-switcher desktop-language-switcher" aria-label="Language selector">
            <Languages size={17} />
            <button className={language === 'hi' ? 'active' : ''} type="button" onClick={() => setLanguage('hi')}>HI</button>
            <span>/</span>
            <button className={language === 'en' ? 'active' : ''} type="button" onClick={() => setLanguage('en')}>EN</button>
          </div>
        </nav>
      </div>

      <div className="quick-strip">
        <span><PenLine size={18} /> {t('header.writeRam')}</span>
        <span><HeartHandshake size={18} /> {t('header.devotion')}</span>
      </div>
    </header>
  );
}
