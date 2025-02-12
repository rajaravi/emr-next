import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import { encrypt } from '@/utils/helpers/crypto';
import { uuidToId } from '@/utils/helpers/uuid';

// Translation logic - start
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { ParsedUrlQuery } from 'querystring';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
interface PatientProps {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  
  // Convert UUID to numeric ID
  const patientId = uuidToId(id)?.toString();

  // Check if patient ID is valid
  if (!patientId) {
    return {
      notFound: true, // Show a 404 page
    };
  }

  // Fetch patient data (Replace with real API/database call)
  // const patientExists = await getPatientById(patientId); 

  // if (!patientExists) {
  //   return { notFound: true }; // Show 404 if patient doesn't exist
  // }

  return {
    props: {
      ...(await serverSideTranslations(context.locale || 'en', ['common'])), // Load translations
      id,
      patientId
    },
  };
};

const PatientIndex: React.FC<PatientProps & { patientId: string }> = ({ id, patientId }) => {
  const { t } = useTranslation('common');

  return (
    <PatientLayout patientId={id as string}>
      <div>
        <h1>{t('PATIENT.PATIENT_DASHBOARD')},</h1>
        <h1>{id}: {patientId} </h1>
        <p>This is the default content for the patient.</p>
      </div>
    </PatientLayout>
  );
};

export default PatientIndex;
