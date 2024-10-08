import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface AccountSidebarProps {
  patientId: string;
}

const AccountSidebar: React.FC = () => {
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
          <Link href={`/accounts/invoice`}
            className={`nav-link ${activeLink === `/accounts/invoice` ? 'active' : ''}`} aria-current="page">
            {t('ACCOUNT.SIDE_MENU.INVOICE')}
          </Link>
        </li>
        <li>
          <Link href={`/accounts/receipt`}
            className={`nav-link ${activeLink === `/accounts/receipt` ? 'active' : ''}`}>
            {t('ACCOUNT.SIDE_MENU.RECEIPT')}
          </Link>
        </li>
        <li>
          <Link href={`/accounts/expenses`}
            className={`nav-link ${activeLink === `/accounts/expenses` ? 'active' : ''}`}>
            {t('ACCOUNT.SIDE_MENU.EXPENSES')}
          </Link>
        </li>
        <li>
          <Link href={`/accounts/claim`}
            className={`nav-link ${activeLink === `/accounts/claim` ? 'active' : ''}`}>
            {t('ACCOUNT.SIDE_MENU.CLAIM')}
          </Link>
        </li>
        <li>
          <Link href={`/accounts/editor`}
            className={`nav-link ${activeLink === `/accounts/editor` ? 'active' : 'link-dark'}`}>
            {t('ACCOUNT.SIDE_MENU.EDITOR')}
          </Link>
        </li>
        <li>
          <Link href={`/accounts/documents`}
            className={`nav-link ${activeLink === `/accounts/documents` ? 'active' : 'link-dark'}`}>
            {t('ACCOUNT.SIDE_MENU.DOCUMENTS')}
          </Link>
        </li>
      </ul>
  </div>
  );
};

export default AccountSidebar;
