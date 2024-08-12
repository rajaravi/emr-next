import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export const getI18nStaticProps = (namespaces: string[] = ['common']): GetStaticProps => {
  return async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale!, namespaces)),
    },
  });
};
