import React from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';

const PatientIndex: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PatientLayout patientId={id as string}>
      <div>
        <h1>Welcome, Patient {id}</h1>
        <p>This is the default content for the patient.</p>
      </div>
    </PatientLayout>
  );
};

export default PatientIndex;
