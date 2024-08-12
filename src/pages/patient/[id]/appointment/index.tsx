import React from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import styles from './_style.module.css';
// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';

export const getStaticProps: GetStaticProps = getI18nStaticProps();
export const getStaticPaths: GetStaticPaths = async () => {
  // Hardcode some IDs
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ];

  return {
    paths,
    fallback: true, // or 'blocking'
  };
};
// Translation logic - end

const Appointment: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  return (
    <PatientLayout patientId={id as string}>
      <h1><span className={styles.textColor}>{t('PATIENT.SIDE_MENU.APPOINTMENT')}</span> for Patient {id}</h1>
      <p>This is the content for Appointment.</p>
    </PatientLayout>
  );
};

export default Appointment;
