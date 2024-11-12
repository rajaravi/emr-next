import React, { Suspense } from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import styles from './_style.module.css';

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import Skeleton from '@/components/suspense/Skeleton';

export const getStaticProps: GetStaticProps = getI18nStaticProps();
export const getStaticPaths: GetStaticPaths = async () => {
  // Hardcode some IDs
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ];
  console.log("Rendering delayed content..."); 
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    paths,
    fallback: true, // or 'blocking'
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
