// src/pages/patient/[id]/menu1.tsx
import React, { Suspense } from 'react';
import Loader from '@/components/common/Loader';

const PatientDetailsComponent = React.lazy(() => import('./patient-details'));

const PatientDetailsIndex = () => {
  return (
    <Suspense fallback={<Loader />}>
      <PatientDetailsComponent />
    </Suspense>
  );
};

export default PatientDetailsIndex;
