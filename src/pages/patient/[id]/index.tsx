import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import { encrypt } from '@/utils/helpers/crypto';
import { uuidToId } from '@/utils/helpers/uuid';

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { ParsedUrlQuery } from 'querystring';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
interface PatientProps {
  id: string;
}
interface Params extends ParsedUrlQuery {
  id: string; // Define that id will always be a string
}

const validIds = ['1', '2', '3', '4', '5', '6'];

// export const getStaticProps: GetStaticProps = getI18nStaticProps();
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = validIds.map((id) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
// Translation logic - end

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as Params;
  const patientId = uuidToId(id);

  // Check for valid ID
  if (!validIds.includes(patientId+'')) {
    // return {
    //   notFound: true, // Return a 404 if the ID is invalid
    // };
    return {
      redirect: {
        destination: '/_error', // Replace with your specific page path
        permanent: false, // Set to true if you want a permanent redirect (301)
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale || 'en', ['common'])), // Load translations for 'common'
      id,
    },
  };
};

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
