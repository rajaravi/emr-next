import React, { Suspense } from 'react';
import Loader from './Loader'; // This line is optional if you're using CSS modules for styling

const withSuspense = (WrappedComponent: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<Loader />}>
    <WrappedComponent {...props} />
  </Suspense>
  );
};

export default withSuspense;
