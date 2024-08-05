import React from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import styles from './_style.module.css';

const PatientHistory: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PatientLayout patientId={id as string}>
      <h1><span className={styles.textColor}>Patient History</span> for Patient {id}</h1>
      <p>This is the content for Patient History.</p>
    </PatientLayout>
  );
};

export default PatientHistory;
