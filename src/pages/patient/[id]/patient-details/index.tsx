// src/pages/patient/[id]/menu1.tsx
import React, { Suspense } from 'react';
import Loader from '@/components/suspense/Loader';
// import Skeleton from '@/components/suspense/Skeleton';
import PatientLayout from '@/components/layout/PatientLayout';
import { useRouter } from 'next/router';
import { uuidToId } from '@/utils/helpers/uuid';

// Translation logic - start
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface PatientDetailsProps {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  console.log("🚀 ~ constgetServerSideProps:GetServerSideProps= ~ id:", id)
  // const patientId = uuidToId(id)?.toString(); // Ensure it's always a string

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

const PatientDetailsComponent = React.lazy(() => import('./patient-details'));

const PatientDetailsIndex: React.FC<PatientDetailsProps> = ({ id }) => {
  
  return (
    // <Suspense fallback={<Skeleton />}>
      <PatientLayout patientId={id as string}>
        <PatientDetailsComponent patientId={id as string} />
      </PatientLayout>
    // </Suspense>
  );
};

export default PatientDetailsIndex;

