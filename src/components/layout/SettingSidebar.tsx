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
            <i className="fi fi-rr-user-md"></i> {t('SETTING.SIDE_MENU.DOCTOR')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/contact`}
            className={`nav-link ${activeLink === `/settings/contact` ? 'active' : ''}`}>
            <i className="fi fi-tr-address-book"></i> {t('SETTING.SIDE_MENU.CONTACT')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/patient-category`}
            className={`nav-link ${activeLink === `/settings/patient-category` ? 'active' : ''}`}>
            <i className="fi fi-rr-user-gear"></i> {t('SETTING.SIDE_MENU.PATIENT_CATEGORY')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/procedure`}
            className={`nav-link ${activeLink === `/settings/procedure` ? 'active' : ''}`}>
            <i className="fi fi-rr-workflow-alt"></i> {t('SETTING.SIDE_MENU.PROCEDURE')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/facility`}
            className={`nav-link ${activeLink === `/settings/facility` ? 'active' : ''}`}>
            <i className="fi fi-rr-marker"></i> {t('SETTING.SIDE_MENU.FACILITY')}
          </Link>
        </li>        
        <li className="nav-item">
          <Link href={`/settings/appointment-service`}
            className={`nav-link ${activeLink === `/settings/appointment-service` ? 'active' : ''}`}>
            <i className="fi fi-rr-calendar-minus"></i> {t('SETTING.SIDE_MENU.APPOINTMENT_SERVICE')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/template`}
            className={`nav-link ${activeLink === `/settings/template` ? 'active' : ''}`}>
            <i className="fi fi-rr-file-word"></i> {t('SETTING.SIDE_MENU.TEMPLATE')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/consultant-hours`}
            className={`nav-link ${activeLink === `/settings/consultant-hours` ? 'active' : ''}`}>
            <i className="fi fi-rr-calendar-clock"></i> {t('SETTING.SIDE_MENU.CONSULTANT_HOURS')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/income-category`}
            className={`nav-link ${activeLink === `/settings/income-category` ? 'active' : ''}`}>
            <i className="fi fi-rs-category-alt"></i> {t('SETTING.SIDE_MENU.INCOME_CATEGORY')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/tax`}
            className={`nav-link ${activeLink === `/settings/tax` ? 'active' : ''}`}>
            <i className="fi fi-rr-calculator-math-tax"></i> {t('SETTING.SIDE_MENU.TAX')}
          </Link>
        </li>
        <hr />
        <li className="nav-item">
          <Link href={`/settings/speciality`}
            className={`nav-link ${activeLink === `/settings/speciality` ? 'active' : ''}`}>
            <i className="fi fi-rr-member-list"></i> {t('SETTING.SIDE_MENU.SPECIALITY')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/reference`}
            className={`nav-link ${activeLink === `/settings/reference` ? 'active' : ''}`}>
            <i className="fi fi-rr-refer-arrow"></i> {t('SETTING.SIDE_MENU.REFERENCE')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/purchaser`}
            className={`nav-link ${activeLink === `/settings/purchaser` ? 'active' : ''}`}>
            <i className="fi fi-rr-compliance-document"></i> {t('SETTING.SIDE_MENU.PURCHASER')}
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`/settings/purchaser-type`}
            className={`nav-link ${activeLink === `/settings/purchaser-type` ? 'active' : ''}`}>
            <i className="fi fi-rr-umbrella"></i> {t('SETTING.SIDE_MENU.PURCHASER_TYPE')}
          </Link>
        </li>        
        <li className="nav-item">
          <Link href={`/settings/user`}
            className={`nav-link ${activeLink === `/settings/user` ? 'active' : ''}`}>
            <i className="fi fi-rr-users"></i> {t('SETTING.SIDE_MENU.USER')}
          </Link>
        </li>
      </ul>
  </div>
  );
};

export default SettingSidebar;
