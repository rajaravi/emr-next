// src/components/layout/Header.tsx
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faWallet, faInbox, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const Header: React.FC = () => {
  return (
    <nav className={`navbar navbar-expand-lg navbar-dark ${styles.navbar}`}>
      <div className="container-fluid">
        <a className={`navbar-brand ${styles.navbarBrand}`} href="#">EMR</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
              <Link href="/patient" className={`nav-link ${styles.navLink}`}>
                <FontAwesomeIcon icon={faUser} /> Patient
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/calendar" className={`nav-link ${styles.navLink}`}>
                <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/accounts" className={`nav-link ${styles.navLink}`}>
                <FontAwesomeIcon icon={faWallet} /> Accounts
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/tray" className={`nav-link ${styles.navLink}`}>
                <FontAwesomeIcon icon={faInbox} /> Tray
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
