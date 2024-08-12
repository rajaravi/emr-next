import React from 'react';
import styles from './_style.module.css';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface PatientProps {
  patientId: string,
}

const PatientHistory: React.FC<PatientProps> = ({ patientId }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <h1><span className={styles.textColor}>{t('PATIENT.SIDE_MENU.PATIENT_HISTORY')}</span> for Patient {patientId}</h1>
      <p>This is the content for Patient History.</p>
    </>
  );
};

export default PatientHistory;
