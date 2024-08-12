import React from 'react';
import Link from 'next/link';
import { Row } from 'react-bootstrap';
import { useRouter } from 'next/router';

import { idToUuid } from '@/utils/helpers/uuid';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

const PatientIndex: React.FC = () => {
  const { t } = useTranslation('common');
  // const router = useRouter();
  // const { id } = router.query;

  // TODO: convert patiend ID selected from the datatable
  const patientId = 62; // 62: e1195a2c-5150-4173-82e1-e0e6377c086d // Testing purpose
  const uuid = idToUuid(patientId).toString();
  console.log("🚀 ~ uuid:", patientId, uuid);

  return (
    <div>
      <Row>
        <h1>{t('welcome')}</h1>
        <p>This is the default content for the patient.</p>
      </Row>
      <Link href={`/patient/create`} suppressHydrationWarning>Add Patient</Link>
      <br />
      <Link href={`/patient/${uuid}`} suppressHydrationWarning>Edit Patient</Link>
    </div>
  );
};

export default PatientIndex;
