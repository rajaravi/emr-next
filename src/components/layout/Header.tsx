import Link from 'next/link';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faCalendarAlt, faWallet, faInbox, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Header: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isActive = (path: string) => router.asPath.startsWith(path);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear auth token
    router.push('/login'); // Redirect to login page
  };
  
  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar} fixed-top`}>
      <div className="container-fluid">
        <a className={`navbar-brand ${styles.navbarBrand}`} href="#"><img src='https://acumensoftwares.com/img/vard-logo.png' alt="Vard" height="65" /></a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>     
        <div className='common-search'>
          <InputGroup className="mb-0">
            <Form.Control
              placeholder="Global Search"
            />
            <Button className="btn rounded-0"><i className="fi fi-bs-search"></i></Button>
          </InputGroup>
        </div>   
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/patient" className={`nav-link ${isActive('/patient') ? 'active' : ''} `}>
                <i className="fi fi-bs-user-injured"></i> {t('MENU.MENU_PATIENT')}
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/calendar" className={`nav-link ${isActive('/calendar') ? 'active' : ''} `}>
                <i className="fi fi-rr-calendar-day"></i> {t('MENU.MENU_CALENDAR')}
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/accounts/invoice" className={`nav-link ${isActive('/accounts') ? 'active' : ''} `}>
                <i className="fi fi-rs-calculator-money"></i> {t('MENU.MENU_ACCOUNT')}
              </Link>
            </li>
            <li className="nav-item d-none">
              <Link href="/tray" className={`nav-link ${isActive('/tray') ? 'active' : ''} `}>
                <i className="fi fi-rr-drawer-empty"></i> {t('MENU.MENU_TRAY')}
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/settings/doctor" className={`nav-link ${isActive('/settings') ? 'active' : ''} `}>
                <i className="fi fi-rr-settings"></i> {t('MENU.MENU_SETTING')}
              </Link>
            </li>
            <li className="nav-item d-none">
              <Link href="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''} `}>
                <i className="fi fi-rs-newspaper"></i> {t('MENU.MENU_REPORT')}
              </Link>
            </li>

            {/* Profile Menu */}
            <li className="nav-item dropdown">
              <button
                className={`nav-link dropdown-toggle ${styles.navLink}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
              >
                <i className="fi fi-rr-user"></i> {t('MENU.MENU_PROFILE')}
              </button>
              {menuOpen && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      {t('MENU.MENU_LOGOUT')}
                    </button>
                  </li>
                </ul>
              )}
            </li>
            
          </ul>
        </div>
        <div className='text-danger notify'><i className="fi fi-rs-bell-notification-social-media"></i></div>
      </div>
    </nav>
  );
};

export default Header;
