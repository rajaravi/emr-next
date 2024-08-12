// src/pages/patient/[id]/menu1.tsx
import React, { Suspense } from 'react';
import Loader from '@/components/common/Loader';
import PatientLayout from '@/components/layout/PatientLayout';
import { useRouter } from 'next/router';
import { uuidToId } from '@/utils/helpers/uuid';

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

const PatientDetailsComponent = React.lazy(() => import('./patient-details'));

const PatientDetailsIndex = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const patientId = uuidToId(id);
  
  return (
    <Suspense fallback={<Loader />}>
      <PatientLayout patientId={id as string}>
        <PatientDetailsComponent patientId={id as string} />
      </PatientLayout>
    </Suspense>
  );
};

export default PatientDetailsIndex;

