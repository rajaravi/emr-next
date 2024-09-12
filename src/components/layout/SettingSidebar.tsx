import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';


const SettingSidebar : React.FC = () => {
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
          <Link href={`/settings/doctor`}
            className={`nav-link ${activeLink === `/settings/doctor` ? 'active' : ''}`} aria-current="page">
            {t('SETTING.SIDE_MENU.DOCTOR')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/speciality`}
            className={`nav-link ${activeLink === `/settings/speciality` ? 'active' : ''}`}>
            {t('SETTING.SIDE_MENU.SPECIALITY')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/reference`}
            className={`nav-link ${activeLink === `/settings/reference` ? 'active' : ''}`}>
            {t('SETTING.SIDE_MENU.REFERENCE')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/location`}
            className={`nav-link ${activeLink === `/settings/location` ? 'active' : ''}`}>
            {t('SETTING.SIDE_MENU.LOCATION')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/purchaser`}
            className={`nav-link ${activeLink === `/settings/purchaser` ? 'active' : ''}`}>
            {t('SETTING.SIDE_MENU.PURCHASER')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/purchaser-type`}
            className={`nav-link ${activeLink === `/settings/purchaser-type` ? 'active' : ''}`}>
            {t('SETTING.SIDE_MENU.PURCHASER_TYPE')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/patient-type`}
            className={`nav-link ${activeLink === `/settings/patient-type` ? 'active' : ''}`}>
            {t('SETTING.SIDE_MENU.PATIENT_TYPE')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/user`}
            className={`nav-link ${activeLink === `/settings/user` ? 'active' : ''}`}>
            {t('SETTING.SIDE_MENU.USER')}
          </Link>
        </li>        
      </ul>
  </div>
  );
};

export default SettingSidebar;
