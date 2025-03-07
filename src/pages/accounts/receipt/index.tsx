import React from 'react';
import { useRouter } from 'next/router';
import styles from './_style.module.css';
// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import AccountLayout from '@/components/layout/AccountLayout';

export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Receipt: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  return (
    <AccountLayout>
      <h1 className="mb-3 module-title"><i className="fi fi-rr-receipt"></i> {t('ACCOUNT.SIDE_MENU.RECEIPT')}</h1>
      <p>This is the content for Receipt.</p>
    </AccountLayout>
  );
};

export default Receipt;
