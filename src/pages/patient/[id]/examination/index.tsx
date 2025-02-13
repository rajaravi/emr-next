import React, { Suspense } from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import styles from './_style.module.css';

// Translation logic - start
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Skeleton from '@/components/suspense/Skeleton';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  if (!id) {
    return {
      notFound: true, // Show 404 if patient ID is invalid
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(context.locale || 'en', ['common'])), // Ensure 'common' namespace exists
      id: id, // Pass a valid string
    },
  };
};
// Translation logic - end

const Examination: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  return (
    <Suspense fallback={<Skeleton />}>
      <PatientLayout patientId={id as string}>
        <h1><span className={styles.textColor}>{t('PATIENT.SIDE_MENU.EXAMINATION')}</span> for Patient {id}</h1>
        <p>This is the content for Examination.</p>
      </PatientLayout>
    </Suspense>
  );
};

export default Examination;
