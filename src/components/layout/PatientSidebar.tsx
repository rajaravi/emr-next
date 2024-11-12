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
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link href={`/patient/${patientId}/patient-details`}
            className={`nav-link ${activeLink === `/patient/${patientId}/patient-details` ? 'active' : ''}`} aria-current="page">
            <i className="fi fi-rr-member-list"></i> {t('PATIENT.SIDE_MENU.PATIENT_DETAILS')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/patient-history`}
            className={`nav-link ${activeLink === `/patient/${patientId}/patient-history` ? 'active' : ''}`}>
            <i className="fi fi-rs-user-time"></i> {t('PATIENT.SIDE_MENU.PATIENT_HISTORY')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/examination`}
            className={`nav-link ${activeLink === `/patient/${patientId}/examination` ? 'active' : ''}`}>
            <i className="fi fi-ts-file-invoice"></i> {t('PATIENT.SIDE_MENU.EXAMINATION')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/patient/${patientId}/appointment`}
            className={`nav-link ${activeLink === `/patient/${patientId}/appointment` ? 'active' : ''}`}>
            <i className="fi fi-rs-time-watch-calendar"></i> {t('PATIENT.SIDE_MENU.APPOINTMENT')}
          </Link>
        </li>
        <li>
          <Link href={`/patient/${patientId}/notes`}
            className={`nav-link ${activeLink === `/patient/${patientId}/notes` ? 'active' : ''}`}>
            {t('PATIENT.SIDE_MENU.NOTES')}
          </Link>
        </li>
      </ul>
  </div>
  );
};

export default PatientSidebar;
