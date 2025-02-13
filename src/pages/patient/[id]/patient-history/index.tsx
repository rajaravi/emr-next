import React, { Suspense } from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import styles from './_style.module.css';
import Loader from '@/components/suspense/Loader';
import { uuidToId } from '@/utils/helpers/uuid';

const PatientHistoryComponent = React.lazy(() => import('./patient-history'));
// Translation logic - start
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

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
