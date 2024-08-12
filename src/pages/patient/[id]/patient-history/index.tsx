import React, { Suspense } from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import styles from './_style.module.css';
import Loader from '@/components/common/Loader';
import { uuidToId } from '@/utils/helpers/uuid';

const PatientHistoryComponent = React.lazy(() => import('./patient-history'));
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

const PatientHistory: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const patientId = uuidToId(id);

  return (
    <Suspense fallback={<Loader />}>
      <PatientLayout patientId={id as string}>
        <PatientHistoryComponent patientId={id as string} />
      </PatientLayout>
    </Suspense>
  );
};

export default PatientHistory;
