import '../styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';
import { Suspense } from 'react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const isPatientPage = router.pathname.startsWith('/patient/[id]');

  // if (isPatientPage) {
  //   const patientId = router.query.id as string;
  //   return (
  //     <PatientLayout patientId={patientId}>
  //       <Component {...pageProps} />
  //     </PatientLayout>
  //   );
  // }

  return <Component {...pageProps} />;
};

export default MyApp;
