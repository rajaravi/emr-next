import React from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import styles from './_style.module.css';

const Examination: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PatientLayout patientId={id as string}>
      <h1><span className={styles.textColor}>Examination</span> for Patient {id}</h1>
      <p>This is the content for Examination.</p>
    </PatientLayout>
  );
};

export default Examination;
