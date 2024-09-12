import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import Header from '@/components/layout/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import '../styles/ckeditor-custom.css';

const EMRApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { pathname } = router;
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  const restrictedPathCommonHeader = ['/', '/login'];
  const isHeaderAllowed = !restrictedPathCommonHeader.includes(pathname);
  
  return (
    <>
      {isHeaderAllowed ? <Header /> : ''}
      <Component {...pageProps} />
    </>
  );

};

export default appWithTranslation(EMRApp);
