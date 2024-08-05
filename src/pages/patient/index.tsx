import React from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import Header from '@/components/layout/Header';

const PatientIndex: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    // <PatientLayout patientId={id as string}>
    <div>
        <Header />
        <h1>Welcome, Patient Dashboard</h1>
        <p>This is the default content for the patient.</p>
      </div>
    // </PatientLayout>
  );
};

export default PatientIndex;
