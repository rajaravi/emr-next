import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface PatientSidebarProps {
  patientId: string;
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({ patientId }) => {
  const { t } = useTranslation('common');

  const router = useRouter();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(router.asPath);
  }, [router.asPath]);
  
  return (
    <div className="sidebar">
      <ul className="nav nav-pills flex-column">
        <li className="nav-item">
          <Link href={`/patient/${patientId}/patient-details`}
            className={`nav-link ${activeLink === `/patient/${patientId}/patient-details` ? 'active' : ''}`} aria-current="page">
            <i className="fi fi-rr-member-list"></i> {t('PATIENT.SIDE_MENU.PATIENT_DETAILS')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/encounter`}
            className={`nav-link ${activeLink === `/patient/${patientId}/encounter` ? 'active' : ''}`}>
            <i className="fi fi-br-layers"></i> {t('PATIENT.SIDE_MENU.ENCOUNTER')}            
          </Link>
        </li>
        <li className="nav-item d-none">
          <Link href={`/patient/${patientId}/patient-history`}
            className={`nav-link ${activeLink === `/patient/${patientId}/patient-history` ? 'active' : ''}`}>
            <i className="fi fi-br-rectangle-vertical-history"></i> {t('PATIENT.SIDE_MENU.PATIENT_HISTORY')}            
          </Link>
        </li>
        <li className="nav-item d-none">
          <Link href={`/patient/${patientId}/examination`}
            className={`nav-link ${activeLink === `/patient/${patientId}/examination` ? 'active' : ''}`}>
            <i className="fi fi-rr-mobile"></i> {t('PATIENT.SIDE_MENU.EXAMINATION')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/soap-notes`}
            className={`nav-link ${activeLink === `/patient/${patientId}/soap-notes` ? 'active' : ''}`}>
            <i className="fi fi-rr-edit"></i> {t('PATIENT.SIDE_MENU.SOAP_NOTES')} <span>3</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/appointment`}
            className={`nav-link ${activeLink === `/patient/${patientId}/appointment` ? 'active' : ''}`}>
            <i className="fi fi-rs-time-watch-calendar"></i> {t('PATIENT.SIDE_MENU.APPOINTMENT')} <span>1</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/surgery`}
            className={`nav-link ${activeLink === `/patient/${patientId}/surgery` ? 'active' : ''}`}>
            <i className="fi fi-rr-scalpel-path"></i> {t('PATIENT.SIDE_MENU.SURGERY')} <span>1</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/invoice`}
            className={`nav-link ${activeLink === `/patient/${patientId}/invoice` ? 'active' : ''}`}>
            <i className="fi fi-rr-file-invoice"></i> {t('PATIENT.SIDE_MENU.INVOICE')} <span>2</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/receipt`}
            className={`nav-link ${activeLink === `/patient/${patientId}/receipt` ? 'active' : ''}`}>
            <i className="fi fi-rr-receipt"></i> {t('PATIENT.SIDE_MENU.RECEIPT')} <span>1</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/letter`}
            className={`nav-link ${activeLink === `/patient/${patientId}/letter` ? 'active' : ''}`}>
            <i className="fi fi-rr-envelope-open-text"></i> {t('PATIENT.SIDE_MENU.LETTERS')} <span>2</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/scan`}
            className={`nav-link ${activeLink === `/patient/${patientId}/scan` ? 'active' : ''}`}>
            <i className="fi fi-br-qr-scan"></i> {t('PATIENT.SIDE_MENU.SCAN_DOCS')} <span>1</span>
          </Link>
        </li>
        <li className="nav-item d-none">
          <Link href={`/patient/${patientId}/prescription`}
            className={`nav-link ${activeLink === `/patient/${patientId}/prescription` ? 'active' : ''}`}>
            <i className="fi fi-rr-file-prescription"></i> {t('PATIENT.SIDE_MENU.PRESCRIPTION')} <span>0</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/forms`}
            className={`nav-link ${activeLink === `/patient/${patientId}/forms` ? 'active' : ''}`}>
            <i className="fi fi-rr-form"></i> {t('PATIENT.SIDE_MENU.FORMS')} <span>4</span>
          </Link>
        </li>        
        <li className="nav-item d-none">
          <Link href={`/patient/${patientId}/scan`}
            className={`nav-link ${activeLink === `/patient/${patientId}/scan` ? 'active' : ''}`}>
            <i className="fi fi-rr-scanner-image"></i> {t('PATIENT.SIDE_MENU.SCAN_DOCS')} <span>1</span>
          </Link>
        </li>        
        <li className="nav-item">
          <Link href={`/patient/${patientId}/notes`}
            className={`nav-link ${activeLink === `/patient/${patientId}/notes` ? 'active' : ''}`}>
            <i className="fi fi-rr-journal-alt"></i> {t('PATIENT.SIDE_MENU.NOTES')} <span>3</span>
          </Link>
        </li>
      </ul>
  </div>
  );
};

export default PatientSidebar;
