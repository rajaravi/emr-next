import React from 'react';
import { useRouter } from 'next/router';
import SettingLayout from '@/components/layout/SettingLayout';
import styles from './_style.module.css';
// Translation logic - start
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

// Translation logic - end

const PatientType: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  return (
    <SettingLayout>
      <h1>Patient Type</h1>
      <p>This is the content for Patient Type.</p>
    </SettingLayout>
  );
};

export default PatientType;