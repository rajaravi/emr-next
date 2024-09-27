// pages/_error.tsx
import { NextPageContext } from 'next';
import Link from 'next/link';
import styles from '../styles/404.module.css';
// Translation logic - start
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

interface ErrorPageProps {
  statusCode?: number;
}

const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>{statusCode ? `${statusCode} - Error` : 'An error occurred'}</h1>
      <p>
        {statusCode === 404
          ? "Oops! The page you're looking for can't be found."
          : 'Something went wrong on our end.'}
      </p>
      <Link href="/">
        Go back home
      </Link>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;
  return { statusCode };
};

export default ErrorPage;
