import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import Header from '@/components/layout/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';

const EMRApp = ({ Component, pageProps }: AppProps) => {
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );

};

export default appWithTranslation(EMRApp);
