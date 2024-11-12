import Link from 'next/link';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faCalendarAlt, faWallet, faInbox, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'next-i18next';

const Header: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container-fluid">
        <a className={`navbar-brand ${styles.navbarBrand}`} href="#"><img src='https://acumensoftwares.com/img/vard-logo.png' alt="VARD" height="50" /></a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/patient" className={`nav-link ${styles.navLink}`}>
                <i className="fi fi-bs-user-injured"></i> {t('MENU.MENU_PATIENT')}
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/calendar" className={`nav-link ${styles.navLink}`}>
                <i className="fi fi-rr-calendar-day"></i> {t('MENU.MENU_CALENDAR')}
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/accounts/invoice" className={`nav-link ${styles.navLink}`}>
                <i className="fi fi-rr-calculator-math-tax"></i> {t('MENU.MENU_ACCOUNT')}
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/tray" className={`nav-link ${styles.navLink}`}>
                <i className="fi fi-rr-drawer-empty"></i> {t('MENU.MENU_TRAY')}
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/settings/doctor" className={`nav-link ${styles.navLink}`}>
                <i className="fi fi-rr-settings"></i> {t('MENU.MENU_SETTING')}
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/reports" className={`nav-link ${styles.navLink}`}>
                <i className="fi fi-rs-newspaper"></i> {t('MENU.MENU_REPORT')}
              </Link>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
