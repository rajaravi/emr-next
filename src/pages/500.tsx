import { FC } from 'react';
import Link from 'next/link';
import styles from '../styles/404.module.css';

// Translation logic - start
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Custom500: FC = () => {
  return (
    <div className={styles.container}>
      <h1>500 - Server-side Error</h1>
      <p>Sorry, something went wrong on our end.</p>
      <Link href="/patient">
        Go back home
      </Link>
    </div>
  );
};

export default Custom500;
