import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import { encrypt } from '@/utils/helpers/crypto';
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


interface PatientProps {
  id: string;
}

const PatientIndex: React.FC<PatientProps> = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { id } = router.query;
  const patientId = uuidToId(id);

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
